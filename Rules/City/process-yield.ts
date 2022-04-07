import { CityImprovementMaintenanceGold, Gold } from '../../Yields';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  CivilDisorder,
  ICivilDisorderRegistry,
} from '@civ-clone/core-city-happiness/Rules/CivilDisorder';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
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
import BuildItem from '@civ-clone/core-city-build/BuildItem';
import Buildable from '@civ-clone/core-city-build/Buildable';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import Yield from '@civ-clone/core-yield/Yield';

export const getRules: (
  playerTreasuryRegistry?: PlayerTreasuryRegistry,
  ruleRegistry?: RuleRegistry,
  cityImprovementRegistry?: CityImprovementRegistry,
  engine?: Engine
) => ProcessYield[] = (
  playerTreasuryRegistry: PlayerTreasuryRegistry = playerTreasuryRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  engine: Engine = engineInstance
): ProcessYield[] => [
  new ProcessYield(
    new Criterion((cityYield: Yield): boolean => cityYield instanceof Gold),
    new Effect((cityYield: Yield, city: City, yields: Yield[]): void => {
      const playerTreasury = playerTreasuryRegistry.getByPlayer(city.player());

      yields.forEach((cityYield) => {
        if (cityYield instanceof CityImprovementMaintenanceGold) {
          if (playerTreasury.value() < cityYield.value()) {
            const cityImprovement = cityYield.cityImprovement(),
              buildItem = new BuildItem(
                cityImprovement.constructor as typeof Buildable,
                city,
                ruleRegistry
              );

            cityImprovementRegistry.unregister(cityImprovement);

            playerTreasury.add(buildItem.cost().value());

            engine.emit('city:unsupported-improvement', city, cityImprovement);

            return;
          }

          playerTreasury.subtract(cityYield.value(), city.name());
        }
      });
    })
  ),

  new ProcessYield(
    new Criterion((cityYield: Yield): boolean => cityYield instanceof Gold),
    new Criterion(
      (cityYield: Yield, city: City, yields: Yield[]) =>
        !(ruleRegistry as ICivilDisorderRegistry)
          .get(CivilDisorder)
          .some((rule: CivilDisorder): boolean => rule.validate(city, yields))
    ),
    new Effect((cityYield: Yield, city: City): void => {
      const playerTreasury = playerTreasuryRegistry.getByPlayer(city.player());

      playerTreasury.add(cityYield, city.name());

      (ruleRegistry as IUpdatedRegistry).process(Updated, playerTreasury, city);
    })
  ),
];

export default getRules;
