import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import Buildable from '@civ-clone/core-city-build/Buildable';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import PlayerTreasury from '@civ-clone/core-treasury/PlayerTreasury';
import { Production } from '@civ-clone/civ1-world/Yields';
import CivilDisorder from '@civ-clone/core-city-happiness/Rules/CivilDisorder';
import Effect from '@civ-clone/core-rule/Effect';
import Part from '@civ-clone/core-spaceship/Part';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { Temple } from '@civ-clone/civ1-city-improvement/CityImprovements';
import { Warrior } from '@civ-clone/civ1-unit/Units';
import cityImprovementBuildCost from '@civ-clone/civ1-city-improvement/Rules/City/build-cost';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import spend from '../Rules/City/spend';
import unitBuildCost from '@civ-clone/civ1-unit/Rules/City/buildCost';
import Wonder from '@civ-clone/core-wonder/Wonder';
import { buildCosts } from '@civ-clone/core-city-build/Rules/BuildCost';
import { Gold } from '../Yields';

class TestWonder extends Wonder {}
class TestPart extends Part {}

describe('city:spend', (): void => {
  const ruleRegistry = new RuleRegistry(),
    availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
    cityBuildRegistry = new CityBuildRegistry();

  ruleRegistry.register(
    ...spend(ruleRegistry),
    ...cityImprovementBuildCost(),
    ...unitBuildCost(),
    ...buildCosts([
      [TestWonder, 200],
      [TestPart, 80],
    ] as unknown as [Buildable, number][])
  );

  availableCityBuildItemsRegistry.register(
    ...([
      Warrior,
      Temple,
      TestWonder,
      TestPart,
    ] as unknown as typeof Buildable[])
  );

  (
    [
      [Temple, 0, 160],
      [Temple, 1, 78],
      [Temple, 39, 2],
      [Warrior, 0, 50],
      [Warrior, 1, 22],
      [Warrior, 5, 11],
      [Warrior, 9, 2],
      // A Wonder or a spaceship part costs twice an improvement with the same shields left.
      [TestWonder, 0, 1600],
      [TestWonder, 50, 600],
      [TestPart, 0, 640],
      [TestPart, 20, 240],
    ] as [unknown, number, number][] as [typeof Buildable, number, number][]
  ).forEach(([BuildItem, progress, expectedCost]): void => {
    it(`should cost ${expectedCost} Gold to buy a ${BuildItem.name} with ${progress} progress`, async (): Promise<void> => {
      const city = await setUpCity({
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
        Gold,
        cityBuildRegistry,
        ruleRegistry
      );

      playerTreasury.add(expectedCost);

      expect(playerTreasury.value()).to.equal(expectedCost);

      cityBuild.build(BuildItem);

      expect(cityBuild.progress().value()).to.equal(0);

      cityBuild.add(new Production(progress));

      expect(cityBuild.progress().value()).to.equal(progress);

      const [goldCost] = playerTreasury.cost(city);

      expect(goldCost.value()).to.equal(expectedCost);

      playerTreasury.buy(city);

      expect(playerTreasury.value()).to.equal(0);
    });
  });

  describe('in civil disorder', (): void => {
    const disorderRuleRegistry = new RuleRegistry();

    disorderRuleRegistry.register(
      ...spend(disorderRuleRegistry),
      ...cityImprovementBuildCost(),
      ...unitBuildCost(),
      new CivilDisorder(new Effect((): boolean => true))
    );

    (
      [
        [Warrior, false],
        [Temple, true],
      ] as [unknown, boolean][] as [typeof Buildable, boolean][]
    ).forEach(([BuildItem, canBuy]): void => {
      it(`${canBuy ? 'should' : "shouldn't"} offer to buy a ${
        BuildItem.name
      }`, async (): Promise<void> => {
        const city = await setUpCity({
            ruleRegistry: disorderRuleRegistry,
          }),
          cityBuild = new CityBuild(
            city,
            availableCityBuildItemsRegistry,
            disorderRuleRegistry
          ),
          disorderCityBuildRegistry = new CityBuildRegistry();

        disorderCityBuildRegistry.register(cityBuild);

        const playerTreasury = new PlayerTreasury(
          city.player(),
          Gold,
          disorderCityBuildRegistry,
          disorderRuleRegistry
        );

        playerTreasury.add(1000);
        cityBuild.build(BuildItem);
        cityBuild.add(new Production(1));

        expect(playerTreasury.cost(city).length).to.equal(canBuy ? 1 : 0);

        playerTreasury.buy(city);

        expect(playerTreasury.value() < 1000).to.equal(canBuy);
      });
    });
  });
});
