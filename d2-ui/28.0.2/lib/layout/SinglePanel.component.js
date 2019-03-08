var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import { isArray } from 'lodash/fp';
import log from 'loglevel';

function SinglePanel(props) {
    var children = props.children,
        otherProps = _objectWithoutProperties(props, ['children']);

    var styles = {
        mainStyle: {
            flex: 1,
            display: 'flex',
            flexOrientation: 'row',
            marginTop: '8rem',
            marginLeft: '2rem',
            marginRight: '2rem'
        }
    };

    var childToRender = void 0;
    if (isArray(children) && children.length) {
        childToRender = children[0];
        log.warn('You passed multiple children to the <SinglePanel /> component, this is not supported');
    } else {
        childToRender = children;
    }

    return React.createElement(
        'main',
        _extends({ style: styles.mainStyle }, otherProps),
        childToRender
    );
}

export default SinglePanel;