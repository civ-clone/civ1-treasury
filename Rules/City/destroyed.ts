import {
  PendingEffect,
  PendingEffectRegistry,
  instance as pendingEffectRegistryInstance,
} from '@civ-clone/core-pending-effect';
import City from '@civ-clone/core-city/City';
import Destroyed from '@civ-clone/core-city/Rules/Destroyed';
import Effect from '@civ-clone/core-rule/Effect';
import { SOLD } from '../CityImprovement/sell';

export const getRules = (
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance
): Destroyed[] => [
  // Keeping the record of a destroyed city's last sale would keep the city in the save.
  new Destroyed(
    'civ1-treasury:city/destroyed/forget-sale',
    new Effect((city: City): void =>
      pendingEffects
        .getByTarget(city)
        .filter(
          (pendingEffect: PendingEffect): boolean =>
            pendingEffect.handler() === SOLD
        )
        .forEach((pendingEffect: PendingEffect): void =>
          pendingEffects.unregister(pendingEffect)
        )
    )
  ),
];

export default getRules;
