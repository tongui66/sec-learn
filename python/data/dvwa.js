// Python 学习站 · 审计靶场（10 段待审计代码）
// 用法：先自己读、写下判断，再展开「你应该看到什么」对照。
var DVWA = [
{
 title:"靶场 1 · 一个「文件下载」接口",
 meta:"难度 ★☆☆　要求：写出输入点、危险函数、结论",
 goal:"读完下面 20 行代码，判断有没有漏洞、属于哪一类、怎么验证。",
 chapters:"对应第 8 章（文件与路径）、第 15 章（四步法）",
 code:`from flask import Flask, request, send_file
import os

app = Flask(__name__)
UPLOAD_DIR = "/srv/app/uploads"

@app.route("/download")
def download():
    name = request.args.get("name", "")
    path = os.path.join(UPLOAD_DIR, name)
    return send_file(path)`,
 expect:["<b>输入点：</b>request.args[\"name\"]，完全用户可控。",
"<b>危险函数：</b>os.path.join 与 send_file —— 组合起来就是「任意文件下载」。",
"<b>变换链：</b>取参数 → 直接拼接 → 打开文件返回。中间没有任何校验。",
"<b>验证：</b>传 name=../../../../etc/passwd（Linux）或 name=..%5c..%5cwindows%5cwin.ini，观察是否读到目录外的文件。",
"<b>结论：</b>路径穿越（CWE-22），高危。",
"<b>修复：</b>target = (Path(UPLOAD_DIR) / name).resolve()，然后 target.relative_to(Path(UPLOAD_DIR).resolve())，不在允许目录内就返回 400。"],
 tip:"审计这类代码有个通用口诀：<b>「用户给的字符串，最后变成路径了吗？」</b>变成路径就够了——路径能指向哪里，攻击者就能读到哪里。"
},
{
 title:"靶场 2 · 一个「查询用户」函数",
 meta:"难度 ★☆☆　要求：找出注入点并写出修复代码",
 goal:"三层嵌套的数据库操作，找出所有能注入的位置。",
 chapters:"对应第 13 章（数据库）",
 code:`def search_users(keyword, sort_by, page):
    sql = "SELECT id, name, email FROM users WHERE name LIKE '%" + keyword + "%'"
    if sort_by:
        sql += " ORDER BY " + sort_by
    sql += f" LIMIT {(page - 1) * 20}, 20"
    return db.execute(sql).fetchall()`,
 expect:["<b>问题一：</b>keyword 用 + 拼进 LIKE —— 字符串型 SQL 注入。",
"<b>问题二：</b>sort_by 直接拼进 ORDER BY —— <b>这里是很多人会漏的</b>，因为「排序字段」看起来不像数据。实际上 ORDER BY 后面是标识符位置，不能参数化，只能白名单。",
"<b>问题三：</b>page 参与计算后拼进 LIMIT。<b>如果 page 不是整数</b>（比如传进来的是字符串），f-string 会把它直接变成 SQL 文本。",
"<b>正确姿势：</b>keyword 用占位符；sort_by 走白名单映射；page 强制 int() 转换再算。",
"<b>结论：</b>SQL 注入（CWE-89），高危。"],
 tip:"<b>一个高频漏报点：</b>审计时容易只盯 WHERE 后面，忽略 <code>ORDER BY</code>、<code>GROUP BY</code>、<code>LIMIT</code>、表名、列名。<b>凡是「不是值」的位置，都是注入点，而且都不能参数化。</b>"
},
{
 title:"靶场 3 · 一个「执行系统命令」的工具函数",
 meta:"难度 ★★☆　要求：判断它是否可利用、怎么修",
 goal:"这段代码有「校验」，判断校验是否有效。",
 chapters:"对应第 16 章（命令执行）",
 code:`import subprocess

def check_host(host):
    # 只允许字母、数字、点、横线
    for ch in host:
        if not (ch.isalnum() or ch in ".-"):
            return {"ok": False, "msg": "非法字符"}
    out = subprocess.run(
        f"ping -c 1 {host}",
        shell=True, capture_output=True, text=True, timeout=5
    )
    return {"ok": True, "out": out.stdout}`,
 expect:["<b>先说结论：</b>虽然做了「字符白名单」，但它只允许字母数字点横线——<b>命令分隔符被挡掉了，所以不容易直接命令注入</b>。",
"<b>但问题依然存在：</b>① 用了 shell=True，一旦将来有人放宽过滤规则（比如要支持 IPv6 的冒号、要支持 URL），立刻变成命令注入；② <b>参数注入</b>：host 可以是 <code>--help</code> 这种以横线开头的值，会影响 ping 的行为；③ 没有校验它是不是一个合法的 IP/域名。",
"<b>更严重的一类隐藏问题：</b>如果 <code>host</code> 来自用户，那么这段代码本身就是一个「内网探测器」——攻击者可以用它判断哪些 IP 存活（这就是 SSRF 的一种形态）。",
"<b>正确修复：</b>用参数列表 + shell=False；host 先做严格格式校验（例如必须是合法 IPv4 或白名单域名）；加 <code>--</code> 或直接用 Python 的 socket 做连通性测试。",
"<b>结论：</b>不构成直接命令注入，但仍应报告为「不安全写法 + 潜在 SSRF/参数注入」，中危。"],
 why:"<b>这个靶场训练的是「不要把『有校验』等同于『没漏洞』」。</b>审计报告的价值在于准确——<b>既不能漏，也不能夸大。</b>把中危写成高危，会让开发不信任你的报告；把高危写成无风险，那是失职。"
},
{
 title:"靶场 4 · 一个「读取用户配置」的接口",
 meta:"难度 ★★☆　要求：说出这条链子最终能到哪一步",
 goal:"判断这段代码能不能升级成更严重的漏洞。",
 chapters:"对应第 17 章（反序列化）、第 12 章（SSRF）",
 code:`import base64, pickle, requests
from flask import request

@app.route("/import_config")
def import_config():
    raw = request.args.get("data", "")
    cfg = pickle.loads(base64.b64decode(raw))
    if cfg.get("fetch"):
        requests.get(cfg["fetch"], timeout=3)
    return "ok"`,
 expect:["<b>输入点：</b>request.args[\"data\"]，用户可控。",
"<b>第一步：</b>base64 解码 —— 只是编码，不构成防护。",
"<b>第二步：</b><b>pickle.loads 处理用户数据 = 任意代码执行</b>。这一步就已经到顶了，不需要看后面的 requests。",
"<b>第三步（次要问题）：</b>cfg[\"fetch\"] 拼进 requests.get —— 即使 pickle 被换掉，这里仍是 SSRF。",
"<b>结论：</b>反序列化导致远程代码执行（CWE-502），<b>严重／高危</b>。",
"<b>修复：</b>把 pickle 换成 json.loads；如果确实需要签名，用 itsdangerous 之类的「JSON + 签名」方案，并且<b>先验签再解析</b>；fetch 目标做白名单。"],
 warn:"<b>这一题的答案只有一句话要说：用户可控数据 + pickle.loads = 代码执行。</b>审计时遇到这个组合，直接定级、不需要写利用代码来论证。"
},
{
 title:"靶场 5 · 一个「首页欢迎语」接口",
 meta:"难度 ★★☆　要求：判断它属于哪类漏洞、影响范围多大",
 goal:"很短的一段代码，但后果不小。",
 chapters:"对应第 18 章（SSTI）",
 code:`from flask import Flask, request, render_template_string
import os

app = Flask(__name__)

@app.route("/welcome")
def welcome():
    nick = request.args.get("nick", "游客")
    tpl = "<html><body><h1>欢迎 " + nick + " 来到学习站</h1></body></html>"
    return render_template_string(tpl, version=os.popen("uname -a").read())`,
 expect:["<b>问题一：</b>模板字符串里拼了用户输入（nick）→ <b>SSTI</b>。Jinja2 的模板语法可以访问对象属性和方法调用，可能一路走到执行代码。",
"<b>问题二（很多人会漏）：</b>模板渲染时把 <code>os.popen(...).read()</code> 的结果作为变量传进去。<b>这意味着每次访问首页都会执行一次系统命令。</b>虽然命令是写死的，但这个写法本身就是高危模式——一旦有人「顺手」把变量换成用户可控的，立刻变成命令注入。",
"<b>问题三：</b>把系统信息显示在页面上，属于信息泄露（泄露内核版本便于选漏洞）。",
"<b>结论：</b>SSTI（高危）+ 危险模式（中危）+ 信息泄露（低危）。",
"<b>修复：</b>模板固定，用户输入只做变量：<code>render_template_string(\"<h1>欢迎 {{ nick }}</h1>\", nick=nick)</code>；系统信息不要渲染到页面上。"],
 tip:"<b>判断题眼：模板字符串里有没有用户输入。</b>有 → SSTI。这个判断不需要看模板引擎版本、不需要看有没有沙箱，<b>先定位再看细节</b>。"
},
{
 title:"靶场 6 · 一个「任务调度」的小服务",
 meta:"难度 ★★★　要求：找出所有问题，按危害排序",
 goal:"综合题：配置、鉴权、命令执行、日志全都在这一小段里。",
 chapters:"对应第 14、16、19 章",
 code:`from flask import Flask, request
import os, subprocess, logging, sqlite3

app = Flask(__name__)
app.secret_key = "taskrunner"
logging.basicConfig(filename="run.log", level=logging.DEBUG)

TASKS = {}

def is_admin(uid):
    try:
        row = sqlite3.connect("t.db").execute(
            f"SELECT role FROM users WHERE id={uid}").fetchone()
        return row and row[0] == "admin"
    except Exception as e:
        print("鉴权出错:", e)          # 打印后继续

@app.route("/run_task")
def run_task():
    uid = request.args.get("uid", "")
    name = request.args.get("name", "")
    cmd = TASKS.get(name, "")
    if is_admin(uid):
        logging.debug("执行任务 %s，命令 %s，用户 %s", name, cmd, uid)
        return subprocess.check_output(cmd, shell=True)
    return "无权", 403

app.run(debug=True, host="0.0.0.0", port=80)`,
 expect:["<b>① 鉴权函数 is_admin 失败不中断：</b>except 里只 print，然后函数返回 None——<b>调用方 if is_admin(uid) 会判 False，这一条恰好是安全的。</b>但这属于「靠巧合安全」：如果哪天有人把调用改成 <code>if is_admin(uid) is not False</code>，立刻变成越权。<b>必须报告。</b>",
"<b>② uid 拼进 SQL：</b>f-string 拼接，SQL 注入。更糟的是它就在鉴权函数里——<b>注入进鉴权查询，可能直接绕过权限判断。</b>",
"<b>③ 返回值类型不一致：</b>成功时返回布尔，失败时返回 None，调用方用 if 判断刚好能工作。<b>这是「脆弱的设计」，审计要写进报告。</b>",
"<b>④ TASKS[name] 的值是命令，且 shell=True：</b>虽然这里命令来自内部字典，但 <code>shell=True</code> + 可扩展的字典是典型的「以后会变成漏洞」的模式。",
"<b>⑤ 日志泄露：</b>DEBUG 级别把命令和用户记进日志文件；如果日志被读取或共享，等于泄露内部信息。",
"<b>⑥ 配置问题：</b><code>secret_key</code> 硬编码且是弱值；<code>debug=True</code> 上生产；<code>host=0.0.0.0 port=80</code> 全网暴露；<b>而且还把服务跑在 80 端口、以管理员权限运行窗口</b>。",
"<b>⑦ 裸 except + 无超时：</b>subprocess 没有 timeout，任务卡死会挂住请求。",
"<b>排序建议：</b>SQL 注入（鉴权处，高危）&gt; debug 上生产（高危）&gt; 弱密钥（高危）&gt; shell=True 模式（中）&gt; 鉴权设计脆弱（中）&gt; 日志泄露（低）&gt; 无超时（低）。"],
 why:"<b>这一题的重点不是「找到洞」，而是「排序和表达」。</b>同样发现 7 个问题，报告写得好的人会说清「哪个先修、为什么」。<b>这就是审计工程师和「扫漏洞的人」的区别。</b>"
},
{
 title:"靶场 7 · 一个「图片处理」的接口",
 meta:"难度 ★★★　要求：判断能不能真的利用，说清前提条件",
 goal:"训练「不夸大也不漏报」的判断力。",
 chapters:"对应第 8、16 章",
 code:`from flask import Flask, request, jsonify
import os, uuid, imghdr

app = Flask(__name__)
TMP = "/tmp/imgproc"

@app.route("/thumbnail", methods=["POST"])
def thumbnail():
    f = request.files.get("image")
    size = request.form.get("size", "200")
    if not f:
        return jsonify(ok=False, msg="缺少文件"), 400

    ext = os.path.splitext(f.filename)[1]
    src = os.path.join(TMP, uuid.uuid4().hex + ext)
    f.save(src)

    dst = os.path.join(TMP, "thumb-" + uuid.uuid4().hex + ".jpg")
    cmd = "convert " + src + " -resize " + size + " " + dst
    os.system(cmd)
    return jsonify(ok=True, src=src, dst=dst)`,
 expect:["<b>① 命令注入：size 来自表单，直接拼进命令。</b>传入 <code>200; id</code> 这类值就可能执行额外命令。<b>这是最直接的洞，高危。</b>",
"<b>② 文件名扩展名可控（ext）：</b>攻击者可以把文件传成 .php、.jsp，然后如果这个目录可被 Web 服务解释执行，就变成上传 WebShell。<b>这里它是 TMP 目录、文件名是随机 UUID，所以「直接利用」的前提是「TMP 目录被 Web 服务暴露且可执行」——报告里要写清这个前提。</b>",
"<b>③ 没有内容校验：</b>代码 import 了 imghdr 却没用——<b>这是很典型的「作者本来想校验，后来忘了」</b>。审计时看到「导入了但没用」的校验库，往往就是漏掉的一环。",
"<b>④ 没有大小限制：</b>大文件上传可以打爆磁盘和内存。",
"<b>⑤ 路径固定 + 未清理：</b>文件永久堆积，可被用作 DoS。",
"<b>结论与前提：</b>命令注入是确定的高危；WebShell 相关结论要写清「前提条件」，不要直接说「已可 getshell」。"],
 why:"<b>审计报告里最忌「夸大」。</b>把「有前提的利用」写成「无条件利用」，会让开发在验证时发现对不上，从而怀疑整份报告。<b>「能利用到哪一步、需要什么前提」——这才是专业表达。</b>"
},
{
 title:"靶场 8 · 一个「记住我」的登录逻辑",
 meta:"难度 ★★★★　要求：找出逻辑漏洞，不只看注入",
 goal:"这段代码没有明显的注入点，但有问题。",
 chapters:"对应第 11 章（随机数）、第 19 章（会话）",
 code:`import hashlib, random, time, sqlite3
from flask import Flask, request, make_response

app = Flask(__name__)

def make_token(uid):
    rand = str(random.randint(100000, 999999))
    raw = f"{uid}:{rand}:{int(time.time())}"
    return raw + ":" + hashlib.md5(raw.encode()).hexdigest()

@app.route("/login", methods=["POST"])
def login():
    uid = request.form["uid"]
    token = make_token(uid)
    db.execute("INSERT INTO tokens (uid, token) VALUES (?, ?)", (uid, token))
    db.commit()
    resp = make_response("ok")
    resp.set_cookie("remember", token, max_age=60*60*24*365)
    return resp

@app.route("/me")
def me():
    token = request.cookies.get("remember", "")
    uid, rand, ts, sig = token.split(":")
    expect = hashlib.md5(f"{uid}:{rand}:{ts}".encode()).hexdigest()
    if sig != expect:                      # 签名校验
        return "bad token", 401
    if int(time.time()) - int(ts) > 60*60*24*365:
        return "expired", 401
    return "user " + uid`,
 expect:["<b>① 用 md5 当签名算法：</b>太弱。更关键的是——<b>密钥在哪？这里根本没有密钥</b>，签名是 <code>md5(明文)</code>。攻击者知道格式后可以自己算出任意用户（包括 admin）的合法 token。<b>这不是「签名」，是「自证」。</b>",
"<b>② 用 random 生成随机数：</b>不是密码学安全随机，可预测。<b>凡是和安全相关的随机，必须用 secrets。</b>",
"<b>③ 签名比较用 != 而不是 bcompare_digest：</b>理论上存在时序攻击（虽然在这个场景里不好利用，但属于必须改的写法）。",
"<b>④ 校验用的字段全部来自 token 自身：</b>uid 来自 token，签名也基于 token —— <b>攻击者可以自己构造一套「自洽」的 token</b>。这属于设计层面的漏洞。",
"<b>⑤ 没有校验 uid 是否存在：</b>可以伪造不存在的用户。",
"<b>⑥ token 长期有效（一年）且未绑定设备：</b>泄露后长期可用，且无法撤销（除非全量清库）。",
"<b>正确做法：</b>用带密钥的 HMAC 或框架的签名序列化（itsdangerous）；随机部分用 secrets；比较用 compare_digest；token 存库以便撤销；设置更短的有效期并在登录时轮换。",
"<b>结论：</b>会话伪造／身份认证缺陷（CWE-287、CWE-330），高危。"],
 why:"<b>这个靶场专门训练「不靠搜危险函数也能发现问题」的能力。</b>代码里没有 eval、没有 system、没有 pickle，SQL 还是参数化的——<b>但它的认证是可以伪造的。</b>逻辑漏洞和设计缺陷，只能靠「把机制想明白」发现。"
},
{
 title:"靶场 9 · 一个「导出数据」的接口",
 meta:"难度 ★★★★　要求：写出完整的攻击链（多步组合）",
 goal:"练习把多个「单独看不算致命」的问题串成一条链。",
 chapters:"对应第 12、17、19 章",
 code:`import redis, pickle, base64, hashlib
from flask import Flask, request, Response

app = Flask(__name__)
app.secret_key = "export"
r = redis.Redis(host="127.0.0.1", port=6379)

EXPORT_TPL = "uid,name,email\\n{rows}\\n"

def cache_key(uid):
    return "export:" + hashlib.md5(str(uid).encode()).hexdigest()

@app.route("/export")
def export():
    uid = request.args.get("uid", "")
    cached = r.get(cache_key(uid))
    if cached:
        rows = pickle.loads(cached)        # ①
    else:
        rows = db.execute("SELECT name, email FROM users WHERE id = ?", (uid,)).fetchall()
        r.setex(cache_key(uid), 300, pickle.dumps(rows))
    body = EXPORT_TPL.format(rows="\\n".join(str(x) for x in rows))
    return Response(body, mimetype="text/csv")

@app.route("/debug/fetch")
def dbg_fetch():
    url = request.args.get("url", "")
    return requests.get(url, timeout=5).content     # ②`,
 expect:["<b>① 把 pickle 反序列化的数据换成 Redis 里的内容 → 结合 ② 就是一条完整链：</b>",
"   <b>第 1 步：</b>访问 <code>/debug/fetch?url=http://127.0.0.1:6379/...</code>，利用 SSRF 向本机 Redis 写入数据（Redis 支持把命令写在请求路径里）。",
"   <b>第 2 步：</b>把一段恶意 pickle 写进 <code>export:&lt;md5&gt;</code> 这个缓存键。",
"   <b>第 3 步：</b>访问 <code>/export?uid=...</code>，代码从 Redis 取出缓存并 <code>pickle.loads</code>，<b>触发反序列化 → 代码执行。</b>",
"<b>② 单看 /debug/fetch：</b>url 完全可控 → SSRF（高危）。而且它没有任何鉴权，还带着 debug 前缀提示这是被遗忘的调试接口。",
"<b>③ md5 做缓存键：</b>碰撞风险（这里危害有限，但属于要改的写法）。",
"<b>④ /export 没有鉴权：</b>任何人可导出任意 uid 的数据 → 越权访问（高危）。",
"<b>⑤ CSV 公式注入：</b>如果 name/email 里有 <code>=</code> 开头的值，导出的 CSV 在 Excel 打开时可能执行公式。<b>这是检索清单里常被忘掉的一条。</b>",
"<b>修复顺序：</b>删除 /debug/fetch（或加鉴权 + 白名单）→ 缓存改用 JSON 序列化 → /export 加鉴权与归属校验 → CSV 输出对公式字符做转义。"],
 why:"<b>真实世界的高危漏洞大多是「组合拳」：</b>一个 SSRF 单独看可能只是中危，但当它后面站着一个未授权 Redis、Redis 里存着 pickle 数据，整条链就是「远程代码执行」。<b>审计时要做的正是这种串链思考——这也是本课程反复强调「把发现串起来看」的原因。</b>"
},
{
 title:"靶场 10 · 给你一段「没有明显漏洞」的代码",
 meta:"难度 ★★★★　要求：说出它安全在哪，以及还有哪些「隐患」",
 goal:"训练判断力：既不能漏报，也不能「为了交作业硬造漏洞」。",
 chapters:"综合（第 15-20 章）",
 code:`import re, hmac, hashlib, os, json
from pathlib import Path
from flask import Flask, request, abort, jsonify

app = Flask(__name__)
app.secret_key = os.environ["APP_SECRET"]

UPLOAD = Path("/srv/uploads").resolve()
ALLOWED_TYPES = {"image/png", "image/jpeg"}
SORT = {"name": "name", "time": "created_at"}
USER_IP = re.compile(r"^(\\d{1,3}\\.){3}\\d{1,3}$")

def safe_path(name):
    p = (UPLOAD / name).resolve()
    try:
        p.relative_to(UPLOAD)
    except ValueError:
        abort(400, "非法路径")
    return p

@app.route("/file")
def get_file():
    name = request.args.get("name", "")
    p = safe_path(name)
    if not p.is_file():
        abort(404)
    return p.read_bytes()

@app.route("/list")
def list_users():
    sort = SORT.get(request.args.get("sort"), "name")
    page = max(1, int(request.args.get("page", "1") or "1"))
    rows = db.execute(
        f"SELECT id, name FROM users ORDER BY {sort} LIMIT ? OFFSET ?",
        (20, (page - 1) * 20)
    ).fetchall()
    return jsonify(rows=rows)

@app.route("/verify")
def verify():
    token = request.args.get("token", "")
    expect = hmac.new(app.secret_key.encode(), b"v1", hashlib.sha256).hexdigest()
    return jsonify(ok=hmac.compare_digest(token, expect))`,
 expect:["<b>安全的地方（你要能说清为什么安全）：</b>",
"  · 路径先 resolve 再 relative_to —— <b>顺序正确</b>，能挡住 ../ 穿越。",
"  · 排序字段走 SORT 白名单映射 —— ORDER BY 位置的安全写法。",
"  · LIMIT/OFFSET 用占位符，page 用 int() 强制转换并做了下限保护。",
"  · 密钥从环境变量读（os.environ[...] 缺失会直接启动失败，比静默用弱值好）。",
"  · 签名用 hmac + compare_digest —— 常数时间比较，防时序攻击。",
"<b>仍然存在的隐患（专业审计要写这些）：</b>",
"  · <b>/file 直接返回文件内容</b>：没有鉴权、没有 Content-Type 限制，任何能访问接口的人都能下载任何文件。<b>「路径安全」不等于「访问控制安全」。</b>",
"  · <b>/verify 的签名内容是固定字符串 b\"v1\"</b>，不随用户变化 —— 那么这一次签名结果是常量，任何人拿到一次就能一直用。<b>签名必须和「被签的东西」绑定。</b>",
"  · <b>错误信息差异</b>：400 和 404 的区分，能让攻击者判断哪些文件存在（信息泄露）。",
"  · <b>没有限流</b>：/list 可以被枚举遍历全部用户；/verify 可以被暴力尝试。",
"  · <b>缺少响应头加固</b>（X-Content-Type-Options 等），以及没有统一异常处理。",
"<b>结论：</b>没有高危漏洞，但有 2 个中危（未被鉴权保护的读写接口、签名不绑定内容）与若干低危。<b>「有中低危问题的安全代码」才是常态，能准确描述它们，说明你已经是审计工程师的思维。</b>"],
 why:"<b>最后一题特意反着出：</b>前面九题都在找洞，这一题要你<b>先承认它写得不错</b>，再找出「还没做到位」的地方。<b>只会喊「有漏洞」的人做不长；能给出「安全在哪、还差在哪」的人，才是团队真正需要的审计工程师。</b>"
}
];
