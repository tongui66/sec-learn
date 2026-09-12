<?php
// login.php —— 第 7 章：表单处理（教学演示）
// 先访问 form.html 提交表单到这里，或直接用 ?username=x&password=y 访问

// 正确取值姿势：用 ?? 处理未传参的情况
$user = $_POST['username'] ?? '';
$pass = $_POST['password'] ?? '';

if ($user === '' || $pass === '') {
    echo '请从 <a href="form.html">表单页</a> 提交，或带上 username 和 password 参数。';
    exit;
}

// ⚠️ 教学提示：这里直接把用户输入回显到页面
// 如果提交 <script>alert(1)</script>，它会被浏览器执行 —— 这是反射型 XSS 的雏形
// 安全做法（第 12 章）：
//   echo '你输入的用户名是：' . htmlspecialchars($user, ENT_QUOTES, 'UTF-8') . '<br>';
echo '你输入的用户名是：' . $user . '<br>';
echo '密码长度：' . strlen($pass) . ' 位<br>';

// 正确的输出编码写法（对比用）
echo '<br>【安全版的输出】' . htmlspecialchars($user, ENT_QUOTES, 'UTF-8') . '<br>';

echo '<br>（教学示例：真实登录逻辑应该查数据库并用 password_verify 校验，见第 17 章）';
