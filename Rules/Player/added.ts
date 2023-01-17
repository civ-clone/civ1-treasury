import {
  PlayerTreasuryRegistry,
  instance as playerTreasuryRegistryInstance,
} from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import Added from '@civ-clone/core-player/Rules/Added';
import Effect from '@civ-clone/core-rule/Effect';
import { Gold } from '../../Yields';
import Player from '@civ-clone/core-player/Player';
import PlayerTreasury from '@civ-clone/core-treasury/PlayerTreasury';

export const getRules: (
  playerTreasuryRegistry?: PlayerTreasuryRegistry
) => Added[] = (
  playerTreasuryRegistry: PlayerTreasuryRegistry = playerTreasuryRegistryInstance
): Added[] => [
  new Added(
    new Effect((player: Player): void =>
      playerTreasuryRegistry.register(new PlayerTreasury(player, Gold))
    )
  ),
];

export default getRules;
