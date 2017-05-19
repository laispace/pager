## 使用方法

- 克隆代码

```
$ git clone https://github.com/laispace/pager.git
```

- 安装依赖

```
$ cd pager
$ npm install
```

- 开启 mongodb

```
$ sudo mongod
```

需要提前创建好名为 pager 的数据库, 并添加帐号为 pager 密码为 pass4pager 的用户.
```
$ mongo
```
```
use pager
db.createUser(
   {
     user: "pager",
     pwd: "pass4pager",
     roles: [ "readWrite", "dbAdmin" ]
   }
)
```
创建数据库配置文件 mongod.cfg ，开启权限验证
```
systemLog:
    destination: file
    path: path/to/mongod.cfg
storage:
    dbPath: path/to/db
security:
   authorization: enabled
```

重启数据库，指定配置文件

$ sudo mongod -f path/to/mongod.cfg

- 开发调试

```
$ npm run start
```

- 构建

```
$ npm run build
```


