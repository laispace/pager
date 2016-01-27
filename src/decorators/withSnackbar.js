import React, { PropTypes, Component } from 'react'; // eslint-disable-line no-unused-vars
import emptyFunction from 'fbjs/lib/emptyFunction';
import { Snackbar} from 'material-ui';
import _ from 'lodash';

function withSnackbar (ComposedComponent) {
  return class withSnackbar extends Component {
    constructor () {
      super();
      this.state = {
        open: false,
        action: '关闭',
        autoHideDuration: 3000,
        message: '哇哈哈哈哈',
        onRequestClose: this.handleRequestClose,
        onActionTouchTap: this.hideSnackbar
      };
      ComposedComponent.prototype.showSnackbar = this.showSnackbar;
      ComposedComponent.prototype.hideSnackbar = this.hideSnackbar;
    }

    handleRequestClose = (action) => {
      console.log('action', action);
      if (action === 'timeout') {
        this.setState({
          open: false
        });
      }
    }

    showSnackbar = (options) => {
      if(options === undefined) {
        throw new Error("showSnackbar required a string or an object!");
      }
      if (typeof options === 'string') {
        options = {message: options};
      } else {
        options = options ? options : {};
      }
      options.open = true;
      this.setState(_.merge(this.state, options));
    }

    hideSnackbar = (options) => {
      options = options ? options : {};
      options.open = false;
      this.setState(_.merge(this.state, options));
    }

    render() {
      return (
        <div>
          <ComposedComponent {...this.props} />
          <Snackbar {...this.state}/>
        </div>
      );
    }

  };
}

export default withSnackbar;
