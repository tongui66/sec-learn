<?php
// unserialize_demo.php —— 第 15 章：PHP 对象注入
//
// ⚠️ 漏洞示例，只用于本地学习。
//
// 用法：
//   ① 先访问 ?mode=make   —— 生成并显示一个序列化字符串
//   ② 把生成的字符串（或手工改过属性值的字符串）作为 ?data= 提交
//   ③ 观察 __destruct 用你指定的路径和内容写文件
//   ④ 把 ?mode=safe 打开，重复第 ② 步，确认漏洞消失

class Logger {
    public $file = '/tmp/app.log';
    public $msg  = 'started';

    public function __destruct() {
        // 危险点：属性完全可控 + 文件写入
        @file_put_contents($this->file, "[LOG] " . $this->msg . "\n");
    }
}

$mode = $_GET['mode'] ?? 'demo';

echo '<h3>PHP 对象注入演示</h3>';

if ($mode === 'make') {
    // 生成一个「正常」的序列化字符串，作为对照
    $o = new Logger();
    $o->file = __DIR__ . '/unserialize_test.log';
    $o->msg  = '正常写入';
    $s = serialize($o);
    echo '<p>序列化结果（可手工修改属性值后提交）：</p>';
    echo '<pre>' . htmlspecialchars($s, ENT_QUOTES, 'UTF-8') . '</pre>';
    echo '<p>把它作为 <code>?data=</code> 的值提交试试。</p>';
} elseif ($mode === 'safe') {
    $data = $_GET['data'] ?? '';
    if ($data !== '') {
        // ✅ 修复：不反序列化对象（只接受标量/数组）
        $decoded = json_decode($data, true);
        echo '<p style="color:green">安全模式：用 json_decode 解析，不产生对象。</p>';
        echo '<pre>' . htmlspecialchars(var_export($decoded, true), ENT_QUOTES, 'UTF-8') . '</pre>';
    }
} else {
    $data = $_GET['data'] ?? '';
    if ($data !== '') {
        echo '<p style="color:red">漏洞模式：正在 unserialize 用户可控的字符串</p>';
        $obj = unserialize($data);
        echo '<p>反序列化完成。脚本结束时 __destruct 会被触发。</p>';
    } else {
        echo '<p>示例 payload（把 file 改成一个你想验证的路径）：</p>';
        echo '<pre>O:6:"Logger":2:{s:4:"file";s:5:"/x.txt";s:3:"msg";s:5:"pwned";}</pre>';
        echo '<p>提交形式：<code>?data=O:6:&quot;Logger&quot;:2:{...}</code></p>';
    }
}

echo '<hr><h4>要点回顾</h4>';
echo '<p>① <code>unserialize</code> 本身不是漏洞；<b>魔术方法里的危险操作</b>才是。</p>';
echo '<p>② 攻击者能控制对象属性的值，从而控制魔术方法的行为。</p>';
echo '<p>③ 多个类的魔术方法串起来就是 POP 链（真实项目靠它达到 RCE）。</p>';
echo '<p>④ 修复：用 json_decode 替代，或加 <code>allowed_classes</code> 白名单。</p>';
