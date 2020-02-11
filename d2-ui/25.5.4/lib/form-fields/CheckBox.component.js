var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import Checkbox from 'material-ui/Checkbox';

// TODO: Rewrite as ES6 class
/* eslint-disable react/prefer-es6-class */
export default React.createClass({
    displayName: 'CheckBox.component',

    propTypes: {
        onChange: React.PropTypes.func.isRequired
    },

    render: function render() {
        return React.createElement(
            'div',
            { style: { marginTop: 12, marginBottom: 12 } },
            React.createElement(Checkbox, _extends({ onCheck: this.props.onChange }, this.props))
        );
    }
});