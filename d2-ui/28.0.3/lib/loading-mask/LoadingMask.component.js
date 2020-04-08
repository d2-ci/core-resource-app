import PropTypes from 'prop-types';
import React from 'react';
import CircularProgress from '../circular-progress/CircularProgress';

var loadingStatusMask = {
    left: '45%',
    position: 'fixed',
    top: '45%'
};

export default function LoadingMask(_ref) {
    var _ref$style = _ref.style,
        style = _ref$style === undefined ? {} : _ref$style,
        _ref$large = _ref.large,
        large = _ref$large === undefined ? false : _ref$large,
        _ref$small = _ref.small,
        small = _ref$small === undefined ? false : _ref$small;

    return React.createElement(
        'div',
        { style: Object.assign({}, loadingStatusMask, style) },
        React.createElement(CircularProgress, { large: large, small: small })
    );
}

LoadingMask.propTypes = {
    style: PropTypes.object,
    large: PropTypes.bool,
    small: PropTypes.bool
};