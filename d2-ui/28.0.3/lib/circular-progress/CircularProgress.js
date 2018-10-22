import PropTypes from 'prop-types';
import React from 'react';
import { default as MUICircularProgress } from 'material-ui/CircularProgress/CircularProgress';

function getSizes(large, small) {
    // Size calculations for the MUI Circular Progress (https://github.com/callemall/material-ui/releases/tag/v0.16.0-rc1)
    var defaultMaterialUISize = 59.5; // Represents the pre 0.16 values size value 1
    var defaultMaterialUIMargin = 5.25; // Represents the pre 0.16 values size value 1

    if (large) {
        return {
            size: defaultMaterialUISize * 2,
            margin: defaultMaterialUIMargin * 2
        };
    }

    if (small) {
        return {
            size: defaultMaterialUISize / 2,
            margin: defaultMaterialUIMargin / 2
        };
    }

    return {
        size: defaultMaterialUISize,
        margin: defaultMaterialUIMargin
    };
}

export default function CircularProgress(_ref) {
    var _ref$large = _ref.large,
        large = _ref$large === undefined ? false : _ref$large,
        _ref$small = _ref.small,
        small = _ref$small === undefined ? false : _ref$small,
        style = _ref.style;

    var sizes = getSizes(large, small);

    return React.createElement(MUICircularProgress, {
        mode: 'indeterminate',
        size: sizes.size,
        style: Object.assign({ margin: sizes.margin }, style)
    });
}

CircularProgress.propTypes = {
    large: PropTypes.bool,
    small: PropTypes.bool
};