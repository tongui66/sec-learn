// PHP 学习站 v2 · 第 7-9 章：输入与数据
var CHAPTERS_B = [
{
id:7, title:"表单与超全局变量：把所有输入点摸清", stage:"输入与数据",
intro:"这是整门课的第一个分水岭。<b>攻击者唯一能碰到后端代码的地方就是「输入」</b>——把输入点摸清，后面所有漏洞都只是「输入去了哪」的变化。",
sections:[
{h:"7.1 GET 与 POST", tbl:[
["对比","GET","POST"],
["参数位置","URL 上（?a=1&b=2）","请求体里"],
["可见性","地址栏可见、会进历史记录和日志","地址栏不可见"],
["长度","受浏览器与服务器限制","几乎无限制"],
["典型用途","查询、分页、分享链接","登录、提交、上传"],
["安全性","<b>两者都不可信</b>","<b>两者都不可信</b>"]],
warn:"<b>「POST 比 GET 安全」是错的。</b>用抓包工具（Burp、浏览器 F12）改 POST 数据和改 URL 一样容易。区分 GET/POST 只影响传参形式，和安全无关。<b>以为 POST 就安全，是很多开发者出事的起点。</b>"},
{h:"7.2 超全局变量：审计的输入点清单", tbl:[
["变量","来源","用户可控性"],
["`$_GET`","URL 查询串","完全可控"],
["`$_POST`","请求体（表单）","完全可控"],
["`$_REQUEST`","GET + POST + COOKIE 合并","完全可控，来源混杂"],
["`$_COOKIE`","Cookie 头","完全可控（可伪造）"],
["`$_FILES`","上传文件","文件名与内容完全可控"],
["`$_SERVER`","服务器/请求信息","<b>部分可控</b>：HTTP_* 系列来自请求头"],
["`php://input`","原始请求体","完全可控（JSON 接口常用）"],
["`$_SESSION`","服务器端会话","间接可控（取决于写入逻辑）"]],
tip:"审计时的第一件事：在代码里搜 <code>\\$_(GET|POST|REQUEST|COOKIE|FILES|SERVER|HTTP)</code>。<b>搜到的每一处，都是一个「用户能伸手进来」的窗口。</b>"},
{h:"7.3 一个完整的表单处理（也是最小漏洞模型）", code:[
`<!-- form.html -->
<form method="POST" action="login.php">
  用户名：<input type="text" name="username">
  密码：<input type="password" name="password">
  <input type="submit" value="登录">
</form>

<?php
// login.php —— 这一段就是后面所有漏洞的原型
$user = $_POST['username'];    // ① 拿到用户输入
$pass = $_POST['password'];

// ② 不检查、不过滤，直接使用
echo '你好，' . $user;          // 危险：未编码输出 -> XSS
// $sql = "SELECT * FROM user WHERE name = '$user'";   // 危险：拼接 -> SQL 注入
// system('echo ' . $user);      // 危险：进命令 -> RCE
// include $user . '.php';       // 危险：进路径 -> LFI
?>`],
note:"<b>请把上面注释里那四行背下来。</b>同一个 <code>$user</code>，流进四个不同地方就是四种不同的漏洞：<b>SQL 语句 → 注入；HTML 输出 → XSS；系统命令 → RCE；文件路径 → LFI</b>。<b>漏洞的类型不由输入决定，而由「输入去了哪」决定。</b>"},
{h:"7.4 取值姿势：安全写法与坏写法", code:[
`<?php
// ❌ 坏写法：不判断键是否存在
$id = $_GET['id'];
// PHP 8 会直接报 Warning，PHP 5/7 是 Notice，但变量仍然可用（老站常见）

// ✅ 好写法 1：空合并
$id = $_GET['id'] ?? '';

// ✅ 好写法 2：判断存在性（注意 isset 与 array_key_exists 的区别）
if (!isset($_GET['id'])) { die('缺少参数'); }
$id = $_GET['id'];

// ✅ 好写法 3：类型过滤（这是最推荐的）
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if ($id === false || $id === null) { die('参数必须是整数'); }

// JSON 接口的原始请求体
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);      // 注意：这里也是一个输入点！`]},
{h:"7.5 请求头也能被控制（容易忽略的输入点）", code:[
`<?php
// 这些「环境变量」其实来自请求头，用户可以随意伪造：
echo $_SERVER['HTTP_USER_AGENT'];        // UA 头，随便改
echo $_SERVER['HTTP_REFERER'];           // 来源页，随便改
echo $_SERVER['HTTP_X_FORWARDED_FOR'];   // 「真实 IP」，随便改！
echo $_SERVER['REQUEST_URI'];            // 请求路径，可能带 payload

// 真实漏洞场景一：用 X-Forwarded-For 判断「管理员 IP」
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
if ($ip === '127.0.0.1') { echo '欢迎管理员'; }   // ❌ 加个头就绕过了

// 真实漏洞场景二：把 UA 存进数据库
$ua = $_SERVER['HTTP_USER_AGENT'];
// $sql = "INSERT INTO log (ua) VALUES ('$ua')";   // 头部也能注入！

// 真实漏洞场景三：把 REQUEST_URI 输出到页面
// echo $_SERVER['REQUEST_URI'];   // 反射型 XSS`],
warn:"<b>审计时不要只盯着 $_GET / $_POST。</b><code>$_SERVER['HTTP_*']</code>、<code>$_SERVER['REQUEST_URI']</code>、<code>php://input</code>、<code>$_FILES['x']['name']</code> 全都是用户可控的。<b>「只防了表单、没防请求头」是真实漏洞里非常常见的一条绕过路径。</b>"},
{h:"7.6 信任边界：哪些数据可信、哪些不可信", tbl:[
["数据来源","可信吗","说明"],
["代码里的字面量（'admin'）","可信","但可能被配置覆盖"],
["数据库里的数据","<b>不可全信</b>","可能是之前用户输入的（二次注入的根源）"],
["$_GET / $_POST / $_COOKIE","不可信","完全可控"],
["$_SERVER['HTTP_*']","不可信","完全可控"],
["$_FILES 的文件名/类型","不可信","文件名尤其危险"],
["$_SERVER['REMOTE_ADDR']","相对可信","TCP 层地址，除非经过代理"],
["$_SESSION","相对可信","只要不把用户输入直接塞进去"]],
note:"<b>这张表要刻进脑子。</b>特别是第二行：<b>数据库里的数据不等于安全数据</b>——它是「之前某个用户输入存进来的」。把库里的值取出来再拼进 SQL，就是第 15 章要讲的<b>二次注入</b>；取出来不做编码输出，就是<b>存储型 XSS</b>。"}
],
secview:"这一章的结论只有一句：<b>凡是从请求里来的都是不可信的</b>——包括 URL、表单、Cookie、请求头、上传文件名、原始请求体。审计时先把这些入口全部标出来（第 18 章会给完整清单），后面所有漏洞分析都建立在「这个不可信的值去了哪」之上。"
},
{
id:8, title:"文件与目录操作", stage:"输入与数据",
intro:"文件操作是漏洞的高发区：读文件可以泄露源码与配置，写文件可以直接 getshell。<b>这一类函数的特点是「一旦路径可控，危害极大且很难补救」。</b>",
sections:[
{h:"8.1 读文件的函数", code:[
`<?php
// 一次性读全部内容（最常用，也是审计重点）
$content = file_get_contents('/etc/passwd');
echo $content;

// 读取并直接输出到浏览器（等价于 readfile）
readfile('data.txt');

// 按行读
$lines = file('data.txt');            // 返回数组，每行一个元素
foreach ($lines as $line) { echo $line; }

// 打开句柄逐块读（大文件用）
$fp = fopen('data.txt', 'r');
while (!feof($fp)) {
    echo fgets($fp);
}
fclose($fp);

// ⚠️ 危险写法：路径来自用户
$file = $_GET['file'] ?? '';
echo file_get_contents($file);        // 任意文件读取漏洞！`]},
{warn:"<b><code>file_get_contents($_GET['file'])</code> 是最典型的任意文件读取漏洞。</b>攻击者传 <code>../../../../etc/passwd</code> 就能读系统文件，传配置文件路径就能拿到数据库口令。<b>审计时搜 file_get_contents / readfile / fopen / file / show_source，看参数是否可控。</b>"},
{h:"8.2 写文件与删除", code:[
`<?php
// 写文件（内容与路径都可控 = 可直接写 Webshell）
file_put_contents('a.txt', 'hello');
file_put_contents('a.txt', 'more', FILE_APPEND);   // 追加

// 复制 / 重命名 / 删除
copy('a.txt', 'b.txt');
rename('a.txt', 'c.txt');
unlink('c.txt');                                    // 删除文件

// ⚠️ 危险组合：路径可控 + 内容可控
$name = $_POST['name'];
$data = $_POST['data'];
file_put_contents($name, $data);       // 任意文件写入 -> getshell`],
tip:"<b>「任意文件写入」比「任意文件读取」更致命。</b>读取只是信息泄露；写入如果落在 Web 目录且能被解析，就是直接拿到服务器控制权。审计时看到写文件函数，先问三句：<b>路径可控吗？内容可控吗？能写到 Web 目录吗？</b>"},
{h:"8.3 路径与文件名处理函数", code:[
`<?php
$path = '/var/www/html/uploads/avatar.jpg';

basename($path);      // avatar.jpg        只取文件名（去掉目录）
dirname($path);       // /var/www/html/uploads
pathinfo($path);      // 数组：dirname/basename/extension/filename
pathinfo($path, PATHINFO_EXTENSION);   // jpg    取扩展名（上传校验常用）
realpath('a/../b.txt');                 // 规范化路径（解析 ../）

// 目录操作
scandir('/var/www/html');   // 列出目录内容
glob('/var/www/html/*.php');// 按模式匹配文件
mkdir('newdir');
rmdir('newdir');

// ⚠️ 上传场景的经典错误：用 basename 就以为安全
$name = $_FILES['f']['name'];          // 用户可控
$ext  = pathinfo($name, PATHINFO_EXTENSION);
if ($ext === 'jpg') { /* 看起来安全，但 .jpg 里可以塞 PHP 代码 */ }`]},
{h:"8.4 目录穿越（../）的原理", p:["目录穿越是所有文件类漏洞的基础手法：<b>用 <code>../</code> 不断往上级目录跳，跳出程序限定的目录。</b>"]},
{code:[
`程序想让你读的：  /var/www/html/uploads/  下的文件
你实际要读的：    /etc/passwd（在根目录下）

怎么从 uploads/ 跳到根？
  ../../../../etc/passwd
  ^^^^^^^^^^^^^^ 每跳一次 ../ 就上一层

常见绕过过滤的写法（理解为主，不要用于真实目标）：
  ....//          -> 过滤掉 ../ 后剩下 ../ 
  ..%2f           -> URL 编码的 /
  %2e%2e%2f       -> 编码的 ../
  ..\\             -> Windows 下的分隔符
  /etc/passwd 直接绝对路径（如果没做目录限制）

防御思路：不要用「过滤 ../」，而是
  ① 白名单映射（page=home -> pages/home.php）
  ② 用 realpath 规范化后再校验前缀是否在允许目录内`]},
{h:"8.5 上传文件时 PHP 给了你什么", code:[
`<?php
// $_FILES 的结构（HTML 里 name="upfile"）
/*
$_FILES['upfile'] = [
  'name'     => 'shell.php',        // 用户原始文件名 —— 完全可控！
  'type'     => 'image/jpeg',       // 浏览器/客户端声明的类型 —— 可伪造！
  'tmp_name' => '/tmp/phpXXXX',     // 服务器临时路径 —— 由 PHP 生成
  'error'    => 0,                  // 错误码，0 表示成功
  'size'     => 1024                // 字节数 —— 客户端声明，不完全可信
];
*/

// 把临时文件搬到目标位置（第 14 章详解）
move_uploaded_file($_FILES['upfile']['tmp_name'], 'uploads/' . $_FILES['upfile']['name']);
//                                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                                                          文件名直接用用户的 —— 危险！`],
note:"<b>记住哪两个字段可信、哪两个不可信：</b><code>tmp_name</code> 是 PHP 生成的，可信；<code>name</code>（文件名）和 <code>type</code>（MIME）都是客户端给的，<b>完全不可信</b>。上传漏洞的一半，就是把不可信的字段当成了可信的。"},
{h:"8.6 危险函数清单（文件类）", tbl:[
["函数","能做什么","路径可控时的后果"],
["`file_get_contents`","读文件内容","任意文件读取（读配置、读源码）"],
["`readfile` / `fpassthru`","读并输出","任意文件下载"],
["`file_put_contents`","写文件","任意文件写入 → getshell"],
["`fopen` + `fwrite`","分块读写","同上"],
["`unlink`","删除文件","任意文件删除（可删 .htaccess、安装锁）"],
["`copy` / `rename`","复制/移动","可移动文件到可执行目录"],
["`include` / `require`","包含并执行","文件包含（第 11 章）"],
["`scandir` / `glob`","列目录","目录遍历、信息泄露"],
["`show_source` / `highlight_file`","输出源码","源码泄露"]],
tip:"<b>审计动作：把上表函数在代码里全部搜一遍，逐个看参数。</b>参数是常量或框架路径的，跳过；参数里有变量的，往上追这个变量从哪来——追到 $_GET 就是漏洞，追到常量就不是。"}
],
secview:"文件类的漏洞有一个共同点：<b>危害极高但修复极简单</b>——只要给路径做白名单映射、别让用户决定读写哪里，问题就没了。审计时的口诀：<b>看到文件函数，先问「路径能不能被用户控制」</b>。"
},
{
id:9, title:"数据库访问：从连接到查询", stage:"输入与数据",
intro:"网站的数据都在数据库里，而 PHP 访问数据库最常见的错误就是<b>拼接 SQL</b>。这一章先把「怎么写」摆出来——下一章就讲它为什么会变成注入漏洞。",
sections:[
{h:"9.1 用 mysqli 连接数据库", code:[
`<?php
// 面向过程写法（老项目里最常见）
$conn = mysqli_connect('localhost', 'root', '', 'test');
if (!$conn) {
    die('连接失败：' . mysqli_connect_error());
}

// 执行查询
$result = mysqli_query($conn, "SELECT id, username FROM user");

// 遍历结果（$row 是关联数组）
while ($row = mysqli_fetch_assoc($result)) {
    echo $row['id'] . ' - ' . $row['username'] . "<br>";
}

mysqli_close($conn);

// 面向对象写法（等价）
$mysqli = new mysqli('localhost', 'root', '', 'test');
$res = $mysqli->query("SELECT * FROM user");`]},
{h:"9.2 拼接 SQL：漏洞的原型", code:[
`<?php
// ⚠️ 危险写法：用户输入直接拼进 SQL
$id  = $_GET['id'];
$sql = "SELECT * FROM user WHERE id = " . $id;
$res = mysqli_query($conn, $sql);

// 传入  id=1 OR 1=1
// 实际执行：SELECT * FROM user WHERE id = 1 OR 1=1   → 返回全部用户

// 字符型的情况下更危险
$name = $_GET['name'];
$sql = "SELECT * FROM user WHERE name = '$name'";
// 传入  name=admin' -- 
// 实际执行：SELECT * FROM user WHERE name = 'admin' -- '   → 后半段被注释掉

// ⚠️ 同样危险的还有：表名、列名、ORDER BY 字段由用户控制
$order = $_GET['order'];
$sql = "SELECT * FROM user ORDER BY $order";     // 这里不能用占位符！
// 传入  order=(SELECT SLEEP(5))  → 时间盲注`],
note:"<b>三种拼接位置，危险程度不一样：</b><b>值</b>（WHERE 后面）可以用占位符彻底防住；<b>结构</b>（表名、列名、ORDER BY）没法用占位符，只能白名单。<b>很多人以为「用了预处理就万无一失」，恰恰死在 ORDER BY 上</b>——这一点在第 17 章会重点讲。"},
{h:"9.3 用 PDO 访问数据库", code:[
`<?php
// 建立连接（DSN + 账号密码 + 选项）
$pdo = new PDO('mysql:host=localhost;dbname=test;charset=utf8mb4', 'root', '', [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,   // 用真正的服务端预处理（重要）
]);

// 预处理 + 绑定参数（安全写法）
$stmt = $pdo->prepare('SELECT id, username FROM user WHERE id = ?');
$stmt->execute([$_GET['id']]);
$rows = $stmt->fetchAll();

// 命名占位符（推荐，参数多时不易错位）
$stmt = $pdo->prepare('SELECT * FROM user WHERE name = :name AND role = :role');
$stmt->execute([':name' => $name, ':role' => $role]);

foreach ($rows as $row) {
    echo htmlspecialchars($row['username'], ENT_QUOTES, 'UTF-8');   // 输出也要编码
}`]},
{h:"9.4 预处理为什么能根治注入", code:[
`拼接（可注入）：
   代码：$sql = "SELECT * FROM user WHERE name = '$name'";
   传入：admin' OR '1'='1
   结果：SELECT * FROM user WHERE name = 'admin' OR '1'='1'
         ^^^ 用户的输入变成了 SQL 语法的一部分

预处理（不可注入）：
   第一步：数据库先把 "SELECT * FROM user WHERE name = ?" 编译成模板
          此时语句结构已经固定，不再改变
   第二步：把 'admin\' OR \'1\'=\'1' 作为「一个字符串值」填进去
   结果：整串被当成「一个用户名」去比，查不到东西，但注入不成立

一句话：结构先定死，数据只能当数据。`]},
{h:"9.5 查询结果的输出（XSS 的入口）", code:[
`<?php
// 从数据库取出数据，然后输出到页面
$row = $stmt->fetch();

// ❌ 危险：库里的数据可能是用户之前输入的
echo '欢迎你，' . $row['username'];     // 存储型 XSS 的经典位置

// ✅ 安全：输出前 HTML 编码
echo '欢迎你，' . htmlspecialchars($row['username'], ENT_QUOTES, 'UTF-8');

// ✅ 更进一步：封装一个输出函数，全站统一用
function e($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
echo '欢迎你，' . e($row['username']);`]},
{h:"9.6 配置文件与连接信息", code:[
`<?php
// config.php —— 真实项目里数据库口令就写在这里
return [
    'db_host' => 'localhost',
    'db_user' => 'root',
    'db_pass' => 'SuperSecret123',
    'db_name' => 'shop',
];

// 危险点：如果 config.php 能被读到（LFI / 备份文件泄露 / .git 泄露），
//         攻击者就拿到了数据库账号 —— 这是 LFI 最常见的利用目标

// 加固建议：
//   ① config 放在 Web 根目录之外（即使被猜路径也读不到）
//   ② 数据库账号用最小权限（第 20 章）
//   ③ 关掉目录列表、清理备份文件(.bak/.swp/~)与 .git 目录`],
tip:"<b>审计时，「入口文件引入了哪些配置」是一条捷径。</b>顺着 <code>require 'config.php'</code> 往下看，你能一次拿到：数据库账号、第三方密钥、内部接口地址。<b>这些信息决定了漏洞的「危害上限」。</b>"}
],
secview:"这一章是把「文件」和「数据库」这两个最常见的落点摆出来。它们的共同规律是：<b>PHP 本身没有错，错的是把用户输入当成了代码或路径的一部分</b>。下一章开始，逐个拆解具体的漏洞类型——从最经典的 SQL 注入开始。"
}
];
