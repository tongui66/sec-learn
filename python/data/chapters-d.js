// Python 学习站 · 第 15-20 章：代码审计实战
var CHAPTERS_D = [
{
id:15, title:"Python 代码审计方法论：四步法落地", stage:"代码审计",
intro:"前 14 章是「认识语言」，从这一章开始是「审代码」。<b>方法只有一套，但 Python 有自己的危险函数清单</b>——这一章把清单和流程都给你。",
sections:[
{h:"15.1 四步法（和 PHP 课完全一致）", tbl:[
["步骤","要做的动作","在 Python 里具体找什么"],
["① 找输入点","列出所有外部可控的数据来源","request.args/form/json/headers/files、input()、sys.argv、环境变量、文件名、socket 数据、第三方接口返回"],
["② 找危险函数","列出所有「能造成危害」的调用","eval / exec / os.system / subprocess / pickle / yaml.load / render_template_string / SQL 拼接 / open() 路径"],
["③ 追数据流","从输入点沿代码走到危险函数，看中间有没有有效过滤","赋值、函数调用、字典取值、类属性——每一步都算"],
["④ 定级与修复","按危害排序，给出修复代码和复测方法","写成可提交的报告（第 20 章）"]],
note:"<b>审计最核心的动作只有一个：追数据流。</b>剩下三步都是为它服务的——第一步告诉你「水从哪来」，第二步告诉你「哪里会出事」，第四步是「把发现说清楚」。<b>真正花时间的是第三步。</b>"},
{h:"15.2 Python 危险函数清单（背下来）", tbl:[
["类别","函数 / 模块","危害"],
["<b>代码执行</b>","eval、exec、compile、execfile（Py2）","任意代码执行"],
["<b>命令执行</b>","os.system、os.popen、subprocess(shell=True)、commands(Py2)","任意命令执行"],
["<b>动态导入</b>","__import__、importlib.import_module","配合拼接可加载任意模块"],
["<b>反序列化</b>","pickle.load(s)、marshal.load(s)、yaml.load（无 Loader）、shelve、jsonpickle","回连执行命令"],
["<b>模板注入</b>","render_template_string、Template(user_input)、Environment().from_string","SSTI，最终可到代码执行"],
["<b>数据库</b>","execute(f\"...\")、execute(\"...\" % x)、execute(\"...\" + x)","SQL 注入"],
["<b>网络</b>","requests.get(user_url)、urllib.urlopen(用户输入)","SSRF"],
["<b>文件</b>","open(用户路径)、shutil.copy/rmtree、send_file、Path 拼接","路径穿越、任意文件读写/删除"],
["<b>随机与哈希</b>","random 生成 token、hashlib.md5 存密码","可预测令牌、密码弱哈希"],
["<b>危险配置</b>","debug=True、verify=False、SECRET_KEY 硬编码、CORS 通配加凭证","信息泄露、中间人、会话伪造"]],
warn:"<b>这张表就是 Python 审计的「字典」。</b>你的目标不是背完，而是<b>看到这些词就条件反射地停下来问一句「它的参数是谁给的」</b>。练到这一层，读代码的速度会翻倍。"},
{h:"15.3 从输入点到危险函数的实际追踪", p:["真实代码不会把 <code>request.args['cmd']</code> 直接塞进 <code>os.system</code>。它会绕好几道弯，这些弯就是审计难点。"]},
{code:[
`# 一段故意绕弯的代码，你能追出来吗？
from flask import request
import os, base64, json

class Builder:
    def __init__(self, cfg):
        self.cfg = cfg
    def build(self, action):
        return self.cfg["template"].format(action=action)

def get_cfg():
    return json.loads(os.environ.get("BUILDER_CFG", '{"template": "echo {action}"}'))

@app.route("/run")
def run():
    raw = request.args.get("p", "")
    decoded = base64.b64decode(raw).decode()          # 第 1 道：编码
    data = json.loads(decoded)                        # 第 2 道：解析
    action = data.get("action", "")                   # 第 3 道：取值
    cmd = Builder(get_cfg()).build(action)            # 第 4 道：进构造函数
    os.system(cmd)                                    # ← 危险函数
    return "ok"

# 审计笔记应该这样写：
#   输入点：request.args["p"]
#   变换链：base64 解码 → json 解析 → 取 action 字段 → 格式化进模板
#   危险函数：os.system(cmd)
#   中间过滤：一个都没有（base64 和 json 都只是编码/解析，不是过滤！）
#   结论：命令注入，高危
#   验证：把 {"action": "1; id"} 先 base64 再请求`],
note:"<b>最常见的判断错误是「把编码当过滤」。</b>base64、urlencode、json、hex 这些只是<b>换个写法</b>，任何人都能还原。<b>凡是「可逆的变换」都不算防护。</b>真正的防护只有三类：<b>白名单、类型与范围校验、参数化（把数据和代码分开）</b>。"},
{h:"15.4 审计一个陌生项目的实操流程", ol:["<b>先跑三个工具</b>：<code>bandit -r . -ll</code>、<code>pip-audit</code>、<code>ruff check .</code>，拿到候选清单。",
"<b>画输入点地图</b>：全局搜 <code>@app.route</code> / <code>request.</code> / <code>urlpatterns</code> / <code>input(</code>，列出所有入口。",
"<b>画危险函数地图</b>：搜第 15.2 节表格里的词，标出文件和行号。",
"<b>两条线相交</b>：只盯「入口能影响到危险函数」的那些路径，其余的暂时不看——<b>这是效率的关键</b>。",
"<b>逐条确认</b>：对每条候选路径写三行笔记（输入点 / 变换链 / 有无过滤），判断成立与否。",
"<b>记录与复现</b>：能复现的写清复现步骤，不能复现的写明原因（比如「被 WAF 拦」「需要管理员权限」）。"]},
{h:"15.5 常见「伪防护」清单", tbl:[
["看起来像防护","为什么不算"],
["base64 / urlencode / hex 编码","可逆，只是换写法"],
["前端 JS 校验","请求可以绕过前端直接发"],
["只替换一个引号","可绕过（注释符、数字型注入、编码）"],
["黑名单过滤 eval","大小写、拼接、编码都能绕过，且黑名单永远不全"],
["只检查路径里有没有两个点","<code>....//</code>、URL 编码、绝对路径都能绕过"],
["把 shell=True 换成 shell=False 但仍拼字符串","列表参数若被污染仍可注入额外参数"],
["「用了 ORM」","ORM 的 raw / text 出口仍是拼接"]],
tip:"<b>看到「防护」先问一句：攻击者能不能构造出「通过检查、但仍然有害」的输入？</b>能，就是伪防护。这个问题问得越熟，审计水平越高。"}
],
secview:"这一章给你的是「审计的工作语言」：<b>输入点 → 变换链 → 危险函数 → 有无过滤 → 结论</b>。后面五章都是把这条链在具体漏洞类型上走一遍。<b>每章学完，回到「审计靶场」做对应题目。</b>"
},
{
id:16, title:"命令执行与代码执行", stage:"代码审计",
intro:"Python 里最直接的高危漏洞：<b>用户输入变成了命令，或变成了代码</b>。这一章把 eval / exec / os.system / subprocess 全部拆开讲，并给出每种情况的安全写法。",
sections:[
{h:"16.1 eval 与 exec：把字符串当代码跑", code:[
`# eval：计算一个「表达式」，返回结果
eval("1 + 2")                 # 结果是 3

# exec：执行一段「语句」，不返回值
exec("a = 1; print(a)")       # 会打印 1

# ❌ 致命写法：用户输入直接进 eval
@app.route("/calc")
def calc():
    expr = request.args.get("e", "")
    return str(eval(expr))

# 审计视角：eval 的参数一旦可控，就等于把服务器交给攻击者。
# 它能读写文件、能发网络请求、能起进程——不需要记具体载荷，记住这个结论就够。

# ✅ 安全替代一：只是想算数学表达式，就用受限的解析器
import ast, operator
OPS = {ast.Add: operator.add, ast.Sub: operator.sub,
       ast.Mult: operator.mul, ast.Div: operator.truediv}

def safe_eval(node):
    if isinstance(node, ast.Expression):
        return safe_eval(node.body)
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return node.value
    if isinstance(node, ast.BinOp) and type(node.op) in OPS:
        return OPS[type(node.op)](safe_eval(node.left), safe_eval(node.right))
    raise ValueError("不支持的表达式")

print(safe_eval(ast.parse("1 + 2 * 3", mode="eval")))   # 只允许数字和四则运算

# ✅ 安全替代二：只想把字符串变回数据结构，用字面量解析
import ast as A
data = A.literal_eval("{'a': [1, 2, 3]}")      # 只解析常量，不执行任何调用`],
note:"<b><code>ast.literal_eval</code> 和 <code>eval</code> 的区别是本质的：</b>前者只认「字面量」——数字、字符串、列表、字典、元组、布尔、None；后者什么都能跑。<b>凡是「想把字符串变回数据结构」的场景，一律用 literal_eval。</b>"},
{h:"16.2 os.system 与 os.popen：命令拼接", code:[
`import os

# ❌ 用户输入拼进命令
@app.route("/ping")
def ping():
    ip = request.args.get("ip", "")
    os.system("ping -c 1 " + ip)      # 传 127.0.0.1; id 就会额外执行 id
    return "ok"

# ❌ 更隐蔽：先「校验」再用，但校验没管住后半段
ip = request.args.get("ip", "")
if not ip.startswith("127."):         # 只限制了开头，后面随便写
    return "no"
os.system("ping -c 1 " + ip)          # 127.0.0.1; id 一样能过

# ✅ 正确写法：不经过 shell，把命令和参数分开传
import subprocess
subprocess.run(["ping", "-c", "1", ip], capture_output=True, timeout=5)
#   shell=False（默认）时，分号不会被当成命令分隔符`,
],
warn:"<b>注意：<code>subprocess</code> 不等于安全。</b>安全的不是「用了哪个模块」，而是「有没有把用户输入当成命令的一部分」。<code>shell=True</code> 会把整串交给系统 shell 解释，<b>那就回到 <code>os.system</code> 的处境了。</b>"},
{h:"16.3 subprocess 的正确与错误用法对照", tbl:[
["写法","安全吗","说明"],
["<code>run(cmd, shell=True)</code>，cmd 可控","❌ 高危","等价于 os.system，分号、管道、反引号全都能用"],
["<code>run([\"ping\", ip])</code>，ip 可控","⚠️ 仍要小心","不会命令注入，但 ip 以 <code>-</code> 开头会变成选项（参数注入）"],
["<code>run([\"ping\", \"--\", ip])</code>","✅ 较安全","<code>--</code> 之后的内容一律当操作数，挡掉参数注入"],
["<code>run([\"sh\", \"-c\", user_input])</code>","❌ 高危","绕了一圈又回到 shell"],
["<code>os.system</code> 或 <code>os.popen</code> 拼用户输入","❌ 高危","经典命令注入"]],
code:[
`# ❌ 参数注入：没有 shell，但 - 开头会被当成选项
subprocess.run(["tar", "-xf", filename])     # filename = "--checkpoint=1" 就出事了

# ✅ 先校验它是一个「纯文件名」，再用 -- 分隔
import os
if os.path.basename(filename) != filename:   # 不许带路径分隔符
    raise ValueError("非法文件名")
subprocess.run(["tar", "-xf", filename, "--"], check=True, timeout=10)

# 审计清单（subprocess 相关的红旗）：
#   1. shell=True 且参数可控
#   2. 用字符串拼命令
#   3. 参数字符串来自用户、又没有白名单或校验
#   4. 没有 timeout（进程可以挂死）
#   5. check=False 且不读 stderr（错误被吞掉）`],
},
{h:"16.4 动态导入：__import__ 与 importlib", code:[
`# ❌ 用用户输入做模块名
mod = request.args.get("m")
__import__(mod)                       # 可以加载任意已安装模块
importlib.import_module(mod)

# ❌ 更危险：拼接后调用它的属性
getattr(__import__("os"), request.args.get("f"))(...)

# ✅ 白名单映射：把「名字」翻译成「固定的函数对象」
ACTIONS = {"a": do_a, "b": do_b}
fn = ACTIONS.get(request.args.get("act"))
if fn is None:
    abort(400)
fn()

# ✅ 如果必须动态加载插件：限制包名前缀
if not name.startswith("myapp.plugins."):
    raise ValueError("非法插件")
importlib.import_module(name)`],
note:"<b>审计时的搜索词：<code>__import__(</code>、<code>import_module(</code>、<code>getattr(</code>、<code>setattr(</code>、<code>globals()</code>、<code>locals()</code>、<code>vars()</code>。</b>这些统称「反射」——它们让代码「按名字执行东西」。<b>只要名字可控，就等于代码执行。</b>"},
{h:"16.5 为什么「过滤字符」不算修复", code:[
`# ❌ 黑名单：看起来在防命令注入
def bad_filter(s):
    for ch in [";", "|", "&", "$"]:
        if ch in s:
            return None
    return s

# 绕过思路（理解原理即可，不用背载荷）：
#   - 换行符同样能分隔命令
#   - 未列入黑名单的分隔符还有若干个
#   - 变量替换、命令替换都能拼出命令
#   - 编码后再解码（把命令 base64 后交给一个能解码执行的程序）
#   - 换个入口：另一个没过滤的参数、另一个接口

# ✅ 正确的修复方向是「不给危险能力」：
#   1. 用参数列表调用，绝不用 shell
#   2. 参数值走白名单（例如 IP 必须匹配 IPv4 正则）
#   3. 能用库函数就不用外部命令
import re
IPV4 = re.compile(r"^(\\d{1,3}\\.){3}\\d{1,3}$")
if not IPV4.fullmatch(ip):
    abort(400)
subprocess.run(["ping", "-c", "1", ip], shell=False, timeout=5)`],
tip:"<b>修复的通用心法：把「过滤输入」改成「收回危险能力」。</b>能不用 eval 就不用、能不用 shell 就不用 shell、能传列表就不拼字符串。<b>减少危险能力，比增加过滤规则可靠得多。</b>"}
],
secview:"命令执行与代码执行的审计要点：<b>看到 eval/exec/os.system/os.popen/subprocess/__import__/getattr，先看参数是谁给的；再看它是「收回了危险能力」还是只做了字符过滤。</b>"
},
{
id:17, title:"反序列化：pickle 为什么是重灾区", stage:"代码审计",
intro:"Python 的 pickle 有一个设计上就无法回避的问题：<b>反序列化的过程本身就能执行代码</b>。这一章讲清原理、识别方法和替代方案。",
sections:[
{h:"17.1 序列化与反序列化是什么", code:[
`# 序列化：把内存里的对象变成「能存、能传」的字节或字符串
# 反序列化：反过来，把字节还原成对象

import pickle, json

data = {"name": "tom", "scores": [90, 85]}

b = pickle.dumps(data)          # → bytes
print(pickle.loads(b))          # → {'name': 'tom', 'scores': [90, 85]}

# json 也能做类似的事，而且更安全
print(json.dumps(data))         # 字符串
print(json.loads(json.dumps(data)))

# 关键差别：
#   json   只能表达「基础类型」：数字、字符串、列表、字典、布尔、None
#   pickle 能表达「任意 Python 对象」，包括「怎么构造这个对象」的指令
#          ← 正是这几条指令，让反序列化本身就能执行代码`],
},
{h:"17.2 为什么 pickle 能执行代码（原理）", p:["pickle 的字节流是一串<b>操作码</b>。其中有一个操作码的语义是：<b>「取出一个可调用对象和它的参数，调用它」</b>。",
"所以只要字节流里出现「某个能执行命令的函数」加「一条命令字符串」，<b>反序列化那一刻命令就被执行了</b>——不需要受害者调用任何函数。"]},
{code:[
`# 这是一个「说明性」的示意，不是可用载荷。
# 一个恶意的 pickle 字节流，核心结构大致是：
#   1. 指定一个可调用对象（例如某个能执行命令的函数）
#   2. 压入它的参数（例如一条命令字符串）
#   3. 调用它
#   4. 把调用结果当成「反序列化出来的对象」返回
#
# 关键在于：整个过程发生在 load() 内部，
# 受害者的代码可能只有一行 pickle.loads(user_data)，看不出任何危险。

# 类对象还能「定制自己的反序列化行为」：
class Demo:
    def __reduce__(self):
        # __reduce__ 返回 (可调用对象, 参数元组, ...)
        # pickle 在「序列化」时记录它，在「反序列化」时执行它
        return (print, ("反序列化时我被调用了",))

pickle.loads(pickle.dumps(Demo()))     # 会打印：反序列化时我被调用了`],
warn:"<b>把这句话刻在脑子里：<code>pickle.loads()</code> 对不可信数据来说，等价于 <code>eval()</code>。</b>这是官方文档里明确写过的结论，不是传言。所以审计时只要看到「用户可控的数据」加「pickle.loads」，直接判高危，不需要再论证能不能利用。"},
{h:"17.3 出现 pickle 的常见位置", tbl:[
["场景","典型代码","风险"],
["Cookie / Session","<code>pickle.loads(base64.b64decode(cookie))</code>","❌ 极高（用户直接可控）"],
["缓存","<code>cache.get(key)</code> 内部用 pickle 反序列化","取决于缓存是否被污染、Redis 是否有弱口令"],
["消息队列","任务参数用 pickle 传递","⚠️ 队列被攻破即代码执行"],
["Redis / Memcached 存储对象","<code>pickle.loads(redis.get(k))</code>","⚠️ 存储被污染（例如 SSRF 打 Redis）即 RCE"],
["模型文件","<code>torch.load()</code> / <code>joblib.load()</code>","⚠️ 下载来的模型文件可能是恶意的"],
["Celery","broker 消息用 pickle 序列化","⚠️ 需要配置可信 broker"]],
note:"<b>注意这条链子：第 12 章学的 SSRF + 这一章的 pickle + Redis 未授权 = 完整的远程代码执行。</b>真实世界的漏洞常常是「两个看似不严重的问题拼起来」才致命的——<b>所以审计时要把发现串起来看，而不是一条条孤立地评估。</b>"},
{h:"17.4 yaml.load 与 marshal 的坑", code:[
`import yaml

# ❌ 老写法：yaml.load 默认用全功能 Loader，能构造任意对象
data = yaml.load(user_input)                       # 危险

# ⚠️ 有些版本默认已是 SafeLoader，但这依赖版本，不能赌
data = yaml.load(user_input, Loader=yaml.Loader)    # 明确危险

# ✅ 永远显式指定安全加载器
data = yaml.safe_load(user_input)
# 或者：yaml.load(user_input, Loader=yaml.SafeLoader)

# ❌ marshal 与 pickle 同类：也能在反序列化时构造对象
import marshal
marshal.loads(user_bytes)

# ✅ 替代方案（按推荐程度排序）
#   json.loads            最安全，只支持基础类型
#   yaml.safe_load        需要 yaml 的可读性时用
#   pydantic / msgspec    带模式校验的解析
#   protobuf / msgpack    二进制场景，注意用安全模式`],
tip:"<b>审计搜索词：<code>pickle.load</code>、<code>pickle.loads</code>、<code>yaml.load</code>、<code>marshal.load</code>、<code>shelve.open</code>、<code>__reduce__</code>、<code>__setstate__</code>、<code>dill.load</code>、<code>joblib.load</code>、<code>torch.load</code>、<code>jsonpickle.decode</code>。</b>把这串词存进你的审计速查表，接到项目先搜一遍。"},
{h:"17.5 签名救不了——除非签名的是安全格式", code:[
`# ❌ 常见误区：「数据我签名了，所以安全」
#    签名只能保证「没被篡改」，不能保证「内容没有被执行过」，
#    而且如果你先反序列化再验签，攻击在验签之前就已经发生。

# ❌ 错的顺序
obj = pickle.loads(cookie)          # ← 这一步可能已经执行了代码
if not verify(obj): return "bad"    # 验签来得太晚

# ✅ 正确做法一：用 JSON 加签名（数据格式本身无副作用）
import hmac, hashlib, base64, json
def load_signed(token, key):
    raw_b64, sig = token.split(".")
    raw = base64.urlsafe_b64decode(raw_b64)
    expect = hmac.new(key, raw, hashlib.sha256).digest()
    if not hmac.compare_digest(expect, base64.urlsafe_b64decode(sig)):
        raise ValueError("签名不对")
    return json.loads(raw)          # json 解析没有副作用

# ✅ 正确做法二：用框架自带的签名序列化（Flask 的 itsdangerous）
from itsdangerous import URLSafeTimedSerializer
s = URLSafeTimedSerializer(SECRET_KEY)
data = s.loads(token, max_age=3600)   # 内部仍是 JSON，而且带超时`],
note:"<b>顺序很重要：先验完整性，再解析内容。</b>而且<b>解析的内容必须是「无副作用」的格式</b>。两条同时满足，才算真正解决问题。"}
],
secview:"反序列化的审计要点：<b>凡是 <code>pickle.load(s)</code>、<code>yaml.load</code> 不带安全 Loader、<code>marshal.loads</code>，只要数据来源不可信，一律高危。</b>修复方向是<b>换成 json 加签名</b>，而不是「过滤一下输入」。"
}
,
{
id:18, title:"SSTI：模板注入与 Jinja2", stage:"代码审计",
intro:"Web 应用里另一条通往代码执行的经典路径：<b>把用户输入当成模板来渲染</b>。这一章讲 Flask 加 Jinja2 的场景，以及它的防御。",
sections:[
{h:"18.1 模板引擎是干什么的", code:[
`# 模板：把「固定的页面骨架」和「变化的数据」拼起来
from jinja2 import Template

t = Template("你好，{{ name }}！你有 {{ count }} 条消息。")
print(t.render(name="tom", count=3))

# Flask 里的常规用法（安全）
from flask import Flask, render_template
app = Flask(__name__)

@app.route("/hello/<name>")
def hello(name):
    return render_template("hello.html", name=name)     # ← 模板是「文件」，不是用户输入
# hello.html 里写：你好，{{ name }}
# 安全的原因：{{ name }} 里的内容只会被当「数据」填进去，
#            不会被当成模板语法再解释一遍`],
},
{h:"18.2 漏洞怎么产生：把输入当模板", code:[
`# ❌ 危险写法：模板字符串本身来自用户
from flask import request, render_template_string

@app.route("/greet")
def greet():
    name = request.args.get("name", "")
    return render_template_string("你好，" + name + "！")
    # 攻击者在 name 里写模板语法，就会被真的当成模板执行

# ❌ 同样危险的几种写法
render_template_string(request.args.get("tpl"))
Template(user_input).render()
Environment().from_string(user_input).render()

# ✅ 正确写法：模板固定，数据通过变量传入
@app.route("/greet_safe")
def greet_safe():
    name = request.args.get("name", "")
    return render_template_string("你好，{{ name }}！", name=name)
    #                                  ↑ 模板写死在这里，用户输入只做「值」`],
note:"<b>一句话区分安全与危险：模板字符串里有没有用户输入？</b>没有 → 安全（用户输入只当数据）；有 → SSTI（用户输入当代码）。<b>这和 SQL 注入的判别逻辑一模一样：数据有没有被拼进「语言」里。</b>"},
{h:"18.3 为什么 SSTI 能升级成代码执行", p:["模板语言本身就有「访问对象属性、调用方法」的能力，目的是让模板能读数据。但如果这条对象链能被攻击者自由地走，他就能<b>从模板对象出发，一路走到 Python 的内置函数</b>。"]},
{code:[
`# 理解路径（不用记具体载荷，理解「链」这个概念）：
#   模板对象 → 上下文里的类 → 某个类的全部子类 → 找到能执行命令的类 → 构造调用
#
# 也正因为如此，沙箱很关键：
#   Jinja2 提供 SandboxedEnvironment，会限制可访问的属性和可调用的方法，
#   把上面这条链基本掐断（但不是绝对安全，仍要谨慎）。

from jinja2.sandbox import SandboxedEnvironment

env = SandboxedEnvironment()
# ✅ 在必须渲染「半可信模板」时，用沙箱环境
print(env.from_string("{{ 1 + 1 }}").render())

# 但更重要的原则是：
#   ❌ 不要渲染用户提供的模板内容
#   ✅ 把「模板选择」做成白名单，用户只能从固定模板里挑一个`],
},
{h:"18.4 防御的四个层次", tbl:[
["层次","做法","说明"],
["<b>根本</b>","不让用户输入成为模板内容","模板文件写死，用户输入只用变量传入"],
["<b>次选</b>","用户能选模板时用白名单","<code>TPL = {\"a\": \"a.html\"}</code>，再 <code>render_template(TPL[key])</code>"],
["<b>兜底</b>","必须渲染动态模板时用沙箱","<code>SandboxedEnvironment</code>，并限制可用过滤器与全局函数"],
["<b>加固</b>","关掉 debug、限制模板来源目录","开发模式下的调试器本身就是一个「交互式执行入口」"]],
warn:"<b>顺带记一个真实世界的要点：Flask 的 <code>debug=True</code> 会开启 Werkzeug 调试器，页面出错时会提供一个可以输入代码执行的控制台。</b>所以「生产环境开着 debug」本身就是高危配置——<b>这也解释了为什么第 19 章把它单独列成一条。</b>"},
{h:"18.5 三种注入其实是同一件事", tbl:[
["语言","数据拼进去的地方","危险函数"],
["SQL","字符串拼进 SQL 语句","<code>execute(\"SELECT ...\" + x)</code>"],
["Shell","字符串拼进命令行","<code>os.system(\"ping \" + x)</code>"],
["模板","字符串拼进模板源码","<code>render_template_string(\"...\" + x)</code>"],
["代码","字符串拼进代码并执行","<code>eval(x)</code> 或 <code>exec(x)</code>"]],
tip:"<b>这就是为什么「审计方法论」只有一套。</b>你只需要问两句话：<b>这段代码在哪个「语言」里拼字符串？这个语言会不会「解释执行」内容？</b>两个答案都是「是」，就是注入。<b>学会这个统一视角，你就能审你没见过的语言。</b>"}
],
secview:"SSTI 的审计要点：<b>搜 <code>render_template_string</code>、<code>Template(</code>、<code>from_string</code>、<code>render_template(</code>（看第二个参数是不是用户可控）；确认「模板内容里有没有用户输入」。</b>修复方向是模板固定加白名单。"
},
{
id:19, title:"框架与依赖供应链", stage:"代码审计",
intro:"Python 的 Web 项目几乎都跑在框架上。<b>框架默认是安全的，出事大多因为「配置写错」或「开发者误用」</b>。这一章把 Flask、Django 的高频坑和依赖供应链风险过一遍。",
sections:[
{h:"19.1 Flask 的六条高危配置", tbl:[
["配置","危险点","正确做法"],
["<code>debug=True</code>","调试器可执行代码、泄露源码和变量","生产环境必须 <code>debug=False</code>"],
["<code>SECRET_KEY</code> 硬编码或弱值","可伪造 session、可签名任意数据","从环境变量读，用 <code>secrets.token_hex(32)</code> 生成"],
["<code>session</code> 里放敏感数据","Flask 默认 session 是<b>签名但不加密</b>的，用户能解码看到内容","只存 ID 或标志位，敏感数据放服务端"],
["<code>send_file(用户路径)</code>","路径穿越，任意文件下载","路径 resolve 后校验是否在允许目录内"],
["<code>render_template_string</code>","SSTI（第 18 章）","模板固定，输入只做变量"],
["CORS 通配加凭证","手写响应头时可能允许任意站点带凭证访问","明确列出允许的来源"]],
code:[
`# ❌ 一眼高危的 Flask 配置
app = Flask(__name__)
app.secret_key = "dev"                       # 弱密钥 → 可伪造 session
app.run(debug=True, host="0.0.0.0")          # 调试器暴露到公网

# ✅ 正确写法
import os, secrets
app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET") or secrets.token_hex(32)
app.config["DEBUG"] = False
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SECURE"] = True    # 仅 HTTPS 传输
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

# 审计搜索词：
#   debug=True   secret_key =   app.run(   SESSION_COOKIE_   CORS(
#   send_file(   send_from_directory(   make_response`],
note:"<b>「Flask 的 session 是签名不是加密」这一条要特别记住。</b>Cookie 里的内容用 base64 就能看到——所以<b>把「是不是管理员」这种字段放进 session，等于明码告诉用户你的内部逻辑</b>（虽然改不了，但信息泄露本身就值钱）。"},
{h:"19.2 Django 的高频坑", tbl:[
["配置或写法","危险点"],
["<code>DEBUG = True</code> 上线","报错页泄露全部配置、环境变量、源码片段"],
["<code>ALLOWED_HOSTS = ['*']</code>","Host 头攻击（用于密码重置链接投毒）"],
["<code>SECRET_KEY</code> 进仓库","session、密码重置令牌、签名全部可伪造"],
["随手加 <code>@csrf_exempt</code>","CSRF 防护失效"],
["<code>User.objects.raw(f\"...\")</code>","ORM 出口的 SQL 注入"],
["滥用 <code>mark_safe()</code> 或模板里的 <code>safe</code> 过滤器","模板自动转义被关闭 → XSS"],
["<code>JsonResponse</code> 用 <code>safe=False</code> 且数据可控","响应类型被改变，可能导致 XSS"]],
code:[
`# Django settings.py 审计清单
#   DEBUG = ?                     → 必须 False
#   SECRET_KEY = ?                → 必须来自环境变量
#   ALLOWED_HOSTS = ?             → 不能是 ['*']
#   CSRF_COOKIE_SECURE / SESSION_COOKIE_SECURE → 建议 True
#   SECURE_SSL_REDIRECT           → 建议 True
#   X_FRAME_OPTIONS               → 建议 DENY
#   CORS_ORIGIN_ALLOW_ALL         → 建议 False

# 模板里的红旗（XSS 相关）
#   {{ user_input|safe }}          ← 关闭转义，用户输入可控就变 XSS
#   {% autoescape off %}           ← 整块关闭转义
#   mark_safe(user_input)          ← 代码里关闭转义`],
tip:"<b>Django 的模板默认会自动转义，这是它比手写 HTML 安全的地方。</b>审计时就找「主动把转义关掉的代码」——模板里的 safe 过滤器、<code>mark_safe</code>、<code>autoescape off</code>，这三处是 XSS 的主要来源。"},
{h:"19.3 依赖供应链：pip 装的东西也是你的代码", p:["你的项目 <code>import</code> 的第三方包，运行在你的权限下。<b>一个包被投毒，等于你在自己服务器上运行了攻击者的代码。</b>常见形态："]},
{tbl:[
["风险","说明","怎么防"],
["<b>依赖混淆</b>","内部包名与公网包重名，pip 优先装到公网那个","内部源优先、锁定索引地址"],
["<b>抢注与投毒包</b>","名字和热门包只差一个字母","锁死版本与来源，谨慎审查新增依赖"],
["<b>版本不固定</b>","不写版本号，哪天上游被投毒就中招","用 requirements.txt 锁版本加哈希校验"],
["<b>已知漏洞</b>","依赖里有历史 CVE","<code>pip-audit</code> 或 <code>safety check</code> 定期扫"],
["<b>setup.py 会执行代码</b>","<code>pip install</code> 时会执行它","尽量只装 wheel，审查来源"]],
code:[
`# ❌ requirements.txt 不锁版本：每次安装结果都可能不同
requests
flask

# ✅ 锁版本
requests==2.32.3
flask==3.0.3

# ✅ 更好：锁版本加文件哈希（防止包被替换）
# requests==2.32.3 --hash=sha256:...

# 生成锁文件（推荐 pip-tools 或 uv）
#   pip freeze > requirements.txt
#   pip install pip-tools && pip-compile requirements.in

# 扫描依赖漏洞
pip-audit
safety check

# 审计时看什么：
#   1. requirements.txt 有没有锁版本
#   2. 有没有来源不明的包（名字奇怪、下载量极低）
#   3. 有没有本地 .whl 文件（可能被篡改）
#   4. CI 脚本里有没有「直接下载网上脚本并执行」的写法`],
warn:"<b>审计报告里，「依赖版本不锁」属于必须提的中危问题</b>——它现在可能没有漏洞，但它让「未来某天被投毒」变成必然。<b>安全不只是「现在没洞」，还包括「以后不容易出洞」。</b>"},
{h:"19.4 部署与运行环境的安全点", tbl:[
["项","风险","建议"],
["<code>host=\"0.0.0.0\"</code>","服务暴露到所有网卡","确实需要对外才用，并配合防火墙"],
["用 Flask 自带服务器跑生产","性能差、不稳定、部分防护缺失","gunicorn 或 uwsgi 加 nginx"],
["容器以 root 运行","容器逃逸后影响整个宿主机","Dockerfile 里指定非 root 用户"],
["密钥写进 Dockerfile 或 ENV","镜像分层里能读出来","运行时注入（K8s secret、环境变量）"],
["日志写到 stdout 且含敏感信息","被采集系统全量留存","脱敏后再输出"],
["反向代理没设请求体大小上限","大文件上传打爆内存","nginx 配置 client_max_body_size"]],
tip:"<b>审计一个项目时，「配置类问题」往往比「代码类问题」更容易漏。</b>建议单开三张检查表：框架配置（debug、密钥、host、会话、CORS）、部署配置（容器用户、端口、日志、体积上限）、依赖（锁版本、来源、CVE）。<b>这三张表走完，项目的地基就检查过了。</b>"}
],
secview:"框架与供应链的审计要点：<b>先看配置（debug、密钥、host、会话、CORS），再看依赖（锁版本、来源、CVE），最后看部署（容器用户、反代上限）。</b>这部分发现问题快、收益高，是审计最该先做的。"
}
,
{
id:20, title:"实战与报告：把发现变成价值", stage:"代码审计",
intro:"最后一章：<b>把前面 19 章的能力合成一次完整交付</b>。三个实战场景，加一份报告模板和复测方法。学完这一章，你就具备了独立审计一个小项目的能力。",
sections:[
{h:"20.1 实战一：审计一个 Flask 小应用", code:[
`# app.py —— 一份刻意埋了多处问题的代码，先自己审一遍再往下看
from flask import Flask, request, render_template_string, send_file, session
import os, sqlite3, subprocess, pickle, base64

app = Flask(__name__)
app.secret_key = "dev-key"
DB = "app.db"

@app.route("/")
def index():
    name = request.args.get("name", "游客")
    return render_template_string("<h1>你好，" + name + "</h1>")

@app.route("/login", methods=["POST"])
def login():
    u = request.form["u"]; p = request.form["p"]
    cur = sqlite3.connect(DB).cursor()
    row = cur.execute(f"SELECT id FROM users WHERE name='{u}' AND pwd='{p}'").fetchone()
    if row:
        session["uid"] = row[0]
        return "ok"
    return "fail"

@app.route("/ping")
def ping():
    ip = request.args.get("ip", "")
    return subprocess.check_output("ping -c 1 " + ip, shell=True)

@app.route("/download")
def download():
    f = request.args.get("f", "")
    return send_file(os.path.join("/srv/files", f))

@app.route("/load")
def load():
    data = base64.b64decode(request.args.get("d", ""))
    return str(pickle.loads(data))

app.run(debug=True, host="0.0.0.0")`],
tbl:[
["位置","问题","类型","等级"],
["<code>/</code>","模板字符串拼用户输入 → <b>SSTI，最终到代码执行</b>","模板注入","高"],
["<code>/login</code>","f-string 拼 SQL → 注入；明文密码比较","SQL 注入","高"],
["<code>/login</code> 登录成功","未重新生成会话 ID → 会话固定","会话安全","中"],
["<code>/ping</code>","<code>shell=True</code> 加字符串拼接 → 命令注入","命令注入","高"],
["<code>/download</code>","路径拼用户输入 → 任意文件下载","路径穿越","高"],
["<code>/load</code>","<code>pickle.loads</code> 处理用户数据 → 代码执行","反序列化","高"],
["<code>secret_key=\"dev-key\"</code>","弱密钥 → 会话可伪造","配置","高"],
["<code>debug=True</code> 加 <code>0.0.0.0</code>","调试器暴露 → 信息泄露与代码执行","配置","高"]],
note:"<b>数一数：这一个 30 行的文件里有 8 个问题、其中 6 个高危。</b>这就是「代码审计」值钱的原因——<b>不是找出一个巧妙的洞，而是系统性地把所有问题一次性找全。</b>"},
{h:"20.2 实战二：审计一个「看起来没问题」的工具脚本", code:[
`# backup.py —— 一个备份脚本，问题不在明显的危险函数里
import os, tarfile, logging, requests

logging.basicConfig(level=logging.INFO)

def do_backup(src_dir, out_dir, webhook=None):
    name = os.path.basename(src_dir) or "backup"
    out = os.path.join(out_dir, name + ".tar.gz")

    with tarfile.open(out, "w:gz") as t:
        t.add(src_dir)

    if webhook:
        requests.get(webhook, params={"file": out}, timeout=None)

    return out

if __name__ == "__main__":
    import sys
    do_backup(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)`],
tbl:[
["位置","问题","为什么值钱"],
["<code>basename(src_dir)</code>","若路径末尾带分隔符，basename 返回空，退化成默认名","看似无害的边界条件，可能覆盖预期文件名"],
["<code>t.add(src_dir)</code>","src_dir 若指向 <code>/</code> 或符号链接，会把系统文件打进包里","符号链接穿越：打包时跟随链接，把敏感文件带进压缩包"],
["<code>timeout=None</code>","等于没有超时，可被挂死","这类「显式写成 None」的问题最容易被漏掉"],
["<code>webhook</code> 来自 argv","URL 可控就是 SSRF","命令行参数也是输入点，很多人只记得 HTTP 参数"],
["<code>sys.argv</code> 直接使用","没有参数校验","定时任务与 CI 里的参数常被误认为「内部可信」"]],
note:"<b>这个实战的意义：</b>没有 eval、没有 os.system、没有 pickle，但依然有问题。<b>审计不是「搜危险函数」就完了——搜完只是拿到候选项，真正的判断要回到「这个值是谁给的、有没有边界校验」。</b>"},
{h:"20.3 实战三：审计一个真实开源项目（你的作业）", ol:["<b>选一个项目</b>：GitHub 上搜 <code>language:python stars:&gt;100</code>，挑一个你感兴趣的（爬虫、CLI 工具、小 Web 服务都行）。",
"<b>跑工具</b>：<code>bandit -r . -ll</code>、<code>pip-audit</code>，把输出保存下来。",
"<b>画两张地图</b>：输入点地图加危险函数地图（第 15.4 节的流程）。",
"<b>追 5 条数据流</b>：不要贪多，先认真追 5 条，追不完的先记下来。",
"<b>写报告</b>：用下一节的模板，至少写 3 条发现（哪怕其中 2 条是「确认无问题」，那也是交付的一部分）。",
"<b>对照</b>：去这个项目的 GitHub Issues 搜 <code>security</code>，看有没有人报过类似问题。<b>这一步能校准你的判断力。</b>",
"<b>如果找到真实漏洞</b>：走负责任披露流程——先私下联系维护者，给 90 天修复期，<b>不要公开利用细节</b>。"]},
{h:"20.4 报告模板（可直接套用）", code:[
`# 漏洞报告模板

## 1. 概要
- 项目名 / 版本 / 审计范围（哪些文件、哪些功能）
- 审计时间、审计人
- 结论摘要：共发现 N 个问题（高 X / 中 Y / 低 Z）

## 2. 漏洞详情（每个问题一份）
### 2.1 【高危】/ping 接口命令注入
- **类型**：OS Command Injection（CWE-78）
- **位置**：app.py:24
- **问题代码**：命令拼接用户输入，且 shell=True
- **数据流**：
    request.args["ip"] → 字符串拼接 → subprocess.check_output(shell=True)
- **中间过滤**：无
- **复现步骤**：
    1. 启动服务：flask --app app run
    2. 发送请求：GET /ping?ip=127.0.0.1;id
    3. 观察响应中包含命令输出
- **影响**：任意命令执行，可读写文件、横向移动
- **修复建议**：先做 IPv4 格式校验，再用参数列表调用、shell=False、加 timeout
- **复测方法**：修复后重放同一请求，应返回 400 或命令未执行
- **参考**：CWE-78 / OWASP A03:2021

## 3. 加固建议（整体层面）
- 统一输入校验入口
- 配置检查表（debug、密钥、host、会话、CORS）
- 依赖锁版本加定期扫描
- 把攻击用例写进 CI 测试

## 4. 附录
- 工具输出（bandit / pip-audit）
- 已确认「看似可疑但实际安全」的点（避免下次重复排查）`],
tip:"<b>报告里最容易被忽略、但最专业的两个部分：</b>① <b>复测方法</b>（证明修复有效）；② <b>「已排查但无问题」的清单</b>（让下一次审计的人不用重走一遍）。<b>这两部分会让你的报告从「一堆截图」变成「可交付的工程文档」。</b>"},
{h:"20.5 学完之后怎么继续变强", ol:["<b>保持清单更新</b>：把工作中遇到的新危险函数、新模式加进速查表（本站速查页就是起点）。",
"<b>拆解真实漏洞</b>：读 CVE 详情和开源项目的安全公告，把「漏洞代码 → 触发条件 → 修复 diff」抄进笔记。",
"<b>练小项目</b>：每周审一个几百行的小项目，重点在<b>写报告</b>，而不是「找到洞」。",
"<b>写安全代码</b>：用自己修过的方式写代码，把攻击用例写成测试。<b>会防的人，比只会攻的人稀缺。</b>",
"<b>回看自测清单</b>：首页那 12 条精通自测，每季度重做一遍，看自己退步了没有。"]}
],
secview:"20 章到这里结束。<b>你已经有了：语言基础、标准库与工程能力、Python 危险函数清单、四类高危漏洞的原理与修复、一套可复用的审计流程和报告模板。</b>接下来就是练——<b>去「审计靶场」把每一段代码审一遍，然后找一个真实开源项目，走完一次完整交付。</b>"
}
];
