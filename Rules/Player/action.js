"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const Action_1 = require("@civ-clone/core-player/Rules/Action");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const actions_1 = require("@civ-clone/base-treasury/lib/actions");
const getRules = (cityRegistry = CityRegistry_1.instance, cityBuildRegistry = CityBuildRegistry_1.instance) => [
    new Action_1.default(new Effect_1.default((0, actions_1.default)(cityRegistry, cityBuildRegistry))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=action.js.map