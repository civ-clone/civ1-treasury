import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import PlayerTreasury from '@civ-clone/core-treasury/PlayerTreasury';
import { Production } from '@civ-clone/civ1-world/Yields';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { Temple } from '@civ-clone/civ1-city-improvement/CityImprovements';
import Unit from '@civ-clone/core-unit/Unit';
import { Warrior } from '@civ-clone/civ1-unit/Units';
import cityImprovementBuildCost from '@civ-clone/civ1-city-improvement/Rules/City/build-cost';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import spend from '../Rules/City/spend';
import unitBuildCost from '@civ-clone/civ1-unit/Rules/City/buildCost';

describe('city:spend', (): void => {
  const ruleRegistry = new RuleRegistry(),
    availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
    cityBuildRegistry = new CityBuildRegistry();

  ruleRegistry.register(
    ...spend(),
    ...cityImprovementBuildCost(),
    ...unitBuildCost()
  );

  availableCityBuildItemsRegistry.register(Warrior, Temple);

  (
    [
      [Temple, 0, 160],
      [Temple, 1, 78],
      [Temple, 39, 2],
      [Warrior, 0, 50],
      [Warrior, 1, 22],
      [Warrior, 9, 2],
    ] as [typeof CityImprovement | typeof Unit, number, number][]
  ).forEach(([BuildItem, progress, expectedCost]): void => {
    it(`should cost ${expectedCost} Gold to buy a ${BuildItem.name} with ${progress} progress`, (): void => {
      const city = setUpCity({
          ruleRegistry,
        }),
        cityBuild = new CityBuild(
          city,
          availableCityBuildItemsRegistry,
          ruleRegistry
        );

      cityBuildRegistry.register(cityBuild);

      const playerTreasury = new PlayerTreasury(
        city.player(),
        cityBuildRegistry,
        ruleRegistry
      );

      playerTreasury.add(expectedCost);

      expect(playerTreasury.value()).to.equal(expectedCost);

      cityBuild.build(BuildItem);

      expect(cityBuild.progress().value()).to.equal(0);

      cityBuild.add(new Production(progress));

      expect(cityBuild.progress().value()).to.equal(progress);

      const goldCost = playerTreasury.cost(city);

      expect(goldCost.value()).to.equal(expectedCost);

      playerTreasury.buy(city);

      expect(playerTreasury.value()).to.equal(0);
    });
  });
});
