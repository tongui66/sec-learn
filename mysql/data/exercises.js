// MySQL 学习站 v2 · 章节练习（20 章 × 4 题 = 80 题，正确答案已打散到 A/B/C/D）
var EXERCISES = {
1: [
 { q: "关系型数据库里的数据是怎么组织的？", options: ["以键值对形式存在内存", "以表的形式，表由行和列组成", "以文档形式存储 JSON", "以图结构存储节点和边"], answer: 1, explain: "MySQL 是关系型数据库：数据存成表，表由行（记录）和列（属性）组成，用 SQL 操作，支持索引、事务、权限。" },
 { q: "攻击者对数据库做的事情，通常归为四类，下列哪一组最准确？", options: ["扫描、爆破、提权、留后门", "加密、解密、签名、验签", "拖库、篡改、删库、长期潜伏", "备份、恢复、归档、迁移"], answer: 2, explain: "拖库对应注入防御，篡改对应参数化与权限，删库对应权限收回与备份，潜伏对应审计日志。这四条恰好是课程的四条主线。" },
 { q: "MySQL 账号 'app'@'localhost' 中的 host 部分表示什么？", options: ["允许这个账号从哪些来源主机的连接", "账号的密码策略", "账号能访问哪个数据库", "账号的创建时间"], answer: 0, explain: "'app'@'localhost' 和 'app'@'%' 是两个完全不同的账号，权限互不相通。% 代表任意来源主机，配权限时最容易搞错的就是这一点。" },
 { q: "认证（Authentication）和授权（Authorization）的区别是？", options: ["两者是同一件事", "认证决定你能操作什么，授权决定你是谁", "认证是加密，授权是解密", "认证确认你是谁，授权决定你能做什么"], answer: 3, explain: "认证解决「你是谁」（用户名+口令+来源主机），授权解决「你能干什么」（GRANT 授予的权限）。加固时要分别检查。" }
],
2: [
 { q: "为什么建库时要指定 utf8mb4 而不是 utf8？", options: ["utf8mb4 更省空间", "utf8 已被废弃无法使用", "MySQL 的 utf8 是残缺实现（最多 3 字节），存不了 emoji 和部分生僻字", "只有 utf8mb4 支持中文"], answer: 2, explain: "MySQL 里的 utf8 实际是 utf8mb3，最多 3 字节。存 emoji 或生僻字会报错或截断。字符集还会影响注入姿势（宽字节注入就与 GBK 有关）。" },
 { q: "TRUNCATE TABLE 和 DELETE FROM 的关键区别是？", options: ["两者完全等价", "TRUNCATE 不可回滚（隐式提交）且会重置自增，DELETE 可以回滚", "DELETE 更快", "TRUNCATE 只删一列"], answer: 1, explain: "TRUNCATE 是 DDL 级别的操作，隐式提交、不能回滚、重置 AUTO_INCREMENT；DELETE 属于 DML，在事务里可以回滚。" },
 { q: "建表时指定 ENGINE=InnoDB 的必要性是什么？", options: ["能让表更小", "只有 InnoDB 支持中文", "InnoDB 的查询一定更快", "InnoDB 支持事务、行锁和外键，MyISAM 都不支持"], answer: 3, explain: "没有事务就没有回滚能力，没有行锁就只剩表锁，没有外键就失去引用完整性。生产环境的表基本都应该用 InnoDB。" },
 { q: "列名想用 desc 这类保留字时该怎么办？", options: ["用反引号包起来，如 `desc`", "直接写，MySQL 会自动识别", "改成大写 DESC", "必须换名字，没有别的办法"], answer: 0, explain: "保留字做标识符必须用反引号包裹，否则直接语法错误。设计表时尽量避开保留字（desc、order、key、status 等）。" }
],
3: [
 { q: "存储金额字段应该使用哪种类型？", options: ["FLOAT", "DECIMAL(10,2)", "DOUBLE", "VARCHAR(20)"], answer: 1, explain: "DECIMAL 是精确小数，适合金额。FLOAT/DOUBLE 是二进制浮点，会有精度误差（0.1+0.2 那类问题），会造成账目错误。" },
 { q: "CHECK 约束的作用是？", options: ["自动生成主键", "自动编号", "自动建索引", "限制列的取值范围，比如状态只能在给定的几个值里"], answer: 3, explain: "CHECK 把业务规则下沉到数据库，例如 status IN ('pending','paid')。MySQL 8.0 才真正强制生效，5.7 会解析但忽略。" },
 { q: "使用 ON DELETE CASCADE 的主要风险是？", options: ["会让查询变慢", "会导致外键失效", "删一条主表记录会连带删掉大量从表数据，且很难撤销", "会占用更多磁盘"], answer: 2, explain: "级联删除很方便也很危险。审计时看到 CASCADE，要确认业务是否真的需要这个语义，还是当初图省事加的。" },
 { q: "sql_mode 未开启严格模式（缺少 STRICT_TRANS_TABLES）会带来什么问题？", options: ["超长数据会被静默截断、非法日期被写成 0000-00-00", "数据库无法启动", "所有查询都会报错", "索引会自动失效"], answer: 0, explain: "非严格模式下 MySQL 会「尽量写入」：超长截断、非法值替换成默认值。这会制造出意料之外的数据，也会掩盖应用的校验失效。" }
],
4: [
 { q: "执行 UPDATE user SET role='admin'; （没有 WHERE）会发生什么？", options: ["报语法错误", "只更新第一行", "整张表所有行的 role 都被改成 admin", "删除整张表"], answer: 2, explain: "UPDATE 的影响范围完全由 WHERE 决定。没有 WHERE 就是全表更新——这也是注入改写 WHERE 会变成「整表篡改」的原因。" },
 { q: "SQL_SAFE_UPDATES = 1 能挡住什么？", options: ["挡住所有 DELETE 语句", "挡住 UPDATE/DELETE 中 WHERE 未使用主键或索引列的语句", "挡住 DROP TABLE", "挡住 SELECT 全表扫描"], answer: 1, explain: "它要求 UPDATE/DELETE 的 WHERE 必须用到主键或索引列。注意它只对当前会话有效，也不能替代权限和备份。" },
 { q: "写 DELETE 之前最值得养成的习惯是？", options: ["先备份整库", "先开启事务", "先关闭自动提交", "先把 WHERE 条件用 SELECT 跑一遍，确认影响范围"], answer: 3, explain: "把 SELECT 换成 DELETE 之前先验证条件命中的是不是你要的那些行。这一个习惯能避免绝大多数误删事故。" },
 { q: "注入改写 DELETE 语句的 WHERE 条件，后果通常是什么？", options: ["删除范围被扩大，可能清空整张表", "只是删除失败", "会触发自动备份", "只会删除一行"], answer: 0, explain: "原本限定一行的条件被改成恒真，删除范围就扩大到全表。这正是「删库」类攻击的常见形态。" }
],
5: [
 { q: "为什么 WHERE 子句里不能用 SELECT 里定义的别名？", options: ["MySQL 不支持别名", "因为执行顺序是 FROM → WHERE → SELECT，WHERE 执行时别名还没生成", "因为别名只在 ORDER BY 有效", "因为别名必须加反引号"], answer: 1, explain: "执行顺序是 FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT。别名在 SELECT 阶段才产生，所以 WHERE 里用不到，而 ORDER BY 在它之后可以用。" },
 { q: "要查出 email 为空的行，正确写法是？", options: ["WHERE email = NULL", "WHERE email = ''", "WHERE email <> NULL", "WHERE email IS NULL"], answer: 3, explain: "NULL 表示「未知」，任何与 NULL 的比较运算结果都是 NULL（不是真），所以必须用 IS NULL / IS NOT NULL。" },
 { q: "SQL 注入里常说的「信息收集三连」指的是哪几个函数？", options: ["COUNT / SUM / AVG", "SELECT / FROM / WHERE", "VERSION() / USER() / DATABASE()", "CONCAT / SUBSTRING / ASCII"], answer: 2, explain: "拿到注入点后先摸清版本（决定用什么 payload）、当前账号（决定权限）、当前库名（决定范围）。" },
 { q: "MySQL 中拼接字符串应该用哪个函数？", options: ["CONCAT()", "加号 +", "JOIN()", "MERGE()"], answer: 0, explain: "MySQL 用 CONCAT 拼接字符串（其他数据库可能用 || 或 +）。CONCAT 在注入里也很常用，用来把多个字段拼成一行结果。" }
],
6: [
 { q: "条件 WHERE role='user' AND username='alice' OR username='bob' 实际等价于？", options: ["role='user' AND (username='alice' OR username='bob')", "两个条件都不生效", "只有 username='bob' 生效", "(role='user' AND username='alice') OR (username='bob')"], answer: 3, explain: "AND 的优先级高于 OR。想表达「role 是 user 且名字是 alice 或 bob」必须加括号，否则 bob 无论什么角色都会被查出来。" },
 { q: "在注入测试中，ORDER BY 5 报错说明什么？", options: ["查询结果集的列数小于 5", "表被删除了", "语法写错了", "索引失效了"], answer: 0, explain: "ORDER BY 后面跟数字表示按第几列排序，超出列数就会报 Unknown column。逐次递增就能推断出真实的列数——这是 UNION 注入的前置步骤。" },
 { q: "优化深翻页（LIMIT 1000000, 10）的正确思路是？", options: ["加大内存", "改成 LIMIT 10", "改用游标：WHERE id > 上一次最后一个 id ORDER BY id LIMIT 10", "加更多索引"], answer: 2, explain: "深 OFFSET 会让 MySQL 先扫过并丢弃前面所有行。改成基于上一页最后一个 id 的游标查询，扫描量就变成常数级。" },
 { q: "WHERE username LIKE '%ad%' 相比 LIKE 'ad%' 的问题是什么？", options: ["结果不正确", "前导通配符导致索引失效，只能全表扫描", "语法错误", "会匹配到 NULL"], answer: 1, explain: "索引是有序结构，前导 % 让数据库无法定位起点，只能逐行比对。这就是「加索引也不生效」的典型场景。" }
],
7: [
 { q: "COUNT(email) 和 COUNT(*) 结果不同，原因是？", options: ["COUNT(*) 统计的是列数", "COUNT(列名) 会跳过该列为 NULL 的行", "两个函数随机返回", "COUNT(email) 会去重"], answer: 1, explain: "COUNT(*) 数行数；COUNT(列) 只数该列非 NULL 的行数。这是统计报表里「数字对不上」的常见原因。" },
 { q: "HAVING 与 WHERE 的区别是？", options: ["两者完全等价", "HAVING 用于 JOIN 之后的过滤", "WHERE 只能用于子查询", "WHERE 在分组前过滤行，HAVING 在分组后过滤组，且能用聚合函数"], answer: 3, explain: "执行顺序是 WHERE → GROUP BY → HAVING。所以「COUNT(*) > 2」这类聚合条件只能写在 HAVING 里。" },
 { q: "GROUP_CONCAT 在拖库时最需要注意什么？", options: ["默认长度上限 group_concat_max_len 只有 1024 字节，超出会被静默截断", "它不能拼接多个字段", "它只能用于数值列", "它会自动加密结果"], answer: 0, explain: "超出上限的部分会被截断，拿到的数据是残缺的。攻击者常见的下一步就是 SET SESSION group_concat_max_len 调大上限再重取。" },
 { q: "聚合函数在盲注中的作用是？", options: ["加快注入速度", "加密返回结果", "把一堆数据变成可判断的真/假结果，便于「问是/否」", "绕过 WAF"], answer: 2, explain: "例如 AND (SELECT COUNT(*) FROM user) > 5，返回页面的真假差异就成了信息渠道。聚合函数把「数据」变成了「结论」。" }
],
8: [
 { q: "要查出「从没下过订单的用户」，最合适的写法是？", options: ["INNER JOIN 后过滤 NULL", "右连接", "user LEFT JOIN orders ... WHERE orders.id IS NULL", "CROSS JOIN"], answer: 2, explain: "LEFT JOIN 保留左表全部行，右表没有匹配就补 NULL。再筛出右表主键为 NULL 的行，剩下的就是「没有关联记录」的那些。" },
 { q: "使用 UNION 合并两个结果集的必要前提是？", options: ["两个表的表名必须相同", "两个查询的列数必须一致（类型也要兼容）", "必须有外键关联", "必须都是 SELECT * "], answer: 1, explain: "列数不一致会直接报错。这正是 UNION 注入前必须先探列数的原因——不探清楚就没法构造后面的 SELECT。" },
 { q: "INNER JOIN 与 LEFT JOIN 的结果差异是？", options: ["INNER JOIN 只保留两边都匹配的行，LEFT JOIN 保留左表全部", "两者结果一样", "INNER JOIN 保留左表全部", "LEFT JOIN 只保留匹配的行"], answer: 0, explain: "INNER JOIN 取交集，LEFT JOIN 以左表为基准补 NULL。选错连接类型，统计结果会出现或多或少的错觉。" },
 { q: "为什么说 UNION 是「有回显注入」的首选手法？", options: ["因为它能绕过登录", "因为它不需要知道表名", "因为它速度最快", "因为它能把攻击者构造的查询结果并到原结果集里直接显示出来"], answer: 3, explain: "有回显时，UNION 可以一次取回一整列数据（配合 GROUP_CONCAT），效率远高于盲注逐位猜。" }
],
9: [
 { q: "EXPLAIN 结果里 type=ALL 表示什么？", options: ["全表扫描，没有用上索引", "使用了覆盖索引", "只扫描了一行", "用上了主键查找"], answer: 0, explain: "type 从好到差是 system > const > eq_ref > ref > range > index > ALL。ALL 意味着逐行扫描整张表，是优化的重点目标。" },
 { q: "复合索引 (user_id, status) 对哪个查询无效？", options: ["WHERE user_id=1", "WHERE user_id=1 AND status='paid'", "WHERE status='paid'", "WHERE user_id=1 ORDER BY status"], answer: 2, explain: "复合索引遵循最左前缀原则，跳过最左列 user_id 单独查 status，索引用不上。" },
 { q: "下列哪种写法会让索引失效？", options: ["WHERE created_at >= '2026-01-01'", "WHERE YEAR(created_at) = 2026", "WHERE id > 100", "WHERE username = 'admin'"], answer: 1, explain: "对索引列做函数运算，MySQL 无法用索引直接定位。改写成范围条件 created_at >= '2026-01-01' AND created_at < '2027-01-01' 就能走索引。" },
 { q: "针对「用户可控排序字段导致慢查询」的加固措施是？", options: ["关闭数据库的排序功能", "给所有列都建索引", "加大 CPU", "排序字段白名单校验 + 分页数量上限 + 深分页改游标"], answer: 3, explain: "排序字段属于「结构」，不能参数化，只能白名单；再加上分页上限，才能防止有人用一条查询把数据库资源耗尽。" }
],
10: [
 { q: "事务的「原子性」指的是？", options: ["数据永久保存", "事务里的操作要么全部成功，要么全部不做", "并发事务互不干扰", "事务执行得很快"], answer: 1, explain: "原子性是转账场景的核心：扣款和入账必须同时成立，中途失败要整体回滚，不能出现「扣了钱没到账」。" },
 { q: "MySQL（InnoDB）的默认隔离级别是？", options: ["READ UNCOMMITTED", "SERIALIZABLE", "READ COMMITTED", "REPEATABLE READ"], answer: 3, explain: "MySQL 默认是 REPEATABLE READ，能防住脏读和不可重复读，幻读则由间隙锁基本解决。Oracle/PostgreSQL 默认是 READ COMMITTED。" },
 { q: "UPDATE orders SET status='paid' WHERE status='pending' 且 status 没有索引，会有什么后果？", options: ["引擎扫过的行都会被锁住，效果接近锁全表，其他写请求排队等待", "只锁住符合条件的那几行", "语句会自动失败", "会自动创建索引"], answer: 0, explain: "InnoDB 的行锁加在索引上。没有可用索引时只能全表扫描并锁住扫过的行。这既是性能事故，也是并发安全问题。" },
 { q: "线上出现死锁，想看完整现场应该用哪条命令？", options: ["SHOW TABLES", "EXPLAIN SELECT 1", "SHOW ENGINE INNODB STATUS", "SHOW VARIABLES"], answer: 2, explain: "它的 LATEST DETECTED DEADLOCK 段落会列出两个事务各自持有什么锁、在等什么，是定位死锁根因的关键依据。" }
],
11: [
 { q: "视图最实用的安全用途是？", options: ["给查询加速", "自动备份数据", "只暴露必要的列（例如隐藏 password），作为受限接口", "加密数据"], answer: 2, explain: "可以把视图的查询权限给某个账号，而不给基表权限。这样这个账号就只能看到视图里暴露的列，拿不到敏感字段。" },
 { q: "存储过程的 DEFINER 为什么是提权风险点？", options: ["因为过程按创建者（DEFINER）的权限执行，若 DEFINER 是高权账号，调用者就借它获得高权限操作能力", "因为 DEFINER 会暴露在网络上", "因为 DEFINER 会减慢查询", "因为它会自动删除数据"], answer: 0, explain: "审计时要专门查 information_schema.routines，找出「DEFINER 是高权账号、调用者权限却很低」的组合——那通常就是提权路径。" },
 { q: "存储过程能自动防止 SQL 注入吗？", options: ["能，只要写在过程里就安全", "不能——安全的是「参数传递」，过程内部若用 CONCAT 拼串再 PREPARE 执行，照样会被注入", "能，过程会加密参数", "不能，因为过程不支持参数"], answer: 1, explain: "安全来自参数化（值只作为值传递），不是来自「写在了过程里」。过程内部拼字符串再动态执行的写法同样危险。" },
 { q: "审计一个陌生数据库时，想看有没有隐藏的存储过程和触发器，该查哪些系统表？", options: ["只看 SHOW TABLES 就够", "查 mysql.user", "查 information_schema.tables", "information_schema.routines、triggers、views 都要查"], answer: 3, explain: "很多审计工具只扫表结构，routine / trigger / view 是常见的盲区——后门藏在这些对象里可以长期存活。" }
],
12: [
 { q: "mysqldump 的 --single-transaction 参数作用是？", options: ["让备份跑得更快", "在 InnoDB 上利用事务快照保证备份一致性，不用锁表", "只备份表结构", "自动压缩备份文件"], answer: 1, explain: "加了它，备份期间有人写数据也不会拿到「半新半旧」的结果。注意它对 MyISAM 表无效。" },
 { q: "关于备份，下面哪个说法最重要？", options: ["备份文件越小越好", "备份要每天做", "只要有自动备份就安全了", "没有做过恢复验证的备份，等于没有备份"], answer: 3, explain: "最常见的翻车场景是备份脚本跑了半年没人看，真出事时才发现文件是空的。定期做恢复演练是必须的。" },
 { q: "全量备份和 binlog 的配合关系是？", options: ["备份决定能退多远，binlog 决定能退多准（可恢复到任意时间点）", "两者互相替代", "binlog 只能用于主从复制", "binlog 比备份更省空间所以不需要备份"], answer: 0, explain: "先用全量备份回到某个时刻，再用 binlog 把之后的变更补回来，才能精确恢复到故障前一刻。" },
 { q: "SHOW VARIABLES LIKE 'secure_file_priv' 返回 NULL 表示？", options: ["不限制读写任意目录", "变量未设置", "完全禁止文件导入导出（最安全）", "只能读取不能写入"], answer: 2, explain: "返回具体路径表示只能操作该目录；返回空字符串表示不限制（危险）；返回 NULL 表示彻底禁止读写文件——这是加固推荐值。" }
],
13: [
 { q: "SQL 注入能成立的根本原因是？", options: ["用户输入被当作 SQL 结构拼进语句并被执行", "数据库密码太简单", "没有建索引", "服务器没有装杀毒软件"], answer: 0, explain: "一句话概括：输入被当成了代码。「输入即代码」是所有注入类型的共同根因，修复手段也必须围绕「结构与数据分离」。" },
 { q: "传入 2-1 后返回了 id=1 的数据，最可能说明？", options: ["数据库算错了", "参数是字符型", "参数是数字型（表达式被直接计算）", "存在 UNION 注入"], answer: 2, explain: "数字型注入里参数直接拼进语句，2-1 会被当作表达式求值。字符型则会被引号包住当字符串，不会计算。" },
 { q: "MySQL 中 -- 注释符要生效，后面必须跟什么？", options: ["必须跟一个分号", "必须跟一个空格（或控制字符）", "必须独占一行", "必须跟一个新的 SELECT"], answer: 1, explain: "MySQL 要求 -- 后面是空白才构成注释，--x 不是注释。URL 里常用 --+ 或 --%20 来保证有空格；# 也可以做注释（需编码成 %23）。" },
 { q: "为什么「过滤单引号」不能作为注入防御？", options: ["因为过滤会让查询变慢", "因为单引号是合法字符", "因为数据库不支持单引号", "因为数字型注入根本不用单引号，而且编码变形、宽字节等手法都能绕过黑名单"], answer: 3, explain: "黑名单永远追不上输入的可能性。真正的修复只有两条：能参数化的用参数，不能参数化的（表名、列名、排序字段）用白名单。" }
],
14: [
 { q: "使用 UNION 注入前必须先确定什么？", options: ["数据库的密码", "网站使用的编程语言", "原查询返回的列数（并且页面有回显）", "服务器的操作系统版本"], answer: 2, explain: "列数不一致会直接报错，而且必须找到页面的回显位置才能看到数据。所以顺序是：探列数 → 找回显位 → 构造 UNION。" },
 { q: "探列数最常用的手法是？", options: ["ORDER BY n 逐次递增，报错即说明超出列数", "查询 information_schema", "用 SLEEP 延时判断", "直接猜 10 列"], answer: 0, explain: "ORDER BY 后面跟数字表示按第几列排序，超出列数会报 Unknown column。本站的 demo2 表只有 2 列，专门用来演示这个。" },
 { q: "information_schema 里，查「某张表有哪些列」应该用哪张表？", options: ["SCHEMATA", "COLUMNS", "TABLES", "STATISTICS"], answer: 1, explain: "SCHEMATA 存库名，TABLES 存表名，COLUMNS 存列名与类型。三者串起来就是「库 → 表 → 列」的完整枚举链。" },
 { q: "为什么注入时有时只拿到一半的数据？", options: ["网络丢包", "数据库按行截断", "编码问题", "GROUP_CONCAT 的 group_concat_max_len 默认 1024 字节，超出部分被静默截断"], answer: 3, explain: "解决办法是调大上限（SET SESSION group_concat_max_len），或用 LIMIT 逐行取。日志里出现这个 SET 也是明确的注入特征。" }
],
15: [
 { q: "布尔盲注的基本原理是？", options: ["让数据库报错回显数据", "页面不显示数据，但真假条件会产生不同的页面结果，借此一位一位地推断", "用响应时间判断", "直接读取数据库文件"], answer: 1, explain: "布尔盲注把数据查询改造成「是/否」问题，例如判断某字符的 ASCII 码是否大于 100，靠页面差异收敛答案。" },
 { q: "下列哪组特征最像时间盲注？", options: ["页面显示 SQL 语法错误", "返回的行数突然变多", "响应内容包含表名", "参数里出现 SLEEP 或 BENCHMARK，且响应时间规律性地变长"], answer: 3, explain: "时间盲注只能靠响应时间传递信息，所以每个字符都要拖几秒。这个特征在日志里极其显眼，是最好检测的一类注入。" },
 { q: "二次注入最大的特点是？", options: ["数据写入时被正确转义，但在后续取出使用时又被拼接执行", "需要两次 HTTP 请求才能成功", "只能用于 MySQL", "会同时影响两个数据库"], answer: 0, explain: "它跨越了「写」和「读」两个环节，只看单次请求的安全检查发现不了。防御结论：来自数据库的数据同样不可信，一律参数化。" },
 { q: "宽字节注入成立的关键前提是什么？", options: ["使用了 PostgreSQL", "服务器开启了严格模式", "数据库或连接字符集是 GBK 等双字节编码，且用转义函数而非预处理", "使用了 UTF-8 编码"], answer: 2, explain: "GBK 下 %df%5c 会被解析成一个汉字，把转义用的反斜杠吃掉，单引号就逃逸出来。防御是统一 utf8mb4 + 改用预处理。" }
],
16: [
 { q: "用 LOAD_FILE() 读服务器文件，不需要下列哪一项？", options: ["FILE 权限", "参数给出的路径在 secure_file_priv 允许范围内", "文件对 mysqld 进程可读", "数据库必须运行在 Windows 上"], answer: 3, explain: "三个前提是 FILE 权限、目录限制放行、OS 层可读。Linux 和 Windows 都可能被利用，只是路径写法不同。" },
 { q: "关于 INTO OUTFILE，下列说法正确的是？", options: ["可以覆盖任意已存在的文件", "目标文件必须不存在，且需要 FILE 权限与 secure_file_priv 放行", "不需要任何权限", "只能导出到数据库的 datadir"], answer: 1, explain: "它不能覆盖已存在的文件，这也意味着攻击者每次都要换文件名。防御手段是收回 FILE 权限 + 把 secure_file_priv 设为 NULL。" },
 { q: "要彻底掐断「注入 → 写 WebShell」这条链，最有效的措施是？", options: ["给数据库装杀毒软件", "把 Web 目录设为只读", "收回业务账号的 FILE 权限，并把 secure_file_priv 设为 NULL", "关闭 3306 端口"], answer: 2, explain: "这条链需要三把钥匙：FILE 权限、目录限制放行、OS 层可写。收回权限与设置 NULL 直接让前两把钥匙失效，Web 目录权限则是第三层保险。" },
 { q: "UDF 提权的原理是？", options: ["把共享库写入插件目录并注册成自定义函数，从而在数据库服务器上执行系统命令", "利用数据库的备份功能", "通过弱口令登录", "修改 SQL 语句的语法"], answer: 0, explain: "它需要 FILE（写文件）与 CREATE FUNCTION（注册）等权限。防御要点：业务账号无这些权限、插件目录严格受限、mysqld 以低权限账号运行。" }
],
17: [
 { q: "预处理（参数化查询）为什么能根治 SQL 注入？", options: ["因为它会加密参数", "因为它把「编译 SQL 结构」和「传入数据」分成两步，结构一旦定型就无法被输入改写", "因为它过滤了所有危险字符", "因为它使用更快的协议"], answer: 1, explain: "参数永远只能作为「值」填入，不可能改变已经编译好的结构。所以它不依赖黑名单，也不怕编码变形。" },
 { q: "下面哪个位置不能靠参数占位符解决，只能用白名单？", options: ["INSERT 的值", "WHERE 的等值条件", "UPDATE 的 SET 值", "ORDER BY 的排序字段名"], answer: 3, explain: "占位符只能代表「值」，不能代表「标识符」。表名、列名、排序字段都是结构，必须用白名单映射校验。" },
 { q: "PDO 的 ATTR_EMULATE_PREPARES 设为 true 意味着什么？", options: ["使用真正的服务端预编译", "自动加密查询", "由客户端拼字符串并转义来「模拟」预处理，转义依赖字符集，配置不当时仍有风险", "关闭 PDO 的错误提示"], answer: 2, explain: "推荐显式设为 false，让 MySQL 做真正的服务端预处理。历史上「用了 PDO 仍被注入」的案例多与此有关。" },
 { q: "除了参数化，第 17 章还强调哪三件配套动作？", options: ["关闭对外错误回显、业务账号最小权限、日志与 WAF 检测", "升级硬件、加密磁盘、定期重启", "使用 ORM、限制访问频率、开启 CDN", "多做备份、多开索引、多用缓存"], answer: 0, explain: "参数化修的是根因；关掉报错回显断掉报错注入；最小权限决定事故上限；日志与 WAF 负责发现正在进行的攻击。" }
],
18: [
 { q: "为什么业务账号不要用 'app'@'%' 这种写法？", options: ["因为 % 会导致语法错误", "因为 % 会让账号变慢", "因为 % 表示任意来源主机，任何网络能到 3306 的地方都能尝试登录", "因为没有区别"], answer: 2, explain: "把来源限定成应用服务器的实际 IP，等于多加了一道网络层的锁。这是配权限时最容易被省略、性价比却很高的一步。" },
 { q: "下列哪一项是必须从业务账号收回的高危权限？", options: ["FILE", "SELECT", "INSERT", "UPDATE"], answer: 0, explain: "FILE 让账号能读写服务器文件——读配置拿口令、写 WebShell getshell。业务账号几乎永远不需要它。" },
 { q: "应用使用 root 账号连接数据库，最大的问题是什么？", options: ["连接速度变慢", "会导致字符集错误", "会让备份变慢", "一次注入就等于全线失守：可以拖全库、读文件、删库"], answer: 3, explain: "权限不能代替修漏洞，但它决定事故的严重程度。root 连库等于把「一个注入点」放大成「整个数据库服务器」。 " },
 { q: "最小权限做得好的情况下，一个注入点的影响会被限制到什么程度？", options: ["完全无法利用", "只能拿到该账号有权访问的数据，且读写删的范围都受限", "仍然能删库", "仍然能读写服务器文件"], answer: 1, explain: "注入本身仍然存在（数据泄露是事实），但攻击者的收获被限制在账号权限范围内——这就是「纵深防御」的含义。" }
],
19: [
 { q: "数据库加固中，优先级最高（成本最低收益最大）的一项是？", options: ["3306 不对公网开放，只允许应用服务器访问", "开启全部日志", "给所有表加索引", "定期重启数据库"], answer: 0, explain: "暴露在公网的 3306 几乎瞬间就会被扫到并持续爆破。先收网络暴露，再收权限，最后才是配置与日志。" },
 { q: "长期开启 general_log（通用日志）的主要代价是？", options: ["会导致数据丢失", "会让索引失效", "会显著拖慢数据库并迅速写满磁盘，只能临时用来排查", "会自动删除 binlog"], answer: 2, explain: "它记录所有语句，信息最全但代价最高。长期方案是用慢查询日志加审计插件，只关注异常语句。" },
 { q: "日志里出现哪类特征最像时间盲注？", options: ["大量的 SELECT * 查询", "参数中出现 SLEEP / BENCHMARK，且同一接口被高频请求、响应时间稳定偏长", "出现了 SHOW TABLES", "出现了 BEGIN 和 COMMIT"], answer: 1, explain: "时间盲注靠响应时间传递信息，每个字符都要拖几秒，所以请求模式非常有规律。这是最容易做成告警规则的一类。" },
 { q: "使用云数据库（RDS）时，最容易漏的一项加固是？", options: ["给数据库改名", "把端口从 3306 改掉", "开启自动备份", "开了自动备份但从不验证能不能恢复"], answer: 3, explain: "云上备份和恢复都很方便，但「没验证过」这个坑依然存在。恢复演练是所有环境都逃不掉的一步。" }
],
20: [
 { q: "数据库 CPU 被打满、接口全部超时，第一步应该做什么？", options: ["先重启数据库", "先改配置文件", "先看当前在跑什么语句（SHOW PROCESSLIST / information_schema.processlist）", "先恢复备份"], answer: 2, explain: "先取现场证据，才知道是慢查询、锁等待还是洪水请求。盲目重启会让现场消失，问题几分钟后照样复发。" },
 { q: "发现核心表被清空，第一件该做的事是？", options: ["立刻重建表", "立刻恢复备份", "立刻重启数据库", "先止损（停掉可疑入口）并确认影响范围，再取证据定位原因"], answer: 3, explain: "服务还在被破坏时先重建或恢复，很可能被立刻再删一次。顺序是：止损 → 取证 → 恢复 → 加固防复发。" },
 { q: "一条「只更新几条记录」的语句却锁住了整张表，最可能的原因是？", options: ["WHERE 条件用不上索引，引擎扫过的行都被锁住", "数据库版本太老", "磁盘空间不足", "网络延迟"], answer: 0, explain: "InnoDB 行锁加在索引上。EXPLAIN 看到 type=ALL 基本就能确认。给条件列建索引，同时解决性能和并发两个问题。" },
 { q: "数据库事故处理的正确顺序是？", options: ["先改代码 → 再恢复数据 → 最后定位原因", "先恢复可用性 → 再取证据定位根因 → 最后落到配置或代码上加固防复发", "先加固 → 再止损 → 最后恢复", "先删除日志 → 再重启 → 最后查原因"], answer: 1, explain: "顺序反了就会在服务崩溃时抢救数据。和网络排障一样：先止损恢复，再定位，最后防复发。" }
]
};
