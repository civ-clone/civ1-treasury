"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Updated_1 = require("@civ-clone/core-treasury/Rules/Updated");
const events_1 = require("@civ-clone/base-treasury/lib/events");
const treasury_1 = require("@civ-clone/base-treasury/lib/treasury");
const getRules = (engine = Engine_1.instance) => [
    // TODO: sell city improvements
    new Updated_1.default(new Criterion_1.default(treasury_1.isOverdrawn), new Effect_1.default((0, events_1.emitTreasuryExhausted)(engine))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=treasury-updated.js.map