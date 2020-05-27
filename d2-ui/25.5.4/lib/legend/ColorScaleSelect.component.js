var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import ColorScale from './ColorScale.component';
import colorbrewer from './colorbrewer';
import Popover from 'material-ui/Popover/Popover';
import SelectField from 'material-ui/SelectField/SelectField';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import { config } from 'd2/lib/d2';
import Row from '../layout/Row.component';
import Column from '../layout/Column.component';

config.i18n.strings.add('number_of_items');

// Allowed color scales from ColorBrewer (needs to have at least 9 classes)
var scales = ['YlOrRd', 'Reds', 'YlGn', 'Greens', 'Blues', 'BuPu', 'RdPu', 'PuRd', 'Greys', 'YlOrBr_reverse', 'Reds_reverse', 'YlGn_reverse', 'Greens_reverse', 'Blues_reverse', 'BuPu_reverse', 'RdPu_reverse', 'PuRd_reverse', 'Greys_reverse', 'PuOr', 'BrBG', 'PRGn', 'PiYG', 'RdBu', 'RdGy', 'RdYlBu', 'Spectral', 'RdYlGn', 'Paired', 'Pastel1', 'Set1', 'Set3'];

// Renders a color scale component consisting of a changeable color scale and number of classes

var ColorScaleSelect = function (_Component) {
    _inherits(ColorScaleSelect, _Component);

    function ColorScaleSelect() {
        var _ref;

        _classCallCheck(this, ColorScaleSelect);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = ColorScaleSelect.__proto__ || Object.getPrototypeOf(ColorScaleSelect)).call.apply(_ref, [this].concat(args)));

        _this.showColorScales = function (event) {
            _this.setState({ open: true, anchorEl: event.currentTarget });
        };

        _this.onColorScaleSelect = function (event, scale) {
            _this.setState({ scale: scale, open: false });
            _this.props.onChange(_this.getColorBrewerScale(scale, _this.state.classes));
        };

        _this.onClassesChange = function (event, index, value) {
            _this.setState({ classes: value });
            _this.props.onChange(_this.getColorBrewerScale(_this.state.scale, value));
        };

        _this.onColorScalePopoverClose = function (reason) {
            _this.setState({ open: false });
        };

        _this.state = {
            open: false,
            anchorEl: null,
            scale: 'YlOrRd',
            classes: 5
        };

        _this.i18n = _this.context.d2.i18n;
        return _this;
    }

    _createClass(ColorScaleSelect, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.onChange(this.getColorBrewerScale(this.state.scale, this.state.classes));
        }

        // Show popover with allowed color scales


        // Called when a new color scale is selected in the popover


        // Called when the number of classes is changed

    }, {
        key: 'getColorBrewerScale',


        // Returns a color brewer scale for a number of classes
        value: function getColorBrewerScale(scale, classes) {
            return colorbrewer[scale][classes];
        }

        // Called when popover is closed

    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var colors = this.getColorBrewerScale(this.state.scale, this.state.classes);
            var styles = {
                scale: {
                    width: 36 * this.state.classes,
                    minWidth: 36 * this.state.classes,
                    flex: '0 0 auto'
                },
                popover: {
                    maxHeight: '60%',
                    overflowY: 'scroll'
                },
                popoverScale: {
                    display: 'block',
                    overflow: 'visible',
                    margin: '10px 0',
                    marginLeft: 20,
                    width: 36 * this.state.classes,
                    minWidth: 36 * this.state.classes,
                    whiteSpace: 'nowrap'
                }
            };
            var colorScales = scales.map(function (scale, index) {
                return React.createElement(ColorScale, { key: index, scale: scale, classes: _this2.state.classes, style: styles.popoverScale, onClick: _this2.onColorScaleSelect });
            });

            return React.createElement(
                Row,
                { style: _extends({ alignItems: 'center' }, this.props.style) },
                React.createElement(
                    SelectField,
                    { floatingLabelText: this.i18n.getTranslation('number_of_items'), value: this.state.classes, onChange: this.onClassesChange },
                    React.createElement(MenuItem, { value: 3, primaryText: '3' }),
                    React.createElement(MenuItem, { value: 4, primaryText: '4' }),
                    React.createElement(MenuItem, { value: 5, primaryText: '5' }),
                    React.createElement(MenuItem, { value: 6, primaryText: '6' }),
                    React.createElement(MenuItem, { value: 7, primaryText: '7' }),
                    React.createElement(MenuItem, { value: 8, primaryText: '8' }),
                    React.createElement(MenuItem, { value: 9, primaryText: '9' })
                ),
                React.createElement(ColorScale, { scale: this.state.scale, classes: this.state.classes, style: _extends({}, styles.scale, { margin: '0 0 0 20px' }), onClick: this.showColorScales }),
                React.createElement(
                    Popover,
                    {
                        style: styles.popover,
                        open: this.state.open,
                        anchorEl: this.state.anchorEl,
                        anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
                        targetOrigin: { horizontal: 'left', vertical: 'top' },
                        onRequestClose: this.onColorScalePopoverClose
                    },
                    React.createElement(
                        Column,
                        null,
                        colorScales
                    )
                )
            );
        }
    }]);

    return ColorScaleSelect;
}(Component);

export default ColorScaleSelect;


ColorScaleSelect.contextTypes = {
    d2: PropTypes.object
};