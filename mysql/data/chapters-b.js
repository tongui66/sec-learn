// MySQL 学习站 v2 · 第 5-8 章：查询与性能
var CHAPTERS_B = [
{
id:5, title:"SELECT 查询基础", stage:"查询与性能",
intro:"SELECT 是 SQL 里最重要的语句，也是注入攻击的主战场。学查询时，每个子句都问一句：这一块如果被用户输入改写，会怎样？",
sections:[
{h:"5.1 一条完整 SELECT 的骨架", code:[
"SELECT   列名或表达式      -- ① 要什么\nFROM     表名             -- ② 从哪来\nWHERE    行过滤条件        -- ③ 先筛掉不要的行\nGROUP BY 分组列           -- ④ 按什么分组\nHAVING   组的过滤条件      -- ⑤ 再筛掉不要的组\nORDER BY 排序列 [ASC|DESC] -- ⑥ 怎么排序\nLIMIT    数量 [OFFSET 偏移] -- ⑦ 取几条\n\n-- 书写顺序 ≠ 执行顺序，这点很重要（见 5.5）"]},
{h:"5.2 基础查询", code:[
"-- 查所有列（生产环境慎用：列结构一变，程序就可能错位）\nSELECT * FROM user;\n\n-- 查指定列（推荐）\nSELECT username, role FROM user;\n\n-- 取别名\nSELECT username AS 用户名, role AS 角色 FROM user;\n\n-- 去重（同一 role 只出现一次）\nSELECT DISTINCT role FROM user;\n\n-- 带表达式\nSELECT username, CONCAT(role, '：', username) AS 描述 FROM user;\n\n-- 限制行数（先看数据结构时很有用）\nSELECT * FROM user LIMIT 5;"]},
{h:"5.3 运算符与信息收集函数", code:[
"-- 纯计算\nSELECT 1 + 1;        -- 2\nSELECT 7 % 3;        -- 1\n\n-- 字符串拼接（MySQL 用 CONCAT，不是 +）\nSELECT CONCAT('a', 'b');          -- ab\nSELECT CONCAT(username, '@', email) FROM user;\n\n-- 环境信息（注入的信息收集三连）\nSELECT VERSION();        -- 数据库版本\nSELECT USER();           -- 当前账号\nSELECT DATABASE();       -- 当前库名\nSELECT @@datadir;        -- 数据目录\nSELECT @@version_compile_os;  -- 操作系统"]},
{warn:"上面那几行环境查询，正是攻击者拿到注入点后做的第一件事——<b>先摸清版本（决定用哪个 payload）、权限（决定能干什么）、路径（决定能不能写文件）</b>。你学它们是为了反着理解攻击链：第 16 章会讲为什么 `@@datadir`、`@@secure_file_priv` 这些信息这么关键。"},
{h:"5.4 NULL：最容易踩的坑", code:[
"-- NULL 不是 0，也不是空字符串，是「未知」\nSELECT * FROM user WHERE email = NULL;    -- ❌ 永远查不到任何行\nSELECT * FROM user WHERE email IS NULL;   -- ✅ 正确写法\nSELECT * FROM user WHERE email IS NOT NULL;\n\n-- NULL 参与运算结果还是 NULL\nSELECT 1 + NULL;                          -- NULL\n\n-- 聚合函数会忽略 NULL（这是 COUNT 的坑，第 7 章细讲）\nSELECT COUNT(email), COUNT(*) FROM user;"]},
{h:"5.5 执行顺序：为什么 WHERE 里不能用别名", p:["SQL 的书写顺序是给人看的，MySQL 实际的执行顺序是："]},
{code:[
"FROM  →  WHERE  →  GROUP BY  →  HAVING  →  SELECT  →  ORDER BY  →  LIMIT\n         ↑ 此时别名还没生成              ↑ 这里才生成别名\n\n-- 所以这样写会报错：\nSELECT username AS n FROM user WHERE n = 'admin';   -- ❌ Unknown column 'n'\n\n-- 正确写法：\nSELECT username AS n FROM user WHERE username = 'admin';   -- ✅\n\n-- 而 ORDER BY 在 SELECT 之后，所以可以用别名：\nSELECT username AS n FROM user ORDER BY n;   -- ✅"]},
{tip:"这个执行顺序是理解 HAVING 与 WHERE 区别的钥匙（第 7 章），也是判断「为什么这条查询报错」的依据。<b>先 FROM、再 WHERE、最后才 SELECT</b>——记住这三步，很多怪错误就有解释了。"},
{h:"5.6 查询里最常被注入的位置", tbl:[
["子句","被注入后能做什么","典型 payload"],
["WHERE","改条件（恒真/联合查询）","`' OR '1'='1`、`' UNION SELECT ...`"],
["ORDER BY","探列数、改变排序","`ORDER BY 3`（报错即超列数）"],
["LIMIT","配合注入控制返回条数","`LIMIT 1`"],
["表名/列名","不能参数化，只能白名单","拼接表名的功能是重灾区"],
["IN / 批量查询","构造子查询取数据","`IN (SELECT ...)`"]],
note:"注意最后两行：<b>表名、列名、ORDER BY 的字段名这类「结构」是不能用参数占位符的</b>，只能靠白名单校验。这是第 17 章的重点——很多人以为「用了预处理就万无一失」，其实在不能参数化的地方一样会被打。"}
],
secview:"SELECT 的每个子句都可能成为注入点：WHERE 改条件、ORDER BY 探列数、LIMIT 控制条数、表名列名只能白名单。先记住一条能拼出「查任意列、任意库」的语句，正是 UNION 注入和报错注入的基础。"
},
{
id:6, title:"条件查询、排序与分页", stage:"查询与性能",
intro:"WHERE 是过滤数据的核心，也是注入改写语义的第一现场；ORDER BY 除了排序，还能被用来探列数。这一章要把这两块用到肌肉记忆。",
sections:[
{h:"6.1 WHERE 的常用条件", code:[
"-- 等值 / 不等值\nSELECT * FROM user WHERE role = 'admin';\nSELECT * FROM user WHERE role <> 'admin';    -- 也可以用 !=\n\n-- 比较\nSELECT * FROM orders WHERE amount > 100;\nSELECT * FROM orders WHERE amount >= 500 AND status = 'paid';\n\n-- 区间（闭区间，含两端）\nSELECT * FROM orders WHERE amount BETWEEN 100 AND 500;\n\n-- 集合\nSELECT * FROM user WHERE role IN ('admin', 'root');\n\n-- 模糊匹配（% 匹配任意多个字符，_ 匹配一个字符）\nSELECT * FROM user WHERE username LIKE 'a%';     -- 以 a 开头\nSELECT * FROM user WHERE username LIKE '%a%';    -- 含 a（索引失效，第 9 章）\nSELECT * FROM user WHERE username LIKE '_dmin';  -- 恰好一个字符 + dmin"]},
{h:"6.2 逻辑运算与优先级（括号很重要）", code:[
"-- AND 优先级高于 OR，不写括号结果可能完全不是你想要的\n-- 原本想：role 是 user 且（名字 alice 或 bob）\nSELECT * FROM user WHERE role = 'user' AND username = 'alice' OR username = 'bob';\n-- 实际等价于：(role='user' AND username='alice') OR (username='bob')\n\n-- 正确写法：\nSELECT * FROM user WHERE role = 'user' AND (username = 'alice' OR username = 'bob');\n\n-- NOT\nSELECT * FROM user WHERE NOT role = 'admin';"]},
{note:"这个优先级坑在安全上有真实后果：<b>权限判断如果写成 `WHERE is_admin = 1 AND a OR b`，就可能被绕过</b>。凡是涉及权限、金额、状态的条件，一律加括号。"},
{h:"6.3 ORDER BY：排序也是注入点", code:[
"-- 单列排序\nSELECT username, role FROM user ORDER BY role ASC;      -- 升序（默认）\nSELECT username, role FROM user ORDER BY role DESC;     -- 降序\n\n-- 多列排序：先按第一列，相同再按第二列\nSELECT username, role, created_at FROM user ORDER BY role ASC, created_at DESC;\n\n-- 按第几列排序（数字指代列的位置）\nSELECT username, role FROM user ORDER BY 2;             -- 按第 2 列（role）排\n\n-- 按表达式排\nSELECT username, LENGTH(username) AS len FROM user ORDER BY len DESC;"]},
{warn:"`ORDER BY 数字` 是注入里<b>探列数</b>的标准手法：`ORDER BY 1` 正常、`ORDER BY 2` 正常……一旦 `ORDER BY n` 报错，就说明表的列数不足 n。这是 UNION 注入前必做的第一步。本站练习库的 `demo2` 表只有 2 列，专门用来演示这个——你可以在实验 8 里亲手跑一遍。"},
{h:"6.4 LIMIT 与分页", code:[
"-- 前 10 条\nSELECT * FROM user LIMIT 10;\n\n-- 第 2 页（跳过 10 条，再取 10 条）\nSELECT * FROM user LIMIT 10 OFFSET 10;\n\n-- 等价简写：LIMIT 偏移, 数量\nSELECT * FROM user LIMIT 10, 10;\n\n-- 分页 + 排序（分页必须配 ORDER BY，否则顺序不保证）\nSELECT id, username FROM user ORDER BY id LIMIT 20 OFFSET 40;"]},
{p:["深翻页有个性能陷阱：`LIMIT 1000000, 10` 时，MySQL 仍要先扫过并丢弃前 100 万行。所以深分页要用「游标」写法："]},
{code:[
"-- ❌ 慢：越翻越慢\nSELECT * FROM orders ORDER BY id LIMIT 1000000, 10;\n\n-- ✅ 快：记住上一页最后一个 id，从它之后取\nSELECT * FROM orders WHERE id > 1000000 ORDER BY id LIMIT 10;"]},
{h:"6.5 注入视角：为什么 WHERE 和 ORDER BY 是重灾区", tbl:[
["现象","原因","攻击者能得到什么"],
["`WHERE id = 1 OR 1=1`","改写条件使恒真","返回全部数据"],
["`WHERE name = '' OR '1'='1'`","闭合引号后构造恒真条件","绕过登录校验"],
["`ORDER BY 5` 报错","数字超出列数","推断表有几列"],
["`ORDER BY (SELECT ...)`","排序里嵌子查询","无回显时也能取数据（盲注变体）"],
["`LIMIT 1`","控制只返回一行","让报错/联合注入更容易展示结果"]]},
{code:[
"-- 在本地练习库上理解「恒真」是怎么回事（只在你自己的库上跑）\nSELECT * FROM user WHERE id = 1;              -- 1 行\nSELECT * FROM user WHERE id = 1 OR 1=1;       -- 全部行！条件恒真\nSELECT * FROM user WHERE id = -1 OR 1=1;      -- 哪怕 id 不存在，也一样全返回"]},
{tip:"判断一个查询点能不能注入，最朴素的办法就是：<b>给它一个「本来不该有结果、但恒真条件能救回来」的输入</b>，看返回行数变不变。这就是布尔判断的思路，第 13、15 章会系统化。"}
],
secview:"WHERE 决定「哪些行」，ORDER BY 决定「顺序」和「列数线索」，LIMIT 决定「多少行」。三者在注入里的作用分别是：改写语义、侦察结构、控制输出。理解这三句话，注入的攻击面就清楚了。"
},
{
id:7, title:"聚合函数与分组", stage:"查询与性能",
intro:"聚合把多行压成一个统计值，GROUP BY 按类分组。这一章除了会用，还要注意两个坑：COUNT 对 NULL 的处理，以及 GROUP_CONCAT 的长度截断——后者在拖库时直接决定你能拿到多少数据。",
sections:[
{h:"7.1 五大聚合函数", code:[
"SELECT COUNT(*) FROM user;          -- 行数（用户总数）\nSELECT COUNT(email) FROM user;      -- email 非 NULL 的行数（可能少于总数！）\nSELECT COUNT(DISTINCT role) FROM user;  -- 不重复的 role 有几个\n\nSELECT SUM(amount)   FROM orders;   -- 求和（总销售额）\nSELECT AVG(amount)   FROM orders;   -- 平均（客单价）\nSELECT MAX(amount)   FROM orders;   -- 最大单笔\nSELECT MIN(amount)   FROM orders;   -- 最小单笔\n\n-- 组合：一行拿到多个统计\nSELECT COUNT(*) AS 订单数, SUM(amount) AS 总额, AVG(amount) AS 均价, MAX(amount) AS 最大单\nFROM orders;"]},
{note:"`COUNT(*)` 数的是行数；`COUNT(列名)` 会<b>跳过该列为 NULL 的行</b>。所以 `COUNT(email)` 和 `COUNT(*)` 结果不同是正常的，不是 bug。这个差异在统计报表里经常造成「数字对不上」的争议。"},
{h:"7.2 GROUP BY：按类分组统计", code:[
"-- 每个角色有多少人\nSELECT role, COUNT(*) AS 人数 FROM user GROUP BY role;\n\n-- 每个用户的订单数与总金额\nSELECT user_id, COUNT(*) AS 订单数, SUM(amount) AS 总额\nFROM orders GROUP BY user_id;\n\n-- 多个分组列\nSELECT role, status, COUNT(*) FROM user u JOIN orders o ON o.user_id = u.id\nGROUP BY role, status;\n\n-- 分组后排序\nSELECT user_id, SUM(amount) AS 总额 FROM orders GROUP BY user_id ORDER BY 总额 DESC;"]},
{h:"7.3 HAVING 与 WHERE 的区别", tbl:[
["对比","WHERE","HAVING"],
["执行时机","分组<b>之前</b>（FROM 之后）","分组<b>之后</b>（GROUP BY 之后）"],
["过滤对象","一行行的原始数据","一个个分组的结果"],
["能用聚合函数吗","不能","能"],
["典型写法","`WHERE status = 'paid'`","`HAVING COUNT(*) > 2`"]]},
{code:[
"-- WHERE 先筛行，HAVING 再筛组，两者可以同时用\nSELECT user_id, COUNT(*) AS 已付订单数, SUM(amount) AS 总额\nFROM orders\nWHERE status = 'paid'          -- 先只看已支付的订单\nGROUP BY user_id\nHAVING 已付订单数 >= 2          -- 再筛出下单 2 笔以上的用户\nORDER BY 总额 DESC;"]},
{h:"7.4 GROUP_CONCAT：把多行拼成一行（拖库的核心函数）", code:[
"-- 把一列的值拼成一个字符串\nSELECT GROUP_CONCAT(username) FROM user;\n-- 结果类似：admin,alice,bob,carol\n\n-- 加分隔符\nSELECT GROUP_CONCAT(username SEPARATOR ' | ') FROM user;\n\n-- 拼多个字段（注入拖库最常用的形态）\nSELECT GROUP_CONCAT(CONCAT(username, ':', password)) FROM user;\n-- 结果类似：admin:21232f...,alice:e10adc...\n\n-- 看看当前的长度上限\nSHOW VARIABLES LIKE 'group_concat_max_len';   -- 默认 1024 字节"]},
{warn:"`group_concat_max_len` 默认只有 1024 字节，<b>超出部分会被静默截断</b>。这在注入里非常关键：攻击者拖库时如果发现取回的哈希只有一半，第一件事就是把上限调大（`SET SESSION group_concat_max_len = 1000000;`）再重取。你以后做日志审计看到这条 SET 语句，就是很明确的注入痕迹。"},
{h:"7.5 网安视角：聚合函数怎么被用来「问问题」", p:["聚合函数是盲注的天然工具，因为它把「一堆数据」变成「一个可以判断的结果」："]},
{tbl:[
["攻击者想知道","构造的判断","观察什么"],
["数据库版本是否为 8.0","`AND (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=DATABASE())>0`","返回是否正常"],
["某个字符是不是 'a'","`AND SUBSTRING((SELECT username FROM user LIMIT 1),1,1)='a'`","页面真假差异"],
["表里有多少行","`AND (SELECT COUNT(*) FROM user)>5`","条件真假"],
["延时确认","`AND IF((SELECT COUNT(*) FROM user)>5, SLEEP(3), 0)`","响应时间"]]},
{p:["注意这些都是「问是/否」，一条一条把信息磨出来——所以叫盲注。第 15 章会系统讲布尔盲注和时间盲注。"]}
],
secview:"聚合函数把「数据」变成「可判断的结论」，所以它既是报表工具，也是盲注的放大镜。记住两件事：COUNT(列) 会跳过 NULL；GROUP_CONCAT 默认 1024 字节会截断——后者是拖库能不能一次拿全的关键。"
},
{
id:8, title:"多表连接与子查询", stage:"查询与性能",
intro:"真实网站的数据分散在多张表里，JOIN 负责把它们按关联键拼起来。这一章同时要理解 UNION——它既是合法的查询技巧，也是注入拖库的主力手法。",
sections:[
{h:"8.1 为什么要 JOIN", p:["看一个真实需求：<b>查出每笔订单的用户名和商品名</b>。用户名在 `user` 表，商品名在 `product` 表，订单本身在 `orders` 表——三张表要拼起来。"]},
{code:[
"-- 练习库的三张表（注意关联字段）\n-- user(id, username, ...)\n-- orders(id, user_id, product_id, amount, status)\n-- product(id, product_name, price)\n\n-- 关联关系：orders.user_id → user.id\n--           orders.product_id → product.id"]},
{h:"8.2 四种连接", tbl:[
["连接","返回什么","典型场景"],
["INNER JOIN","两边都匹配的行","订单关联到真实用户"],
["LEFT JOIN","左表全保留，右表没有就补 NULL","查「没下过单的用户」"],
["RIGHT JOIN","右表全保留（可用 LEFT 对称改写）","较少单独使用"],
["CROSS JOIN","笛卡尔积（行数相乘）","慎用，容易瞬间产生海量行"]]},
{code:[
"-- INNER JOIN：只保留两边都匹配的\nSELECT u.username, o.amount\nFROM orders o\nINNER JOIN user u ON o.user_id = u.id;\n\n-- LEFT JOIN：所有用户都列出，没下单的订单列为 NULL\nSELECT u.username, o.amount\nFROM user u\nLEFT JOIN orders o ON o.user_id = u.id;\n\n-- 用 LEFT JOIN 找「从没下过单的用户」\nSELECT u.username\nFROM user u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE o.id IS NULL;   -- 右表没匹配上 → 这个用户没订单"]},
{tip:"「找出没有 X 的记录」是 LEFT JOIN + IS NULL 的经典用法。写成子查询也可以，但 JOIN 版本通常更快，也更容易读懂。"},
{h:"8.3 三表 JOIN 实战", code:[
"-- 订单明细：谁、买了什么、多少钱\nSELECT\n  o.id        AS 订单号,\n  u.username  AS 用户,\n  p.product_name AS 商品,\n  o.amount    AS 金额,\n  o.status    AS 状态\nFROM orders o\nJOIN user u    ON o.user_id = u.id\nJOIN product p ON o.product_id = p.id\nORDER BY o.id;"]},
{h:"8.4 子查询", code:[
"-- 标量子查询：结果是一个值\nSELECT username FROM user\nWHERE id = (SELECT MIN(user_id) FROM orders);\n\n-- IN 子查询：结果是集合\nSELECT username FROM user\nWHERE id IN (SELECT user_id FROM orders WHERE amount > 500);\n\n-- EXISTS：只判断存在性（通常比 IN 更适合大表）\nSELECT username FROM user u\nWHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id AND o.amount > 500);\n\n-- 派生表：把子查询当临时表用\nSELECT t.role, t.cnt FROM (\n  SELECT role, COUNT(*) AS cnt FROM user GROUP BY role\n) AS t WHERE t.cnt > 1;"]},
{h:"8.5 UNION：把两个结果集竖着拼起来", code:[
"-- UNION：合并结果并去重\nSELECT username FROM user WHERE role = 'admin'\nUNION\nSELECT username FROM user WHERE role = 'user';\n\n-- UNION ALL：合并但不去重（更快，因为不用排序去重）\nSELECT username FROM user WHERE role = 'admin'\nUNION ALL\nSELECT username FROM user WHERE role = 'user';\n\n-- 列的个数和类型必须一致，否则报错\nSELECT id, username FROM user\nUNION\nSELECT id, product_name FROM product;   -- 都是 2 列"]},
{warn:"UNION 是注入拖库的主力：<b>攻击者把原本的查询结果和一条自己构造的 SELECT 并在一起，就能把别的表的数据显示在页面上</b>。前提条件有两个——列数必须一致（所以要先用 ORDER BY 探列数），以及页面有回显位置。第 14 章会完整走一遍这个链条。"},
{h:"8.6 自连接：同一张表连自己", code:[
"-- 找出和同一个用户下过相同商品的其他人（自连接示例）\nSELECT DISTINCT b.user_id AS 相似用户\nFROM orders a\nJOIN orders b ON a.product_id = b.product_id AND a.user_id <> b.user_id\nWHERE a.user_id = 2;"]},
{h:"8.7 网安视角：JOIN 与 UNION 在攻击里的分工", tbl:[
["语句","正常用途","攻击者怎么用"],
["JOIN","按关联键拼多表数据","审计时看 ON 条件里有没有拼接的用户输入"],
["UNION","合并多个结果集","注入的最佳拖库手段（有回显时）"],
["子查询","把一段查询的结果当条件或表","盲注里用子查询做条件判断"],
["CROSS JOIN","笛卡尔积","制造海量结果拖垮数据库（轻量 DoS）"]]},
{p:["记住这个分工，你就理解了为什么「有回显的注入用 UNION，没回显的注入用盲注」——接下来第 13-16 章会按这个顺序展开。"]}
],
secview:"JOIN 把数据横向拼起来，UNION 把结果竖向拼起来。前者是正常业务的必需，后者是注入拖库的主力。搞清楚「列数要对齐」这个前提，你就理解了 UNION 注入为什么必须先探列数。"
}
];
