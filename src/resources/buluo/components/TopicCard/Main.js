import React, { Component } from 'react';

import styles from './style.scss';

import withStyles from '../../../../decorators/withStyles';

@withStyles(styles)
class Com extends Component {
  constructor (props) {
    super(props);
  }
  render() {
    return (
      <div className="buluo-AvatarCard">
        {
          this.props.cards.map((item) => {
            return (
              <a href={item.link} className="card-wrap">
                <div className="img-wrap">
                  <img src={item.src} alt={item.title}/>
                  <div className="link-img-text-wrap">
                    <p className="link-img-text">{item.title}</p>
                  </div>
                </div>
                <div className="link-text-wrap">
                  <p className="link-text">{item.description}</p>
                </div>
              </a>
            )
          })
        }

      </div>
    );
  }
}

export default Com;
