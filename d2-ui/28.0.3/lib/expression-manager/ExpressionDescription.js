var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import TextField from 'material-ui/TextField/TextField';

var ExpressionDescription = React.createClass({
    displayName: 'ExpressionDescription',

    propTypes: {
        descriptionLabel: React.PropTypes.string,
        descriptionValue: React.PropTypes.string,
        onDescriptionChange: React.PropTypes.func.isRequired,
        errorText: React.PropTypes.string
    },

    render: function render() {
        var _props = this.props,
            descriptionLabel = _props.descriptionLabel,
            descriptionValue = _props.descriptionValue,
            onDescriptionChange = _props.onDescriptionChange,
            textFieldProps = _objectWithoutProperties(_props, ['descriptionLabel', 'descriptionValue', 'onDescriptionChange']);

        return React.createElement(
            'div',
            { className: 'expression-description' },
            React.createElement(TextField, _extends({}, textFieldProps, {
                value: this.props.descriptionValue,
                floatingLabelText: this.props.descriptionLabel,
                onChange: this.handleDescriptionChange,
                fullWidth: true,
                errorText: this.props.errorText
            }))
        );
    },
    handleDescriptionChange: function handleDescriptionChange(event) {
        var descriptionValue = event.target.value;
        this.props.onDescriptionChange(descriptionValue);
    }
});

export default ExpressionDescription;