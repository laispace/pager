import React, { Component } from 'react';

const newKey = () => {
  const key = ((Math.random()+1)*100000).toString(16);
  return key;
};

import styles from './style.scss';
import withStyles from '../../../../decorators/withStyles';
@withStyles(styles)
class Com extends Component {
  goToBarindex = (bid) => {
    const url = `http://buluo.qq.com/mobile/barindex.html?&bid=${bid}}`;
    // Util.openUrl(url, true);
    // for demo, just replace location.href
    window.location.href = url;
  };

  render() {
    console.log(this.props.collections)
    const $collections = this.props.collections.map((collection) => {
      return (
        <div key={collection.title + newKey()} className="collection">
          <h2>{collection.title}</h2>
          <ul>
            {
              collection.bids.map((bar) => {
                return (
                  <li key={bar.bid + newKey()} onTouchTap={this.goToBarindex.bind(this, bar.bid)}>
                    <img src={bar.pic_url} alt={bar.name}/>
                    <p>{bar.name}</p>
                  </li>
                )
              })
            }
          </ul>
        </div>
      )
    });
    return (
      <div className="buluo-Collection">
        {$collections}
      </div>
    );
  }
}

export default Com;
