var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { config } from 'd2/lib/d2';
import Dialog from 'material-ui/Dialog/Dialog';
import React, { PropTypes, Component } from 'react';
import { getTranslationFormFor } from './TranslationForm.component';

config.i18n.strings.add('close');
config.i18n.strings.add('sharing_settings');

var TranslationDialog = function (_Component) {
    _inherits(TranslationDialog, _Component);

    function TranslationDialog(props, context) {
        _classCallCheck(this, TranslationDialog);

        var _this = _possibleConstructorReturn(this, (TranslationDialog.__proto__ || Object.getPrototypeOf(TranslationDialog)).call(this, props, context));

        _this.i18n = context.d2.i18n;

        _this.state = {
            TranslationForm: getTranslationFormFor(_this.props.objectToTranslate)
        };

        _this.translationSaved = _this.translationSaved.bind(_this);
        _this.translationError = _this.translationError.bind(_this);
        _this.closeSharingDialog = _this.closeSharingDialog.bind(_this);
        return _this;
    }

    _createClass(TranslationDialog, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                Dialog,
                _extends({
                    title: this.i18n.getTranslation('translation_dialog_title'),
                    autoDetectWindowHeight: true,
                    autoScrollBodyContent: true
                }, this.props),
                React.createElement(this.state.TranslationForm, {
                    onTranslationSaved: this.translationSaved,
                    onTranslationError: this.translationError,
                    onCancel: this.closeSharingDialog,
                    fieldsToTranslate: this.props.fieldsToTranslate
                })
            );
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(newProps) {
            if (newProps.objectToTranslate) {
                this.setState({
                    TranslationForm: getTranslationFormFor(newProps.objectToTranslate)
                });
            }
        }
    }, {
        key: 'closeSharingDialog',
        value: function closeSharingDialog() {
            this.props.onRequestClose();
        }
    }, {
        key: 'translationSaved',
        value: function translationSaved() {
            this.props.onTranslationSaved();
            this.closeSharingDialog();
        }
    }, {
        key: 'translationError',
        value: function translationError() {
            this.props.onTranslationError();
        }
    }]);

    return TranslationDialog;
}(Component);

export default TranslationDialog;


TranslationDialog.propTypes = {
    objectToTranslate: React.PropTypes.shape({
        id: React.PropTypes.string.isRequired
    }).isRequired,
    onTranslationSaved: React.PropTypes.func.isRequired,
    onTranslationError: React.PropTypes.func.isRequired,
    open: React.PropTypes.bool,
    onRequestClose: React.PropTypes.func.isRequired,
    fieldsToTranslate: React.PropTypes.array
};

TranslationDialog.contextTypes = {
    d2: PropTypes.object
};