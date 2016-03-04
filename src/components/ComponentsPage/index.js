import React, { PropTypes, Component } from 'react';
import { Router, Route, Link } from 'react-router';
import _ from 'lodash';
import styles from './style.css';
import { FlatButton, Snackbar } from 'material-ui';
import { Table, TableBody, TableHeader,TableHeaderColumn, TableFooter, TableRow, TableRowColumn} from 'material-ui/lib/table';
import Header from '../common/Header';
import Footer from '../common/Footer';

import withStyles from '../../decorators/withStyles';
import withViewport from '../../decorators/withViewport';
import withSnackbar from '../../decorators/withSnackbar';
@withViewport
@withStyles(styles)
@withSnackbar
class Page extends Component {
  constructor (props) {
    super(props);
    this.state = {
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: false,
      height: ((props.viewport.height - 460) / 2) + 'px',

      components: [],
      selectedComponentIndex: -1,

      localComponents: [],
      selectedLocalComponentIndex: -1,
    };
    this.getComponents();
    this.getLocalComponents();
  }
  getComponents = async () => {
    try {
      const res = await fetch('/api/components', {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const json = await res.json();
      if (json.retcode === 0) {
        this.setState({
          components: json.components
        })
      }
    } catch (error) {
      console.error(error);
    }
  }
  removeComponent = async () => {
    const selectedComponentIndex = this.state.selectedComponentIndex;
    if (selectedComponentIndex === -1) {
      alert('请选择要删除的项目');
    } else {
      const selectedComponent = this.state.components[selectedComponentIndex];
      const selectedComponentId = selectedComponent._id;
      try {
        const res = await fetch(`/api/components/${selectedComponentId}`, {
          method: 'delete',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        const json = await res.json();
        if (json.retcode === 0) {
          let components = this.state.components;
          components.splice(selectedComponentIndex, 1);
          this.setState({
            components: components,
            selectedComponentIndex: -1
          })
          this.showSnackbar('删除成功');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  handleRowSelection = (selectedRows) => {
    if (selectedRows.length > 0) {
      const index = selectedRows[0];
      let components = this.state.components;
      components.forEach(component => {
        component.selected = false;
      });
      components[index].selected = true;
      this.setState({
        selectedComponentIndex: index,
        component: components
      });
    } else {
      const index = this.state.selectedComponentIndex;
      let components = this.state.components;
      components[index].selected = false;

      this.setState({
        selectedComponentIndex: -1,
        components: components
      });
    }
  }
  handleRowSelection2 = (selectedRows) => {
    if (selectedRows.length > 0) {
      const selectedLocalComponentIndex = selectedRows[0];
      let components = this.state.localComponents;
      components.forEach(component => {
        component.selected = false;
      });
      components[selectedLocalComponentIndex].selected = true;
      this.setState({
        selectedLocalComponentIndex: selectedLocalComponentIndex,
        localComponents: components
      });
    } else {
      const selectedLocalComponentIndex = this.state.selectedLocalComponentIndex;
      let components = this.state.localComponents;
      components[selectedLocalComponentIndex].selected = false;
      this.setState({
        selectedLocalComponentIndex: -1,
        localComponents: components
      });
    }
  }
  getLocalComponents = async () => {
    try {
      const res = await fetch('/api/sync/components');
      const json = await res.json();
      if (json.retcode === 0) {
        this.setState({
          localComponents: json.components
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  developLocalComponent = () => {
    const index = this.state.selectedLocalComponentIndex;
    const component = this.state.localComponents[index];
    window.location.href = `/#/develop/${component.project}/${component.name}`;
  }
  syncLocalComponent = async () => {
    const index = this.state.selectedLocalComponentIndex;
    const component = this.state.localComponents[index];
    try {
      const res = await fetch('/api/components', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(component)
      });
      const json = await res.json();
      if (json.retcode === 0) {
        let components = this.state.components;
        if (json.exists) {
          // 更新组件
          components.forEach((item, index) => {
            if (item.project === json.component.project && item.path === json.component.path) {
              components[index] = json.component;
            }
          });

          this.showSnackbar('更新组件成功');
        } else {
          // 新增组件
          components.push(json.component);
          this.showSnackbar('新增组件成功');
        }
        this.setState({
          components: components
        })
      }
    } catch (error) {
      console.error(error);
      this.showSnackbar('同步失败');
    }
  }
  render() {
    // this.context.onSetTitle(this.props.title);
    const components = this.state.components;
    const localComponents = this.state.localComponents;
    return (
      <div className="ComponentPage">
        <Header />
        <div className="ComponentPage-container">
          <Table height={this.state.height}
                 fixedHeader={this.state.fixedHeader}
                 fixedFooter={this.state.fixedFooter}
                 selectable={this.state.selectable}
                 multiSelectable={this.state.multiSelectable}
                 onRowSelection={this.handleRowSelection}>
            <TableHeader enableSelectAll={this.state.enableSelectAll}>
              <TableRow>
                <TableHeaderColumn colSpan="3">
                  数据库中组件列表
                </TableHeaderColumn>
              </TableRow>
              <TableRow>
                <TableHeaderColumn>项目</TableHeaderColumn>
                <TableHeaderColumn>名字</TableHeaderColumn>
                <TableHeaderColumn>简介</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={this.state.deselectOnClickaway}
                       showRowHover={this.state.showRowHover}
                       stripedRows={this.state.stripedRows}>
              {
                components.map(component => {
                  return (
                    <TableRow key={component._id} selected={component.selected}>
                      <TableRowColumn>{component.project}</TableRowColumn>
                      <TableRowColumn>{component.name}</TableRowColumn>
                      <TableRowColumn>{component.description}</TableRowColumn>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
          <FlatButton label="删除" primary={true}   onTouchTap={this.removeComponent} disabled={this.state.selectedComponentIndex === -1}/>
          <br/><br/><br/>
          <div>
            <Table height={this.state.height}
                   fixedHeader={this.state.fixedHeader}
                   fixedFooter={this.state.fixedFooter}
                   selectable={this.state.selectable}
                   multiSelectable={this.state.multiSelectable}
                   onRowSelection={this.handleRowSelection2}>
              <TableHeader enableSelectAll={this.state.enableSelectAll}>
                <TableRow>
                  <TableHeaderColumn colSpan="3">
                    本地组件列表
                  </TableHeaderColumn>
                </TableRow>
                <TableRow>
                  <TableHeaderColumn>项目</TableHeaderColumn>
                  <TableHeaderColumn>名字</TableHeaderColumn>
                  <TableHeaderColumn>简介</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody deselectOnClickaway={this.state.deselectOnClickaway}
                         showRowHover={this.state.showRowHover}
                         stripedRows={this.state.stripedRows}>
                {
                  localComponents.map(component => {
                    return (
                      <TableRow key={'local-' + component.project + component.name} selected={component.selected}>
                        <TableRowColumn>{component.project}</TableRowColumn>
                        <TableRowColumn>{component.name}</TableRowColumn>
                        <TableRowColumn>{component.description}</TableRowColumn>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
            <FlatButton label="同步所选本地组件到数据库" secondary={true} onTouchTap={this.syncLocalComponent} disabled={this.state.selectedLocalComponentIndex === -1} />
            <FlatButton label="开发调试本地组件" secondary={true} onTouchTap={this.developLocalComponent} disabled={this.state.selectedLocalComponentIndex === -1} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Page
