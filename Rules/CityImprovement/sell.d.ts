import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import Sell from '@civ-clone/core-treasury/Rules/Sell';
import Sold from '@civ-clone/core-treasury/Rules/Sold';
export declare const getRules: (
  ruleRegistry?: RuleRegistry,
  turn?: Turn
) => (Sell | Sold)[];
export default getRules;
