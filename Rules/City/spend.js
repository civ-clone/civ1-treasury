"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovement_1 = require("@civ-clone/core-city-improvement/CityImprovement");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("../../Yields");
const Spend_1 = require("@civ-clone/core-treasury/Rules/Spend");
const SpendCost_1 = require("@civ-clone/core-treasury/SpendCost");
const Unit_1 = require("@civ-clone/core-unit/Unit");
const getRules = () => [
    // @see https://forums.civfanatics.com/threads/buy-unit-building-wonder-price.576026/
    new Spend_1.default(new Criterion_1.default((cityBuild) => cityBuild.building() !== null &&
        Object.isPrototypeOf.call(Unit_1.default, cityBuild.building().item())), new Criterion_1.default((cityBuild) => cityBuild.progress().value() === 0), new Effect_1.default((cityBuild) => {
        const price = cityBuild.remaining() / 10;
        return new SpendCost_1.default(Yields_1.Gold, Math.floor((price + 4) * 10 * price));
    })),
    new Spend_1.default(new Criterion_1.default((cityBuild) => cityBuild.building() !== null &&
        Object.isPrototypeOf.call(Unit_1.default, cityBuild.building().item())), new Criterion_1.default((cityBuild) => cityBuild.progress().value() > 0), new Effect_1.default((cityBuild) => {
        const price = cityBuild.remaining() / 10;
        return new SpendCost_1.default(Yields_1.Gold, Math.floor(5 * price ** 2 + 20 * price));
    })),
    new Spend_1.default(new Criterion_1.default((cityBuild) => cityBuild.building() !== null &&
        Object.isPrototypeOf.call(CityImprovement_1.default, cityBuild.building().item())), new Criterion_1.default((cityBuild) => cityBuild.progress().value() === 0), new Effect_1.default((cityBuild) => new SpendCost_1.default(Yields_1.Gold, cityBuild.remaining() * 4))),
    new Spend_1.default(new Criterion_1.default((cityBuild) => cityBuild.building() !== null &&
        Object.isPrototypeOf.call(CityImprovement_1.default, cityBuild.building().item())), new Criterion_1.default((cityBuild) => cityBuild.progress().value() > 0), new Effect_1.default((cityBuild) => new SpendCost_1.default(Yields_1.Gold, cityBuild.remaining() * 2))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=spend.js.map