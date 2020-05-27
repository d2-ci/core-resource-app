import React from 'react';
import FlatButton from 'material-ui/FlatButton/FlatButton';

export default function IconOption(props) {
    return React.createElement(
        FlatButton,
        { onClick: function onClick(event) {
                return props.onIconClicked(event, props.value);
            } },
        React.createElement('img', { src: props.imgSrc })
    );
}