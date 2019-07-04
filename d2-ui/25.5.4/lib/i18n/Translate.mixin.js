import React from 'react';

var Translate = {
    contextTypes: {
        d2: React.PropTypes.object.isRequired
    },

    getTranslation: function getTranslation(key) {
        return this.context.d2.i18n.getTranslation(key);
    }
};

export default Translate;