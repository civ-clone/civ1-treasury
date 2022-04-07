import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { PlayerTreasuryRegistry } from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
export declare const getRules: (
  playerTreasuryRegistry?: PlayerTreasuryRegistry,
  ruleRegistry?: RuleRegistry,
  cityImprovementRegistry?: CityImprovementRegistry,
  engine?: Engine
) => ProcessYield[];
export default getRules;
