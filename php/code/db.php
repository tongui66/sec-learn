<?php
// db.php —— 第 9 章：数据库连接的两种写法
// 供其他示例文件复用

$cfg = require __DIR__ . '/config.php';

// ── 方式一：mysqli（老项目常见）──
function db_mysqli() {
    global $cfg;
    $conn = mysqli_connect($cfg['db_host'], $cfg['db_user'], $cfg['db_pass'], $cfg['db_name']);
    if (!$conn) {
        die('连接失败：' . mysqli_connect_error());
    }
    mysqli_set_charset($conn, 'utf8mb4');
    return $conn;
}

// ── 方式二：PDO（推荐）──
function db_pdo() {
    global $cfg;
    $dsn = "mysql:host={$cfg['db_host']};dbname={$cfg['db_name']};charset={$cfg['db_charset']}";
    try {
        return new PDO($dsn, $cfg['db_user'], $cfg['db_pass'], [
            PDO::ATTR_ERRMODE          => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,   // 真正的服务端预处理
        ]);
    } catch (PDOException $e) {
        // 注意：生产环境不要把 $e->getMessage() 输出到页面（信息泄露）
        die('数据库连接失败，请检查 config.php');
    }
}
