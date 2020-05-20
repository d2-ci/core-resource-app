import React from 'react';

var Auth = {
    contextTypes: {
        d2: React.PropTypes.object.isRequired
    },

    getCurrentUser: function getCurrentUser() {
        return this.context.d2.currentUser;
    },
    getModelDefinitionByName: function getModelDefinitionByName(modelType) {
        return this.context.d2.models[modelType];
    }
};

export default Auth;