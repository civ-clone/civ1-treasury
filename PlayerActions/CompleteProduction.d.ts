import City from '@civ-clone/core-city/City';
import PlayerAction, {
  IPlayerAction,
} from '@civ-clone/core-player/PlayerAction';
export interface ICompleteProduction extends IPlayerAction {
  value(): City;
}
export declare class CompleteProduction
  extends PlayerAction
  implements ICompleteProduction
{
  value(): City;
}
export default CompleteProduction;
