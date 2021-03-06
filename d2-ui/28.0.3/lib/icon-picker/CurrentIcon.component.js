import React from 'react';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import IconOption from './IconOption.component';
import Translate from '../i18n/Translate.component';

export default function CurrentIcon(props) {
    if (!props.imgSrc) {
        return React.createElement(
            FlatButton,
            { onClick: props.onIconClicked },
            React.createElement(
                Translate,
                null,
                'select'
            )
        );
    }

    return React.createElement(IconOption, props);
}