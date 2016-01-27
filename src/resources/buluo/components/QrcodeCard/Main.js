import React, { Component } from 'react';
import styles from './style.scss';
import withStyles from '../../../../decorators/withStyles';

//import 'script!./qrcode.js';

@withStyles(styles)
class Com extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount () {}

  render() {
    return (
      <div className="buluo-QrcodeCard">
        <div className="bar-qrcode">
          <div className="wrapper">
            <div className="logo">
              <img src="http://pub.idqqimg.com/qqun/xiaoqu/mobile/img/app-logo-with-text.png" alt="logo" />
            </div>
            <div className="qr-container">
              <div className="cover-wrapper">
                <img className="avatar" src="http://ugc.qpic.cn/gbar_pic/TtjIrvzzBk6eLBFOcWgaNpqQbD3bVywZ4Ody5lAewQBzV0Jib4TLeXQ/" alt=""/>
                <div className="bar-info-wrapper">
                  <p className="name">00000</p>
                  <div className="counts">
                    <span>成员 111</span><span className="separator">·</span><span>话题 222 </span>
                  </div>
                </div>
              </div>
              <div className="divider"></div>
              <div className="qr">
                <div id="qrcode">
                  <img style={{width: 222, height: 222}} src="http://pub.idqqimg.com/qqun/xiaoqu/buluo/share/images/qrcode.png" alt="qrcode" />
                </div>
                <div className="app-logo-wrapper">
                  <img className="app-logo" src="http://pub.idqqimg.com/qqun/xiaoqu/mobile/img/app_logo.png" />
                  </div>
                </div>
                <div className="qr-word">用手机QQ或微信扫描二维码加入部落</div>
              </div>
          </div>
          {/*
          <div className="footer">
            <p>Copyright © 1998-2015 xxxxx. All Rights Reserved.</p>
            <p>XX 公司 版权所有</p>
          </div>
           */}
          <script src="https://raw.githubusercontent.com/davidshimjs/qrcodejs/master/qrcode.js"></script>
        </div>
      </div>
    );
  }
}

export default Com;
