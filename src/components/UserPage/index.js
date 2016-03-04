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
    this.state = {
      user: null
    };
    this.getUser(props.params.id);
  }

  getUser = (id) => {
    fetch(`/api/users/${id}`, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json();
    }).then(json => {
      if (json.retcode === 0) {
        this.setState({
          user: json.user
        });
      }
    }).catch(error => {
      console.log('error: ', error);
    });
  };

  render() {
    return (
      <div className="UserPage">
        <Header />
        <div className="container">
          {
            this.state.user ?
              <div>
                <div>_id: {this.state.user._id}</div>
                <div>type: {this.state.user.type}</div>
                {JSON.stringify(this.state.user)}
              </div>
              : null
          }
        </div>
      </div>
    );
  }

}

export default Page;
