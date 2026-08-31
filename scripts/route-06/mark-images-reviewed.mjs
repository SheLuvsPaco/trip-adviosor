#!/usr/bin/env node
process.env.ROUTE_COLLECTOR_CONFIG = "../route-06/config.mjs";
process.env.ROUTE_IMAGE_REVIEW_METHOD = "Route 6 selected-asset contact sheets and targeted replacement sheets were inspected; unrelated search results, misleading venue matches, weak duplicates and illegible images were rejected before confirmation.";
await import("../route-04/mark-images-reviewed.mjs");
