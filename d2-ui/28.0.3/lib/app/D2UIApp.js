var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import { init } from 'd2/lib/d2';
import Paper from 'material-ui/Paper';
import ErrorMessage from '../messages/ErrorMessage.component';

var D2UIApp = function (_Component) {
    _inherits(D2UIApp, _Component);

    function D2UIApp(props, context) {
        _classCallCheck(this, D2UIApp);

        var _this = _possibleConstructorReturn(this, (D2UIApp.__proto__ || Object.getPrototypeOf(D2UIApp)).call(this, props, context));

        _this.state = {
            isErrored: false
        };
        return _this;
    }

    _createClass(D2UIApp, [{
        key: 'getChildContext',
        value: function getChildContext() {
            return {
                d2: this.state.d2
            };
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            init(this.props.initConfig).then(function (d2) {
                return _this2.setState({ d2: d2 });
            }).catch(function (errorMessage) {
                return _this2.setState({
                    isErrored: true,
                    error: React.createElement(
                        Paper,
                        { style: { padding: 16 } },
                        React.createElement(ErrorMessage, { message: errorMessage })
                    )
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var LoadingComponent = this.props.LoadingComponent;


            var content = void 0;
            if (this.state.isErrored) {
                content = this.state.error;
            } else if (this.state.d2) {
                content = this.props.children;
            } else {
                content = React.createElement(LoadingComponent, null);
            }

            return React.createElement(
                MuiThemeProvider,
                { muiTheme: this.props.muiTheme },
                content
            );
        }
    }]);

    return D2UIApp;
}(Component);

export default D2UIApp;


D2UIApp.propTypes = {
    initConfig: PropTypes.object,
    muiTheme: PropTypes.object,
    children: PropTypes.node,
    LoadingComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
};

D2UIApp.childContextTypes = {
    d2: PropTypes.object
};

D2UIApp.defaultProps = {
    initConfig: {},
    muiTheme: getMuiTheme(),
    LoadingComponent: CircularProgress
};