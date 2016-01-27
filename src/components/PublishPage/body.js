import React, { PropTypes, Component } from 'react';

const newKey = () => {
  const key = ((Math.random()+1)*100000).toString(16);
  return key;
};


import normalizeStyles from '../../../node_modules/normalize.css/normalize.css';
import withStyles from '../../decorators/withStyles';
@withStyles(normalizeStyles)
class Page extends Component {
  render() {
    const components = this.props.page.components;
    const coms = components.map((component, index) => {
      let Com;
      console.log('this.props.serverRendering', this.props.serverRendering);
      if (this.props.serverRendering) {
        // todo felix
        console.log('serverRendering!!!!!!!', component.fileContent.length);
        Com = eval(component.fileContent);
      } else {
        Com = this.props.Coms[index];
      }
      return (
        <div className="component" key={newKey()}>
          <Com {...component.config.props} />
        </div>
      );
    });
    return (
      <div className="PreviewPage">
        { coms }
      </div>
    );
  }
}

export default Page;

