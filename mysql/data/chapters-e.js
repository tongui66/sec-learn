// MySQL 学习站 v2 · 第 17-20 章：防御体系与案例
var CHAPTERS_E = [
{
id:17, title:"预处理与代码层防御", stage:"攻防与加固",
intro:"前面四章讲的是「怎么被打进来」。从这一章开始讲怎么堵：预处理为什么能根治注入、哪些地方不能参数化只能白名单、以及 ORM 和框架也救不了你的场景。",
sections:[
{h:"17.1 预处理为什么能根治", p:["预处理的本质是<b>把「编译 SQL 结构」和「传入数据」分成两步</b>：数据库先把语句模板编译好（此时结构已固定），参数再作为纯数据填进去。因为结构已经定型，参数无论长什么样都改不了它。"]},
{code:[
"-- ❌ 拼接：结构会被输入改写\n--   $sql = \"SELECT * FROM user WHERE username = '\" . $_POST['u'] . \"'\";\n--   输入  admin' OR '1'='1  → 结构被改写\n\n-- ✅ 预处理：结构先定，值后传\n--   $stmt = $pdo->prepare(\"SELECT * FROM user WHERE username = ?\");\n--   $stmt->execute([$_POST['u']]);\n--   同一个输入 → 只会被当成一个普通的字符串值去比对，查不到东西，但不是攻击"]},
{note:"关键区别在于「谁决定结构」：拼接是<b>输入参与决定结构</b>，预处理是<b>结构早就定好，输入只能当值</b>。这就是它被称为「唯一正解」的原因——不依赖任何黑名单，也不怕编码绕过。"},
{h:"17.2 PDO 的三种正确写法", code:[
"<?php\n// 方式一：问号占位（位置参数）\n$stmt = $pdo->prepare('SELECT id, username, role FROM user WHERE username = ?');\n$stmt->execute([$username]);\n$user = $stmt->fetch(PDO::FETCH_ASSOC);\n\n// 方式二：命名占位（推荐，参数多了不容易错位）\n$stmt = $pdo->prepare('SELECT * FROM orders WHERE user_id = :uid AND status = :st');\n$stmt->execute([':uid' => $uid, ':st' => $status]);\n\n// 方式三：bindValue 显式绑定类型\n$stmt = $pdo->prepare('SELECT * FROM user WHERE id = :id');\n$stmt->bindValue(':id', $id, PDO::PARAM_INT);\n$stmt->execute();\n\n// 建立连接时就该设好的几个选项\n$pdo = new PDO($dsn, $user, $pass, [\n  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,  // 出错抛异常，别静默失败\n  PDO::ATTR_EMULATE_PREPARES   => false,                    // 用真正的服务端预处理（见 17.3）\n  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,\n]);"]},
{h:"17.3 一个容易被忽略的坑：模拟预处理", p:["PDO 在 MySQL 驱动下默认可能开启 `ATTR_EMULATE_PREPARES = true`。此时「预处理」其实是 PDO 在客户端自己拼字符串并转义，<b>不是数据库真的预编译</b>。"]},
{tbl:[
["设置","实际行为","风险"],
["EMULATE_PREPARES = true（部分环境默认）","客户端拼字符串 + 转义","转义依赖字符集，配置不当可能被绕过；且无法使用部分类型特性"],
["EMULATE_PREPARES = false（推荐）","真正的服务端预处理","结构在服务端编译，参数只作为值传输"]]},
{code:[
"// 显式关掉模拟预处理\n$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);\n\n// 验证：同样是参数化写法，关掉之后能正确返回整型\n// 开启模拟时，LIMIT ? 传字符串可能报错；关掉后行为更接近数据库原生"]},
{tip:"这不是危言耸听：历史上确有「用了 PDO 仍然被注入」的案例，原因就是模拟预处理 + 字符集设置不当（和宽字节注入同一类根因）。<b>显式关掉它，是十分钟就能做完、收益明确的一件事。</b>"},
{h:"17.4 不能参数化的地方：只能白名单", tbl:[
["部位","为什么不能参数化","正确做法"],
["表名 / 列名","占位符只代表值，不代表标识符","用固定映射表把用户输入翻译成白名单里的真实名称"],
["ORDER BY 字段","同上，且排序方向也要控制","白名单校验字段名，方向只允许 ASC / DESC"],
["LIMIT / OFFSET","部分驱动下绑参行为不一致","强制转整型 + 上限（如最多 100 条）"],
["IN ( ) 里的个数","占位符个数必须固定","按数组长度动态生成对应数量的占位符"]]},
{code:[
"<?php\n// 错误：把用户输入直接拼进 ORDER BY\n// $sql = \"SELECT * FROM orders ORDER BY {$_GET['sort']}\";\n\n// 正确：白名单映射\n$allow = ['id' => 'id', 'amount' => 'amount', 'created' => 'created_at'];\n$key   = $_GET['sort'] ?? 'id';\n$col   = $allow[$key] ?? 'id';             // 不在白名单就退回默认值\n$dir   = (($_GET['dir'] ?? 'desc') === 'asc') ? 'ASC' : 'DESC';\n$sql   = \"SELECT * FROM orders ORDER BY $col $dir LIMIT 50\";\n\n// IN 的正确写法：按数量生成占位符\n$ids  = array_map('intval', $ids);\n$ph   = implode(',', array_fill(0, count($ids), '?'));\n$stmt = $pdo->prepare(\"SELECT * FROM user WHERE id IN ($ph)\");\n$stmt->execute($ids);"]},
{warn:"很多「已经用了预处理」的系统，仍然倒在 ORDER BY 和表名上。原因是开发者以为参数化是万能的，就把排序字段也交给用户——<b>而占位符永远只能代表值，不能代表结构</b>。审计代码时，专门搜 `ORDER BY $`、`FROM $table`、`LIMIT $` 这种模式。"},
{h:"17.5 ORM 和框架也救不了你", ul:["<b>原生 SQL 逃生舱</b>：ORM 通常提供 `raw()` / `query()` 这类方法，一旦有人用它拼用户输入，注入就回来了。",
"<b>order by / 表名同样不做参数化</b>：ORM 的参数化也只覆盖值，排序字段往往仍是拼字符串。",
"<b>LIKE 的写法</b>：`WHERE name LIKE '%$kw%'` 这种拼接在 ORM 里一样存在。",
"<b>模板与表达式滥用</b>：某些框架的「动态查询构造」允许传入字段名，本质还是拼结构。"]},
{code:[
"<?php\n// ORM 里也有陷阱（伪代码示意）\n// ❌ 原生片段拼接\n// $users = User::query()->whereRaw(\"name = '{$name}'\")->get();\n\n// ✅ 参数绑定\n// $users = User::query()->where('name', '=', $name)->get();\n// $users = User::query()->whereRaw('name = ?', [$name])->get();"]},
{h:"17.6 纵深：除了参数化，还要做什么", tbl:[
["层次","措施","作用"],
["代码","全部 SQL 参数化 + 结构白名单","根治注入"],
["错误处理","关闭调试输出，错误只写日志不回显","断掉报错注入"],
["数据库","业务账号最小权限、无 FILE、无 DROP","即使被注入也拿不走、删不掉"],
["网络","数据库不暴露公网，只允许应用访问","缩小可达面"],
["检测","WAF + 慢查询/通用日志 + 告警","发现正在进行的攻击"],
["恢复","定期备份 + 恢复演练","最后兜底"]]},
{code:[
"<?php\n// 错误处理示例：把细节写日志，对外只给通用提示\nini_set('display_errors', '0');          // 生产环境务必关闭\nini_set('log_errors', '1');\n\ntry {\n    $stmt = $pdo->prepare('SELECT * FROM user WHERE username = ?');\n    $stmt->execute([$username]);\n} catch (PDOException $e) {\n    error_log('[DB] ' . $e->getMessage());     // 细节进日志\n    http_response_code(500);\n    exit('服务器繁忙，请稍后再试');              // 对外模糊化\n}"]},
{p:["注意最后这条：<b>对外模糊化错误信息，是成本最低、收益最直接的一条加固</b>。它直接掐断了报错注入这条路，也让攻击者拿不到表名和路径。"]}
],
secview:"注入的根治只有一条路：能参数化的全部参数化，不能参数化的（表名、列名、排序字段）用白名单。再加三件配套动作：关掉模拟预处理、对外不暴露数据库报错、业务账号最小权限——四件事做完，注入这条路才算真正堵上。"
},
{
id:18, title:"权限管理与账户安全", stage:"攻防与加固",
intro:"即使注入没修好，权限也能决定攻击者的「收获上限」。这一章讲 MySQL 的权限模型、最小权限怎么落地，以及哪些权限是必须收回的高危项。",
sections:[
{h:"18.1 权限模型：账号是 user@host", p:["MySQL 的账号由<b>用户名 + 来源主机</b>共同决定，`'app'@'localhost'` 和 `'app'@'%'` 是两个完全不同的账号，权限互不相通。这是配权限时最容易搞错的一点。"]},
{tbl:[
["层级","语法","用途"],
["全局","`ON *.*`","所有库（高危，业务账号绝不给）"],
["库级","`ON shop.*`","业务账号的常规粒度"],
["表级","`ON shop.user`","更细，但管理成本高"],
["列级","`ON shop.user(username,email)`","最细，特殊场景"]]},
{code:[
"-- 看当前是谁、服务端认定的账号是哪个\nSELECT USER(), CURRENT_USER();\n\n-- 看所有账号各自的来源主机\nSELECT user, host, plugin FROM mysql.user ORDER BY user;"]},
{h:"18.2 最小权限账号怎么建", code:[
"-- ① 为应用建专用账号（只允许从应用服务器连）\nCREATE USER 'app'@'10.0.1.50' IDENTIFIED BY '一个长且随机的口令';\n\n-- ② 只给业务真正需要的四种权限（不给 DROP / ALTER / GRANT / FILE）\nGRANT SELECT, INSERT, UPDATE, DELETE ON shop.* TO 'app'@'10.0.1.50';\n\n-- ③ 备份账号只给读权限\nCREATE USER 'backup'@'localhost' IDENTIFIED BY '另一个长口令';\nGRANT SELECT, LOCK TABLES, SHOW VIEW, EVENT, TRIGGER ON shop.* TO 'backup'@'localhost';\n\n-- ④ 生效并核对\nFLUSH PRIVILEGES;\nSHOW GRANTS FOR 'app'@'10.0.1.50';"]},
{note:"为什么不用 `'app'@'%'`？因为 `%` 表示<b>任意来源主机</b>——只要网络能到 3306，全世界都能尝试用这个账号登录。限定成应用服务器的 IP，等于多加了一道网络层的锁。"},
{h:"18.3 高危权限清单：这些必须收回", tbl:[
["权限","拿到它能做什么","为什么危险"],
["FILE","`LOAD_FILE()` 读文件、`INTO OUTFILE` 写文件","读配置拿口令、写 WebShell getshell"],
["SUPER / SYSTEM_VARIABLES_ADMIN","改全局变量、杀连接、关审计","可关掉日志、隐藏痕迹"],
["GRANT OPTION","给别的账号授权限","可自建高权后门账号"],
["CREATE ROUTINE / ALTER ROUTINE","创建存储过程 / 函数","配合 FILE 可走 UDF 提权"],
["DROP","删表删库","一次注入就能清库"],
["PROCESS","看所有连接和正在执行的语句","窥探业务与其他账号活动"],
["PROXY","以其他用户身份连接","直接伪装成管理员"]]},
{code:[
"-- 逐条收回（示例：给业务账号做减法）\nREVOKE FILE ON *.* FROM 'app'@'10.0.1.50';\nREVOKE DROP, ALTER, CREATE, INDEX ON shop.* FROM 'app'@'10.0.1.50';\nREVOKE GRANT OPTION ON *.* FROM 'app'@'10.0.1.50';\nFLUSH PRIVILEGES;\n\n-- 收回后再看一遍，确认干净\nSHOW GRANTS FOR 'app'@'10.0.1.50';"]},
{h:"18.4 账户安全：四个必做动作", ol:["<b>禁用 root 远程登录</b>：root 只允许从 localhost 连（默认就是这样，不要改）。",
"<b>删除匿名账号和空口令账号</b>：`DROP USER IF EXISTS ''@'localhost';`（老版本可能存在）。",
"<b>强口令 + 定期轮换</b>：数据库口令至少 16 位随机字符，且不要和系统口令复用。",
"<b>确认认证插件</b>：MySQL 8.0 默认 `caching_sha2_password`，比 5.7 的 `mysql_native_password` 更安全。"]},
{code:[
"-- 审计：找出可能有问题的高权账号\nSELECT user, host FROM mysql.user WHERE user = 'root' AND host NOT IN ('localhost','127.0.0.1','::1');\n\n-- 找出所有拥有全局权限的账号\nSELECT grantee, privilege_type FROM information_schema.user_privileges\nWHERE privilege_type IN ('FILE','SUPER','GRANT OPTION','CREATE USER','SHUTDOWN')\nORDER BY grantee;\n\n-- 找出拥有 FILE 权限的账号（最该关注的一项）\nSELECT grantee FROM information_schema.user_privileges WHERE privilege_type = 'FILE';"]},
{warn:"审计时最常见的三个问题，按严重程度排：<b>① 应用在用 root 连数据库</b>（一次注入等于全线失守）；<b>② 某个账号有全局权限却没人知道它是干什么的</b>（历史遗留、离职交接漏了）；<b>③ 账号 host 写成了 `%`</b>。这三条查一遍只要五分钟，收益极高。"},
{h:"18.5 权限能挡住什么：一个对照表", tbl:[
["账号权限","被注入后攻击者能做的","挡不住的"],
["root + 全权限","拖全库、读文件、写 WebShell、删库","几乎挡不住"],
["业务账号（CRUD）","拖它有权访问的库（这已经够严重）","读文件、删表、看别的库"],
["业务账号 + FILE","拖库 + 读配置 + 可能 getshell","删表还是不行，但后果已经很重"],
["只读账号","只能拖它有权看的数据","写、删、读文件"],
["只读 + 只能看视图","只能拿到视图里暴露的列","拿不到密码等敏感列"]]},
{p:["结论：<b>权限不能代替修漏洞，但它能决定事故的严重程度</b>。同样一个注入点，交给 root 账号是灾难，交给只能读视图的账号就只是「部分数据泄露」——量级完全不同。"]}
],
secview:"权限是「进去了也拿不走」的那道门。三个动作最值钱：业务账号绝不用 root、FILE 和 DROP 必须收回、账号来源限定到具体主机。查一遍全部账号的全局权限，只要五分钟，却能决定一场事故的严重程度。"
},
{
id:19, title:"数据库加固与审计", stage:"攻防与加固",
intro:"最后一章把前面所有加固动作串成一份可执行清单：网络怎么收、配置怎么改、日志该开什么、云上怎么办，以及拿到一台陌生数据库时，审计该按什么顺序看。",
sections:[
{h:"19.1 网络暴露：先解决最危险的那一层", tbl:[
["检查项","危险配置","正确配置"],
["监听地址","`bind-address = 0.0.0.0`（全网卡监听）","`bind-address = 127.0.0.1` 或内网网卡"],
["端口暴露","3306 对公网开放","只允许应用服务器 IP 访问"],
["云安全组","`0.0.0.0/0` 放行 3306","限定来源安全组或 IP 段"],
["主机防火墙","无规则","只放行应用网段的 3306"],
["本机端口","`skip-networking` 未开（单机场景）","单机应用可考虑完全关闭网络监听"]]},
{code:[
"# 看 MySQL 在听哪个地址\nnetstat -ano | findstr :3306        # Windows\nss -lntp | grep 3306                # Linux\n\n# 配置文件里确认（Windows 的 my.ini / Linux 的 my.cnf）\n# [mysqld]\n# bind-address = 127.0.0.1\n# skip-networking            # 单机应用可完全关闭 TCP 监听"]},
{warn:"<b>3306 暴露公网是最常见、也最致命的数据库配置错误。</b>它几乎是瞬间就会被扫描到，然后是无休止的暴力破解。如果你的库现在对公网开放，这一条应该排在所有加固动作的最前面——它的成本最低、收益最大。"},
{h:"19.2 配置加固清单", tbl:[
["配置项","推荐值","作用"],
["`secure_file_priv`","NULL 或限定目录","禁止任意文件读写（掐断第 16 章那条链）"],
["`local_infile`","OFF","禁止客户端本地文件加载"],
["`sql_mode`","含 STRICT_TRANS_TABLES","数据严格校验，防静默截断"],
["`max_connections`","按业务量设定合理上限","防连接耗尽"],
["`max_connect_errors`","适中值","防暴力探测"],
["`skip_symbolic_links`","ON（Linux）","防符号链接写入攻击"],
["`log_bin`","ON","支持时间点恢复（第 12 章）"],
["插件目录权限","仅服务账号可写","防 UDF 提权"]]},
{code:[
"-- 一条命令自查关键配置\nSHOW VARIABLES WHERE Variable_name IN (\n  'version','bind_address','port','secure_file_priv','local_infile',\n  'sql_mode','max_connections','log_bin','datadir','plugin_dir',\n  'general_log','slow_query_log','long_query_time'\n);"]},
{h:"19.3 日志与审计：看得见才防得住", tbl:[
["日志类型","记录什么","用途与代价"],
["错误日志 error log","启动、崩溃、严重错误","必开，排障基础"],
["慢查询日志 slow log","超过阈值的语句","推荐开，用于性能与异常发现"],
["通用日志 general log","<b>所有</b>语句","信息最全，但高并发下严重拖慢并迅速写满磁盘——<b>只临时开</b>"],
["binlog","数据变更（用于恢复/复制）","生产必开"],
["审计插件","登录、权限变更、敏感操作","企业版/第三方；等保场景常用"]]},
{code:[
"-- 临时抓一段时间的全部语句（排查期间用，查完立刻关）\nSET GLOBAL general_log = 'ON';\nSET GLOBAL log_output = 'TABLE';       -- 写到 mysql.general_log 表，方便直接查\nSELECT event_time, user_host, argument FROM mysql.general_log\nORDER BY event_time DESC LIMIT 100;\n-- 查完马上关掉！\nSET GLOBAL general_log = 'OFF';\n\n-- 长期方案：开慢查询日志，只关注异常的慢语句\nSET GLOBAL slow_query_log = 'ON';\nSET GLOBAL long_query_time = 1;"]},
{h:"19.4 日志里该盯什么：四类注入特征", tbl:[
["特征","正常业务几乎不会这样","对应章节"],
["`SET SESSION group_concat_max_len`","业务代码很少动态改这个","第 14 章"],
["连续出现的 `LIMIT 0,1` / `LIMIT 1,1`","逐行拖库的痕迹","第 14 章"],
["`SLEEP(` / `BENCHMARK(` / `IF(` 出现在查询参数里","时间盲注特征","第 15 章"],
["`information_schema` 被应用账号频繁查询","正常应用不查结构表","第 14 章"],
["`LOAD_FILE` / `INTO OUTFILE`","业务不需要读写文件","第 16 章"],
["同一 IP 高频请求同一接口且响应时间稳定偏长","盲注的请求模式","第 15 章"]]},
{tip:"这六条可以直接做成告警规则。<b>数据库审计的价值不在于「记录一切」，而在于「知道该看哪几条」</b>——否则日志再多也只会被忽略。"},
{h:"19.5 云数据库（RDS）加固要点", tbl:[
["层面","要做的","容易漏的"],
["网络","只用内网地址，安全组限定应用来源","把 RDS 挂到公网并开 0.0.0.0/0"],
["账号","用控制台/RDS 自己的账号体系做最小权限","沿用默认高权账号"],
["备份","开启自动备份并设定保留期","开了自动备份但从不验证恢复"],
["审计","开启 SQL 审计/日志投递到日志服务","发现问题时日志已经过期"],
["高可用","多可用区部署、只读实例分流","单点故障"],
["变更","参数组变更走审核，保留回滚方案","直接改生产参数"]]},
{note:"云上有一个和自建库不同的特点：<b>改一条安全组规则几秒钟就生效，而且可能同时影响几十个实例</b>。方便的同时风险也被放大，所以云上的变更更应该走「先备份、再评审、留回滚」的流程。"},
{h:"19.6 数据库加固自查表（12 项）", ol:["3306 不对公网开放，只允许应用服务器访问",
"`bind-address` 绑定内网地址或 127.0.0.1",
"业务账号不是 root，且来源限定到具体主机",
"所有账号的全局权限已逐个核对，无多余高权账号",
"业务账号无 FILE、无 DROP、无 GRANT OPTION",
"`secure_file_priv` 设为 NULL 或限定目录，`local_infile = OFF`",
"`sql_mode` 包含严格模式",
"密码哈希用 bcrypt/Argon2（不是 MD5/SHA1），应用层实现",
"自动备份已开启，且<b>做过至少一次恢复验证</b>",
"慢查询日志或审计日志已开，并配置了第 19.4 节的告警规则",
"数据库进程以专用低权限账号运行，Web 目录对它不可写",
"版本已更新到受支持的稳定版本，已知高危漏洞已修补"]},
{p:["这 12 项建议每季度过一遍。真实环境里，绝大多数数据库被攻破，都不是因为遇到了什么高级攻击，而是因为这 12 项里有几条长期没人管。"]}
],
secview:"加固的优先级顺序是：先收网络暴露（3306 不对外），再收权限（不用 root、收回 FILE/DROP），再改配置（secure_file_priv、严格模式），最后补日志与备份。这个顺序的收益是递减的——做完前两条，风险就下降了一大半。"
},
{
id:20, title:"实战案例集（12 个真实场景）", stage:"攻防与加固",
intro:"这一章是前 19 章的实战验收。每个案例都是真实工作里会遇到的情况，重点不是「答案是什么」，而是<b>「怎么一步步缩小范围」</b>——从现象倒推出根因，这才是从会写 SQL 到会做安全的差别。",
sections:[
{h:"20.1 案例速查表", tbl:[
["#","现象","最可能的根因","第一步查什么"],
["1","数据库 CPU 打满，接口全部超时","慢查询 / 缺索引 + 用户可控排序","SHOW PROCESSLIST 看当前语句"],
["2","核心表被清空","注入点 + 业务账号有 DROP 权限","审计日志找回操作时间点"],
["3","3306 暴露公网后出现陌生账号","被暴力破解","`SELECT user,host FROM mysql.user`"],
["4","断电后数据恢复不了","备份缺失或从未验证","检查备份文件是否可恢复"],
["5","一次注入拖走全库","应用用 root 连库","`SHOW GRANTS` 看应用账号"],
["6","页面报错暴露表结构和路径","调试模式开着或异常未处理","搜代码里的错误输出"],
["7","GBK 站点转义失效被注入","宽字节注入","检查字符集配置与转义时机"],
["8","改了别人账号的密码","二次注入（存储后拼接）","追「库里的值被拼到哪」"],
["9","服务器上多了一个 php 文件","INTO OUTFILE 写马","查 FILE 权限与 Web 目录权限"],
["10","一条 UPDATE 锁住整张表","WHERE 未走索引","EXPLAIN 看是否全表扫描"],
["11","两个事务互相等待报死锁","访问顺序不一致","SHOW ENGINE INNODB STATUS"],
["12","备份恢复后发现数据少了一段","只恢复全量、没补 binlog","确认 log_bin 是否开启"]]},
{h:"20.2 案例详解一：数据库 CPU 打满（案例 1）", p:["<b>现象</b>：运维报警「MySQL CPU 100%」，所有接口超时，重启后几分钟又恢复原样。"]},
{ol:["<b>先看现在在跑什么</b>：`SHOW PROCESSLIST;` 或 `SELECT id,user,time,state,info FROM information_schema.processlist WHERE time > 5;`",
"发现同一个接口产生的语句长时间处于 `Sending data` 状态，语句形如 `SELECT * FROM orders ORDER BY created_at LIMIT 500000,20`。",
"<b>看执行计划</b>：`EXPLAIN` 显示 `type=ALL`（全表扫描）+ `Using filesort`——没有索引，还要排序 50 万行。",
"<b>判断性质</b>：这是「深翻页 + 无索引」的经典组合。但如果排序字段来自 URL 参数（`ORDER BY {用户输入}`），那它同时也是一个<b>可被滥用的资源耗尽点</b>。",
"<b>应急处置</b>：先 `KILL` 掉堆积的长语句，恢复服务；再限流或临时关掉该排序入口。",
"<b>根治</b>：① 给 `created_at` 建索引；② 深分页改游标写法（`WHERE id > ? ORDER BY id LIMIT n`）；③ 排序字段白名单校验；④ 分页数量上限。"]},
{note:"这个案例的价值在于：<b>性能问题和安全问题常常是同一件事</b>。同一条「没索引 + 用户可控排序」的查询，平时是「慢」，被恶意利用时就是「拒绝服务」。"},
{h:"20.3 案例详解二：核心表被清空（案例 2）", p:["<b>现象</b>：早上发现 `orders` 表空了，业务停摆。"]},
{ol:["<b>先止损</b>：立刻停掉对外的写入口，防止继续破坏；<b>不要</b>急着重建表。",
"<b>确认范围</b>：`SELECT COUNT(*)` 看哪些表受影响；查 `information_schema.tables` 的 `update_time` 缩小时间窗。",
"<b>找证据</b>：翻 binlog（`mysqlbinlog --start-datetime=...`）或通用日志，定位删除语句和执行它的账号。",
"<b>常见真相</b>：语句来自应用侧的注入点，而应用账号恰好有 `DROP`/`DELETE` 权限。",
"<b>恢复</b>：用最近一次全量备份 + binlog 做时间点恢复，恢复到删除前一刻。",
"<b>根治</b>：修注入点（参数化）→ 收回业务账号的 DROP/DELETE 全表权限 → 补审计告警（对 DDL 和全表删除告警）。"]},
{warn:"这个案例里最值得记住的一句话：<b>攻击者能删你的表，不是因为他有多强，而是因为你的业务账号有权限删。</b>权限收回是这类事故最直接的止血手段。"},
{h:"20.4 案例详解三：宽字节注入到底怎么发生的（案例 7）", p:["<b>现象</b>：代码里明明用了 `addslashes()` 转义，安全测试却发现还能注入。"]},
{ol:["<b>看字符集</b>：数据库或连接字符集是 `GBK`。",
"<b>看转义时机</b>：先做了转义，再 `SET NAMES gbk`（或根本没设字符集）——顺序错了。",
"<b>原理</b>：输入 `%df%27`，转义后变成 `%df%5c%27`，GBK 把 `%df%5c` 解析成一个汉字，反斜杠被吃掉，单引号逃逸。",
"<b>修复</b>：① 统一改 utf8mb4；② 用预处理替代转义函数（这才是根治）；③ 若必须用转义，字符集必须在转义之前设置好。"]},
{tip:"这个案例说明了「配置也是漏洞的一部分」。所以审计时不要只看代码逻辑，<b>字符集、sql_mode、secure_file_priv 这些配置项都要一起看</b>——第 19 章的清单就是为这个准备的。"},
{h:"20.5 案例详解四：从拖库到 getshell（案例 9）", p:["<b>现象</b>：Web 根目录下出现了陌生的 `.php` 文件，内容是一句话木马。"]},
{ol:["<b>确认来源</b>：看文件时间戳与属主；如果属主是数据库进程的运行用户，基本可以确定不是 Web 上传的。",
"<b>查权限</b>：`SHOW GRANTS FOR 'app'@'...';` 发现业务账号居然有 `FILE`。",
"<b>还原链条</b>：注入点 → `INTO OUTFILE` 往 Web 目录写文件 → 访问该文件 getshell。",
"<b>加固四件事</b>：收回 FILE 权限 → `secure_file_priv = NULL` → Web 目录对数据库进程不可写 → mysqld 以低权限账号运行。",
"<b>善后</b>：按第 16 章的三把钥匙，逐条验证这四条是否都生效。"]},
{p:["这个案例的关键认知是：<b>从「数据被拿走」到「服务器被控制」之间，往往只差一个 FILE 权限。</b>所以加固清单里 FILE 是排在最前面要收回的权限之一。"]},
{h:"20.6 案例详解五：一次 UPDATE 锁住整张表（案例 10）", p:["<b>现象</b>：一条「只更新几条记录」的语句执行后，其他所有写请求全部卡住超时。"]},
{ol:["<b>看当前锁等待</b>：`SELECT * FROM performance_schema.data_lock_waits;`，或 `SHOW PROCESSLIST` 看到大量 `Waiting for table metadata lock` / 锁等待。",
"<b>看执行计划</b>：`EXPLAIN UPDATE orders SET status='paid' WHERE status='pending';` → `type=ALL`，说明没走索引。",
"<b>理解原因</b>：InnoDB 行锁加在索引上；没有可用索引时，引擎扫过的行都会被锁，效果接近锁全表。",
"<b>处置</b>：找到并结束阻塞源（`KILL`），评估是否需要 `innodb_lock_wait_timeout` 临时调整。",
"<b>根治</b>：给 `status` 建索引，或改写语句让它命中主键/索引——<b>这同时解决了性能和并发两个问题</b>。"]},
{h:"20.7 通用排查思路（遇到问题先想这三步）", ol:["<b>先止损，再找原因</b>：能限流就限流，能停入口就停入口，能 KILL 就 KILL。不要在服务还在崩的时候埋头查代码。",
"<b>再取证据</b>：`SHOW PROCESSLIST`（现在在跑什么）、慢查询/通用日志（刚刚跑了什么）、binlog（改了什么）。三条证据链决定你能否定位到根因。",
"<b>最后才改</b>：改完必须验证，并想清楚「同样的原因会不会再发生」——防护要落到配置或代码上，而不是只把这次的数据补回来。"]},
{tip:"数据库事故的处理顺序和网络排障是同一个思路：<b>先恢复可用性，再定位根因，最后做加固防复发。</b>顺序反了，就会在服务崩溃的时候抢救数据，越救越乱。"}
],
secview:"这 12 个案例的共性只有一句话：<b>绝大多数数据库事故不是被高级攻击打穿的，而是「权限给多了 + 注入没修 + 备份没验 + 日志没看」的组合。</b>把这四件事做扎实，你就能挡住现实世界里 90% 的数据库安全事件。"
}
];
