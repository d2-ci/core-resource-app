var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React, { PropTypes } from 'react';
import Message from './Message.component';
import mapProps from '../component-helpers/mapProps';

export default mapProps(function (props) {
  return _extends({ style: { color: 'red' } }, props);
}, Message);