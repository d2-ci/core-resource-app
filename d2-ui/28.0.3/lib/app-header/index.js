var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import { render } from 'react-dom';
import HeaderBar from './HeaderBar';
import withStateFrom from '../component-helpers/withStateFrom';
import headerBarStore$ from './headerBar.store';
import D2UIApp from '../app/D2UIApp';
import packageInfo from '../../package.json';

function getBaseUrl(predefLocation) {
    if (predefLocation) {
        return predefLocation;
    }

    return '../api';
}

export function initHeaderBar(domElement, apiLocation) {
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var baseUrl = getBaseUrl(apiLocation);

    var noLoadingIndicator = config.noLoadingIndicator,
        _config$schemas = config.schemas,
        schemas = _config$schemas === undefined ? [] : _config$schemas,
        other = _objectWithoutProperties(config, ['noLoadingIndicator', 'schemas']);

    var d2Config = _extends({}, other, {
        baseUrl: baseUrl,
        schemas: schemas
    });

    console.log('Initializing Header Bar v' + packageInfo.version); // eslint-disable-line no-console
    var HeaderBarWithState = withStateFrom(headerBarStore$, HeaderBar);

    function HeaderBarWithContext() {
        return React.createElement(
            D2UIApp,
            { initConfig: d2Config },
            React.createElement(HeaderBarWithState, { noLoadingIndicator: noLoadingIndicator })
        );
    }

    render(React.createElement(HeaderBarWithContext, null), domElement);
}

export default initHeaderBar;