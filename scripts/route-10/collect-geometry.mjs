#!/usr/bin/env node
process.env.ROUTE_COLLECTOR_CONFIG = "../route-10/config.mjs";
await import("../route-04/collect-geometry.mjs");
