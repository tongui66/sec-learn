<?php
// safe_query.php —— 第 10 章：SQL 注入的安全写法（预处理）
//
// 访问方式：
//   正常：  http://192.168.11.133/php/safe_query.php?id=1
//   攻击：  http://192.168.11.133/php/safe_query.php?id=1 OR 1=1
//   —— 第二句不会返回全表，而是被当成「一个不存在的 ID」去查

require __DIR__ . '/db.php';
$pdo = db_pdo();

$id = $_GET['id'] ?? '1';

// ✅ 第 1 步：先做类型校验（不是数字直接拒绝）
if (!ctype_digit((string)$id)) {
    die('参数必须是数字。你传的是：' . htmlspecialchars($id, ENT_QUOTES, 'UTF-8'));
}

// ✅ 第 2 步：预处理 + 参数绑定
$stmt = $pdo->prepare('SELECT id, username, role, email FROM users WHERE id = ?');
$stmt->execute([$id]);          // 参数以「值」的身份传入，无法改写结构

echo '<h3>实际执行的 SQL</h3>';
echo '<pre>SELECT id, username, role, email FROM users WHERE id = ?'
   . "\n-- 参数：" . htmlspecialchars($id, ENT_QUOTES, 'UTF-8') . '</pre>';

echo '<h3>查询结果</h3>';
$rows = $stmt->fetchAll();
if (!$rows) { echo '没有结果'; }
foreach ($rows as $row) {
    // 输出同样要编码（防 XSS）
    echo htmlspecialchars($row['id'] . ' | ' . $row['username'] . ' | '
         . $row['role'] . ' | ' . $row['email'], ENT_QUOTES, 'UTF-8') . '<br>';
}

// 安全写法的三个要点（也是审计时的判断标准）：
//   ① 类型校验：把不符合格式的输入直接拒掉
//   ② 预处理：结构先编译，参数只能当值
//   ③ 输出编码：防止库里的数据变成 XSS
