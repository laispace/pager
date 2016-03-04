import React, { Component } from 'react';
import styles from './style.scss';
import { Router, Route, Link } from 'react-router'
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import Avatar from 'material-ui/lib/avatar';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import LeftNav from 'material-ui/lib/left-nav';

import withStyles from '../../../decorators/withStyles';
@withStyles(styles)
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLeftNavigation: false
    };
  }
  showLeftNavigation = () => {
    this.setState({
      showLeftNavigation: true
    });
  };
  hideLeftNavigation = () => {
    this.setState({
      showLeftNavigation: false
    });
  };

  handleRequestChange = (open) => {
    this.setState({
      showLeftNavigation: open
    });
  };

  logout = async () => {
    window.location.href = '/#/';
  };

  render() {
    return (
      <div>
        <AppBar title="Pager" onLeftIconButtonTouchTap={this.showLeftNavigation}
          iconElementRight={
            window.isAuthenticated ?
            <IconMenu
              iconButtonElement={<IconButton><Avatar src={window.user.githubProfile._json.avatar_url} /></IconButton>}
            >
              <MenuItem primaryText="设置" />
              <MenuItem primaryText="注销" onTouchTap={this.logout} />
            </IconMenu>
            :
            <FlatButton label="登录" linkButton={true} href="/api/auth/login/github" />
          }
        />
        <LeftNav docked={false} width={200} open={this.state.showLeftNavigation} onRequestChange={this.handleRequestChange}>
          <AppBar title="导航" onLeftIconButtonTouchTap={this.hideLeftNavigation}/>
          <RaisedButton  label="首页" fullWidth={true} linkButton={true} href="/#/" />
          <RaisedButton  label="项目列表" fullWidth={true} linkButton={true} href="/#/projects" />
          <RaisedButton  label="组件列表" fullWidth={true} linkButton={true} href="/#/components" />
          <RaisedButton  label="页面列表" fullWidth={true} linkButton={true} href="/#/pages" />
          <RaisedButton  label="用户列表" fullWidth={true} linkButton={true} href="/#/users" />
        </LeftNav>
      </div>
    );
  }
}

export default Header;
