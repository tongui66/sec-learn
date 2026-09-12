// Python 学习站 · 实验手册（12 个动手实验）
var LABS = [
{
 title:"实验 1 · 环境打通：py 命令与虚拟环境",
 meta:"难度 ★☆☆　用时 20 分钟　环境：本机 Windows（不需要虚拟机）",
 goal:"用 py 命令跑起第一个程序，建好虚拟环境并激活，确认后续实验有干净的环境。",
 env:"本机已装 Python 3.14。注意：直接敲 python 会跳到微软商店，要用 py。",
 steps:["打开 PowerShell，敲 <code>py --version</code>，应该看到 Python 3.14.3。",
"再敲一次 <code>python --version</code>，看看会发生什么——<b>这就是「命令被占位符拦截」的样子，以后看到它就知道是环境问题，不是代码问题。</b>",
"新建文件夹 <code>E:\\python-study</code>，在里面敲 <code>py -m venv .venv</code> 建虚拟环境。",
"激活：<code>.venv\\Scripts\\activate</code>。激活后提示符前面会出现 (.venv)。",
"在文件夹里建 hello.py，内容见下，然后 <code>py hello.py</code> 运行。",
"故意写错一处（比如少一个引号），再运行，<b>认真读一遍报错信息</b>——报错里会指出文件名和行号。"],
 code:`# hello.py —— 第一个程序
print("Hello, Python!")

name = "同学"
print(f"欢迎，{name}！")

# 看看自己在哪个 Python 里跑
import sys
print("解释器路径：", sys.executable)
print("版本：", sys.version)

# 交互式：直接敲 py 回车会进入 REPL，可以一行行试
# 退出用 exit() 或 Ctrl+Z 回车`,
 verify:["<code>py --version</code> 输出 3.14.3","激活虚拟环境后提示符出现 (.venv)","<code>py hello.py</code> 能打印出中文（不乱码）","看懂了至少一条报错信息的结构：文件名 + 行号 + 错误类型"],
 undo:["无需回滚。不想用这个环境时直接关掉终端窗口即可（虚拟环境是文件夹，删掉不影响系统 Python）。"],
 why:"环境是第一个坎。<b>这个实验特意让你先「故意写错一次」，就是为了让你习惯报错</b>——后面每个实验都会遇到报错，能读懂报错的人才走得远。",
 tip:"如果 <code>py</code> 也报错，用 <code>where.exe py</code> 看它来自哪里。确实是安装问题时，去 python.org 重装并勾选 Add to PATH。"
},
{
 title:"实验 2 · 类型与比较：Python 和 PHP 的差别在哪",
 meta:"难度 ★★☆　用时 20 分钟　环境：本机 Python",
 goal:"亲手验证 Python 不做隐式类型转换，理解「弱类型绕过」在 Python 里为什么行不通。",
 env:"本机虚拟环境。",
 steps:["写一个 compare.py，把下面几组比较都跑一遍。",
"注意 0 == 'abc' 在 PHP 里是 true，在 Python 里是 False——<b>这就是两种语言最直观的差别。</b>",
"再试一组：'10' == 10 的结果是什么？为什么？",
"故意写 <code>'10' + 10</code>，看它报什么错。这就是「动态强类型」的表现。",
"把每一组的结果记在笔记里，标注「PHP 会怎样 / Python 会怎样」。"],
 code:`# compare.py
print(0 == "abc")          # Python: False（PHP 里是 true）
print("10" == 10)          # False：类型不同，直接不相等
print(1 == True)           # True：bool 是 int 的子类
print(0 == False)          # True

# 隐式转换不存在
try:
    print("10" + 10)
except TypeError as e:
    print("报错：", e)      # can only concatenate str (not "int") to str

# 但安全风险并没有消失——它转移到了别的地方
# 比如「比较运算符用错」，或者「类型混淆」导致的逻辑绕过：
user_input = "0"           # 看起来像数字的字符串
if user_input:             # 非空字符串为真！这是常见坑
    print("进入了分支")

# 安全判断推荐写法
if user_input.strip() != "":
    print("确实非空")`,
 verify:["确认 0 == 'abc' 在 Python 里是 False","能解释 '10' == 10 为什么是 False","看到了 TypeError 的报错信息","能把「PHP 会怎样 / Python 会怎样」写进笔记"],
 undo:["无需回滚。"],
 why:"<b>「Python 更安全」这个说法只对了一半。</b>弱类型绕过在 Python 里确实不成立，但「非空字符串为真」「bool 是 int 子类」这类坑依然存在。<b>审计的判断力来自「亲手验证过」，不是「记得有这回事」。</b>"
},
{
 title:"实验 3 · 容器与推导式：把数据处理好",
 meta:"难度 ★★☆　用时 25 分钟　环境：本机 Python",
 goal:"熟练使用列表/字典/集合推导式、切片和解包，能读懂别人写的紧凑 Python 代码。",
 env:"本机虚拟环境。",
 steps:["写 containers.py，把下面的例子都跑一遍。",
"把每个推导式改写成等价的 for 循环，<b>确认你读得懂它。</b>",
"自己加一个练习：从一份「用户名列表」里筛出长度大于 5 且不含数字的名字。",
"试试字典推导式，把两个列表组成「名字 → 分数」的字典。"],
 code:`# containers.py
nums = [1, 2, 3, 4, 5, 6]

print([n * 2 for n in nums])                 # 列表推导式
print({n: n * n for n in nums})              # 字典推导式
print({n % 3 for n in nums})                 # 集合推导式（自动去重）
print([n for n in nums if n % 2 == 0])       # 带条件

# 切片
s = "abcdefg"
print(s[2:5], s[::-1], s[-3:])

# 解包
a, b, *rest = nums
print(a, b, rest)

# 等价的 for 循环（理解用）
out = []
for n in nums:
    out.append(n * 2)
print(out)

# 练习：筛出长度 > 5 且不含数字的名字
names = ["alice", "bob123", "charlotte", "dave9"]
ok = [x for x in names if len(x) > 5 and not any(c.isdigit() for c in x)]
print(ok)`,
 verify:["能写出三种推导式","能把推导式翻译成 for 循环","能解释 nums[-3:] 的结果","自己的练习输出 ['charlotte']"],
 undo:["无需回滚。"],
 why:"推导式是 Python 代码里出现频率极高的写法，也是审计时「一眼看过去不知道在干嘛」的主要来源。<b>能把它在脑子里展开成循环，读代码速度会明显提升。</b>",
 tip:"看到 <code>any(...)</code> 和 <code>all(...)</code> 时特别留意——<b>安全校验经常写成 <code>all(...)</code></b>，读懂它才知道校验条件到底覆盖了什么。"
},
{
 title:"实验 4 · 函数与作用域：亲手制造一次「状态泄漏」",
 meta:"难度 ★★★　用时 30 分钟　环境：本机 Python",
 goal:"亲眼看到可变默认参数会造成数据串到下一次调用，理解「共享状态」的危害。",
 env:"本机虚拟环境。",
 steps:["写 scope.py，先运行「漏洞版」，观察输出。",
"<b>关键观察：</b>第二次调用时，列表里还留着第一次的数据——默认值只在函数定义时创建一次。",
"切到「安全版」（用 None 作默认值），再跑一遍，确认问题消失。",
"再做 global 的实验：用 global 在函数里改外部变量，然后想想「如果这是 Web 服务，两个请求同时进来会怎样」。",
"把这两个现象写进笔记，标注它对应第 10 章和第 14 章的哪个审计点。"],
 code:`# scope.py
# ❌ 漏洞版：可变默认参数
def add_item_bad(item, box=[]):
    box.append(item)
    return box

print(add_item_bad("a"))       # ['a']
print(add_item_bad("b"))       # ['a', 'b']  ← 上一次的数据还在！

# ✅ 安全版：用 None 作默认值
def add_item_ok(item, box=None):
    if box is None:
        box = []
    box.append(item)
    return box

print(add_item_ok("a"))        # ['a']
print(add_item_ok("b"))        # ['b']

# 全局变量：Web 应用里的灾难模板
current_user = None

def set_user(name):
    global current_user
    current_user = name

set_user("alice")
print(current_user)            # alice
# 想象一下：请求 A 调用 set_user("alice")，请求 B 调用 set_user("bob")，
# 然后请求 A 读 current_user —— 可能读到 bob！`,
 verify:["确认漏洞版第二次调用返回 ['a','b']","确认安全版两次调用都只返回一个元素","能解释「默认值只在定义时创建一次」","能说清 global 在并发场景下为什么会串号"],
 undo:["无需回滚。"],
 why:"<b>「状态在哪里共享」是审计里最值钱的问题之一。</b>这个实验把两个最常见的共享形态（默认参数、全局变量）都演示了一遍。<b>以后审任何代码，看到这两个模式就停下来想一想。</b>",
 warn:"实验里的「串号」是单进程顺序执行下的现象。真实并发下的串号更难复现，但危害一样大。"
},
{
 title:"实验 5 · 依赖管理：requirements 与 pip-audit",
 meta:"难度 ★★☆　用时 25 分钟　环境：本机虚拟环境 + 联网",
 goal:"学会建环境、装包、导出依赖，并用 pip-audit 扫一次依赖漏洞。",
 env:"本机虚拟环境（已激活）。需要联网。",
 steps:["在虚拟环境里装两个常用包：<code>pip install requests flask</code>。",
"导出依赖：<code>pip freeze &gt; requirements.txt</code>，然后打开这个文件看看内容。",
"<b>注意每一行都有 == 版本号</b>——这就是「锁版本」。",
"装扫描工具：<code>pip install pip-audit</code>，然后运行 <code>pip-audit</code>。",
"如果扫出漏洞，<b>记下来它属于哪个包、哪个 CVE</b>，再用 <code>pip install -U 包名</code> 升级，然后重扫。",
"最后试试 bandit：<code>pip install bandit</code>，运行 <code>bandit -r .</code>。"],
 code:`# 在 PowerShell（虚拟环境已激活）里依次执行：
#   pip install requests flask
#   pip freeze > requirements.txt
#   type requirements.txt
#   pip install pip-audit
#   pip-audit
#   pip install bandit
#   bandit -r .

# requirements.txt 的样子：
#   blinker==1.8.2
#   certifi==2024.8.30
#   click==8.1.7
#   flask==3.0.3
#   requests==2.32.3

# 想指定用哪个源（比如公司内网源）：
#   pip install requests -i https://pypi.org/simple

# 想离线装：先下载再安装
#   pip download requests -d ./wheels
#   pip install --no-index --find-links=./wheels requests`,
 verify:["requirements.txt 里每行都带 == 版本号","<code>pip-audit</code> 能跑出结果（有无漏洞都算成功）","<code>bandit -r .</code> 能扫出报告","能解释「为什么要锁版本」"],
 undo:["不需要的话，关掉终端窗口即可。虚拟环境是文件夹，删掉不影响系统 Python。"],
 why:"<b>依赖是你代码的一部分，但你不写它。</b>这个实验让你亲手体验「装包 → 锁版本 → 扫漏洞」的闭环。<b>以后任何项目接手，先跑一遍 pip-audit，这是成本最低、收益最高的一步。</b>",
 tip:"<code>pip-audit</code> 需要联网查漏洞库。如果网络不通，可以先用 <code>pip list --outdated</code> 看哪些包版本落后。"
},
{
 title:"实验 6 · 类与魔术方法：写一个会「串号」的对象",
 meta:"难度 ★★★　用时 30 分钟　环境：本机 Python",
 goal:"用类属性 vs 实例属性的差别，亲手复现一次「用户数据串号」，理解第 10 章的审计点。",
 env:"本机虚拟环境。",
 steps:["写 klass.py，先跑「漏洞版」，观察所有用户看到的是不是同一条数据。",
"<b>关键点：</b>类属性是所有实例共享的，实例属性才是各自独立的。",
"切到「安全版」（在 __init__ 里赋值），确认问题消失。",
"再做一个练习：给类加一个 __repr__，打印对象时能看到内容。",
"想一想：如果这个类在 Web 服务里被复用（比如放进缓存或全局池），会发生什么？"],
 code:`# klass.py
# ❌ 漏洞版：用了类属性当「当前用户」
class SessionBad:
    user = None                  # 类属性 = 所有实例共享

    def login(self, name):
        self.user = name          # 看似给实例赋值，但 Python 会先在实例上找
                                  # 这里的写法实际上创建了实例属性，见下方说明
    def who(self):
        return self.user

# 换成真正的「共享」写法，问题才看得清：
class CartBad:
    items = []                    # ❌ 类属性是可变对象
    def add(self, x):
        self.items.append(x)      # 修改的是「类」的那个列表
        return self.items

a, b = CartBad(), CartBad()
print(a.add("用户的商品"))         # ['用户的商品']
print(b.add("另一个人的商品"))     # ['用户的商品', '另一个人的商品']  ← 串了！

# ✅ 安全版：在 __init__ 里创建实例属性
class CartOk:
    def __init__(self):
        self.items = []
    def add(self, x):
        self.items.append(x)
        return self.items
    def __repr__(self):
        return f"CartOk({self.items})"

c, d = CartOk(), CartOk()
print(c.add("用户的商品"))         # ['用户的商品']
print(d.add("另一个人的商品"))     # ['另一个人的商品']
print(c)                          # CartOk(['用户的商品'])`,
 verify:["确认漏洞版里两个实例共享了同一个列表","确认安全版里两个实例互不影响","能说出「类属性」和「实例属性」的区别","能写一个 __repr__ 并看到自定义输出"],
 undo:["无需回滚。"],
 why:"<b>「共享的可变状态」是权限类和逻辑类漏洞的常见根因。</b>购物车、会话、缓存、计数器——只要状态放错了地方，用户之间就会串数据。<b>这个实验让你在几十行代码里亲眼看到它。</b>",
 warn:"如果把这个类实例放进模块级变量或缓存里，串号会在生产环境真实发生。审计时看到「模块级可变对象」，就要问一句「它会被请求共享吗」。"
},
{
 title:"实验 7 · 装饰器与生成器：读懂框架的写法",
 meta:"难度 ★★★　用时 30 分钟　环境：本机 Python",
 goal:"自己写一个装饰器（计时器 + 一个「鉴权检查」装饰器），并写一个生成器读文件。",
 env:"本机虚拟环境。",
 steps:["写 deco.py，实现一个计时装饰器，运行并看输出。",
"再写一个 <b>require_admin 装饰器</b>：如果当前用户不是 admin 就拒绝。",
"<b>重点观察：</b>装饰器把「鉴权」和「业务」分开了，这是常见的工程写法，但也是审计时要特别检查的地方（装饰器漏加 = 接口裸奔）。",
"写一个生成器，逐行读一个几百行的大文件，打印前 5 行。",
"最后：把装饰器和生成器组合起来，做一个「统计每个接口耗时的中间件」。"],
 code:`# deco.py
import time, functools

def timer(fn):
    @functools.wraps(fn)                 # 保留原函数的名字和文档，很重要
    def wrapper(*args, **kwargs):
        t = time.time()
        r = fn(*args, **kwargs)
        print(f"{fn.__name__} 耗时 {time.time() - t:.4f}s")
        return r
    return wrapper

@timer
def work():
    time.sleep(0.1)

work()

# 鉴权装饰器 —— 这是框架和业务里最常见的形态
CURRENT_USER = {"name": "alice", "role": "user"}

def require_admin(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        if CURRENT_USER.get("role") != "admin":
            raise PermissionError("需要管理员权限")
        return fn(*args, **kwargs)
    return wrapper

@require_admin
def delete_user(uid):
    return f"已删除 {uid}"

try:
    delete_user(1)
except PermissionError as e:
    print("被拦下：", e)

# 生成器：逐行读，不把整个文件读进内存
def read_lines(path):
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line.rstrip()

# print(next(iter(read_lines("hello.py"))))  # 试着自己打开看`,
 verify:["计时装饰器能输出耗时","非管理员调用 delete_user 会抛 PermissionError","能解释 @functools.wraps 的作用","生成器能逐行读文件，不需要一次性加载"],
 undo:["无需回滚。"],
 why:"<b>装饰器是「横切关注点」——鉴权、日志、限流、缓存都写在装饰器里。</b>审计时要专门检查：<b>哪些接口漏了装饰器？装饰器的判断逻辑有没有被绕过？</b>@lru_cache 套在鉴权上就是一个真实出现过的越权原因。",
 tip:"想看清楚装饰器到底做了什么，把 <code>@require_admin</code> 删掉再跑一次——<b>那个「删掉就出问题」的感觉，就是审计的直觉来源。</b>"
},
{
 title:"实验 8 · 文件与路径：亲手做一次路径穿越（本地沙箱）",
 meta:"难度 ★★★　用时 30 分钟　环境：本机 Python",
 goal:"在自己的电脑上复现一次路径穿越，然后写出能挡住它的代码。",
 env:"本机虚拟环境。请在专门的实验目录里做，不要指向系统目录。",
 steps:["建目录 <code>E:\\python-study\\lab8\\files</code>，在里面放一个 secret.txt。",
"运行「漏洞版」函数，传进一个带 ../ 的文件名，<b>看到它读到了 files 目录外的文件</b>。",
"运行「安全版」，同样的输入应该被拒绝。",
"<b>对比两种写法，找出关键差别在哪一行。</b>",
"再试几个绕过思路：<code>....//</code>、URL 编码、绝对路径。<b>看安全版能不能挡住它们</b>。"],
 code:`# pathlab.py
from pathlib import Path

BASE = Path(r"E:\\python-study\\lab8\\files")
BASE.mkdir(parents=True, exist_ok=True)
(BASE / "secret.txt").write_text("这是允许访问的文件", encoding="utf-8")
(BASE.parent / "outside.txt").write_text("这是不该被读到的文件", encoding="utf-8")

# ❌ 漏洞版：直接拼接
def read_bad(name):
    return (BASE / name).read_text(encoding="utf-8")

# ✅ 安全版：resolve 展开 + 前缀校验
def read_ok(name):
    target = (BASE / name).resolve()
    base = BASE.resolve()
    try:
        target.relative_to(base)          # 不在 base 下面会抛 ValueError
    except ValueError:
        raise ValueError("非法路径：" + name)
    return target.read_text(encoding="utf-8")

print("正常访问：", read_bad("secret.txt"))
print("穿越访问：", read_bad("../outside.txt"))     # ← 读到了外面的文件！

try:
    print(read_ok("../outside.txt"))
except ValueError as e:
    print("拦截成功：", e)`,
 verify:["漏洞版能读到 BASE 之外的文件","安全版对 ../outside.txt 抛出 ValueError","能指出「关键区别是先 resolve 再判断」","能解释为什么「只检查有没有两个点」会被绕过"],
 undo:["删掉 E:\\python-study\\lab8 整个实验目录即可（这是你自己建的，删除安全）。"],
 why:"<b>路径穿越是最容易理解、也最容易被漏掉的漏洞之一。</b>它出现在下载、上传、日志、模板加载、备份等大量场景里。<b>修法只有一条：先展开成绝对路径，再确认它还在允许的目录里。</b>",
 warn:"这个实验只在你自己建的 E:\\python-study\\lab8 目录里操作。<b>永远不要把这类参数指向 C:\\Windows、用户目录或任何真实重要目录</b>——哪怕只是「试试」。"
},
{
 title:"实验 9 · 用 bandit 审自己写的代码",
 meta:"难度 ★★★　用时 30 分钟　环境：本机虚拟环境",
 goal:"写一个故意有问题的文件，用 bandit 找出来，再逐条修掉，看报告怎么变化。",
 env:"本机虚拟环境，已装 bandit。",
 steps:["新建 <code>E:\\python-study\\risky.py</code>，内容见下（<b>只写、不要真的运行</b>）。",
"运行 <code>bandit -r E:\\python-study\\risky.py</code>，看它报出多少条问题。",
"加 <code>-ll</code> 只看中危以上：<code>bandit -ll risky.py</code>。",
"<b>逐条读懂每条告警：编号、严重级别、行号、解释。</b>",
"把危险写法改成安全写法，重新扫一遍，确认告警减少。",
"写下你的疑问：<b>哪些告警你觉得是误报？为什么？</b>（能判断误报，才算真的会用了）"],
 code:`# risky.py —— 故意留给 bandit 抓的样本（只看不跑）
import os, subprocess, hashlib, random

def a(user_input):
    os.system("echo " + user_input)          # B605/B607 命令注入

def b(user_input):
    return eval(user_input)                  # B307 eval

def c(name):
    return subprocess.Popen("ls " + name, shell=True)   # B602 shell=True

def d(pwd):
    return hashlib.md5(pwd.encode()).hexdigest()        # B324 弱哈希

def e():
    return random.random()                   # B311 非密码学随机

def f(data):
    import pickle
    return pickle.loads(data)                # B301 pickle

# 运行 bandit：
#   bandit -r risky.py
#   bandit -ll risky.py
#   bandit -f json -o report.json risky.py

# 安全版本长什么样（对照着改）：
#   os.system("echo " + x)      →  subprocess.run(["echo", x], shell=False)
#   eval(x)                     →  ast.literal_eval(x)
#   Popen(..., shell=True)      →  subprocess.run([...])  参数列表
#   hashlib.md5                 →  hashlib.scrypt / bcrypt
#   random.random()             →  secrets.token_hex()
#   pickle.loads(x)             →  json.loads(x)`,
 verify:["bandit 能报出至少 5 条问题","能读懂每条告警的编号、级别和行号","改写成安全版本后告警明显减少","能指出至少一条你认为的误报并说明理由"],
 undo:["实验结束后删掉 risky.py 即可。<b>这份文件只用于扫描，不要运行。</b>"],
 why:"<b>bandit 是审计的「第一遍粗筛」。</b>这个实验让你先体验「工具能帮你什么」，再体验「工具的判断和人差在哪」——<b>能分辨误报和漏报，才算真正会用工具。</b>",
 warn:"risky.py 里都是真实可利用的写法。<b>只扫描，不要执行，不要把它放进任何 Web 服务。</b>"
},
{
 title:"实验 10 · 并发：亲手复现一次「先检查再执行」",
 meta:"难度 ★★★★　用时 40 分钟　环境：本机 Python",
 goal:"用多线程复现「检查余额 → 扣款」之间的竞争，理解竞态类漏洞。",
 env:"本机虚拟环境。",
 steps:["写 race.py，先跑「漏洞版」：检查余额和扣款分开，中间用 sleep 模拟耗时。",
"<b>观察结果：余额变成了负数，或者扣款总额超过了余额。</b>",
"切到「安全版」：用锁保护整个「检查 + 扣款」过程。",
"再跑一遍，确认无论运行多少次，余额都不会变成负数。",
"把这段代码和第 10 章讲的「库存、优惠券、验证码、限次登录」联系起来——<b>它们都是同一个模式。</b>",
"<b>思考题：假如不用锁，能不能改成「带条件的原子更新」？</b>（提示：数据库的<code>UPDATE ... WHERE balance &gt;= ?</code>）"],
 code:`# race.py
import threading, time

balance = 100

# ❌ 漏洞版：检查与扣款分成两步
def withdraw_bad(amount):
    global balance
    if balance >= amount:          # 检查
        time.sleep(0.01)           # 模拟业务耗时（真实场景：查库、调接口）
        balance -= amount          # 执行

ts = [threading.Thread(target=withdraw_bad, args=(100,)) for _ in range(5)]
for t in ts: t.start()
for t in ts: t.join()
print("漏洞版余额：", balance)      # 很可能是负数！

# ✅ 安全版：用锁把「检查 + 执行」变成一个原子操作
balance2 = 100
lock = threading.Lock()

def withdraw_ok(amount):
    global balance2
    with lock:
        if balance2 >= amount:
            time.sleep(0.01)
            balance2 -= amount

ts = [threading.Thread(target=withdraw_ok, args=(100,)) for _ in range(5)]
for t in ts: t.start()
for t in ts: t.join()
print("安全版余额：", balance2)     # 一定不会小于 0`,
 verify:["漏洞版余额出现负数（可多跑几次）","安全版余额始终不小于 0","能说清「检查与执行之间被打断」的窗口在哪","能举出三个真实业务里会出现同样问题的场景"],
 undo:["无需回滚。"],
 why:"<b>竞态类漏洞最难复现，也最容易被漏掉。</b>它不挑语言、不挑框架，只挑「你把两步操作分开写」的地方。<b>以后审计看到「先查询、再判断、然后写入」，就要问一句：中间有没有窗口？</b>",
 tip:"如果漏洞版没出现负数，把线程数调大、sleep 调长，或者多跑几次。<b>竞态本来就是「概率性」的——这也正是它在生产环境里难排查的原因。</b>"
},
{
 title:"实验 11 · 网络与 SSRF：打自己的本地服务",
 meta:"难度 ★★★★　用时 40 分钟　环境：本机 Python + 本机服务",
 goal:"自己起一个「按用户给的地址去请求」的小服务，理解 SSRF 的形态和防御。",
 env:"本机虚拟环境，已装 requests 和 flask。",
 steps:["写 fetch.py，起一个 Flask 服务，提供两个接口：<code>/bad</code>（有漏洞）和 <code>/safe</code>（安全）。",
"在另一个终端再起一个「内网服务」（用 http.server 起在 127.0.0.1:9000）。",
"访问 <code>http://127.0.0.1:5000/bad?url=http://127.0.0.1:9000/</code>，<b>你会看到它把你本地另一个服务的内容取回来了</b>——这就是 SSRF。",
"改成访问 <code>/safe</code>，同样的 url 应该被拒绝。",
"<b>思考：</b>如果不写白名单，只靠「屏蔽 127.0.0.1」，能挡得住吗？（试试 127.1、0.0.0.0、localhost、十进制 IP）"],
 code:`# 终端 1：起一个「内网服务」，代表攻击者不该访问到的内部系统
#   py -m http.server 9000 --bind 127.0.0.1

# 终端 2：写并运行 fetch.py
from flask import Flask, request
import requests, ipaddress, socket
from urllib.parse import urlparse

app = Flask(__name__)
ALLOW = {"example.com", "www.example.com"}

@app.route("/bad")
def bad():
    url = request.args.get("url", "")
    try:
        return requests.get(url, timeout=3).text[:500]
    except Exception as e:
        return "出错：" + str(e)

def is_internal_host(host):
    try:
        for info in socket.getaddrinfo(host, None):
            ip = ipaddress.ip_address(info[4][0])
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
                return True
    except Exception:
        return True
    return False

@app.route("/safe")
def safe():
    url = request.args.get("url", "")
    u = urlparse(url)
    if u.scheme not in ("http", "https"):
        return "非法协议", 400
    if u.hostname not in ALLOW:
        return "域名不在白名单", 400
    if is_internal_host(u.hostname):
        return "禁止内网地址", 400
    return requests.get(url, timeout=3, allow_redirects=False).text[:500]

app.run(port=5000)`,
 verify:["<code>/bad</code> 能把本地 9000 端口的内容取回来","<code>/safe</code> 对同样的 url 返回 400","能解释「为什么服务端能访问到的地址，攻击者直接访问不到」","能说出至少两种仅靠黑名单会被绕过的方式"],
 undo:["关掉两个终端窗口即可。实验没有修改任何系统配置。"],
 why:"<b>SSRF 的杀伤力来自「服务器的网络位置」。</b>服务器能连内网数据库、能读云元数据接口，而你从外网连不上。<b>这个实验让你在自己电脑上看到「借刀」的效果，从而理解为什么它被列为高危。</b>",
 warn:"只在 127.0.0.1 上做实验。<b>不要用它去扫描你所在网络里的任何设备</b>——哪怕只是「看看有什么端口开着」。"
},
{
 title:"实验 12 · 数据库：注入与参数化对照实验",
 meta:"难度 ★★★　用时 35 分钟　环境：本机 Python（sqlite3 自带）",
 goal:"用 sqlite3 亲手做一次 SQL 注入，再改成参数化查询确认注入失效。",
 env:"本机虚拟环境。sqlite3 是标准库，不需要安装。",
 steps:["写 db.py，建一个 users 表并插入两条数据。",
"先跑「漏洞版」查询，然后用 <code>' OR '1'='1</code> 这类输入，<b>看到它返回了本不该返回的记录</b>。",
"切到「安全版」（参数化），用同样的输入，确认查不到任何东西。",
"再做一次「表名注入」的实验：表名不能用占位符，只能用白名单——<b>亲手验证一遍，你才会记住。</b>",
"最后把整个实验的 SQL 语句抄进笔记，标注「哪种写法安全、哪种不安全」。"],
 code:`# db.py
import sqlite3

conn = sqlite3.connect(":memory:")        # 内存数据库，关掉就没了
cur = conn.cursor()
cur.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, pwd TEXT)")
cur.executemany("INSERT INTO users (name, pwd) VALUES (?, ?)",
                [("admin", "s3cr3t"), ("bob", "123456")])
conn.commit()

def query_bad(name):
    # ❌ f-string 拼接：注入
    sql = f"SELECT id, name FROM users WHERE name = '{name}'"
    print("SQL:", sql)
    return cur.execute(sql).fetchall()

def query_ok(name):
    # ✅ 参数化：数据不会被当成 SQL 代码
    return cur.execute("SELECT id, name FROM users WHERE name = ?", (name,)).fetchall()

print("正常查询：", query_bad("admin"))
print("注入查询：", query_bad("' OR '1'='1"))     # ← 返回了所有用户！
print("参数化后：", query_ok("' OR '1'='1"))      # ← 空结果，注入失效

# 表名不能用占位符 —— 只能白名单
TABLES = {"users"}
def query_table(t):
    if t not in TABLES:
        raise ValueError("非法表名")
    return cur.execute(f"SELECT COUNT(*) FROM {t}").fetchone()

print("表名白名单：", query_table("users"))
try:
    query_table("users; DROP TABLE users")
except ValueError as e:
    print("拦截成功：", e)`,
 verify:["注入版对 <code>' OR '1'='1</code> 返回了全部记录","参数化版对同样输入返回空结果","能说出「占位符的重点是让数据库区分代码和数据」","能解释为什么表名只能靠白名单"],
 undo:["内存数据库，脚本结束即消失。删掉 db.py 即可。"],
 why:"<b>这个实验把「注入」这件事从抽象概念变成了你亲眼看到的结果。</b>你在 MySQL 课里学过的原理，在这里换成了 Python 的写法——<b>同一套原理，不同的语言外衣。这正是审计方法论能跨语言迁移的原因。</b>",
 tip:"想更进一步：把 <code>query_bad</code> 换成 <code>JOIN</code> 或 <code>UNION</code> 形态，看看能不能查到别的表（可以自己再建一张 secrets 表）。<b>理解可行性的边界，报告里才能把危害写准确。</b>"
}
];
