var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import Store from '../../store/Store';
import { appsMenuSource$ } from '../menu-sources';
import { Observable } from 'rx';

var headerBarSettingsStore = Store.create();

export function setGrid(grid) {
    headerBarSettingsStore.setState(Object.assign({}, headerBarSettingsStore.getState() || {}, {
        grid: grid
    }));
}

setGrid({ x: 3, y: 3 });

export default Observable.combineLatest(appsMenuSource$, headerBarSettingsStore, function (appItems, headerBarSettings) {
    return _extends({}, headerBarSettings, {
        gridOptions: [{ x: 3, y: 3 }, { x: 5, y: 4 }, { x: 8, y: 3 }].concat(appItems ? [{ x: Math.ceil(appItems.length / 4), y: 4 }] : [])
    });
});