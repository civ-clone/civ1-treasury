"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.soldOn = exports.SOLD = void 0;
const core_pending_effect_1 = require("@civ-clone/core-pending-effect");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const sell_1 = require("@civ-clone/base-treasury/lib/sell");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("../../Yields");
const Sell_1 = require("@civ-clone/core-treasury/Rules/Sell");
const Sold_1 = require("@civ-clone/core-treasury/Rules/Sold");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
/**
 * Recorded in the save on a city that has sold an improvement, with the turn it sold on, so a game loaded mid-turn
 *  still refuses a second sale that turn (civ-clone/web-renderer#679). v474.05 keeps this in the city's saved status
 *  (bit 0x80).
 *
 * It is a status, not a debt: it is a `PendingEffect` only so that it is kept in the save with the city, and nothing
 *  is owed. No handler is registered for it, on purpose, and it must never be discharged (a sweep that discharged every
 *  pending effect would throw `UnknownHandlerError` for it). It ends in two ways only: the city's next sale replaces it,
 *  and the city's destruction removes it (`Rules/City/destroyed.ts`). Otherwise it is left to go stale: it only counts
 *  while its turn is the current one (`soldOn(city) === turn.value()`), and a city keeps at most one.
 *
 * When the city changes hands the record stays with it, as v474.05 does (CAPTURE.C masks the city's status with 0xae
 *  when it is taken and 0x9b when it is transferred, and both keep 0x80). So a city that sold this turn and is captured
 *  this turn can't be sold in by its new owner until the turn after. v474.05 clears the bit when the owner's economy
 *  is processed at the start of their phase (CITYMGT.C `city_process`, the turn-advancing mode), so there it is the
 *  owner's own next turn, not the game's, that ends it. See `tests/sell.test.ts`.
 */
exports.SOLD = 'civ1-treasury:sold';
/** The turn `city` last sold an improvement on, from its record, or `null` if it hasn't. */
const soldOn = (city, pendingEffects = core_pending_effect_1.instance) => (0, sell_1.soldOn)(city, exports.SOLD, pendingEffects);
exports.soldOn = soldOn;
// v474.05 (CityWorker.cs, the city screen's improvement list) sells an improvement for its cost in shields, 1 gold
//  each, and lets a city sell only one a turn. Wonders aren't in the list.
const getRules = (ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, pendingEffects = core_pending_effect_1.instance) => [
    new Sell_1.default('civ1-treasury:city-improvement/sell/value', new Criterion_1.default((cityImprovement) => !(cityImprovement instanceof Wonder_1.default)), new Criterion_1.default((cityImprovement) => (0, exports.soldOn)(cityImprovement.city(), pendingEffects) !== turn.value()), new Effect_1.default((0, sell_1.saleValue)(Yields_1.Gold, ruleRegistry))),
    // One record a city, replaced on each sale, so it never piles up.
    new Sold_1.default('civ1-treasury:city-improvement/sold/once-a-turn', new Effect_1.default((cityImprovement) => (0, sell_1.recordSale)(cityImprovement.city(), exports.SOLD, turn.value(), pendingEffects))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=sell.js.map