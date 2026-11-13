"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Yields_1 = require("../../Yields");
const Governments_1 = require("@civ-clone/civ1-government/Governments");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const ProcessYield_1 = require("@civ-clone/core-city/Rules/ProcessYield");
const collect_1 = require("@civ-clone/base-treasury/lib/collect");
const governedBy_1 = require("@civ-clone/base-government-change/lib/governedBy");
const getRules = (playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance, engine = Engine_1.instance, playerGovernmentRegistry = PlayerGovernmentRegistry_1.instance) => [
    new ProcessYield_1.default('civ1-treasury:city/process-yield/gold', new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Gold), 
    // Under Anarchy no taxes are collected and no maintenance is charged for city improvements: p217, Wilson, J.L &
    // Emrich A. (1992). Sid Meier's Civilization, or Rome on 640K a Day. Rocklin, CA: Prima Publishing
    new Criterion_1.default((cityYield, city) => !(0, governedBy_1.default)(city.player(), [Governments_1.Anarchy], playerGovernmentRegistry)), 
    // An improvement whose upkeep the treasury can't pay is sold for its cost in shields.
    new Effect_1.default((0, collect_1.default)(Yields_1.Gold, Yields_1.CityImprovementMaintenanceGold, playerTreasuryRegistry, ruleRegistry, cityImprovementRegistry, engine))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=process-yield.js.map