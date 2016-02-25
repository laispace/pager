# 使用 React 写个简单的活动页面运营系统 - 设计篇

介绍这个工具前不得不先介绍一下积木系统。

积木系统是 imweb 团队出品、为产品运营而生的一套活动页面发布系统，详细介绍见 [PPT](http://vdisk.weibo.com/s/cSKQveSBDMPco)

简单可以这么理解它的理念:

1. 一个页面 = 一个模板 + 多个组件
2. 一个组件 = 一份代码 + 一份数据
3. 一个组件开发一次，复用多次
4. 一个页面使用多个组件拼装后，实时预览、快速发布上线

此前在阿里实习的时候也接触过一个叫 TMS（淘宝内容管理系统）的系统, 专门用于快速搭建电商运营活动页面.

这种系统可统一理解为运营活动页面发布系统。

这种系统有以下特点：

1. 静态数据或轻后台数据(轻量 CGI)

2. 单页（多图、图文混合偏多)

3. 组件粒度小，可灵活拼装页面

4. 活动页面需要快速发布上线

积木系统已经经受了多个项目的考验，目前也启动了 2.0 的开发计划, 作者 @江源 也曾在 PPT 中提到有开源的计划，大家可以期待一下。

在这里我写了一套类似的 Pager 系统，设计理念大同小异，只不过是想尝试用新的技术栈快速实现。


项目地址是: https://github.com/laispace/pager 

安装环境比较麻烦，先来快速预览下它的功能。

