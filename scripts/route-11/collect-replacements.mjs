#!/usr/bin/env node
process.env.ROUTE_COLLECTOR_CONFIG = "../route-11/config.mjs";
await import("../route-04/collect-replacements.mjs");
