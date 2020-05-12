import React from 'react';
import DropDown from '../form-fields/DropDown.component';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress/LinearProgress';

var style = {
    button: {
        position: 'relative',
        top: 3,
        marginLeft: 16
    },
    progress: {
        height: 2,
        backgroundColor: 'rgba(0,0,0,0)',
        top: 46
    }
};
style.button1 = Object.assign({}, style.button, { marginLeft: 0 });

function addToSelection(orgUnits) {
    var res = orgUnits;
    this.props.selected.forEach(function (orgUnitId) {
        if (res.indexOf(orgUnitId) === -1) {
            res.push(orgUnitId);
        }
    });
    this.props.onUpdateSelection(res);
}

function removeFromSelection(orgUnits) {
    this.props.onUpdateSelection(this.props.selected.filter(function (orgUnit) {
        return orgUnits.indexOf(orgUnit) === -1;
    }));
}

function handleChangeSelection(event) {
    this.setState({ selection: event.target.value });
}

function renderDropdown(menuItems, label) {
    return React.createElement(
        'div',
        { style: { position: 'relative', minHeight: 89 } },
        React.createElement(DropDown, {
            value: this.state.selection,
            menuItems: menuItems,
            onChange: this.handleChangeSelection,
            floatingLabelText: this.getTranslation(label),
            disabled: this.state.loading
        }),
        this.renderControls()
    );
};

function renderControls() {
    var disabled = this.state.loading || !this.state.selection;

    return React.createElement(
        'div',
        { style: { position: 'absolute', display: 'inline-block', top: 24, marginLeft: 16 } },
        this.state.loading && React.createElement(LinearProgress, { size: 0.5, style: style.progress }),
        React.createElement(RaisedButton, {
            label: this.getTranslation('select'),
            style: style.button1,
            onClick: this.handleSelect,
            disabled: disabled
        }),
        React.createElement(RaisedButton, {
            label: this.getTranslation('deselect'),
            style: style.button,
            onClick: this.handleDeselect,
            disabled: disabled
        })
    );
}

export { addToSelection, removeFromSelection, handleChangeSelection, renderDropdown, renderControls };