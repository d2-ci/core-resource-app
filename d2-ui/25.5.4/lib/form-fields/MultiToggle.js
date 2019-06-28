import React from 'react';

// Material UI
import Checkbox from 'material-ui/Checkbox';

// TODO: Rewrite as ES6 class
/* eslint-disable react/prefer-es6-class */
export default React.createClass({
    displayName: 'MultiToggle',

    propTypes: {
        label: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired,
        items: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            value: React.PropTypes.bool,
            text: React.PropTypes.string.isRequired
        })),
        style: React.PropTypes.object
    },

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    getInitialState: function getInitialState() {
        return {
            values: this.props.items.reduce(function (prev, curr) {
                if (curr.value) {
                    prev.push(curr.name);
                }
                return prev;
            }, [])
        };
    },
    _handleToggle: function _handleToggle(value, event, checked) {
        var _this = this;

        this.setState(function (oldState) {
            if (checked) {
                if (oldState.values.indexOf(value) === -1) {
                    oldState.values.push(value);
                }
            } else {
                if (oldState.values.indexOf(value) !== -1) {
                    oldState.values.splice(oldState.values.indexOf(value), 1);
                }
            }
            return oldState;
        }, function () {
            _this.props.onChange({ target: { value: _this.state.values } });
        });
    },
    render: function render() {
        var _this2 = this;

        var style = Object.assign({}, this.context.muiTheme.forms, this.props.style);
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { style: { marginTop: 16, marginBottom: 8 } },
                this.props.label
            ),
            this.props.items.map(function (item) {
                var togglor = _this2._handleToggle.bind(null, item.name);
                return React.createElement(Checkbox, {
                    key: item.name,
                    name: item.name,
                    value: 'true',
                    defaultChecked: item.value === true,
                    label: item.text,
                    onCheck: togglor,
                    style: style,
                    labelPosition: 'right'
                });
            })
        );
    }
});