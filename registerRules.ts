import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';
import citySpend from './Rules/City/spend';
import playerAction from './Rules/Player/action';
import playerAdded from './Rules/Player/added';
import processYields from './Rules/City/process-yield';
import treasuryUpdated from './Rules/Player/treasury-updated';

ruleRegistryInstance.register(
  ...citySpend(),
  ...playerAction(),
  ...playerAdded(),
  ...processYields(),
  ...treasuryUpdated()
);
