import ListSelectWithLocalSearch from '../list-select/ListSelectWithLocalSearch.component';
import withPropsFromObservable from '../component-helpers/withPropsFromObservable';
import { getAllObjectsWithFields } from '../data-helpers';
import { Observable } from 'rx';
import { isFunction } from 'lodash';

var constantSelectorProps$ = Observable.fromPromise(getAllObjectsWithFields('constant')).map(function (constants) {
    return {
        source: constants.map(function (model) {
            return { value: model.id, label: model.displayName };
        }),
        onItemDoubleClick: function onItemDoubleClick(value) {
            var constFormula = ['C{', value, '}'].join('');

            // `this` is the react component props object
            if (isFunction(this.onSelect)) {
                this.onSelect(constFormula);
            }
        }
    };
});

export default withPropsFromObservable(constantSelectorProps$, ListSelectWithLocalSearch);