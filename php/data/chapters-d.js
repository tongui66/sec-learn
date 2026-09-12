// PHP 学习站 v2 · 第 14-16 章：上传与 PHP 特有漏洞
var CHAPTERS_D = [
{
id:14, title:"文件上传与 WebShell", stage:"上传与特有漏洞",
intro:"上传点是攻击者最爱的地方：<b>能传文件往往意味着能传木马</b>。这一章讲透上传校验的绕过思路、WebShell 是什么，以及审计上传代码时的固定检查清单。",
sections:[
{h:"14.1 PHP 处理上传的完整流程", code:[
`<!-- 表单必须写 enctype -->
<form method="POST" action="upload.php" enctype="multipart/form-data">
  <input type="file" name="upfile">
  <input type="submit" value="上传">
</form>

<?php
// upload.php
// 1) 检查错误码（0 = 成功）
if ($_FILES['upfile']['error'] !== UPLOAD_ERR_OK) {
    die('上传失败，错误码：' . $_FILES['upfile']['error']);
}

// 2) 拿信息（注意：name 和 type 都是客户端给的，不可信！）
$name = $_FILES['upfile']['name'];       // 原始文件名
$tmp  = $_FILES['upfile']['tmp_name'];   // 服务器临时路径（可信）
$size = $_FILES['upfile']['size'];

// 3) 移动到目标目录
move_uploaded_file($tmp, 'uploads/' . $name);
//                                  ^^^^^^ 直接用用户文件名 -> 危险！

// 相关的 php.ini 配置
//   file_uploads = On          是否允许上传
//   upload_max_filesize = 2M   单文件大小上限
//   upload_tmp_dir             临时目录
//   open_basedir               限制 PHP 可访问的目录`]},
{h:"14.2 各类校验为什么会被绕过", tbl:[
["校验方式","绕过思路","为什么不行"],
["前端 JS 校验扩展名","抓包改包，或在请求里直接发文件","前端校验只是体验，不是安全"],
["黑名单 `.php`","`.phtml` `.php5` `.php7` `.pht` `.phar`，或 `.PHP` 大小写","可执行扩展名太多"],
["只检查 `type`（MIME）","抓包把 Content-Type 改成 image/jpeg","这个字段是客户端给的"],
["只检查文件头（magic bytes）","「图片马」：GIF89a 头 + PHP 代码，仍可被解析","内容检查不彻底"],
["检查后缀但保留原名","配合 .htaccess 或解析漏洞（如 Nginx 配置不当）","环境差异"],
["`%00` 截断","PHP 5.3.4 之后已修复","历史手法，老系统才有"],
["`;` 或空格后缀（Apache 旧版）","`shell.php;.jpg`、`shell.php .jpg`","取决于中间件版本"],
["二次渲染（图片重绘）","理论上可对抗图片马，但实现复杂","很多项目根本没做"]],
warn:"<b>一句话结论：上传校验只要「只做了一层」，基本都能绕。</b>真正的安全上传是<b>多层叠加</b>：扩展名白名单 + 内容校验 + 随机重命名 + 目录禁止解析 PHP + 存储与执行分离。<b>少任何一层，都留了一个口子。</b>"},
{h:"14.3 WebShell 是什么", code:[
`<?php
// 「一句话木马」的最小结构（本课程不给可直接复制的完整形态）
//
// 它由三个要素拼成：
//   ① 一个能「执行字符串代码」的函数（名字是 e-v-a-l，五个字母）
//   ② 从请求参数里取要执行的内容（$_POST 或 $_GET）
//   ③ 前面加一个 @ 抑制报错输出，减少暴露
//
// 为什么不写全：
//   · 写全了就是一个可直接使用的后门，会被杀毒软件当成木马
//     （这份课程文件的完整版本就被 Windows Defender 清洗过）；
//   · 「照着抄一个后门」也不是这门课的目的 —— 你要学的是「认出它、堵住它」。
//   想亲手验证的同学，请在你自己的靶场里按上面三个要素自己拼一遍，这也是练习。
//
// 配合「蚁剑 / 冰蝎 / 哥斯拉」这类客户端管理工具，
// 就变成一个可以浏览文件、执行命令、操作数据库的完整后门。

// 常见的变体关键词（蓝队查杀时搜这些）
//   eval / assert / create_function / preg_replace 带 /e
//   base64_decode / gzinflate / str_rot13   常用来藏真实代码
//   接收执行内容：$_POST['x'] / $_GET['x'] / $_REQUEST
//   无文件马：把代码写进 session、数据库、或者内存`],
note:"<b>WebShell 有两种形态：</b><b>文件马</b>（磁盘上有实体文件，可被文件扫描发现）和<b>内存马</b>（只存在于运行时内存，Java 应用里多）。<b>上传漏洞的终点通常是「文件马落地 + 被访问执行」。</b>"},
{h:"14.4 安全的上传实现（五层防护）", code:[
`<?php
// ① 扩展名白名单（只允许明确需要的类型）
$allow = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
$name  = $_FILES['upfile']['name'] ?? '';
$ext   = strtolower(pathinfo($name, PATHINFO_EXTENSION));
if (!in_array($ext, $allow, true)) {          // 注意第三个参数 true！
    die('不允许的文件类型');
}

// ② 校验真实内容（图片必须是真图片）
if (!@getimagesize($_FILES['upfile']['tmp_name'])) {
    die('不是有效的图片文件');
}

// ③ 随机重命名，彻底丢掉用户可控的文件名
$newName = bin2hex(random_bytes(16)) . '.' . $ext;
$target  = __DIR__ . '/uploads/' . $newName;

// ④ 只允许从临时目录移动（防止路径穿越到别处）
if (!is_uploaded_file($_FILES['upfile']['tmp_name'])) {
    die('非法上传');
}
move_uploaded_file($_FILES['upfile']['tmp_name'], $target);

// ⑤ 环境层：上传目录禁止解析 PHP（关键且容易被忽略）
//    Apache：该目录下放 .htaccess  ->  php_flag engine off
//    Nginx ：该目录的 location 不配置 fastcgi_pass
//    最彻底：文件存到对象存储/CDN，与 Web 目录物理分离`],
tip:"<b>第 ⑤ 层最容易被忽略，也最救命。</b>很多项目前三层做得都不错，但上传目录正好在 Web 根目录下、PHP 又能解析——结果一个「图片马」就 getshell 了。<b>审计上传功能时，一定要问一句：这个目录能不能执行 PHP？</b>"},
{h:"14.5 审计判断标准", tbl:[
["看到什么","结论"],
["`move_uploaded_file($tmp, 'dir/' . $_FILES['f']['name'])`","任意文件上传（文件名可控）"],
["只看 `$_FILES['f']['type']`","校验可绕过，判定为漏洞"],
["只在前端校验扩展名","等于没有校验"],
["扩展名白名单 + 内容校验 + 随机名","基本安全"],
["白名单覆盖了 `.php` 但漏了 `.phtml`","仍可能被绕过（取决于中间件）"],
["上传目录可执行 PHP","高危配置（即使代码看着没问题）"]],
tip:"<b>和 DVWA 对接：</b>DVWA 的 <b>File Upload</b> 模块，Low 级别直接传一个 .php 文件就能执行；Medium 加了类型和大小校验（抓包改 Content-Type 就能绕）；High 加了扩展名和 getimagesize 校验。<b>把三个级别的源码并排看一遍，上传防御的演化史就清楚了。</b>"}
],
secview:"上传漏洞的审计口诀：<b>「四问」——① 扩展名校验在哪一层、能不能绕？② 文件名用户可控吗？③ 内容校验做了吗？④ 存储目录能执行 PHP 吗？</b>四问里只要有一个答案是「不安全」，这个上传点就是高危。"
},
{
id:15, title:"反序列化与 PHP 对象注入", stage:"上传与特有漏洞",
intro:"这是 PHP 独有、危害顶级、也最能体现代码审计价值的一类漏洞。<b>它不需要注入 SQL、不需要传文件，只需要一个能被控制的字符串——但可能导致 RCE。</b>",
sections:[
{h:"15.1 序列化与反序列化是什么", code:[
`<?php
class User {
    public $name = 'guest';
    public $role = 'user';
}

$u = new User();
$u->name = 'Alice';
$u->role = 'admin';

// 对象 -> 字符串
$s = serialize($u);
echo $s;
// O:4:"User":2:{s:4:"name";s:5:"Alice";s:4:"role";s:5:"admin";}
// |  |        |
// |  |        +- 有几个属性
// |  +---------- 类名长度和类名
// +------------- O 表示 object

// 字符串 -> 对象（漏洞就出在这一步）
$o = unserialize($s);
echo $o->name;   // Alice

// 关键：这个字符串是可构造的
// 攻击者可以把 role 改成 admin，或者构造出程序里不存在的属性组合`],
note:"<b>序列化字符串是「纯文本」，攻击者可以手写。</b>上面那串里 <code>s:5:\"admin\"</code> 的 <code>5</code> 是字符串长度，手写时要精确。<b>而这就是漏洞的起点：只要程序把用户可控的字符串喂给 <code>unserialize()</code>，攻击者就能控制「对象里属性的值」。</b>"},
{h:"15.2 魔术方法：漏洞的触发点", tbl:[
["魔术方法","什么时候自动执行","攻击者能利用什么"],
["`__construct`","`new` 一个对象时","反序列化<b>不会</b>触发它"],
["`__destruct`","对象被销毁时（脚本结束、unset）","<b>最常用</b>：反序列化结束就会触发"],
["`__wakeup`","`unserialize()` 时","经典入口，很多 CTF 题的起点"],
["`__toString`","对象被当字符串用时","代码 echo 一个对象时触发"],
["`__call`","调用不存在的方法时","可转发到其他类的方法"],
["`__get` / `__set`","读取/写入不可访问属性时","可链到其他属性"],
["`__invoke`","对象被当函数调用时","链式利用"],
["`__sleep`","`serialize()` 时","影响序列化内容"]],
warn:"<b>核心认知：反序列化漏洞不是「unserialize 本身有洞」，而是「程序里那些魔术方法在反序列化时被自动执行，而它们恰好做了危险的事」。</b>比如某个类的 <code>__destruct()</code> 里写着 <code>unlink($this->file)</code>——那么只要能控制反序列化对象里 <code>file</code> 的值，就能删除任意文件。"},
{h:"15.3 POP 链：把魔术方法串起来", p:["单看一个类往往无害，但<b>把多个类的魔术方法首尾相接</b>，就能把「一个可控字符串」变成「一次危险调用」。这条链叫 POP 链（Property-Oriented Programming）。"]},
{code:[
`思路演示（虚构的类，用于理解链条怎么搭）：

class A {
    public $obj;
    function __destruct() {
        echo $this->obj;          // ① 把属性当字符串用 -> 触发 __toString
    }
}

class B {
    public $path;
    function __toString() {
        return file_get_contents($this->path);   // ② 读文件，路径来自属性
    }
}

攻击者构造的 payload（伪代码）：
    $a = new A();
    $a->obj = new B();
    $a->obj->path = '/etc/passwd';
    echo serialize($a);     // 把这个字符串提交给存在反序列化的入口

链条：unserialize -> A::__destruct -> 触发 B::__toString -> 读文件

真实项目里的链条可能跨五六个类，常见终点是：
    文件删除 / 文件写入 / 命令执行 / SQL 执行 / SSRF`],
tip:"<b>找 POP 链的审计方法（也叫「找 gadget」）：</b>① 全局搜 <code>unserialize(</code> 找入口；② 搜所有 <code>__destruct</code> / <code>__wakeup</code> / <code>__toString</code> 看它们做了什么；③ 顺着属性往下找「能触发下一个魔术方法」的赋值；④ 终点通常是文件或命令类函数。<b>框架（Laravel、ThinkPHP）里天然存在大量 gadget，所以「框架版本 + 一个反序列化入口」常常就能 RCE。</b>"},
{h:"15.4 phar 反序列化：不需要 unserialize 也能触发", code:[
`<?php
// phar 是 PHP 的归档文件格式，它的元数据（metadata）是序列化存储的。
// 关键点：很多「文件操作函数」在读取 phar:// 路径时，会自动反序列化元数据！

// 常见的触发函数（不需要显式调用 unserialize）
//   file_exists('phar://a.phar/x')
//   file_get_contents('phar://a.phar/x')
//   getimagesize('phar://a.phar/x')
//   is_file() / stat() / fopen() / md5_file() ...

// 所以攻击链变成：
//   ① 先上传一个恶意 phar 文件（常伪装成图片）
//   ② 再找到任何一处「路径参数可控的文件操作函数」
//   ③ 把路径写成 phar://上传的文件/x  -> 触发反序列化 -> POP 链

// 这意味着：审计时只搜 unserialize 是**不够的**，
// 还要注意 phar:// 这种「隐式反序列化」入口。

// 防御：PHP 8.0 之后 phar 的反序列化行为在部分场景已收紧，
//       但仍是必须检查的点；最稳的是——不反序列化任何不可信数据。`],
warn:"<b>phar 反序列化是审计里最容易漏的一类。</b>很多审计者只搜 <code>unserialize</code>，结果漏掉了「文件操作函数 + phar:// 路径」这条隐式入口。<b>排查方法：搜所有接受路径参数的函数，看能不能传入 <code>phar://</code>。</b>"},
{h:"15.5 修复与审计判断", code:[
`<?php
// 1) 最根本：不要反序列化不可信数据
//    数据交换一律用 JSON：
$data = json_decode($input, true);     // 只产生数组/标量，不产生对象

// 2) 如果必须反序列化，加白名单限制类
$obj = unserialize($input, ['allowed_classes' => ['SafeClass']]);
//    或者完全禁用对象：
$obj = unserialize($input, ['allowed_classes' => false]);

// 3) 签名校验：反序列化前先验 HMAC
if (!hash_equals($expected, hash_hmac('sha256', $data, $key))) { die('数据被篡改'); }

// 审计判断：
//   unserialize($_GET / $_POST / $_COOKIE / $_FILES)  -> 直接判高危
//   unserialize(base64_decode(...))                   -> 更明确的攻击特征
//   unserialize() 出现在 Cookie 解析、缓存读取里       -> 重点看
//   文件操作函数的路径可传 phar://                      -> 隐式反序列化风险`],
tip:"<b>DVWA 没有反序列化模块</b>，所以这一章靠自己写 demo 练习（见「实验」页的实验 9）。<b>反序列化是「PHP 语法」和「PHP 审计」分道扬镳的地方</b>——从这里开始，你靠的不再是「认函数」，而是「读类的结构、追属性流向」。"
}
],
secview:"反序列化的审计动作：<b>① 搜 unserialize 找入口；② 搜魔术方法（__destruct / __wakeup / __toString / __call）看它们做了什么危险操作；③ 顺着属性找链条，直到接上文件或命令函数。</b>再加一条：别忘了 <code>phar://</code> 这种隐式入口。"
},
{
id:16, title:"变量覆盖、SSRF、XXE 与其他", stage:"上传与特有漏洞",
intro:"这一章补齐几类「不常被提起、但真实环境里很好用」的漏洞。<b>它们的共同点是：不靠注入特殊字符，而是利用程序逻辑本身的疏忽。</b>",
sections:[
{h:"16.1 变量覆盖：让攻击者凭空造变量", code:[
`<?php
// 几种「能凭空创建变量」的写法，全是审计重点

// ① extract()：把数组的键变成变量名
$data = $_GET;                 // 用户完全可控
extract($data);
// 传入 ?is_admin=1  -> 凭空生成 $is_admin = 1
if ($is_admin) { echo '你是管理员'; }     // 直接绕过鉴权

// ② parse_str()：解析查询串到当前作用域
parse_str($_SERVER['QUERY_STRING'], $out);   // 安全（结果给了 $out）
parse_str($_SERVER['QUERY_STRING']);         // 危险：不传第二个参数会污染当前作用域

// ③ 可变变量 $$
foreach ($_GET as $k => $v) {
    $$k = $v;                  // 用户能造出任意变量
}

// ④ 老版本的 register_globals（PHP 5.4 已移除，老站才有）
//    直接把 URL 参数变成全局变量：?admin=1 -> $admin = 1`],
note:"<b>变量覆盖的可怕之处在于「它不需要任何特殊字符」。</b>不用引号、不用分号、不用脚本标签——只要参数名对上了，就能覆盖程序里的关键变量（比如 <code>$is_admin</code>、<code>$role</code>、<code>$file</code>）。<b>审计时搜 <code>extract(</code>、<code>parse_str(</code>、<code>$$</code> 这三个模式。</b>"},
{h:"16.2 SSRF：让服务器替你发请求", code:[
`<?php
// 一个「抓取网页」或「加载远程图片」的功能
$url = $_GET['url'];
$content = file_get_contents($url);       // SSRF
// 传入 url=http://127.0.0.1:6379/       -> 访问内网 Redis
// 传入 url=http://169.254.169.254/...   -> 读云主机元数据（拿到临时凭证）
// 传入 url=file:///etc/passwd           -> 读本地文件

// 其他常见触发点
//   curl_exec() / fsockopen() / get_headers() / simplexml_load_file()

// 为什么 SSRF 危险：
//   ① 服务器在内网，能访问你访问不到的内部服务
//   ② 云主机元数据接口可以拿到临时 AK/SK  -> 接管云账号
//   ③ 请求从内网发出，可以穿过防火墙

// 修复：白名单域名 + 禁止内网 IP + 禁止非 http 协议
$allow = ['api.example.com', 'cdn.example.com'];
$host = parse_url($url, PHP_URL_HOST);
if (!in_array($host, $allow, true)) { die('不允许的目标'); }
// 还要解析出真实 IP，检查是否属于内网段：
//   10.0.0.0/8、172.16-31.x、192.168.x、127.x、169.254.x`],
warn:"<b>云环境下 SSRF 的优先级要往前提一档</b>：因为 <code>169.254.169.254</code>（云元数据接口）能直接吐出临时凭证。<b>审计时看到「服务器去请求一个 URL」的功能，一定要问：这个 URL 谁能控制？能不能指向内网？</b>"},
{h:"16.3 XXE：XML 外部实体注入", code:[
`<?php
// 解析 XML 的地方比你想的多：接口、RSS、导入导出、SOAP、SVG 图片
$xml  = $_POST['xml'];
$doc  = simplexml_load_string($xml);       // 默认可能允许外部实体
$doc2 = new DOMDocument();
$doc2->loadXML($xml);                       // 同样要注意

// 攻击者提交的 XML（原理展示）：
//   <?xml version="1.0"?>
//   <!DOCTYPE foo [
//     <!ENTITY xxe SYSTEM "file:///etc/passwd">
//   ]>
//   <foo>&xxe;</foo>
// 实体 &xxe; 会被替换成文件内容 -> 任意文件读取
// 把 file:// 换成 http:// 就是 SSRF；某些环境下还能造成拒绝服务

// 修复：解析前禁用外部实体加载
libxml_disable_entity_loader(true);        // PHP 7 及以前需要显式调用
$doc = new DOMDocument();
$doc->loadXML($xml, LIBXML_NONET);         // 限制网络访问
// PHP 8.0 起 libxml 默认不再加载外部实体，但仍建议显式声明`],
tip:"<b>XXE 在 PHP 里常被忽略</b>，因为「我们不用 XML」是常见误解——实际上海关/支付回调、短信接口、RSS 订阅、Office 文档解析、SVG 头像处理，背后都可能是 XML。<b>审计时搜 <code>simplexml_load_string</code>、<code>DOMDocument</code>、<code>loadXML</code>、<code>xml_parse</code>。</b>"},
{h:"16.4 其他几类值得知道的漏洞", tbl:[
["类型","触发点","危害"],
["任意文件删除","`unlink($_GET['f'])`","删除 .htaccess、安装锁文件 -> 重装站点接管"],
["任意文件下载","`readfile('uploads/'.$_GET['f'])`","下载配置、源码、数据库备份"],
["目录穿越","路径参数带 `../`","读取 Web 根目录之外的文件"],
["条件竞争（上传）","先上传后校验、校验完再移动","竞争窗口内让恶意文件落地"],
["弱类型绕过","`==` 比较（第 3 章）","鉴权、令牌、支付校验被绕"],
["会话固定","登录后不换 Session ID","攻击者预置 ID 后冒充"],
["越权（IDOR）","`?user_id=123` 不校验归属","查看/修改他人数据"],
["逻辑漏洞","优惠券、积分、支付流程","直接造成资金损失"]],
note:"<b>这几类里，越权（IDOR）和逻辑漏洞在真实 SRC 里出现频率最高</b>，但它们很难靠「搜危险函数」发现——必须理解业务逻辑。<b>所以审计不能只有「函数视角」，还要有「业务视角」：这个功能设计上有没有可能被滥用？</b>（第 20 章会讲业务逻辑审计的思路。）"}
],
secview:"这一章的四类漏洞有个共同特点：<b>都没有「明显危险的函数调用」</b>——变量覆盖靠参数名撞车，SSRF 靠「服务器帮你发请求」，XXE 靠 XML 规范本身。<b>这正是审计从「认函数」进阶到「看逻辑」的地方。</b>"
}
];
