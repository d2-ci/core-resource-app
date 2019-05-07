import Action from '../action/Action';
import { setDialogStateTo } from './LegendItem.store';

export var setDialogStateToAction = Action.create('setDialogStateToAction'); // name in debug

setDialogStateToAction.subscribe(function (action) {
  return setDialogStateTo(action.data);
});