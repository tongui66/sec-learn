// Python 学习站 · code 文件夹清单
var CODE_FILES = [
{f:"hello.py", ch:"第 2 章", d:"第一个程序：打印、变量、f-string、查看解释器路径", risk:"✅ 安全"},
{f:"containers.py", ch:"第 3 章", d:"列表/字典/集合推导式、切片、解包", risk:"✅ 安全"},
{f:"scope_demo.py", ch:"第 4 章", d:"可变默认参数与 global 造成「状态泄漏」的对照演示", risk:"⚠️ 含漏洞示范"},
{f:"oop_demo.py", ch:"第 6 章", d:"类属性 vs 实例属性：两个实例互相「串数据」", risk:"⚠️ 含漏洞示范"},
{f:"decorator_generator.py", ch:"第 7 章", d:"计时装饰器、鉴权装饰器、生成器读文件", risk:"✅ 安全"},
{f:"path_demo.py", ch:"第 8 章", d:"路径穿越的漏洞版与安全版对照（只在本地沙箱目录）", risk:"⚠️ 含漏洞示范"},
{f:"type_and_bandit.py", ch:"第 9、14 章", d:"类型注解的局限 + 会被 bandit 抓出的危险写法", risk:"⚠️ 只扫描不运行"},
{f:"concurrency_demo.py", ch:"第 10 章", d:"「先检查再执行」的竞态复现与加锁修复", risk:"⚠️ 含漏洞示范"},
{f:"stdlib_tour.py", ch:"第 11 章", d:"pathlib / json / re / hashlib / secrets / datetime 速览", risk:"✅ 安全"},
{f:"ssrf_demo.py", ch:"第 12 章", d:"本地 SSRF 演示：/bad 有漏洞，/safe 白名单加内网校验", risk:"⚠️ 含漏洞示范"},
{f:"db_demo.py", ch:"第 13 章", d:"sqlite3 的注入版 vs 参数化版 vs 表名白名单", risk:"⚠️ 含漏洞示范"},
{f:"deserialize_demo.py", ch:"第 17 章", d:"pickle 原理演示：说明为什么反序列化会执行代码", risk:"⚠️ 教学演示，不含可用载荷"},
{f:"flask_app.py", ch:"第 18 章", d:"SSTI 演示：/welcome 有漏洞，/welcome_safe 正确写法", risk:"⚠️ 含漏洞示范"},
{f:"audit_checklist.py", ch:"第 15、20 章", d:"对任意 Python 项目做一次「危险模式扫描」的自查脚本", risk:"✅ 安全"}
];
