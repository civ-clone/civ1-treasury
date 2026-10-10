import { Chieftain, Warlord } from '@civ-clone/civ1-difficulty/Difficulties';
import Added from '@civ-clone/core-player/Rules/Added';
import AIClient from '@civ-clone/core-ai-client/AIClient';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import Client from '@civ-clone/core-client/Client';
import ClientRegistry from '@civ-clone/core-client/ClientRegistry';
import GameDifficultyRegistry from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerTreasuryRegistry from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import added from '../Rules/Player/added';
import { expect } from 'chai';

describe('player:added', (): void => {
  const startingGold = (Level: typeof Chieftain, human: boolean): number => {
    const ruleRegistry = new RuleRegistry(),
      clientRegistry = new ClientRegistry(),
      gameDifficultyRegistry = new GameDifficultyRegistry(),
      playerTreasuryRegistry = new PlayerTreasuryRegistry(),
      player = new Player(ruleRegistry);

    gameDifficultyRegistry.set(Level);
    clientRegistry.register(human ? new Client(player) : new AIClient(player));
    ruleRegistry.register(
      ...added(
        playerTreasuryRegistry,
        new CityBuildRegistry(),
        ruleRegistry,
        gameDifficultyRegistry,
        clientRegistry
      )
    );

    ruleRegistry.process(Added, player);

    const [playerTreasury] = playerTreasuryRegistry.getByPlayer(player);

    return playerTreasury.value();
  };

  it('should start the human with 50 gold on Chieftain', (): void => {
    expect(startingGold(Chieftain, true)).equal(50);
  });

  it('should start everyone else with none', (): void => {
    expect(startingGold(Chieftain, false)).equal(0);
    expect(startingGold(Warlord, true)).equal(0);
  });
});
