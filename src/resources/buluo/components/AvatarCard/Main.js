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
    const imgStyle = {
      width: this.props.imgWidth,
      height: this.props.imgHeight,
      borderRadius: parseInt(this.props.imgWidth, 10)/2
    };
    const cardStyle = {
      display: 'inline-block',
      width: (100 / this.props.imgCountsPerLine) + '%',
      textAlign: 'center'
    };
    const titleStyle = {
      width: this.props.imgWidth
    };
    return (
      <div className="buluo-AvatarCard">
        {
          imgs.map(item => {
            return (
              <a style={cardStyle} key={window.performance.now()} href={item.link}>
                <img style={imgStyle} src={item.src}/>
                <p style={titleStyle} className="title">{item.title}</p>
              </a>);
          })
        }
      </div>
    );
  }
}

export default Com;
