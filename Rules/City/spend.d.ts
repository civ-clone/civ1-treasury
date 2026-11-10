import { PendingEffectRegistry } from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import Spend from '@civ-clone/core-treasury/Rules/Spend';
export declare const getRules: (
  pendingEffects?: PendingEffectRegistry
) => Spend[];
export default getRules;
