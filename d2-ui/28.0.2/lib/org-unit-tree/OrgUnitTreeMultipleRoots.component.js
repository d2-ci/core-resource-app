var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import OrgUnitTree from './OrgUnitTree.component';

export default function OrgUnitTreeMultipleRoots(props) {
    if (props.roots) {
        return React.createElement(
            'div',
            null,
            props.roots.map(function (root, index) {
                return React.createElement(OrgUnitTree, _extends({
                    key: index
                }, props, {
                    root: root,
                    onSelectClick: props.onSelectClick
                }));
            })
        );
    }

    var root = props.root;
    return React.createElement(OrgUnitTree, _extends({ root: root }, props));
}

function isOrgUnitModel(obj) {
    return obj && obj.modelDefinition && obj.modelDefinition.plural === 'organisationUnits';
}

function OrgUnitModelValidator(props, propName, componentName) {
    if (props[propName] && !isOrgUnitModel(props[propName])) {
        return new Error('Invalid org unit model supplied to `' + componentName + '.' + propName + '`');
    }
}

function OrgUnitModelArrayElementValidator(propValue, key, componentName, location, propFullName) {
    if (!isOrgUnitModel(propValue[key])) {
        return new Error('Invalid org unit model supplied to `' + componentName + '.' + propFullName + '`');
    }
}

OrgUnitTreeMultipleRoots.propTypes = Object.assign({}, OrgUnitTree.propTypes, {
    root: OrgUnitModelValidator,
    roots: React.PropTypes.arrayOf(OrgUnitModelArrayElementValidator)
});