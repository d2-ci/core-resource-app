var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { PropTypes, default as React } from 'react';
import classes from 'classnames';
import LinearProgress from 'material-ui/LinearProgress';

var emptyComponent = React.createClass({
    displayName: 'emptyComponent',
    render: function render() {
        return null;
    }
});

/**
 * Is required to be a direct child of the `Form.component`
 * Will receive a updateFormStatus method from the Form to be called when the state of the input changes.
 * This will be passed down as an onChange event.
 * If the component passed as `type` does not support onChange
 * consider passing a wrapper component that wraps your `type` component
 * and fires the onChange
 *
 * The field fires an update request for the value by calling `onChange` by default but it is optional to set the update event to `onBlur`.
 * Pass the string `onBlur` to `updateEvent` to update the `<Form>` component on blur.
 */
var FormField = React.createClass({
    displayName: 'FormField',
    // eslint-disable-line react/no-multi-comp
    propTypes: {
        type: PropTypes.func.isRequired,
        isValid: PropTypes.bool.isRequired,
        errorMessage: PropTypes.string,
        fieldOptions: PropTypes.shape({
            helpText: PropTypes.string,
            dynamicHelpText: PropTypes.bool
        }).isRequired,
        value: PropTypes.any,
        updateFn: PropTypes.func.isRequired,
        updateEvent: PropTypes.oneOf(['onChange', 'onBlur']),
        isValidating: PropTypes.bool,
        isRequired: PropTypes.bool
    },

    getDefaultProps: function getDefaultProps() {
        return {
            type: emptyComponent,
            validators: []
        };
    },
    getInitialState: function getInitialState() {
        return { isFocused: false };
    },
    renderHelpText: function renderHelpText() {
        if (!this.props.fieldOptions || !this.props.fieldOptions.helpText || this.props.errorMessage) {
            return null;
        }

        var helpText = this.props.fieldOptions.helpText;
        var dynamic = this.props.fieldOptions.dynamicHelpText;

        var helpStyle = {
            color: '#888',
            fontSize: '12px'
        };

        if (dynamic) {
            Object.assign(helpStyle, {
                marginTop: this.state.isFocused ? 0 : -18,
                marginBottom: this.state.isFocused ? 0 : 0,
                transition: 'margin 175ms ease-in-out'
            });
        }

        return React.createElement(
            'div',
            { style: { overflow: 'hidden', marginTop: dynamic ? -5 : 0 } },
            React.createElement(
                'div',
                { style: helpStyle },
                helpText
            )
        );
    },
    render: function render() {
        var _this = this;

        var classList = classes('form-field');

        var onChangeFn = this.props.updateFn;
        var onBlurFn = this._blur;
        if (this.props.updateEvent === 'onBlur') {
            onBlurFn = function onBlurFn(e) {
                _this._blur(e);
                if (e.target.value !== (_this.props.value ? _this.props.value : '')) {
                    _this.props.updateFn(e);
                }
            };
            onChangeFn = undefined;
        }

        return React.createElement(
            'div',
            { className: classList },
            React.createElement(this.props.type, _extends({
                errorText: this.props.errorMessage,
                defaultValue: this.props.value,
                onChange: onChangeFn,
                onBlur: onBlurFn,
                onFocus: this._focus,
                isRequired: this.props.isRequired
            }, this.props.fieldOptions)),
            this.renderHelpText(),
            this.props.isValidating ? React.createElement(LinearProgress, { mode: 'indeterminate' }) : null
        );
    },
    _focus: function _focus() {
        this.setState({ isFocused: true });
    },
    _blur: function _blur() {
        this.setState({ isFocused: false });
    }
});

export default FormField;