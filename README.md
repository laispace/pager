# Pager - build page quickly.


Under Construction...

# Pager - 使用 React+ES6写一个简单的活动页面运营系统

介绍这个工具前不得不先介绍一下一个叫积木系统的好东西。

积木系统 imweb 团队出品、为产品运营而生的一套活动页面发布系统，详细介绍见 [PPT](http://vdisk.weibo.com/s/cSKQveSBDMPco)

简单可以这么理解它的理念:
1. 一个页面 = 一个模板 + 多个组件
2. 一个组件 = 一份代码 + 一份数据
3. 一个组件开发一次，复用多次
4. 一个页面使用多个组件拼装后，实时预览、快速发布上线

在阿里巴巴实习的时候就接触过一个叼炸天的 TMS 运营系统，做的工作也是类似：给产品的同学提供大量的可重用的组件，快速拼装上线。
包括积木系统在内，我统一理解为运营活动页面发布系统。

这种系统有以下特点：

1. 静态数据或轻后台数据

2. 单页（多图、图文混合偏多）

3. 组件粒度小，可灵活拼装页面

4. 活动页面需要快速发布上线

积木系统已经经受了多个项目的考验，作者 @江源 也在 PPT 中提到有开源的计划，大家可以期待一下。

在这里我写了一套类似的 Pager 系统，设计理念大同小异，只不过是用新的技术栈快速实现而已。
但当我把原型写出来的时候我却发现，ES6 和 React 带来的一系列特性，让我觉得代码写起来爽到飞起，所以给大家分享下有趣的东西。

## 发布一个页面上线的流程：
1. 新建页面
2. 在页面中添加组件并配置数据（实时预览）
3. 新窗口打开预览页面
4. 下载页面到本地（自行发布）
5. 发布页面到服务器（一键发布）

## 开发一个组件的流程：
1. 新建组件文件夹
2. 打开组件预览页面
3. 修改组件代码
4. 实时预览
5. 开发完成，同步到系统中


## 项目模块划分
![](http://www.laispace.com/content/images/2016/01/----.png)
注意：绿色为已有功能

## 接口设计
![](http://www.laispace.com/content/images/2016/01/URL--.png)

## 数据模型
![](http://www.laispace.com/content/images/2016/01/-----1.png)

## 页面输入

1. 页面信息(title + meta + link + script)

2. 多个模块(component + data)

3. 发布配置(publishIp+publishDir+rsync)


## 小结

### React 单向数据流降低程序复杂度
```
state = {name: 'simple', age: 18}
addAge = () => {       
    this.setState({           
        age: this.state.age++       
    })
 }
render : () => {     
    return (         
        <div> 
            名字：<div>{this.state.name} </div> 
            年龄：<div>{this.state.age} </div>                      
            <button onClick={this.addAge}>加一岁</button>                          
        </div> 
        ) 
}
```

### 大胆使用ES6/7
- import 带来真正的模块化
- async/await 同步方式写异步代码
- @decorator 无侵入的装饰器
- ()=>{}   箭头函数简化代码、保留 this 作用域
- babel+webpack 为新特性保驾护航

#### import 带来真正的模块化
```
import path from 'path';
import Component from '../models/component';
import { getComponent, getComponents } from '../utils/resources';
```

像 Python 一样，一个文件就是一个模块，舒服。

#### async/await 同步方式写异步代码
定义多个异步操作，返回 Promise

```
const findOnePage = (pageId) => new Promise((resolve, reject) => {
  Page.findOne({_id: pageId}).then(page => {
    resolve(page);
  });
});
const findOneProjectByName = (name) => new Promise((resolve, reject) => {
  Project.findOne({name: name}).then(project => {
    resolve(project);
  });
});
```
使用 await 获取异步操作的结果
```
const page = await findOnePage(pageId);
const project = await findOneProjectByName(page.project);
```

#### @decorator 使用无侵入的装饰器
```
function withSnackbar (ComposedComponent) {
  return class withSnackbar extends Component {
    // ...

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
```
```
import withStyles from '../../decorators/withStyles';
import withViewport from '../../decorators/withViewport';
import withSnackbar from '../../decorators/withSnackbar';
@withViewport
@withStyles(styles)
@withSnackbar
class Page extends Component {
    // ...
}
```

#### ()=>{}   箭头函数简化代码、保留 this 作用域
```
const socket = io('http://localhost:9999');
    socket.on('connect', () => {
      socket.on('component', (data) => {        
          this.showSnackbar('本地组件已更新, 自动刷新');
          this.getComponent(data.project, data.component);
        }
      });
    });
```
### 大胆使用fetch

使用 fetch 加 await 替代 XHR

```
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
      } else {
        this.showSnackbar('生成失败');
      }
    } catch (error) {
      console.error(error);
      this.showSnackbar('生成失败');
    }
```

### 开发组件实时刷新
使用 watch + WebSocket 通知页面文件更新

```
async function watchResources() {
  var io = require('socket.io')(9999);
  io.on('connection', function (socket) {
    event.on('component', (component) => {
      socket.emit('component', component);
    });
  });

  console.log('watching: ', path.join(__dirname, '../src/resources/**/*'));
  watch(path.join(__dirname, '../src/resources/**/*')).then(watcher => {
    watcher.on('changed', (filePath) => {
      console.log('file changed: ', filePath);
      // [\/\\] 是为了兼容 windows 下路径分隔的反斜杠
      const re = /resources[\/\\](.*)[\/\\]components[\/\\](.*)[\/\\](.*)/;
      const results = filePath.match(re);
      if (results && results[1] && results[2]) {
        event.emit('component', {
          project: results[1],
          component: results[2]
        });
      }
    });
  });
}
```

```
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
```

### 子页面数据实时更新
使用 postMessage 进行子页面 iframe 通信
```
const postPageMessage = (page) => {
  document.getElementById('pagePreviewIframe').contentWindow.postMessage({
    type: 'page',
    page: page
  }, '*');
}
```
```
window.addEventListener("message", (event) =>  {
      // if(event.origin !== 'http://localhost:3000') return;
      console.log('previewPage receives message', event);
      if (event.data.type === 'page') {
        this.setState({
          page: event.data.page
        });
      }   
    }, false);
```

