<?php
// lfi_demo.php —— 第 11 章：文件包含漏洞（LFI）
//
// ⚠️ 漏洞示例，只用于本地学习。
//
// 访问方式：
//   正常：  ?page=home
//   读系统：?page=../../../../Windows/win.ini
//   读源码：?page=php://filter/convert.base64-encode/resource=config
//           ↑ 拿到一串 base64，用 CyberChef 解码就是 config.php 的源码
//
// 把下面的 USE_WHITELIST 改成 true 就是修复版，上面的 payload 会全部失效。

define('USE_WHITELIST', false);

$page = $_GET['page'] ?? 'home';

if (USE_WHITELIST) {
    // ✅ 修复版：白名单映射（用户输入只用来选键）
    $allow = [
        'home'  => __DIR__ . '/pages_home.php',
        'about' => __DIR__ . '/pages_about.php',
    ];
    if (!array_key_exists($page, $allow)) { $page = 'home'; }
    $file = $allow[$page];
    echo '<p style="color:green">【修复版】白名单映射</p>';
} else {
    // ❌ 漏洞版：把用户输入拼进包含路径
    $file = __DIR__ . '/' . $page . '.php';
    echo '<p style="color:red">【漏洞版】正在包含：'
       . htmlspecialchars($page, ENT_QUOTES, 'UTF-8') . '</p>';
}

// 为了演示，先造两个正常的页面文件
foreach (['pages_home' => '首页', 'pages_about' => '关于我们'] as $name => $title) {
    $p = __DIR__ . '/' . $name . '.php';
    if (!file_exists($p)) { file_put_contents($p, "<?php echo '<h2>$title</h2>';"); }
}

if (!file_exists($file)) {
    echo '文件不存在：' . htmlspecialchars($file, ENT_QUOTES, 'UTF-8');
    exit;
}

include $file;      // ← 危险点在这里

echo '<hr><p>试试：<code>?page=php://filter/convert.base64-encode/resource=config</code></p>';
