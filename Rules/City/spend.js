"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const CityImprovement_1 = require("@civ-clone/core-city-improvement/CityImprovement");
const CivilDisorder_1 = require("@civ-clone/core-city-happiness/Rules/CivilDisorder");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("../../Yields");
const Part_1 = require("@civ-clone/core-spaceship/Part");
const Spend_1 = require("@civ-clone/core-treasury/Rules/Spend");
const SpendCost_1 = require("@civ-clone/core-treasury/SpendCost");
const Unit_1 = require("@civ-clone/core-unit/Unit");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
const isBuilding = (cityBuild, Type) => cityBuild.building() !== null &&
    Object.isPrototypeOf.call(Type, cityBuild.building().item());
// v474.05 (CityWorker.cs, the BUY branch) doubles every price while the city has no shields stored.
const price = (cityBuild, cost) => new SpendCost_1.default(Yields_1.Gold, cityBuild.progress().value() === 0 ? cost * 2 : cost);
// With `r` shields left, a unit costs r² / 20 + 2r, an improvement 2r, and a Wonder or a spaceship part 4r.
// @see https://forums.civfanatics.com/threads/buy-unit-building-wonder-price.576026/
const getRules = (ruleRegistry = RuleRegistry_1.instance) => [
    new Spend_1.default(new Criterion_1.default((cityBuild) => isBuilding(cityBuild, Unit_1.default)), 
    // A city in civil disorder can't buy a unit, though it can still buy an improvement.
    new Criterion_1.default((cityBuild) => !ruleRegistry
        .process(CivilDisorder_1.default, cityBuild.city())
        .some((result) => result)), new Effect_1.default((cityBuild) => {
        const remaining = cityBuild.remaining();
        return price(cityBuild, Math.floor(remaining ** 2 / 20) + 2 * remaining);
    })),
    new Spend_1.default(new Criterion_1.default((cityBuild) => isBuilding(cityBuild, CityImprovement_1.default) && !isBuilding(cityBuild, Wonder_1.default)), new Effect_1.default((cityBuild) => price(cityBuild, 2 * cityBuild.remaining()))),
    new Spend_1.default(new Criterion_1.default((cityBuild) => isBuilding(cityBuild, Wonder_1.default) || isBuilding(cityBuild, Part_1.default)), new Effect_1.default((cityBuild) => price(cityBuild, 4 * cityBuild.remaining()))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=spend.js.map