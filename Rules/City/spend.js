"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const PendingEffectRegistry_1 = require("@civ-clone/core-pending-effect/PendingEffectRegistry");
const buy_1 = require("@civ-clone/base-treasury/lib/buy");
const CityImprovement_1 = require("@civ-clone/core-city-improvement/CityImprovement");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("../../Yields");
const Part_1 = require("@civ-clone/core-spaceship/Part");
const Spend_1 = require("@civ-clone/core-treasury/Rules/Spend");
const Unit_1 = require("@civ-clone/core-unit/Unit");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
const cityStatus_1 = require("@civ-clone/civ1-city-happiness/lib/cityStatus");
// v474.05 (CityWorker.cs, the BUY branch) doubles every price while the city has no shields stored.
const price = (formula) => (0, buy_1.buyCost)(Yields_1.Gold, formula, 2);
// Nothing is offered when the shields stored already cover the cost (`isBuying`). v474.05 offers a $0 purchase then,
// which cuts the stored shields back to the cost, so the surplus is lost; offering nothing keeps it.
//
// With `r` shields left, a unit costs r² / 20 + 2r, an improvement 2r, and a Wonder or a spaceship part 4r.
// @see https://forums.civfanatics.com/threads/buy-unit-building-wonder-price.576026/
const getRules = (pendingEffects = PendingEffectRegistry_1.instance) => [
    new Spend_1.default(new Criterion_1.default((cityBuild) => (0, buy_1.isBuying)(cityBuild, Unit_1.default)), 
    // A city in civil disorder can't buy a unit, though it can still buy an improvement. v474.05 (CityWorker.cs, the
    //  BUY branch) checks the disorder recorded when the turn was processed, not the city's happiness now, so the
    //  city screen's "Civil disorder" and the refusal always agree, even after the player rearranges the citizens
    //  (civ-clone/web-renderer#680).
    new Criterion_1.default((cityBuild) => (0, cityStatus_1.civilDisorder)(cityBuild.city(), pendingEffects) === null), new Effect_1.default(price((0, buy_1.squaredBuyCost)(20, 2)))),
    new Spend_1.default(new Criterion_1.default((cityBuild) => (0, buy_1.isBuying)(cityBuild, CityImprovement_1.default) && !(0, buy_1.isBuying)(cityBuild, Wonder_1.default)), new Effect_1.default(price((0, buy_1.linearBuyCost)(2)))),
    new Spend_1.default(new Criterion_1.default((cityBuild) => (0, buy_1.isBuying)(cityBuild, Wonder_1.default) || (0, buy_1.isBuying)(cityBuild, Part_1.default)), new Effect_1.default(price((0, buy_1.linearBuyCost)(4)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=spend.js.map