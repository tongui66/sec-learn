-- =====================================================
-- MySQL 网安学习站 v2 · 注入原理演示与加固练习
-- 配套章节：第 4、12、13、14、15、16、18、19 章
--
-- 红线：本文件包含注入原理的演示语句。
--       只允许在你自己的本地 XAMPP / 靶场里执行，
--       禁止对任何真实网站、学校系统、公司数据库测试。
-- 用法： mysql -u root shop < safe_queries.sql
-- =====================================================

USE shop;

-- -----------------------------------------------------
-- 一、正常查询：给后面的对比做基准
-- -----------------------------------------------------
SELECT id, username, role FROM user WHERE username = 'admin';
SELECT id, username, role FROM user WHERE id = 1;

-- -----------------------------------------------------
-- 二、感受「条件被改写」的威力（这就是注入的本质）
-- 第一条按 id 精确查，只出 1 行；
-- 第二条 WHERE 恒真，把整张表都返回了。
-- 把这两条对比着看 —— 这就是注入点被利用后的效果。
-- -----------------------------------------------------
SELECT id, username FROM user WHERE id = 1;
SELECT id, username FROM user WHERE id = 1 OR 1=1;
SELECT id, username FROM user WHERE id = -1 OR 'a'='a';

-- 字符型注入的等价形态（对应「绕过登录」的逻辑）：
--   原意：用户名 = 'admin' 且 口令 = '<哈希>'
--   改写后：后面的口令判断被注释掉，只凭用户名就通过
SELECT id, username FROM user WHERE username = 'admin' -- ' AND password = 'anything';

-- -----------------------------------------------------
-- 三、探列数：为什么 UNION 注入前必须做这一步
-- 用 demo2 演示（它只有 2 列），结论很明确
-- -----------------------------------------------------
SELECT * FROM demo2 ORDER BY 1;
SELECT * FROM demo2 ORDER BY 2;
-- 下面这行会报错 Unknown column '3'，说明 demo2 只有 2 列：
-- SELECT * FROM demo2 ORDER BY 3;

-- 对照：user 表有 6 列，所以 ORDER BY 6 正常
SELECT id FROM user ORDER BY 6 LIMIT 1;

-- -----------------------------------------------------
-- 四、information_schema：结构枚举（拖库的地图）
-- 第 14 章的核心：把「猜表名」变成「查说明书」
-- -----------------------------------------------------
SELECT DATABASE() AS 当前库, VERSION() AS 版本;

SELECT table_name AS 库里的表
FROM information_schema.tables
WHERE table_schema = DATABASE();

SELECT column_name AS user表的列, data_type AS 类型
FROM information_schema.columns
WHERE table_schema = 'shop' AND table_name = 'user';

-- 把用户名和口令哈希一次取回（这就是「拖库」的效果）
SELECT GROUP_CONCAT(CONCAT(username, ':', password)) AS 一次取回全部 FROM user;

-- 看看这个函数的上限（第 7 章讲过它会被静默截断）
SHOW VARIABLES LIKE 'group_concat_max_len';

-- -----------------------------------------------------
-- 五、文件读写：为什么 FILE 权限必须收回（第 16 章）
-- 先看限制条件，再理解「三把钥匙」的说法
-- -----------------------------------------------------
SHOW VARIABLES LIKE 'secure_file_priv';
SHOW VARIABLES LIKE 'local_infile';

-- 不同环境下结果不同，失败会返回 NULL（而不是报错）
-- SELECT LOAD_FILE('/etc/passwd') AS 读系统文件;
-- SELECT LOAD_FILE('C:\\Windows\\win.ini') AS 读系统文件;

-- 写文件演示：默认会被 secure_file_priv 拦住；
-- 如果它返回空字符串，说明这个环境允许写入任意目录，属于高风险配置。
-- 目标文件必须不存在，且目录要在允许范围内：
-- SELECT 'hello from mysql' INTO OUTFILE 'C:/xampp/tmp/sec_test.txt';

-- -----------------------------------------------------
-- 六、保命开关：日常操作的安全习惯（第 4 章）
-- -----------------------------------------------------
SET SQL_SAFE_UPDATES = 1;
-- 下面这条会被拒绝（WHERE 不含主键/索引）：
-- DELETE FROM demo2 WHERE name LIKE '%a%';
-- 这条可以执行，0 rows affected：
DELETE FROM demo2 WHERE id = 9999;
SET SQL_SAFE_UPDATES = 0;

-- -----------------------------------------------------
-- 七、最小权限账号演练（第 18 章）
-- 先建只读备份账号，再用它验证「权限能挡住什么」。
-- 下面两行需要管理员权限，取消注释后执行一次即可：
-- -----------------------------------------------------
-- CREATE USER 'backup'@'localhost' IDENTIFIED BY 'Backup_StrongPass_2026!';
-- GRANT SELECT, LOCK TABLES, SHOW VIEW ON shop.* TO 'backup'@'localhost';
-- FLUSH PRIVILEGES;

-- 然后用 backup 账号登录，逐个体会权限的边界：
--   mysql -u backup -p shop
--   SELECT * FROM user;     -- 允许（只读）
--   DELETE FROM orders;     -- 拒绝（没有 DELETE 权限）
--   DROP TABLE orders;      -- 拒绝（没有 DROP 权限）

-- 审计：看这个账号到底有哪些权限
-- SHOW GRANTS FOR 'backup'@'localhost';

-- -----------------------------------------------------
-- 八、审计快照：把关键配置一次性打出来（第 19 章）
-- 把结果抄进你的加固报告，逐条对照第 19.6 节的 12 项自查表
-- -----------------------------------------------------
SHOW VARIABLES WHERE Variable_name IN (
  'version','bind_address','port','secure_file_priv','local_infile',
  'sql_mode','max_connections','log_bin','datadir','plugin_dir'
);

SELECT user, host, plugin FROM mysql.user ORDER BY user;

SELECT grantee, privilege_type FROM information_schema.user_privileges
WHERE privilege_type IN ('FILE','SUPER','GRANT OPTION','CREATE USER','SHUTDOWN','PROCESS')
ORDER BY grantee;
