var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import ChromePicker from 'react-color/lib/components/chrome/Chrome';
import { hcl } from 'd3-color';

var ColorPicker = function (_Component) {
    _inherits(ColorPicker, _Component);

    function ColorPicker() {
        var _ref;

        _classCallCheck(this, ColorPicker);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = ColorPicker.__proto__ || Object.getPrototypeOf(ColorPicker)).call.apply(_ref, [this].concat(args)));

        _this.handleOpen = function () {
            _this.setState({ open: true });
        };

        _this.handleClose = function () {
            _this.setState({ open: false });
        };

        _this.handleChange = function (color) {
            var hexColor = color.hex.toUpperCase();

            _this.setState({ color: hexColor });
            _this.props.onChange(hexColor);
        };

        _this.state = {
            open: false,
            color: _this.props.color
        };
        return _this;
    }

    _createClass(ColorPicker, [{
        key: 'render',
        value: function render() {
            var color = this.state.color;

            var styles = {
                wrapper: {
                    position: 'relative',
                    overflow: 'visible'
                },
                color: {
                    backgroundColor: color,
                    color: hcl(color).l < 70 ? '#fff' : '#000',
                    textAlign: 'center',
                    position: 'relative',
                    width: 90,
                    height: 36,
                    lineHeight: 2.5,
                    marginTop: 10,
                    boxShadow: '0 1px 6px rgba(0,0,0,0.12),0 1px 4px rgba(0,0,0,0.12)',
                    cursor: 'pointer'
                },
                cover: {
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                picker: {
                    position: 'absolute',
                    top: -207,
                    left: 120
                }
            };

            return React.createElement(
                'div',
                { style: styles.wrapper },
                React.createElement(
                    'div',
                    { style: styles.color, onClick: this.handleOpen },
                    color
                ),
                this.state.open ? React.createElement(
                    'div',
                    { is: 'popover' },
                    React.createElement('div', { style: styles.cover, onClick: this.handleClose }),
                    React.createElement(
                        'div',
                        { style: styles.picker },
                        React.createElement(ChromePicker, { color: this.state.color, onChange: this.handleChange })
                    )
                ) : null
            );
        }
    }]);

    return ColorPicker;
}(Component);

export default ColorPicker;