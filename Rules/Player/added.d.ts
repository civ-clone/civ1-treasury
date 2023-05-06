import { CityBuildRegistry } from '@civ-clone/core-city-build/CityBuildRegistry';
import { PlayerTreasuryRegistry } from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Added from '@civ-clone/core-player/Rules/Added';
export declare const getRules: (
  playerTreasuryRegistry?: PlayerTreasuryRegistry,
  cityBuildRegistry?: CityBuildRegistry,
  ruleRegistry?: RuleRegistry
) => Added[];
export default getRules;
