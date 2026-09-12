// PHP 学习站 v2 · 第 1-6 章：语言基础
// 正文用中文引号「」，代码块用模板字符串（反引号），避免引号转义出错
var CHAPTERS_A = [
{
id:1, title:"PHP 与代码审计：一次请求的完整链路", stage:"语言基础",
intro:"先立框架：学 PHP 不是为了做网站，而是为了<b>看懂别人写的代码里藏着什么</b>。这一章讲清 PHP 在哪运行、一次请求怎么走完、以及「代码审计」到底在审什么。",
sections:[
{h:"1.1 PHP 是什么", p:["PHP 是一种<b>服务器端</b>脚本语言，最典型的用途是根据用户请求动态生成网页。",
"关键区别：HTML / JavaScript 在浏览器（客户端）执行；PHP 在服务器执行，<b>用户永远看不到 PHP 源码</b>，只能看到它输出的结果。",
"正因为源码不可见，很多人对 PHP 站点的理解停在「黑盒」层面——而代码审计就是把这个黑盒打开。"]},
{h:"1.2 一次请求的完整链路（后面每一章都在这里打点）", code:[
`浏览器（客户端）                  服务器
    |                                |
    | ① GET /goods.php?id=3          |
    |------------------------------->|
    |                                | ② Web 服务器（Apache/Nginx）
    |                                |    发现是 .php -> 交给 PHP 解释器
    |                                |
    |                                | ③ PHP 执行代码：
    |                                |    - 取 $_GET['id']  <- 用户输入从这进
    |                                |    - 拼 SQL -> 查数据库
    |                                |    - 拼 HTML -> 准备输出
    |                                |    - 可能调系统命令 / 读写文件
    |                                |
    | ④ 返回 PHP 输出的 HTML          |
    |<-------------------------------|
    | ⑤ 浏览器渲染                    |
    v                                v

漏洞出在第 ③ 步：只要用户输入被拼进了
  - SQL 语句     -> SQL 注入
  - HTML 输出    -> XSS
  - 系统命令     -> 命令执行
  - 文件路径     -> 文件包含 / 任意文件读写
  - 反序列化函数 -> PHP 对象注入`]},
{h:"1.3 为什么网安必须学 PHP", ul:["<b>真实目标里 PHP 占比极高</b>：WordPress、Discuz、ThinkPHP、各类 CMS 和中小型系统，代码都是 PHP。",
"<b>黑盒测试的天花板很低</b>：扫出漏洞靠运气，看懂代码才知道「这里为什么能打、还有没有别的地方能打」。",
"<b>白盒或半白盒的产出效率远高于纯黑盒</b>：拿到源码能一次性找出全站同类问题。",
"<b>面试必问</b>：PHP 危险函数、反序列化、变量覆盖，是安全岗的常规考点。"]},
{h:"1.4 代码审计到底在审什么", p:["一句话定义：<b>顺着「用户输入」这条线，看它有没有被安全地使用。</b>"]},
{tbl:[
["步骤","做什么","产出"],
["① 找输入点","标出所有 $_GET / $_POST / $_COOKIE / $_FILES / $_SERVER / php://input","外部可控的数据入口"],
["② 找危险函数","标出所有 system / eval / include / unserialize / 拼接 SQL / echo","可能的危害落点"],
["③ 追数据流","从输入点沿代码走到危险函数，中间有没有过滤、编码、白名单、类型校验","漏洞是否成立"],
["④ 定级与修复","按危害排序（RCE > 注入 > 文件操作 > XSS > 逻辑），逐个给修复方案","可提交的报告"]],
note:"这四步会在第 18 章展开讲透。现在只要记住：<b>审计不是「读代码」，是「追数据流」</b>。代码有几千行，你追的只是那几条从输入到危险函数的路径。"},
{h:"1.5 这门课怎么学（四步循环）", ol:["<b>读</b>：读一章，重点是「这段代码的用户输入去了哪」。",
"<b>跑</b>：去「实验」页把示例代码跑起来，看到真实输出。",
"<b>打</b>：去「DVWA 靶场」把同一个漏洞亲手打一遍（只在你自己的靶机）。",
"<b>审</b>：回头对着一小段代码走一遍「输入点 → 危险函数 → 数据流 → 修复」。"]},
{h:"1.6 你的实验环境（照这个来，别重装）", tbl:[
["在哪","有什么","怎么用"],
["本机（这台 Windows）","只有这些课程网页","看课、做题、查速查表"],
["虚拟机 192.168.11.133","phpStudy（Apache + PHP 5.4 + MySQL）","把 code 文件夹放进 C:\\phpstudy\\WWW\\ 下，访问 http://192.168.11.133/php/xxx.php"],
["同一台虚拟机","DVWA v1.9（登录 admin / password）","http://192.168.11.133/DVWA/ ，级别切到 Low"]],
tip:"虚拟机在 VMware 的 NAT 网络里，只有你这台电脑能访问它——这是<b>安全的实验配置</b>。另外那台机器上 PHP 是 5.4、DVWA 是 1.9，<b>不要把 PHP 升到 7</b>（DVWA 1.9 用了 PHP 7 已移除的 mysql_* 函数，会直接报错）。"},
{h:"1.7 安全红线（整门课都适用）", p:["这门课会讲到 SQL 注入、命令执行、文件上传、反序列化这些攻击手法。<b>它们是用来让你理解「漏洞长什么样」和「怎么修」，不是让你去打别人的。</b>"], warn:"<b>只在你自己的实验环境里动手。</b>对任何未授权的真实系统做测试——学校网站、公司系统、公网上的任意站点——都是违法行为，可能承担刑事责任。这条线不存在「只是试试」「没造成损失」的例外。"}
],
secview:"这一章建立的是审计的世界观：PHP 在服务器执行、用户看不到源码、漏洞都出在「用户输入被怎么用」上。审计四步（找输入点 → 找危险函数 → 追数据流 → 定级修复）会贯穿整门课，第 18 章会把它变成一套可执行的流程。"
},
{
id:2, title:"基础语法与变量", stage:"语言基础",
intro:"这一章是最基础的语法，但每一节都会同时告诉你「审计时该注意什么」——比如注释里藏着的信息、变量名的来源。",
sections:[
{h:"2.1 PHP 代码块与输出", code:[
`<?php
// PHP 代码写在 <?php ... ?> 之间（纯 PHP 文件可以省略结尾的 ?>）
echo 'Hello, PHP!';       // 输出语句
print '也可以用 print';    // 也是输出，但返回值为 1

// 短标签写法（需配置开启，很多老站点在用，审计时会见到）
// <?= $name ?>  等价于  <?php echo $name; ?>
?>

<!-- PHP 可以穿插在 HTML 里 -->
<html><body>
<p>服务器时间：<?php echo date('Y-m-d H:i:s'); ?></p>
</body></html>`]},
{h:"2.2 变量", code:[
`<?php
$name = 'Alice';      // 变量以 $ 开头
$Name = 'Bob';        // 区分大小写，这是另一个变量
$age  = 20;           // 无需声明类型（弱类型）

// 变量名不能以数字开头：$1abc 是错的

// 可变变量（审计重点，第 16 章讲变量覆盖）
$a = 'name';
echo $$a;             // 等价于 echo $name;  输出 Alice

// 作用域：函数内拿不到函数外的变量（第 6 章细讲）
// 超全局变量是例外：$_GET / $_POST / $_COOKIE 在哪都能用`],
note:"<b>可变变量 $$ 是审计时的红旗。</b>当变量名本身能被用户控制时，攻击者就能凭空创建或覆盖任意变量——这就是第 16 章变量覆盖漏洞的底层机制。"},
{h:"2.3 数据类型", tbl:[
["类型","例子","说明"],
["string 字符串","'hello' / \"hello\"","单双引号行为不同（见 2.4）"],
["int 整型","42 / -7","十进制、0x 开头十六进制、0 开头八进制"],
["float 浮点","3.14 / 1e3","小数与科学计数法"],
["bool 布尔","true / false","真假值"],
["array 数组","['a','b'] / ['k'=>'v']","第 5 章细讲"],
["object 对象","new User()","第 6 章与第 15 章（反序列化）"],
["NULL","null","表示空"]],
code:[
`<?php
// 查看任何变量的类型和值——调试与审计时的第一把刀
var_dump('123');        // string(3) "123"
var_dump(123);          // int(123)
var_dump(null);         // NULL

// 查询字符串里的参数永远是字符串！
// $_GET['id'] 即使传的是 1，拿到的也是字符串 '1'
var_dump($_GET['id'] ?? null);`]},
{h:"2.4 单引号与双引号（差别比你想的大）", code:[
`<?php
$name = 'Alice';

echo 'Hello $name';    // 输出 Hello $name     <- 单引号：原样输出
echo "Hello $name";    // 输出 Hello Alice     <- 双引号：解析变量

// 双引号还支持花括号界定变量边界
echo "名字：{$name}";              // 名字：Alice
echo "第一个字母：{$name[0]}";      // 第一个字母：A`],
tip:"审计小技巧：看到双引号里拼变量，就要想到「这个变量可能来自用户输入」。<b>但真正要警惕的不是引号，而是变量来源</b>——第 7 章会教你系统地找输入点。"},
{h:"2.5 常量与魔术常量", code:[
`<?php
define('SITE_NAME', 'MySite');   // 定义常量（老写法）
const DB_HOST = 'localhost';     // 定义常量（新写法）
echo SITE_NAME;

// 魔术常量：随代码位置变化，审计时很有用
echo __FILE__;      // 当前文件绝对路径
echo __DIR__;       // 当前目录
echo __LINE__;      // 当前行号
echo __FUNCTION__;  // 当前函数名`],
note:"<b>__FILE__ 和 __DIR__ 在审计里很有价值</b>：它们常用于拼接 include 路径。如果某个包含路径是「__DIR__ . '/' . 用户输入」，那个用户输入就是 LFI 入口。"},
{h:"2.6 注释（审计时的藏宝地）", code:[
`<?php
// 单行注释
# 也是单行注释（PHP 特有；在 URL 里 # 要写成 %23）
/* 多行
   注释 */

/* 审计时重点看这些注释：
   // TODO: 上线前去掉调试代码
   // 测试账号 admin/admin123
   // $debug = true;   <- 被注释掉的调试开关
   // 这里先不做校验了，后面补
*/`],
tip:"<b>注释是审计的高性价比信息源。</b>开发者常在这里留下：测试账号、被临时关闭的校验、TODO 提醒、废弃但仍可访问的接口名。<b>读到注释，就当读到了开发者的自言自语。</b>"}
],
secview:"这一章的审计要点：可变变量 $$ 是红旗、双引号里的变量要追来源、魔术常量可能参与路径拼接、注释里常有账号和线索。语法本身不重要，重要的是「看到这段代码时，你脑子里要自动问一句：这里的值从哪来？」"
},
{
id:3, title:"弱类型陷阱：== 、=== 与魔术哈希", stage:"语言基础",
intro:"这是 PHP 最容易被绕过的地方，也是 CTF 和真实漏洞里的高频考点。<b>同一个原理，在鉴权、验证码、支付校验里都能用。</b>",
sections:[
{h:"3.1 类型转换：PHP 什么时候偷偷换类型", code:[
`<?php
// ① 运算时自动转换
var_dump('123' + 1);      // int(124)   字符串被当数字
var_dump('abc' + 1);      // int(1)     'abc' 转成 0
var_dump('12abc' + 1);    // int(13)    取前面的数字部分

// ② 比较时自动转换（== 才转，=== 不转）
var_dump(0 == 'abc');     // bool(true)  'abc' -> 0
var_dump('0' == 0);       // bool(true)
var_dump(null == 0);      // bool(true)  null -> 0

// ③ 布尔判断里的「假值」只有这几个
//    '' 、0 、'0' 、null 、false 、[] 都是假，其余都为真
var_dump('0.0');          // bool(true)  注意！'0.0' 不是假值`]},
{h:"3.2 == 与 === 的完整对照", tbl:[
["表达式","结果","为什么"],
["0 == 'abc'","true","字符串转数字得 0"],
["'1' == '01'","true","两个都当数字比"],
["'10' == '1e1'","true","'1e1' 当科学计数 = 10"],
["100 == '1e2'","true","同样是科学计数"],
["'0e123' == '0e456'","<b>true</b>","都当 0，这就是魔术哈希"],
["0 === 'abc'","false","类型不同，=== 直接判否"],
["null === false","false","类型不同"],
["'1' === '01'","false","字符串严格比较"]],
tip:"记住结论：<b>涉及安全判断（密码、令牌、权限、金额）的比较，一律用 ===</b>。== 只在明确知道双方类型时才可以用。"},
{h:"3.3 魔术哈希绕过（经典漏洞）", p:["场景：开发者用 <code>==</code> 比较哈希值，而数据库里的哈希<b>形如 <code>0e</code> 开头的纯数字</b>（MD5 在某些明文下会产出这种值）。"]},
{code:[
`<?php
// 这两个明文的 MD5 都以 0e 开头，后面全是数字
$a = md5('240610708');   // 0e462097431906509019562988736854
$b = md5('QNKCDZO');     // 0e830400451993494058024219903391
var_dump($a); var_dump($b);

// 一旦用 == 比较，两边都被当成「0 的科学计数」= 0 -> 相等！
var_dump($a == $b);      // bool(true)  <- 它们明明不一样！

// 用 === 就正常了
var_dump($a === $b);     // bool(false)

// 真实漏洞场景：
//   if ($_POST['pass'] == $db_pass) { 登录成功 }
//   攻击者构造一个 MD5 也是 0e 开头的字符串，就能绕过口令校验`],
note:"这类「0e 开头、后面全数字」的字符串被称为 <b>Magic Hash（魔术哈希）</b>。除了 MD5，SHA1 也有对应的魔术哈希值。<b>修复只有一条：用 ===</b>；更彻底的是用 <code>password_verify()</code> 或 <code>hash_equals()</code> 做恒定时间比较。"},
{h:"3.4 其他弱类型坑：in_array / strcmp / switch", code:[
`<?php
// ① in_array 默认松散比较（第三个参数 true 才是严格模式）
var_dump(in_array(0, ['abc', 'def']));        // bool(true)   0 == 'abc' 为真
var_dump(in_array(0, ['abc'], true));         // bool(false)  严格模式才正确

// ② strcmp 在 PHP 8 之前遇到数组会返回 0（等于）
//    老代码 if (strcmp($pass, $dbpass) == 0) 可能被传数组绕过

// ③ switch 用的是松散比较 ==
$x = '0abc';
switch ($x) {
    case 0: echo '命中 0！'; break;   // 这一句会被执行
}`],
warn:"<b>审计时看到 in_array / array_search / switch，先看有没有用严格模式。</b>列表校验、白名单校验如果用松散比较，就可能被「0 与任意字符串相等」这类特性绕过——这是很多「白名单明明写了却还是能绕」的真正原因。"},
{h:"3.5 类型绕过的实战套路", tbl:[
["函数 / 写法","绕过方式","修复"],
["`is_numeric($x)`","<code>1e3</code>、<code>0x1A</code>、前后空格都算数字","配合 intval 加范围校验"],
["`intval($x)`","<code>intval('1abc')=1</code>，静默截断不报错","先校验格式再转换"],
["`$a == $b`","魔术哈希、0 与字符串相等","改用 ==="],
["`in_array($x,$list)`","松散比较导致误判","第三个参数传 true"],
["`strcmp($a,$b)==0`","传数组（PHP 8 前返回 0）","加 is_string 判断"],
["`preg_match` 未加 ^$","只匹配一部分就算通过","加锚点 ^ 和 $"]]},
{h:"3.6 防御：把严格当默认", code:[
`<?php
// 1) 一律用 === / !==
if ($user === 'admin' && $token === $expect) { /* ... */ }

// 2) 比较敏感字符串用 hash_equals（恒定时间，还防时序攻击）
if (hash_equals($expected_token, $input_token)) { /* ... */ }

// 3) 校验数字：先判类型再判范围
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if ($id === false || $id < 1) { die('参数错误'); }

// 4) 文件顶部声明严格模式（只影响函数参数/返回值，不影响 ==）
declare(strict_types=1);

// 5) 不确定类型时先 var_dump 再写逻辑`]}
],
secview:"弱类型的本质是「PHP 会帮你猜」。在业务代码里它很方便，在安全判断里它是灾难。<b>记住一句话：凡是用来「决定能不能通过」的比较，都必须用 ===。</b>审计时的排查动作很简单——搜代码里所有出现 == 的地方，逐个看是不是安全判断。"
},
{
id:4, title:"运算符与流程控制", stage:"语言基础",
intro:"这一章是写逻辑的基础。审计视角的重点不是运算符本身，而是「条件写错了会怎样」——绝大多数逻辑漏洞，本质都是一个条件写错了。",
sections:[
{h:"4.1 算术、连接与赋值", code:[
`<?php
$a = 7; $b = 2;
echo $a + $b;   // 9
echo $a - $b;   // 5
echo $a * $b;   // 14
echo $a / $b;   // 3.5   除法返回浮点
echo $a % $b;   // 1     取余
echo $a ** $b;  // 49    幂运算

// 字符串连接用点，不是加号！
echo 'a' . 'b';       // ab
echo '1' + '1';       // 2   <- 加号是算术，会把字符串当数字

// 赋值简写
$n = 1; $n += 5;      // 6
$s = 'a'; $s .= 'b';  // ab`],
tip:"<b>点号和加号混用是新手常见 bug，也是审计时找「拼接」的线索。</b>看到 <code>$sql = 'SELECT ...' . $id</code> 就该警觉——这正是 SQL 注入的写法。"},
{h:"4.2 比较与逻辑运算符", code:[
`<?php
// 比较：== === != !== < > <= >= <=>
var_dump(1 <=> 2);     // -1（左边小）

// 逻辑：&& || !    也可以写 and or（优先级不同，容易踩坑）
$ok = true && false;   // false

// 注意：&& 的优先级高于赋值 =，而 and 低于 =
$x = true and false;   // $x 被赋值为 true！（相当于 ($x = true) and false）
$y = true && false;    // $y 是 false`],
warn:"<b><code>and</code> / <code>or</code> 的优先级低于赋值号，<code>&&</code> / <code>||</code> 高于赋值号。</b>混用会导致「条件看起来写了，其实没生效」。审计时看到 <code>$result = f() or die()</code> 这种写法要特别留意。"},
{h:"4.3 真假值表（判断逻辑的基础）", tbl:[
["值","布尔判断结果"],
["`true` / 非零数字","真"],
["`false`","假"],
["`0`（整数）","<b>假</b>"],
["`0.0`（浮点）","<b>假</b>"],
["`'0'`（字符串）","<b>假</b>"],
["`'0.0'` / `'false'` / `' '`（有内容的字符串）","<b>真</b>"],
["`''`（空字符串）","假"],
["`null`","假"],
["`[]`（空数组）","假"],
["`new stdClass()`（对象）","真"]],
note:"<b>典型的逻辑漏洞场景：</b>代码写 <code>if ($_GET['debug']) {...}</code>，开发者以为「不传就是关」。但字符串 <code>'0'</code> 是假值，<code>'0.0'</code>、<code>'false'</code> 却都是真值——<b>参数只要不是空的，判断就成立</b>。所以判断开关要用 <code>isset()</code> 或明确比较。"},
{h:"4.4 条件分支", code:[
`<?php
if ($score >= 90) {
    echo '优秀';
} elseif ($score >= 60) {
    echo '及格';
} else {
    echo '不及格';
}

// 三元与空合并（审计高频）
$role = isset($_GET['role']) ? $_GET['role'] : 'guest';   // 老写法
$role = $_GET['role'] ?? 'guest';                          // 新写法（PHP 7+）

// 空合并只判 null
$a = 0 ?? 'x';     // 0      （0 不是 null）
$a = null ?? 'x';  // 'x'

// 简写三元 ?: 对「假值」也生效，容易踩坑
$b = $_GET['id'] ?: '1';   // 传 id=0 时会被当成空 -> 变成 '1'`]},
{h:"4.5 循环", code:[
`<?php
for ($i = 1; $i <= 3; $i++) { echo "第 $i 次\n"; }

$i = 0;
while ($i < 3) { echo $i++; }

$user = ['name' => 'Alice', 'role' => 'admin'];
foreach ($user as $k => $v) { echo "$k = $v\n"; }

// foreach 直接遍历输入数组 —— 审计时值得注意的写法
foreach ($_GET as $key => $value) {
    echo "参数 $key 的值是 $value\n";   // 如果输出未编码 -> XSS
}

// 循环中的 break / continue
foreach ([1,2,3] as $n) {
    if ($n === 2) continue;
    if ($n === 3) break;
    echo $n;
}`],
note:"<b>遍历超全局数组（<code>foreach ($_GET as ...)</code>）在审计里是个信号</b>：要么是在做批量过滤（好事），要么是在把用户输入批量输出/拼接（可能出事）。看到就直接读它循环体里干了什么。"},
{h:"4.6 审计视角：条件写错 = 逻辑漏洞", tbl:[
["错误写法","问题","后果"],
["`if ($_GET['debug'])`","字符串 '0.0' 也是真","调试模式被意外打开"],
["`if (!$user)`","用户名为 '0' 会被当成假","合法用户被拒/被绕过"],
["`if ($role == 'admin')`","可用 == 与 0 比较绕过","越权"],
["`if (strpos($s,'a'))`","strpos 返回 0 时也是假","开头匹配被漏判"],
["`if (count($arr))`","空数组为假，语义模糊","批量操作被跳过"]],
tip:"审计逻辑漏洞的通用问法：<b>「这段判断，攻击者能不能构造一个输入，让它在不该成立的时候成立（或反之）？」</b>把每个 if 都这样问一遍，逻辑漏洞就藏不住了。"}
],
secview:"逻辑漏洞的根源几乎都在这一章：条件写错、真假值判断错、运算符优先级搞错。审计动作是——<b>把所有 if 条件读一遍，问自己「这个条件有没有可能被绕过」</b>。特别是权限判断：<code>if ($row['role'] == 'admin')</code> 和 <code>if (isset($role))</code> 完全是两个安全等级。"
},
{
id:5, title:"数组、字符串与危险函数总览", stage:"语言基础",
intro:"数组是 PHP 里最重要的数据结构（所有用户输入都是数组），字符串函数是注入与绕过的工具库。<b>这一章的最后一节是「危险函数清单」——务必记住。</b>",
sections:[
{h:"5.1 两种数组", code:[
`<?php
// 索引数组
$list = ['apple', 'banana', 'cherry'];
echo $list[0];                    // apple

// 关联数组（键值对）
$user = ['name' => 'Alice', 'role' => 'admin'];
echo $user['role'];               // admin

// 混合与嵌套（真实数据的样子）
$data = [
    'id'   => 1,
    'tags' => ['php', 'security'],
    'meta' => ['ip' => '127.0.0.1']
];
echo $data['tags'][1];            // security

// 遍历
foreach ($user as $k => $v) { echo "$k = $v\n"; }

// 增删改
$user['email'] = 'a@b.com';       // 新增
unset($user['role']);             // 删除
echo count($user);                // 元素个数`]},
{h:"5.2 超全局数组 = 你的输入点清单", tbl:[
["变量","来源","可控性"],
["`$_GET`","URL 查询参数 ?a=1","完全可控"],
["`$_POST`","请求体（表单）","完全可控"],
["`$_COOKIE`","浏览器携带的 Cookie","完全可控（可伪造）"],
["`$_REQUEST`","GET + POST + COOKIE 合并","完全可控，且来源混乱"],
["`$_FILES`","上传文件（含文件名、临时路径）","文件名与内容均可控"],
["`$_SERVER`","请求头等环境信息","部分可控（如 HTTP_USER_AGENT、HTTP_X_FORWARDED_FOR）"],
["`php://input`","原始请求体","完全可控"]],
tip:"<b>审计第一步就是把这些变量在代码里全部搜一遍。</b>一个好用的搜索式：<code>\\$_(GET|POST|REQUEST|COOKIE|FILES|SERVER|HTTP)</code>。搜到的地方就是「用户能伸手进来的窗口」。"},
{h:"5.3 数组函数（白名单与校验的工具）", code:[
`<?php
$arr = ['a' => 1, 'b' => 2];

isset($arr['a']);              // true（值为 null 时返回 false）
array_key_exists('a', $arr);   // true（即使值为 null 也 true）
empty($arr);                   // false
in_array(1, $arr);             // true（松散！加第三个参数 true 才严格）
array_search(2, $arr);         // 'b'
array_keys($arr);              // ['a','b']
array_values($arr);            // [1,2]
array_map('intval', [1,'2']);  // 批量转换

// 审计重点：用 in_array 做白名单时必须加 true
$allow = ['home','about'];
$page  = $_GET['page'] ?? '';
if (in_array($page, $allow)) { include "$page.php"; }       // ❌ 松散比较可绕过
if (in_array($page, $allow, true)) { include "$page.php"; } // ✅`]},
{h:"5.4 字符串函数", code:[
`<?php
strlen('abc');                       // 3
str_replace('a', 'b', 'abc');        // bbc    <- 只替换，不是转义
explode('/', 'a/b/c');               // ['a','b','c']
implode('-', ['a','b']);             // a-b
substr('abcdef', 1, 3);              // bcd
strpos('abcdef', 'cd');              // 2（找不到返回 false）
trim('  a  ');                       // a
sprintf('%s-%d', 'a', 1);            // a-1

// 正则（审计高频）
preg_match('/^[a-z]+$/', $s);        // 是否匹配
preg_match_all('/\\d+/', $s, $m);     // 全部匹配
preg_replace('/a/', 'b', $s);        // 替换
// ⚠️ preg_replace 的 /e 修饰符会执行替换结果（PHP 5.5 起废弃，老代码里是 RCE）`],
note:"<b>分清「过滤」和「转义」——新手最容易搞混的一点。</b><code>str_replace('../', '', $path)</code> 属于过滤（可能被 <code>....//</code> 绕过）；<code>htmlspecialchars()</code> 属于转义（把字符变成无意义的实体）。<b>能用转义解决的场景，不要用过滤。</b>"},
{h:"5.5 危险函数总览（务必记住这张表）", tbl:[
["类别","函数","危害"],
["命令执行","`system()` `exec()` `shell_exec()` `passthru()` `popen()` `proc_open()` 反引号","RCE，直接控制服务器"],
["代码执行","`eval()` `assert()` `create_function()` `preg_replace` 带 /e","RCE"],
["文件包含","`include()` `require()` 及 _once 变体","LFI / RFI，可读源码甚至 getshell"],
["文件读写","`file_get_contents()` `file_put_contents()` `fopen()` `readfile()`","任意文件读取/写入"],
["文件删除移动","`unlink()` `rename()` `copy()` `move_uploaded_file()`","任意文件删除、上传落盘"],
["反序列化","`unserialize()`","PHP 对象注入（第 15 章）"],
["变量操作","`extract()` `parse_str()` `$$`","变量覆盖（第 16 章）"],
["数据库","拼 SQL 的 `mysqli_query()` `query()` `exec()`","SQL 注入（第 10 章）"],
["输出","`echo` `print` `printf` `<?=`","XSS（第 12 章）"],
["回调","`call_user_func()` `array_map()` `usort()`","可控函数名 = 任意函数调用"]],
warn:"<b>这张表不要背名字，要背「看到就查参数来源」这个反射。</b>函数本身没错，错的是「参数来自用户且没校验」。审计时把这张表里的名字在代码里全搜一遍，逐个看参数——这就是最基础的「危险函数审计法」。"}
],
secview:"这一章给的是审计的两把钥匙：<b>输入点清单（超全局变量）</b>和<b>危险函数清单</b>。把它们交叉搜索——「输入点的值有没有流到危险函数」——你就有了审计的基本功。第 18 章会把这两个清单变成一套可执行的流程。"
},
{
id:6, title:"函数、作用域与文件组织", stage:"语言基础",
intro:"函数决定代码怎么被复用，也决定「危险操作藏在哪里」。这一章还要引出后面两个关键概念：include 的文件包含机制，以及类和对象（反序列化的基础）。",
sections:[
{h:"6.1 定义与调用", code:[
`<?php
function checkPassword($pwd, $min = 8) {
    if (strlen($pwd) < $min) {
        return false;
    }
    return true;
}

if (checkPassword('abcd1234')) { echo '长度合格'; }

// 引用传参：函数内改动会影响外部变量
function addOne(&$n) { $n++; }
$x = 1; addOne($x); echo $x;   // 2

// 可变函数（审计红旗：函数名可控 = 可以调用任意函数）
$fn = $_GET['action'] ?? 'show';
$fn();                          // ❌ 危险！用户能调用任意函数

// 闭包与匿名函数
$double = function($n) { return $n * 2; };
echo $double(5);                // 10`],
warn:"<b>「函数名由用户控制」比「参数可控」更严重。</b>形如 <code>$fn = $_GET['fn']; $fn($arg);</code> 的代码，等于把「调用哪个函数」交给了攻击者——配合 <code>system</code>、<code>phpinfo</code> 这类函数就是直接 RCE。审计时搜可变函数调用模式。"},
{h:"6.2 作用域", code:[
`<?php
$score = 100;             // 全局

function showScore() {
    // echo $score;        // ❌ 报错：函数内拿不到全局变量
    global $score;        // 用 global 声明后才行
    echo $score;
}

function who() {
    // 超全局变量例外：函数内可以直接用（这也是它们危险的原因）
    return $_GET['name'] ?? '匿名';
}

// 静态变量：函数调用之间保持值
function counter() {
    static $n = 0;
    return ++$n;
}
echo counter(); echo counter();   // 12`],
note:"<b>审计视角：<code>global</code> 用得越多，全局状态越复杂，越容易出现「某个函数悄悄改了鉴权变量」这类问题。</b>而「函数内部直接用 $_GET」意味着这个函数<b>依赖外部输入</b>——看到这种函数就要检查它有没有校验。"},
{h:"6.3 文件组织：include / require", code:[
`<?php
// include：文件不存在只警告，继续执行
// require：文件不存在直接致命错误
// _once 变体：确保只包含一次
include 'header.php';
require_once 'config.php';

// 常见用途：公共头尾、模板、路由
$page = $_GET['page'] ?? 'home';
include $page . '.php';        // ❌ 这就是 LFI 的经典写法（第 11 章）

// 相对路径 vs 绝对路径
include './inc/a.php';                 // 相对当前工作目录
include __DIR__ . '/inc/a.php';        // 相对当前文件（推荐）`],
tip:"<b>真实项目里 include 出现在几百个文件里。</b>审计时不要逐个看，直接搜「include 后面有没有变量」——有变量的那些才是候选点。"},
{h:"6.4 类与对象速览（反序列化的基础）", code:[
`<?php
class User {
    public $name = 'guest';
    private $token = 'secret';

    public function __construct($name) {   // 构造：new 时自动执行
        $this->name = $name;
    }
    public function __destruct() {         // 析构：对象销毁时自动执行
        // 魔术方法！反序列化漏洞就靠这类方法触发
    }
    public function __wakeup() {           // 反序列化时自动执行
    }
    public function intro() {
        return '我是 ' . $this->name;
    }
}

$u = new User('Alice');
echo $u->intro();

// 对象 -> 字符串（序列化），字符串 -> 对象（反序列化）
$s = serialize($u);        // O:4:"User":1:{s:4:"name";s:5:"Alice";}
$o = unserialize($s);      // 恢复成对象，并触发 __wakeup`],
note:"<b>这一节是第 15 章的预告。</b>记住三个词：<code>serialize</code>（对象变字符串）、<code>unserialize</code>（字符串变对象）、<b>魔术方法</b>（<code>__wakeup</code> / <code>__destruct</code> / <code>__toString</code> 会在特定时机自动执行）。<b>当反序列化的字符串能被用户控制时，他就能控制对象里各个属性的值，从而让魔术方法按他的设想执行——这就是 PHP 对象注入。</b>"},
{h:"6.5 命名空间与自动加载", code:[
`<?php
namespace App\\Controller;      // 命名空间：避免类名冲突

use App\\Model\\User;

// 自动加载：new 一个类时，自动去找对应文件
spl_autoload_register(function ($class) {
    // ❌ 危险写法：类名可控 + 拼路径 = 本地文件包含
    // require_once __DIR__ . '/' . $class . '.php';
});

// 审计提示：自动加载里的 $class 通常来自代码，
// 但在某些框架里会受路由/参数影响，值得看一眼`]}
],
secview:"函数这一章的审计要点有三个：<b>可变函数（函数名可控）</b>、<b>include 的参数可控</b>、<b>魔术方法与反序列化的组合</b>。前两个是即时危害，第三个是 PHP 独有的深水区。到这里语言基础结束——从下一章开始，正式进入「输入从哪里来」。"
}
];
