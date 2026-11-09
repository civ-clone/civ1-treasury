"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const core_pending_effect_1 = require("@civ-clone/core-pending-effect");
const Destroyed_1 = require("@civ-clone/core-city/Rules/Destroyed");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const sell_1 = require("../CityImprovement/sell");
const getRules = (pendingEffects = core_pending_effect_1.instance) => [
    // Keeping the record of a destroyed city's last sale would keep the city in the save.
    new Destroyed_1.default('civ1-treasury:city/destroyed/forget-sale', new Effect_1.default((city) => pendingEffects
        .getByTarget(city)
        .filter((pendingEffect) => pendingEffect.handler() === sell_1.SOLD)
        .forEach((pendingEffect) => pendingEffects.unregister(pendingEffect)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=destroyed.js.map