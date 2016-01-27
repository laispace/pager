import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './style.css';
import Header from '../common/Header';
import Footer from '../common/Footer';

@withStyles(styles)
class Page extends Component {
  render() {
    const title = '404';
    return (
      <div>
        <Header />
        <h1>{title}</h1>
        <p>啊!没有找到页面</p>
        <Footer />
      </div>
    );
  }

}

export default Page;
