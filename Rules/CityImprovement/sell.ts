import {
  PendingEffectRegistry,
  instance as pendingEffectRegistryInstance,
} from '@civ-clone/core-pending-effect';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import {
  recordSale,
  saleValue,
  soldOn as soldOnTurn,
} from '@civ-clone/base-treasury/lib/sell';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Gold } from '../../Yields';
import Sell from '@civ-clone/core-treasury/Rules/Sell';
import Sold from '@civ-clone/core-treasury/Rules/Sold';
import Wonder from '@civ-clone/core-wonder/Wonder';

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
export const SOLD = 'civ1-treasury:sold';

/** The turn `city` last sold an improvement on, from its record, or `null` if it hasn't. */
export const soldOn = (
  city: City,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance
): number | null => soldOnTurn(city, SOLD, pendingEffects);

// v474.05 (CityWorker.cs, the city screen's improvement list) sells an improvement for its cost in shields, 1 gold
//  each, and lets a city sell only one a turn. Wonders aren't in the list.
export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  turn: Turn = turnInstance,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance
): (Sell | Sold)[] => [
  new Sell(
    'civ1-treasury:city-improvement/sell/value',
    new Criterion(
      (cityImprovement: CityImprovement): boolean =>
        !(cityImprovement instanceof Wonder)
    ),
    new Criterion(
      (cityImprovement: CityImprovement): boolean =>
        soldOn(cityImprovement.city(), pendingEffects) !== turn.value()
    ),
    new Effect(saleValue(Gold, ruleRegistry))
  ),

  // One record a city, replaced on each sale, so it never piles up.
  new Sold(
    'civ1-treasury:city-improvement/sold/once-a-turn',
    new Effect((cityImprovement: CityImprovement): void =>
      recordSale(cityImprovement.city(), SOLD, turn.value(), pendingEffects)
    )
  ),
];

export default getRules;
