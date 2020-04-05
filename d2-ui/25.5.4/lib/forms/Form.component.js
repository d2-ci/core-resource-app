import React from 'react';
import classes from 'classnames';
import FormField from './FormField.component';
import Translate from '../i18n/Translate.mixin';
import createFormValidator from './FormValidator';
import { FormFieldStatuses } from './FormValidator';

var Form = React.createClass({
    displayName: 'Form',

    propTypes: {
        fieldConfigs: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            type: React.PropTypes.func.isRequired,
            fieldOptions: React.PropTypes.object,
            validators: React.PropTypes.arrayOf(React.PropTypes.func)
        })).isRequired,
        formValidator: React.PropTypes.object,
        onFormFieldUpdate: React.PropTypes.func,
        source: React.PropTypes.object.isRequired,
        children: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object])
    },

    mixins: [Translate],

    getDefaultProps: function getDefaultProps() {
        return {
            fieldConfigs: [],
            formValidator: createFormValidator([])
        };
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        this.disposables = [];
        this.disposables.push(this.props.formValidator.status.subscribe(function () {
            // TODO: Should probably have some sort of check to see if it really needs to update? That update might be better at home in the formValidator however
            _this.forceUpdate();
        }));
    },
    componentWillReceiveProps: function componentWillReceiveProps(props) {
        if (props.hasOwnProperty('formValidator')) {
            this.forceUpdate();
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        this.disposables.forEach(function (d) {
            d.dispose();
        });
    },
    renderFieldsFromFieldConfigs: function renderFieldsFromFieldConfigs() {
        var _this2 = this;

        return this.props.fieldConfigs.filter(function (fieldConfig) {
            return fieldConfig.type;
        }).map(function (fieldConfig) {
            var fieldValue = _this2.props.source && _this2.props.source[fieldConfig.name];
            var updateEvent = fieldConfig.updateEvent === 'onBlur' ? 'onBlur' : 'onChange';
            var validationStatus = _this2.props.formValidator.getStatusFor(fieldConfig.name);
            var errorMessage = void 0;

            if (validationStatus && validationStatus.messages && validationStatus.messages.length) {
                errorMessage = validationStatus.messages[0];
            }

            return React.createElement(FormField, {
                fieldOptions: fieldConfig.fieldOptions,
                key: fieldConfig.name,
                type: fieldConfig.type,
                isRequired: fieldConfig.required,
                isValidating: validationStatus.status === FormFieldStatuses.VALIDATING,
                errorMessage: errorMessage ? _this2.getTranslation(errorMessage) : undefined,
                onChange: _this2.updateRequest.bind(_this2, fieldConfig),
                value: fieldValue,
                isValid: _this2.isValid(),
                updateFn: _this2.updateRequest.bind(_this2, fieldConfig),
                updateEvent: updateEvent
            });
        });
    },
    render: function render() {
        var classList = classes('form');

        return React.createElement(
            'form',
            { className: classList },
            this.renderFieldsFromFieldConfigs(),
            this.props.children
        );
    },
    isValid: function isValid() {
        return true;
    },
    updateRequest: function updateRequest(fieldConfig, event) {
        this.props.formValidator.runFor(fieldConfig.name, event.target.value, this.props.source);
        this.props.onFormFieldUpdate && this.props.onFormFieldUpdate(fieldConfig.name, fieldConfig.beforeUpdateConverter ? fieldConfig.beforeUpdateConverter(event.target.value, fieldConfig) : event.target.value);
    }
});

export default Form;