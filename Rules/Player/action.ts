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
  cityRegistry: CityRegistry = cityRegistryInstance
): Action[] => [
  new Action(
    new Effect((player: Player): PlayerAction[] =>
      cityRegistry
        .getByPlayer(player)
        .map((city: City) => new CompleteProduction(player, city))
    )
  ),
];

export default getRules;
