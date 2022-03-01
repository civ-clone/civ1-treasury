import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Spend from '@civ-clone/core-treasury/Rules/Spend';
import Unit from '@civ-clone/core-unit/Unit';
import Yield from '@civ-clone/core-yield/Yield';

export const getRules: () => Spend[] = (): Spend[] => [
  // @see https://forums.civfanatics.com/threads/buy-unit-building-wonder-price.576026/
  new Spend(
    new Criterion((cityBuild: CityBuild): boolean =>
      Object.isPrototypeOf.call(Unit, <typeof Unit>cityBuild.building())
    ),
    new Criterion(
      (cityBuild: CityBuild): boolean => cityBuild.progress().value() === 0
    ),
    new Effect((cityBuild: CityBuild, cost: Yield): Yield => {
      const price = cityBuild.remaining() / 10;

      cost.add(Math.floor((price + 4) * 10 * price));

      return cost;
    })
  ),

  new Spend(
    new Criterion((cityBuild: CityBuild): boolean =>
      Object.isPrototypeOf.call(Unit, <typeof Unit>cityBuild.building())
    ),
    new Criterion(
      (cityBuild: CityBuild): boolean => cityBuild.progress().value() > 0
    ),
    new Effect((cityBuild: CityBuild, cost: Yield): Yield => {
      const price = cityBuild.remaining() / 10;

      cost.add(Math.floor(5 * price ** 2 + 20 * price));

      return cost;
    })
  ),

  new Spend(
    new Criterion((cityBuild: CityBuild): boolean =>
      Object.isPrototypeOf.call(
        CityImprovement,
        <typeof CityImprovement>cityBuild.building()
      )
    ),
    new Criterion(
      (cityBuild: CityBuild): boolean => cityBuild.progress().value() === 0
    ),
    new Effect((cityBuild: CityBuild, cost: Yield): Yield => {
      cost.add(cityBuild.remaining() * 4);

      return cost;
    })
  ),

  new Spend(
    new Criterion((cityBuild: CityBuild): boolean =>
      Object.isPrototypeOf.call(
        CityImprovement,
        <typeof CityImprovement>cityBuild.building()
      )
    ),
    new Criterion(
      (cityBuild: CityBuild): boolean => cityBuild.progress().value() > 0
    ),
    new Effect((cityBuild: CityBuild, cost: Yield): Yield => {
      cost.add(cityBuild.remaining() * 2);

      return cost;
    })
  ),
];

export default getRules;
