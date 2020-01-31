import React, { PropTypes } from 'react';
import { legendItemStore, legendItemStore$, onFieldChange, onFormStatusChange } from './LegendItem.store';
import { setDialogStateToAction } from './LegendItem.actions';
import withStateFrom from '../component-helpers/withStateFrom';
import FormBuilder from '../forms/FormBuilder.component';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import Dialog from 'material-ui/Dialog/Dialog';
import { config } from 'd2/lib/d2';

config.i18n.strings.add('ok');
config.i18n.strings.add('cancel');
config.i18n.strings.add('edit_legend_item');

function isCloseDisabled(isValid) {
    var model = legendItemStore.getState() && legendItemStore.getState().model;

    if (model && (model.startValue === undefined || model.endValue === undefined || model.name === undefined)) {
        return true;
    }

    if (model && !model.dirty) {
        return false;
    }

    return !isValid;
}

// props, context
export function EditLegendItem(_ref, _ref2) {
    var _ref$fieldConfigs = _ref.fieldConfigs,
        fieldConfigs = _ref$fieldConfigs === undefined ? [] : _ref$fieldConfigs,
        _ref$open = _ref.open,
        open = _ref$open === undefined ? false : _ref$open,
        onItemUpdate = _ref.onItemUpdate,
        isValid = _ref.isValid;
    var d2 = _ref2.d2;

    var onCancel = function onCancel() {
        setDialogStateToAction(false);
    };

    var onClose = function onClose() {
        setDialogStateToAction(false);
        onItemUpdate();
    };

    var actions = [React.createElement(FlatButton, {
        label: d2.i18n.getTranslation('cancel'),
        secondary: true,
        onTouchTap: onCancel
    }), React.createElement(FlatButton, {
        label: d2.i18n.getTranslation('ok'),
        primary: true,
        onTouchTap: onClose,
        disabled: isCloseDisabled(isValid)
    })];

    return React.createElement(
        Dialog,
        {
            title: d2.i18n.getTranslation('edit_legend_item'),
            modal: true,
            open: open,
            onRequestClose: onClose,
            actions: actions,
            autoScrollBodyContent: true
        },
        React.createElement(FormBuilder, {
            fields: fieldConfigs,
            onUpdateField: onFieldChange,
            onUpdateFormStatus: onFormStatusChange
        })
    );
}
EditLegendItem.contextTypes = {
    d2: PropTypes.object
};

export default withStateFrom(legendItemStore$, EditLegendItem);