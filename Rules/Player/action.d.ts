import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { CityBuildRegistry } from '@civ-clone/core-city-build/CityBuildRegistry';
import Action from '@civ-clone/core-player/Rules/Action';
export declare const getRules: (
  cityRegistry?: CityRegistry,
  cityBuildRegistry?: CityBuildRegistry
) => Action[];
export default getRules;
