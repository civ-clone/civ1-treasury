"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const GameDifficultyRegistry_1 = require("@civ-clone/core-difficulty/GameDifficultyRegistry");
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Added_1 = require("@civ-clone/core-player/Rules/Added");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("../../Yields");
const PlayerTreasury_1 = require("@civ-clone/core-treasury/PlayerTreasury");
const isHuman_1 = require("@civ-clone/civ1-difficulty/isHuman");
const level_1 = require("@civ-clone/civ1-difficulty/level");
const getRules = (playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance, cityBuildRegistry = CityBuildRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, gameDifficultyRegistry = GameDifficultyRegistry_1.instance, clientRegistry = ClientRegistry_1.instance) => [
    new Added_1.default(new Effect_1.default((player) => {
        const playerTreasury = new PlayerTreasury_1.default(player, Yields_1.Gold, cityBuildRegistry, ruleRegistry);
        // v474.05 (OpenCivOne `StartGameMenu.cs` L277-L280): on Chieftain, the human starts with 50 gold.
        if ((0, level_1.levelOf)(gameDifficultyRegistry) === 0 &&
            (0, isHuman_1.default)(player, clientRegistry)) {
            playerTreasury.add(50);
        }
        playerTreasuryRegistry.register(playerTreasury);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=added.js.map