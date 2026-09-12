<?php
// upload_demo.php —— 第 14 章：文件上传的四个级别
//
// ⚠️ 漏洞示例，只用于本地学习。
//
// 用法：把下面的 LEVEL 依次改成 1/2/3/4，每次上传同一个文件，观察结果：
//   LEVEL 1：不校验            -> 传 shell.php 直接成功（危险）
//   LEVEL 2：只查 MIME 类型     -> 抓包改 Content-Type 可绕
//   LEVEL 3：查扩展名白名单     -> .php 被拒，但仍是用户文件名
//   LEVEL 4：五层防护          -> 白名单 + 内容校验 + 随机重命名

define('LEVEL', 1);
define('UPLOAD_DIR', __DIR__ . '/uploads/');

if (!is_dir(UPLOAD_DIR)) { mkdir(UPLOAD_DIR, 0755, true); }

$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['f'])) {
    $f = $_FILES['f'];
    if ($f['error'] !== UPLOAD_ERR_OK) {
        $msg = '上传失败，错误码：' . $f['error'];
    } else {
        $name = $f['name'];
        $tmp  = $f['tmp_name'];

        if (LEVEL === 1) {
            // ❌ 完全不校验，且文件名可控
            $target = UPLOAD_DIR . $name;
            move_uploaded_file($tmp, $target);
            $msg = '【LEVEL 1 无校验】已保存到：uploads/' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        } elseif (LEVEL === 2) {
            // ⚠️ 只信客户端声明的 MIME（可伪造）
            if ($f['type'] !== 'image/jpeg' && $f['type'] !== 'image/png') {
                $msg = '【LEVEL 2】类型不允许：' . htmlspecialchars($f['type'], ENT_QUOTES, 'UTF-8');
            } else {
                move_uploaded_file($tmp, UPLOAD_DIR . $name);
                $msg = '【LEVEL 2 只看 MIME】已保存：' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8')
                     . '（抓包把 Content-Type 改成 image/jpeg 就能绕过）';
            }
        } elseif (LEVEL === 3) {
            // ⚠️ 扩展名白名单，但文件名仍由用户控制
            $allow = ['jpg', 'jpeg', 'png', 'gif'];
            $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
            if (!in_array($ext, $allow, true)) {
                $msg = '【LEVEL 3】扩展名不允许：' . htmlspecialchars($ext, ENT_QUOTES, 'UTF-8');
            } else {
                move_uploaded_file($tmp, UPLOAD_DIR . $name);
                $msg = '【LEVEL 3 白名单】已保存：' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8')
                     . '（文件名仍可控，注意目录是否可解析）';
            }
        } else {
            // ✅ 五层防护
            $allow = ['jpg', 'jpeg', 'png', 'gif'];
            $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
            if (!in_array($ext, $allow, true)) {
                $msg = '【LEVEL 4】扩展名不允许';
            } elseif (!@getimagesize($tmp)) {
                $msg = '【LEVEL 4】不是有效图片（内容校验不通过）';
            } elseif (!is_uploaded_file($tmp)) {
                $msg = '【LEVEL 4】非法上传来源';
            } else {
                $new = bin2hex(random_bytes(16)) . '.' . $ext;
                move_uploaded_file($tmp, UPLOAD_DIR . $new);
                $msg = '【LEVEL 4 五层防护】已随机重命名保存：' . htmlspecialchars($new, ENT_QUOTES, 'UTF-8');
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><title>文件上传演示</title></head>
<body>
<h2>文件上传演示（当前 LEVEL = <?= LEVEL ?>）</h2>
<p style="color:#b00">警告：这是故意有漏洞的示例，只在你自己的虚拟机里用。</p>
<?php if ($msg): ?><p><b><?= $msg ?></b></p><?php endif; ?>
<form method="POST" enctype="multipart/form-data">
  <input type="file" name="f">
  <button>上传</button>
</form>
<hr>
<p>上传后试试直接访问：<code>/php/uploads/你的文件名</code></p>
<p>关键检查：<b>uploads 目录能不能解析 PHP？</b>如果能，传上去的 .php 就会被执行。</p>
</body></html>
