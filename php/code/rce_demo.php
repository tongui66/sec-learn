<?php
// rce_demo.php —— 第 13 章：命令执行漏洞
//
// ⚠️ 漏洞示例，只用于本地学习。命令注入在真实系统上成立 = 服务器被控制。
//
// 访问方式（Windows 环境，ping 用 -n）：
//   正常：  ?ip=127.0.0.1
//   注入：  ?ip=127.0.0.1 & whoami
//   延时：  ?ip=127.0.0.1 & ping -n 6 127.0.0.1
//
// 把下面的 MODE 改成 safe 就是修复版。

define('MODE', 'vuln');          // vuln（漏洞版） / escape（只转义） / safe（白名单）

$ip = $_GET['ip'] ?? '127.0.0.1';
$isWindows = stripos(PHP_OS, 'WIN') === 0;
$pingFlag = $isWindows ? '-n 2' : '-c 2';

echo '<h3>当前模式：' . MODE . '</h3>';

if (MODE === 'vuln') {
    // ❌ 漏洞版：直接拼接
    $cmd = 'ping ' . $pingFlag . ' ' . $ip;
    echo '<p style="color:red">执行命令：<code>' . htmlspecialchars($cmd, ENT_QUOTES, 'UTF-8') . '</code></p>';
    echo '<pre>';
    system($cmd);
    echo '</pre>';
} elseif (MODE === 'escape') {
    // ⚠️ 只转义：能挡住「作为参数」的注入，但挡不住「输入被拼进命令本身」
    $cmd = 'ping ' . $pingFlag . ' ' . escapeshellarg($ip);
    echo '<p style="color:orange">只做转义：<code>' . htmlspecialchars($cmd, ENT_QUOTES, 'UTF-8') . '</code></p>';
    echo '<pre>';
    system($cmd);
    echo '</pre>';
} else {
    // ✅ 白名单：先校验格式，再决定要不要执行
    if (!filter_var($ip, FILTER_VALIDATE_IP)) {
        die('<p style="color:green">参数必须是合法 IP，已拒绝：'
            . htmlspecialchars($ip, ENT_QUOTES, 'UTF-8') . '</p>');
    }
    $cmd = 'ping ' . $pingFlag . ' ' . escapeshellarg($ip);
    echo '<p style="color:green">白名单校验通过：<code>' . htmlspecialchars($cmd, ENT_QUOTES, 'UTF-8') . '</code></p>';
    echo '<pre>';
    system($cmd);
    echo '</pre>';
}

echo '<hr><p>三种模式的差别：<b>拼接（可注入） &lt; 只转义（部分场景失效） &lt; 白名单（安全）</b>。</p>';
