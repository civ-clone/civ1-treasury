"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Yields_1 = require("../../Yields");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Updated_1 = require("@civ-clone/core-treasury/Rules/Updated");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const ProcessYield_1 = require("@civ-clone/core-city/Rules/ProcessYield");
const getRules = (playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => [
    new ProcessYield_1.default(new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Gold), new Effect_1.default((cityYield, city, yields) => {
        const playerTreasury = playerTreasuryRegistry.getByPlayer(city.player()), gold = new Yields_1.Gold(cityYield);
        yields.forEach((cityYield) => {
            if (cityYield instanceof Yields_1.CityImprovementMaintenanceGold) {
                gold.subtract(cityYield);
            }
        });
        playerTreasury.add(gold, city.name());
        ruleRegistry.process(Updated_1.Updated, playerTreasury, city);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=process-yield.js.map