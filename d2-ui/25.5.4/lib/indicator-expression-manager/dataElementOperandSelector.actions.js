var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { getInstance } from 'd2/lib/d2';
import Pager from 'd2/lib/pager/Pager';
import Action from '../action/Action';
import { Observable } from 'rx';

var createFakePager = function createFakePager(response) {
    // Fake the modelCollection since dataElementOperands do not have a valid uid
    return {
        pager: new Pager(response.pager, {
            list: function list(pager) {
                var _this = this;

                return getInstance().then(function (d2) {
                    if (_this.searchValue) {
                        return d2.Api.getApi().get('dataElementOperands', { page: pager.page, fields: 'id,displayName', filter: ['dataElement.domainType:eq:AGGREGATE', 'name:ilike:' + encodeURIComponent(_this.searchValue)], totals: true });
                    }

                    return d2.Api.getApi().get('dataElementOperands', { page: pager.page, fields: 'id,displayName', totals: true, filter: ['dataElement.domainType:eq:AGGREGATE'] });
                });
            }
        }),
        toArray: function toArray() {
            return response.dataElementOperands;
        }
    };
};

export function subscribeDataElementActionsToStore(dataElementOperandSelectorActions, dataElementOperandStore) {
    var loadListSubscription = dataElementOperandSelectorActions.loadList.subscribe(function () {
        getInstance().then(function (d2) {
            return d2.Api.getApi().get('dataElementOperands', { fields: 'id,displayName', totals: true, filter: ['dataElement.domainType:eq:AGGREGATE'] });
        }).then(createFakePager).then(function (collection) {
            return dataElementOperandStore.setState(collection);
        });
    });

    var searchSubscription = dataElementOperandSelectorActions.search.debounce(500).distinctUntilChanged(function (action) {
        return action.data;
    }).map(function (action) {
        var searchPromise = getInstance().then(function (d2) {
            if (action.data) {
                return d2.Api.getApi().get('dataElementOperands', { fields: 'id,displayName', totals: true, filter: ['dataElement.domainType:eq:AGGREGATE', 'name:ilike:' + encodeURIComponent(action.data)] });
            }
            return d2.Api.getApi().get('dataElementOperands', { fields: 'id,displayName', totals: true, filter: ['dataElement.domainType:eq:AGGREGATE'] });
        }).then(createFakePager).then(function (collection) {
            return {
                complete: action.complete,
                error: action.error,
                collection: collection
            };
        });

        return Observable.fromPromise(searchPromise);
    }).concatAll().subscribe(function (actionResult) {
        dataElementOperandStore.setState(actionResult.collection);
        actionResult.complete();
    });

    var getNextPageSubscription = dataElementOperandSelectorActions.getNextPage.subscribe(function (action) {
        var _action$data = _slicedToArray(action.data, 2),
            pager = _action$data[0],
            searchValue = _action$data[1];

        pager.pagingHandler.searchValue = searchValue;

        pager.getNextPage().then(createFakePager).then(function (collection) {
            return {
                complete: action.complete,
                error: action.error,
                collection: collection
            };
        }).then(function (actionResult) {
            dataElementOperandStore.setState(actionResult.collection);
            actionResult.complete();
        });
    });

    var getPreviousPageSubscription = dataElementOperandSelectorActions.getPreviousPage.subscribe(function (action) {
        var _action$data2 = _slicedToArray(action.data, 2),
            pager = _action$data2[0],
            searchValue = _action$data2[1];

        pager.pagingHandler.searchValue = searchValue;

        pager.getPreviousPage().then(createFakePager).then(function (collection) {
            return {
                complete: action.complete,
                error: action.error,
                collection: collection
            };
        }).then(function (actionResult) {
            dataElementOperandStore.setState(actionResult.collection);
            actionResult.complete();
        });
    });

    var subscriptions = [];

    subscriptions.push(loadListSubscription);
    subscriptions.push(searchSubscription);
    subscriptions.push(getNextPageSubscription);
    subscriptions.push(getPreviousPageSubscription);

    return subscriptions;
}

export function createDataElementOperandActions() {
    return Action.createActionsFromNames(['search', 'loadList', 'getNextPage', 'getPreviousPage']);
}