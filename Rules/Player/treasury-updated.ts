import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import PlayerTreasury from '@civ-clone/core-treasury/PlayerTreasury';
import Updated from '@civ-clone/core-treasury/Rules/Updated';

export const getRules: (engine?: Engine) => Updated[] = (
  engine: Engine = engineInstance
): Updated[] => [
  // TODO: sell city improvements
  new Updated(
    new Criterion(
      (playerTreasury: PlayerTreasury): boolean => playerTreasury.value() < 0
    ),
    new Effect((playerTreasury: PlayerTreasury, city: City) => {
      engine.emit(
        'player:treasury-exhausted',
        playerTreasury.player(),
        playerTreasury,
        city
      );
    })
  ),
];

export default getRules;
