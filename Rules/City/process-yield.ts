import { CityImprovementMaintenanceGold, Gold } from '../../Yields';
import { Anarchy } from '@civ-clone/civ1-government/Governments';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  PlayerGovernmentRegistry,
  instance as playerGovernmentRegistryInstance,
} from '@civ-clone/core-government/PlayerGovernmentRegistry';
import {
  PlayerTreasuryRegistry,
  instance as playerTreasuryRegistryInstance,
} from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import Yield from '@civ-clone/core-yield/Yield';
import collectYields from '@civ-clone/base-treasury/lib/collect';
import governedBy from '@civ-clone/base-government-change/lib/governedBy';

export const getRules = (
  playerTreasuryRegistry: PlayerTreasuryRegistry = playerTreasuryRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  engine: Engine = engineInstance,
  playerGovernmentRegistry: PlayerGovernmentRegistry = playerGovernmentRegistryInstance
): ProcessYield[] => [
  new ProcessYield(
    'civ1-treasury:city/process-yield/gold',
    new Criterion((cityYield: Yield): boolean => cityYield instanceof Gold),
    // Under Anarchy no taxes are collected and no maintenance is charged for city improvements: p217, Wilson, J.L &
    // Emrich A. (1992). Sid Meier's Civilization, or Rome on 640K a Day. Rocklin, CA: Prima Publishing
    new Criterion(
      (cityYield: Yield, city: City): boolean =>
        !governedBy(city.player(), [Anarchy], playerGovernmentRegistry)
    ),
    // An improvement whose upkeep the treasury can't pay is sold for its cost in shields.
    new Effect(
      collectYields(
        Gold,
        CityImprovementMaintenanceGold,
        playerTreasuryRegistry,
        ruleRegistry,
        cityImprovementRegistry,
        engine
      )
    )
  ),
];

export default getRules;
