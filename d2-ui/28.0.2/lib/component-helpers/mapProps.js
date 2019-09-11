import React from 'react';

export default function mapProps(mapper, BaseComponent) {
    return function (props) {
        return React.createElement(BaseComponent, mapper(props));
    };
}