<?php
// unsafe_query.php —— 第 10 章：SQL 注入的漏洞写法
//
// ⚠️ 这是故意写出来的漏洞示例，只用于本地学习与审计练习。
//    它演示「把用户输入拼进 SQL」会发生什么。
//
// 访问方式（先跑过 setup.sql 建库）：
//   正常：  http://192.168.11.133/php/unsafe_query.php?id=1
//   全表：  http://192.168.11.133/php/unsafe_query.php?id=1 OR 1=1
//   联合：  http://192.168.11.133/php/unsafe_query.php?id=1 UNION SELECT 1,username,password,4 FROM users

require __DIR__ . '/db.php';
$pdo = db_pdo();

$id = $_GET['id'] ?? '1';

// ❌ 漏洞点：直接把用户输入拼进 SQL 字符串
$sql = "SELECT id, username, password, role FROM users WHERE id = " . $id;

echo '<h3>实际执行的 SQL</h3>';
echo '<pre>' . htmlspecialchars($sql, ENT_QUOTES, 'UTF-8') . '</pre>';

echo '<h3>查询结果</h3>';
try {
    $rows = $pdo->query($sql)->fetchAll();
    if (!$rows) {
        echo '没有结果';
    }
    foreach ($rows as $row) {
        // 注意：这里的输出做了编码，是为了不让它同时成为 XSS 演示
        echo htmlspecialchars($row['id'] . ' | ' . $row['username'] . ' | '
             . $row['password'] . ' | ' . $row['role'], ENT_QUOTES, 'UTF-8') . '<br>';
    }
} catch (PDOException $e) {
    // 生产环境不该这样输出，这里是为了让你看到报错
    echo '报错：' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8');
}

echo '<hr><p>对照：把 <code>unsafe_query.php</code> 换成 <code>safe_query.php</code>，'
   . '同样的 payload 就失效了。</p>';
