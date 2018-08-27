var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { getInstance as getD2 } from 'd2/lib/d2';
import { Observable } from 'rxjs';
import { getInstance } from 'd2/lib/d2';
import Action from '../action/Action';

export function getLocales() {
    if (!getLocales.localePromise) {
        getLocales.localePromise = getD2().then(function (d2) {
            var api = d2.Api.getApi();

            return api.get('locales/db');
        }).then(function (locales) {
            return {
                locales: locales
            };
        });
    }

    return Observable.fromPromise(getLocales.localePromise);
}

function getModelHref(model) {
    if (model.href) {
        return model.href;
    }

    return model.modelDefinition.apiEndpoint + '/' + model.id;
}

export function getTranslationsForModel(model) {
    return Observable.of(model).flatMap(function (model) {
        var modelDefinition = model.modelDefinition;

        if (!modelDefinition && !modelDefinition.name) {
            return Promise.reject(new Error('Can not find modelDefinition for ' + model.id));
        }

        return getInstance().then(function (d2) {
            var api = d2.Api.getApi();

            return api.get(getModelHref(model) + '/translations');
        });
    });
}

export var saveTranslations = Action.create('saveTranslations');

saveTranslations.subscribe(function (_ref) {
    var _ref$data = _slicedToArray(_ref.data, 2),
        model = _ref$data[0],
        translations = _ref$data[1],
        complete = _ref.complete,
        error = _ref.error;

    var translationHref = getModelHref(model) + '/translations';

    getInstance().then(function (d2) {
        var api = d2.Api.getApi();

        api.update(translationHref, { translations: translations }, { dataType: 'text' }).then(complete).catch(error);
    });
});