"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Added_1 = require("@civ-clone/core-player/Rules/Added");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("../../Yields");
const PlayerTreasury_1 = require("@civ-clone/core-treasury/PlayerTreasury");
const getRules = (playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance, cityBuildRegistry = CityBuildRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => [
    new Added_1.default(new Effect_1.default((player) => playerTreasuryRegistry.register(new PlayerTreasury_1.default(player, Yields_1.Gold, cityBuildRegistry, ruleRegistry)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=added.js.map