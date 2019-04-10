import PropTypes from 'prop-types';
import React from 'react';
import { config } from 'd2/lib/d2';

config.i18n.strings.add('created_by');
config.i18n.strings.add('no_author');

var CreatedBy = function CreatedBy(_ref, context) {
    var user = _ref.user;

    var createdByText = user && user.name ? context.d2.i18n.getTranslation('created_by') + ': ' + user.name : context.d2.i18n.getTranslation('no_author');

    return React.createElement(
        'div',
        null,
        createdByText
    );
};

CreatedBy.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string
    }).isRequired
};

CreatedBy.contextTypes = {
    d2: PropTypes.object.isRequired
};

export default CreatedBy;