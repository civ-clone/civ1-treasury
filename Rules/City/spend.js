"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovement_1 = require("@civ-clone/core-city-improvement/CityImprovement");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Spend_1 = require("@civ-clone/core-treasury/Rules/Spend");
const Unit_1 = require("@civ-clone/core-unit/Unit");
const getRules = () => [
    // @see https://forums.civfanatics.com/threads/buy-unit-building-wonder-price.576026/
    new Spend_1.default(new Criterion_1.default((cityBuild) => typeof cityBuild.building() !== 'undefined' &&
        Object.isPrototypeOf.call(Unit_1.default, cityBuild.building().item())), new Criterion_1.default((cityBuild) => cityBuild.progress().value() === 0), new Effect_1.default((cityBuild, cost) => {
        const price = cityBuild.remaining() / 10;
        cost.add(Math.floor((price + 4) * 10 * price));
        return cost;
    })),
    new Spend_1.default(new Criterion_1.default((cityBuild) => typeof cityBuild.building() !== 'undefined' &&
        Object.isPrototypeOf.call(Unit_1.default, cityBuild.building().item())), new Criterion_1.default((cityBuild) => cityBuild.progress().value() > 0), new Effect_1.default((cityBuild, cost) => {
        const price = cityBuild.remaining() / 10;
        cost.add(Math.floor(5 * price ** 2 + 20 * price));
        return cost;
    })),
    new Spend_1.default(new Criterion_1.default((cityBuild) => typeof cityBuild.building() !== 'undefined' &&
        Object.isPrototypeOf.call(CityImprovement_1.default, cityBuild.building().item())), new Criterion_1.default((cityBuild) => cityBuild.progress().value() === 0), new Effect_1.default((cityBuild, cost) => {
        cost.add(cityBuild.remaining() * 4);
        return cost;
    })),
    new Spend_1.default(new Criterion_1.default((cityBuild) => typeof cityBuild.building() !== 'undefined' &&
        Object.isPrototypeOf.call(CityImprovement_1.default, cityBuild.building().item())), new Criterion_1.default((cityBuild) => cityBuild.progress().value() > 0), new Effect_1.default((cityBuild, cost) => {
        cost.add(cityBuild.remaining() * 2);
        return cost;
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=spend.js.map