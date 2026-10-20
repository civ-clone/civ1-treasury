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

// v474.05 (CityWorker.cs, the city screen's improvement list) sells an improvement for its cost in shields, 1 gold
//  each, and lets a city sell only one a turn. Wonders aren't in the list. The turn each city last sold on isn't saved,
//  so a game loaded mid-turn lets a city sell once more that turn.
export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  turn: Turn = turnInstance
): (Sell | Sold)[] => {
  const soldOn = new WeakMap<City, number>();

  return [
    new Sell(
      'civ1-treasury:city-improvement/sell/value',
      new Criterion(
        (cityImprovement: CityImprovement): boolean =>
          !(cityImprovement instanceof Wonder)
      ),
      new Criterion(
        (cityImprovement: CityImprovement): boolean =>
          soldOn.get(cityImprovement.city()) !== turn.value()
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

    new Sold(
      'civ1-treasury:city-improvement/sold/once-a-turn',
      new Effect((cityImprovement: CityImprovement): void => {
        soldOn.set(cityImprovement.city(), turn.value());
      })
    ),
  ];
};

export default getRules;
