// MySQL 学习站 v2 · 第 1-4 章：基础入门
var CHAPTERS_A = [
{
id:1, title:"数据库与数据库安全全景", stage:"基础入门",
intro:"先立框架：数据库是所有网站的保险柜，而 SQL 注入就是配这把柜子钥匙的万能模子。这一章讲清楚数据库是什么、它在攻防链里处于什么位置，以及本课程要带你走完的四条防线。",
sections:[
{h:"1.1 什么是关系型数据库", p:["数据库（Database）是按规则组织数据的仓库。网站的用户名、密码、订单、文章，最终都落在数据库里。",
"MySQL 是最流行的开源<b>关系型数据库</b>（RDBMS）：数据存成「表」，表由<b>行</b>（一条记录）和<b>列</b>（一个属性）组成，像 Excel，但多出并发控制、权限体系、索引和事务能力。"]},
{tbl:[
["术语","含义","网安视角"],
["数据库 database","一个独立的仓库，如 shop","注入后 SHOW DATABASES 看有哪些好东西"],
["表 table","存一类数据的架子","目标通常是 user / admin / config 这类表"],
["行 row / 记录","一条具体数据","一次 SELECT 可能拖出所有行"],
["列 column / 字段","一种属性，如 username","字段名泄露就是信息泄露"],
["主键 PRIMARY KEY","唯一标识一行的列","注入时用 ORDER BY 探列数会用到它"]],
note:"记住一句话：<b>库、表、列、数据，在攻击者眼里全都是「可以被 SQL 语句直接操作」的对象</b>。这既是开发者的便利，也是攻击者的地图。"},
{h:"1.2 一条记录长什么样", code:[
"-- 表结构（列定义）\nCREATE TABLE user (\n  id         INT AUTO_INCREMENT PRIMARY KEY,\n  username   VARCHAR(50)  NOT NULL UNIQUE,\n  password   VARCHAR(255) NOT NULL,   -- 存哈希，不存明文！\n  role       VARCHAR(20)  DEFAULT 'user',\n  created_at DATETIME     DEFAULT CURRENT_TIMESTAMP\n);\n\n-- 表里的数据（几行记录）\n-- id | username | password（哈希）                        | role\n--  1 | admin    | 21232f297a57a5a743894a0e4a801fc3      | admin\n--  2 | alice    | e10adc3949ba59abbe56e057f20f883e      | user"]},
{h:"1.3 数据库在攻防链里的位置", p:["攻击者对数据库干的事，无非四种，每一种都有对应的防线："]},
{tbl:[
["攻击目标","典型手法","对应防线"],
["拖库（数据泄露）","SQL 注入、备份文件泄露","注入防御 + 最小权限"],
["篡改数据","注入改写 UPDATE（改密码、提权）","参数化 + 权限控制"],
["删库（破坏）","DROP/DELETE 权限过大，或勒索","权限收回 + 备份"],
["长期潜伏","留下管理账号、改触发器","审计日志 + 定期核查"]],
tip:"这四条防线就是本课程的主线：<b>第 13-16 章讲「进不去」，第 17-18 章讲「进去了也拿不走」，第 19 章讲「看得见」，第 12 章讲「删了也能恢复」</b>。四道门缺一不可。"},
{h:"1.4 网安为什么要学 MySQL", ul:["<b>SQL 注入是最经典的 Web 漏洞</b>：绕过登录、拖库、getshell，很多起点都是一句拼接的 SQL。",
"<b>代码审计必须具备读 SQL 的能力</b>：看不懂查询逻辑，就找不到注入点。",
"<b>权限与加固是运维安全的日常</b>：数据库往往是最后一道、也是最值钱的那道墙。",
"<b>你已经有的基础可以直接接上</b>：DVWA 靶场里打过的注入、PHP 站里的 PDO 写法，都会在这里闭环。"]},
{h:"1.5 本课程的练习库", p:["`code/init.sql` 会建一个 `shop` 库，三张表贯穿全课程："]},
{tbl:[
["表","字段","用来练什么"],
["user","id, username, password, email, role, created_at","查询、注入、权限"],
["orders","id, user_id, product_id, amount, status, created_at","JOIN、聚合、注入改写"],
["product","id, product_name, price, stock","三表 JOIN、子查询"],
["demo2","id, name","<b>专门给教学演示用</b>：只有 2 列，讲探列数不冲突"],
["admin_log","id, action, operator, created_at","审计与触发器"]],
note:"建库命令：`mysql -u root < init.sql`（详细步骤见「实验」页的环境准备）。建好后用 `USE shop;` 切进去，后面每一章的示例都能直接跑。"},
{h:"1.6 身份认证与授权：登录之后数据库怎么认人", p:["连接 MySQL 时，服务端靠 <b>用户名@来源主机 + 口令</b> 认定你的身份，再按你被授予的权限决定你能做什么。这两个概念是本课程第 18 章的基础："]},
{ul:["<b>认证（Authentication）</b>：你是谁。MySQL 8.0 默认插件是 `caching_sha2_password`（5.7 是 `mysql_native_password`）。",
"<b>授权（Authorization）</b>：你能干什么。`GRANT` 授予、`SHOW GRANTS` 查看。",
"<b>账号标识是 `user@host`</b>：`'app'@'localhost'` 和 `'app'@'%'` 是两个完全不同的账号，权限也不共享——这是配权限时最容易搞错的一点。"]},
{code:[
"-- 看当前是谁、连的哪个库\nSELECT USER(), CURRENT_USER(), DATABASE();\n\n-- USER() 是你声称的身份；CURRENT_USER() 是服务端实际认定并用于鉴权的账号\n-- 两个不一致，说明你的账号被匹配到了另一条 user@host 记录"]},
{h:"1.7 网安视角：为什么要先学「怎么用」再学「怎么守」", p:["顺序很重要。不懂 `UPDATE ... WHERE` 的语义，就理解不了「注入改写 WHERE 会更新整张表」；不懂 `information_schema`，就理解不了拖库是怎么一步步问出来的。"]},
{p:["所以本课程刻意把安全内容放在后半段（第 13 章起），但每一章都会提前告诉你：<b>这块知识将来会被攻击者怎么用</b>。"]}
],
secview:"数据库 = 网站的保险柜。攻击者对它做四件事：拖库、篡改、删库、潜伏；对应的正是注入防御、参数化与权限、权限收回与备份、审计日志这四道门。这门课就是把这四道门一次建齐。"
},
{
id:2, title:"建库建表（DDL）与表设计", stage:"基础入门",
intro:"DDL（数据定义语言）负责建库、建表、改结构。网安人必须懂它——因为表设计得好不好，直接决定后面注入好不好打、权限好不好管、数据丢不丢得了。",
sections:[
{h:"2.1 建库与选库", code:[
"-- 创建数据库（存中文必须 utf8mb4）\nCREATE DATABASE IF NOT EXISTS shop DEFAULT CHARACTER SET utf8mb4;\n\n-- 切到这个库（后续所有操作都在这里）\nUSE shop;\n\n-- 看有哪些库、当前在哪个库\nSHOW DATABASES;\nSELECT DATABASE();\n\n-- 看库里有哪些表\nSHOW TABLES;"]},
{note:"字符集要选 `utf8mb4` 而不是 `utf8`：MySQL 的 `utf8` 其实是残缺实现（最多 3 字节），存不了 emoji 和部分生僻字。这不是小事——<b>字符集选错还会影响注入姿势</b>，第 15 章讲的宽字节注入就跟 GBK 有关。"},
{h:"2.2 建表：列名 + 类型 + 约束", code:[
"CREATE TABLE user (\n  id         INT AUTO_INCREMENT PRIMARY KEY,  -- 自增主键：唯一标识一行\n  username   VARCHAR(50)  NOT NULL UNIQUE,   -- 非空且不重复\n  password   VARCHAR(255) NOT NULL,          -- 存哈希（bcrypt 长度约 60，留 255 有余量）\n  email      VARCHAR(100) UNIQUE,\n  role       VARCHAR(20)  DEFAULT 'user',\n  created_at DATETIME     DEFAULT CURRENT_TIMESTAMP\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"]},
{ul:["<b>ENGINE=InnoDB</b>：必须。它支持事务、行锁和外键，MyISAM 都不支持。",
"<b>CHARSET=utf8mb4</b>：避免乱码与截断问题。",
"<b>长度要给够</b>：`password` 列写 `VARCHAR(32)` 存 MD5 看着刚好，但换成 bcrypt/Argon2 立刻不够——这是真实项目里很常见的迁移事故。"]},
{h:"2.3 改表结构 ALTER", code:[
"-- 加一列\nALTER TABLE user ADD COLUMN last_login DATETIME;\n\n-- 改列类型（注意：可能丢数据）\nALTER TABLE user MODIFY COLUMN username VARCHAR(100) NOT NULL;\n\n-- 加索引\nALTER TABLE orders ADD INDEX idx_user (user_id);\n\n-- 删除一列（列和数据一起没）\nALTER TABLE user DROP COLUMN last_login;\n\n-- 重命名表\nRENAME TABLE user TO users;"]},
{h:"2.4 危险操作：DROP 与 TRUNCATE", tbl:[
["语句","删除什么","能回滚吗","速度"],
["DELETE FROM t WHERE ...","符合条件的行","能（在事务里）","慢，逐行记日志"],
["DELETE FROM t","所有行，表结构还在","能（在事务里）","慢"],
["TRUNCATE TABLE t","所有行，重置自增","<b>不能</b>（隐式提交）","快"],
["DROP TABLE t","整张表（结构+数据+索引）","不能","快"],
["DROP DATABASE db","整个库","不能","快"]]},
{code:[
"-- 一次演示清楚\nSELECT COUNT(*) FROM demo2;   -- 假设 100 行\nDELETE  FROM demo2;           -- 100 行没了，表还在，自增 ID 不回退\nTRUNCATE TABLE demo2;         -- 清空且自增重置，不可回滚\nDROP TABLE demo2;             -- 表都没了"]},
{warn:"看到代码里 <b>把用户输入拼进 DROP / DELETE / TRUNCATE</b>，直接标高危。历史上「删库跑路」事故和删除库勒索攻击，靠的都是这类语句——而真正的根因往往是「业务账号居然有 DROP 权限」（第 18 章会讲怎么收回）。"},
{h:"2.5 表设计的几个判断标准", ol:["<b>每张表都要有主键</b>：没有主键的表，行锁会退化成锁全表（第 10 章会看到后果）。",
"<b>敏感列单独想清楚</b>：密码只存哈希；身份证、手机号这类要加密或脱敏。",
"<b>类型挑最合适的</b>：金额用 `DECIMAL`、时间用 `DATETIME`、布尔用 `TINYINT(1)`。",
"<b>约束尽量下推到数据库</b>：`NOT NULL` / `UNIQUE` / `CHECK` / `FOREIGN KEY`，比在应用层校验更可靠。",
"<b>列名避免 MySQL 保留字</b>：非要用就加反引号，例如 `desc`、`order`、`status` 这类词要小心。"]},
{code:[
"-- 保留字做列名必须加反引号，否则直接语法错误\nCREATE TABLE t (\n  id     INT PRIMARY KEY,\n  `desc` VARCHAR(100),     -- desc 是保留字\n  `key`  VARCHAR(50)       -- key 也是\n);"]},
{tip:"设计阶段留的坑，安全阶段全要还。比如「业务账号能 DROP」看起来只是图方便，等到哪天出现一个注入点，攻击者一条 `DROP TABLE` 就把库清了——而这条路径的起点，就是建库时那个图方便的决定。"}
],
secview:"DDL 是数据库的骨架设计。安全视角看三件事：敏感列怎么存（哈希/加密）、危险操作有没有权限约束（DROP/TRUNCATE 不能给业务账号）、结构约束够不够（主键、非空、唯一、外键）。"
},
{
id:3, title:"数据类型与约束", stage:"基础入门",
intro:"选对类型、加齐约束，是表设计的一半；而另一半是安全——类型错误会被注入利用（报错注入），约束缺失会让脏数据和逻辑漏洞长出来。",
sections:[
{h:"3.1 常用数据类型", tbl:[
["类别","类型","用途","注意"],
["整数","TINYINT / INT / BIGINT","状态码、数量、ID","INT 上限约 21 亿，用户量大用 BIGINT"],
["定点小数","DECIMAL(10,2)","<b>金额</b>","精确，必须用这个"],
["浮点","FLOAT / DOUBLE","科学计算","<b>有精度误差，绝不能存钱</b>"],
["定长字符","CHAR(n)","固定长度（如 MD5 32位、性别）","不够长度会补空格"],
["变长字符","VARCHAR(n)","用户名、邮箱、哈希","超过长度会被截断或报错"],
["大文本","TEXT / LONGTEXT","文章正文","不能设默认值、索引需前缀"],
["日期时间","DATE / DATETIME / TIMESTAMP","创建时间、生日","TIMESTAMP 有 2038 问题"],
["布尔","BOOLEAN（实为 TINYINT(1)）","是否启用","本质就是 0/1"]]},
{code:[
"-- 金额用 DECIMAL，浮点会算错账\nSELECT 0.1 + 0.2;                    -- 浮点近似，可能出现 0.30000000000000004\nSELECT CAST(0.1 AS DECIMAL(10,2)) + CAST(0.2 AS DECIMAL(10,2));   -- 0.30 精确\n\n-- 存钱的正确写法\n-- amount DECIMAL(10,2) NOT NULL   ← 10 位总长，2 位小数，最大 99999999.99"]},
{h:"3.2 六种约束", tbl:[
["约束","作用","安全含义"],
["PRIMARY KEY","非空 + 唯一，标识一行","保证可精确定位；行锁依赖它"],
["NOT NULL","禁止为空","防脏数据、防逻辑绕过"],
["UNIQUE","值不重复","防重复注册、防撞库式覆盖"],
["DEFAULT","默认值","未传值时兜底"],
["CHECK","取值/范围校验","范围类业务规则下沉到库（8.0 才真正生效）"],
["FOREIGN KEY","引用其他表主键","保证引用完整性，防伪造关联"]]},
{code:[
"CREATE TABLE orders (\n  id         INT AUTO_INCREMENT PRIMARY KEY,\n  user_id    INT NOT NULL,\n  product_id INT NOT NULL,\n  amount     DECIMAL(10,2) NOT NULL,\n  status     VARCHAR(20) DEFAULT 'pending',\n  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\n  CONSTRAINT fk_orders_user    FOREIGN KEY (user_id)    REFERENCES user(id),\n  CONSTRAINT fk_orders_product FOREIGN KEY (product_id) REFERENCES product(id),\n  CONSTRAINT ck_orders_status  CHECK (status IN ('pending','paid','refunded','cancelled'))\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;"]},
{h:"3.3 外键与级联：一把双刃剑", code:[
"-- 删除用户时，他的订单跟着删\nFOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE\n\n-- 删除用户时，如果还有订单就拒绝删除（更安全）\nFOREIGN KEY (user_id) REFERENCES user(id) ON DELETE RESTRICT"]},
{warn:"`ON DELETE CASCADE` 在生产环境要非常谨慎：<b>删一条主表记录会连带删掉大量从表数据，而且很难撤销</b>。审计时看到 CASCADE，要确认它是不是业务真的有这个语义，还是当初图省事加的。"},
{h:"3.4 sql_mode：数据库的严格程度", p:["MySQL 8.0 默认开启了严格模式，5.7 的部分安装包没有。这直接影响数据质量："]},
{code:[
"-- 看当前的 sql_mode\nSELECT @@sql_mode;\n\n-- 严格模式包含 STRICT_TRANS_TABLES 时：超长、类型不符直接报错（推荐）\n-- 没有严格模式时：超长会被静默截断、非法日期会被写成 0000-00-00\n\n-- 推荐的关键项\n-- STRICT_TRANS_TABLES   超长/类型错误直接报错\n-- NO_ZERO_DATE          禁止 '0000-00-00'\n-- ONLY_FULL_GROUP_BY    GROUP BY 语义严格（防随机取值）\n-- NO_ENGINE_SUBSTITUTION 引擎不存在就报错，别静默换掉"]},
{note:"`sql_mode` 为什么和安全有关？因为<b>静默截断会造成意料之外的数据</b>：注册时输入 60 字的用户名，非严格模式下被截成 50 字存进去，后续按用户名查询、去重、鉴权都可能出现偏差。这也是审计项之一。"},
{h:"3.5 网安视角：类型错误会被利用", ul:["<b>报错注入依赖类型转换</b>：攻击者用 `extractvalue()`、`floor(rand()*2)` 这类方式故意制造类型错误，把数据塞进错误信息里带回来（第 15 章）。",
"<b>隐式类型转换会导致索引失效</b>：`VARCHAR` 列和数字比较时可能全表扫描（第 9 章）。",
"<b>宽度不够会被截断</b>：某些越权、绕过校验的案例，就是靠超长输入被截断后产生的偏差。",
"<b>约束是最后一道数据闸门</b>：应用层校验被绕过时，`UNIQUE`、`CHECK`、`FOREIGN KEY` 还能兜住一部分。"]}
],
secview:"类型和约束不只是「规范」，它们是数据库自带的防御层。审表时看三样：金额是不是 DECIMAL、重要列有没有 NOT NULL/UNIQUE、状态列有没有 CHECK。这三样齐了，很多逻辑漏洞根本长不出来。"
},
{
id:4, title:"数据增删改（DML）与保命开关", stage:"基础入门",
intro:"INSERT 增、UPDATE 改、DELETE 删。这三条语句是日常使用最频繁的，也是注入攻击杀伤力最大的地方——因为一旦 WHERE 被改写，影响面会从一行变成整张表。",
sections:[
{h:"4.1 插入数据 INSERT", code:[
"-- 插入单条（推荐写全列名，避免表结构变动后错位）\nINSERT INTO user (username, password, email, role)\nVALUES ('alice', 'e10adc3949ba59abbe56e057f20f883e', 'alice@example.com', 'user');\n\n-- 一次插多条\nINSERT INTO user (username, password, email) VALUES\n  ('bob',   '25f9e794323b453885f5181f1b624d0b', 'bob@example.com'),\n  ('carol', '4e4d6c332b6fe1aaf8e5d4c1b0d2e3f4', 'carol@example.com');\n\n-- 把查询结果插进去（常用于备份、迁移）\nINSERT INTO user_backup (id, username, role)\nSELECT id, username, role FROM user;\n\n-- 插入前先看约束有没有拦住\nSELECT * FROM user;"]},
{h:"4.2 UPDATE：WHERE 决定影响面", p:["`UPDATE ... SET ... WHERE ...` 的语义是「把符合条件的行改掉」。<b>条件越宽，改得越多</b>——这正是注入的价值所在。"]},
{code:[
"-- 正常：只把 id=1 的角色改成 admin\nUPDATE user SET role = 'admin' WHERE id = 1;\n\n-- 少写 WHERE：整张表都被改！\nUPDATE user SET role = 'admin';\n\n-- WHERE 被注入改写（原本是 id='$id'）：\n-- 传入  1 OR 1=1\nUPDATE user SET role = 'admin' WHERE id = 1 OR 1=1;   -- 全部用户变管理员"]},
{warn:"`UPDATE` 是「篡改类攻击」的主角。真实案例里，注入点被用来 <b>把管理员密码重置、把自己的账号提权、把订单金额改成 0</b>——这些都不需要拖库，一条改写好的 UPDATE 就够了。"},
{h:"4.3 DELETE 与「没有 WHERE」的后果", code:[
"-- 删一行\nDELETE FROM user WHERE id = 5;\n\n-- 删一片（注意：条件不精确会误伤）\nDELETE FROM orders WHERE status = 'cancelled' AND created_at < '2026-01-01';\n\n-- 删光（最危险：整表清空，表结构还在）\nDELETE FROM user;\n\n-- 删表（连结构一起没）\nDROP TABLE user;"]},
{tip:"写 UPDATE / DELETE 的习惯动作：<b>先把 WHERE 条件用 SELECT 跑一遍，看影响的是不是你要的那些行，再把 SELECT 换成 DELETE</b>。这一个习惯能避免绝大多数误删事故。"},
{h:"4.4 保命开关：SQL_SAFE_UPDATES", p:["MySQL 提供安全更新模式：开启后，`UPDATE` / `DELETE` 如果 WHERE 里<b>没有用到主键或索引列</b>，会直接报错拒绝执行。"]},
{code:[
"-- 开启（当前会话有效）\nSET SQL_SAFE_UPDATES = 1;\n\n-- 被拒绝的写法\nDELETE FROM user;                     -- 无 WHERE\nUPDATE user SET role = 'a';           -- 无 WHERE\nDELETE FROM user WHERE role = 'user'; -- 有 WHERE，但 role 不是主键/索引 → 同样被拒\n\n-- 允许的写法（命中主键）\nDELETE FROM user WHERE id = 999;\n\n-- 关闭\nSET SQL_SAFE_UPDATES = 0;"]},
{note:"注意它<b>不是万能保险</b>：只对当前会话有效，而且只挡「不带主键/索引条件」的语句。真正的保护是权限（业务账号不该有 DELETE 全表的权限）+ 备份（第 12 章）。"},
{h:"4.5 事务初体验（为第 10 章埋点）", code:[
"-- 把两条更新打包，要么都成，要么都不成\nSTART TRANSACTION;\nUPDATE account SET balance = balance - 100 WHERE id = 1;\nUPDATE account SET balance = balance + 100 WHERE id = 2;\n-- 确认无误\nCOMMIT;\n-- 发现问题就撤销\n-- ROLLBACK;"]},
{p:["事务的意义是「原子性」：中途失败不会留下改了一半的数据。第 10 章会深入讲 ACID、隔离级别和锁。"]},
{h:"4.6 网安视角：三种改写，三种灾难", tbl:[
["被改写的语句","攻击者的目的","后果"],
["SELECT ... WHERE","让条件恒真，返回全部数据","拖库（数据泄露）"],
["UPDATE ... WHERE","改变 affected rows 的范围","整表被篡改（提权、改密码、改金额）"],
["DELETE ... WHERE","扩大删除范围","数据被清空（删库）"],
["INSERT","插入管理员账号或后门数据","长期潜伏"]]},
{p:["四种后果对应四种防线：注入防御（参数化）、权限最小化、备份恢复、审计日志。这门课后面会一条条建起来。"]}
],
secview:"记住注入改写 WHERE 的杀伤力：SELECT 被改是拖库，UPDATE 被改是整表篡改，DELETE 被改是删库。所以「用户输入不直接拼进 SQL」不是洁癖，是底线——第 17 章会给出根治写法。"
}
];
