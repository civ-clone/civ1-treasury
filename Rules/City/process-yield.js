"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Yields_1 = require("../../Yields");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const BuildItem_1 = require("@civ-clone/core-city-build/BuildItem");
const CivilDisorder_1 = require("@civ-clone/core-city-happiness/Rules/CivilDisorder");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const ProcessYield_1 = require("@civ-clone/core-city/Rules/ProcessYield");
const Updated_1 = require("@civ-clone/core-treasury/Rules/Updated");
const getRules = (playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance, engine = Engine_1.instance) => [
    new ProcessYield_1.default(new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Gold), new Effect_1.default((cityYield, city, yields) => {
        const playerTreasury = playerTreasuryRegistry.getByPlayerAndType(city.player(), Yields_1.Gold);
        yields.forEach((cityYield) => {
            if (cityYield instanceof Yields_1.CityImprovementMaintenanceGold) {
                if (playerTreasury.value() < cityYield.value()) {
                    const cityImprovement = cityYield.cityImprovement(), buildItem = new BuildItem_1.default(cityImprovement.constructor, city, ruleRegistry);
                    cityImprovementRegistry.unregister(cityImprovement);
                    playerTreasury.add(buildItem.cost().value());
                    engine.emit('city:unsupported-improvement', city, cityImprovement);
                    return;
                }
                playerTreasury.subtract(cityYield.value());
            }
        });
    })),
    new ProcessYield_1.default(new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Gold), new Criterion_1.default((cityYield, city, yields) => !ruleRegistry
        .process(CivilDisorder_1.default, city, yields)
        .some((result) => result)), new Effect_1.default((cityYield, city) => {
        const playerTreasury = playerTreasuryRegistry.getByPlayerAndType(city.player(), Yields_1.Gold);
        playerTreasury.add(cityYield);
        ruleRegistry.process(Updated_1.default, playerTreasury, city);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=process-yield.js.map