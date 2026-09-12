// PHP 学习站 v2 · code 文件夹清单
// 这一份是「代码示例」的唯一真相来源：页面从这里渲染，校验脚本拿它和 code 目录比对。
var CODE_FILES = [
 { f:"hello.php",            ch:"第 1-2 章", d:"第一个程序：输出、变量、单双引号、弱类型", risk:"无" },
 { f:"form.html",            ch:"第 7 章",   d:"登录表单（GET/POST 对比）", risk:"无" },
 { f:"login.php",            ch:"第 7 章",   d:"表单处理，含未编码输出的对照演示", risk:"⚠ 反射型 XSS 示例" },
 { f:"config.php",           ch:"第 9 章",   d:"数据库配置（审计时最值钱的文件）", risk:"含敏感信息" },
 { f:"db.php",               ch:"第 9 章",   d:"数据库连接：mysqli 与 PDO 两种写法", risk:"无" },
 { f:"setup.sql",            ch:"第 9-15 章",d:"建 test 库与演示表（users / guestbook）", risk:"无" },
 { f:"unsafe_query.php",     ch:"第 10 章",  d:"SQL 注入的漏洞写法（字符串拼接）", risk:"⚠ SQL 注入" },
 { f:"safe_query.php",       ch:"第 10 章",  d:"同样的功能，预处理 + 类型校验", risk:"安全" },
 { f:"file_read.php",        ch:"第 8、11 章",d:"任意文件读取与目录穿越（可切修复版）", risk:"⚠ 任意文件读取" },
 { f:"lfi_demo.php",         ch:"第 11 章",  d:"文件包含，可用 php://filter 读源码", risk:"⚠ LFI" },
 { f:"xss_demo.php",         ch:"第 12 章",  d:"反射型 + 存储型 XSS 的编码对照", risk:"⚠ XSS" },
 { f:"rce_demo.php",         ch:"第 13 章",  d:"命令执行：拼接 / 转义 / 白名单三模式对比", risk:"⚠ 命令注入" },
 { f:"upload_demo.php",      ch:"第 14 章",  d:"文件上传四个级别（改 LEVEL 常量切换）", risk:"⚠ 任意文件上传" },
 { f:"unserialize_demo.php", ch:"第 15 章",  d:"PHP 对象注入，含安全模式对照", risk:"⚠ 反序列化" },
 { f:"README.md",            ch:"总览",      d:"文件清单与用法说明", risk:"无" }
];
