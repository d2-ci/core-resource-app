var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import TextField from 'material-ui/TextField';

// TODO: Rewrite as ES6 class
/* eslint-disable react/prefer-es6-class */
export default React.createClass({
    displayName: 'TextField',

    propTypes: {
        value: React.PropTypes.string,
        multiLine: React.PropTypes.bool
    },

    getInitialState: function getInitialState() {
        return {
            value: this.props.value
        };
    },
    componentWillReceiveProps: function componentWillReceiveProps(props) {
        this.setState({ value: props.value });
    },
    _change: function _change(e) {
        this.setState({ value: e.target.value });
    },
    render: function render() {
        var errorStyle = {
            lineHeight: this.props.multiLine ? '48px' : '12px',
            marginTop: this.props.multiLine ? -16 : 0
        };

        return React.createElement(TextField, _extends({ errorStyle: errorStyle }, this.props, { value: this.state.value, onChange: this._change }));
    }
});