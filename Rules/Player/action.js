"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const Action_1 = require("@civ-clone/core-player/Rules/Action");
const PlayerActions_1 = require("../../PlayerActions");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (cityRegistry = CityRegistry_1.instance) => [
    new Action_1.default(new Effect_1.default((player) => cityRegistry
        .getByPlayer(player)
        .map((city) => new PlayerActions_1.CompleteProduction(player, city)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=action.js.map