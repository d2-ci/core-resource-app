import PropTypes from 'prop-types';
import React from 'react';

export default function ListSelect(props) {
    function listItemDoubleClicked(event) {
        var clickedItemValue = event.target.value;

        if (props.onItemDoubleClick) {
            props.onItemDoubleClick(clickedItemValue);
        }
    }

    var options = props.source.map(function (item) {
        return React.createElement(
            'option',
            {
                key: item.value,
                style: { padding: '.25rem' },
                onDoubleClick: listItemDoubleClicked,
                value: item.value
            },
            item.label
        );
    });

    return React.createElement(
        'div',
        { className: 'list-select' },
        React.createElement(
            'select',
            { size: props.size || 15, style: Object.assign({ overflowX: 'auto' }, props.listStyle) },
            options
        )
    );
}
ListSelect.propTypes = {
    source: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
    })).isRequired,
    onItemDoubleClick: PropTypes.func.isRequired,
    listStyle: PropTypes.object,
    size: PropTypes.number
};