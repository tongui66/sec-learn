<?php
// xss_demo.php —— 第 12 章：XSS 的两种输出对照
//
// ⚠️ 漏洞示例，只用于本地学习。
//
// 访问方式：
//   正常：  ?name=Alice
//   攻击：  ?name=<script>alert(1)</script>
//
// 同一段输入，上面是「未编码输出」（会执行），下面是「编码输出」（显示成文本）。

require __DIR__ . '/db.php';

$name = $_GET['name'] ?? 'Alice';

echo '<h3>用户提交的内容</h3>';
echo '<pre>' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</pre>';

echo '<h3 style="color:red">① 未编码输出（漏洞）</h3>';
echo '<div>你好，' . $name . '！</div>';      // ❌ 会执行脚本

echo '<h3 style="color:green">② 编码输出（正确）</h3>';
echo '<div>你好，' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '！</div>';   // ✅

echo '<hr><h3>存储型 XSS 演示区</h3>';

// 把留言存库，再原样输出（存储型 XSS）
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $content = $_POST['content'] ?? '';
    $stmt = $pdo->prepare('INSERT INTO guestbook (content) VALUES (?)');
    $stmt->execute([$content]);
    echo '<p>留言已保存（数据入库是安全的，问题出在输出环节）</p>';
}

echo '<form method="POST"><textarea name="content" rows="3" cols="50"></textarea><br><button>提交留言</button></form>';
echo '<h4 style="color:red">留言列表（未编码输出 —— 存储型 XSS）</h4>';
foreach ($pdo->query('SELECT content, created_at FROM guestbook ORDER BY id DESC LIMIT 10') as $row) {
    echo '<div>· ' . $row['content'] . ' <small>' . $row['created_at'] . '</small></div>';
}

echo '<h4 style="color:green">同样的数据，编码后输出（正确）</h4>';
foreach ($pdo->query('SELECT content FROM guestbook ORDER BY id DESC LIMIT 10') as $row) {
    echo '<div>· ' . htmlspecialchars($row['content'], ENT_QUOTES, 'UTF-8') . '</div>';
}
?>
<div>
<h5>提交的请求头 <?= htmlspecialchars($_SERVER['REQUEST_METHOD'] ?? '', ENT_QUOTES, 'UTF-8') ?> 由 PHP 原生取出，示例到此结束。</h5>
</div>
