#!/usr/bin/env node
process.env.ROUTE_COLLECTOR_CONFIG = "../route-06-energy/config.mjs";
await import("../route-04/collect-geometry.mjs");
