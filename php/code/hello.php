<?php
// hello.php —— 第 1-2 章：第一个程序
// 放到虚拟机的 C:\phpstudy\WWW\php\ 下，浏览器访问 http://192.168.11.133/php/hello.php

echo 'Hello, PHP!<br>';

$name = '同学';
echo '欢迎，' . $name . '！<br>';

// 单引号 vs 双引号
echo '单引号（原样输出）：$name<br>';
echo "双引号（解析变量）：$name<br>";

// 变量与类型
$age    = 20;
$height = 1.75;
$isNew  = true;
var_dump($name, $age, $height, $isNew);

// 弱类型演示（第 3 章会细讲它的危险）
echo '<br>弱类型：0 == \'abc\' 的结果是 ';
var_dump(0 == 'abc');

// 环境信息
echo '<br>PHP 版本：' . PHP_VERSION;
// phpinfo();   // 需要时再打开，真实环境里它是信息泄露点
