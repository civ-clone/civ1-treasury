import { CityImprovementMaintenanceGold, Gold } from '../../Yields';
import {
  PlayerTreasuryRegistry,
  instance as playerTreasuryRegistryInstance,
} from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  Updated,
  IUpdatedRegistry,
} from '@civ-clone/core-treasury/Rules/Updated';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import Yield from '@civ-clone/core-yield/Yield';

export const getRules: (
  playerTreasuryRegistry?: PlayerTreasuryRegistry,
  ruleRegistry?: RuleRegistry
) => ProcessYield[] = (
  playerTreasuryRegistry: PlayerTreasuryRegistry = playerTreasuryRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): ProcessYield[] => [
  new ProcessYield(
    new Criterion((cityYield: Yield): boolean => cityYield instanceof Gold),
    new Effect((cityYield: Yield, city: City, yields: Yield[]): void => {
      const playerTreasury = playerTreasuryRegistry.getByPlayer(city.player()),
        gold = new Gold(cityYield);

      yields.forEach((cityYield) => {
        if (cityYield instanceof CityImprovementMaintenanceGold) {
          gold.subtract(cityYield as Yield);
        }
      });

      playerTreasury.add(gold, city.name());

      (ruleRegistry as IUpdatedRegistry).process(Updated, playerTreasury, city);
    })
  ),
];

export default getRules;
