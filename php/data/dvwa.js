// PHP 学习站 v2 · DVWA 靶场实战手册（8 个模块）
// DVWA 自带 Low / Medium / High / Impossible 四级别，Impossible 就是安全写法
var DVWA = [
{
 title:"第 0 步 · 环境确认与三个设置",
 meta:"难度 ★☆☆　用时 10 分钟　环境：你已有的 DVWA",
 goal:"确认 DVWA 能访问、数据库已初始化、安全级别切到 Low，并找到 View Source 按钮。",
 chapters:"对应课程：第 1 章（环境）",
 steps:["浏览器打开 http://192.168.11.133/DVWA/ ，用 admin / password 登录。",
"左侧菜单点 <b>DVWA Security</b>，级别选 <b>Low</b>，保存。",
"第一次用的话，先到 Setup 页面点 <b>Create / Reset Database</b>。",
"随便进一个模块，页面底部有 <b>View Source</b> 按钮——<b>这是整个手册最重要的按钮</b>，每个模块都要点开看。",
"确认标签页标题里写着 DVWA 版本（你这台是 v1.9）。"],
 code:`访问地址：http://192.168.11.133/DVWA/
默认账号：admin / password
安全级别：DVWA Security -> Low
源码查看：每个模块页面底部的 View Source 按钮

你这台环境的实际情况（已在部署时实测）：
  Apache 2.4.23 (Win32)  PHP 5.4.45  DVWA v1.9
  路径 C:\\phpstudy\\WWW\\DVWA

两条注意事项：
  ① v1.9 用的是老式 mysql_* 函数，所以它必须跑在 PHP 5.x 上。
     不要把 PHP 升到 7 —— 会直接报错，不是装坏了。
  ② 它在 VMware 的 NAT 网络里（192.168.11.x），只有你这台电脑能访问它，
     这是安全的实验配置。不要改成桥接模式，那会把一台可 getshell 的靶机
     暴露到局域网。`,
 expect:["能正常登录 DVWA","DVWA Security 页面显示当前级别是 Low","任意模块底部都能找到 View Source 按钮","标签页标题里能看到 v1.9"],
 why:"DVWA 的设计是「故意有漏洞的练习环境」，它把「漏洞代码」和「修复代码」放在同一个页面里（Low 对 Impossible）。这正是文档式教程最缺的东西——<b>你不是在想象漏洞，而是在看着它运行</b>。",
 warn:"DVWA 只能装在你自己的电脑/虚拟机里，只对你自己的本地环境使用。<b>不要部署到公网，也不要用它去测试任何别人的系统。</b>"
},
{
 title:"认知前提 · 四个级别就是「漏洞 → 修复」的对照",
 meta:"难度 ★☆☆　必读　用时 5 分钟",
 goal:"先建立一张总图，后面每个模块都按这张图来学。",
 chapters:"对应课程：第 10-17 章（这张表就是整门课的实操版）",
 steps:["把下表当成学习地图：每学一个模块，都走完「打 Low → 看源码 → 打 Medium/High → 看源码 → 打 Impossible → 看源码」。",
"<b>打穿不是目的，看懂源码差异才是。</b>能说出「Low 少做了哪一步、Impossible 补上了哪一步」，这个模块才算学会。",
"学到第 18 章（审计方法论）后，再回来把这张表过一遍——你会有完全不同的感受。"],
 code:`DVWA 四个级别对应的防护强度：

  Low         无任何防护，直接拼接 / 直接输出
              对应课程：漏洞为什么能成立（第 10-14 章）

  Medium      加了「看起来有用」的防护，但类型没处理、可被绕过
              对应课程：黑名单不够用、前端校验不算校验（第 3.4、18.4 节）

  High        加了限制（如 LIMIT 1、更多过滤），但仍然是拼接
              对应课程：限制输出不等于防御（第 10 章）

  Impossible  类型校验 + 预处理 / 白名单 / 输出编码 + token 校验
              对应课程：正确写法长什么样（第 17 章）

一句话：Low 是「错在哪」，Impossible 是「对长什么样」。`,
 expect:["你能说清四个级别各自做了什么防护","你能把每个级别对应到课程的具体章节","你不再把「打穿 DVWA」当目标，而是把「讲清源码差异」当目标"],
 why:"很多人打 DVWA 只停留在「Low 能打穿、Impossible 打不动」，然后就结束了。真正的收获在中间那一步：<b>对着两段源码说出「差异在这里」，并解释这个差异为什么能挡住</b>。这才是能迁移到真实代码审计的能力。"
},
{
 title:"模块一 · SQL Injection（对课程第 10 章）",
 meta:"难度 ★★★　用时 35 分钟　环境：DVWA Security = Low",
 goal:"把课程第 10 章的注入原理，在真实靶场上完整打一遍，然后看源码。",
 chapters:"对应课程：第 10 章（SQL 注入的 PHP 原理）",
 steps:["进入 <b>SQL Injection</b> 模块，输入 1 提交，看正常返回。",
"输入 <b>1'</b> → 报语法错误，说明是<b>字符型</b>注入。",
"输入 <b>1' -- </b> → 恢复正常，说明闭合与注释都成立。",
"探列数：<b>1' ORDER BY 1 -- </b>、<b>ORDER BY 2 -- </b>、<b>ORDER BY 3 -- </b>，看哪一步开始报错。",
"找回显位：<b>1' UNION SELECT 1,2 -- </b>，记住数字出现在页面哪个位置。",
"把回显位换成 <b>database()</b> 和 <b>version()</b>，确认库名。",
"拖数据：<b>1' UNION SELECT user, password FROM users -- </b>，拿到用户名和哈希。",
"<b>点 View Source</b>，找到构造 SQL 的那一行，看它是怎么拼的。",
"切到 <b>Impossible</b>，重复上面的 payload，确认全部失效，再看源码差异。"],
 code:`DVWA SQL Injection 的输入框填这些（Low 级别）：

  1
  1'
  1' -- 
  1' ORDER BY 1 -- 
  1' ORDER BY 2 -- 
  1' ORDER BY 3 -- 
  1' UNION SELECT 1,2 -- 
  1' UNION SELECT database(), version() -- 
  1' UNION SELECT user, password FROM users -- 

Low 的源码（v1.9，大意）：
  $id = $_REQUEST[ 'id' ];
  $getid = "SELECT first_name, last_name FROM users WHERE user_id = '$id';";
  $result = mysql_query( $getid ) or die( '<pre>' . mysql_error() . '</pre>' );
  // 三个致命点：
  //   ① 输入直接拼进 SQL
  //   ② 用 $_REQUEST 接收（GET/POST 都收）
  //   ③ 出错时把 mysql_error() 打印到页面上 —— 报错注入的温床

Impossible 的源码（大意）：
  if( is_numeric( $id ) ) { $id = intval( $id ); }     // 类型校验 + 强转
  $data = $db->prepare( '... WHERE user_id = (:id) LIMIT 1;' );
  $data->bindParam( ':id', $id, PDO::PARAM_INT );      // 参数绑定
  // 外加 user_token 校验（防 CSRF）

Medium 的做法（体会「看起来有用」的防护）：
  $id = mysql_real_escape_string( $id );
  $getid = "... WHERE user_id = $id;";
  // 变量没被引号包住 -> 数字型注入 -> 转义函数形同虚设
  // 而且输入变成了下拉框（前端限制，改包就能绕）`,
 expect:["输入 1 正常返回 first name / surname","输入 1' 报 SQL 语法错误","ORDER BY 3 开始报错（据此推断出列数）","UNION SELECT 1,2 时页面上能看到数字 1 和 2","能拿到 users 表的用户名与 32 位哈希","Impossible 级别下所有 payload 都失效"],
 undo:["DVWA 首页 Setup 可以 Reset Database"],
 warn:"<b>只在你自己的 DVWA 上做。</b>同一套 payload 打到真实网站就是非法入侵——不管有没有造成损失。",
 why:"这一步把课程第 10 章的每个结论都变成了可验证的事实：<b>为什么预处理能防住、为什么转义不够、为什么 LIMIT 1 挡不住</b>——你对着 Low 和 Impossible 两段源码就能全部讲清楚。"
},
{
 title:"模块二 · File Inclusion（对课程第 11 章）",
 meta:"难度 ★★★　用时 30 分钟　环境：DVWA Security = Low",
 goal:"复现 LFI，用 php://filter 读源码，并看清白名单为什么是唯一正解。",
 chapters:"对应课程：第 11 章（文件包含）",
 steps:["进入 <b>File Inclusion</b> 模块，观察 URL 里的 <b>?page=</b> 参数。",
"把 page 改成系统文件路径（用 ../ 往上跳），看页面输出文件内容。",
"直接包含一个 .php 文件会被执行、看不到源码，所以改用 <b>php://filter</b>。",
"把 page 改成 <code>php://filter/convert.base64-encode/resource=index.php</code>，看输出的 base64。",
"复制那段 base64 去解码，你会看到页面源码——<b>这就是 LFI 读源码</b>。",
"点 View Source 对比 Low 与 Impossible：Low 是 include $_GET['page']，Impossible 是白名单数组映射。",
"切到 Impossible，重复上面的 payload，确认失效。"],
 code:`URL 里改 ?page= 的值（Low 级别）：

  正常：   ?page=file1.php
  读系统： ?page=../../../../Windows/win.ini
  读源码： ?page=php://filter/convert.base64-encode/resource=index.php
           ↑ 直接 include .php 会被执行看不到源码，
             用流过滤器就能把文件当「数据」读出来

Low 的源码（大意）：
  $file = $_GET[ 'page' ];
  include( $file );          // 完全可控 -> LFI（若允许 URL 还可 RFI）

Impossible 的源码（大意）：
  $file = $_GET[ 'page' ];
  switch( $file ) {
      case "file1.php": include( $file ); break;
      case "file2.php": include( $file ); break;
      default:          include( "file1.php" );
  }
  // 白名单 switch —— 用户输入只能落在枚举值里，没有绕过空间`,
 expect:["正常 page 值能显示页面","用 ../ 能读到系统文件","php://filter 输出一长串 base64，解码后是源码","Impossible 级别下，任意 page 值都只会进入白名单内的文件"],
 undo:["无需回滚（都是读操作）"],
 why:"<b>LFI 最值钱的用法是读源码</b>：读到 config 就拿到数据库口令，读到源码才能做代码审计。<b>而修复上，「过滤 ../」永远不如「白名单映射」——这个模块的两个级别正是这两种思路的对照。</b>"
},
{
 title:"模块三 · XSS（对课程第 12 章）",
 meta:"难度 ★★★　用时 35 分钟　环境：DVWA Security = Low",
 goal:"把反射型、存储型、DOM 型三种 XSS 都打一遍，并看清输出编码的四种上下文。",
 chapters:"对应课程：第 12 章（XSS 的 PHP 原理）",
 steps:["先做 <b>XSS (Reflected)</b>：在输入框提交带脚本的内容，看它反射回页面并执行。",
"再做 <b>XSS (Stored)</b>：提交一条带脚本的留言，然后刷新页面——脚本会一直留在页面里。",
"最后做 <b>XSS (DOM)</b>：它的 payload 在 URL 里（如 <code>?default=</code>），<b>后端代码里看不到任何痕迹</b>。",
"对比这三种：反射型只影响一次点击，存储型影响所有访问者，DOM 型只在前端流转。",
"点 View Source 看 Low 的写法（echo 未编码）与 Impossible 的写法（htmlspecialchars）。",
"切到 Impossible，重复上面的 payload，确认脚本变成纯文本而不是执行。"],
 code:`三种 XSS 的 payload（Low 级别）：

  反射型 XSS (Reflected)：
    输入框填：<script>alert('xss')</script>
    也可试：<img src=x onerror=alert(1)>

  存储型 XSS (Stored)：
    留言框填：<script>alert('stored')</script>
    提交后刷新页面 —— 每次都执行

  DOM 型 XSS (DOM)：
    URL 参数里改，如 ?default=<script>alert(1)</script>
    特点：后端代码里找不到任何处理逻辑，payload 全程在浏览器里

Low 的源码（大意）：
  $name = $_GET[ 'name' ];
  echo "<pre>Hello {$name}</pre>";           // 未编码，直接输出

Impossible 的源码（大意）：
  $name = htmlspecialchars( $_GET[ 'name' ] );   // 输出编码
  echo "<pre>Hello {$name}</pre>";
  // 注意：DOM 型在 Impossible 里是改用白名单语言选择，而不是编码

四种输出上下文对应的编码（课程第 12.2 节）：
  HTML 正文 -> htmlspecialchars($s, ENT_QUOTES, 'UTF-8')
  HTML 属性 -> 同上，且属性值必须加引号
  JavaScript -> json_encode($s, JSON_HEX_TAG | JSON_HEX_AMP)
  URL 参数   -> urlencode($s)`,
 expect:["反射型：提交后立即弹窗","存储型：提交后刷新页面仍然弹窗（说明存进了数据库）","DOM 型：后端源码里看不到处理逻辑","Impossible 级别下，脚本内容被显示成纯文本而不是执行"],
 undo:["DVWA 首页 Setup -> Reset Database（清掉存储型 XSS 的留言）"],
 warn:"<b>只在自己的 DVWA 上练。</b>XSS 打在真实站点上同样是违法行为，且存储型 XSS 会影响到其他真实用户。",
 why:"三种 XSS 的差别在这里一目了然：<b>反射型需要诱导点击、存储型影响所有人、DOM 型连后端都不经过</b>。而修复手段的差别也在源码里——反射型和存储型都是输出编码，DOM 型则是前端逻辑要改。"
},
{
 title:"模块四 · Command Injection（对课程第 13 章）",
 meta:"难度 ★★★　用时 25 分钟　环境：DVWA Security = Low",
 goal:"复现命令注入，理解「白名单优于转义」这个结论。",
 chapters:"对应课程：第 13 章（命令执行）",
 steps:["进入 <b>Command Injection</b> 模块，输入 127.0.0.1 提交，看 ping 结果。",
"输入 <b>127.0.0.1 & whoami</b>，看命令是否被执行。",
"（Windows 环境用 & 或 &&；也可以试 | 管道）",
"看 Low 的源码：<code>shell_exec( 'ping ' . $target )</code> —— 直接拼接。",
"切到 <b>Impossible</b>，重复上面的 payload，确认失效。",
"看 Impossible 的源码：它用 <b>explode 拆成数组</b>，再逐个检查每个部分是否只由数字和点组成。",
"对比两种修复：Impossible 没有用转义函数，而是用了<b>白名单式的格式校验</b>。"],
 code:`DVWA Command Injection 的输入框（Low 级别）：

  127.0.0.1
  127.0.0.1 & whoami
  127.0.0.1 | whoami
  127.0.0.1 & ping -n 4 127.0.0.1      （用延时确认无回显的情况）

Low 的源码（大意）：
  $target = $_REQUEST[ 'ip' ];
  if( stristr( php_uname( 's' ), 'Windows' ) )
      $cmd = shell_exec( 'ping  ' . $target );
  // 直接拼接用户输入 -> 命令注入

Impossible 的源码（大意）：
  $target = $_REQUEST[ 'ip' ];
  $octet = explode( '.', $target );          // 拆成 4 段
  if( sizeof( $octet ) == 4 &&
      is_numeric($octet[0]) && is_numeric($octet[1]) &&
      is_numeric($octet[2]) && is_numeric($octet[3]) ) {
      $target = $octet[0].'.'.$octet[1].'.'.$octet[2].'.'.$octet[3];
      $cmd = shell_exec( 'ping  ' . $target );   // 此时 target 必然是纯数字
  } else {
      echo 'ERROR: You have entered an invalid IP.';
  }
  // 注意：它没有用 escapeshellarg，而是用「格式白名单」——这就是结论的来源`,
 expect:["输入 IP 能看到 ping 结果","加 & whoami 后能看到当前用户名（注入成立）","Impossible 级别下，带 & 的输入直接被拒绝","能说出 Impossible 用的是「分段 + 格式校验」而不是转义函数"],
 undo:["无需回滚（都是执行命令，不落文件）"],
 why:"这个模块最能体现审计的判断力：<b>Impossible 版并没有用 escapeshellarg，而是用「白名单式格式校验」挡住了注入。</b>这正是课程第 13 章说的「白名单 &gt; 转义」——你在源码里看到了这个结论的实物。"
},
{
 title:"模块五 · File Upload（对课程第 14 章）",
 meta:"难度 ★★★　用时 30 分钟　环境：DVWA Security = Low",
 goal:"亲手传上去一个能执行的 PHP 文件，然后看四个级别是怎么逐层加防护的。",
 chapters:"对应课程：第 14 章（文件上传与 WebShell）",
 steps:["准备一个最小 PHP 文件（内容能输出一行字即可），准备两个版本：一个叫 shell.php，一个叫 shell.php.jpg。",
"<b>Low</b> 级别：直接传 shell.php，成功后页面上会给出文件路径。",
"访问那个路径，看到 PHP 执行的输出——<b>这就是上传 getshell 的完整链路</b>。",
"切 <b>Medium</b>：直接传 .php 会被拒，试改 Content-Type 或在文件名上做文章。",
"切 <b>High</b>：扩展名和图片内容都校验了，这时可以思考「图片马 + 配合文件包含」的组合（课程第 23 章）。",
"切 <b>Impossible</b>：看源码，它对文件名做了重命名、对内容做了重新编码，攻击面基本消失。",
"看 View Source 对比三个版本的校验逻辑差异。"],
 code:`准备一个测试文件（只做验证用）：

  shell.php 的内容：
    <?php echo 'uploaded and executed'; ?>

  shell.php.jpg 的内容：同上（用来理解双扩展名与解析顺序）

Low 级别的源码（大意）：
  $target_path = DVWA_WEB_PAGE_TO_ROOT . "hackable/uploads/";
  $target_path = $target_path . basename( $_FILES[ 'uploaded' ][ 'name' ] );
  move_uploaded_file( $_FILES[ 'uploaded' ][ 'tmp_name' ], $target_path );
  // 文件名完全用用户的，无任何校验 -> 传什么是什么

Medium 的源码（大意）：
  if( ( $uploaded_type == "image/jpeg" || $uploaded_type == "image/png" ) &&
      ( $uploaded_size < 100000 ) ) {
      // 只看 Content-Type 和大小 —— 都是客户端可伪造的

High 的源码（大意）：
  // 校验扩展名 + getimagesize，还会做一次图片重绘
  // 但历史版本仍存在配合文件包含利用的可能

Impossible 的源码（大意）：
  // 用 getimagesize 校验真实类型 + 强制重命名 + 重新编码图片
  // 用户完全无法控制文件名与执行内容`,
 expect:["Low 级别能直接上传 .php 并访问执行","Medium 级别直接传会被拒，但改 Content-Type 可绕过","High 级别扩展名与内容都校验","Impossible 级别基本无法上传可执行文件","能说出「上传目录能否解析 PHP」这一层为什么关键"],
 undo:["删除上传的文件；或 DVWA Setup 重置"],
 warn:"<b>只在自己的 DVWA 上做。</b>上传 Webshell 到真实服务器是严重违法行为。这里演示的目的是让你理解防御——以及为什么「上传目录禁止解析 PHP」是最救命的一层。",
 why:"上传漏洞的四个级别几乎是「上传防御演化史」：<b>不校验 → 只看类型 → 看扩展名和内容 → 重命名加重新编码</b>。看完这条演化线，你在审计上传功能时的判断会快很多。"
},
{
 title:"模块六 · 会话类模块 + 全级别复测（对课程第 17 章）",
 meta:"难度 ★★★　用时 35 分钟　环境：DVWA Security 逐级切换",
 goal:"补齐会话相关的模块，并把前面五个模块在 Impossible 级别全部复测一遍，填出完整对照表。",
 chapters:"对应课程：第 17 章（会话与认证）、第 18 章（审计方法论）",
 steps:["进入 <b>Weak Session IDs</b> 模块，反复点生成按钮，观察 DVWA 生成的会话 ID 有什么规律。",
"看 Low 的源码：它用 <code>dvwaSession = ++dvwaSession;</code> 这种可预测的自增值——攻击者能猜出别人的 ID。",
"对比 Impossible 的源码：用随机数生成，不可预测。",
"进入 <b>Brute Force</b> 模块，尝试几次错误登录，观察有没有失败次数限制。",
"接下来做<b>总复测</b>：把五个漏洞模块（SQLi / LFI / XSS / RCE / Upload）依次切到 Impossible，把之前用过的 payload 全部重打一遍。",
"把结果填进下面的对照表——<b>这份表就是你的作品</b>。"],
 code:`Weak Session IDs 的观察方式：

  Low   ：dvwaSession 每次 +1（可预测，能猜出别人的会话）
  Impossible：使用随机值，不可预测

Brute Force 的观察方式：

  Low   ：无限次尝试，没有任何限制
  Medium：错一次延迟 2 秒（能绕过）
  High  ：错三次延迟 1 秒 + 随机延迟
  Impossible：锁定账号 + 失败计数存数据库

总复测对照表（自己填）：

  模块     | Low 的结果                | Impossible 的结果 | 修复手段            | 课程章节
  ---------|---------------------------|-------------------|---------------------|---------
  SQLi     |                           |                   |                     | 第 10 章
  LFI      |                           |                   |                     | 第 11 章
  XSS      |                           |                   |                     | 第 12 章
  RCE      |                           |                   |                     | 第 13 章
  Upload   |                           |                   |                     | 第 14 章

填表的三个要求：
  ① Low 的结果写「你实际观察到的现象」
  ② 修复手段写「源码里的具体做法」，不要写「加了校验」这种笼统的话
  ③ 对不上的地方回去看 View Source`,
 expect:["能看出 Weak Session IDs 在 Low 级别是可预测的自增值","能说出 Impossible 版用的是随机值","五个模块在 Impossible 下全部无法利用","对照表填满 5 行，每行都有具体的修复手段","能对着任意一行说出「为什么这个修复能挡住刚才的 payload」"],
 undo:["DVWA Setup -> Reset Database"],
 tip:"<b>这份对照表是整门课最有价值的产出。</b>它把「攻击」和「防御」放在同一页上，你既能证明漏洞真实存在，也能证明修复真实有效——<b>这正是做安全的日常工作方式：先证明能打穿，再证明修好了。</b>",
 why:"学完 DVWA 的六个模块，你已经把课程第 10-14 章全部实操过一遍：注入、文件包含、XSS、命令执行、上传、会话。<b>接下来第 18-24 章讲的是「怎么系统性审计」和「怎么交付报告」——那些要在真实项目上练（实验 10、11）。</b>"
}
];
