import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import Location from './core/Location';
import { addEventListener, removeEventListener } from './utils/DOMUtils';
import Routes from './routes';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

// Make taps on links and buttons work fast on mobiles
FastClick.attach(document.body);

ReactDOM.render(<Routes />, document.getElementById('app'));
