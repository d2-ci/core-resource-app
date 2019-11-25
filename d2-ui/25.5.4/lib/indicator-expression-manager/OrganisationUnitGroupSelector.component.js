import ListSelectWithLocalSearch from '../list-select/ListSelectWithLocalSearch.component';
import withPropsFromObservable from '../component-helpers/withPropsFromObservable';
import { getAllObjectsWithFields } from '../data-helpers';
import { Observable } from 'rx';
import { isFunction } from 'lodash';

var organisationUnitGroupSelectorProps$ = Observable.fromPromise(getAllObjectsWithFields('organisationUnitGroup')).map(function (organisationUnitGroups) {
    return {
        source: organisationUnitGroups.map(function (model) {
            return { value: model.id, label: model.displayName };
        }),
        onItemDoubleClick: function onItemDoubleClick(value) {
            var ougFormula = ['OUG{', value, '}'].join('');

            // `this` is the react component props object
            if (isFunction(this.onSelect)) {
                this.onSelect(ougFormula);
            }
        }
    };
});

export default withPropsFromObservable(organisationUnitGroupSelectorProps$, ListSelectWithLocalSearch);