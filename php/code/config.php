<?php
// config.php —— 第 9 章：配置文件（审计时最值钱的文件）
// 注意：真实项目里这个文件应该放在 Web 根目录之外！
//       这里放在同目录只是为了教学演示。

return [
    'db_host' => 'localhost',
    'db_user' => 'root',
    'db_pass' => '',              // phpStudy 默认空密码
    'db_name' => 'test',
    'db_charset' => 'utf8mb4',
];

// 审计要点：
//   ① 这个文件里有数据库账号密码 —— 所以 LFI、备份文件泄露、.git 泄露都盯着它
//   ② 真实项目里应该放在 Web 根目录之外，并且权限收紧
//   ③ 数据库账号应该是最小权限账号，而不是 root（第 20 章）
