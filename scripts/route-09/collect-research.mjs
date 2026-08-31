#!/usr/bin/env node
process.env.ROUTE_COLLECTOR_CONFIG = "../route-09/config.mjs";
await import("../route-04/collect-research.mjs");
