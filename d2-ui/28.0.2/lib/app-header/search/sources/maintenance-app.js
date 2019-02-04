var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { map } from 'lodash/fp';
import { curry } from 'lodash/fp';
import { compose } from 'lodash/fp';
import { Observable } from 'rxjs';
import { flatten } from 'lodash/fp';
import { filter } from 'lodash/fp';
import { mapValues } from 'lodash/fp';
import { config, getInstance } from 'd2/lib/d2';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import { prepareMenuItems, translate$, translateMenuItemNames, getBaseUrlFromD2 } from '../../headerBar.store';

// This file is copied from the maintenance app
// https://github.com/dhis2/maintenance-app/blob/master/src/config/maintenance-models.js
import { getSideBarConfig } from './maintenance-app/maintenance-models';

var maintenanceSections = getSideBarConfig();

function addToTranslationConfig(modelName) {
    config.i18n.strings.add(modelName);
}

map(addToTranslationConfig, map(camelCaseToUnderscores, flatten(map('items', maintenanceSections))));

var getMenuItemsFromModelName = curry(function (section, modelName) {
    return {
        name: camelCaseToUnderscores(modelName),
        defaultAction: '/dhis-web-maintenance/#/list/' + section + '/' + modelName,
        icon: '/icons/dhis-web-maintenance.png',
        description: '',
        parentApp: 'dhis-web-maintenance'
    };
});

var toKeyValueArray = function toKeyValueArray(obj) {
    return Object.keys(obj).map(function (key) {
        return [key, obj[key]];
    });
};

var filterOutEmptyValueLists = function filterOutEmptyValueLists(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    return value.length;
};
var getMapOfModelsPerSection = mapValues('items', maintenanceSections);
var sectionsWithModels = filter(filterOutEmptyValueLists, toKeyValueArray(getMapOfModelsPerSection));
var getMenuItemConfigsForSection = function getMenuItemConfigsForSection(_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        section = _ref4[0],
        models = _ref4[1];

    return map(getMenuItemsFromModelName(section), models);
};
var createAppsListForMenu = compose(flatten, map(getMenuItemConfigsForSection));

// Replace this with a proper source for there values
export default function addDeepLinksForMaintenance(apps) {
    var maintenanceDeepLinks$ = Observable.of(createAppsListForMenu(sectionsWithModels));

    return Observable.combineLatest(translate$, maintenanceDeepLinks$, translateMenuItemNames).flatMap(function (items) {
        return Observable.fromPromise(getInstance().then(function (d2) {
            return prepareMenuItems(getBaseUrlFromD2(d2), items);
        }));
    }).map(function (maintenanceItems) {
        return [].concat(apps, maintenanceItems);
    });
}