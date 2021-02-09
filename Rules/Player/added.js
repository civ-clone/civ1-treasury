"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const Added_1 = require("@civ-clone/core-player/Rules/Added");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const PlayerTreasury_1 = require("@civ-clone/core-treasury/PlayerTreasury");
const getRules = (playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance) => [
    new Added_1.default(new Effect_1.default((player) => playerTreasuryRegistry.register(new PlayerTreasury_1.default(player)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=added.js.map