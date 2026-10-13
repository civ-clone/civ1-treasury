import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CivilDisorder from '@civ-clone/core-city-happiness/Rules/CivilDisorder';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Gold } from '../../Yields';
import Part from '@civ-clone/core-spaceship/Part';
import Spend from '@civ-clone/core-treasury/Rules/Spend';
import SpendCost from '@civ-clone/core-treasury/SpendCost';
import Unit from '@civ-clone/core-unit/Unit';
import Wonder from '@civ-clone/core-wonder/Wonder';

const isBuilding = (cityBuild: CityBuild, Type: object): boolean =>
  cityBuild.building() !== null &&
  Object.isPrototypeOf.call(Type, cityBuild.building()!.item());

// v474.05 (CityWorker.cs, the BUY branch) doubles every price while the city has no shields stored.
const price = (cityBuild: CityBuild, cost: number): SpendCost =>
  new SpendCost(Gold, cityBuild.progress().value() === 0 ? cost * 2 : cost);

// With `r` shields left, a unit costs r² / 20 + 2r, an improvement 2r, and a Wonder or a spaceship part 4r.
// @see https://forums.civfanatics.com/threads/buy-unit-building-wonder-price.576026/
export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): Spend[] => [
  new Spend(
    new Criterion((cityBuild: CityBuild): boolean =>
      isBuilding(cityBuild, Unit)
    ),
    // A city in civil disorder can't buy a unit, though it can still buy an improvement.
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        !ruleRegistry
          .process(CivilDisorder, cityBuild.city())
          .some((result: boolean): boolean => result)
    ),
    new Effect((cityBuild: CityBuild): SpendCost => {
      const remaining = cityBuild.remaining();

      return price(cityBuild, Math.floor(remaining ** 2 / 20) + 2 * remaining);
    })
  ),

  new Spend(
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        isBuilding(cityBuild, CityImprovement) && !isBuilding(cityBuild, Wonder)
    ),
    new Effect(
      (cityBuild: CityBuild): SpendCost =>
        price(cityBuild, 2 * cityBuild.remaining())
    )
  ),

  new Spend(
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        isBuilding(cityBuild, Wonder) || isBuilding(cityBuild, Part)
    ),
    new Effect(
      (cityBuild: CityBuild): SpendCost =>
        price(cityBuild, 4 * cityBuild.remaining())
    )
  ),
];

export default getRules;
