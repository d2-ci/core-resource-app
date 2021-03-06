import { getInstance } from 'd2/lib/d2';
import { compose } from 'lodash/fp';
import { map } from 'lodash/fp';
import headerBarSettingsStore$ from './settings/settings.store';
import { profileSource$, appsMenuSource$ } from './menu-sources';
import { curry } from 'lodash/fp';
import { pick } from 'lodash/fp';
import { get as pluck } from 'lodash/fp';
import { Observable } from 'rx';
import getBaseUrlFromD2ApiUrl from './getBaseUrlFromD2ApiUrl';

var translate = curry(function translate(d2, key) {
    return d2.i18n.getTranslation(key);
});

var d2Offline = { currentUser: { userSettings: {} } };
var d2$ = Observable.fromPromise(getInstance()).catch(Observable.just(d2Offline));
var currentUser$ = d2$.map(pluck('currentUser'));

export var translate$ = Observable.combineLatest(d2$, Observable.just(translate), function (d2, translateFn) {
    return translateFn(d2);
});

export function translateMenuItemNames(trans, items) {
    return items.map(function (item) {
        return Object.assign({}, item, { name: trans(item.name) });
    });
}

var removePrefix = function removePrefix(word) {
    return word.replace(/^\.\./, '');
};
var isAbsoluteUrl = function isAbsoluteUrl(url) {
    return (/^(?:https?:)?\/\//.test(url)
    );
};
export var getBaseUrlFromD2 = getBaseUrlFromD2ApiUrl;

var addBaseUrlWhenNotAnAbsoluteUrl = curry(function (baseUrl, url) {
    return isAbsoluteUrl(url) ? url : baseUrl + removePrefix(url);
});
var getIconUrl = function getIconUrl(item) {
    return item.icon || '/icons/program.png';
};
var adjustIconUrl = curry(function (baseUrl, item) {
    return Object.assign({}, item, { icon: addBaseUrlWhenNotAnAbsoluteUrl(baseUrl, getIconUrl(item)) });
});
var adjustDefaultActionUrl = curry(function (baseUrl, item) {
    return Object.assign({}, item, { action: addBaseUrlWhenNotAnAbsoluteUrl(baseUrl, item.defaultAction) });
});
var adjustMenuItemsUrls = function adjustMenuItemsUrls(baseUrl) {
    return compose(adjustIconUrl(baseUrl), adjustDefaultActionUrl(baseUrl));
};
var getLabelFromName = function getLabelFromName(item) {
    return Object.assign({}, item, { label: item.displayName || item.name });
};
var extractMenuProps = pick(['action', 'icon', 'description', 'label', 'name', 'parentApp']);
var prepareMenuItem = function prepareMenuItem(baseUrl) {
    return compose(extractMenuProps, adjustMenuItemsUrls(baseUrl), getLabelFromName);
};
export var prepareMenuItems = function prepareMenuItems(baseUrl, items) {
    return map(prepareMenuItem(baseUrl), items);
};

var profileMenuItems$ = Observable.combineLatest(translate$, profileSource$, translateMenuItemNames).combineLatest(d2$, function (items, d2) {
    return { items: items, d2: d2 };
}).map(function (_ref) {
    var items = _ref.items,
        d2 = _ref.d2;
    return prepareMenuItems(getBaseUrlFromD2(d2), items);
}).catch(Observable.just([]));

export var appsMenuItems$ = appsMenuSource$.combineLatest(d2$, function (items, d2) {
    return { items: items, d2: d2 };
}).map(function (_ref2) {
    var items = _ref2.items,
        d2 = _ref2.d2;
    return prepareMenuItems(getBaseUrlFromD2(d2), items);
}).catch(Observable.just([]));

var headerBarStore$ = Observable.combineLatest(appsMenuItems$, profileMenuItems$, currentUser$, headerBarSettingsStore$, function (appItems, profileItems, currentUser, settings) {
    return { appItems: appItems, profileItems: profileItems, currentUser: currentUser, settings: settings };
});

export default headerBarStore$;