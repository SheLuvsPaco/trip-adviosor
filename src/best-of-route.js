export const BEST_OF_TRAVELERS = ['sheluvspaco', 'viki', 'gora', 'stivka'];

export const BEST_OF_DEFAULTS = Object.freeze({
  dailyDriveHardCapMinutes: 210,
  dailyBaselineTargetMinutes: 210,
  trafficBufferMultiplier: 1.2,
  topRatingThreshold: 4,
  minimumCandidateCount: 22,
  maxCandidatePool: 600,
  perDayCandidateLimit: 10,
  maxStopsPerDay: 5,
  routeBeamWidth: 64,
  dayBeamWidth: 28,
  firstDayStartMinute: 11 * 60 + 30,
  dayStartMinute: 8 * 60 + 30,
  dayEndMinute: 22 * 60,
  roadFactor: 1.12,
  assumedRoadMph: 55,
});

function routePackage(entry) {
  return entry.route?.route ? entry.route : entry;
}

function routeId(entry) {
  return entry.id || routePackage(entry).route.id;
}

function routeName(entry) {
  return entry.name || routePackage(entry).route.name;
}

function placesFor(entry) {
  return entry.places?.places || entry.places || [];
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function ratingKey(route, place, traveler) {
  return `${route}:${place}:${traveler}`;
}

function ratingsIndex(ratingRows) {
  const index = new Map();
  for (const row of ratingRows || []) {
    const score = Number(row.score);
    if (!BEST_OF_TRAVELERS.includes(row.traveler_id) || score < 1 || score > 5) continue;
    index.set(ratingKey(row.route_id, row.place_id, row.traveler_id), score);
  }
  return index;
}

function fallbackTravelerScore(place, traveler) {
  const researched = Number(place.researcher_person_fit?.[traveler]);
  if (researched >= 1 && researched <= 5) return researched;
  if ((place.best_for || []).includes(traveler)) return 4.25;
  if ((place.secondary_for || []).includes(traveler)) return 3.75;
  if (place.priority === 'anchor') return 4;
  if (place.priority === 'strong') return 3.75;
  if (place.priority === 'optional') return 3.25;
  return 3.5;
}

function effectiveTravelerScore(index, route, place, traveler) {
  const gradedScore = index.get(ratingKey(route, place.id, traveler));
  return gradedScore == null
    ? { value: fallbackTravelerScore(place, traveler), source: 'curated-fallback' }
    : { value: gradedScore, source: 'traveler-rating' };
}

function routeScore(entry, index) {
  const route = routePackage(entry);
  const places = placesFor(entry);
  const id = routeId(entry);
  const coreIds = route.core_place_ids?.length
    ? route.core_place_ids
    : places.filter((place) => place.included_in_magic_score).map((place) => place.id);
  const travelerAverages = {};
  let missing = 0;
  let rated = 0;

  for (const traveler of BEST_OF_TRAVELERS) {
    const scores = [];
    for (const placeId of coreIds) {
      const place = places.find((candidate) => candidate.id === placeId);
      if (!place) continue;
      const score = effectiveTravelerScore(index, id, place, traveler);
      if (score.source === 'traveler-rating') rated += 1;
      else missing += 1;
      scores.push(score.value);
    }
    travelerAverages[traveler] = average(scores);
  }

  const completeScores = Object.values(travelerAverages).filter((score) => score != null);
  const required = coreIds.length * BEST_OF_TRAVELERS.length;
  return {
    id,
    name: routeName(entry),
    complete: missing === 0 && completeScores.length === BEST_OF_TRAVELERS.length,
    rated_ratings: rated,
    required_ratings: required,
    coverage_percent: required ? Math.round((rated / required) * 100) : 0,
    missing_ratings: missing,
    core_place_count: coreIds.length,
    group_average: completeScores.length === BEST_OF_TRAVELERS.length ? average(completeScores) : null,
    fairness_floor: completeScores.length === BEST_OF_TRAVELERS.length ? Math.min(...completeScores) : null,
    traveler_averages: travelerAverages,
    baseline_miles: Number(route.route.baseline_total_miles || entry.miles || 0),
  };
}

export function assessAtlasGrading(routes, ratingRows) {
  const index = ratingsIndex(ratingRows);
  const requirements = new Set();

  for (const entry of routes) {
    const id = routeId(entry);
    for (const place of placesFor(entry)) {
      for (const traveler of BEST_OF_TRAVELERS) requirements.add(ratingKey(id, place.id, traveler));
    }
  }

  let completed = 0;
  for (const key of requirements) if (index.has(key)) completed += 1;

  const routeScores = routes.map((entry) => routeScore(entry, index));
  const rankedRoutes = routeScores
    .filter((entry) => entry.group_average != null)
    .sort((a, b) => (
      b.group_average - a.group_average
      || b.fairness_floor - a.fairness_floor
      || b.coverage_percent - a.coverage_percent
      || a.baseline_miles - b.baseline_miles
      || a.id.localeCompare(b.id)
    ));
  const coreComplete = routeScores.every((entry) => entry.complete);

  return {
    completed_ratings: completed,
    required_ratings: requirements.size,
    missing_ratings: requirements.size - completed,
    completion_percent: requirements.size ? Math.round((completed / requirements.size) * 100) : 0,
    complete: completed === requirements.size,
    core_complete: coreComplete,
    ready_to_generate: Boolean(rankedRoutes[0]),
    scoring_mode: completed === requirements.size ? 'traveler-ratings-only' : 'partial-ratings-with-curated-fallbacks',
    winner: rankedRoutes[0] || null,
    route_scores: routeScores,
  };
}

function normalizedName(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function canonicalSpotKey(place) {
  const [longitude = 0, latitude = 0] = place.coordinates || [];
  return `${normalizedName(place.name)}|${round(longitude, 1)}|${round(latitude, 1)}`;
}

function candidatePool(routes, ratingRows, config) {
  const index = ratingsIndex(ratingRows);
  const grouped = new Map();

  for (const entry of routes) {
    const id = routeId(entry);
    for (const place of placesFor(entry)) {
      const scores = Object.fromEntries(BEST_OF_TRAVELERS.map((traveler) => [
        traveler,
        effectiveTravelerScore(index, id, place, traveler),
      ]));
      const key = canonicalSpotKey(place);
      if (!grouped.has(key)) grouped.set(key, { key, occurrences: [] });
      grouped.get(key).occurrences.push({ route_id: id, place, scores });
    }
  }

  const candidates = [...grouped.values()].map((group) => {
    const travelerScoreDetails = Object.fromEntries(BEST_OF_TRAVELERS.map((traveler) => {
      const graded = group.occurrences
        .map((occurrence) => occurrence.scores[traveler])
        .filter((score) => score.source === 'traveler-rating');
      const inputs = graded.length
        ? graded
        : group.occurrences.map((occurrence) => occurrence.scores[traveler]);
      return [traveler, {
        value: average(inputs.map((score) => score.value)),
        source: graded.length ? 'traveler-rating' : 'curated-fallback',
      }];
    }));
    const travelerScores = Object.fromEntries(BEST_OF_TRAVELERS.map((traveler) => [
      traveler,
      travelerScoreDetails[traveler].value,
    ]));
    const travelerScoreSources = Object.fromEntries(BEST_OF_TRAVELERS.map((traveler) => [
      traveler,
      travelerScoreDetails[traveler].source,
    ]));
    const scoreValues = Object.values(travelerScores);
    const availableByDate = new Map();
    for (const occurrence of group.occurrences) {
      const date = occurrence.place.visit_date;
      if (!date) continue;
      const current = availableByDate.get(date);
      if (!current || (!current.place.included_in_magic_score && occurrence.place.included_in_magic_score)) {
        availableByDate.set(date, occurrence);
      }
    }
    const representative = [...availableByDate.values()][0] || group.occurrences[0];
    const groupAverage = average(scoreValues);
    const fairnessFloor = Math.min(...scoreValues);
    const disagreement = Math.max(...scoreValues) - fairnessFloor;
    const gradedTravelerCount = Object.values(travelerScoreSources)
      .filter((source) => source === 'traveler-rating').length;
    const fallbackTravelerCount = BEST_OF_TRAVELERS.length - gradedTravelerCount;
    return {
      key: group.key,
      name: representative.place.name,
      group_average: round(groupAverage, 3),
      fairness_floor: round(fairnessFloor, 3),
      traveler_scores: travelerScores,
      traveler_score_sources: travelerScoreSources,
      graded_traveler_count: gradedTravelerCount,
      fallback_traveler_count: fallbackTravelerCount,
      rating_basis: gradedTravelerCount === BEST_OF_TRAVELERS.length
        ? 'fully-graded'
        : gradedTravelerCount > 0 ? 'mixed-ratings-and-curated-fallbacks' : 'curated-fallbacks-only',
      utility: round((groupAverage - 3) * 100 + fairnessFloor * 18 - disagreement * 8 - fallbackTravelerCount * 4.5, 3),
      source_routes: [...new Set(group.occurrences.map((occurrence) => occurrence.route_id))],
      available_by_date: availableByDate,
    };
  }).sort((a, b) => (
    b.group_average - a.group_average
    || b.fairness_floor - a.fairness_floor
    || b.graded_traveler_count - a.graded_traveler_count
    || a.name.localeCompare(b.name)
  ));

  let eligible = candidates.filter((candidate) => candidate.group_average >= config.topRatingThreshold);
  if (eligible.length < config.minimumCandidateCount) {
    eligible = candidates.slice(0, Math.min(config.minimumCandidateCount, candidates.length));
  }
  const pool = eligible.slice(0, config.maxCandidatePool);
  const poolKeys = new Set(pool.map((candidate) => candidate.key));

  return {
    candidates,
    pool,
    threshold: eligible.length
      ? Math.min(...eligible.map((candidate) => candidate.group_average))
      : config.topRatingThreshold,
    outside_pool: candidates
      .filter((candidate) => !poolKeys.has(candidate.key))
      .map((candidate) => ({
        key: candidate.key,
        name: candidate.name,
        group_average: candidate.group_average,
        rating_basis: candidate.rating_basis,
        reason: candidate.group_average < config.topRatingThreshold
          ? 'below-effective-rating-threshold'
          : 'outside-candidate-pool-limit',
      })),
  };
}

function haversineMiles(a, b) {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const [longitudeA, latitudeA] = a;
  const [longitudeB, latitudeB] = b;
  const latitudeDelta = toRadians(latitudeB - latitudeA);
  const longitudeDelta = toRadians(longitudeB - longitudeA);
  const sinLatitude = Math.sin(latitudeDelta / 2);
  const sinLongitude = Math.sin(longitudeDelta / 2);
  const value = sinLatitude ** 2
    + Math.cos(toRadians(latitudeA)) * Math.cos(toRadians(latitudeB)) * sinLongitude ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function estimatedDriveMinutes(a, b, config, conservative = true) {
  const factor = conservative ? config.roadFactor : 1.12;
  const mph = conservative ? config.assumedRoadMph : 55;
  return Math.ceil((haversineMiles(a, b) * factor * 60) / mph);
}

function timeToMinutes(value) {
  if (!/^\d{1,2}:\d{2}$/.test(String(value || ''))) return null;
  const [hours, minutes] = String(value).split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(value) {
  const bounded = Math.max(0, Math.min(24 * 60, Math.round(value)));
  const hours = Math.floor(bounded / 60);
  const minutes = bounded % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function visitDuration(place) {
  return Math.max(20, Number(place.duration_minutes || 60));
}

function dayCandidateVariants(pool, backbone, config) {
  const byDate = new Map(backbone.map((day) => [day.date, []]));
  const backboneByDate = new Map(backbone.map((day) => [day.date, day]));
  for (const candidate of pool) {
    for (const [date, occurrence] of candidate.available_by_date) {
      if (!byDate.has(date)) continue;
      const day = backboneByDate.get(date);
      const directMinutes = estimatedDriveMinutes(day.start.coordinates, day.end.coordinates, config, false);
      const viaMinutes = estimatedDriveMinutes(day.start.coordinates, occurrence.place.coordinates, config, false)
        + estimatedDriveMinutes(occurrence.place.coordinates, day.end.coordinates, config, false);
      const estimatedDetourMinutes = Math.max(0, viaMinutes - directMinutes);
      byDate.get(date).push({
        ...candidate,
        date,
        place: occurrence.place,
        source_route_id: occurrence.route_id,
        estimated_detour_minutes: estimatedDetourMinutes,
        route_fit_utility: candidate.utility - estimatedDetourMinutes * 0.65,
      });
    }
  }
  for (const [date, candidates] of byDate) {
    byDate.set(date, candidates
      .sort((a, b) => b.route_fit_utility - a.route_fit_utility || b.utility - a.utility || a.name.localeCompare(b.name))
      .slice(0, config.perDayCandidateLimit));
  }
  return byDate;
}

function dayOptions(state, candidates, dayIndex, backboneDay, config) {
  const startMinute = dayIndex === 0 ? config.firstDayStartMinute : config.dayStartMinute;
  const maxStops = config.dayStopLimits?.[backboneDay.date] ?? config.maxStopsPerDay;
  let beam = [{
    path: [],
    location: backboneDay.start,
    drive_minutes: 0,
    clock: startMinute,
    utility: 0,
    waiting_minutes: 0,
  }];
  const options = [...beam];

  for (let depth = 0; depth < maxStops; depth += 1) {
    const expanded = [];
    for (const plan of beam) {
      for (const candidate of candidates) {
        if (state.selected.has(candidate.key) || plan.path.some((entry) => entry.key === candidate.key)) continue;
        const travelMinutes = estimatedDriveMinutes(plan.location.coordinates, candidate.place.coordinates, config);
        const nextDriveMinutes = plan.drive_minutes + travelMinutes;
        if (nextDriveMinutes > config.dailyBaselineTargetMinutes) continue;
        const arrival = plan.clock + travelMinutes;
        const opens = timeToMinutes(candidate.place.hours?.opens);
        const closes = timeToMinutes(candidate.place.hours?.closes);
        const visitStart = Math.max(arrival, opens ?? arrival);
        const visitEnd = visitStart + visitDuration(candidate.place);
        if ((closes != null && visitEnd > closes) || visitEnd > config.dayEndMinute) continue;
        expanded.push({
          path: [...plan.path, {
            ...candidate,
            estimated_arrival: minutesToTime(arrival),
            estimated_start: minutesToTime(visitStart),
            estimated_end: minutesToTime(visitEnd),
          }],
          location: {
            name: candidate.place.name,
            city: [candidate.place.city, candidate.place.state].filter(Boolean).join(', '),
            coordinates: candidate.place.coordinates,
          },
          drive_minutes: nextDriveMinutes,
          clock: visitEnd,
          utility: plan.utility + candidate.utility,
          waiting_minutes: plan.waiting_minutes + Math.max(0, visitStart - arrival),
        });
      }
    }
    if (!expanded.length) break;
    expanded.sort((a, b) => (
      (b.utility - b.drive_minutes * 0.08 - b.waiting_minutes * 0.02)
      - (a.utility - a.drive_minutes * 0.08 - a.waiting_minutes * 0.02)
    ));
    beam = expanded.slice(0, config.dayBeamWidth);
    options.push(...beam);
  }

  return options.map((plan) => {
    const lastDrive = estimatedDriveMinutes(plan.location.coordinates, backboneDay.end.coordinates, config);
    const driveMinutes = plan.drive_minutes + lastDrive;
    const clock = plan.clock + lastDrive;
    if (driveMinutes > config.dailyBaselineTargetMinutes || clock > config.dayEndMinute) return null;
    return {
      ...plan,
      start_location: backboneDay.start,
      location: backboneDay.end,
      drive_minutes: driveMinutes,
      clock,
      overnight_drive_minutes: lastDrive,
    };
  }).filter(Boolean);
}

function overnightBackbone(winnerEntry) {
  const winner = routePackage(winnerEntry);
  const nodes = winnerEntry.geometry?.nodes || {};
  const origin = {
    id: 'generated-origin',
    name: winner.route.origin.name,
    city: winner.route.origin.name,
    coordinates: winner.route.origin.coordinates,
  };
  const destination = {
    id: 'generated-destination',
    name: winner.route.destination.name,
    city: winner.route.destination.name,
    coordinates: winner.route.destination.coordinates,
  };
  let previousEnd = origin;

  return winner.days.map((day, dayIndex) => {
    const legEndpointIds = day.drive?.legs?.length
      ? [day.drive.legs[0].from, day.drive.legs.at(-1).to]
      : [];
    const backboneNodeIds = day.drive_nodes?.length ? day.drive_nodes : legEndpointIds;
    const resolvedNodes = backboneNodeIds
      .map((id) => nodes[id] ? { id, ...nodes[id] } : null)
      .filter(Boolean);
    const start = resolvedNodes[0]
      ? { ...resolvedNodes[0], city: dayIndex === 0 ? origin.city : winner.days[dayIndex - 1].sleep_city }
      : previousEnd;
    const endFallback = dayIndex === winner.days.length - 1 ? destination : previousEnd;
    const end = resolvedNodes.at(-1)
      ? { ...resolvedNodes.at(-1), city: day.sleep_city }
      : { ...endFallback, city: day.sleep_city };
    previousEnd = end;
    return { day: day.day, date: day.date, sleep_city: day.sleep_city, start, end };
  });
}

function optimizeCandidatePath(winnerEntry, pool, config) {
  const winner = routePackage(winnerEntry);
  const dates = winner.days.map((day) => day.date);
  const backbone = overnightBackbone(winnerEntry);
  const byDate = dayCandidateVariants(pool, backbone, config);
  let states = [{
    selected: new Set(),
    total_utility: 0,
    total_drive_minutes: 0,
    days: [],
  }];

  for (let dayIndex = 0; dayIndex < dates.length; dayIndex += 1) {
    const nextStates = [];
    for (const state of states) {
      const options = dayOptions(state, byDate.get(dates[dayIndex]) || [], dayIndex, backbone[dayIndex], config);
      for (const plan of options) {
        const selected = new Set(state.selected);
        for (const candidate of plan.path) selected.add(candidate.key);
        nextStates.push({
          selected,
          total_utility: state.total_utility + plan.utility,
          total_drive_minutes: state.total_drive_minutes + plan.drive_minutes,
          days: [...state.days, { date: dates[dayIndex], ...plan }],
        });
      }
    }
    if (!nextStates.length) {
      throw new Error(`No feasible route remains on ${dates[dayIndex]} under the driving and operating-window rules.`);
    }
    nextStates.sort((a, b) => {
      const aRank = a.total_utility - a.total_drive_minutes * 0.04 + a.selected.size * 8;
      const bRank = b.total_utility - b.total_drive_minutes * 0.04 + b.selected.size * 8;
      return bRank - aRank;
    });

    const seen = new Set();
    states = nextStates.filter((state) => {
      const signature = [...state.selected].sort().join('|');
      if (seen.has(signature)) return false;
      seen.add(signature);
      return true;
    }).slice(0, config.routeBeamWidth);
  }

  return states[0];
}

async function fetchOsrmRoute(nodes, fetchImpl) {
  if (nodes.length < 2) {
    return { distance: 0, duration: 0, legs: [], geometry: { type: 'LineString', coordinates: [] }, source: null };
  }
  const [firstLongitude, firstLatitude] = nodes[0].coordinates;
  if (nodes.every((node) => node.coordinates[0] === firstLongitude && node.coordinates[1] === firstLatitude)) {
    return {
      distance: 0,
      duration: 0,
      legs: nodes.slice(1).map(() => ({ distance: 0, duration: 0 })),
      geometry: { type: 'LineString', coordinates: [nodes[0].coordinates, nodes.at(-1).coordinates] },
      source: null,
    };
  }
  const coordinates = nodes.map((node) => node.coordinates.join(',')).join(';');
  const source = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=simplified&geometries=geojson&steps=false`;
  const response = await fetchImpl(source);
  if (!response.ok) throw new Error(`OSRM returned HTTP ${response.status}.`);
  const payload = await response.json();
  if (payload.code !== 'Ok' || !payload.routes?.[0]) throw new Error(`OSRM could not route the generated day: ${payload.message || payload.code}.`);
  return { ...payload.routes[0], source };
}

function verifiedSchedule(dayIndex, path, osrmLegs, config) {
  let clock = dayIndex === 0 ? config.firstDayStartMinute : config.dayStartMinute;
  const schedule = [];
  for (let index = 0; index < path.length; index += 1) {
    clock += Math.ceil((osrmLegs[index]?.duration || 0) / 60);
    const candidate = path[index];
    const opens = timeToMinutes(candidate.place.hours?.opens);
    const closes = timeToMinutes(candidate.place.hours?.closes);
    const start = Math.max(clock, opens ?? clock);
    const end = start + visitDuration(candidate.place);
    if ((closes != null && end > closes) || end > config.dayEndMinute) {
      const error = new Error(`${candidate.name} no longer fits its operating window after live road routing.`);
      error.code = 'OPERATING_WINDOW_FAILED';
      error.dayIndex = dayIndex;
      throw error;
    }
    schedule.push({
      start: minutesToTime(start),
      end: minutesToTime(end),
      place_id: candidate.place.id,
      name: candidate.name,
      city: candidate.place.city,
      state: candidate.place.state,
      coordinates: candidate.place.coordinates,
      duration_minutes: visitDuration(candidate.place),
      group_average: candidate.group_average,
      fairness_floor: candidate.fairness_floor,
      traveler_scores: candidate.traveler_scores,
      traveler_score_sources: candidate.traveler_score_sources,
      graded_traveler_count: candidate.graded_traveler_count,
      fallback_traveler_count: candidate.fallback_traveler_count,
      rating_basis: candidate.rating_basis,
      source_route_id: candidate.source_route_id,
      reservation: candidate.place.reservation || 'check-later',
      operating_window: candidate.place.hours || null,
    });
    clock = end;
  }
  return { schedule, clock };
}

async function verifyWithRoadRouting(solution, winnerEntry, config, fetchImpl) {
  const winner = routePackage(winnerEntry);
  const backbone = overnightBackbone(winnerEntry);
  const days = [];

  for (let dayIndex = 0; dayIndex < solution.days.length; dayIndex += 1) {
    const sourceDay = solution.days[dayIndex];
    const backboneDay = backbone[dayIndex];
    const spotNodes = sourceDay.path.map((candidate) => ({
      id: candidate.place.id,
      name: candidate.name,
      city: [candidate.place.city, candidate.place.state].filter(Boolean).join(', '),
      coordinates: candidate.place.coordinates,
    }));
    const nodes = [backboneDay.start, ...spotNodes, backboneDay.end];
    const routed = await fetchOsrmRoute(nodes, fetchImpl);
    const baselineMinutes = Math.ceil(routed.duration / 60);
    const planningHigh = Math.ceil(baselineMinutes * config.trafficBufferMultiplier);
    if (baselineMinutes > config.dailyDriveHardCapMinutes) {
      const error = new Error(`Day ${dayIndex + 1} routes at ${baselineMinutes} baseline minutes, above the protected ${config.dailyDriveHardCapMinutes}-minute ceiling.`);
      error.code = 'DRIVE_CAP_EXCEEDED';
      error.dayIndex = dayIndex;
      throw error;
    }
    const { schedule, clock } = verifiedSchedule(dayIndex, sourceDay.path, routed.legs, config);
    const overnightLegMinutes = routed.legs.length
      ? Math.ceil(routed.legs.at(-1).duration / 60)
      : 0;
    if (clock + overnightLegMinutes > config.dayEndMinute) {
      const error = new Error(`Day ${dayIndex + 1} reaches its fixed overnight stop after the protected day window.`);
      error.code = 'DAY_WINDOW_EXCEEDED';
      error.dayIndex = dayIndex;
      throw error;
    }
    const driveLegs = routed.legs.map((leg, legIndex) => ({
      id: `generated-d${dayIndex + 1}-leg-${legIndex + 1}`,
      from: nodes[legIndex].id,
      to: nodes[legIndex + 1].id,
      distance_miles: round(leg.distance / 1609.344, 1),
      baseline_minutes: Math.ceil(leg.duration / 60),
      planning_minutes: {
        low: Math.ceil((leg.duration / 60) * 1.08),
        high: Math.ceil((leg.duration / 60) * config.trafficBufferMultiplier),
      },
      traffic_risk: 'live-check-required',
    }));
    days.push({
      day: dayIndex + 1,
      date: sourceDay.date,
      sleep_city: winner.days[dayIndex].sleep_city,
      schedule,
      selected_spot_count: schedule.length,
      drive: {
        legs: driveLegs,
        baseline_total_miles: round(routed.distance / 1609.344, 1),
        baseline_total_minutes: baselineMinutes,
        planning_total_minutes: {
          low: Math.ceil(baselineMinutes * 1.08),
          high: planningHigh,
        },
        hard_cap_minutes: config.dailyDriveHardCapMinutes,
        cap_status: baselineMinutes <= config.dailyDriveHardCapMinutes ? 'passes-baseline-cap' : 'fails',
        routing_source: routed.source,
        geometry: routed.geometry,
      },
    });
  }

  return days;
}

export async function generateBestOfRoute({
  routes,
  ratingRows,
  fetchImpl = fetch,
  options = {},
}) {
  const baseConfig = { ...BEST_OF_DEFAULTS, ...options };
  const assessment = assessAtlasGrading(routes, ratingRows);
  if (!assessment.winner) {
    const error = new Error('Best-of generation needs at least one scoreable route package.');
    error.code = 'NO_SCOREABLE_ROUTE';
    error.assessment = assessment;
    throw error;
  }
  const winnerEntry = routes.find((entry) => routeId(entry) === assessment.winner.id);
  const winnerHardCap = Number(routePackage(winnerEntry).constraints?.daily_drive_hard_cap_minutes)
    || BEST_OF_DEFAULTS.dailyDriveHardCapMinutes;
  const config = {
    ...baseConfig,
    dailyDriveHardCapMinutes: options.dailyDriveHardCapMinutes ?? winnerHardCap,
    dailyBaselineTargetMinutes: options.dailyBaselineTargetMinutes ?? winnerHardCap,
  };
  const candidates = candidatePool(routes, ratingRows, config);
  let solution;
  let days;
  let lastError;
  let appliedConfig;
  const attemptErrors = [];

  const targets = [...new Set([
    config.dailyBaselineTargetMinutes,
    Math.max(180, config.dailyBaselineTargetMinutes - 30),
    Math.max(180, config.dailyBaselineTargetMinutes - 60),
  ]
    .map((target) => Math.min(target, config.dailyBaselineTargetMinutes)))];
  generationAttempts:
  for (const target of targets) {
    let dayStopLimits = {};
    const maximumAttempts = routePackage(winnerEntry).days.length * config.maxStopsPerDay + 1;
    for (let attempt = 0; attempt < maximumAttempts; attempt += 1) {
      try {
        const attemptConfig = { ...config, dailyBaselineTargetMinutes: target, dayStopLimits };
        solution = optimizeCandidatePath(winnerEntry, candidates.pool, attemptConfig);
        days = await verifyWithRoadRouting(solution, winnerEntry, attemptConfig, fetchImpl);
        appliedConfig = attemptConfig;
        break generationAttempts;
      } catch (error) {
        lastError = error;
        attemptErrors.push(`${target} min optimizer budget: ${error.message}`);
        const adjustableError = ['DRIVE_CAP_EXCEEDED', 'OPERATING_WINDOW_FAILED', 'DAY_WINDOW_EXCEEDED'].includes(error.code);
        const failedDay = Number.isInteger(error.dayIndex) ? solution?.days?.[error.dayIndex] : null;
        if (!adjustableError || !failedDay?.path.length) break;
        const currentLimit = dayStopLimits[failedDay.date] ?? config.maxStopsPerDay;
        const nextLimit = Math.min(currentLimit - 1, failedDay.path.length - 1);
        if (nextLimit < 0 || nextLimit >= currentLimit) break;
        dayStopLimits = { ...dayStopLimits, [failedDay.date]: nextLimit };
      }
    }
  }
  if (!days) {
    const error = new Error(`No road-valid best-of route could be generated. ${attemptErrors.join(' ')}`);
    error.cause = lastError;
    throw error;
  }

  const selectedKeys = new Set(solution.days.flatMap((day) => day.path.map((candidate) => candidate.key)));
  const selectedSpots = solution.days.flatMap((day) => day.path);
  const winner = routePackage(winnerEntry);
  const excludedTopSpots = candidates.pool
    .filter((candidate) => !selectedKeys.has(candidate.key))
    .map((candidate) => ({
      key: candidate.key,
      name: candidate.name,
      group_average: candidate.group_average,
      fairness_floor: candidate.fairness_floor,
      rating_basis: candidate.rating_basis,
      graded_traveler_count: candidate.graded_traveler_count,
      fallback_traveler_count: candidate.fallback_traveler_count,
      available_dates: [...candidate.available_by_date.keys()],
      reason: 'could-not-fit-date-driving-or-operating-window',
    }));

  return {
    schema_version: '1.0.0-generated-draft',
    generated_at: new Date().toISOString(),
    status: assessment.complete
      ? 'generated-draft-requires-booking-weather-and-live-traffic-review'
      : 'generated-draft-uses-curated-fallbacks-and-requires-booking-weather-and-live-traffic-review',
    route: {
      id: 'route-best-of',
      slug: 'best-of-atlas-generated-route',
      name: 'The Best of the Detour Atlas',
      based_on_winning_route_id: assessment.winner.id,
      based_on_winning_route_name: assessment.winner.name,
      start_date: winner.route.start_date,
      end_date: winner.route.end_date,
      airport_date: winner.route.airport_date,
      origin: winner.route.origin,
      destination: winner.route.destination,
    },
    winner: assessment.winner,
    grading: assessment,
    constraints: {
      trip_days: winner.days.length,
      daily_drive_hard_cap_minutes: appliedConfig.dailyDriveHardCapMinutes,
      optimizer_drive_budget_minutes: appliedConfig.dailyBaselineTargetMinutes,
      adaptive_daily_stop_limits: appliedConfig.dayStopLimits,
      traffic_buffer_multiplier: appliedConfig.trafficBufferMultiplier,
      spots_remain_on_researched_visit_dates: true,
      operating_windows_checked: true,
      overnight_rule: 'Preserve every overnight endpoint from the winning route; verify exact lodging and two-car parking before booking.',
    },
    selection: {
      top_rating_threshold: candidates.threshold,
      candidate_pool_count: candidates.pool.length,
      selected_unique_spot_count: selectedKeys.size,
      selected_spots: selectedSpots.map((candidate) => ({
        key: candidate.key,
        name: candidate.name,
        group_average: candidate.group_average,
        fairness_floor: candidate.fairness_floor,
        rating_basis: candidate.rating_basis,
        graded_traveler_count: candidate.graded_traveler_count,
        fallback_traveler_count: candidate.fallback_traveler_count,
        traveler_scores: candidate.traveler_scores,
        traveler_score_sources: candidate.traveler_score_sources,
        source_routes: candidate.source_routes,
      })),
      excluded_top_spots: excludedTopSpots,
      outside_candidate_pool: candidates.outside_pool,
    },
    days,
    validation: {
      osrm_baseline_only: true,
      all_days_at_or_below_hard_cap: days.every((day) => day.drive.baseline_total_minutes <= appliedConfig.dailyDriveHardCapMinutes),
      all_selected_spots_have_four_effective_scores: selectedSpots.every((spot) => Object.keys(spot.traveler_scores).length === BEST_OF_TRAVELERS.length),
      selected_spots_with_any_traveler_rating: selectedSpots.filter((spot) => spot.graded_traveler_count > 0).length,
      selected_spots_using_any_curated_fallback: selectedSpots.filter((spot) => spot.fallback_traveler_count > 0).length,
      requires_live_eta_check: true,
      requires_booking_and_hours_reconfirmation: true,
    },
  };
}
