import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Updated from '@civ-clone/core-treasury/Rules/Updated';
import { emitTreasuryExhausted } from '@civ-clone/base-treasury/lib/events';
import { isOverdrawn } from '@civ-clone/base-treasury/lib/treasury';

export const getRules = (engine: Engine = engineInstance): Updated[] => [
  // TODO: sell city improvements
  new Updated(
    new Criterion(isOverdrawn),
    new Effect(emitTreasuryExhausted(engine))
  ),
];

export default getRules;
