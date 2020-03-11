import React from 'react';
import addD2Context from '../component-helpers/addD2Context';
import { isString } from 'lodash/fp';
import { isFunction } from 'lodash/fp';
import log from 'loglevel';

function hasAccessToD2TranslationFunction(context) {
    return context.d2 && context.d2.i18n && isFunction(context.d2.i18n.getTranslation);
}

function Translate(props, context) {
    if (!isString(props.children)) {
        log.error('<Translate /> requires a string to be passed as a child in order for it to translate. e.g. <Translate>string_to_translate</Translate>');
        return React.createElement('span', null);
    }

    if (!hasAccessToD2TranslationFunction(context)) {
        log.error('<Translate />: d2 is not available on the `context`');
        return React.createElement('span', null);
    }

    return React.createElement(
        'span',
        null,
        context.d2.i18n.getTranslation(props.children)
    );
}

export default addD2Context(Translate);