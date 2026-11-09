"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.soldOn = exports.SOLD = void 0;
const core_pending_effect_1 = require("@civ-clone/core-pending-effect");
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
/**
 * Recorded in the save on a city that has sold an improvement, with the turn it sold on, so a game loaded mid-turn
 *  still refuses a second sale that turn (civ-clone/web-renderer#679). v474.05 keeps this in the city's saved status
 *  (bit 0x80).
 */
exports.SOLD = 'civ1-treasury:sold';
/** The turn `city` last sold an improvement on, from its record, or `null` if it hasn't. */
const soldOn = (city, pendingEffects = core_pending_effect_1.instance) => {
    const record = pendingEffects
        .getByTarget(city)
        .find((pendingEffect) => pendingEffect.handler() === exports.SOLD);
    return record ? Number(record.data().turn) : null;
};
exports.soldOn = soldOn;
// v474.05 (CityWorker.cs, the city screen's improvement list) sells an improvement for its cost in shields, 1 gold
//  each, and lets a city sell only one a turn. Wonders aren't in the list.
const getRules = (ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, pendingEffects = core_pending_effect_1.instance) => [
    new Sell_1.default('civ1-treasury:city-improvement/sell/value', new Criterion_1.default((cityImprovement) => !(cityImprovement instanceof Wonder_1.default)), new Criterion_1.default((cityImprovement) => (0, exports.soldOn)(cityImprovement.city(), pendingEffects) !== turn.value()), new Effect_1.default((cityImprovement) => new SpendCost_1.default(Yields_1.Gold, new BuildItem_1.default(cityImprovement.constructor, cityImprovement.city(), ruleRegistry)
        .cost()
        .value()))),
    // One record a city, replaced on each sale, so it never piles up.
    new Sold_1.default('civ1-treasury:city-improvement/sold/once-a-turn', new Effect_1.default((cityImprovement) => {
        const city = cityImprovement.city();
        pendingEffects
            .getByTarget(city)
            .filter((pendingEffect) => pendingEffect.handler() === exports.SOLD)
            .forEach((pendingEffect) => pendingEffects.unregister(pendingEffect));
        pendingEffects.register(new core_pending_effect_1.PendingEffect(exports.SOLD, city, { turn: String(turn.value()) }));
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=sell.js.map