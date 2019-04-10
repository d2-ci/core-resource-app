var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField/TextField';
import RaisedButton from 'material-ui/RaisedButton/RaisedButton';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import Dialog from 'material-ui/Dialog/Dialog';
import ColorScaleSelect from './ColorScaleSelect.component';
import LegendItems from './LegendItems.component';
import { scaleLinear } from 'd3-scale';
import { precisionFixed } from 'd3-format';
import { config } from 'd2/lib/d2';
import { legendItemStore } from './LegendItem.store';
import Row from '../layout/Row.component';
import Column from '../layout/Column.component';

config.i18n.strings.add('start_value');
config.i18n.strings.add('end_value');
config.i18n.strings.add('required');
config.i18n.strings.add('cancel');
config.i18n.strings.add('proceed');
config.i18n.strings.add('needs_to_be_bigger_than_start_value');
config.i18n.strings.add('are_you_sure');
config.i18n.strings.add('this_will_replace_the_current_legend_items');
config.i18n.strings.add('create_legend_items');

var Legend = function (_Component) {
    _inherits(Legend, _Component);

    function Legend() {
        var _ref;

        _classCallCheck(this, Legend);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = Legend.__proto__ || Object.getPrototypeOf(Legend)).call.apply(_ref, [this].concat(args)));

        _this.onStartValueChange = function (event) {
            _this.setState({ startValue: event.target.value }, _this.validateForm);
        };

        _this.onEndValueChange = function (event) {
            _this.setState({ endValue: event.target.value }, _this.validateForm);
        };

        _this.onColorScaleChange = function (colorScheme) {
            _this.setState({ colorScheme: colorScheme });
        };

        _this.createLegendItems = function () {
            var d2 = _this.context.d2;
            var _this$state = _this.state,
                startValue = _this$state.startValue,
                endValue = _this$state.endValue,
                classes = _this$state.classes,
                colorScheme = _this$state.colorScheme;

            var scale = scaleLinear().domain([startValue, endValue]).rangeRound([0, colorScheme.length]);
            var step = (endValue - startValue) / colorScheme.length;
            var precision = precisionFixed(step); // https://github.com/d3/d3-format#precisionFixed

            var items = colorScheme.map(function (color, index) {
                var legend = d2.models.legend.create();

                legend.startValue = scale.invert(index).toFixed(precision);
                legend.endValue = scale.invert(index + 1).toFixed(precision);
                legend.color = color;
                legend.name = legend.startValue + ' - ' + legend.endValue;

                return legend;
            });

            _this.props.onItemsChange(items);
        };

        _this.deleteItem = function (modelToDelete) {
            var newItems = _this.props.items.filter(function (model) {
                return model !== modelToDelete;
            });
            _this.props.onItemsChange(newItems);
        };

        _this.updateItem = function (newItems) {
            var modelToUpdate = legendItemStore.getState() && legendItemStore.getState().model;
            var isNewLegendItem = newItems.every(function (model) {
                return model !== modelToUpdate;
            });

            return _this.props.onItemsChange([].concat(newItems, isNewLegendItem ? modelToUpdate : []));
        };

        _this.validateForm = function () {
            var _this$state2 = _this.state,
                startValue = _this$state2.startValue,
                endValue = _this$state2.endValue;

            // Check if start or end value is empty

            if (startValue === '' || endValue === '') {
                _this.setState({
                    errorMessage: {
                        startValue: startValue === '' ? _this.i18n.getTranslation('required') : '',
                        endValue: endValue === '' ? _this.i18n.getTranslation('required') : ''
                    },
                    createLegendDisabled: true
                });
                return;
            }

            // Check if end value is less than start value
            if (Number(endValue) <= Number(startValue)) {
                _this.setState({
                    errorMessage: {
                        startValue: Number(startValue) >= Number(endValue) ? _this.i18n.getTranslation('should_be_lower_than_end_value') : '',
                        endValue: Number(endValue) <= Number(startValue) ? _this.i18n.getTranslation('should_be_higher_than_start_value') : ''
                    },
                    createLegendDisabled: true
                });
                return;
            }

            // All OK
            _this.setState({
                errorMessage: {
                    startValue: '',
                    endValue: ''
                },
                createLegendDisabled: false
            });
        };

        _this.displayWarning = function () {
            _this.setState({ warningDialogOpen: true });
        };

        _this.handleClose = function () {
            _this.setState({ warningDialogOpen: false }, function () {
                return _this.createLegendItems();
            } // Callback for after state update
            );
        };

        _this.state = {
            startValue: 0,
            endValue: 100,
            warningDialogOpen: false,
            errorMessage: {},
            createLegendDisabled: false
        };

        _this.i18n = _this.context.d2.i18n;
        return _this;
    }

    // Check if end value is bigger than start value


    // Display warning that current legend items will be deleted


    _createClass(Legend, [{
        key: 'render',
        value: function render() {
            var actions = [React.createElement(FlatButton, {
                label: this.i18n.getTranslation('cancel'),
                secondary: true,
                onTouchTap: this.handleClose
            }), React.createElement(FlatButton, {
                label: this.i18n.getTranslation('proceed'),
                primary: true,
                onTouchTap: this.handleClose
            })];

            var styles = {
                textField: {
                    marginRight: 20,
                    minWidth: '150px',
                    flex: '1 1 auto'
                },
                errorStyle: {
                    float: 'left'
                },
                button: {
                    flex: '1 0 auto',
                    minWidth: '150px',
                    marginLeft: 20
                },
                legendGenerator: {
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '40px'
                },
                colorScaleSelect: {}
            };

            return React.createElement(
                Column,
                null,
                React.createElement(
                    Row,
                    { style: styles.legendGenerator },
                    React.createElement(TextField, {
                        type: 'number',
                        style: styles.textField,
                        floatingLabelText: this.i18n.getTranslation('start_value'),
                        value: this.state.startValue,
                        onChange: this.onStartValueChange,
                        errorText: this.state.errorMessage.startValue,
                        errorStyle: styles.errorStyle
                    }),
                    React.createElement(TextField, {
                        type: 'number',
                        style: styles.textField,
                        floatingLabelText: this.i18n.getTranslation('end_value'),
                        value: this.state.endValue,
                        onChange: this.onEndValueChange,
                        errorText: this.state.errorMessage.endValue,
                        errorStyle: styles.errorStyle
                    }),
                    React.createElement(ColorScaleSelect, {
                        style: styles.colorScaleSelect,
                        onChange: this.onColorScaleChange
                    }),
                    React.createElement(RaisedButton, {
                        style: styles.button,
                        label: this.i18n.getTranslation('create_legend_items'),
                        onClick: this.displayWarning,
                        disabled: this.state.createLegendDisabled
                    })
                ),
                React.createElement(LegendItems, {
                    items: this.props.items,
                    updateItem: this.updateItem,
                    deleteItem: this.deleteItem
                }),
                React.createElement(
                    Dialog,
                    {
                        title: this.i18n.getTranslation('are_you_sure'),
                        actions: actions,
                        modal: false,
                        open: this.state.warningDialogOpen,
                        onRequestClose: this.handleClose,
                        autoScrollBodyContent: true
                    },
                    this.i18n.getTranslation('this_will_replace_the_current_legend_items')
                )
            );
        }
    }]);

    return Legend;
}(Component);

export default Legend;


Legend.propTypes = {
    items: PropTypes.array.isRequired
};

Legend.contextTypes = {
    d2: PropTypes.object
};