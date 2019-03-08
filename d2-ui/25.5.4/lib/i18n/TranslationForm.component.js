import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField/TextField';
import Translate from '../i18n/Translate.mixin';
import LocaleSelector from '../i18n/LocaleSelector.component';
import { getLocales, getTranslationsForModel, saveTranslations } from './translationForm.actions';
import camelCaseToUnderscores from 'd2-utilizr/lib/camelCaseToUnderscores';
import withStateFrom from '../component-helpers/withStateFrom';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import { Observable } from 'rx';
import Store from '../store/Store';

function getTranslationFormData(model) {
    var translationStore = Store.create();

    getTranslationsForModel(model).subscribe(function (translations) {
        translationStore.setState(translations);
    });

    return Observable.combineLatest(getLocales(), translationStore, function () {
        for (var _len = arguments.length, data = Array(_len), _key = 0; _key < _len; _key++) {
            data[_key] = arguments[_key];
        }

        return Object.assign.apply(Object, [{
            objectToTranslate: model,
            setTranslations: function setTranslations(translations) {
                translationStore.setState({
                    translations: translations
                });
            }
        }].concat(data));
    });
}

var TranslationForm = React.createClass({
    displayName: 'TranslationForm',

    propTypes: {
        onTranslationSaved: React.PropTypes.func.isRequired,
        onTranslationError: React.PropTypes.func.isRequired,
        objectToTranslate: React.PropTypes.shape({
            id: React.PropTypes.string.isRequired
        }),
        fieldsToTranslate: React.PropTypes.arrayOf(React.PropTypes.string)
    },

    mixins: [Translate],

    getInitialState: function getInitialState() {
        return {
            loading: true,
            translations: {},
            translationValues: {},
            currentSelectedLocale: ''
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            fieldsToTranslate: ['name', 'shortName', 'description']
        };
    },
    getLoadingdataElement: function getLoadingdataElement() {
        return React.createElement(
            'div',
            { style: { textAlign: 'center' } },
            React.createElement(CircularProgress, { mode: 'indeterminate' })
        );
    },
    renderFieldsToTranslate: function renderFieldsToTranslate() {
        var _this = this;

        return this.props.fieldsToTranslate.filter(function (fieldName) {
            return fieldName;
        }).map(function (fieldName) {
            return React.createElement(
                'div',
                { key: fieldName },
                React.createElement(TextField, { floatingLabelText: _this.getTranslation(camelCaseToUnderscores(fieldName)),
                    value: _this.getTranslationValueFor(fieldName),
                    fullWidth: true,
                    onChange: _this._setValue.bind(_this, fieldName)
                }),
                React.createElement(
                    'div',
                    null,
                    _this.props.objectToTranslate[fieldName]
                )
            );
        });
    },
    renderForm: function renderForm() {
        return React.createElement(
            'div',
            null,
            this.renderFieldsToTranslate(),
            React.createElement(RaisedButton, {
                label: this.getTranslation('save'),
                primary: true,
                onClick: this._saveTranslations
            }),
            React.createElement(RaisedButton, {
                style: { marginLeft: '1rem' },
                label: this.getTranslation('cancel'),
                onClick: this.props.onCancel
            })
        );
    },
    renderHelpText: function renderHelpText() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'p',
                null,
                this.getTranslation('select_a_locale_to_enter_translations_for_that_language')
            )
        );
    },
    render: function render() {
        if (!this.props.locales && !this.props.translations) {
            return this.getLoadingdataElement();
        }

        return React.createElement(
            'div',
            { style: { minHeight: 250 } },
            React.createElement(LocaleSelector, { locales: this.props.locales, onChange: this.setCurrentLocale }),
            Boolean(this.state.currentSelectedLocale) ? this.renderForm() : this.renderHelpText()
        );
    },
    getTranslationValueFor: function getTranslationValueFor(fieldName) {
        var _this2 = this;

        var translation = this.props.translations.find(function (t) {
            return t.locale === _this2.state.currentSelectedLocale && t.property.toLowerCase() === camelCaseToUnderscores(fieldName);
        });

        if (translation) {
            return translation.value;
        }
    },
    setCurrentLocale: function setCurrentLocale(locale) {
        this.setState({
            currentSelectedLocale: locale
        });
    },
    _setValue: function _setValue(property, event) {
        var _this3 = this;

        var newTranslations = [].concat(this.props.translations);
        var translation = newTranslations.find(function (t) {
            return t.locale === _this3.state.currentSelectedLocale && t.property.toLowerCase() === camelCaseToUnderscores(property);
        });

        if (translation) {
            if (event.target.value) {
                translation.value = event.target.value;
            } else {
                // Remove translation from the array
                newTranslations = newTranslations.filter(function (t) {
                    return t !== translation;
                });
            }
        } else {
            translation = {
                property: camelCaseToUnderscores(property).toUpperCase(),
                locale: this.state.currentSelectedLocale,
                value: event.target.value
            };

            newTranslations.push(translation);
        }

        this.props.setTranslations(newTranslations);
    },
    _saveTranslations: function _saveTranslations() {
        saveTranslations(this.props.objectToTranslate, this.props.translations).subscribe(this.props.onTranslationSaved, this.props.onTranslationError);
    }
});

export default TranslationForm;

export function getTranslationFormFor(model) {
    return withStateFrom(getTranslationFormData(model), TranslationForm);
}