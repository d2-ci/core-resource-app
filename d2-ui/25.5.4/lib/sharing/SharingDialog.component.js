var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { config } from 'd2/lib/d2';
import Dialog from 'material-ui/Dialog/Dialog';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import React, { PropTypes, createClass } from 'react';
import Translate from '../i18n/Translate.mixin';
import Sharing from './Sharing.component';
import sharingStore from './sharing.store';

config.i18n.strings.add('close');
config.i18n.strings.add('sharing_settings');

export default createClass({
    propTypes: {
        objectToShare: PropTypes.object.isRequired,
        onRequestClose: PropTypes.func.isRequired
    },

    mixins: [Translate],

    render: function render() {
        var sharingDialogActions = [React.createElement(FlatButton, {
            label: this.getTranslation('close'),
            onClick: this.closeSharingDialog })];

        return React.createElement(
            Dialog,
            _extends({
                title: this.getTranslation('sharing_settings'),
                actions: sharingDialogActions,
                autoDetectWindowHeight: true,
                autoScrollBodyContent: true
            }, this.props, {
                onRequestClose: this.closeSharingDialog
            }),
            React.createElement(Sharing, { objectToShare: this.props.objectToShare })
        );
    },
    closeSharingDialog: function closeSharingDialog() {
        this.props.onRequestClose(sharingStore.getState());
    }
});