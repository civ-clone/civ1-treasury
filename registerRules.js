"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const added_1 = require("./Rules/Player/added");
const process_yield_1 = require("./Rules/City/process-yield");
const spend_1 = require("./Rules/City/spend");
const treasury_updated_1 = require("./Rules/Player/treasury-updated");
RuleRegistry_1.instance.register(...process_yield_1.default(), ...spend_1.default(), ...added_1.default(), ...treasury_updated_1.default());
//# sourceMappingURL=registerRules.js.map