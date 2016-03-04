import React, { PropTypes, Component } from 'react';
import styles from './style.css';
import _ from 'lodash';
import { FlatButton, Dialog, TextField, Snackbar} from 'material-ui';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableFooter, TableRow, TableRowColumn} from 'material-ui/lib/table';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Header from '../common/Header';
import Footer from '../common/Footer';
import LoginTips from '../common/LoginTips';

const emptyProject = {
  name: '',
  description: '',
  baseUrl: '',
  owner: '',
  publishIp: '',
  publishPath: '',
  rsyncUsername: '',
  rsyncPassword: ''
};

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
      height: (props.viewport.height - 215) + 'px',

      projects: [],
      showProjectDialog: false,
      selectedProjectIndex: -1,

      dialogType: 'create', // create/update
      project: emptyProject
    };
    this.getProjects();
  }

  getProjects = async () => {
    try {
      const res = await fetch('/api/projects', {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const json = await res.json();
      if (json.retcode === 0) {
        this.setState({
          projects: json.projects
        })
      }
    } catch (error) {
      console.error(error);
    }
  }

  showCreateProjectDialog = () => {
    // set default owner to current user
    if (window.user) {
      emptyProject.owner = window.user._id;
    }
    this.setState({
      dialogType: 'create',
      project: emptyProject
    });
    this.showProjectDialog();
  }

  showUpdateProjectDialog = () => {
    const selectedProjectIndex = this.state.selectedProjectIndex;
    const project = _.cloneDeep(this.state.projects[selectedProjectIndex]);
    this.setState({
      dialogType: 'update',
      project: project
    });
    this.showProjectDialog();
  }

  showProjectDialog = () => {
    this.setState({
      showProjectDialog: true
    });
  }

  closeProjectDialog = () => {
    this.setState({
      showProjectDialog: false
    });
  }

  createProject = async () => {
    try {
      const res = await fetch('/api/projects', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.project)
      });
      const json = await res.json();
      if (json.retcode === 0) {
        let projects = this.state.projects;
        projects.push(json.project);
        this.setState({
          projects: projects,
          showProjectDialog: false
        });
        this.showSnackbar('创建成功');
      } else if (json.retcode === 10001) {
        alert('项目名已存在');
      }
    } catch (error) {
      console.error(error);
    }
  }

  updateProject = async () => {
    const project = this.state.project;
    const _id = project._id;
    try {
      const res = await fetch(`/api/projects/${_id}`, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.project)
      });
      const json = await res.json();
      if (json.retcode === 0) {
        let projects = this.state.projects;
        const selectedProjectIndex = this.state.selectedProjectIndex;
        projects[selectedProjectIndex] = this.state.project;
        this.setState({
          projects: projects,
          showProjectDialog: false
        });
        this.showSnackbar('更新成功');
      }
    } catch (error) {
      console.error(error);
    }
  }

  removeProject = async () => {
    const selectedProjectIndex = this.state.selectedProjectIndex;
    if (selectedProjectIndex === -1) {
      alert('请选择要删除的项目');
    } else {
      const confirmDelete = confirm('确定删除?');
      if (confirmDelete) {
        const selectedProject = this.state.projects[selectedProjectIndex];
        const selectedProjectId = selectedProject._id;
        try {
          const res = await fetch(`/api/projects/${selectedProjectId}`, {
            method: 'delete',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          const json = await res.json();
          if (json.retcode === 0) {
            let projects = this.state.projects;
            projects.splice(selectedProjectIndex, 1);
            this.setState({
              projects: projects,
              selectedProjectIndex: -1
            });
            this.showSnackbar('删除成功');
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  handleRowSelection = (selectedRows) => {
    if (selectedRows.length > 0) {
      const selectedProjectIndex = selectedRows[0];
      let projects = this.state.projects;
      projects.forEach(project => {
        project.selected = false;
      });
      projects[selectedProjectIndex].selected = true;
      this.setState({
        selectedProjectIndex: selectedProjectIndex,
        projects: projects
      });
    } else {
      const selectedProjectIndex = this.state.selectedProjectIndex;
      let projects = this.state.projects;
      projects[selectedProjectIndex].selected = false;
      this.setState({
        selectedProjectIndex: -1,
        projects: projects
      });
    }
  }

  handleChangeProject = (key) => {
    let project = this.state.project;
    project[key] = this.refs[key].getValue();
    this.setState({
      project: project
    });
  }

  handleChangeProjectOwner = (event, index, value) => {
    let project = this.state.project;
    project.owner = value;
    this.setState({
      project: project
    });
  }

  render() {
    const projects = this.state.projects || [];
    const dialogType = this.state.dialogType;
    let label;
    let action = this.createProject;
    if (dialogType === 'create') {
      label = '新建项目';
      action = this.createProject;
    } else if (dialogType === 'update') {
      label = '修改项目';
      action = this.updateProject;
    }
    let customActions = [
      <FlatButton
        label="取消"
        secondary={true}
        onTouchTap={this.closeProjectDialog} />,
      <FlatButton
        label= { label }
        primary={true}
        onClick={ action } />
    ];

    return (
      <div className="ProjectsPage">
        <Header />
        {
          window.isAuthenticated ?
            <div className="ProjectsPage-container">
              <Table
                height={this.state.height}
                fixedHeader={this.state.fixedHeader}
                fixedFooter={this.state.fixedFooter}
                selectable={this.state.selectable}
                multiSelectable={this.state.multiSelectable}
                onRowSelection={this.handleRowSelection}>
                <TableHeader enableSelectAll={this.state.enableSelectAll}>
                  <TableRow>
                    <TableHeaderColumn>项目</TableHeaderColumn>
                    <TableHeaderColumn>简介</TableHeaderColumn>
                    <TableHeaderColumn>地址</TableHeaderColumn>
                    <TableHeaderColumn>负责人</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody
                  deselectOnClickaway={this.state.deselectOnClickaway}
                  showRowHover={this.state.showRowHover}
                  stripedRows={this.state.stripedRows}>
                  {
                    projects.map(project => {
                      const ownerIndex = _.findIndex(window.users, {_id: project.owner});
                      const ownerName = window.users[ownerIndex].name;
                      return (
                        <TableRow key={project._id} selected={project.selected} selectable={project.owner === window.user._id}>
                          <TableRowColumn>{project.name}</TableRowColumn>
                          <TableRowColumn>{project.description}</TableRowColumn>
                          <TableRowColumn>{project.baseUrl}</TableRowColumn>
                          <TableRowColumn>{ownerName}</TableRowColumn>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
              <FlatButton label="新建" secondary={true} onTouchTap={this.showCreateProjectDialog} disabled={this.state.selectedProjectIndex >= 0} />
              <FlatButton label="编辑"                   onTouchTap={this.showUpdateProjectDialog} disabled={this.state.selectedProjectIndex === -1}/>
              <FlatButton label="删除" primary={true}   onTouchTap={this.removeProject} disabled={this.state.selectedProjectIndex === -1}/>

              <Dialog
                title={label}
                actions={customActions}
                autoScrollBodyContent={true}
                open={this.state.showProjectDialog}
                onRequestClose={this.closeProjectDialog}>
                <div>
                  <TextField ref="name" floatingLabelText="名字" hintText="buluo" fullWidth={true} defaultValue={this.state.project.name} onChange={this.handleChangeProject.bind(this, 'name')} disabled={this.state.dialogType==='update'}/>
                </div>
                <div>
                  <TextField ref="description" floatingLabelText="简介" hintText="兴趣部落" fullWidth={true} defaultValue={this.state.project.description} onChange={this.handleChangeProject.bind(this, 'description')} />
                </div>
                <div>
                  <TextField ref="baseUrl" floatingLabelText="基础路径" hintText="http://buluo.qq.com/huodong/" fullWidth={true} defaultValue={this.state.project.baseUrl} onChange={this.handleChangeProject.bind(this, 'baseUrl')} />
                </div>
                <div>
                  <SelectField floatingLabelText="负责人" value={this.state.project.owner} onChange={this.handleChangeProjectOwner}>
                    {
                      window.users && window.users.map((user) => {
                        return <MenuItem value={user._id} key={user._id} primaryText={user.name} />
                      })
                    }
                  </SelectField>
                </div>
                <div>
                  <TextField ref="publishIp" floatingLabelText="发布IP" hintText="10.11.22.33" fullWidth={true} defaultValue={this.state.project.publishIp} onChange={this.handleChangeProject.bind(this, 'publishIp')} />
                </div>
                <div>
                  <TextField ref="publishPath" floatingLabelText="发布路径" hintText="/data/sites/buluo.qq.com/huodong/" fullWidth={true} defaultValue={this.state.project.publishPath} onChange={this.handleChangeProject.bind(this, 'publishPath')} />
                </div>
                <div>
                  <TextField ref="rsyncUsername" floatingLabelText="rsync用户" hintText="user4rsync" fullWidth={true} defaultValue={this.state.project.rsyncUsername} onChange={this.handleChangeProject.bind(this, 'rsyncUsername')} />
                </div>
                <div>
                  <TextField ref="rsyncPassword" floatingLabelText="rsync密码" hintText="pass4rsync" fullWidth={true} defaultValue={this.state.project.rsyncPassword} onChange={this.handleChangeProject.bind(this, 'rsyncPassword')} />
                </div>
              </Dialog>
            </div>
            : <LoginTips />
        }

        <Footer />
      </div>
    );
  }

}

export default Page;
