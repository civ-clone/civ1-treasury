"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Updated_1 = require("@civ-clone/core-treasury/Rules/Updated");
const getRules = (engine = Engine_1.instance) => [
    // TODO: sell city improvements
    new Updated_1.default(new Criterion_1.default((playerTreasury) => playerTreasury.value() < 0), new Effect_1.default((playerTreasury, city) => {
        engine.emit('player:treasury-exhausted', playerTreasury.player(), playerTreasury, city);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=treasury-updated.js.map