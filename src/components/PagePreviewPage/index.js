import React, { PropTypes, Component } from 'react';
import styles from './style.scss';

import classNames from 'classnames';

const emptyComponent = {
  name: '',
  config: {
    props: null
  }
};


import withStyles from '../../decorators/withStyles';

@withStyles(styles)
class Page extends Component {
  constructor (props) {
    super(props);
    this.state = {
      page: {
        components: [],
        template: null
      },
      componentIndex: 0
    };
    this.getPage(props.params.id);
  }

  componentDidMount = () => {
    window.addEventListener("message", (event) =>  {
      // if(event.origin !== 'http://localhost:3000') return;
      console.log('previewPage receives message', event);
      if (event.data.type === 'page') {
        this.setState({
          page: event.data.page
        });
      }
      if (event.data.type === 'component') {
        let page = this.state.page;
        const componentIndex = event.data.componentIndex;
        const component = event.data.component;
        page.components[componentIndex] = component;
        this.setState({
          componentIndex: componentIndex,
          component: component,
          page: page
        });
      }
    }, false);
  }
  handleComponentTap = (index) => {
    console.log(index);
    this.setState({
      componentIndex: index
    });
    window.parent.postMessage({
      type: 'componentIndex',
      componentIndex: index
    }, '*');
  };

  getPage = async (id) => {
    try {
      const res = await fetch(`/api/pages/${id}?withFileContent=1`, {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const json = await res.json();
      if (json.retcode === 0) {
        this.setState({
          page: json.page
        })
      }
    } catch (error) {
      console.error(error);

    }
  };

  render() {
    const page = this.state.page;
    page.components = page.components ? page.components : [];
    const componentIndex = this.state.componentIndex;
    const pageComponents = page.components.map((component, index) => {
      const Com = eval(component.fileContent);
      const className = classNames('component', {editing: componentIndex === index});
      return (
        <div className="component" className={className} onTouchTap={this.handleComponentTap.bind(this, index)} key={window.performance.now()}>
          <Com {...component.config.props} />
        </div>
      );
    });
    return (
      <div className="PreviewPage">
        <div className="page-components">
          {pageComponents}
        </div>
      </div>
    );
  }

}

export default Page;
