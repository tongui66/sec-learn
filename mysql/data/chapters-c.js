// MySQL 学习站 v2 · 第 9-12 章：性能、事务与运维
var CHAPTERS_C = [
{
id:9, title:"索引、EXPLAIN 与查询性能", stage:"查询与性能",
intro:"索引像书的目录，让查询从「逐行翻全表」变成「直接翻到那一页」。安全角度它同样重要：没有索引的库加上用户可控的排序和过滤，就是慢查询拒绝服务的温床。",
sections:[
{h:"9.1 索引为什么快", p:["没有索引时，MySQL 必须<b>全表扫描</b>：一行一行比对，行数越多越慢。有索引时，数据按 B+ 树组织，能在几次磁盘读取内定位到目标。"]},
{tbl:[
["对比","全表扫描","走索引"],
["查找方式","逐行比对","B+ 树逐层下降"],
["100 万行的代价","可能要读 100 万行","通常 3-4 次磁盘读取"],
["EXPLAIN 中的 type","ALL","const / ref / range"]]},
{note:"代价也要记住：索引占磁盘空间，而且每次 INSERT / UPDATE / DELETE 都要同步维护索引，写入会变慢一点点。<b>索引不是越多越好，建在真正会被 WHERE / JOIN / ORDER BY 用到的列上</b>。"},
{h:"9.2 建索引与最左前缀", code:[
"-- 普通索引\nCREATE INDEX idx_username ON user(username);\n\n-- 唯一索引（值不能重复）\nCREATE UNIQUE INDEX idx_email ON user(email);\n\n-- 复合索引（多个列组成一个索引）\nCREATE INDEX idx_user_status ON orders(user_id, status);\n\n-- 查看表上有哪些索引\nSHOW INDEX FROM orders;\n\n-- 删除索引\nDROP INDEX idx_username ON user;"]},
{p:["复合索引遵循<b>最左前缀原则</b>：`(user_id, status)` 这个索引，能加速「按 user_id 查」和「按 user_id + status 查」，但<b>单独按 status 查用不上它</b>。"]},
{code:[
"-- 假设有索引 idx_user_status(user_id, status)\nEXPLAIN SELECT * FROM orders WHERE user_id = 1;                  -- ✅ 用得上\nEXPLAIN SELECT * FROM orders WHERE user_id = 1 AND status='paid'; -- ✅ 用得上\nEXPLAIN SELECT * FROM orders WHERE status = 'paid';              -- ❌ 用不上（跳过最左列）"]},
{h:"9.3 EXPLAIN：看懂 MySQL 怎么执行", code:[
"EXPLAIN SELECT * FROM orders WHERE user_id = 1 AND status = 'paid';\\G\n\n-- 重点看这几列：\n--   type   访问类型，从好到差：\n--            system > const > eq_ref > ref > range > index > ALL\n--            const 常量查找；ref 用索引查找；range 范围扫描；ALL 全表扫描（最差）\n--   key    实际用了哪个索引（NULL 表示没用索引）\n--   key_len 索引用了几个字节（可判断复合索引用到第几列）\n--   rows   预估要扫描多少行（越小越好）\n--   Extra  额外信息：\n--            Using index      覆盖索引，不回表（很好）\n--            Using where       服务器层还要过滤\n--            Using filesort   额外排序，没有用上索引排序（要注意）\n--            Using temporary  用了临时表（分组/去重时常见，要优化）"]},
{h:"9.4 会让索引失效的六种写法", tbl:[
["写法","为什么失效","改法"],
["`WHERE YEAR(created_at) = 2026`","对索引列做了函数运算","改成范围：`created_at >= '2026-01-01' AND < '2027-01-01'`"],
["`WHERE username LIKE '%ad%'`","前导通配符无法定位起点","要用前后匹配就上全文索引"],
["`WHERE age = '25'`（age 是 INT）","隐式类型转换","类型对齐，`age = 25`"],
["`WHERE a = 1 OR b = 2`（b 无索引）","OR 一侧无索引，整体退化为全表扫","给 b 也建索引，或改写成 UNION"],
["复合索引跳列：`WHERE status = 'paid'`","违反最左前缀","调整索引列顺序或补索引"],
["`WHERE id <> 1`","不等值通常用不上索引","能用范围就用范围"]]},
{h:"9.5 慢查询日志：找出拖慢数据库的语句", code:[
"-- 看慢查询配置\nSHOW VARIABLES LIKE 'slow_query_log';\nSHOW VARIABLES LIKE 'long_query_time';\nSHOW VARIABLES LIKE 'slow_query_log_file';\n\n-- 临时开启，记录超过 1 秒的语句\nSET GLOBAL slow_query_log = 'ON';\nSET GLOBAL long_query_time = 1;\nSET GLOBAL log_queries_not_using_indexes = 'ON';   -- 顺便记录没走索引的\n\n-- 查正在运行的语句（找长事务/慢查询现场）\nSHOW PROCESSLIST;\nSELECT id, user, time, state, info FROM information_schema.processlist WHERE time > 5;\n\n-- 杀掉一条跑太久的语句\nKILL 12345;"]},
{h:"9.6 安全视角：性能和攻击面是同一件事", ul:["<b>慢查询拒绝服务</b>：如果排序字段、过滤条件由用户控制，攻击者可以构造「必须全表扫描 + 巨大排序」的查询，把数据库 CPU 打满。没有索引的表尤其脆弱。",
"<b>深翻页放大效应</b>：`LIMIT 1000000,10` 这类请求，一个请求就能消耗大量资源，十几个并发就能压垮。",
"<b>时序侧信道</b>：索引的有无会影响响应时间，理论上可被用来推断数据特征（真实攻击里较少用，但概念要懂）。",
"<b>索引本身就是数据副本</b>：索引里含实际列值，所以备份和权限同样要管住索引文件。"]},
{tip:"加固清单里加两条：<b>① 用户可控的排序/过滤字段必须白名单</b>（不能直接拼 `ORDER BY {用户输入}`），<b>② 所有分页接口强制带上限</b>（例如最多 100 条、深分页改游标）。这两条能挡掉大部分数据库层的资源耗尽攻击。"}
],
secview:"索引决定「快不快」，也决定「扛不扛打」。记住两句话：不能参数化的排序字段必须白名单；分页必须有上限。做到这两条，用户就没办法用一条查询把你数据库拖死。"
},
{
id:10, title:"事务、隔离级别与锁", stage:"事务与运维",
intro:"事务保证「要么全成、要么全没」——转账不能转一半。这一章除了 ACID，更重要的是锁：因为它解释了为什么「UPDATE 一定要带索引条件」，也解释了线上那些莫名其妙的互相等待。",
sections:[
{h:"10.1 事务的 ACID", tbl:[
["特性","含义","失去它会怎样"],
["原子性 Atomicity","要么全做，要么全不做","转账扣了钱没到账"],
["一致性 Consistency","事务前后数据都满足约束","总账对不上"],
["隔离性 Isolation","并发事务互不干扰","看到别人未提交的脏数据"],
["持久性 Durability","提交后就算断电也不丢","提交成功但重启后数据没了"]]},
{h:"10.2 事务语法", code:[
"START TRANSACTION;                          -- 开启事务\nUPDATE account SET balance = balance - 100 WHERE id = 1;\nUPDATE account SET balance = balance + 100 WHERE id = 2;\n-- 检查两条都成功\nCOMMIT;                                     -- 提交\n-- 如果中间出错或余额不足：\n-- ROLLBACK;                                -- 回滚，前面两条一起撤销\n\n-- 关键：MySQL 默认 autocommit = 1，单条语句自动提交\nSELECT @@autocommit;                        -- 1\nSET autocommit = 0;                         -- 需要手动 COMMIT，容易忘，慎用"]},
{h:"10.3 四种隔离级别", tbl:[
["隔离级别","能防住","防不住","说明"],
["READ UNCOMMITTED","——","脏读、不可重复读、幻读","能读到别人未提交的数据，基本不用"],
["READ COMMITTED","脏读","不可重复读、幻读","Oracle/PostgreSQL 默认"],
["REPEATABLE READ","脏读、不可重复读","幻读（InnoDB 用间隙锁基本解决）","<b>MySQL 默认</b>"],
["SERIALIZABLE","全部","并发性能最差","事务串行执行"]]},
{tbl:[
["并发问题","现象"],
["脏读","读到了别的事务还没提交的数据，对方一回滚你就读错了"],
["不可重复读","同一事务内两次读同一行，结果不一样（别人改了并提交）"],
["幻读","同一事务内两次按条件查，第二次多出几行（别人插入了新行）"]]},
{code:[
"-- 查看与设置当前会话隔离级别\nSELECT @@transaction_isolation;                                  -- MySQL 8.0\nSET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;"]},
{h:"10.4 锁：为什么 UPDATE 要带索引条件", p:["InnoDB 的行锁是<b>加在索引上</b>的。如果 WHERE 条件用不上索引，引擎只能扫全表，并把扫过的行都锁住——效果接近锁全表。"]},
{tbl:[
["UPDATE 的写法","实际锁范围"],
["`WHERE id = 1`（主键）","只锁这一行"],
["`WHERE user_id = 1`（有索引）","锁索引命中的那些行"],
["`WHERE status = 'pending'`（<b>无索引</b>）","扫过的所有行都被锁，接近锁全表"],
["`WHERE name = 'x'`（无索引，表无主键）","几乎等同全表锁"]]},
{note:"这解释了线上很常见的一类故障：<b>一条「只是更新几行」的语句把整张表锁住，导致其他请求全部排队超时</b>。原因往往就是 WHERE 的列没有索引。<b>索引不只是性能问题，也是并发安全问题。</b>"},
{h:"10.5 死锁：互相等对方，谁都动不了", p:["死锁的典型形态：事务 A 锁了第 1 行等第 2 行，事务 B 锁了第 2 行等第 1 行——两边互不相让。"]},
{code:[
"-- 会话 1                          会话 2\nSTART TRANSACTION;\nUPDATE t SET v=1 WHERE id=1;      START TRANSACTION;\n                                  UPDATE t SET v=1 WHERE id=2;\nUPDATE t SET v=1 WHERE id=2;   -- 等待\n                                  UPDATE t SET v=1 WHERE id=1;   -- 死锁！\n-- InnoDB 检测到死锁后，会回滚其中一个事务（代价小的那个）\n\n-- 看最近一次死锁的完整现场\nSHOW ENGINE INNODB STATUS\\G\n--   LATEST DETECTED DEADLOCK 段落会列出两个事务各持有什么锁、在等什么\n\n-- 查看当前锁等待\nSELECT * FROM performance_schema.data_locks;\nSELECT * FROM performance_schema.data_lock_waits;"]},
{ol:["<b>按固定顺序访问</b>：多个事务都按 id 从小到大更新，就不会交叉等待。",
"<b>事务尽量短</b>：不要把网络请求、文件读写放在事务里。",
"<b>WHERE 带上索引条件</b>：锁的范围小，撞车概率就低。",
"<b>必要时降低死锁检测开销</b>：`innodb_deadlock_detect`、`innodb_lock_wait_timeout`（这是调优，不是解法）。"]},
{h:"10.6 网安视角：事务和锁的安全含义", ul:["<b>没有事务的转账逻辑是可被利用的</b>：并发请求下可能出现「扣了钱没到账」或「余额被刷成负数」，这类竞态条件本身就是漏洞。",
"<b>长事务会阻塞别人</b>：一个忘了 COMMIT 的事务能把整张表卡住——这可以是恶意行为（一条语句制造大范围锁），也可以是事故。",
"<b>锁等待可以被用来探测</b>：某些注入场景下，攻击者用锁等待制造延时，这就是时间盲注的变体。",
"<b>审计要看长事务</b>：`information_schema.innodb_trx` 里跑了几十分钟的事务，值得逐个确认。"]},
{code:[
"-- 审计：找出运行超过 60 秒的事务\nSELECT trx_id, trx_state, trx_started,\n       TIMESTAMPDIFF(SECOND, trx_started, NOW()) AS 已运行秒数,\n       trx_mysql_thread_id, trx_query\nFROM information_schema.innodb_trx\nWHERE TIMESTAMPDIFF(SECOND, trx_started, NOW()) > 60;"]}
],
secview:"事务保证「要么全成要么全没」，锁保证「并发不打架」。最实用的一条结论：<b>UPDATE 的 WHERE 必须走索引</b>——否则一次更新会锁住接近整张表，既是性能事故，也是并发安全问题。"
},
{
id:11, title:"视图、存储过程与触发器", stage:"事务与运维",
intro:"这三个对象是数据库里的「可编程部分」。它们能帮你做权限隔离和审计，但也常常成为审计盲区——很多被入侵的库，问题就藏在某个 DEFINER 为 root 的存储过程里。",
sections:[
{h:"11.1 视图：把敏感列藏起来", code:[
"-- 建视图：只暴露必要字段，隐藏 password\nCREATE VIEW v_user_safe AS\nSELECT id, username, email, role, created_at FROM user;\n\n-- 用视图查询，碰不到 password 列\nSELECT * FROM v_user_safe;\n\n-- 看看库里有哪些视图\nSHOW FULL TABLES WHERE Table_type = 'VIEW';\n\n-- 删除视图\nDROP VIEW v_user_safe;"]},
{p:["视图的三大用途：<b>隐藏敏感列</b>、<b>简化复杂查询</b>、<b>作为只读接口</b>。可以只把视图的查询权限给某个账号，而不给它基表的权限——这是很实用的权限隔离手段。"]},
{h:"11.2 视图的安全细节", ul:["<b>视图不是加密</b>：拿到基表权限的人照样能看全部列，视图只对「只有视图权限」的账号起作用。",
"<b>可更新视图有前提</b>：简单视图才可能支持 INSERT/UPDATE，复杂视图（含聚合、JOIN）通常只读。",
"<b>DEFINER 决定执行身份</b>：视图按创建者（DEFINER）的权限执行。如果 DEFINER 是 root，那么有视图权限的人可能间接获得 root 的数据访问能力——这是提权的经典路径。",
"<b>WITH CHECK OPTION</b>：限制通过视图插入/更新的行必须满足视图条件。"]},
{code:[
"-- 看视图的定义和执行身份（安全审计必看）\nSELECT TABLE_NAME, DEFINER, SECURITY_TYPE, VIEW_DEFINITION\nFROM information_schema.views\nWHERE TABLE_SCHEMA = 'shop';\n\n-- 建视图时显式指定执行身份\nCREATE DEFINER = 'app'@'localhost' SQL SECURITY DEFINER VIEW v_x AS SELECT ...;"]},
{h:"11.3 存储过程：能防注入，也可能成为后门", code:[
"-- 修改语句结束符，才能定义过程体\nDELIMITER $$\n\nCREATE PROCEDURE sp_get_user(IN p_name VARCHAR(50))\nBEGIN\n  -- 用参数查询：这里天然是参数化的，不会被注入\n  SELECT id, username, role FROM user WHERE username = p_name;\nEND $$\n\nDELIMITER ;\n\n-- 调用\nCALL sp_get_user('admin');\n\n-- 查看库里所有存储过程及定义者\nSELECT ROUTINE_NAME, DEFINER, SECURITY_TYPE FROM information_schema.routines\nWHERE ROUTINE_SCHEMA = 'shop';"]},
{p:["存储过程本身不会让 SQL 变安全——<b>安全的是「参数」，不是「过程」</b>。如果在过程内部用 `CONCAT` 拼字符串再 `PREPARE` 执行，一样能被注入。"]},
{code:[
"-- ❌ 过程内部拼接，照样能注入\nSET @sql = CONCAT('SELECT * FROM user WHERE username = ''', p_name, '''');\nPREPARE stmt FROM @sql; EXECUTE stmt;\n\n-- ✅ 用参数传递\nSELECT * FROM user WHERE username = p_name;"]},
{warn:"存储过程的两个安全风险必须知道：<b>① DEFINER 提权</b>——如果过程定义者是 root，调用者就能借它执行高权限操作；<b>② 过程体是审计盲区</b>——很多工具只扫表结构，不扫 routine，后门可以藏在里面长期存活。审计时一定要单独查 `information_schema.routines`。"},
{h:"11.4 触发器：做审计日志很合适", code:[
"-- 记录订单状态变更，写进审计表\nDELIMITER $$\nCREATE TRIGGER trg_orders_status\nAFTER UPDATE ON orders\nFOR EACH ROW\nBEGIN\n  IF OLD.status <> NEW.status THEN\n    INSERT INTO admin_log (action, operator, created_at)\n    VALUES (CONCAT('order ', OLD.id, ' status: ', OLD.status, ' -> ', NEW.status), USER(), NOW());\n  END IF;\nEND $$\nDELIMITER ;\n\n-- 测试：改一条状态，观察日志\nUPDATE orders SET status = 'paid' WHERE id = 3;\nSELECT * FROM admin_log ORDER BY id DESC LIMIT 5;\n\n-- 查看现有触发器\nSHOW TRIGGERS;\n-- 或\nSELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE, DEFINER\nFROM information_schema.triggers WHERE TRIGGER_SCHEMA = 'shop';"]},
{tip:"触发器做「变更留痕」很实用，但要克制：<b>它让每一次写操作都变重，而且出错时很难排查</b>（业务报错可能来自触发器）。生产环境更常见的做法是应用层写审计日志，触发器只用于关键表的兜底。"}
],
secview:"视图、过程、触发器都是「执行身份（DEFINER）」和「权限」的组合体。审计口诀：把 `information_schema.views / routines / triggers` 三张表都查一遍，看有没有 DEFINER 是高权限账号、而调用者权限很低的组合——那通常就是提权风险。"
},
{
id:12, title:"备份、恢复与数据安全", stage:"事务与运维",
intro:"备份是数据库的最后一道防线：注入能防、权限能收，但只要备份没做好，一次误删或勒索就足以让业务停摆。这一章讲怎么备份、怎么验证，以及敏感数据该怎么存。",
sections:[
{h:"12.1 为什么备份不可替代", ul:["<b>误删</b>：`DELETE` 少写 WHERE、`DROP TABLE` 手抖——这类事故每周都在发生。",
"<b>勒索</b>：攻击者加密数据索要赎金，没有离线备份就只能付钱（而且付了也未必给密钥）。",
"<b>硬件与逻辑损坏</b>：磁盘坏了、表损坏了。",
"<b>合规要求</b>：等保、行业监管要求留存和可恢复。"]},
{p:["备份策略要能回答三个问题：<b>多久备一次？有没有异地/离线副本？多久演练一次恢复？</b>三个问题有一个答不上来，就等于没有备份。"]},
{h:"12.2 用 mysqldump 做逻辑备份", code:[
"# 备份单个库（InnoDB 一致性快照，不锁表）\nmysqldump -u root -p --single-transaction shop > shop_backup.sql\n\n# 备份全库 + 导出存储过程和触发器（默认不导出，很容易漏）\nmysqldump -u root -p --all-databases --single-transaction --routines --triggers --events > all_backup.sql\n\n# 只备份表结构\nmysqldump -u root -p --no-data shop > shop_schema.sql\n\n# 备份成带时间戳的文件（避免覆盖）\nmysqldump -u root -p shop > shop_$(date +%F_%H%M).sql"]},
{note:"`--single-transaction` 为什么重要？它利用 InnoDB 的 MVCC 在事务快照上做备份，<b>不需要锁表就能保证数据一致</b>。不加这个参数，备份过程中有人写数据，你拿到的备份可能是「半新半旧」的。注意：对 MyISAM 表无效。"},
{h:"12.3 恢复与验证（比备份更重要）", code:[
"# 恢复：把 SQL 文件灌回去\nmysql -u root -p shop < shop_backup.sql\n\n# 如果目标库还不存在，先建库\nmysql -u root -p -e \"CREATE DATABASE shop DEFAULT CHARACTER SET utf8mb4;\"\n\n# 验证恢复结果（一定要做，别只看命令有没有报错）\nmysql -u root -p -e \"SELECT COUNT(*) FROM shop.user; SELECT COUNT(*) FROM shop.orders;\"\n\n# 更完整的做法：在测试库上恢复一遍，跑几条业务查询比对结果\nmysql -u root -p -e \"CREATE DATABASE shop_verify;\"\nmysql -u root -p shop_verify < shop_backup.sql"]},
{warn:"<b>没有验证过的备份，等于没有备份。</b>最常见的翻车场景：备份脚本跑了半年没人看，真出事时才发现文件是空的（权限不对、磁盘满了、参数写错）。建议每季度做一次「恢复演练」，把恢复流程写进值班手册。"},
{h:"12.4 binlog 与时间点恢复", p:["mysqldump 是「某个时刻的全量快照」。如果上午 10 点备份、下午 3 点被人误删了表，恢复快照后还要把 10 点到 3 点之间的变更补回来——这就是 binlog（二进制日志）的作用。"]},
{code:[
"-- 看 binlog 是否开启、存在哪\nSHOW VARIABLES LIKE 'log_bin';\nSHOW VARIABLES LIKE 'log_bin_basename';\nSHOW BINARY LOGS;\n\n-- 用 mysqlbinlog 把某段时间的变更导出来\n# mysqlbinlog --start-datetime=\"2026-09-10 10:00:00\" \\\\\n#   --stop-datetime=\"2026-09-10 15:00:00\" mysql-bin.000007 > changes.sql\n\n-- 恢复顺序：先灌全量备份，再灌增量 binlog\n# mysql -u root shop < shop_backup.sql\n# mysql -u root shop < changes.sql"]},
{note:"实务上有句话：<b>备份决定你能退多远，binlog 决定你能退多准。</b>生产环境两者都要开，而且 binlog 本身也要备份到异地。"},
{h:"12.5 INTO OUTFILE：备份的另一条路，也是攻击的一条路", code:[
"-- 把查询结果导出成文件（需要 FILE 权限）\nSELECT * FROM user INTO OUTFILE '/tmp/user_export.csv';\n\n-- 先看允许写到哪里（这个变量决定了一切）\nSHOW VARIABLES LIKE 'secure_file_priv';\n--   返回具体路径 → 只能写该目录\n--   返回空字符串 → 不限制（危险）\n--   返回 NULL     → 完全禁止（最安全）"]},
{warn:"`INTO OUTFILE` 和 `LOAD_FILE()` 是第 16 章的主角：<b>攻击者拿到 FILE 权限后，可以用它读配置文件拿数据库口令，或往 Web 目录写 WebShell 直接 getshell</b>。所以「业务账号绝不能有 FILE 权限」是硬要求，`secure_file_priv` 也要设成禁止或限定目录。"},
{h:"12.6 敏感数据该怎么存", tbl:[
["数据类型","错误做法","正确做法"],
["登录密码","明文、MD5、SHA1","bcrypt / Argon2id（PHP 用 password_hash，自带盐、可调成本）"],
["身份证/手机号","明文存储","应用层加密后存储 + 展示脱敏"],
["支付信息","全卡号落库","令牌化（token）或强加密 + 严格权限"],
["会话令牌","可预测的自增 ID","足够随机的不可预测令牌，且有有效期"]]},
{code:[
"-- 为什么 MySQL 里不该用 PASSWORD() 存口令\n-- 1) MySQL 8.0 已经移除了 PASSWORD() 函数\n-- 2) 哈希应该在应用层做，数据库只负责存结果\n\n-- 数据库这一侧该做的是：给列留够长度、限制谁能读\nALTER TABLE user MODIFY COLUMN password VARCHAR(255) NOT NULL;\n-- 生产环境还可以再加一层：只有特定账号能 SELECT 这一列（列级权限或视图隔离）"]}
],
secview:"备份是「删了也能恢复」的那道门。三句话：定期备 + 异地留 + 演练恢复，缺一不可；备份决定你能退多远，binlog 决定你能退多准；没验证过的备份等于没有备份。"
}
];
