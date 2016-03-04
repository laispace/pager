import React, { Component } from 'react';
import styles from './style.scss';
import { Router, Route, Link } from 'react-router'

import withStyles from '../../../decorators/withStyles';
@withStyles(styles)
class LoginTips extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
       请登陆！（天呐~这里怎么这么丑）
      </div>
    );
  }

}

export default LoginTips;
