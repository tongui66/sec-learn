// PHP 学习站 v2 · 实验手册（12 个动手实验）
var LABS = [
{
 title:"实验 1 · 把 code 跑起来（环境打通）",
 meta:"难度 ★☆☆　用时 15 分钟　环境：虚拟机 192.168.11.133",
 goal:"把本机的 code 文件夹放进虚拟机的网站目录，用浏览器访问到 PHP 的输出。",
 env:"本机（放课程文件）+ 虚拟机 192.168.11.133（phpStudy）。不需要在本机装 PHP。",
 steps:["把本机的 code 文件夹复制到虚拟机里 phpStudy 的网站根目录，例如 C:\\phpstudy\\WWW\\php\\。",
"在<b>本机</b>浏览器访问 http://192.168.11.133/php/hello.php，应该看到输出。",
"打开 hello.php 改一下内容（把名字改成你的），保存后刷新页面——不用重启服务。",
"试着故意写错一处（比如少个分号），刷新看报错信息长什么样。<b>学会读报错，是 PHP 学习的一半。</b>",
"改回正确写法，确认页面恢复正常。"],
 code:`<?php
// hello.php —— 第一个程序
echo 'Hello, PHP!<br>';
$name = '同学';
echo '欢迎，' . $name . '！<br>';

// 单引号 vs 双引号
echo '单引号：$name<br>';
echo "双引号：$name<br>";

// 环境信息（看完记得删掉，真实环境里 phpinfo 是信息泄露点）
echo 'PHP 版本：' . PHP_VERSION . '<br>';
// phpinfo();`,
 verify:["本机浏览器能访问 http://192.168.11.133/php/hello.php","修改文件后刷新页面立刻生效（不需要重启服务）","能看到 PHP 的报错信息（说明错误显示是开的）","理解「单引号原样、双引号解析」的差别"],
 undo:["无需回滚。练习完把 phpinfo() 那行删掉即可。"],
 why:"环境是第一个坎。这个实验特意让你先「故意写错一次」，就是为了让你习惯报错——<b>后面每个实验都会遇到报错，能读懂报错的人才走得远</b>。"
},
{
 title:"实验 2 · 弱类型与魔术哈希（亲手验证）",
 meta:"难度 ★★☆　用时 20 分钟　环境：虚拟机 PHP",
 goal:"亲眼看到 0 == 'abc' 为真、两个不同的 MD5 相等，理解弱类型为什么要命。",
 env:"虚拟机 phpStudy，把下面的文件放到 www 目录访问。",
 steps:["写一个页面，用 var_dump 打印一组「看起来不该相等」的比较。",
"观察哪些是真、哪些是假，把它们记下来。",
"算两个明文的 MD5，确认它们都以 0e 开头。",
"用 == 和 === 分别比较这两个哈希，对比结果。",
"自己动手把 == 换成 ===，看结果怎么变。"],
 code:`<?php
echo '<h3>一、弱类型比较</h3>';
var_dump(0 == 'abc');            // true  'abc' 被转成 0
var_dump('0' == 0);              // true
var_dump(null == 0);             // true
var_dump('1e2' == 100);          // true  字符串被当科学计数

echo '<h3>二、魔术哈希</h3>';
$a = md5('240610708');
$b = md5('QNKCDZO');
echo "a = $a<br>";
echo "b = $b<br>";
var_dump($a == $b);              // true ！两个不同的哈希相等
var_dump($a === $b);             // false 严格比较才正确

echo '<h3>三、模拟一个被绕过的登录判断</h3>';
$db_hash = $a;                   // 假设数据库里存的是这个哈希
$input   = $b;                   // 攻击者提交这个
if ($input == $db_hash) {
    echo '弱类型比较：登录被绕过了！';
} else {
    echo '严格比较：拒绝登录';
}
// 把上面那行的 == 改成 === 再跑一次，对比结果`,
 verify:["看到 0 == 'abc' 输出 bool(true)","看到两个不同的 MD5 用 == 比较返回 true","用 === 比较同一个组合返回 false","能说清「0e 开头 + 后面全数字」是魔术哈希的条件"],
 undo:["删除实验文件即可"],
 why:"<b>这个原理在真实环境里能直接绕过登录。</b>亲手验证过之后，你对「安全判断必须用 ===」的理解就不再是死记硬背，而是「我见过它怎么绕过」。"
},
{
 title:"实验 3 · 自己做一次存储型 XSS",
 meta:"难度 ★★☆　用时 25 分钟　环境：虚拟机 + MySQL",
 goal:"用 20 行代码复现存储型 XSS 的完整链路：写入 → 存储 → 输出 → 执行。",
 env:"虚拟机 phpStudy（含 MySQL）。需要一个数据库和一张表。",
 steps:["先用 SQL 建一张留言表。",
"写一个提交页：把留言存进数据库（<b>故意不编码输出</b>）。",
"提交一条内容是 script 标签的留言。",
"刷新页面——你会看到弹窗。<b>这就是存储型 XSS</b>。",
"最后把输出改成 htmlspecialchars，再刷新，看它是「显示成文本」还是「执行」。"],
 code:`-- 建表
CREATE TABLE guestbook (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  content VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

<?php
// xss_demo.php —— 故意不编码输出
$pdo = new PDO('mysql:host=localhost;dbname=test;charset=utf8mb4', 'root', '');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $stmt = $pdo->prepare('INSERT INTO guestbook (content) VALUES (?)');
    $stmt->execute([$_POST['content'] ?? '']);   // 这里用预处理，本次只演示 XSS
    echo '留言已提交<br>';
}

// 危险：直接输出，未做 HTML 编码
foreach ($pdo->query('SELECT content FROM guestbook ORDER BY id DESC') as $row) {
    echo '<div>' . $row['content'] . '</div>';
}
?>
<form method="POST">
  <textarea name="content"></textarea>
  <button>提交</button>
</form>

<?php
// 修复版：把上面那行 echo 换成
// echo '<div>' . htmlspecialchars($row['content'], ENT_QUOTES, 'UTF-8') . '</div>';`,
 verify:["提交普通文本时，页面正常显示","提交脚本内容后，刷新页面弹出对话框","改用 htmlspecialchars 后，同样的内容被显示成文本而不是执行","能说清「存储型」与「反射型」的差别：一个先进了数据库"],
 undo:["DROP TABLE guestbook;"],
 warn:"<b>只在你自己的虚拟机里做。</b>这里演示原理，让你知道「代码少一个函数，用户就会被执行脚本」。不要在任何真实站点尝试。",
 why:"XSS 讲一百遍不如自己弹一次窗。<b>等你亲眼看到那行脚本被执行，以后写 echo 时就会条件反射地想到「这个值要不要编码」。</b>"
},
{
 title:"实验 4 · 任意文件读取与目录穿越",
 meta:"难度 ★★☆　用时 20 分钟　环境：虚拟机 PHP",
 goal:"复现「路径可控 = 任意文件读取」，并搞清为什么过滤 ../ 不管用。",
 env:"虚拟机 phpStudy。在 www 下建一个 data 子目录放几个文本文件。",
 steps:["建一个页面，用 $_GET['f'] 当文件名读取并显示。",
"正常访问 ?f=a.txt，看到内容。",
"用 ../ 跳出目录（例如读 Windows 目录下的 ini 文件）。",
"看到系统文件内容 —— 这就是任意文件读取。",
"加上 str_replace('../','') 过滤，再用 ....// 绕过它。",
"最后改成白名单映射，确认绕过失效。"],
 code:`<?php
// 漏洞版 file_read.php
$f = $_GET['f'] ?? 'a.txt';
echo '<pre>' . htmlspecialchars(file_get_contents('data/' . $f), ENT_QUOTES) . '</pre>';
// 正常：  ?f=a.txt
// 穿越：  ?f=../../Windows/win.ini

// 看起来「修好了」，其实能绕
$f = str_replace('../', '', $_GET['f'] ?? 'a.txt');
echo file_get_contents('data/' . $f);
// 绕过：传 ....//a.txt —— 删掉中间的 ../ 后，剩下的又拼成 ../

// 正确修复：白名单映射
$allow = ['a' => 'data/a.txt', 'b' => 'data/b.txt'];
$k = $_GET['f'] ?? 'a';
if (!array_key_exists($k, $allow)) { die('文件不存在'); }
echo '<pre>' . htmlspecialchars(file_get_contents($allow[$k]), ENT_QUOTES) . '</pre>';`,
 verify:["正常文件名能读出内容","用 ../ 能读到 data 目录之外的文件","用 str_replace 过滤后，....// 仍能绕过","改成白名单后，无论传什么都不再越界"],
 undo:["删除实验文件与 data 目录"],
 why:"<b>「过滤是删字符，白名单是定范围」</b>——这个实验让你亲手体验两者的区别。以后审计时看到 str_replace('../') 这类写法，你会立刻判定它不可靠。"
},
{
 title:"实验 5 · SQL 注入：从漏洞到利用（自己写靶子）",
 meta:"难度 ★★★　用时 35 分钟　环境：虚拟机 + MySQL",
 goal:"自己写一个存在注入的页面，亲手把它打穿，最后看数据被拖走。",
 env:"虚拟机 phpStudy + MySQL。需要一个 users 表（含几个测试账号）。",
 steps:["建一张 users 表，插几个测试账号。",
"写一个查询页：<b>用字符串拼接</b>构造 SQL。",
"正常查询 id=1，确认能返回。",
"输入 <code>1 OR 1=1</code>，观察返回了全部用户。",
"输入 <code>1 UNION SELECT 1,username,password</code>（列数要匹配），观察密码被显示。",
"把代码改成 PDO 预处理，重复上面两步，确认注入失效。",
"对照 DVWA 的 SQL Injection 模块，看它的 Low 级别是不是同样的写法。"],
 code:`-- 建表
CREATE TABLE users (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(64) NOT NULL,
  role     VARCHAR(20) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (username, password, role) VALUES
  ('admin', md5('admin'),   'admin'),
  ('alice', md5('123456'),  'user'),
  ('bob',   md5('password'),'user');

<?php
// 漏洞版 sqli_demo.php
$pdo = new PDO('mysql:host=localhost;dbname=test;charset=utf8mb4', 'root', '');
$id  = $_GET['id'] ?? '1';
$sql = "SELECT id, username, password FROM users WHERE id = " . $id;   // 拼接！
foreach ($pdo->query($sql) as $row) {
    echo $row['id'] . ' - ' . $row['username'] . ' - ' . $row['password'] . '<br>';
}
// 正常：    ?id=1
// 全表：    ?id=1 OR 1=1
// 联合查询：?id=1 UNION SELECT 1,username,password FROM users

// 安全版：改成预处理
// $stmt = $pdo->prepare('SELECT id, username FROM users WHERE id = ?');
// $stmt->execute([$_GET['id'] ?? 1]);
// foreach ($stmt as $row) { echo $row['username'] . '<br>'; }`,
 verify:["id=1 返回一个用户","id=1 OR 1=1 返回全部用户（说明注入成立）","用 UNION 能把别的数据并进结果集显示","改成预处理后，同样的 payload 只被当成「一个字符串值」，查询不到东西但注入不成立"],
 undo:["DROP TABLE users;"],
 warn:"<b>这个靶子是你自己搭的，只在自己虚拟机上打。</b>同样的 payload 打在真实网站上就是非法入侵——不管有没有造成损失。",
 why:"<b>先自己写一个漏洞，再打穿它</b>——这个顺序比直接打现成靶场更有价值：你会记住「这行拼接代码就是漏洞」，这种记忆在审计时是条件反射。"
},
{
 title:"实验 6 · 文件包含：用 php://filter 读源码",
 meta:"难度 ★★★　用时 25 分钟　环境：虚拟机 PHP",
 goal:"复现 LFI，并用 php://filter 读出一个 PHP 文件的源码（LFI 最有价值的用法）。",
 env:"虚拟机 phpStudy。建一个 pages 目录 + 一个含「敏感信息」的 config.php。",
 steps:["写一个路由页：include 'pages/' . $_GET['page'] . '.php'。",
"正常访问 ?page=home，看到页面内容。",
"试着包含系统文件（用 ../ 跳到系统目录）。",
"直接 include config.php 会被执行（看不到源码），所以改用 php://filter。",
"访问 ?page=php://filter/convert.base64-encode/resource=../config，看页面输出的一长串 base64。",
"用 CyberChef 或在线工具解码，确认拿到了 config.php 的源码（里面有数据库口令）。",
"最后改成白名单映射，确认 LFI 失效。"],
 code:`<?php
// 漏洞版 index.php
$page = $_GET['page'] ?? 'home';
include 'pages/' . $page . '.php';
// 正常：   ?page=home
// 读系统： ?page=../../../../Windows/win.ini
// 读源码： ?page=php://filter/convert.base64-encode/resource=../config
//          ↑ 直接包含 .php 会被执行，用过滤器就能「把文件当数据读」

// config.php（页面上不显示内容，但能被 filter 读出来）
// <?php return ['db_user'=>'root','db_pass'=>'SuperSecret123'];

// 白名单修复
$allow = ['home' => 'pages/home.php', 'about' => 'pages/about.php'];
$k = $_GET['page'] ?? 'home';
include ($allow[$k] ?? $allow['home']);`,
 verify:["正常 page=home 能显示页面","用 ../ 能包含到 pages 目录之外的文件","用 php://filter 读到的 base64 解码后，是 config.php 的源码","改成白名单后，任意 page 值都只会进入白名单里的文件"],
undo:["删除实验文件"],
why:"<b>php://filter 是 LFI 里的「读源码神器」</b>。理解它能读源码之后，你就明白了 LFI 为什么常被定为高危——读到 config 就拿到了数据库口令。"
},
{
 title:"实验 7 · 命令执行：ping 功能的两种写法",
 meta:"难度 ★★★　用时 25 分钟　环境：虚拟机 PHP（Windows）",
 goal:"复现命令注入，并对比「转义 / 白名单 / 换函数」三种修复思路的差别。",
 env:"虚拟机 phpStudy（Windows，ping 用 -n 参数）。",
 steps:["写一个 ping 页面：把 $_GET['ip'] 拼进命令并执行。",
"正常传 127.0.0.1，看到 ping 结果。",
"传 127.0.0.1 & whoami，观察命令被执行（有回显）。",
"传一个会卡住的命令（比如 & ping -n 6 127.0.0.1），观察响应时间变长——这就是无回显时确认漏洞的方法。",
"改成白名单校验（必须是合法 IP），再试上面的 payload，确认失效。",
"试试只加 escapeshellarg 不校验格式，看会发生什么。"],
 code:`<?php
// 漏洞版 ping.php
$ip  = $_GET['ip'] ?? '127.0.0.1';
$cmd = 'ping -n 2 ' . $ip;      // Windows 用 -n；Linux 用 -c
system($cmd);
// 正常：  ?ip=127.0.0.1
// 注入：  ?ip=127.0.0.1 & whoami
// 无回显时靠延时确认：?ip=127.0.0.1 & ping -n 6 127.0.0.1

// 修复一：白名单校验（限定格式，而不是过滤字符）
$ip = $_GET['ip'] ?? '';
if (!filter_var($ip, FILTER_VALIDATE_IP)) {
    die('参数必须是合法 IP');
}
system('ping -n 2 ' . escapeshellarg($ip));

// 修复二（更好）：根本不调系统命令
// 用 PHP 自带函数实现同等功能，让用户输入彻底不进入命令。`,
 verify:["?ip=127.0.0.1 能正常 ping","加 & whoami 后能看到当前用户名（命令注入成立）","用延时命令能观察到响应变慢","加白名单校验后，注入 payload 被拒绝","能说清「转义」和「白名单」的保护范围差异"],
 undo:["删除实验文件"],
 warn:"<b>只在自己虚拟机上跑。</b>命令注入一旦在真实系统上成立，等于服务器被控制——这是刑事级别的行为，不要碰。",
 why:"这个实验最重要的是最后一步的对比：<b>只加 escapeshellarg 时，如果用户输入被拼进命令本身（而不是当参数），转义毫无作用。</b>「白名单优于转义」这个结论，在这里会变成具体的手感。"
},
{
 title:"实验 8 · 反序列化：构造一次对象注入",
 meta:"难度 ★★★★　用时 40 分钟　环境：虚拟机 PHP",
 goal:"亲手构造一个序列化字符串，让程序的魔术方法按你的意图执行——理解 POP 链的起点。",
 env:"虚拟机 phpStudy。三个文件：类定义、漏洞入口、payload 生成脚本。",
 steps:["定义一个类，在 __destruct 里做一件「危险」的事（比如往指定路径写文件）。",
"写一个入口页：接收 $_GET['data'] 并 unserialize。",
"先正常传一个自己序列化出来的字符串，观察魔术方法执行。",
"手工构造 payload：把属性值改成你想要的目标。",
"观察魔术方法用你构造的属性执行了——<b>这就是 PHP 对象注入</b>。",
"把入口改成用 json_decode，确认漏洞消失。"],
 code:`<?php
// class.php —— 一个「看起来正常」的类
class Logger {
    public $file = '/tmp/app.log';
    public $msg  = 'started';
    public function __destruct() {
        file_put_contents($this->file, $this->msg);   // 属性可控 + 文件操作
    }
}

// vuln.php —— 漏洞入口
if (isset($_GET['data'])) {
    unserialize($_GET['data']);      // 用户可控的反序列化
}

// make_payload.php —— 生成并观察 payload 格式
require 'class.php';
$o = new Logger();
$o->file = '/tmp/evil.txt';          // 控制属性
$o->msg  = 'pwned';
echo serialize($o);
// 输出形如：O:6:"Logger":2:{s:4:"file";s:14:"/tmp/evil.txt";s:3:"msg";s:5:"pwned";}
// 把这段字符串作为 ?data= 提交给 vuln.php，
// __destruct 就会用你指定的路径和内容写文件。

// 修复：不反序列化不可信数据
// $data = json_decode($_GET['data'], true);
// 或限制类：unserialize($input, ['allowed_classes' => false]);`,
 verify:["能看到 serialize 的输出格式（O:长度:\"类名\":属性数:{...}）","手工改属性值后提交，文件被写到了你指定的路径","理解「unserialize 不是漏洞，魔术方法里的危险操作才是」","改成 json_decode 后，payload 不再生效"],
 undo:["删除实验文件与生成的临时文件"],
 warn:"<b>只在自己虚拟机上做。</b>这里是最小演示；真实项目的 POP 链会跨五六个类，终点常是文件写或命令执行。",
 why:"反序列化是 PHP 审计的深水区，但<b>入门并不难：先理解「序列化字符串是可构造的」，再理解「魔术方法会自动执行」</b>——这两点懂了，POP 链只是把类串起来。"
},
{
 title:"实验 9 · 文件上传：绕过一层层校验",
 meta:"难度 ★★★★　用时 40 分钟　环境：虚拟机 phpStudy",
 goal:"从「只做前端校验」开始，逐层加上校验再逐层绕过，最后叠出五层防护。",
 env:"虚拟机 phpStudy。建一个 uploads 目录。",
 steps:["先写一个「只在前端校验扩展名」的上传页，传一个 .php 文件——直接成功。",
"改成后端只校验扩展名（黑名单 .php），试 .phtml / .PHP 绕过。",
"改成只校验 MIME 类型（$_FILES['type']），用抓包改请求绕过。",
"改成扩展名白名单 + 随机重命名，再试。",
"<b>检查最关键的一点：</b>uploads 目录能不能执行 PHP？访问你上传的文件试试。",
"最后补上「目录禁止解析 PHP」和「内容校验（getimagesize）」，确认整条路被堵死。"],
 code:`<!-- 前端校验（可被轻易绕过） -->
<form method="POST" enctype="multipart/form-data" action="upload.php">
  <input type="file" name="f">
  <button>上传</button>
</form>

<?php
// upload.php —— 逐层加固的对照
$f = $_FILES['f'] ?? null;
if (!$f || $f['error'] !== UPLOAD_ERR_OK) { die('上传失败'); }

// 第 1 层：扩展名白名单（注意严格比较）
$allow = ['jpg','jpeg','png','gif'];
$ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allow, true)) { die('不允许的类型'); }

// 第 2 层：内容校验（必须是真图片）
if (!@getimagesize($f['tmp_name'])) { die('不是有效图片'); }

// 第 3 层：随机重命名（丢掉用户可控的文件名）
$new = bin2hex(random_bytes(16)) . '.' . $ext;

// 第 4 层：确认文件来自上传（防路径穿越）
if (!is_uploaded_file($f['tmp_name'])) { die('非法上传'); }
move_uploaded_file($f['tmp_name'], __DIR__ . '/uploads/' . $new);
echo '上传成功：' . htmlspecialchars($new, ENT_QUOTES);

// 第 5 层（在服务器配置里做，不是 PHP 代码）：
//   Apache: uploads 目录放 .htaccess -> php_flag engine off
//   Nginx : uploads 的 location 不配置 fastcgi_pass`,
 verify:["只做前端校验时，直接改请求就能传上 .php 文件","黑名单只写 .php 时，.phtml / .PHP 能绕过","只校验 MIME 时，改 Content-Type 就能绕过","上传目录能解析 PHP 时，访问上传的文件会执行代码","补上五层后，无论如何都传不上可执行文件"],
 undo:["删除实验文件与 uploads 目录里的测试文件"],
 warn:"<b>只在自己虚拟机上做。</b>上传目录能解析 PHP 是真实环境里最常见的 getshell 路径之一，演示完记得清理。",
 why:"这个实验的设计逻辑是：<b>每加一层校验，你就绕过一次——直到加上「目录禁止解析」这一层，才真正堵死</b>。它让你明白为什么上传防御必须多层叠加。"
},
{
 title:"实验 10 · 用 ripgrep 审计一个开源项目",
 meta:"难度 ★★★　用时 40 分钟　环境：任意 PHP 开源项目 + ripgrep",
 goal:"把四步法用在一个真实项目上，走完「找输入点 → 找危险函数 → 缩小范围」。",
 env:"从 GitHub 下载一个小的 PHP 项目（博客、留言板、小型 CMS 都行），解压到本地。",
 steps:["先看目录结构：找入口文件（index.php 或 public/index.php）和配置文件。",
"搜输入点，统计分布，看哪个目录最密集。",
"搜危险函数，同样统计分布。",
"挑一个「输入点和危险函数都出现」的文件，打开精读。",
"对可疑的行追数据流，记录「参数是否可控、有没有过滤」。",
"<b>产出</b>：一份「可疑点清单」（文件 + 行号 + 判断）。"],
 code:`# 装 ripgrep（Windows 可用 scoop/choco，或直接下 exe）

# ① 看整体结构
cd 项目目录
dir /s /b *.php

# ② 找输入点（统计每个文件出现几次）
rg -c "\\\$_(GET|POST|REQUEST|COOKIE|FILES)" --type php

# ③ 找危险函数
rg -n "system|exec|shell_exec|passthru" --type php
rg -n "eval|assert|call_user_func" --type php
rg -n "unserialize" --type php
rg -n "include|require" --type php
rg -n "file_get_contents|file_put_contents|unlink" --type php
rg -n -i "select|insert|update|delete" --type php

# ④ 找「拼接」特征（$sql 赋值且右侧带变量）
rg -n "\\\$sql\\s*=.*\\\$" --type php

# ⑤ 挑一个文件精读（把上面搜到的行号记下来，逐个看）`,
 verify:["能说出项目的入口文件是哪个","能列出输入点最密集的三个文件","能列出危险函数最密集的三个文件","产出至少 5 条「可疑点」记录（文件+行号+初步判断）","其中至少 1 条能说出「这个输入可控 / 不可控」的理由"],
 undo:["纯代码阅读，无需回滚"],
 why:"<b>这一步是从「学知识」到「能干活」的分界线。</b>第一次做会很慢、会不确定、会误判——这都正常。做完一个项目，第二个就快了。"
},
{
 title:"实验 11 · 综合实战：审计一个多文件小系统",
 meta:"难度 ★★★★★　用时 1.5 小时　环境：本地",
 goal:"按第 22 章的流程，完整审计一个多文件项目，并写出一份可提交的报告。",
 env:"自己写一个 4-5 个文件的小系统（或找一个开源小项目），故意留几个典型漏洞。",
 steps:["<b>建地图</b>：写清入口文件、路由方式、各功能文件、公共库的职责。",
"<b>看公共库</b>：db.php（怎么连库）、helper.php（有没有统一输出函数）。",
"<b>逐个功能文件审</b>：按四步法，记录每个文件发现的问题。",
"<b>交叉搜索</b>：把发现的一种写法（比如拼接 SQL）拿去全局搜，看还有几处。",
"<b>定级排序</b>：按危害金字塔，RCE 和上传类优先。",
"<b>写报告</b>：每个漏洞按「位置 / 成因 / 复现 / 影响 / 修复 / 复测」六项写全。",
"<b>修复并复测</b>：改完再用同样的 payload 验证一次。"],
 code:`报告模板（可直接套用）：

【漏洞】xxx
【等级】严重 / 高危 / 中危 / 低危
【位置】文件路径 + 行号 + 代码片段
【成因】为什么这是漏洞（数据从哪来、经过了什么、有没有过滤）
【复现】最小可复现的请求或步骤
【影响】最坏能造成什么后果（按已证实的上限写）
【修复】具体代码改法
【复测】怎么验证修好了
【附注】同类问题还出现在哪几个文件

自查清单：
  □ 输入点全部标出来了吗？
  □ 危险函数全部看过参数来源了吗？
  □ 每个过滤都判断过是否有效吗？
  □ 有没有漏掉请求头、上传文件名、php://input 这些输入点？
  □ 有没有考虑过组合利用（比如 LFI + 上传）？
  □ 修复建议给了具体代码吗？写清复测方法了吗？`,
 verify:["产出完整的项目结构地图","产出可疑点清单（含文件与行号）","产出至少 3 个已确认的漏洞，含定级","每个漏洞的报告六项齐全","至少完成一个漏洞的「修复 + 复测」闭环"],
 undo:["练习项目自行清理"],
 warn:"<b>审计对象必须是你自己写的项目或开源项目。</b>如果是公司/学校的系统，必须取得授权后再做，且只做只读检查。",
 why:"这是整门课的收尾实验。<b>能独立完成一份审计报告，你就已经具备了「代码审计」这项技能的核心</b>——剩下的只是项目量的积累。"
},
{
 title:"实验 12 · 对照 DVWA 把漏洞串起来",
 meta:"难度 ★★★　用时 50 分钟　环境：虚拟机里的 DVWA",
 goal:"用你已经打过的 DVWA，把课上的五大漏洞和真实靶场一一对上，并看 Impossible 版的修复代码。",
 env:"http://192.168.11.133/DVWA/ ，登录 admin / password。",
 steps:["先在 DVWA Security 页面把级别设成 <b>Low</b>。",
"按顺序走五个模块：SQL Injection → File Inclusion → XSS (Reflected) → Command Injection → File Upload。",
"每打完一个模块，点页面底部的 <b>View Source</b>，找到「拼接 / 未编码 / 未校验」的那几行。",
"把级别切到 <b>Impossible</b>，重复刚才的 payload，确认全部失效。",
"再点 View Source，对比两个版本，写出「修复用的到底是什么手段」。",
"填完下面那张复测记录表。"],
 code:`五个模块与课程的对应关系：

  DVWA 模块                对应章节   核心修复手段
  -----------------------------------------------------
  SQL Injection            第 10 章   预处理 + 参数绑定
  File Inclusion           第 11 章   白名单映射
  XSS (Reflected/Stored)   第 12 章   输出编码 htmlspecialchars
  Command Injection        第 13 章   explode 拆数组 + 白名单校验
  File Upload              第 14 章   白名单 + 内容校验 + 随机名
  Weak Session IDs         第 17 章   随机且不可预测的 Session ID

复测记录表（自己填）：
  模块       | Low 结果 | Impossible 结果 | 修复手段 | 对应章节
  -----------|----------|-----------------|----------|---------
  SQLi       |          |                 |          |
  LFI        |          |                 |          |
  XSS        |          |                 |          |
  RCE        |          |                 |          |
  Upload     |          |                 |          |`,
 verify:["五个模块在 Low 级别都能成功利用","切到 Impossible 后，所有 payload 都失效","能对着源码说出每个模块的修复手段","填完整张复测记录表（5 行）","能说出「为什么 Impossible 版能挡住你刚才的 payload」"],
 undo:["DVWA 首页可以 Reset Database 重置"],
 warn:"<b>DVWA 是你自己虚拟机里的靶场，只在那里练。</b>同一套 payload 打到真实网站就是违法行为——这条线不存在模糊地带。",
 why:"这是把「课程」和「实战」缝合起来的一步。<b>你不需要再找靶场——DVWA 的 Low 和 Impossible 两版源码并排看，就是最好的「漏洞 vs 修复」教材。</b>"
}
];
