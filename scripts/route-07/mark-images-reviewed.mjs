#!/usr/bin/env node
process.env.ROUTE_COLLECTOR_CONFIG = "../route-07/config.mjs";
process.env.ROUTE_IMAGE_REVIEW_METHOD = "Route 7 contact sheets were inspected place by place; false geographic matches, unrelated performances, weak duplicates and misleading contextual files were replaced before confirmation.";
await import("../route-04/mark-images-reviewed.mjs");
