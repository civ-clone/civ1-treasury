import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import {
  GameDifficultyRegistry,
  instance as gameDifficultyRegistryInstance,
} from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  PlayerTreasuryRegistry,
  instance as playerTreasuryRegistryInstance,
} from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Added from '@civ-clone/core-player/Rules/Added';
import Effect from '@civ-clone/core-rule/Effect';
import { Gold } from '../../Yields';
import Player from '@civ-clone/core-player/Player';
import { addPlayerTreasury } from '@civ-clone/base-treasury/lib/treasury';
import isHuman from '@civ-clone/civ1-difficulty/isHuman';
import { levelOf } from '@civ-clone/civ1-difficulty/level';

export const getRules = (
  playerTreasuryRegistry: PlayerTreasuryRegistry = playerTreasuryRegistryInstance,
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  gameDifficultyRegistry: GameDifficultyRegistry = gameDifficultyRegistryInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance
): Added[] => [
  new Added(
    new Effect((player: Player): void =>
      addPlayerTreasury(
        player,
        Gold,
        // v474.05 (OpenCivOne `StartGameMenu.cs` L277-L280): on Chieftain, the human starts with 50 gold.
        levelOf(gameDifficultyRegistry) === 0 && isHuman(player, clientRegistry)
          ? 50
          : 0,
        playerTreasuryRegistry,
        cityBuildRegistry,
        ruleRegistry
      )
    )
  ),
];

export default getRules;
