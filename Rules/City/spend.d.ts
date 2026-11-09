import { PendingEffectRegistry } from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Spend from '@civ-clone/core-treasury/Rules/Spend';
export declare const getRules: (
  ruleRegistry?: RuleRegistry,
  pendingEffects?: PendingEffectRegistry
) => Spend[];
export default getRules;
