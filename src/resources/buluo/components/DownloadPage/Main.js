import React, { Component } from 'react';

import styles from './style.scss';

import withStyles from '../../../../decorators/withStyles';
import withViewport from '../../../../decorators/withViewport';

@withViewport
@withStyles(styles)
class Com extends Component {
  constructor (props) {
    super(props);
  }
  render() {
    const props = this.props;
    const pageStyles = {
      background: props.backgroundColor,
      height: this.props.viewport.height
    };
    const btnStyles = {
      background: props.btnBackgroundColor
    };
    return (
      <div style={pageStyles} className="buluo-DownloadPage">
        <div className="logo-wrap">
          <img className="logo" src={props.logo}/>
        </div>
        <div className="download-btns-wrap">
          <a style={btnStyles} href={props.iOSUrl} className="download-btn iphone">{props.iOSText}</a>
          <a style={btnStyles} href={props.androidUrl} className="download-btn android">{props.androidText}</a>
          </div>
      </div>
    );
  }
}

export default Com;
