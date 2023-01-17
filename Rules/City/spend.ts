import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Gold } from '../../Yields';
import Spend from '@civ-clone/core-treasury/Rules/Spend';
import SpendCost from '@civ-clone/core-treasury/SpendCost';
import Unit from '@civ-clone/core-unit/Unit';

export const getRules: () => Spend[] = (): Spend[] => [
  // @see https://forums.civfanatics.com/threads/buy-unit-building-wonder-price.576026/
  new Spend(
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        cityBuild.building() !== null &&
        Object.isPrototypeOf.call(Unit, cityBuild.building()!.item())
    ),
    new Criterion(
      (cityBuild: CityBuild): boolean => cityBuild.progress().value() === 0
    ),
    new Effect((cityBuild: CityBuild): SpendCost => {
      const price = cityBuild.remaining() / 10;

      return new SpendCost(Gold, Math.floor((price + 4) * 10 * price));
    })
  ),

  new Spend(
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        cityBuild.building() !== null &&
        Object.isPrototypeOf.call(Unit, cityBuild.building()!.item())
    ),
    new Criterion(
      (cityBuild: CityBuild): boolean => cityBuild.progress().value() > 0
    ),
    new Effect((cityBuild: CityBuild): SpendCost => {
      const price = cityBuild.remaining() / 10;

      return new SpendCost(Gold, Math.floor(5 * price ** 2 + 20 * price));
    })
  ),

  new Spend(
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        cityBuild.building() !== null &&
        Object.isPrototypeOf.call(CityImprovement, cityBuild.building()!.item())
    ),
    new Criterion(
      (cityBuild: CityBuild): boolean => cityBuild.progress().value() === 0
    ),
    new Effect(
      (cityBuild: CityBuild): SpendCost =>
        new SpendCost(Gold, cityBuild.remaining() * 4)
    )
  ),

  new Spend(
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        cityBuild.building() !== null &&
        Object.isPrototypeOf.call(CityImprovement, cityBuild.building()!.item())
    ),
    new Criterion(
      (cityBuild: CityBuild): boolean => cityBuild.progress().value() > 0
    ),
    new Effect(
      (cityBuild: CityBuild): SpendCost =>
        new SpendCost(Gold, cityBuild.remaining() * 2)
    )
  ),
];

export default getRules;
