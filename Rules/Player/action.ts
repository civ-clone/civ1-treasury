import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import Action from '@civ-clone/core-player/Rules/Action';
import City from '@civ-clone/core-city/City';
import { CompleteProduction } from '../../PlayerActions';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';

export const getRules: (cityRegistry?: CityRegistry) => Action[] = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance
): Action[] => [
  new Action(
    new Effect((player: Player): PlayerAction[] =>
      cityRegistry
        .getByPlayer(player)
        .map(
          (city: City) =>
            new CompleteProduction(player, cityBuildRegistry.getByCity(city))
        )
    )
  ),
];

export default getRules;
