var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress/CircularProgress';
import log from 'loglevel';
import getDisplayName from 'recompose/getDisplayName';

export default function withPropsFromObservable(observable, BaseComponent) {
    var WithPropsFromComponent = function (_Component) {
        _inherits(WithPropsFromComponent, _Component);

        function WithPropsFromComponent(props, context) {
            _classCallCheck(this, WithPropsFromComponent);

            var _this = _possibleConstructorReturn(this, (WithPropsFromComponent.__proto__ || Object.getPrototypeOf(WithPropsFromComponent)).call(this, props, context));

            _this.state = {
                isLoading: true
            };
            return _this;
        }

        _createClass(WithPropsFromComponent, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this2 = this;

                this.disposable = observable.subscribe(function (props) {
                    return _this2.setState(_extends({ isLoading: false }, props));
                }, function (error) {
                    log.error('Failed to receive props for ' + BaseComponent.displayName);log.error(error);
                });
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                if (this.disposable && this.disposable.dispose) {
                    this.disposable.dispose();
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _state = this.state,
                    isLoading = _state.isLoading,
                    componentProps = _objectWithoutProperties(_state, ['isLoading']);

                if (this.state.isLoading) {
                    return React.createElement(CircularProgress, null);
                }

                return React.createElement(BaseComponent, _extends({}, componentProps, this.props));
            }
        }]);

        return WithPropsFromComponent;
    }(Component);

    WithPropsFromComponent.displayName = 'withPropsFrom(' + getDisplayName(BaseComponent) + ')';

    return WithPropsFromComponent;
}