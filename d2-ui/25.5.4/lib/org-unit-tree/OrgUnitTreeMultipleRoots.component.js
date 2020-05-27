var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import OrgUnitTree from './OrgUnitTree.component';
import Model from 'd2/lib/model/Model';

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
    return React.createElement(OrgUnitTree, props);
}
OrgUnitTreeMultipleRoots.propTypes = Object.assign({}, OrgUnitTree.propTypes, {
    root: React.PropTypes.instanceOf(Model),
    roots: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Model))
});