var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem/MenuItem';

import Translate from '../i18n/Translate.mixin';

export default React.createClass({
    displayName: 'LocaleSelector.component',

    propTypes: {
        value: React.PropTypes.string,
        locales: React.PropTypes.arrayOf(React.PropTypes.shape({
            name: React.PropTypes.string.isRequired,
            locale: React.PropTypes.string.isRequired
        })).isRequired,
        onChange: React.PropTypes.func.isRequired
    },

    mixins: [Translate],

    render: function render() {
        var localeMenuItems = [{ payload: '', text: '' }].concat(this.props.locales).map(function (locale, index) {
            return React.createElement(MenuItem, {
                key: index,
                primaryText: locale.name,
                value: locale.locale
            });
        });

        return React.createElement(
            SelectField,
            _extends({
                fullWidth: true
            }, this.props, {
                value: this.state && this.state.locale,
                hintText: this.getTranslation('select_locale'),
                onChange: this._localeChange
            }),
            localeMenuItems
        );
    },
    _localeChange: function _localeChange(event, index, locale) {
        this.setState({
            locale: locale
        });

        this.props.onChange(locale, event);
    }
});