import React, { PropTypes, Children, cloneElement } from 'react';

export default function createFlexContainer(defaultFlexStyle) {
    var displayName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'FlexContainer';

    function FlexContainer(_ref) {
        var style = _ref.style,
            _ref$flexValue = _ref.flexValue,
            flexValue = _ref$flexValue === undefined ? '1 0 auto' : _ref$flexValue,
            children = _ref.children;

        var flexContainerStyle = Object.assign({ display: 'flex' }, defaultFlexStyle, style);
        var flexedChildren = Children.map(children, function (child) {
            return cloneElement(child, { style: Object.assign({}, { flex: flexValue }, child.props.style) });
        });

        return React.createElement(
            'div',
            { style: flexContainerStyle },
            flexedChildren
        );
    }
    FlexContainer.displayName = displayName;

    return FlexContainer;
}