<?php
// file_read.php —— 第 8、11 章：任意文件读取与目录穿越
//
// ⚠️ 漏洞示例，只用于本地学习。
//
// 访问方式：
//   正常：  ?f=note.txt
//   穿越：  ?f=../../Windows/win.ini
//   读源码：?f=..%2Fconfig.php  （注意 config.php 若是 return 数组，需要配合 LFI 的 filter 读）
//
// 想对比修复效果，把下面的 USE_WHITELIST 改成 true 再访问同样的 URL。

define('USE_WHITELIST', false);      // ← 改成 true 就是修复版
define('BASE_DIR', __DIR__ . '/data/');

// 准备一个演示文件
if (!is_dir(__DIR__ . '/data')) { mkdir(__DIR__ . '/data'); }
if (!file_exists(BASE_DIR . 'note.txt')) {
    file_put_contents(BASE_DIR . 'note.txt', "这是 data 目录里的一个演示文件。\n试试用 ../ 跳到别的目录看看。\n");
}

$f = $_GET['f'] ?? 'note.txt';

if (USE_WHITELIST) {
    // ✅ 修复版：白名单映射
    $allow = ['note' => 'note.txt'];
    $key = 'note';
    $path = BASE_DIR . $allow[$key];      // 用户输入只用来选键，不拼路径
    echo '<p style="color:green">【修复版】只允许读取白名单内的文件</p>';
} else {
    // ❌ 漏洞版：直接拼接用户输入
    $path = BASE_DIR . $f;
    echo '<p style="color:red">【漏洞版】路径直接拼接用户输入</p>';
}

echo '<p>实际读取的路径：<code>' . htmlspecialchars($path, ENT_QUOTES, 'UTF-8') . '</code></p>';

if (!file_exists($path)) {
    echo '文件不存在';
    exit;
}

echo '<pre>' . htmlspecialchars(file_get_contents($path), ENT_QUOTES, 'UTF-8') . '</pre>';

echo '<hr><p>尝试：<code>?f=../../Windows/win.ini</code>、<code>?f=../config.php</code></p>';
