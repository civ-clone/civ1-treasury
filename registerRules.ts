import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';
import added from './Rules/Player/added';
import processYields from './Rules/City/process-yield';
import spend from './Rules/City/spend';
import treasuryUpdated from './Rules/Player/treasury-updated';

ruleRegistryInstance.register(
  ...processYields(),
  ...spend(),
  ...added(),
  ...treasuryUpdated()
);