创建一个页面, 添加可复用的组件，进行可视化编辑：
![](http://www.laispace.com/content/images/2016/02/pager-create-page.gif)

设置页面信息：
![](http://www.laispace.com/content/images/2016/02/pager-edit-page.gif)

生成页面，可本地下载预览：
![](http://www.laispace.com/content/images/2016/02/pager-generate-page.gif)

发布上线，同步到远程机器：
![](http://www.laispace.com/content/images/2016/02/pager-publish-page.gif)

接下来，直接访问 http://pages.laispace.com/demo-page2/ 就可以看到发布的页面了。

当我把原型写出来的时候我却发现，ES6 和 React 带来的一系列特性，让我觉得代码写起来爽到飞起，所以给大家分享下有趣的东西。

目前这个代号为 Pager 的系统只实现了简单的 组件编译/页面生成/页面发布 的功能, 还不能用于生产环境.

所以本文先给大家介绍下设计思路 :（ 项目完成后, 再给大家细细介绍它的实现.

## 项目设计

### 发布一个页面上线的流程

这个流程的角色主要对应是产品运营经理, 所以操作必须简单.

1. 新建页面, 配置页面基础信息（标题/分享信息等）
2. 在页面中添加组件并配置组件数据（实时预览/页面大小可拖拽）
3. 新窗口打开预览页面（预览效果就是生成后的页面,需要与线上发布版本一致）
4. 下载页面到本地（不使用一键发布, 自行下载代码使用其他系统发布）
5. 发布页面到服务器（一键发布, 需保证服务器配置好了对应目录的访问权限）

### 开发一个组件的流程

这个流程的角色主要对应是前端开发, 需要保证开发模式足够舒畅.

1. 新建组件, 编写组件代码
2. 打开组件预览页面
3. 修改组件配置和代码
4. 监听修改, 实时预览更新
5. 开发完成，同步到系统中（重新编译, 覆盖上一个版本）

### 项目模块划分

![](http://www.laispace.com/content/images/2016/01/----.png)

系统承载多个项目, 项目中配置归属这个项目的页面在发布时的一些配置信息.

一个页面由多个组件构成, 每个组件为一个文件夹, 组件间相互独立, 本地开发完成后, 编译并导入到系统中.

注意：绿色为已有功能, 目前只提供了页面创建相关功能, 还没有鉴权/版本控制等模块, 所以还不能用于生产环境.

### 接口设计

![](http://www.laispace.com/content/images/2016/01/URL--.png)

虽然前后端都自己写, 可以采用自己喜欢的接口方式. 但考虑到语义化和拓展性, 还是建议使用前后端分离的 restful 接口形式.

一个名词对应一个资源, 一个动词对应一个操作:

- 增加一个组件, POST   /components/
- 删除一个组件, DELETE /components/:Id
- 查找所有组件, GET    /components/
- 查找一个组件, GET    /compnents/:Id
- 修改一个组件, PUT    /components/:Id

### 数据模型

![](http://www.laispace.com/content/images/2016/01/-----1.png)

前后端通信是 JSON 数据格式, 同时使用 mongoose 定义一些数据模型, 方便快速地增删查改, 建立项目原型.

像嵌套比较深的数据, 有时我们并不想定义太多, 那直接用一个 Mixed 类型就可以解决, 比如一个页面中包含多个组件, 每个组件其实是有自己的数据格式的, 我这里并不想用两张表来存储（类似外键）, 所以直接在一个页面下就存储了这个页面需要的所有数据:

```
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const schema = new mongoose.Schema({
  name: String,
  description: String,
  components: [Schema.Types.Mixed], // 组件, 混合的数据格式
  project: String,
  config: Object
});
```

### 页面输入

1. 页面信息(title + meta + link + script)
  
一个 html 页面, 从上往下是:

    - title       页面标题
    - meta        页面元信息
    - link/style  外联或内联样式（自定义样式方便快速修复UI问题而不需要重新发布代码版本）
    - script      外联或内联脚本（自定义脚本方便快速添加上报点等非固话的操作）

2. 多个模块(component + data)
  
每个组件都有自己的模板, 对应一套数据, 遵循组件粒度化,一个模板套一份数据的原则.
  
3. 发布配置(publishIp+publishDir+rsync)
  
不同的项目下生成不同的页面, 最终使用 rsync 将页面目录同步到远程机器, 远程机器使用 nginx/apache 配置下代理, 就实现了页面发布.

注意: rsync 权限, 建议在远程服务器上创建对应的目录, 给予 rsync 账户只能访问这个目录, 以免带来不必要的安全问题.


## 编码小结

这个项目使用 React+ES6 写的, 和大家分享一些小心得.

### React 单向数据流降低程序复杂度

我对 React 最重要的理解是单向的自顶向下的组件嵌套和数据流动, 带来了数据的一致性保障. 对于一些不是非常复杂的单页应用, 其实一个页面就是一个组件, 不需要用太多的 flux/redux 等方案也足矣.

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
            <button onClick={this.addAge}>点击加一岁</button>                          
        </div> 
        ) 
}
```

### 大胆使用ES6/7

ES6 带来了非常多的特性, 我在使用的过程中感觉比较好玩的是以下几个.

- import 带来真正的模块化
- async/await 同步方式写异步代码
- @decorator 无侵入的装饰器
- ()=>{}   箭头函数简化代码、保留 this 作用域
- babel+webpack 为新特性保驾护航

#### import 带来真正的模块化

模块化的方案, 以前有 AMD/CMD 甚至是 UMD, 遇上不同的项目就可以用到不同的模块化方案, 自然带有不同的学习成本.

ES6 提供的 import/export 带来的是更舒畅的模块化, 就像在写 python 一样, 一个文件就是一个模块, 纯粹.

有了 babel 将 ES6 无缝地转化为 ES5 代码后, 我觉得如果不考虑转化后的代码体积偏大的问题, 我们在项目中就应该拥抱 ES6.

如果需要兼容以前的 AMD/CMD 模块, 配上 webpack 使用即可.

```
// 导入全部
import path from 'path';
import Component from '../models/component';
// 导入局部
import { getComponent, getComponents } from '../utils/resources';
```

#### async/await 同步方式写异步代码

是异步的操作就应该使用 promise, 配合 ES7 的 async/await 语法糖, 舒服地编写同步的代码风格表示异步的操作, 爽. 

首先需要定义多个异步操作，返回 Promise:

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

接着使用 await 获取异步操作的结果:

```
const page = await findOnePage(pageId);
const project = await findOneProjectByName(page.project);
```

可以看到, 在使用 async/await 时, 少了回调, 少了嵌套, 代码更加易读. 当然这里的代价是我们需要封装好供 await 使用的 promise（我觉得这里还是挺麻烦的）, 不过我们再也看不到回调地狱了, 我们甚至可以不使用 yield/generator 而直接过渡到 async/await 了.

ES7? ES6 都没普及, 你 TM 叫我用 ES7? 

这不是有 babel 嘛~ 用吧!


#### @decorator 使用无侵入的装饰器

装饰器其实也就是一个语法糖, 尝试这么理解: 我们有 A/B/C 三个函数分别做了三个操作, 现在假设我们突然想在这些函数里头打印一些东西.

去改动三个函数当然可以, 但更好的方式是定一个一个 @D 装饰器, 装饰到三个函数前面, 这样他们除了执行原有功能外, 还能执行我们注入进去的操作.

比如我在项目中, 不同的页面都需要用到 snackbar(操作提示框), 每个页面都是一样的, 没有必要在每个页面都写一样的代码, 只需要将这个组件以及对应的方法封装为一个装饰器, 注入到每个页面组件中, 那么每个页面组件就可以直接使用这个 snackbar(操作提示框) 了.

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

// 装饰器
@withViewport
@withStyles(styles)
@withSnackbar
class Page extends Component {
    // ...
}
```

#### 箭头函数简化代码、保留 this 作用域

匿名函数使用箭头函数可以这么写:
```
const emptyFunction = () = > { /*do nothing*/ };   
```

有了箭头函数, 妈妈再也不怕 this 突变了...

```
const socket = io('http://localhost:9999');
    socket.on('connect', () => {
      socket.on('component', (data) => {
          // 这里的 this 不会突变到指向 window
          this.showSnackbar('本地组件已更新, 自动刷新');
          this.getComponent(data.project, data.component);
        }
      });
    });
```

### 大胆使用fetch

使用 fetch 加 await 替代 XHR.

fetch 比起 xhr, 做的事情是一样的, 只是接口更加语义化, 且支持 Promise.

配合 async/await 使用的话, 那叫一个酸爽!

```
try {
      const res = await fetch(`/api/generate/`, {
        method: 'post',
        // 指定请求头
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // 指定请求体
        body: JSON.stringify(data)
      });
      // 返回的是一个 promise, 使用 await 去等待异步结果
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

本地开发一个组件时, 监听文件变化, 使用 WebSocket 通知页面更新.


起一个 socket 服务, 监听文件变化:

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

预览组件的页面监听文件变化, 变化后重新向服务器拉取最新编译好的组件, 进行更新.

```
componentDidMount = () => {
    const socket = io('http://localhost:9999');
    socket.on('connect', () => {
      socket.on('component', (data) => {
        if ((data.project === this.state.component.project) && (data.component === this.state.component.name)) {
          console.log('component changed: ', data.project, data.component);
          this.showSnackbar('本地组件已更新, 自动刷新');
          // 重新向服务器拉取最新编译好的组件, 进行更新
          this.getComponent(data.project, data.component);
        }
      });
    });
  }
```

### 子页面数据实时更新

生成页面时需要预览页面, 为了避免页面样式被系统样式影响, 应该使用内嵌 iframe 的方式来隔离样式.

父页面使用 postMessage 与子页面进行通信:
```
const postPageMessage = (page) => {
  document.getElementById('pagePreviewIframe').contentWindow.postMessage({
    type: 'page',
    page: page
  }, '*');
}
```
子页面监听父页面数据变化, 更新页面:
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


> 本文是项目设计介绍, 欢迎大家多多指正. 等我把鉴权功能和版本管理加上，就可以用于生产环境啦, 敬请期待. 
