import React, { PropTypes, Component } from 'react';
import styles from './style.scss';
import withStyles from '../../decorators/withStyles';
import withViewport from '../../decorators/withViewport';
import { RaisedButton, TextField } from 'material-ui';
import classNames from 'classnames';
import Header from '../common/Header';
import Footer from '../common/Footer';


@withViewport
@withStyles(styles)
class Page extends Component {
  constructor (props) {
    super(props);
  }

  render() {
    const width = this.props.viewport.width;
    const height = 1012 * width / 1920;
    return (
      <div className="HomePage">
        <Header />
        <div className="container" style={{width: width,  height: height}}>
          <div className="action-btn">
            <RaisedButton  label="立即体验" primary={true} linkButton={true} href="/#/pages" />
          </div>
        </div>
      </div>
    );
  }

}

export default Page;
