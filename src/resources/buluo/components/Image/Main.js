import React, { Component } from 'react';

import styles from './style.scss';

import withStyles from '../../../../decorators/withStyles';

@withStyles(styles)
class Com extends Component {
  constructor (props) {
    super(props);
  }
  render() {
    const imgs = this.props.imgs;
    return (
      <div className="buluo-Image">
        {
          imgs.map(item => {
            return (
              <a key={window.performance.now()} href={item.link}>
                <img src={item.src}/>
              </a>);
          })
        }
      </div>
    );
  }
}

export default Com;
