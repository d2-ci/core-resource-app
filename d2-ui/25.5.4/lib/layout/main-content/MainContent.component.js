import React from 'react';

function MainContent(props) {
    var mainContentStyle = {
        marginBottom: '4rem',
        width: '100%'
    };

    return React.createElement(
        'div',
        { style: mainContentStyle },
        props.children
    );
}
MainContent.propTypes = {
    children: React.PropTypes.oneOfType([React.PropTypes.array.isRequired, React.PropTypes.object.isRequired])
};

export default MainContent;