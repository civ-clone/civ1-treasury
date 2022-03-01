"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const spend_1 = require("./Rules/City/spend");
const action_1 = require("./Rules/Player/action");
const added_1 = require("./Rules/Player/added");
const process_yield_1 = require("./Rules/City/process-yield");
const treasury_updated_1 = require("./Rules/Player/treasury-updated");
RuleRegistry_1.instance.register(...(0, spend_1.default)(), ...(0, action_1.default)(), ...(0, added_1.default)(), ...(0, process_yield_1.default)(), ...(0, treasury_updated_1.default)());
//# sourceMappingURL=registerRules.js.map