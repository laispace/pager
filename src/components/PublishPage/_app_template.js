import React, { PropTypes, Component } from 'react';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import ReactDOM from 'react-dom';
import Body from './body';


if (canUseDOM) {
  ReactDOM.render(<Body page={page} Coms={Coms}/>, document.getElementById('publishApp'), () => {
    console.log('ReactDOM.render');
  });
}
