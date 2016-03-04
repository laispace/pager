import React, { PropTypes, Component } from 'react';
import styles from './style.css';
import { Router, Route, Link } from 'react-router';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { FlatButton, Dialog, TextField, DropdownMenu} from 'material-ui';
import { Table, TableBody, TableHeader,TableHeaderColumn, TableFooter, TableRow, TableRowColumn } from 'material-ui/lib/table';
import Menu from 'material-ui/lib/menus/menu';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/menus/menu-divider';
import SelectField from 'material-ui/lib/select-field';

const emptyPage = {
  name: '',
  description: '',
  project: '',
  owner: ''
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

      pages: [],
      showPageDialog: false,
      selectedPageIndex: null,


      dialogType: 'create', // create/update
      page: emptyPage
    };
    this.getProjects();
    this.getPages();
  }

  getPages = async () => {
    try {
      const res = await fetch('/api/pages', {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const json = await res.json();
      if (json.retcode === 0) {
        this.setState({
          pages: json.pages
        })
      }
    } catch (error) {
      console.error(error);
    }
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


  showCreatePageDialog = () => {
    // set default owner to current user
    if (window.user) {
      emptyPage.owner = window.user._id;
    }
    this.setState({
      dialogType: 'create',
      page: emptyPage
    });
    this.showPageDialog();
  }
  showUpdatePageDialog = () => {
    const selectedPageIndex = this.state.selectedPageIndex;
    const page = this.state.pages[selectedPageIndex];
    this.setState({
      dialogType: 'update',
      page: page
    });
    this.showPageDialog();
  }

  showPageDialog = () => {
    this.setState({
      showPageDialog: true
    });
  }

  closePageDialog = () => {
    this.setState({
      showPageDialog: false
    });
  }

  createPage = async () => {
    try {
      const res = await fetch('/api/pages', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.page)
      });
      const json = await res.json();
      if (json.retcode === 0) {
        let pages = this.state.pages;
        pages.unshift(json.page);
        this.setState({
          pages: pages,
          showPageDialog: false
        });
        this.showSnackbar('创建成功');
        window.location.href = `/#/pages/${json.page._id}`;
      } else if (json.retcode === 10001) {
        alert('项目' + this.state.page.project + '下已存在' + this.state.page.name);
      }
    } catch (error) {
      console.error(error);
    }
  }

  updatePage = async () => {
    const selectedPageIndex = this.state.selectedPageIndex;
    const _id = this.state.pages[selectedPageIndex]._id;
    const data = {
      name: this.state.page.name,
      description: this.state.page.description,
      project: this.state.page.project,
      owner: this.state.page.owner
    };
    console.log(data);
    try {
      const res = await fetch('/api/pages/' + _id, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.retcode === 0) {
        let pages = this.state.pages;
        const selectedPageIndex = this.state.selectedPageIndex;
        pages[selectedPageIndex].name = data.name;
        pages[selectedPageIndex].description = data.description;
        pages[selectedPageIndex].project = data.project;
        this.setState({
          pages: pages,
          showPageDialog: false
        })
      }
    } catch (error) {
      console.error(error);
    }
  }


  removePage = async () => {
    const selectedPageIndex = this.state.selectedPageIndex;
    if (selectedPageIndex === null) {
      alert('请选择要删除的页面');
    } else {
      const selectedPage = this.state.pages[selectedPageIndex];
      const selectedPageId = selectedPage._id;
      try {
        const res = await fetch(`/api/pages/${selectedPageId}`, {
          method: 'delete',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        const json = await res.json();
        if (json.retcode === 0) {
          let pages = this.state.pages;
          pages.splice(selectedPageIndex, 1);
          this.setState({
            pages: pages,
            selectedPageIndex: null
          });
          this.showSnackbar('删除成功');
        }
      } catch (error) {
        console.error(error);
      }
    }
  }


  handleRowSelection = (selectedRows) => {
    if (selectedRows.length > 0) {
      const selectedPageIndex = selectedRows[0];
      let pages = this.state.pages;
      pages.forEach(page => {
        page.selected = false;
      });
      pages[selectedPageIndex].selected = true;
      this.setState({
        selectedPageIndex: selectedPageIndex,
        pages: pages
      });
    } else {
      const selectedPageIndex = this.state.selectedPageIndex;
      let pages = this.state.pages;
      pages[selectedPageIndex].selected = false;
      this.setState({
        selectedPageIndex: null,
        pages: pages
      });
    }
  }

  handleChangePage = (key) => {
    let page = this.state.page;
    page[key] = this.refs[key].getValue();
    this.setState({
      page: page
    });
  }


  handleChangePageProject = (event, index, value) => {
    let page = this.state.page;
    page.project = value;
    this.setState({
      page: page
    });
  }

  handleChangePageOwner = (event, index, value) => {
    let page = this.state.page;
    page.owner = value;
    this.setState({
      page: page
    });
  }
  render() {
    const projects = this.state.projects;
    const pages = this.state.pages;
    const dialogType = this.state.dialogType;
    let label;
    let action = this.createPage;
    if (dialogType === 'create') {
      label = '新建页面';
      action = this.createPage;
    } else if (dialogType === 'update') {
      label = '修改页面';
      action = this.updatePage;
    }
    let customActions = [
      <FlatButton
        label="取消"
        secondary={true}
        onTouchTap={this.closePageDialog} />,
      <FlatButton
        label= { label }
        primary={true}
        onTouchTap={ action } />
    ];

    const items = [];
    for (let i = 0; i < 100; i++ ) {
      items.push(<MenuItem value={i} key={i} primaryText={`Item ${i}`}/>);
    }

    return (
      <div className="PagesPage">
        <Header />
        <div className="PagesPage-container">
          {/*
           <div dangerouslySetInnerHTML={{__html: this.props.content || ''}} />
           */}
          <Table
            height={this.state.height}
            fixedHeader={this.state.fixedHeader}
            fixedFooter={this.state.fixedFooter}
            selectable={this.state.selectable}
            multiSelectable={this.state.multiSelectable}
            onRowSelection={this.handleRowSelection}>
            <TableHeader enableSelectAll={this.state.enableSelectAll}>
              <TableRow>
                <TableHeaderColumn>名称</TableHeaderColumn>
                <TableHeaderColumn>简介</TableHeaderColumn>
                <TableHeaderColumn>项目</TableHeaderColumn>
                <TableHeaderColumn>负责人</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              deselectOnClickaway={this.state.deselectOnClickaway}
              showRowHover={this.state.showRowHover}
              stripedRows={this.state.stripedRows}>
              {
                pages.map(page => {
                  const ownerIndex = _.findIndex(window.users, {_id: page.owner});
                  const ownerName = window.users[ownerIndex].name;
                  return (
                    <TableRow key={page._id} selected={page.selected} selectable={page.owner === window.user._id}>
                      <TableRowColumn>
                        <Link to={ '/pages/' + page._id } onClick={Link.handleClick}>{page.name}</Link>
                      </TableRowColumn>
                      <TableRowColumn>{page.description}</TableRowColumn>
                      <TableRowColumn>{page.project}</TableRowColumn>
                      <TableRowColumn>{ownerName}</TableRowColumn>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
          <FlatButton label="新建" secondary={true} onTouchTap={this.showCreatePageDialog} disabled={this.state.selectedPageIndex !== null} />
          <FlatButton label="编辑"                   onTouchTap={this.showUpdatePageDialog} disabled={this.state.selectedPageIndex === null}/>
          <FlatButton label="删除" primary={true}   onTouchTap={this.removePage} disabled={this.state.selectedPageIndex === null}/>

          <Dialog
            title={label}
            actions={customActions}
            open={this.state.showPageDialog}
            onRequestClose={this.closePageDialog}>

            <form action="#">
              <div>
                页面名称: <TextField ref="name" defaultValue={this.state.page.name} onChange={this.handleChangePage.bind(this, 'name')} hintText="name"/>
              </div>
              <div>
                页面简介: <TextField ref="description" defaultValue={this.state.page.description} onChange={this.handleChangePage.bind(this, 'description')}
hintText="description" />
              </div>
              <div>
                归属项目:
                <SelectField hintText="project" value={this.state.page.project} onChange={this.handleChangePageProject}>
                  {
                    projects.map((project) => {
                      return (
                        <MenuItem value={project.name} key={project.name} primaryText={project.name} />
                      )
                    })
                  }
                </SelectField>
              </div>
              <div>
                <SelectField floatingLabelText="负责人" value={this.state.page.owner} onChange={this.handleChangePageOwner}>
                  {
                    window.users && window.users.map((user) => {
                      return <MenuItem value={user._id} key={user._id} primaryText={user.name} />
                    })
                  }
                </SelectField>
              </div>

            </form>
          </Dialog>
        </div>
        <Footer />
      </div>
    );
  }

}

export default Page;
