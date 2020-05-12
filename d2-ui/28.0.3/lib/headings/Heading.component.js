var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { PropTypes, default as React } from 'react';

function Heading(props) {
    var level = props.level,
        text = props.text,
        style = props.style,
        children = props.children,
        other = _objectWithoutProperties(props, ['level', 'text', 'style', 'children']);

    var tag = { type: level <= 6 ? 'h' + level : 'span' };
    var headingStyle = _extends({
        fontSize: 24,
        fontWeight: 300,
        color: 'rgba(0, 0, 0, 0.87)',
        padding: '16px 0 5px 0',
        margin: 0
    }, style);

    return React.createElement(
        tag.type,
        _extends({}, other, { style: headingStyle }),
        children || text
    );
}
Heading.propTypes = {
    level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
    text: PropTypes.string
};
Heading.defaultProps = {
    level: 1
};

export default Heading;