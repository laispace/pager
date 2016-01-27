import React, { PropTypes, Component } from 'react';
import styles from './style.scss';

const emptyComponent = {
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
      component: emptyComponent,
    };
    this.getComponent(props.params.project, props.params.path);
  }

  componentDidMount = () => {
    window.addEventListener("message", (event) =>  {
      // if(event.origin !== 'http://localhost:3000') return;
      console.log('previewPage receives message', event);
      if (event.data.type === 'component') {
        this.setState({
          component: event.data.component
        });
      }
    }, false);
  }


  getComponent = async (project, component) => {
   try {
     const res = await fetch(`/api/localComponents/${project}/${component}`, {
       method: 'get',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       }
     });
     const json = await res.json();
     if (json.retcode === 0) {
       this.setState({
         component: json.component
       });
       console.log('json.component', json.component);
     }
   } catch (error) {
     console.error(error);
   }
  }

  render() {
    const component = this.state.component;
    const Com = eval(component.fileContent);
    return (
      <div className="component">
        {Com ? <Com {...component.config.props} /> : null}
      </div>
    );
  }

}

export default Page;
