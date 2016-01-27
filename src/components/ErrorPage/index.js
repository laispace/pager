import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './style.css';
import Header from '../common/Header';
import Footer from '../common/Footer';

@withStyles(styles)
class Page extends Component {
  render() {
    const title = 'Error';
    //this.context.onSetTitle(title);
    return (
      <div>
        <Header />
        <h1>{title}</h1>
        <p>Sorry, an critical error occurred on this page.</p>
        <Footer />
      </div>
    );
  }

}

export default Page;
