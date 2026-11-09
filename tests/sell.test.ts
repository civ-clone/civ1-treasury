import {
  Library,
  Temple,
} from '@civ-clone/civ1-city-improvement/CityImprovements';
import {
  PendingEffect,
  PendingEffectRegistry,
} from '@civ-clone/core-pending-effect';
import sell, { SOLD, soldOn } from '../Rules/CityImprovement/sell';
import City from '@civ-clone/core-city/City';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import { Gold } from '../Yields';
import PlayerTreasury from '@civ-clone/core-treasury/PlayerTreasury';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Wonder from '@civ-clone/core-wonder/Wonder';
import cityImprovementBuildCost from '@civ-clone/civ1-city-improvement/Rules/City/build-cost';
import { expect } from 'chai';
import destroyed from '../Rules/City/destroyed';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

class TestWonder extends Wonder {}

describe('city-improvement:sell', (): void => {
  const setUp = async (pendingEffects = new PendingEffectRegistry()) => {
    const ruleRegistry = new RuleRegistry(),
      turn = new Turn();

    ruleRegistry.register(
      ...sell(ruleRegistry, turn, pendingEffects),
      ...destroyed(pendingEffects),
      ...cityImprovementBuildCost()
    );

    const city = await setUpCity({ ruleRegistry }),
      playerTreasury = new PlayerTreasury(
        city.player(),
        Gold,
        new CityBuildRegistry(),
        ruleRegistry
      );

    return { city, pendingEffects, playerTreasury, ruleRegistry, turn };
  };

  it('should sell an improvement for its cost in shields, 1 gold each', async (): Promise<void> => {
    const { city, playerTreasury, ruleRegistry } = await setUp(),
      temple = new Temple(city, ruleRegistry),
      [saleValue] = playerTreasury.saleValue(temple);

    expect(saleValue.resource()).to.equal(Gold);
    expect(saleValue.value()).to.equal(40);

    playerTreasury.sell(temple);

    expect(temple.destroyed()).to.equal(true);
    expect(playerTreasury.value()).to.equal(40);
  });

  it("shouldn't sell a Wonder", async (): Promise<void> => {
    const { city, playerTreasury, ruleRegistry } = await setUp(),
      wonder = new TestWonder(city, ruleRegistry);

    expect(playerTreasury.saleValue(wonder)).to.have.length(0);

    playerTreasury.sell(wonder);

    expect(wonder.destroyed()).to.equal(false);
    expect(playerTreasury.value()).to.equal(0);
  });

  it('should sell only one improvement in a city each turn', async (): Promise<void> => {
    const { city, playerTreasury, ruleRegistry, turn } = await setUp(),
      temple = new Temple(city, ruleRegistry),
      library = new Library(city, ruleRegistry);

    playerTreasury.sell(temple);

    expect(playerTreasury.saleValue(library)).to.have.length(0);

    playerTreasury.sell(library);

    expect(library.destroyed()).to.equal(false);
    expect(playerTreasury.value()).to.equal(40);

    turn.increment();

    playerTreasury.sell(library);

    expect(library.destroyed()).to.equal(true);
    expect(playerTreasury.value()).to.equal(120);
  });

  it("shouldn't stop another city selling", async (): Promise<void> => {
    const { city, playerTreasury, ruleRegistry } = await setUp(),
      other = await setUpCity({ ruleRegistry }),
      otherTreasury = new PlayerTreasury(
        other.player(),
        Gold,
        new CityBuildRegistry(),
        ruleRegistry
      ),
      temple = new Temple(city, ruleRegistry),
      otherTemple = new Temple(other, ruleRegistry);

    playerTreasury.sell(temple);
    otherTreasury.sell(otherTemple);

    expect(otherTemple.destroyed()).to.equal(true);
    expect(otherTreasury.value()).to.equal(40);
  });
  // What a save holds is the record; the rules are built afresh on load (civ-clone/web-renderer#679).
  const reload = async (city: City, pendingEffects: PendingEffectRegistry) => {
    const loaded = new PendingEffectRegistry(),
      ruleRegistry = new RuleRegistry(),
      turn = new Turn();

    pendingEffects
      .entries()
      .forEach((pendingEffect: PendingEffect): void =>
        loaded.register(
          new PendingEffect(
            pendingEffect.handler(),
            pendingEffect.target(),
            pendingEffect.data()
          )
        )
      );

    ruleRegistry.register(
      ...sell(ruleRegistry, turn, loaded),
      ...cityImprovementBuildCost()
    );

    return {
      loaded,
      playerTreasury: new PlayerTreasury(
        city.player(),
        Gold,
        new CityBuildRegistry(),
        ruleRegistry
      ),
      ruleRegistry,
      turn,
    };
  };

  it('should still refuse a second sale that turn after a reload', async (): Promise<void> => {
    const { city, pendingEffects, playerTreasury, ruleRegistry } =
      await setUp();

    playerTreasury.sell(new Temple(city, ruleRegistry));

    const reloaded = await reload(city, pendingEffects),
      library = new Library(city, reloaded.ruleRegistry);

    expect(reloaded.playerTreasury.saleValue(library)).to.have.length(0);

    reloaded.playerTreasury.sell(library);

    expect(library.destroyed()).to.equal(false);

    reloaded.turn.increment();

    reloaded.playerTreasury.sell(library);

    expect(library.destroyed()).to.equal(true);
  });

  it('should allow the first sale after reloading a save made before any', async (): Promise<void> => {
    const { city, pendingEffects } = await setUp(),
      reloaded = await reload(city, pendingEffects),
      library = new Library(city, reloaded.ruleRegistry);

    reloaded.playerTreasury.sell(library);

    expect(library.destroyed()).to.equal(true);
  });

  it('should keep one record a city, with the turn it last sold on', async (): Promise<void> => {
    const { city, pendingEffects, playerTreasury, ruleRegistry, turn } =
      await setUp();

    expect(soldOn(city, pendingEffects)).to.equal(null);

    playerTreasury.sell(new Temple(city, ruleRegistry));
    turn.increment();
    playerTreasury.sell(new Library(city, ruleRegistry));

    expect(pendingEffects.getByHandler(SOLD)).to.have.length(1);
    expect(soldOn(city, pendingEffects)).to.equal(turn.value());
  });

  it('should forget the record when the city is destroyed', async (): Promise<void> => {
    const { city, pendingEffects, playerTreasury, ruleRegistry } =
      await setUp();

    playerTreasury.sell(new Temple(city, ruleRegistry));
    city.destroy();

    expect(pendingEffects.getByHandler(SOLD)).to.have.length(0);
  });
});
