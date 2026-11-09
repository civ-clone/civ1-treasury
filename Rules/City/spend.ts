import {
  PendingEffectRegistry,
  instance as pendingEffectRegistryInstance,
} from '@civ-clone/core-pending-effect/PendingEffectRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Gold } from '../../Yields';
import Part from '@civ-clone/core-spaceship/Part';
import Spend from '@civ-clone/core-treasury/Rules/Spend';
import SpendCost from '@civ-clone/core-treasury/SpendCost';
import Unit from '@civ-clone/core-unit/Unit';
import Wonder from '@civ-clone/core-wonder/Wonder';
import { civilDisorder } from '@civ-clone/civ1-city-happiness/lib/cityStatus';

// Nothing is offered when the shields stored already cover the cost. v474.05 offers a $0 purchase then, which cuts
// the stored shields back to the cost, so the surplus is lost; offering nothing keeps it.
const isBuilding = (cityBuild: CityBuild, Type: object): boolean =>
  cityBuild.building() !== null &&
  cityBuild.remaining() > 0 &&
  Object.isPrototypeOf.call(Type, cityBuild.building()!.item());

// v474.05 (CityWorker.cs, the BUY branch) doubles every price while the city has no shields stored.
const price = (cityBuild: CityBuild, cost: number): SpendCost =>
  new SpendCost(Gold, cityBuild.progress().value() === 0 ? cost * 2 : cost);

// With `r` shields left, a unit costs r² / 20 + 2r, an improvement 2r, and a Wonder or a spaceship part 4r.
// @see https://forums.civfanatics.com/threads/buy-unit-building-wonder-price.576026/
//
// `ruleRegistry` is unused since the disorder check reads the recorded status, and is kept so callers passing it still
//  line up.
export const getRules = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance
): Spend[] => [
  new Spend(
    new Criterion((cityBuild: CityBuild): boolean =>
      isBuilding(cityBuild, Unit)
    ),
    // A city in civil disorder can't buy a unit, though it can still buy an improvement. v474.05 (CityWorker.cs, the
    //  BUY branch) checks the disorder recorded when the turn was processed, not the city's happiness now, so the
    //  city screen's "Civil disorder" and the refusal always agree, even after the player rearranges the citizens
    //  (civ-clone/web-renderer#680).
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        civilDisorder(cityBuild.city(), pendingEffects) === null
    ),
    new Effect((cityBuild: CityBuild): SpendCost => {
      const remaining = cityBuild.remaining();

      return price(cityBuild, Math.floor(remaining ** 2 / 20) + 2 * remaining);
    })
  ),

  new Spend(
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        isBuilding(cityBuild, CityImprovement) && !isBuilding(cityBuild, Wonder)
    ),
    new Effect(
      (cityBuild: CityBuild): SpendCost =>
        price(cityBuild, 2 * cityBuild.remaining())
    )
  ),

  new Spend(
    new Criterion(
      (cityBuild: CityBuild): boolean =>
        isBuilding(cityBuild, Wonder) || isBuilding(cityBuild, Part)
    ),
    new Effect(
      (cityBuild: CityBuild): SpendCost =>
        price(cityBuild, 4 * cityBuild.remaining())
    )
  ),
];

export default getRules;
