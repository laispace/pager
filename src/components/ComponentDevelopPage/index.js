import React, { PropTypes, Component } from 'react';
import _ from 'lodash';
import styles from './style.scss';
import editorStyles from '../common/Editor/style.scss';
import {Resizable, ResizableBox} from 'react-resizable';
import resizableStyles from '../../../node_modules/react-resizable/css/styles.css';
import foundationStyles from '../../public/foundation/css/foundation.css';
import util from '../../utils/util';
import classNames from 'classnames';
import Header from '../common/Header';
import Footer from '../common/Footer';

import {
  FlatButton,
  TextField,
  Snackbar,
  LeftNav,
  RaisedButton,
  Checkbox,
  RadioButton,
  RadioButtonGroup,
  Toggle,
  DropDownMenu,
  SelectField
  } from 'material-ui';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Slider from 'material-ui/lib/slider';
const JSONEditor = require("exports?JSONEditor!../../../node_modules/json-editor/dist/jsoneditor.js");

_.merge(JSONEditor.defaults.options, {
  theme: 'foundation5', // todo: update to foundation 6
  iconlib: 'fontawesome4',
  disable_collapse: true,
  disable_edit_json: true,
  disable_properties: true,
  required_by_default: true,
});

const emptyComponent = {
  config: {
    props: null
  }
};

import withStyles from '../../decorators/withStyles';
import withViewport from '../../decorators/withViewport';
import withSnackbar from '../../decorators/withSnackbar';

@withViewport
@withStyles(styles)
@withStyles(editorStyles)
@withStyles(foundationStyles)
@withStyles(resizableStyles)
@withSnackbar
class Page extends Component {
  constructor (props) {
    super(props);
    this.state = {
      component: emptyComponent,

      showComponentSettings: true,

      deviceWidth: 375,
      deviceHeight: 627,

      editorSliderValue: 0.5
    };
    this.getComponent(props.params.project, props.params.path);
  }

  componentDidMount = () => {
    const socket = io('http://localhost:9999');
    socket.on('connect', () => {
      console.log('connected to server.');
      socket.on('component', (data) => {
        if ((data.project === this.state.component.project) && (data.component === this.state.component.name)) {
          console.log('component changed: ', data.project, data.component);
          this.showSnackbar('本地组件已更新, 自动刷新');
          this.getComponent(data.project, data.component);
        }
      });
    });
  }

  handleChangeEditorSlider = (event, value) => {
    this.setState({
      editorSliderValue:  value
    });
  }
  handleChangeDevice = (width, height) => {
    console.log(width, height);
    if (width <= 1) {
      width *= this.props.viewport.width;
    }
    if (height <= 1) {
      height *= this.props.viewport.height;
    }

    console.log(width, height);
    this.setState({
      deviceWidth: width,
      deviceHeight: height
    });
  }
  handleResize = (event, {element, size}) => {
    this.setState({
      deviceWidth: size.width,
      deviceHeight: size.height
    });
  }

  showComponentSettings = () => {
    this.setState({
      showComponentSettings: true
    });
  }
  hideComponentSettings = () => {
    this.setState({
      showComponentSettings: false
    });
  }
  toggleComponentSettings = () => {
    this.setState({
      showComponentSettings: !this.state.showComponentSettings
    });
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
        this.showEditComponentDialog();
        console.log('json.component', json.component);
      }
    } catch (error) {
      console.error(error);
    }
  }
  showEditComponentDialog = () => {
    let component = this.state.component;
    window.editor &&  window.editor.destroy();
    window.editor = new JSONEditor(document.getElementById("editor-holder"),{
      schema: {
        type: "object",
        properties: component.config.properties
      }
    });
    window.editor.setValue(component.config.props);
    window.editor.on('change',()=> {
      component.config.props = editor.getValue();
      for (let k in component.config.properties) {
        component.config.properties[k].default = component.config.props[k];
      }
      this.setState({
        component: component
      });
      document.getElementById('componentPreviewIframe').contentWindow.postMessage({
        type: 'component',
        component: component
      }, '*');
    });
  }
  render() {
    return (
      <div className="ComponentDevelopPage">
        <Header />
        <div className="preview-container">
          <SelectField floatingLabelText="分辨率" value={this.state.deviceWidth + '*' + this.state.deviceHeight}>
            <MenuItem value="320*480" primaryText="iPhone4  320*480" onClick={this.handleChangeDevice.bind(this, 320, 480)} className="device-radio"/>
            <MenuItem value="320*568" primaryText="iPhone5  320*568" onClick={this.handleChangeDevice.bind(this, 320, 568)} className="device-radio"/>
            <MenuItem value="375*627" primaryText="iPhone6  375*627" onClick={this.handleChangeDevice.bind(this, 375, 627)} className="device-radio"/>
            <MenuItem value="414*736" primaryText="iPhone6S 414*736" onClick={this.handleChangeDevice.bind(this, 414, 736)} className="device-radio"/>
            <MenuItem value={this.props.viewport.width + '*' + this.props.viewport.height} primaryText="PC" onClick={this.handleChangeDevice.bind(this, 1, 1)} className="device-radio"/>
          </SelectField>
          <button onTouchTap={this.showComponentSettings} className="button tiny"><i className="fa fa-sun-o"></i> 显示设置面板</button>
          <Resizable className="resizable-box" height={this.state.deviceHeight} width={this.state.deviceWidth} onResize={this.handleResize}>
            <div style={{height: this.state.deviceHeight, width: this.state.deviceWidth}}>
              <iframe id="componentPreviewIframe" className="preview-iframe" style={{width: this.state.deviceWidth - 20, height: this.state.deviceHeight - 20}} onTouchTap={this.toggleComponentSettings} src={`/#/componentPreview/${this.state.component.project}/${this.state.component.name}`} frameBorder="0"></iframe>
            </div>
          </Resizable>

        </div>
        <LeftNav open={this.state.showComponentSettings} width={this.state.editorSliderValue * this.props.viewport.width} openRight={true}>
          <button onTouchTap={this.hideComponentSettings} className="button tiny"><i className="fa fa-times"></i></button>
          <div id="editor-holder" style={{height: this.props.viewport.height - 100}}></div>
          <div className="right editor-slider-wrap" style={{width: this.props.viewport.width * 0.2}}>
            <Slider name="editorSlider" onChange={this.handleChangeEditorSlider} value={this.state.editorSliderValue} min={0.3} max={0.9} step={0.01} />
          </div>
        </LeftNav>
        <Footer />
        {
          this.state.showSnackbar ?
            <Snackbar message={this.state.snackbar.message} autoHideDuration={3000} open={true}/>
            : null
        }
      </div>
    );
  }

}

export default Page;
