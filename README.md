# 项目
项目名：nodeProject
项目概述：仅为NodeJS后端服务端项目。
技术：Node+Express+MySQL

# 项目接口
- 面向用户的业务接口
- 面向内部的后台管理接口
- 面向开发人员的管理接口

# 项目目录结构的划分
```
coderhub
├── src
|   ├── app (用于写 app 的操作)
|   |   ├── index.js
|   |   ├── config.js
|   |   ├── database.js
|   ├── constants (存放常量)
|   |   └── keys.js (私钥和公钥)
|   ├── controller (调用service函数)
|   |   └── user.config.js
|   ├── middleware (中间件验证接口传递的数据是否复合规范)
|   |   └── user.middleware.js
|   ├── router 
|   |   └── user.router.js
|   ├── service (对数据库的操作)
|   |   └── user.service.js
|   ├── utils (工具类)
|   |   └── .js
|   ├── main.js 
├── .env (存放环境变量)
├── package.json
├── README.md
```

# 业务接口总览
1. 用户管理系统
   - 用户注册、登录等接口
    `src/router/user.router.js`
2. 内容管理系统
	 - 用户发表动态等接口
		`src/router/moments.router.js`(有授权、登录凭证)
3. 内容评论管理
	 - 动态评论接口
		`src/router/comment.router.js`
4. 内容标签管理
	  `src/router/label.router.js`
5. 文件管理系统
    `src/router/file.router.js`
	- 上传头像
	- 上传动态配图
   
# 接口详情
接口详细参数请查看源代码。
(因为我懒，不想弄接口文档，有时间一定弄。)

![接口图片](https://s2.loli.net/2021/12/11/MbASNE1FHVmu7Xo.png)


# 数据库

## users表
用户表：
用户表中密码需要加密(md5加密)再存入数据库中；
```sql
CREATE TABLE IF NOT EXISTS `users`(
	id INT PRIMARY KEY auto_increment,
	name VARCHAR(20) NOT NULL UNIQUE,
	password VARCHAR(50) NOT NULL,
	createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updateAt TIMESTAMP NOT NULL
);
DROP TRIGGER IF EXISTS `update_example_trigger`;
DELIMITER //
CREATE TRIGGER `update_example_trigger` BEFORE UPDATE ON `users`
 FOR EACH ROW SET NEW.`updateAt` = NOW()
//
DELIMITER ;
```

## moments表
用户发表内容动态表：
```sql
CREATE TABLE if NOT EXISTS moments (
	id INT PRIMARY KEY auto_increment,
	content VARCHAR(1000) NOT NULL,
	user_id INT NOT NULL,
	createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updateAt TIMESTAMP NOT null,
	FOREIGN KEY(user_id) REFERENCES users(id)
);
DROP TRIGGER IF EXISTS `update_moments_trigger`;
DELIMITER //
CREATE TRIGGER `update_moments_trigger` BEFORE UPDATE ON `moments`
 FOR EACH ROW SET NEW.`updateAt` = NOW()
//
DELIMITER ;
```

## comments表
用户评论表
```sql
CREATE TABLE IF NOT EXISTS `comments`(
	id INT PRIMARY KEY auto_increment,
	content VARCHAR(1000) NOT NULL,
	moment_id INT NOT NULL,
	user_id int NOT NULL,
	comment_id int DEFAULT NULL,
	createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updateAt TIMESTAMP NOT null,
	FOREIGN KEY(moment_id) REFERENCES moments(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TRIGGER IF EXISTS `update_comments_trigger`;
DELIMITER //
CREATE TRIGGER `update_comments_trigger` BEFORE UPDATE ON `comments`
 FOR EACH ROW SET NEW.`updateAt` = NOW()
//
DELIMITER ;
```

## labels表
给动态加标签。
标签表：
```sql
CREATE TABLE IF NOT EXISTS label(
	id INT PRIMARY KEY auto_increment,
	name VARCHAR(10) NOT NULL UNIQUE,
	createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updateAt TIMESTAMP NOT null
);
DROP TRIGGER IF EXISTS `update_comment_trigger`;
DROP TRIGGER IF EXISTS `update_label_trigger`;
DELIMITER //
CREATE TRIGGER `update_label_trigger` BEFORE UPDATE ON `label`
 FOR EACH ROW SET NEW.`updateAt` = NOW()
//
DELIMITER ;
```

## moment_label
动态和标签的关系表：
```sql
CREATE TABLE IF NOT EXISTS moment_label(
	moment_id INT NOT NULL,
	label_id INT NOT NULL,
	createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updateAt TIMESTAMP NOT null,
	PRIMARY KEY(moment_id,label_id),
	FOREIGN key(moment_id) REFERENCES moments(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN key(label_id) REFERENCES labels(id) ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TRIGGER IF EXISTS `update_moment_label_trigger`;
DELIMITER //
CREATE TRIGGER `update_moment_label_trigger` BEFORE UPDATE ON `moment_label`
 FOR EACH ROW SET NEW.`updateAt` = NOW()
//
DELIMITER ;
```

## avatar表
用户头像表
```sql
CREATE table if not EXISTS avatar (
	id int PRIMARY key auto_increment,
	filename VARCHAR(150) not null UNIQUE,
	mimetype VARCHAR(30),
	size INT,
	user_id int not null,
	createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updateAt TIMESTAMP NOT null,
	FOREIGN KEY(user_id) REFERENCES users(id) on DELETE CASCADE on UPDATE CASCADE
);
DROP TRIGGER IF EXISTS `update_avatar_trigger`;
DELIMITER //
CREATE TRIGGER `update_avatar_trigger` BEFORE UPDATE ON `avatar`
 FOR EACH ROW SET NEW.`updateAt` = NOW()
//
DELIMITER ;
```

## file表
用户发表动态的图片表：
```sql
CREATE TABLE IF NOT EXISTS `file`(
	id INT PRIMARY KEY AUTO_INCREMENT,
	filename VARCHAR (100) NOT NULL UNIQUE,
	mimetype VARCHAR (30),
	size INT,
	moment_id INT,
	user_id INT,
	createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updateAt TIMESTAMP NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (moment_id) REFERENCES moments(id) ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TRIGGER IF EXISTS `update_file_trigger`;
DELIMITER //
CREATE TRIGGER `update_file_trigger` BEFORE UPDATE ON `file`
 FOR EACH ROW SET NEW.`updateAt` = NOW()
//
DELIMITER ;
```
