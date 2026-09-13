"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const spend_1 = require("./Rules/City/spend");
const action_1 = require("./Rules/Player/action");
const added_1 = require("./Rules/Player/added");
const process_yield_1 = require("./Rules/City/process-yield");
const treasury_updated_1 = require("./Rules/Player/treasury-updated");
const core_game_1 = require("@civ-clone/core-game");
const register = (game) => game.rules.register(...(0, spend_1.default)(), ...(0, action_1.default)(game.cities, game.cityBuilds), ...(0, added_1.default)(game.playerTreasuries, game.cityBuilds, game.rules), ...(0, process_yield_1.default)(game.playerTreasuries, game.rules, game.cityImprovements, game.engine), ...(0, treasury_updated_1.default)(game.engine));
exports.register = register;
// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map