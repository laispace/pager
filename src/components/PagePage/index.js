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
  theme: 'bootstrap3',
  iconlib: 'bootstrap3',
  disable_collapse: true,
  disable_edit_json: true,
  disable_properties: true,
  required_by_default: true,
});

const postPageMessage = (page) => {
  document.getElementById('pagePreviewIframe').contentWindow.postMessage({
    type: 'page',
    page: page
  }, '*');
}
const postComponentMessage = (componentIndex, component) => {
  document.getElementById('pagePreviewIframe').contentWindow.postMessage({
    type: 'component',
    componentIndex: componentIndex,
    component: component
  }, '*');
}

const emptyComponent = {
  name: '',
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
      page: {
        components: [],
        template: null
      },
      components: [],
      component: emptyComponent,
      componentIndex: -1,

      pageGenerating: false,
      pagePublishing: false,

      showComponents: false,
      showComponentSettings: false,

      deviceWidth: 375,
      deviceHeight: 627,

      editorSliderValue: 0.5,

      editorProperties: null,
      editorValues: null,

      publishUrl: ''
    };
    this.getPage(props.params.id);
    this.getComponents();
  }


  componentDidMount = () => {
    window.addEventListener("message", (event) =>  {
      // if(event.origin !== 'http://localhost:3000') return;
      if (event.data.type === 'componentIndex') {
        this.showEditComponentDialog(event.data.componentIndex);
      }
    }, false);
  }

  handleChangeEditorSlider = (event, value) => {
    this.setState({
      editorSliderValue:  value
    });
  }

  handleChangeDevice = (width, height) => {
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

  toggleComponents = () => {
    this.setState({
      showComponents: !this.state.showComponents,
      showComponentSettings: false
    });
  }
  hideComponents = () => {
    this.setState({
      showComponents: false
    });
  }
  toggleComponentSettings = () => {
    this.setState({
      showComponentSettings: !this.state.showComponentSettings
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

  getPage = (id) => {
    fetch(`/api/pages/${id}?withFileContent=1`, {
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
          page: json.page
        });
      }
    }).catch(error => {
      console.log('error: ', error);
    });
  }

  getComponents = async () => {
    try {
      const res = await fetch('/api/components?withFileContent=1', {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const json = await res.json();
      if (json.retcode === 0) {
        this.setState({
          components: json.components,
          component: json.components[0]
        })
      }
    } catch (error) {
      console.error(error);
    }
  }

  addComponentToPage = (component) => {
    let page = this.state.page;
    const componentIndex = page.components.length;
    const cloneComponent = _.cloneDeep(component);
    page.components.push(cloneComponent);
    this.setState({
      page: page
    });
    postComponentMessage(componentIndex, cloneComponent);
    this.hideComponents();
    this.showEditComponentDialog (componentIndex);
    this.showSnackbar('添加成功');
  }

  showEditComponentDialog = (componentIndex) => {
    const component = this.state.page.components[componentIndex];
    this.setState({
      componentIndex: componentIndex,
      component: component,
      showComponentSettings: true,
      showComponents: false,

      editorProperties: component.config.properties,
      editorValues: component.config.props
    });

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
      console.log('editor change: ', editor.getValue());
      for (let k in component.config.properties) {
        component.config.properties[k].default = component.config.props[k];
      }
      this.setState({
        component: component
      });
      postComponentMessage(componentIndex, component);
    });
  }

  showEditPageInfoDialog = () => {
    const page = this.state.page;
    this.setState({
      componentIndex: -1,
      // component: emptyComponent,
      showComponentSettings: true,
      showComponents: false,

      editorProperties: page.config.properties,
      editorValues: page.config.props
    });

    window.editor &&  window.editor.destroy();
    window.editor = new JSONEditor(document.getElementById("editor-holder"),{
      schema: {
        type: "object",
        properties: page.config.properties
      }
    });
    window.editor.setValue(page.config.props);
    window.editor.on('change',()=> {
      page.config.props = editor.getValue();
      console.log('editor change: ', editor.getValue());
      for (let k in page.config.properties) {
        page.config.properties[k].default = page.config.props[k];
      }
      this.setState({
        page: page
      });
      postPageMessage(page);
    });
  }


  handleComponentChange = (event) => {
    const key = event.target.dataset.key;
    const value = event.target.value;
    const componentIndex = this.state.componentIndex;
    const component = this.state.component;
    const page = this.state.page;
    component.config.props[key] = value;
    page.components[componentIndex] = component;
    this.setState({
      component: component,
      page: page
    });
  }

  updatePage = () => {
    const page = this.state.page;
    this._updatePage(page, (err, data) => {
      if (err) {
        this.showSnackbar('修改失败');
      }
      if (data.retcode === 0) {
        this.showSnackbar('修改成功');
      } else {
        this.showSnackbar('修改失败');
      }
    });
  }

  _updatePage = async (page, callback) => {
    console.log('updating page: ', page);
    let clonePage = _.cloneDeep(page);
    const _id = clonePage._id;
    // reset component's fileContent to reduce request size
    clonePage.components.forEach((item) => {
      delete item.fileContent;
    });
    try {
      const res = await fetch(`/api/pages/${_id}`, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clonePage)
      });
      const json = await res.json();
      callback(null, json);
    } catch (error) {
      console.error(error);
      callback(error);
    }
  }

  deletePageComponent = () => {
    const self = this;
    const page = this.state.page;
    const componentIndex = this.state.componentIndex;
    page.components.splice(componentIndex, 1);
    this._updatePage(page, (err, data) => {
      if (err) {
        this.showSnackbar('删除失败');
      }
      if (data.retcode === 0) {
        self.setState({
          page: page,
          componentIndex: -1, // -1 means delete
          component: emptyComponent
        });
        postPageMessage(page);
        this.hideComponentSettings();
        this.showSnackbar('删除成功');
      } else {
        this.showSnackbar('删除失败');
      }
    });
  }

  generatePage = async () => {
    const page = this.state.page;
    const _id = page._id;
    const data = {
      pageId: _id
    };
    this.setState({
      pageGenerating: true
    });
    try {
      const res = await fetch(`/api/generate/`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      this.setState({
        pageGenerating: false
      });
      const json = await res.json();
      if (json.retcode === 0) {
        this.showSnackbar('生成成功');
        // window.open(`/${page.project}/pages/${page.name}/`);
      } else {
        this.showSnackbar('生成失败');
      }
    } catch (error) {
      console.error(error);
      this.showSnackbar('生成失败');
    }
  }

  downloadPage = () => {
    const id = this.state.page._id;
    window.open(`/api/download/${id}`);
  }

  previewPage = () => {
    const page = this.state.page;
    window.open(`${page.project}/pages/${page.name}`);
  }

  publishPage = async () => {
    const page = this.state.page;
    const _id = page._id;
    const data = {
      pageId: _id
    };
    this.setState({
      pagePublishing: true
    });
    try {
      const res = await fetch(`/api/publish/`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      this.setState({
        pagePublishing: false
      });
      const json = await res.json();
      if (json.retcode === 0) {
        this.showSnackbar('发布成功');
        console.log('发布成功: ', json.publishUrl);
        this.setState({
          publishUrl: json.publishUrl
        });
        // window.open(url);
      } else {
        this.showSnackbar('发布失败');
      }
    } catch (error) {
      console.error(error);
      this.showSnackbar('发布失败');
    }
  }

  render() {
    const { width, height } = this.props.viewport;
    const self = this;
    const page = this.state.page;
    console.log('page: ', page);
    page.components = page.components ? page.components : [];
    const components = this.state.components;
    const componentIndex = this.state.componentIndex;
    const pageComponents = page.components.map((component, index) => {
      const Com = eval(component.fileContent);
      const className = classNames('component', {editing: componentIndex === index});
      return (
        <div className="component" className={className} onTouchTap={self.showEditComponentDialog.bind(self, index, component) } key={window.performance.now()}>
          <Com {...component.config.props} />
        </div>
      );
    });
    const allComponents = components.map(component => {
      const Com = eval(component.fileContent);
      return (
        <div className="component" onTouchTap={util.forceUpdate.bind(null, this)} key={component._id}>
          <Com {...component.config.props} />
          <div className="add-component-btn-wrap">
            <FlatButton label="添加" secondary={true} onTouchTap={this.addComponentToPage.bind(this, component)} className="add-component-btn" />
          </div>
        </div>
      );
    });
    return (
      <div className="PagePage">
        <Header />
        <LeftNav open={this.state.showComponents} width={this.state.deviceWidth}>
          <button onTouchTap={this.hideComponents} className="button tiny right"><i className="fa fa-times"></i></button>
          <div className="all-components" style={{height: height-150}}>
            {allComponents}
          </div>
        </LeftNav>

        <SelectField floatingLabelText={this.state.deviceWidth + '*' + this.state.deviceHeight} hintText="选择设备" autoWidth={true} value={this.state.deviceWidth + '*' + this.state.deviceHeight}>
          <MenuItem value="320*480" primaryText="iPhone4" onClick={this.handleChangeDevice.bind(this, 320, 480)} className="device-radio"/>
          <MenuItem value="320*568" primaryText="iPhone5" onClick={this.handleChangeDevice.bind(this, 320, 568)} className="device-radio"/>
          <MenuItem value="375*627" primaryText="iPhone6" onClick={this.handleChangeDevice.bind(this, 375, 627)} className="device-radio"/>
          <MenuItem value="414*736" primaryText="iPhone6S" onClick={this.handleChangeDevice.bind(this, 414, 736)} className="device-radio"/>
        </SelectField>

        <Resizable className="resizable-box" height={this.state.deviceHeight} width={this.state.deviceWidth} onResize={this.handleResize}>
          <div style={{height: this.state.deviceHeight, width: this.state.deviceWidth}}>
            <iframe id="pagePreviewIframe" className="preview-iframe" style={{width: this.state.deviceWidth - 20, height: this.state.deviceHeight - 20}} src={`/#/preview/${this.state.page._id}`} frameBorder="0"></iframe>
          </div>
        </Resizable>
        <LeftNav open={this.state.showComponentSettings} width={this.state.editorSliderValue * this.props.viewport.width} openRight={true}>
            <button onTouchTap={this.hideComponentSettings} className="button tiny"><i className="fa fa-times"></i></button>
            <div id="editor-holder" style={{height: this.props.viewport.height - 150}}></div>
            <div className="right editor-slider-wrap" style={{width: this.props.viewport.width * 0.2}}>
              <Slider name="editorSlider" onChange={this.handleChangeEditorSlider} value={this.state.editorSliderValue} min={0.3} max={0.9} step={0.01} />
            </div>
            <div className="component-action">
              <RaisedButton label="删除组件" primary={true} onTouchTap={this.deletePageComponent} />
            </div>
        </LeftNav>
        <div className="page-actions">
          <RaisedButton label="添加组件" primary={false} onTouchTap={this.toggleComponents} disabled={this.state.pageGenerating || this.state.pagePublishing} />
          <RaisedButton label="保存配置" secondary={true} onTouchTap={this.updatePage} disabled={this.state.pageGenerating || this.state.pagePublishing} />
          <RaisedButton label="设置页面信息" primary={false} onTouchTap={this.showEditPageInfoDialog} disabled={this.state.pageGenerating || this.state.pagePublishing} />
          <RaisedButton label="生成页面" primary={true} onTouchTap={this.generatePage} disabled={this.state.pageGenerating || this.state.pagePublishing} />
          <RaisedButton label="打包下载" secondary={false} linkButton={true} href={`/api/download/${this.state.page._id}`} disabled={this.state.pageGenerating || this.state.pagePublishing} />
          <RaisedButton label="发布上线" primary={true} onTouchTap={this.publishPage} disabled={this.state.pageGenerating || this.state.pagePublishing}/>
          {/*
          <RaisedButton label="新窗口预览" secondary={true} onTouchTap={this.previewPage} disabled={this.state.pageGenerating || this.state.pagePublishing} />
           */}
          <a href={this.state.publishUrl}>{this.state.publishUrl}</a>
        </div>
      </div>
    );
  }

}

export default Page;
