import { Anarchy, Despotism } from '@civ-clone/civ1-government/Governments';
import { CityImprovementMaintenanceGold, Gold } from '../Yields';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Engine from '@civ-clone/core-engine/Engine';
import Government from '@civ-clone/core-government/Government';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import PlayerGovernmentRegistry from '@civ-clone/core-government/PlayerGovernmentRegistry';
import PlayerTreasury from '@civ-clone/core-treasury/PlayerTreasury';
import PlayerTreasuryRegistry from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Yield from '@civ-clone/core-city/Rules/Yield';
import { expect } from 'chai';
import processYield from '../Rules/City/process-yield';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

describe('City.process-yield', (): void => {
  (
    [
      [Despotism, 4],
      [Anarchy, 0],
    ] as [typeof Government, number][]
  ).forEach(([GovernmentType, expectedTreasury]): void => {
    it(`should leave ${expectedTreasury} Gold in the treasury from 5 Gold and 1 upkeep under ${GovernmentType.name}`, async (): Promise<void> => {
      const ruleRegistry = new RuleRegistry(),
        playerGovernmentRegistry = new PlayerGovernmentRegistry(),
        playerTreasuryRegistry = new PlayerTreasuryRegistry(),
        city = await setUpCity({
          ruleRegistry,
        }),
        playerGovernment = new PlayerGovernment(
          city.player(),
          undefined,
          ruleRegistry
        ),
        playerTreasury = new PlayerTreasury(
          city.player(),
          Gold,
          undefined,
          ruleRegistry
        );

      playerGovernment.set(new GovernmentType());
      playerGovernmentRegistry.register(playerGovernment);
      playerTreasuryRegistry.register(playerTreasury);

      ruleRegistry.register(
        new Yield(new Effect(() => new Gold(5))),
        new Yield(new Effect(() => new CityImprovementMaintenanceGold(1))),
        ...processYield(
          playerTreasuryRegistry,
          ruleRegistry,
          new CityImprovementRegistry(),
          new Engine(),
          playerGovernmentRegistry
        )
      );

      const cityYields = city.yields();

      ruleRegistry.process(
        ProcessYield,
        new Gold(reduceYield(cityYields, Gold)),
        city,
        cityYields
      );

      expect(playerTreasury.value()).equal(expectedTreasury);
    });
  });
});
