export { ColorScale as default };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import colorbrewer from './colorbrewer';

// Returns one color scale based on a code and number of classes
function ColorScale(_ref) {
    var scale = _ref.scale,
        classes = _ref.classes,
        style = _ref.style,
        _onClick = _ref.onClick;

    var colors = colorbrewer[scale][classes];

    var styles = {
        scale: _extends({
            marginRight: 30,
            paddingLeft: 0,
            height: 36,
            cursor: 'pointer',
            boxShadow: '0 1px 6px rgba(0,0,0,0.12),0 1px 4px rgba(0,0,0,0.12)',
            display: 'inline-block'
        }, style)
    };

    var items = colors.map(function (color, index) {
        var styles = {
            marginLeft: 0,
            display: 'inline-block',
            backgroundColor: color,
            width: 36,
            height: '100%'
        };

        return React.createElement('li', { key: index, style: styles });
    });

    return React.createElement(
        'ul',
        { style: styles.scale, onClick: function onClick(event) {
                return _onClick(event, scale);
            } },
        items
    );
}