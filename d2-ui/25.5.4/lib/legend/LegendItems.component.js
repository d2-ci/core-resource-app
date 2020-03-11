var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, PropTypes } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DataTable from '../data-table/DataTable.component';
import EditLegendItem from './EditLegendItem.component';
import { openEditDialogFor } from './LegendItem.store';

var LegendItems = function (_Component) {
    _inherits(LegendItems, _Component);

    function LegendItems() {
        var _ref;

        _classCallCheck(this, LegendItems);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = LegendItems.__proto__ || Object.getPrototypeOf(LegendItems)).call.apply(_ref, [this].concat(args)));

        _this.onAddLegendItem = function () {
            var model = _this.context.d2.models.legend.create();
            model.color = '#FFA500'; // Orange is default

            openEditDialogFor(model);
        };

        _this.state = {
            editDialogOpen: false
        };
        return _this;
    }

    _createClass(LegendItems, [{
        key: 'render',
        value: function render() {
            var props = this.props;

            var actions = {
                edit: openEditDialogFor,
                delete: props.deleteItem
            };

            var styles = {
                component: {
                    position: 'relative'
                },
                button: {
                    float: 'right',
                    position: 'absolute',
                    right: 20,
                    top: -29
                }
            };

            var orderedItems = props.items.sort(function (left, right) {
                return Number(left.startValue) > Number(right.startValue);
            });

            return React.createElement(
                'div',
                { style: styles.component },
                React.createElement(
                    FloatingActionButton,
                    { style: styles.button, onClick: this.onAddLegendItem },
                    React.createElement(ContentAdd, null)
                ),
                React.createElement(DataTable, {
                    rows: orderedItems,
                    columns: ['name', 'startValue', 'endValue', 'color'],
                    primaryAction: function primaryAction() {},
                    contextMenuActions: actions
                }),
                React.createElement(EditLegendItem, { onItemUpdate: function onItemUpdate() {
                        return props.updateItem(props.items);
                    } })
            );
        }
    }]);

    return LegendItems;
}(Component);

export default LegendItems;


LegendItems.contextTypes = {
    d2: PropTypes.object
};

LegendItems.propTypes = {
    items: PropTypes.array.isRequired
};

LegendItems.defaultProps = {
    items: []
};