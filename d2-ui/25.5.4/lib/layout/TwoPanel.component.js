var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import { isArray } from 'lodash/fp';
import log from 'loglevel';

function TwoPanelSelector(props) {
    var children = props.children,
        childWrapStyle = props.childWrapStyle,
        sizeRatio = props.sizeRatio,
        otherProps = _objectWithoutProperties(props, ['children', 'childWrapStyle', 'sizeRatio']);

    var styles = {
        mainStyle: {
            flex: 1,
            display: 'flex',
            flexOrientation: 'row',
            marginTop: '8rem'
        }
    };
    var childrenToRender = void 0;

    if (isArray(children)) {
        // More than two children defeats the purpose of a two panel layout and was probably not what the
        // user of the component intended to do.
        if (children.length > 2) {
            log.warn('You passed more than two children to the <TwoPanel /> component, it requires exactly two');
        }

        // We will always only render two children even when more are passed.
        childrenToRender = children.slice(0, 2);
    } else {
        // Just a single child was passed, log a warning because this will only fill the left bar with content.
        // And it was probably not what the user intended to do.
        log.warn('You passed just one child to the <TwoPanel /> component, it requires exactly two');
        childrenToRender = [children];
    }

    var flexedChilden = childrenToRender.map(function (childComponent, index) {
        var childStyle = Object.assign({}, childWrapStyle, {
            flex: sizeRatio[index],
            paddingRight: index === children.length - 1 ? '2rem' : undefined
        });

        return React.createElement(
            'div',
            { key: index, style: childStyle },
            childComponent
        );
    });

    return React.createElement(
        'main',
        _extends({}, otherProps, { style: styles.mainStyle }),
        flexedChilden
    );
}
TwoPanelSelector.defaultProps = {
    sizeRatio: ['0 0 320px', 1],
    children: [],
    childWrapStyle: {}
};

export default TwoPanelSelector;