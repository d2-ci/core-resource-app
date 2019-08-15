var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

function renderMenuItem(_ref) {
    var value = _ref.value,
        text = _ref.text;

    return React.createElement(MenuItem, { key: value, value: value, primaryText: text });
}

function renderMenuItems(_ref2) {
    var menuItems = _ref2.menuItems,
        includeEmpty = _ref2.includeEmpty,
        emptyLabel = _ref2.emptyLabel;

    var renderedMenuItems = menuItems.map(function (_ref3) {
        var id = _ref3.id,
            displayName = _ref3.displayName;
        return renderMenuItem({ value: id, text: displayName });
    });

    if (includeEmpty) {
        renderedMenuItems.unshift(renderMenuItem({ value: 'null', text: emptyLabel }));
    }

    return renderedMenuItems;
}

function createCallbackWithFakeEventFromMaterialSelectField(callback) {
    return function (event, index, value) {
        return callback({ target: { value: value } });
    };
}

function DropDown(_ref4) {
    var onFocus = _ref4.onFocus,
        onBlur = _ref4.onBlur,
        onChange = _ref4.onChange,
        value = _ref4.value,
        disabled = _ref4.disabled,
        menuItems = _ref4.menuItems,
        includeEmpty = _ref4.includeEmpty,
        emptyLabel = _ref4.emptyLabel,
        noOptionsLabel = _ref4.noOptionsLabel,
        other = _objectWithoutProperties(_ref4, ['onFocus', 'onBlur', 'onChange', 'value', 'disabled', 'menuItems', 'includeEmpty', 'emptyLabel', 'noOptionsLabel']);

    var menuItemArray = Array.isArray(menuItems) && menuItems || menuItems.toArray();
    var hasOptions = menuItemArray.length > 0;

    return React.createElement(
        SelectField,
        _extends({
            value: hasOptions ? value : 1,
            onChange: createCallbackWithFakeEventFromMaterialSelectField(onChange),
            disabled: !hasOptions || disabled
        }, other),
        hasOptions ? renderMenuItems({ menuItems: menuItemArray, includeEmpty: includeEmpty, emptyLabel: emptyLabel }) : React.createElement(MenuItem, { value: 1, primaryText: noOptionsLabel || '-' })
    );
}
DropDown.propTypes = {
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    menuItems: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    includeEmpty: PropTypes.bool,
    emptyLabel: PropTypes.string,
    noOptionsLabel: PropTypes.string
};
DropDown.defaultProps = {
    includeEmpty: false,
    emptyLabel: ''
};

export default DropDown;