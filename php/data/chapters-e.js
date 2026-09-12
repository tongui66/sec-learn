// PHP 学习站 v2 · 第 17-20 章：审计工程
var CHAPTERS_E = [
{
id:17, title:"会话、认证与 JWT", stage:"审计工程",
intro:"登录是所有网站的「大门」，也是逻辑漏洞最集中的地方。<b>这一章讲清 Cookie / Session / JWT 三种状态的来龙去脉，以及审计登录功能时的固定四查。</b>",
sections:[
{h:"17.1 Cookie 与 Session", tbl:[
["对比","Cookie","Session"],
["存哪","浏览器（客户端）","服务器（默认存文件）"],
["内容","一段明文数据","只存一个 Session ID"],
["用户能改吗","<b>能，随便改</b>","改不了内容，但能偷 ID"],
["典型用途","记住偏好、保持登录","保存登录状态与权限"]],
code:[
`<?php
// 写 Cookie（PHP 7.3+ 支持数组选项）
setcookie('theme', 'dark', [
    'expires'  => time() + 86400,
    'path'     => '/',
    'httponly' => true,     // JS 读不到（防 XSS 偷 Cookie）
    'secure'   => true,     // 只在 HTTPS 传输
    'samesite' => 'Lax',    // 缓解 CSRF
]);

// Session：先 start，再读写
session_start();
$_SESSION['user'] = $username;
$_SESSION['role'] = $role;

// 读
if (isset($_SESSION['user'])) { echo '已登录：' . $_SESSION['user']; }`],
warn:"<b>典型漏洞：把权限存在 Cookie 里。</b>例如 <code>setcookie('role', 'user')</code>，用户改成 <code>admin</code> 就提权了。<b>记住原则：客户端只存 Session ID，所有权限判断都在服务端的 Session 或数据库里做。</b>"},
{h:"17.2 安全的登录流程", code:[
`<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = $_POST['username'] ?? '';
    $pass = $_POST['password'] ?? '';

    // ① 用预处理查用户（防 SQL 注入）
    $stmt = $pdo->prepare('SELECT id, username, password, role FROM user WHERE username = ?');
    $stmt->execute([$user]);
    $row = $stmt->fetch();

    // ② 用 password_verify 校验哈希（不是 == 比较）
    if ($row && password_verify($pass, $row['password'])) {
        // ③ 登录成功必须换 Session ID（防会话固定）
        session_regenerate_id(true);
        $_SESSION['uid']  = $row['id'];
        $_SESSION['user'] = $row['username'];
        $_SESSION['role'] = $row['role'];
        header('Location: /index.php');
        exit;
    }
    // ④ 失败信息统一，不要区分「用户不存在」和「密码错误」
    echo '用户名或密码错误';
}`]},
{h:"17.3 会话安全「五查」", tbl:[
["检查项","不安全的写法","修复"],
["① 密码存储","明文 / md5 / sha1","`password_hash()` + `password_verify()`"],
["② 会话固定","登录前后 Session ID 不变","登录后 `session_regenerate_id(true)`"],
["③ 会话劫持","Cookie 没加 HttpOnly / Secure","`setcookie(..., ['httponly'=>true,'secure'=>true])`"],
["④ 鉴权粒度","只判断「登录了没」，不判断「有没有权限」","每个敏感操作都校验角色与资源归属"],
["⑤ 退出登录","只 `unset($_SESSION['user'])` 没销毁","`session_destroy()` + 清 Cookie"]],
note:"<b>越权（第 20 章）的根因往往就在第 ④ 条。</b>「登录了就能看」和「有权限才能看」是两件事。<b>审计时对每个敏感接口都要问：这里校验的到底是「登录状态」还是「数据归属」？</b>"},
{h:"17.4 JWT：原理与三类常见错误", code:[
`// JWT 长这样：三部分用点分隔
// header.payload.signature
// eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjEsInJvbGUiOiJ1c2VyIn0.xxxxxxxx
//
// header   : {"alg":"HS256","typ":"JWT"}
// payload  : {"uid":1,"role":"user","exp":1730000000}   只是 base64，不是加密！
// signature: HMAC(header + "." + payload, 密钥)
//
// 关键认知：payload 是明文（base64 可解），安全性完全依赖签名校验。

// ❌ 错误一：不校验签名
//    把 role 改成 admin，重新 base64 编码，直接提交 -> 提权

// ❌ 错误二：相信 header 里的 alg
//    把 alg 改成 none，或改成 HS256 并用公钥当密钥（算法混淆攻击）

// ❌ 错误三：密钥太弱
//    用 "secret"、"123456" 当密钥 -> 可被离线爆破

// ✅ 正确做法
//    固定算法（服务端写死，不接受 header 里的 alg）
//    强制校验签名与 exp（过期时间）
//    密钥用足够长的随机值，且不要提交到代码仓库`],
warn:"<b>JWT 最常见的误解是「base64 就是加密」。</b>它只是编码——任何人都能解开看内容。<b>审计 JWT 时问三句：签名校验了吗？算法是服务端固定的吗？密钥够强吗？</b>"},
{h:"17.5 密码存储：唯一正确的做法", code:[
`<?php
// 注册时：生成哈希（自带随机盐，不用自己加盐）
$hash = password_hash($password, PASSWORD_DEFAULT);   // bcrypt
// PASSWORD_ARGON2ID 更现代，但需要 PHP 7.2+ 且编译时支持

// 登录时：校验
if (password_verify($input, $row['password'])) {
    // 通过
}

// 需要时：检查是否该重新哈希（算法升级后自动迁移）
if (password_needs_rehash($row['password'], PASSWORD_DEFAULT)) {
    $newHash = password_hash($input, PASSWORD_DEFAULT);
    // UPDATE user SET password = $newHash WHERE id = ...
}

// 审计时看到这些就要报警：
//   md5($password) / sha1($password)
//   $password == $row['password']        明文比较
//   crypt() 用法不当 / 自己实现加盐
//   password 字段长度只有 32 位          说明还在存 MD5`]},
{h:"17.6 审计判断标准", tbl:[
["看到什么","结论"],
["Cookie 里存 `role` / `is_admin` 等权限字段","越权风险"],
["登录成功后没有 `session_regenerate_id`","会话固定"],
["`md5($pass) == $db_pass`","弱哈希 + 弱类型比较，双重问题"],
["`$_SESSION['user']` 存在就放行所有功能","鉴权粒度过粗（越权）"],
["JWT 解析后不验签名","认证绕过"],
["密码找回凭证可预测 / 不绑定用户","任意用户密码重置"]],
tip:"<b>和 DVWA 对接：</b>DVWA 的 <b>Weak Session IDs</b> 模块专门演示「Session ID 可预测」，<b>Brute Force</b> 模块演示登录暴力破解与限速缺失。<b>这两个模块的 Impossible 版本，就是本章的安全写法。</b>"}
],
secview:"会话与认证的审计动作是「五查」：密码怎么存、登录后换不换 ID、Cookie 有没有 HttpOnly/Secure、每个敏感接口有没有校验数据归属、退出有没有真销毁。<b>其中第四条是越权漏洞的根源，也是真实 SRC 里产出最多的一类。</b>"
},
{
id:18, title:"代码审计方法论：四步法", stage:"审计工程",
intro:"前面 17 章讲的都是「知识点」，这一章讲「方法」——<b>面对一个几千行的陌生项目，你按什么顺序看，才能不迷路。</b>",
sections:[
{h:"18.1 四步法总览", tbl:[
["步骤","做什么","手法"],
["① 找输入点","把所有能接收外部数据的地方标出来","全局搜 $_GET/$_POST/$_COOKIE/$_FILES/php://input"],
["② 找危险函数","把可能造成危害的函数标出来","按类别搜索（命令/代码/文件/反序列化/SQL/输出）"],
["③ 追数据流","从输入点沿代码走到危险函数，看中间有没有过滤","变量传递、函数调用、赋值追踪"],
["④ 定级与修复","判断危害大小、给修复方案与复测方法","危害金字塔（见 18.5）"]],
note:"<b>关键认知：审计不是「逐行读代码」，而是「追数据流」。</b>一个项目几千行，你真正要在意的可能只有几十条路径——<b>从「用户能控制的值」到「危险的落点」之间的那几条线。</b>"},
{h:"18.2 第一步：找输入点（完整清单）", code:[
`# 用 ripgrep 一次性把所有输入点搜出来（推荐）
# rg -n "\\\$_(GET|POST|REQUEST|COOKIE|FILES|SERVER)" --type php

<?php
// ── 完全可控的输入 ──
$_GET['x']                    // URL 参数
$_POST['x']                   // 表单
$_REQUEST['x']                // 混合（危险，来源不清晰）
$_COOKIE['x']                 // Cookie
$_FILES['x']['name']          // 上传文件名
$_FILES['x']['type']          // 上传类型（客户端声明）
file_get_contents('php://input')   // 原始请求体（JSON 接口）

// ── 部分可控（容易被忽略）──
$_SERVER['HTTP_USER_AGENT']        // UA 头
$_SERVER['HTTP_X_FORWARDED_FOR']   // 「真实 IP」，可伪造
$_SERVER['HTTP_REFERER']           // 来源页
$_SERVER['REQUEST_URI']            // 请求路径（可能带 payload）
$_SERVER['QUERY_STRING']           // 原始查询串
$_SERVER['PHP_SELF']               // 脚本路径（模板里拼 HTML 会 XSS）
getenv('HTTP_X_FORWARDED_FOR')     // 环境变量形式也能取到请求头`],
tip:"<b>特别提醒 <code>$_SERVER['PHP_SELF']</code>：</b>很多老模板写 <code>&lt;form action=\"&lt;?= $_SERVER['PHP_SELF'] ?&gt;\"&gt;</code>，看上去无害，但请求 <code>/index.php/\"&gt;&lt;script&gt;alert(1)&lt;/script&gt;</code> 就能反射 XSS。<b>这是非常经典、又很常被漏掉的一点。</b>"},
{h:"18.3 第二步：找危险函数（按类别）", code:[
`# ── 命令执行 ──
# rg -n "system|exec|shell_exec|passthru|popen|proc_open|pcntl_exec" --type php
system() exec() shell_exec() passthru() popen() proc_open() 反引号

# ── 代码执行 ──
# rg -n "eval|assert|create_function|call_user_func" --type php
eval() assert() create_function() call_user_func() 可变函数 $fn()

# ── 文件包含 ──
# rg -n "include|require" --type php     然后人工看后面有没有变量

# ── 文件读写删 ──
# rg -n "file_get_contents|file_put_contents|fopen|fwrite|readfile|unlink|rename|copy|move_uploaded_file" --type php

# ── 反序列化 ──
# rg -n "unserialize|serialize|phar://" --type php

# ── SQL ──
# rg -n "mysqli_query|->query|->exec|whereRaw|DB::raw" --type php

# ── 输出（XSS）──
# rg -n "echo |print |printf" --type php

# ── 变量操作 ──
# rg -n "extract\\(|parse_str\\(" --type php`],
note:"<b>把这些命令存成一个脚本，每次审计新项目先跑一遍。</b>危险函数的搜索结果通常几百条，不可能全看——<b>重点是「参数里带变量的那些」</b>，参数是常量或框架内部调用的可以直接跳过。"},
{h:"18.4 第三步：追数据流（最难的一步）", p:["从输入点向危险函数走，中间可能遇到各种「过滤」。<b>判断过滤是否有效，是审计的核心能力。</b>"]},
{tbl:[
["常见过滤","是否有效","为什么"],
["`addslashes()` / 转义函数","<b>看场景</b>","对 SQL 字符串值有效；数字型、宽字节场景无效"],
["`str_replace('../','')`","无效","`....//` 绕过；编码绕过"],
["`htmlspecialchars()` 用于输出","有效","但要注意输出上下文（JS/URL 要换别的编码）"],
["`intval()` / `(int)`","<b>通常有效</b>","强转成整数，注入字符全丢弃；但要确认后续没再拼字符串"],
["`in_array($x,$allow)`","<b>看第三个参数</b>","不加 true 是松散比较（第 3 章）"],
["`preg_match('/^\\w+$/',$x)`","有效","加了 ^$ 锚点，限制整个字符串"],
["`preg_match('/\\w+/',$x)`","无效","没锚点，只匹配一部分就通过"],
["WAF / 中间件","<b>不能算</b>","规则可绕，不能作为代码安全的依据"],
["白名单映射","最有效","枚举式防御，没有绕过空间"]],
tip:"<b>一句口诀：白名单 &gt; 强类型转换 &gt; 转义 &gt; 过滤 &gt; WAF。</b>顺着这个顺序判断一个过滤是否可信，基本不会错。"},
{h:"18.5 第四步：定级与修复建议", tbl:[
["危害等级","典型漏洞","判断依据"],
["严重（RCE 级）","命令执行、代码执行、反序列化、任意文件写入","能直接控制服务器"],
["高危","SQL 注入、文件包含、任意文件删除","能拿数据、能删文件、可能升级"],
["中危","存储型 XSS、越权、任意文件读取","影响特定用户群或部分数据"],
["低危","反射型 XSS、信息泄露、缺少安全头","需要交互或危害有限"],
["逻辑类","按业务影响判断","可能直接是资金损失（等级反而更高）"]],
code:[
`修复建议的写法（要具体到代码）：

❌ 不好的写法：「建议过滤用户输入」

✅ 好的写法：
   第 23 行的 $sql 使用字符串拼接构造查询，存在 SQL 注入。
   建议改为 PDO 预处理：
       $stmt = $pdo->prepare('SELECT ... WHERE id = ?');
       $stmt->execute([$id]);
   涉及文件：/admin/user_list.php 第 23 行`]},
{h:"18.6 审计清单（每次照这个走）", ol:["通读目录结构，找到入口文件（index.php / router），搞清请求怎么分发到各功能。",
"全局搜输入点，列出所有外部可控变量。",
"按类别搜危险函数，筛出「参数带变量」的。",
"对每条可疑路径追数据流，记录过滤方式并判断是否有效。",
"用危害金字塔定级，按等级排序（RCE 优先看）。",
"对每个确认的漏洞写出：位置（文件+行号）、成因、利用条件、危害、修复代码、复测方法。",
"横向扩展：同一个写法在别处还有没有？批量找同类漏洞，一次提交多个。"]}
],
secview:"四步法的价值在于「把无限的工作变成有限的路径」。<b>输入点清单 + 危险函数清单 + 数据流追踪 + 危害定级</b>——这四步做完，一个陌生项目的基本面就摸清了。第 19 章讲工具和流程，第 21-23 章用三个实战把它走一遍。"
},
{
id:19, title:"审计工具与实战流程", stage:"审计工程",
intro:"这一章讲「怎么落地」：源码从哪来、用什么工具搜、怎么从入口文件追到具体功能、以及自动化工具能帮到多少。",
sections:[
{h:"19.1 源码从哪来（常见途径）", tbl:[
["途径","说明","注意"],
["开源项目直接下载","GitHub / Gitee / 官网","合法，最省事，最适合练手"],
["CMS 官方包","WordPress、Discuz、各类建站系统","先看版本，再查已知 CVE"],
["泄露的源码","`.git`、`.svn`、备份文件（www.zip）、`.DS_Store`","<b>只用于评估自己或已授权的目标</b>"],
["授权项目交付","甲方直接提供源码","最常见的工作场景"],
["前端线索","JS 里的接口路径、注释里的版本号","能推出后端框架与版本"]],
note:"<b>练习阶段的最佳路径：下载一个开源 PHP 项目（小型 CMS 或博客系统），在本地跑起来，然后开始审计。</b>比在网上随便找站点试要合法、也学得快——因为你随时可以对照源码验证猜想。"},
{h:"19.2 全局搜索：审计的主力工具", code:[
`# ripgrep（推荐，速度快、默认忽略 .git）
rg -n "\\\$_(GET|POST|REQUEST|COOKIE|FILES)" --type php
rg -n "unserialize|eval|assert" --type php
rg -n "include|require" --type php
rg -n -i "select|insert|update|delete" --type php

# 找「拼接」的特征：赋值给 $sql 且右侧带点号加变量
rg -n "\\\$sql\\s*=.*\\.\\s*\\\$" --type php

# 找变量插值进 SQL（双引号里直接写变量）
rg -n -i '"\\s*SELECT.*\\\$' --type php

# 只搜某个目录（比如只看 admin 后台）
rg -n "system|exec" ./admin --type php

# 统计各类危险函数出现次数（快速判断重点）
rg -c "system\\(|exec\\(|shell_exec\\(" --type php

# 找注释里的线索
rg -n "TODO|FIXME|HACK|测试|debug" --type php`],
tip:"<b>搜索的两个原则：① 先宽后窄</b>（先看整体分布，再缩小到某个文件）；<b>② 结果按「有没有变量」过滤</b>——危险函数搜出几百条很正常，真正要看的是参数里带变量的那几十条。"},
{h:"19.3 从入口文件追路由", code:[
`// 分发方式一：直接按参数 include（老式写法，同时也是 LFI 点）
// index.php
$act = $_GET['act'] ?? 'index';
include 'module/' . $act . '.php';

// 分发方式二：switch 分支（相对安全）
switch ($_GET['act'] ?? 'index') {
    case 'list':   include 'module/list.php';   break;
    case 'detail': include 'module/detail.php'; break;
    default:       include 'module/index.php';
}

// 分发方式三：现代框架（ThinkPHP / Laravel）
//   URL -> public/index.php -> 框架路由 -> 控制器方法
//   审计策略：看 app/ 或 application/ 下的控制器，
//            每个 public function 就是一个入口

// 追踪思路：
//   ① 用户请求能到达哪些文件？（入口 + 路由）
//   ② 每个入口接收什么参数？
//   ③ 参数传给了哪些函数？
//   —— 这就是「数据流」的骨架`]},
{h:"19.4 自动化工具能帮到什么", tbl:[
["工具","类型","作用","局限"],
["Seay 代码审计系统","静态扫描（Windows GUI）","一键扫危险函数、变量覆盖、SQL 注入","误报多，规则老，适合初筛"],
["RIPS","静态分析（PHP）","数据流分析，能追污点传播","开源版停更，商业版收费"],
["国产扫描器（昆仑镜等）","静态扫描","适配中文 CMS 与常见框架","依赖规则更新"],
["Semgrep","静态扫描（通用）","可自定义规则，适合沉淀团队规则","需要自己写规则"],
["PHPStan / Psalm","类型与静态分析","发现类型错误、可疑调用","偏工程质量，不是安全专用"],
["CodeQL","重型 SAST","企业级，支持自定义查询","学习成本高"],
["sqlmap / Burp","动态测试","验证注入、改包","<b>必须只对授权目标使用</b>"]],
warn:"<b>自动化工具只能做「初筛」，不能替代人工审计。</b>它们能快速找到「可疑点」，但「这个输入到底能不能被控制、中间那个过滤有没有用」必须人来判断。<b>真实项目里的逻辑漏洞、越权、二次注入，工具基本发现不了。</b>"},
{h:"19.5 动态验证：把项目跑起来", code:[
`# 在本机把 PHP 项目跑起来（用于验证猜想）
cd /path/to/project
php -S 0.0.0.0:8000        # 内置服务器，适合单文件或简单项目

# 需要 MySQL 的项目：先建库导入 SQL，再改 config 里的连接信息
mysql -u root < install.sql

# 有断点调试需求时（强烈推荐）
#   装 Xdebug + 配 VS Code，可以单步跟踪变量值
#   php.ini:  zend_extension=xdebug.so / xdebug.mode=debug

# 抓包观察真实请求（本地靶场）
#   Burp 或浏览器 F12，看参数怎么传、返回什么

# 验证一个猜想的最小闭环：
#   ① 代码里看到可疑点 -> ② 构造请求 -> ③ 观察是否触发
#   -> ④ 打不通就回去看是不是中间有过滤 -> ⑤ 换绕过思路`],
tip:"<b>「本地跑起来」是审计效率的分水岭。</b>只读代码时，你经常不确定「这个参数到底能不能控制」「这个过滤到底生效没有」；<b>跑起来加一行 var_dump，答案立刻就有。</b>"},
{h:"19.6 完整流程串一遍", ol:["<b>拿到源码</b>：解压、看目录结构、找 README 与版本号。",
"<b>找入口</b>：index.php / public/index.php / 路由文件，搞清请求怎么分发。",
"<b>摸底</b>：跑一遍全局搜索（输入点、危险函数），统计分布，找出重灾区目录。",
"<b>精读</b>：对可疑文件按四步法逐条追数据流。",
"<b>验证</b>：本地跑起来，构造请求确认。",
"<b>横向扩展</b>：同一个写法在别处还有没有？批量找同类。",
"<b>出报告</b>：位置、成因、危害、修复、复测（第 24 章给模板）。"]}
],
secview:"工具这一章的结论：<b>搜索用 ripgrep，初筛用 Seay / 昆仑镜，验证用本地跑起来加抓包，但判断永远靠人。</b>别指望工具替你出结论——能出结论的，是「追数据流」的那几步手工活。"
},
{
id:20, title:"越权、逻辑漏洞与框架审计", stage:"审计工程",
intro:"前面讲的漏洞都能靠「搜函数」找到；<b>这一章讲的两类——越权和逻辑漏洞——只能靠理解业务。</b>它们恰恰是真实 SRC 里产出最多、也最难被工具发现的问题。",
sections:[
{h:"20.1 越权：最常见的真实漏洞", tbl:[
["类型","含义","例子"],
["水平越权","能操作<b>别人的</b>同类数据","`/user/info?uid=124` 改成 125，看到别人资料"],
["垂直越权","低权限身份能执行高权限操作","普通用户直接访问 `/admin/deleteUser` 接口"],
["未授权访问","根本不需要登录","后台接口忘了鉴权，直接访问就能用"]],
code:[
`<?php
// ❌ 水平越权：只按参数取数据，不校验归属
$uid  = $_GET['uid'];
$user = $db->query("SELECT * FROM user WHERE id = $uid")->fetch();
echo $user['phone'];      // 改 uid 就能看别人手机号

// ✅ 修复：从 Session 取当前用户，不接受客户端传的「我是谁」
$uid  = $_SESSION['uid'];
$user = $db->query("SELECT * FROM user WHERE id = ?", [$uid])->fetch();
// 若确实要允许查他人（如管理员），单独做权限判断：
// if ($_SESSION['role'] !== 'admin' && $uid != $_SESSION['uid']) { die('无权限'); }

// ❌ 垂直越权：只检查了「登录」，没检查「角色」
session_start();
if (!isset($_SESSION['user'])) { die('请先登录'); }
$db->query("DELETE FROM user WHERE id = ?", [$_GET['id']]);   // 普通用户也能调用

// ✅ 修复：加角色校验（前端隐藏菜单不算控制）
if (($_SESSION['role'] ?? '') !== 'admin') { die('需要管理员权限'); }`],
warn:"<b>越权的两个常见误区：</b>① <b>「前端菜单里不显示这个功能」不等于没有权限控制</b>——攻击者直接请求接口就行；② <b>「我从 Session 取 uid 了所以安全」也可能有洞</b>——如果 Session 里的 uid 是登录时由用户输入决定的，那还是可控。<b>审计时要一路追到「这个值最初是从哪来的」。</b>"},
{h:"20.2 逻辑漏洞：把业务规则讲清楚", tbl:[
["场景","漏洞形态","审计问法"],
["支付/下单","数量改成负数、改价格参数、并发重复提交","价格和数量由前端传？服务端复核了吗？"],
["优惠券/积分","重复领取、并发领取、条件绕过","有没有做「每人一次」的原子校验？"],
["密码找回","验证码可爆破、Token 可预测、越权重置","重置凭证足够随机吗？绑定了用户吗？"],
["短信/邮件","无频率限制、可指定任意接收者","有没有限速？发送内容可控吗？"],
["注册/邀请","批量注册、邀请码复用","邀请码是一次性的吗？"],
["文件导出","越权导出全量数据","导出范围由前端参数决定吗？"],
["审核流程","跳过审核状态直接提交","状态机能不能被绕过？"],
["并发场景","条件竞争（领两次、扣两次）","检查与执行之间有没有加锁或唯一约束？"]],
note:"<b>逻辑漏洞的审计方法和前面完全不同：不是搜函数，而是「把业务规则写下来，然后逐条问：这条规则能不能绕过」。</b>最好的练习方式是——找一个真实网站的下单/领券流程，把每一步的参数记下来，然后想「如果我改这个参数会怎样」。<b>只在自己的账号上试。</b>"},
{h:"20.3 并发与条件竞争", code:[
`// 场景：余额支付接口
//   ① 查余额  ->  ② 判断够不够  ->  ③ 扣款
//
// 如果两个请求同时到达：
//   请求A 查余额 100，够
//   请求B 查余额 100，够        <- 都读到了同一个旧值
//   请求A 扣 100 -> 余额 0
//   请求B 扣 100 -> 余额 -100   <- 超扣！
//
// 这是典型的「检查与执行之间的竞态」。

// ✅ 修复一：数据库原子操作（把判断写进 SQL）
// UPDATE account SET balance = balance - 100
//   WHERE id = 1 AND balance >= 100;
// 然后检查 affected_rows 是否为 1，不是就说明余额不足

// ✅ 修复二：加锁
// SELECT ... FOR UPDATE;      事务内行锁，排他

// ✅ 修复三：唯一约束兜底（防重复领取）
// ALTER TABLE coupon_record ADD UNIQUE KEY uk_user_coupon (user_id, coupon_id);
// 重复领取时数据库直接报错，从根上解决`],
tip:"<b>「有没有加唯一约束」是判断能否重复领取的最快方法。</b>如果数据库层有唯一约束，业务代码写得再烂也领不了两次；如果没有，就只能靠代码判断——而代码判断在并发下很容易失效。"},
{h:"20.4 框架审计入门", tbl:[
["框架","特点","常见漏洞类型"],
["ThinkPHP","国内用得极多；老版本（3.x / 5.0.x）有著名的参数覆盖与 RCE","参数覆盖导致 RCE、SQL 注入、反序列化"],
["Laravel","现代、生态大，gadget 丰富","反序列化链（配合 unserialize 入口）、`.env` 泄露、debug 模式信息泄露"],
["CodeIgniter / Yii","老项目里常见","SQL 注入（where 拼接）、文件上传"],
["自研框架","中小型项目常见","路由乱、鉴权不统一、过滤缺失"]],
code:[
`# 框架审计的三个切入点

# ① 版本号（决定要不要去查已知漏洞）
#    composer.json / composer.lock 里有依赖与版本
#    框架目录里的 version.php 或常量定义

# ② 入口与路由（决定「用户能碰到什么」）
#    public/index.php -> 路由定义 -> 控制器

# ③ 危险写法（框架也救不了开发者）
#    原生 SQL 逃生舱：DB::raw() / whereRaw() / query()
#    参数覆盖：request->param() 之后直接 use
#    反序列化：框架里有大量可用 gadget，只要有一个入口就能串链`],
warn:"<b>框架审计的正确姿势不是「把框架读完」，而是「读业务代码 + 记住框架的几个坑」。</b>你是来审业务漏洞的，不是来审框架的——框架的漏洞有官方 CVE 和公开 exp，而业务代码里的漏洞只有你能发现。"},
{h:"20.5 已知漏洞与补丁对比", code:[
`审计流程里的高效一步：先确认版本，再查已知漏洞

① 找版本号（文件 / 常量 / 响应头 / JS 注释 / 静态资源文件名里的版本号）
② 拿版本比对公开漏洞库（NVD、CNVD、厂商公告、Exploit-DB）
③ 有对应漏洞就复现验证（在授权范围内）
④ 没有就用四步法自己审

注意两点：
  · 已知漏洞只是「起点」，很多目标早就打过补丁
  · 补丁 diff 是最好的线索：对比修复前后的代码，
    能反推出漏洞的利用方式 —— 这叫「补丁对比分析」`],
tip:"<b>「补丁对比」是审计里非常高效的一招：</b>找到官方发过安全更新的版本，对比更新前后的代码差异，差异处就是漏洞点。<b>很多 0day 研究都是这么开始的。</b>"}
],
secview:"越权与逻辑漏洞的审计方法论：<b>把业务规则写下来，逐条问「能不能绕过」</b>；对每个敏感操作问「这次判断的是登录状态还是数据归属」；对每个「只能做一次」的操作问「数据库层有唯一约束吗」。<b>这三问能覆盖真实业务里的大多数问题。</b>"
}
];
