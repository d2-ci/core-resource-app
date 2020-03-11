var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { findDOMNode } from 'react';
import GroupEditor from './GroupEditor.component';
import IconButton from 'material-ui/IconButton/IconButton';
import log from 'loglevel';

function moveItemOneSpotDownIn(currentlySelected) {
    return function (itemToFind) {
        var indexOfItem = Array.prototype.findIndex.call(currentlySelected, function (item) {
            return item === itemToFind;
        });

        // Can only move the item when the indexOfItem does not refer to the last item
        if (indexOfItem < currentlySelected.length - 1) {
            // Swap the item in the list
            var tempItem = currentlySelected[indexOfItem + 1];
            currentlySelected[indexOfItem + 1] = currentlySelected[indexOfItem];
            currentlySelected[indexOfItem] = tempItem;
        }
    };
}

function moveItemOneSpotUpIn(currentlySelected) {
    return function (itemToFind) {
        var indexOfItem = Array.prototype.findIndex.call(currentlySelected, function (item) {
            return item === itemToFind;
        });

        // Can only move the item when the indexOfItem does not refer to the first item
        if (indexOfItem > 0) {
            // Swap the item in the list
            var tempItem = currentlySelected[indexOfItem - 1];
            currentlySelected[indexOfItem - 1] = currentlySelected[indexOfItem];
            currentlySelected[indexOfItem] = tempItem;
        }
    };
}

var GroupEditorWithOrdering = function (_React$Component) {
    _inherits(GroupEditorWithOrdering, _React$Component);

    function GroupEditorWithOrdering() {
        _classCallCheck(this, GroupEditorWithOrdering);

        return _possibleConstructorReturn(this, (GroupEditorWithOrdering.__proto__ || Object.getPrototypeOf(GroupEditorWithOrdering)).apply(this, arguments));
    }

    _createClass(GroupEditorWithOrdering, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            return React.createElement(
                'div',
                { style: { paddingRight: '2.5rem', position: 'relative' } },
                React.createElement(GroupEditor, _extends({ ref: function ref(r) {
                        _this2.groupEditor = r;
                    } }, this.props)),
                React.createElement(
                    'div',
                    { style: { width: '2.5rem', position: 'absolute', top: '45%', right: 0 } },
                    React.createElement(
                        IconButton,
                        {
                            style: { color: 'rgb(33, 150, 243)' },
                            iconClassName: 'material-icons',
                            tooltip: 'Move up',
                            onClick: this._moveUp.bind(this)
                        },
                        'arrow_upward'
                    ),
                    React.createElement(
                        IconButton,
                        {
                            style: { color: 'rgb(33, 150, 243)' },
                            iconClassName: 'material-icons',
                            tooltip: 'Move down',
                            onClick: this._moveDown.bind(this)
                        },
                        'arrow_downward'
                    )
                )
            );
        }
    }, {
        key: '_moveUp',
        value: function _moveUp() {
            if (!Array.isArray(this.props.assignedItemStore.getState())) {
                return log.warn('Moving in <GroupEditorWithOrdering /> is not supported (yet) when the assignedItemStore\'s state is a ModelCollectionProperty');
            }

            var currentlySelected = Array.from(this.props.assignedItemStore.getState());
            var itemsToMoveUp = this.groupEditor.getSelectedItems();

            itemsToMoveUp.forEach(moveItemOneSpotUpIn(currentlySelected));

            // Emit the changed order to the event handler
            this.props.onOrderChanged(currentlySelected);
        }
    }, {
        key: '_moveDown',
        value: function _moveDown() {
            if (!Array.isArray(this.props.assignedItemStore.getState())) {
                return log.warn('Moving in <GroupEditorWithOrdering /> is not supported (yet) when the assignedItemStore\'s state is a ModelCollectionProperty');
            }

            var currentlySelected = Array.from(this.props.assignedItemStore.getState());
            var itemsToMoveDown = this.groupEditor.getSelectedItems();

            itemsToMoveDown.reverse() // Reverse the list to move the items lower in the list first
            .forEach(moveItemOneSpotDownIn(currentlySelected));

            // Emit the changed order to the event handler
            this.props.onOrderChanged(currentlySelected);
        }
    }]);

    return GroupEditorWithOrdering;
}(React.Component);

export default GroupEditorWithOrdering;

GroupEditorWithOrdering.propTypes = {
    onOrderChanged: React.PropTypes.func
};
GroupEditorWithOrdering.defaultProps = {
    onOrderChanged: function onOrderChanged() {}
};