// Python 学习站 · 第 11-14 章：标准库与工程
var CHAPTERS_C = [
{
id:11, title:"标准库必修：不做重复的轮子", stage:"标准库与工程",
intro:"标准库是 Python 最强的部分，也是审计时最容易看走眼的地方——<b>很多漏洞就藏在「一个看起来很普通的标准库调用」里</b>。这一章把最常用的几个模块过一遍，每个都点出它的安全含义。",
sections:[
{h:"11.1 路径：os.path 与 pathlib", p:["处理文件路径有新旧两套写法。<b>pathlib 是现代写法</b>，用起来像操作对象，不容易拼错分隔符。",
"安全提醒：不管是哪套写法，只要路径里拼进了用户输入，就有<b>路径穿越</b>风险——用户传 <code>../../../../windows/win.ini</code>，你的「下载目录」就变成了整个硬盘。"]},
{code:[
`from pathlib import Path

base = Path("/srv/files")

# ❌ 危险：用户输入直接拼进路径
name = "../../windows/win.ini"
p = base / name                 # 结果是 /srv/files/../../windows/win.ini
print(p.resolve())              # → /windows/win.ini  已经逃出 base 了

# ✅ 安全：先 resolve，再确认它还在 base 里面
target = (base / name).resolve()
if not str(target).startswith(str(base.resolve()) + "/"):
    raise ValueError("非法路径")

# ✅ 更稳的写法（Python 3.9+）
try:
    target = (base / name).resolve()
    target.relative_to(base.resolve())      # 不在 base 下会抛 ValueError
except ValueError:
    raise ValueError("非法路径")`],
note:"<b>逐个说清 <code>resolve()</code> 为什么关键：</b>它会把 <code>..</code> 真正展开成绝对路径。如果先检查再 resolve，检查的就是假路径，绕过自然发生。<b>顺序不能颠倒——先展开，后判断。</b>"},
{h:"11.2 json 与 re：解析和匹配", p:["<b>json</b> 负责「字符串 ↔ 结构」的互转，几乎所有接口都用它。<b>re</b> 是正则，用来做匹配和提取。",
"审计要点：正则写得不好会造成 <b>ReDoS</b>（灾难性回溯），一个请求就能把 CPU 打满。典型特征：<b>嵌套的量词</b>，比如 <code>(a+)+</code>、<code>(.*)*</code>。"]},
{code:[
`import json, re

data = json.loads('{"name": "tom", "age": 20}')     # 字符串 → 字典
print(json.dumps(data, ensure_ascii=False))         # 字典 → 字符串

# ❌ 灾难性回溯：输入一串 a 再跟一个不匹配的字符，回溯次数指数增长
bad = re.compile(r"^(a+)+$")

# ✅ 改写成不嵌套的形态，或者限制长度
good = re.compile(r"^a+$")

# 审计时用 re.DEBUG 或 re._compile 看不出复杂度，要靠人工识别「量词套量词」
# 通用规则：正则里出现 (…+)+ / (…*)* / (…+)* 这类结构，就要标记为可疑`],
tip:"<b>json 也有安全含义：</b>如果接口用 <code>json.loads</code> 解析用户提交的内容，再把里面的字段当命令、当路径、当 SQL 用，那 json 层就只是「过了一手」，<b>不构成任何过滤</b>。审计时 json 解析出来的字段要和 <code>request.args</code> 同等对待——都是不可信数据。"},
{h:"11.3 密码学：hashlib / secrets / base64", tbl:[
["模块","用途","常见错误"],
["hashlib","算哈希（md5/sha256）","<b>用 md5/sha1 存密码</b>；用「哈希一次」代替密码哈希"],
["secrets","生成安全随机数","用 <code>random</code> 生成 token / 验证码 / 重置链接"],
["base64","编码（不是加密）","把 base64 当加密用，或用它硬编码后门"],
["hmac","带密钥的哈希","自己拼字符串做签名，导致长度扩展攻击"]],
code:[
`import hashlib, secrets, base64, hmac

# ❌ md5 存密码：彩虹表秒破
hashlib.md5(b"123456").hexdigest()

# ✅ 用专门的密码哈希（自带盐、可调成本）
# pip install passlib 或直接用它自带的口令模块
import hashlib as H
d = H.scrypt(b"123456", salt=H.os.urandom(16), n=2**14, r=8, p=1)

# ❌ random 不是密码学安全：种子可预测
import random
token = "".join(random.choice("0123456789") for _ in range(6))   # 验证码可预测！

# ✅ secrets 是密码学安全的
code = "".join(secrets.choice("0123456789") for _ in range(6))
reset_token = secrets.token_urlsafe(32)

# base64 只是编码，不是加密 —— 任何人都能反解
print(base64.b64decode(base64.b64encode(b"admin:123456")))

# 签名要用 hmac.compare_digest 做常数时间比较，避免时序攻击
ok = hmac.compare_digest(sign, expected)`],
note:"<b>「用 random 生成验证码」是真实漏洞里出现频率很高的一条。</b>Python 的 <code>random</code> 是可预测的伪随机（梅森旋转），只要拿到几个输出就能反推状态。<b>凡是和安全相关的随机，一律用 <code>secrets</code>。</b>"},
{h:"11.4 collections 与 itertools", p:["审计别人代码时经常遇到这两个模块的用法，不认识就会读错逻辑。",
"<b>collections</b>：<code>Counter</code> 计数、<code>defaultdict</code> 带默认值的字典、<code>OrderedDict</code> 有序字典（现在普通字典也有序了）、<code>deque</code> 双端队列。",
"<b>itertools</b>：<code>chain</code> 串联、<code>product</code> 笛卡尔积、<code>groupby</code> 分组、<code>islice</code> 切片。"]},
{code:[
`from collections import Counter, defaultdict
from itertools import chain, product, islice

print(Counter("hello"))                 # Counter({'l': 2, 'h': 1, 'e': 1, 'o': 1})

# defaultdict 常见于「按用户分组」，审计时注意它的值是不是用户可控
groups = defaultdict(list)
groups["admin"].append("x")

# product 生成组合 —— 暴力破解脚本的常见写法
for name, pwd in islice(product(["admin","root"], ["123456","admin"]), 5):
    print(name, pwd)

# 注意：上面这段就是「暴力破解」，只允许对你自己的靶场用`],
note:"<b>审计视角：</b>看到 <code>product</code>、<code>chain</code> 组合出大量请求、又没有频率限制时，这段代码可能就是一个「无限制爆破接口」。<b>漏洞不一定是注入类，业务逻辑类的也算。</b>"},
{h:"11.5 时间与过期校验", code:[
`from datetime import datetime, timedelta, timezone

# ❌ 用本地时间比较，跨时区就会错；用字符串比较更是错
if user_card_expire > "2026-01-01":
    pass

# ❌ 常见错误：只比较了日期不比较时间，或者用了 utcnow（无时区）
now = datetime.utcnow()                       # 已不推荐

# ✅ 带时区的 UTC 时间
now = datetime.now(timezone.utc)
expire = datetime(2026, 1, 1, tzinfo=timezone.utc)
if now < expire:
    print("未过期")

# 审计红旗：过期校验用了 < 而不是 <=、或者根本没做时钟回拨处理`],
tip:"<b>过期类逻辑的审计清单：</b>① 时间来源是不是服务器时间（客户端传的时间不可信）？② 有没有时区问题？③ 过期后是「拒绝」还是「仍可继续用一次」？④ 有没有并发窗口（第 10 章那类竞争）？"},
{h:"11.6 怎么自己查标准库", ol:["<code>help(str)</code> 或 <code>help(os.path.join)</code> —— 交互式文档，随时可用。",
"<code>dir(obj)</code> —— 列出对象的所有属性方法，遇到陌生对象第一件事就敲这个。",
"<code>python -c \"import this\"</code> —— Python 之禅，写代码的审美标准。",
"官方文档 docs.python.org，配合 <code>pydoc</code> 命令在本地也能看。"]}
],
secview:"这一章的落脚点是<b>「安全相关的调用要认识」</b>：路径要 resolve 后再判断、密码要用专门的哈希、随机要用 secrets、正则要防回溯、时间要带时区。<b>这五条会反复出现在后面的审计题里。</b>"
},
{
id:12, title:"网络与 HTTP：requests 与 SSRF", stage:"标准库与工程",
intro:"Python 在安全领域的两大主场之一就是「写网络工具」。这一章既教你发请求，也教你 <b>SSRF（服务端请求伪造）</b>——Python 生态里最常见的高危漏洞之一。",
sections:[
{h:"12.1 一个请求的完整形态", code:[
`import requests

r = requests.get("https://httpbin.org/get", params={"q": "hello"}, timeout=5)
print(r.status_code)        # 200
print(r.text)               # 响应体（字符串）
print(r.json())             # 如果是 JSON，直接解析

# POST 表单
r = requests.post("https://httpbin.org/post", data={"user": "tom"}, timeout=5)

# POST JSON
r = requests.post("https://httpbin.org/post", json={"user": "tom"}, timeout=5)

# 带请求头 / Cookie / 认证
h = {"User-Agent": "Mozilla/5.0", "Authorization": "Bearer xxx"}
r = requests.get("https://httpbin.org/headers", headers=h, timeout=5)
r = requests.get("https://httpbin.org/basic-auth/a/b", auth=("a", "b"), timeout=5)`],
note:"<b>审计时看到 <code>requests.get(url)</code>，先问一句：这个 <code>url</code> 是谁给的？</b>如果 url 来自用户，那这段代码就是一个「代理」，而代理可以打内网——这就是下一节的 SSRF。"},
{h:"12.2 超时：不加 timeout 是 bug", p:["<code>requests</code> 默认<b>没有超时</b>。对方服务器不响应，你的程序会一直挂着。",
"这不只是稳定性问题：<b>攻击者可以故意让目标不响应，把你的进程池耗尽</b>，形成拒绝服务。"]},
{code:[
`import requests

# ❌ 没有超时：目标不响应就永久挂住
requests.get("http://example.com")

# ✅ 连接超时 3 秒、读取超时 10 秒
requests.get("http://example.com", timeout=(3, 10))

# ✅ 加重试（但注意：重试次数本身也是一种放大攻击面）
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
s = requests.Session()
s.mount("http://", HTTPAdapter(max_retries=Retry(total=3, backoff_factor=0.5)))
s.mount("https://", HTTPAdapter(max_retries=Retry(total=3, backoff_factor=0.5)))`],
tbl:[
["参数","作用","漏了会怎样"],
["timeout","超时秒数（可传元组）","线程/进程被挂死，可被 DoS"],
["verify","是否校验证书","<code>verify=False</code> 等于接受中间人攻击"],
["allow_redirects","是否跟随跳转","SSRF 防护常被 302 绕过（跳转到内网）"],
["stream","流式下载","不加则大文件一次性读进内存，可被打爆"]],
},
{h:"12.3 证书校验：verify=False 是红线", code:[
`import requests

# ❌ 关闭证书校验：任何人都能冒充目标服务器
requests.get("https://example.com", verify=False)

# ❌ 更糟：连警告都屏蔽掉，问题被藏起来
import urllib3
urllib3.disable_warnings()

# ✅ 正确的做法是修复证书，而不是关掉校验
#    如果确实要信任自签证书，应该指定 CA 文件：
requests.get("https://example.com", verify="/path/to/ca.pem")`],
note:"<b>审计时的处理：</b><code>verify=False</code> 属于「必须上报」的发现。它的危害是解密的流量可被篡改——如果你的程序用它的响应做安全判断，等于判断依据被别人控制。"},
{h:"12.4 SSRF：Python 里最值钱的一类漏洞", p:["<b>定义：</b>服务端用「用户提供的地址」去发请求。攻击者可以借此<b>访问内网</b>（数据库、Redis、云元数据接口 169.254.169.254），或用它做<b>端口扫描</b>。"]},
{code:[
`# ❌ 漏洞版：url 完全来自用户
from flask import Flask, request
import requests
app = Flask(__name__)

@app.route("/fetch")
def fetch():
    url = request.args.get("url")
    return requests.get(url, timeout=5).text

# 攻击者可以这样用：
#   /fetch?url=http://127.0.0.1:6379/            打本地 Redis
#   /fetch?url=http://169.254.169.254/latest/meta-data/   云服务器凭据
#   /fetch?url=http://192.168.1.1:22/            内网探测

# ✅ 安全版：白名单域名 + 解析后校验 IP + 禁跳转
from urllib.parse import urlparse
import ipaddress, socket

ALLOW = {"api.example.com", "cdn.example.com"}

def is_internal(host):
    """解析域名，看是否有内网地址"""
    try:
        for info in socket.getaddrinfo(host, None):
            ip = ipaddress.ip_address(info[4][0])
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
                return True
    except Exception:
        return True          # 解析失败一律拒绝
    return False

@app.route("/fetch_safe")
def fetch_safe():
    url = request.args.get("url", "")
    u = urlparse(url)
    if u.scheme not in ("http", "https"):
        return "非法协议", 400
    if u.hostname not in ALLOW:
        return "域名不在白名单", 400
    if is_internal(u.hostname):
        return "禁止内网地址", 400
    return requests.get(url, timeout=5, allow_redirects=False).text`],
warn:"<b>SSRF 的防御比想象中难，因为挡不住 DNS 重绑定（检查时解析成公网 IP，请求时解析成内网 IP）。</b>生产环境的正确做法通常是：用一个独立的外发代理节点去发请求，应用本身没有内网访问权限。<b>这里先记住原则：白名单 &gt; 黑名单。</b>"},
{h:"12.5 写一个最小的 Web 服务（为后面的漏洞课铺路）", code:[
`# 用标准库起一个最简 HTTP 服务（不需要装任何东西）
from http.server import BaseHTTPRequestHandler, HTTPServer

class H(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.end_headers()
        self.wfile.write("你好，路径是：".encode() + self.path.encode())

HTTPServer(("127.0.0.1", 8000), H).serve_forever()
# 浏览器打开 http://127.0.0.1:8000/any/path 就能看到

# 更常用的：Flask（后面第 18 章会大量用它）
# pip install flask
# flask --app app run --debug`],
tip:"<b>自己动手起过服务之后，「服务端」就不再是抽象概念。</b>后面讲 SSTI、命令执行、反序列化时，你会清楚「用户输入怎么进到后端、后端又怎么把它变成危险调用」——这条链子你亲手搭过一遍。"}
],
secview:"网络这一章的审计要点：<b>url 是谁给的（SSRF）、有没有超时（DoS）、证书有没有校验、跟随跳转有没有限制。</b>这四个问题问完，网络类代码的主要风险就圈出来了。"
},
{
id:13, title:"数据库：从 sqlite3 到 SQL 注入的 Python 形态", stage:"标准库与工程",
intro:"你在 MySQL 课里学过的注入原理，在 Python 里会换一副面孔：<b>漏洞不在数据库，而在「字符串怎么拼」</b>。这一章用 Python 自带的 sqlite3 把注入、参数化、ORM 逃逸全部走一遍。",
sections:[
{h:"13.1 sqlite3：不用装任何东西的数据库", code:[
`import sqlite3

conn = sqlite3.connect("demo.db")          # 文件不存在会自动创建
cur = conn.cursor()

cur.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, pwd TEXT)")
cur.execute("INSERT INTO users (name, pwd) VALUES (?, ?)", ("admin", "123456"))
conn.commit()                              # 写操作必须提交

cur.execute("SELECT * FROM users")
print(cur.fetchall())                      # [(1, 'admin', '123456')]

cur.close()
conn.close()

# ✅ 用 with 自动关闭（推荐）
with sqlite3.connect("demo.db") as conn:
    with conn:
        conn.execute("INSERT INTO users (name, pwd) VALUES (?, ?)", ("tom", "x"))`],
},
{h:"13.2 SQL 注入在 Python 里的三种写法", code:[
`# ❌ 写法一：f-string 拼接（最常见）
name = input("用户名：")
cur.execute(f"SELECT * FROM users WHERE name = '{name}'")
#   输入  ' OR '1'='1   就变成：
#   SELECT * FROM users WHERE name = '' OR '1'='1'      ← 全部返回

# ❌ 写法二：% 格式化
cur.execute("SELECT * FROM users WHERE name = '%s'" % name)

# ❌ 写法三：字符串 + 号
cur.execute("SELECT * FROM users WHERE name = '" + name + "'")

# ============ 以上三种全都是漏洞 ============

# ✅ 正确写法：参数化查询。占位符把「代码」和「数据」分开
cur.execute("SELECT * FROM users WHERE name = ?", (name,))
#   sqlite3 用 ?，PyMySQL/psycopg 用 %s，但都必须是「占位符 + 单独传参」`],
note:"<b>记住一句话：占位符的重点不是「把引号处理掉」，而是让数据库知道「这一段是数据，不是 SQL 代码」。</b>所以任何形式的字符串拼接（f-string、%、+、format）都等于没防。"},
{h:"13.3 参数化也救不了的两种情况", tbl:[
["场景","为什么不能参数化","正确做法"],
["表名 / 列名","SQL 语法规定标识符不能用占位符","<b>白名单</b>：<code>if table not in {'users','orders'}: raise</code>"],
["ORDER BY 字段","同上，字段名不是值","白名单映射：<code>SORT={'name':'name','time':'created_at'}[key]</code>"],
["IN 列表","占位符数量要动态决定","按长度拼 <code>?</code>：<code>','.join('?'*len(ids))</code>，值仍然单独传"]],
code:[
`# ❌ 想「参数化表名」是做不到的，硬拼就是注入
table = request.args["t"]
cur.execute("SELECT * FROM %s WHERE id = ?" % table, (uid,))

# ✅ 表名走白名单
TABLES = {"users", "orders", "products"}
table = request.args["t"]
if table not in TABLES:
    return "非法表名", 400
cur.execute(f"SELECT * FROM {table} WHERE id = ?", (uid,))
#   注意：这里的 f-string 是安全的，因为 table 已经被白名单限死了

# ✅ 排序字段走映射
SORT = {"name": "name", "time": "created_at"}
order = SORT.get(request.args.get("sort"), "id")
cur.execute(f"SELECT * FROM users ORDER BY {order}")`],
tip:"<b>怎么一眼看出 f-string 拼接安不安全？</b>看那个被拼进去的变量，它在此之前<b>有没有被限制在一个固定集合里</b>。有白名单 → 安全；直接来自用户 → 注入。<b>「追数据流」追的就是这一段。</b>"},
{h:"13.4 登录逻辑：注入之外还有密码问题", code:[
`# ❌ 三重问题：SQL 拼接 + 明文密码 + 用户名枚举
@app.route("/login", methods=["POST"])
def login():
    u = request.form["u"]; p = request.form["p"]
    row = db.execute(f"SELECT * FROM users WHERE name='{u}' AND pwd='{p}'").fetchone()
    if row:
        session["uid"] = row[0]
        return "ok"
    return "用户名或密码错误"        # ← 提示语统一，避免枚举

# ✅ 正确做法
import hmac
@app.route("/login2", methods=["POST"])
def login2():
    u = request.form["u"]; p = request.form["p"]
    row = db.execute("SELECT id, pwd_hash FROM users WHERE name = ?", (u,)).fetchone()
    ok = bool(row) and hmac.compare_digest(row[1], hash_pwd(p))
    if not ok:
        return "用户名或密码错误", 401
    # 登录成功后要重新生成会话 ID，防止会话固定攻击
    session.clear()
    session["uid"] = row[0]
    return "ok"`],
},
{h:"13.5 ORM 不等于安全", p:["很多人以为用了 SQLAlchemy / Django ORM 就不会注入。ORM 确实<b>默认</b>安全，但它留了「原样执行 SQL」的出口："]},
{code:[
`# SQLAlchemy —— 这行是安全的
User.query.filter_by(name=u).first()

# ❌ 但这样写就回到注入
db.session.execute(f"SELECT * FROM users WHERE name='{u}'")
db.session.execute(text("SELECT * FROM users WHERE name='" + u + "'"))

# ✅ 参数化（SQLAlchemy 用 :name）
from sqlalchemy import text
db.session.execute(text("SELECT * FROM users WHERE name = :n"), {"n": u})

# Django ORM 里的同类出口
User.objects.raw(f"SELECT * FROM app_user WHERE name='{u}'")       # ❌
User.objects.raw("SELECT * FROM app_user WHERE name=%s", [u])       # ✅
User.objects.extra(where=[f"name='{u}'"])                           # ❌

# 审计诀窍：直接全局搜索这几个词
#   .raw(   .extra(   execute(   text(   cursor(   %s\" %   f\"SELECT   f'SELECT`],
note:"<b>这就是「审计的工程化」：把危险模式变成一串可以全局搜索的特征字符串。</b>拿到任何一个 Python 项目，先把上面那串词搜一遍，命中处逐个看数据流——<b>这是第 15 章要正式讲的方法，你现在已经用上了。</b>"},
{h:"13.6 事务、连接与资源泄漏", code:[
`# ❌ 忘记 commit / 忘记 close：数据没写进去、连接池被耗尽
conn = sqlite3.connect("x.db")
conn.execute("INSERT INTO t VALUES (1)")
# 没有 commit，进程结束后这条数据消失

# ✅ with 语句：自动提交/回滚，自动关闭
with sqlite3.connect("x.db") as conn:
    with conn:                 # 内层 with 管事务：正常提交、异常回滚
        conn.execute("INSERT INTO t VALUES (?)", (1,))

# 审计视角：连接不关 = 长跑服务迟早耗尽连接池 = 另一种 DoS
# 事务不提交/不回滚 = 数据不一致（涉及金额的场景会变成逻辑漏洞）`],
}
],
secview:"数据库部分的审计要点：<b>① 所有 SQL 是不是参数化的？② 表名/列名/排序字段有没有白名单？③ 密码是不是专门的哈希？④ 事务和连接有没有正确管理？</b>这四条扫完，数据库层的风险基本清空。"
},
{
id:14, title:"项目结构与工程质量：先看懂一个项目", stage:"标准库与工程",
intro:"审计的前提是<b>能读懂一个陌生项目</b>。这一章教你 Python 项目的标准长相，以及几个「一看就知道有风险」的工程习惯。",
sections:[
{h:"14.1 模块、包、入口", code:[
`# 一个 .py 文件就是一个「模块」
# 一个带 __init__.py 的文件夹就是一个「包」

# myapp/
#   __init__.py        ← 包标记，导入时会执行（❗审计点：里面的代码会被自动运行）
#   models.py
#   views.py
#   utils/
#     __init__.py
#     crypto.py

# 三种导入方式
import myapp.models                 # 导入模块
from myapp.models import User       # 导入名字
from . import models                # 相对导入（包内部用）

# 入口：只有直接运行这个文件时才执行 main
def main():
    print("start")

if __name__ == "__main__":
    main()

# ❗审计点：__init__.py 里的代码在任何 import 时都会跑。
#   如果里面写了个「读配置 + 连数据库 + 启动线程」，那你只是导入它就产生了副作用。`],
},
{h:"14.2 判断一个项目的入口在哪", ol:["看根目录有没有 <code>pyproject.toml</code> / <code>setup.py</code>：里面有 <code>[project.scripts]</code> 或 <code>entry_points</code>，指明命令行入口。",
"看有没有 <code>__main__.py</code>：<code>python -m 包名</code> 会执行它。",
"Web 项目看 <code>manage.py</code>（Django）、<code>app.py</code> / <code>wsgi.py</code> / <code>asgi.py</code>（Flask/FastAPI）。",
"全局搜索 <code>if __name__</code>，把每个命中的文件列出来。",
"搜索 <code>@app.route</code> / <code>urlpatterns</code> / <code>@router</code>，列出所有 HTTP 接口——<b>这些就是输入点清单。</b>"]},
{h:"14.3 配置与密钥：硬编码是重灾区", code:[
`# ❌ 硬编码密钥 —— 提交到 Git 就等于公开
SECRET_KEY = "mysecret123"
DB_PASSWORD = "root"
AWS_KEY = "AKIAIOSFODNN7EXAMPLE"

# ✅ 从环境变量读，代码里只留「必须存在」的断言
import os
SECRET_KEY = os.environ["APP_SECRET_KEY"]        # 缺失直接启动失败，好过静默用弱密钥
DB_PASSWORD = os.environ.get("DB_PASSWORD")

# ✅ 本地开发用 .env（一定要写进 .gitignore！）
from dotenv import load_dotenv     # pip install python-dotenv
load_dotenv()

# 审计搜索词：
#   password  passwd  secret  token  api_key  apikey  AKIA  BEGIN RSA  PRIVATE KEY`],
warn:"<b>「先搜密钥、再搜漏洞」是审计的省力打法。</b>一个硬编码的数据库密码，往往比十个注入点更容易利用——因为它不需要任何技巧，直接连库即可。<b>把 <code>.gitignore</code> 里没有 <code>.env</code> 的项目直接标记为高危。</b>"},
{h:"14.4 日志：别把密码写进去", code:[
`import logging

# ✅ 结构化、分级别、写文件（生产环境别用 print）
logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

# ❌ 把敏感信息打进日志
log.info("登录请求 " + str(request.form))          # 密码、token 全进日志

# ✅ 只记必要字段
log.info("登录尝试 user=%s ip=%s", user, ip)

# ❌ 另一个经典问题：日志里有用户输入，被当格式串用
log.info(user_input)                                # 用户输入里有 %s 会出错

# ❌ 日志注入：用户输入里有换行，可以伪造日志行
log.info("user=" + user_input)                      # 输入 "a\\nINFO admin login ok" 就能伪造`],
},
{h:"14.5 异常处理：裸 except 会吞掉一切", code:[
`# ❌ 裸 except：把 KeyboardInterrupt、SystemExit 都吃掉
try:
    do_something()
except:
    pass                    # 出错静默，出事了查不到原因

# ❌ 只打印不处理：安全校验失败却继续往下走
try:
    check_permission(user)
except Exception as e:
    print(e)                # ← 打印完继续执行！鉴权形同虚设

# ✅ 精确捕获 + 明确处理 + 记录
try:
    check_permission(user)
except PermissionError:
    log.warning("权限校验失败 user=%s", user)
    abort(403)

# ✅ 需要兜底时也要记日志，且不能吞掉「没有权限」这种语义
try:
    risky()
except (ValueError, KeyError) as e:
    log.exception("处理失败")
    raise`],
note:"<b>「鉴权失败但没中断执行」是审计里价值很高的一类发现。</b>它的代码长相就是上面第二种：<b>把安全校验包在 try 里，except 只打印。</b>看到 try/except 包着 <code>check_*</code>、<code>verify_*</code>、<code>auth</code> 这类函数，就要停下来确认「失败之后有没有中断」。"},
{h:"14.6 单元测试：pytest", code:[
`# test_calc.py
import pytest
from myapp.calc import divide

def test_divide_ok():
    assert divide(6, 3) == 2

def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError):
        divide(1, 0)

@pytest.mark.parametrize("a,b,exp", [(2,2,1), (9,3,3)])
def test_table(a, b, exp):
    assert divide(a, b) == exp

# 运行：pytest -q

# 安全测试也这么写：把「攻击输入不能通过」写成测试用例
def test_path_traversal_blocked():
    with pytest.raises(ValueError):
        safe_join("/srv/files", "../../etc/passwd")

# ← 这一条就是「把漏洞的修复固化成回归测试」，
#   以后有人改坏了代码，CI 会立刻报错。`],
tip:"<b>把「攻击用例」写进测试，是把安全从「一次性检查」变成「持续保障」的关键一步。</b>第 20 章写报告时会用到：一份好的报告除了给修复代码，还会给一条可回归的测试。"},
{h:"14.7 静态检查工具（审计的加速器）", tbl:[
["工具","干什么","怎么用"],
["ruff","极快的 lint，查风格和常见错误","<code>pip install ruff</code> → <code>ruff check .</code>"],
["bandit","<b>专查 Python 安全问题的静态扫描器</b>","<code>pip install bandit</code> → <code>bandit -r .</code>"],
["pip-audit","查依赖里的已知漏洞（CVE）","<code>pip install pip-audit</code> → <code>pip-audit</code>"],
["safety","同上，另一个依赖扫描器","<code>pip install safety</code> → <code>safety check</code>"],
["mypy","类型检查，能提前发现一批逻辑错","<code>pip install mypy</code> → <code>mypy .</code>"]],
code:[
`# bandit 的输出长这样，它会直接告诉你文件和行号：
#   >> Issue: [B602:subprocess_popen_with_shell_equals_true]
#      Severity: High   Confidence: High
#      Location: app.py:42
#   42        subprocess.Popen(cmd, shell=True)

# 用法小结（在项目根目录）：
pip install bandit pip-audit ruff
bandit -r . -ll                 # -ll 只报中危以上
pip-audit
ruff check .

# 注意：静态扫描器有误报，也有漏报。
# 它的正确用法是「帮你快速圈出可疑点」，最终判断还是要靠人读代码。`],
note:"<b>把 bandit 当「第一遍粗筛」，把人读代码当「第二遍精筛」。</b>这是职业审计师的标准流程：先让机器扫一遍拿到候选清单，再逐条追数据流确认。<b>你以后接手任何项目，都先跑一遍这三个工具。</b>"}
],
secview:"这一章的目标是<b>拿到一个陌生项目 30 分钟内能画出地图</b>：入口在哪、接口有哪些、配置怎么读、密钥放哪、日志和异常怎么处理。<b>地图画出来，第 15 章的审计方法论才有地方落笔。</b>"
}
];
