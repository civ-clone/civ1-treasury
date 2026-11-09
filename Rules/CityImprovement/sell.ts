import {
  PendingEffect,
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
import BuildItem from '@civ-clone/core-city-build/BuildItem';
import Buildable from '@civ-clone/core-city-build/Buildable';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Gold } from '../../Yields';
import Sell from '@civ-clone/core-treasury/Rules/Sell';
import Sold from '@civ-clone/core-treasury/Rules/Sold';
import SpendCost from '@civ-clone/core-treasury/SpendCost';
import Wonder from '@civ-clone/core-wonder/Wonder';

/**
 * Recorded in the save on a city that has sold an improvement, with the turn it sold on, so a game loaded mid-turn
 *  still refuses a second sale that turn (civ-clone/web-renderer#679). v474.05 keeps this in the city's saved status
 *  (bit 0x80).
 */
export const SOLD = 'civ1-treasury:sold';

/** The turn `city` last sold an improvement on, from its record, or `null` if it hasn't. */
export const soldOn = (
  city: City,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance
): number | null => {
  const record = pendingEffects
    .getByTarget(city)
    .find(
      (pendingEffect: PendingEffect): boolean =>
        pendingEffect.handler() === SOLD
    );

  return record ? Number(record.data().turn) : null;
};

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
    new Effect(
      (cityImprovement: CityImprovement): SpendCost =>
        new SpendCost(
          Gold,
          new BuildItem(
            cityImprovement.constructor as typeof Buildable,
            cityImprovement.city(),
            ruleRegistry
          )
            .cost()
            .value()
        )
    )
  ),

  // One record a city, replaced on each sale, so it never piles up.
  new Sold(
    'civ1-treasury:city-improvement/sold/once-a-turn',
    new Effect((cityImprovement: CityImprovement): void => {
      const city = cityImprovement.city();

      pendingEffects
        .getByTarget(city)
        .filter(
          (pendingEffect: PendingEffect): boolean =>
            pendingEffect.handler() === SOLD
        )
        .forEach((pendingEffect: PendingEffect): void =>
          pendingEffects.unregister(pendingEffect)
        );

      pendingEffects.register(
        new PendingEffect(SOLD, city, { turn: String(turn.value()) })
      );
    })
  ),
];

export default getRules;
