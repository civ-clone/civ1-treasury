"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const BuildItem_1 = require("@civ-clone/core-city-build/BuildItem");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("../../Yields");
const Sell_1 = require("@civ-clone/core-treasury/Rules/Sell");
const Sold_1 = require("@civ-clone/core-treasury/Rules/Sold");
const SpendCost_1 = require("@civ-clone/core-treasury/SpendCost");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
// v474.05 (CityWorker.cs, the city screen's improvement list) sells an improvement for its cost in shields, 1 gold
//  each, and lets a city sell only one a turn. Wonders aren't in the list. The turn each city last sold on isn't saved,
//  so a game loaded mid-turn lets a city sell once more that turn.
const getRules = (ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance) => {
    const soldOn = new WeakMap();
    return [
        new Sell_1.default('civ1-treasury:city-improvement/sell/value', new Criterion_1.default((cityImprovement) => !(cityImprovement instanceof Wonder_1.default)), new Criterion_1.default((cityImprovement) => soldOn.get(cityImprovement.city()) !== turn.value()), new Effect_1.default((cityImprovement) => new SpendCost_1.default(Yields_1.Gold, new BuildItem_1.default(cityImprovement.constructor, cityImprovement.city(), ruleRegistry)
            .cost()
            .value()))),
        new Sold_1.default('civ1-treasury:city-improvement/sold/once-a-turn', new Effect_1.default((cityImprovement) => {
            soldOn.set(cityImprovement.city(), turn.value());
        })),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=sell.js.map