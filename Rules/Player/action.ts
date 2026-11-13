import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import Action from '@civ-clone/core-player/Rules/Action';
import Effect from '@civ-clone/core-rule/Effect';
import buyAndSell from '@civ-clone/base-treasury/lib/actions';

export const getRules = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance
): Action[] => [
  new Action(new Effect(buyAndSell(cityRegistry, cityBuildRegistry))),
];

export default getRules;
