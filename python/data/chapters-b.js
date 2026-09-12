// Python 学习站 · 第 7-10 章：进阶特性
var CHAPTERS_B = [
{
id:7, title:"装饰器与生成器", stage:"进阶特性",
intro:"这两个特性是 Python 代码里「一眼看不出来在干什么」的重灾区。<b>审计别人代码时，你不熟悉它们就会读漏逻辑</b>——尤其是装饰器，它能在你看见函数体之前就改变函数的行为。",
sections:[
{h:"7.1 生成器：按需产出数据", code:[
`# 普通函数一次算出所有结果，占内存
def squares_list(n):
    return [x * x for x in range(n)]

# 生成器用 yield，一次只产出一个（惰性求值）
def squares_gen(n):
    for x in range(n):
        yield x * x

for v in squares_gen(5):
    print(v)          # 0 1 4 9 16，一个算一个

# 生成器表达式（圆括号）
total = sum(x * x for x in range(1000000))   # 内存里不会出现百万个元素

# 无限序列也可以（只要调用方控制停止）
def count_up():
    n = 0
    while True:
        yield n
        n += 1`],
note:"<b>安全相关的一个点：</b>生成器是惰性的，<b>「函数被调用了」不等于「里面的代码执行了」</b>。审计时如果你看到某个检查逻辑放在生成器里，要确认它到底在什么时候执行——<b>否则可能出现「校验还没跑，数据已经被用掉了」。</b>"},
{h:"7.2 装饰器：在函数外面包一层", code:[
`def log_call(func):
    def wrapper(*args, **kwargs):
        print(f"调用 {func.__name__}")      # 前处理
        result = func(*args, **kwargs)
        print("调用结束")                    # 后处理
        return result
    return wrapper

@log_call                      # 等价于：say_hi = log_call(say_hi)
def say_hi(name):
    return f"你好 {name}"

say_hi("小明")   # 会打印「调用 say_hi」和「调用结束」

# 带参数的装饰器（多一层嵌套）
def require_role(role):
    def deco(func):
        def wrapper(*args, **kwargs):
            if current_user().role != role:
                raise PermissionError("权限不足")
            return func(*args, **kwargs)
        return wrapper
    return deco

@require_role("admin")
def delete_user(uid):
    ...`],
warn:"<b>审计时装饰器必须看！</b>它有三层意义：<b>① 它可能在函数执行前做了权限校验（这是好事，但要确认覆盖率）；② 它可能悄悄返回了别的对象；③ <code>@functools.wraps</code> 没加的话，函数的元信息会丢，追踪会变难。</b>更关键的是——<b>如果某个接口忘了加装饰器，它就是未授权访问。</b>"},
{h:"7.3 常见的标准库装饰器", code:[
`import functools

# 1) 保留原函数信息（写装饰器时几乎必加）
def my_deco(func):
    @functools.wraps(func)
    def wrapper(*a, **kw):
        return func(*a, **kw)
    return wrapper

# 2) 缓存（注意：参数必须可哈希；被缓存的数据可能过期或串号）
@functools.lru_cache(maxsize=128)
def expensive(n):
    return n * n

# 3) Web 框架里到处都是装饰器
# @app.route("/login", methods=["POST"])     Flask
# @login_required                            Django
# @csrf_exempt
# @jwt_required()

# 审计提示：@csrf_exempt 这类「豁免」装饰器要特别留意
#          它等于把一个防护关掉了`],
tip:"<b>快速识别未授权访问的一个方法：</b>把项目里所有路由装饰器列出来（<code>@app.route</code> / <code>@login_required</code> / <code>@requires_auth</code>），<b>然后找出「有路由但没鉴权装饰器」的那些</b>。这是真实漏洞里非常常见的一类。"},
{h:"7.4 迭代器协议", code:[
`# 可迭代对象实现了 __iter__，迭代器实现了 __next__
class Countdown:
    def __init__(self, start):
        self.n = start
    def __iter__(self):
        return self
    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1

for x in Countdown(3):
    print(x)      # 3 2 1

# 为什么审计要知道：自定义的 __next__ 可以返回任何东西，
# 包括偷偷执行副作用（写文件、发请求）`]}
],
secview:"装饰器和生成器的共同特点是<b>「改变了代码的执行时机与顺序」</b>。审计时要问自己两句：<b>① 这个装饰器在函数执行前后做了什么？② 这段生成器代码什么时候才真正执行？</b>想不清这两点，就很容易漏掉校验或者误判执行顺序。"
},
{
id:8, title:"文件与路径操作", stage:"进阶特性",
intro:"文件操作是漏洞的高发区：<b>读文件能泄露源码与配置，写文件能直接拿到服务器控制权</b>。这一章既讲怎么用，也讲审计时看什么。",
sections:[
{h:"8.1 四种读写方式", code:[
`# 方式一：with + open（推荐）
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()            # 一次读全部
    # lines = f.readlines()       # 读成列表
    # for line in f: ...          # 逐行（大文件用这个）

with open("out.txt", "w", encoding="utf-8") as f:
    f.write("hello\n")
with open("out.txt", "a", encoding="utf-8") as f:   # 追加
    f.write("more\n")

# 方式二：pathlib（更现代，推荐）
from pathlib import Path
p = Path("data.txt")
text = p.read_text(encoding="utf-8")
Path("out.txt").write_text("hello", encoding="utf-8")
print(p.exists(), p.suffix, p.stem, p.parent)

# 模式速记：r 读 / w 覆盖写 / a 追加 / b 二进制 / x 独占创建`],
warn:"<b>用 <code>open()</code> 时有两个安全细节：</b>① <b>一定要指定 <code>encoding</code></b>，否则在不同系统上可能用不同编码读写，造成乱码甚至绕过校验；② <b>用户可控的路径 + 写模式 = 任意文件写入漏洞</b>，如果落在可执行目录就是 getshell。"},
{h:"8.2 路径穿越：最经典的路径漏洞", code:[
`from pathlib import Path

# ❌ 危险：直接把用户输入拼进路径
filename = input("要读哪个文件？")
path = Path("uploads") / filename
print(path.read_text())          # 输入 ../../etc/passwd 就能读到系统文件

# ❌ 用 replace 过滤同样不可靠
safe = filename.replace("../", "")     # 可被 ....// 绕过

# ✅ 正确做法一：只取文件名，丢掉目录部分
name = Path(filename).name             # ../../etc/passwd → passwd
path = Path("uploads") / name

# ✅ 正确做法二：规范化后校验是否还在允许目录内
base = Path("uploads").resolve()
target = (base / filename).resolve()
if not str(target).startswith(str(base) + os.sep):
    raise ValueError("非法路径")`],
note:"<b>为什么推荐用 <code>Path.resolve()</code> 判断前缀？</b>它会解析掉所有的 <code>..</code>、符号链接、以及 Windows 上的短文件名等，把路径变成唯一的绝对形式。<b>只要规范化后仍在允许目录里，就是安全的。</b>"},
{h:"8.3 目录与文件操作", code:[
`import shutil, os
from pathlib import Path

# 遍历目录
for p in Path("src").rglob("*.py"):      # 递归找所有 .py
    print(p)

# 目录操作
Path("newdir").mkdir(exist_ok=True)
shutil.rmtree("olddir")                  # 递归删除整个目录（危险！）

# 文件操作
shutil.copy("a.txt", "b.txt")
Path("a.txt").rename("c.txt")
os.remove("c.txt")

# 危险组合示例（真实漏洞里常见）
#   target = os.path.join(BASE, user_input)
#   shutil.rmtree(target)      ← 用户可以传 ..\ 把整个项目删掉

# 安全的删除封装：先校验路径，再执行
def safe_delete(base, name):
    base = Path(base).resolve()
    target = (base / Path(name).name).resolve()
    if target.parent != base:
        raise ValueError("越界")
    target.unlink()`]},
{h:"8.4 临时文件与权限", code:[
`import tempfile, os

# 安全的临时文件（自动生成随机名，避免竞争）
with tempfile.NamedTemporaryFile(delete=True) as tmp:
    tmp.write(b"data")
    tmp.flush()
    print(tmp.name)

# ❌ 危险写法：自己拼一个可预测的临时文件名
# filename = f"/tmp/app_{user_id}.tmp"     ← 可被抢占或猜到

# 权限问题：创建的敏感文件权限过宽
# import os
# os.chmod("/etc/app/secret.conf", 0o644)   ← 任何用户都能读（应为 0o600）

# Linux 权限速记：
#   0o600 = rw-------  只有属主可读写
#   0o644 = rw-r--r--  其他人可读（配置里含密钥就别用这个）
#   0o755 = rwxr-xr-x  可执行文件常用`],
tip:"<b>审计时搜三类关键字：</b><code>open(</code> / <code>Path(</code> 看路径来源；<code>chmod</code> 看权限是否过宽；<code>tempfile</code> 或手写的 <code>/tmp/</code> 看临时文件是否可预测。<b>这三处是文件类问题的高发点。</b>"}
],
secview:"文件操作的审计动作：<b>看到 <code>open</code> / <code>Path</code> / <code>os.remove</code> / <code>shutil.rmtree</code>，先问「路径从哪来」</b>。路径可控就是漏洞；然后用「<code>Path(name).name</code> 只取文件名」或「resolve 后校验前缀」两种方式修复。"
},
{
id:9, title:"类型注解与工程质量", stage:"进阶特性",
intro:"类型注解不是「给机器看的」，而是<b>给读代码的人看的</b>——包括审计时的你。一个标注了类型的函数，你能立刻知道它接收什么、返回什么。",
sections:[
{h:"9.1 基本写法", code:[
`# 变量注解
name: str = "Alice"
age: int = 20
scores: list[int] = [90, 85]
config: dict[str, str] = {"host": "localhost"}
maybe: str | None = None            # 3.10+ 的联合类型写法

# 函数签名（最有价值的地方）
def find_user(uid: int) -> dict | None:
    """按 id 查用户，找不到返回 None"""
    ...

def send(path: str, data: bytes, timeout: float = 3.0) -> bool:
    ...

# 可调用对象
from typing import Callable
handler: Callable[[int], str] = lambda x: str(x)

# 注意：注解默认「不强制」，写错了照样能跑（除非用 mypy/pydantic 校验）`],
note:"<b>审计时，类型注解是好东西。</b>它让你不用追进函数体就知道「这个参数应该是什么」——<b>而当实际传入的和注解不一致时，往往就是问题所在</b>（比如注解写 <code>path: str</code>，但调用方传进来一个用户可控的变量）。"},
{h:"9.2 什么时候注解会「变成真的」", code:[
`# 三种情况下注解会被实际校验

# 1) pydantic：用注解做数据校验（FastAPI 的核心）
from pydantic import BaseModel, ValidationError

class UserIn(BaseModel):
    name: str
    age: int

try:
    u = UserIn(name="Alice", age="不是数字")   # 会抛校验错误
except ValidationError as e:
    print("参数不合法")

# 2) mypy / pyright：静态检查工具，提前发现类型错误
#    pip install mypy && mypy your_project/

# 3) dataclasses：自动生成 __init__ 等方法
from dataclasses import dataclass
@dataclass
class Point:
    x: int
    y: int

# 审计提示：FastAPI 用 pydantic 做参数校验，
#   所以「写了模型定义」基本就等于「有类型校验」；
#   而直接读 request.args 的地方才需要你重点看`],
tip:"<b>这一条很实用：FastAPI / pydantic 项目里，参数校验通常是自动的</b>——你看到 <code>async def f(item: UserIn)</code> 就知道类型是安全的。<b>真正要盯的是那些绕过模型、直接用 <code>request</code> 取值的地方。</b>"},
{h:"9.3 用类型检查工具辅助审计", code:[
`# mypy：找出类型不一致的地方（往往对应潜在 bug）
# mypy --ignore-missing-imports .

# 对审计有用的信息：
#   · 某个变量实际可能是 None，但代码没判断 —— 就是空指针/逻辑绕过点
#   · 传参类型不匹配 —— 说明调用方和被调方对「这是什么」理解不一致

# bandit：Python 专用安全扫描器（后面第 20 章细讲）
# pip install bandit
# bandit -r ./src
# 它会直接报出 eval、subprocess(shell=True)、pickle 等问题

# 组合用法（我自己的习惯顺序）：
#   1) bandit -r .        先看有没有明显的危险函数
#   2) mypy .             看类型不一致（常揭示逻辑问题）
#   3) 人工追数据流        工具替代不了这一步`]}
],
secview:"类型注解的价值在于<b>让「这个值是什么」变得显式</b>。审计时优先读带注解的代码，能省很多时间；而<b>没有注解、或者注解和实际不符的地方，就是你要重点看的地方</b>。第 20 章会讲怎么用 bandit/mypy 这类工具做初筛。"
},
{
id:10, title:"并发：线程、进程与 asyncio", stage:"进阶特性",
intro:"并发代码是审计里最容易被放过的一块——<b>因为它「看起来」很复杂，很多人直接跳过</b>。但并发相关的漏洞（条件竞争、数据串号）恰恰是真实系统里存在的。",
sections:[
{h:"10.1 三种并发方式", tbl:[
["方式","适合","限制"],
["threading 线程","I/O 密集（网络、文件）","<b>GIL 限制</b>：同一时刻只有一个线程跑 Python 字节码"],
["multiprocessing 进程","CPU 密集（计算）","进程间要序列化传数据，开销大"],
["asyncio 异步","高并发 I/O（爬虫、网关）","需要全程 async，一个同步调用就会卡住整个循环"]],
code:[
`# 1) 线程
import threading
def work(n):
    print("工作中", n)

threads = [threading.Thread(target=work, args=(i,)) for i in range(3)]
for t in threads: t.start()
for t in threads: t.join()

# 2) 进程
from multiprocessing import Pool
with Pool(4) as p:
    print(p.map(abs, [-1, -2, -3]))

# 3) 异步
import asyncio
async def fetch(name):
    await asyncio.sleep(1)
    return f"{name} 完成"

async def main():
    results = await asyncio.gather(fetch("a"), fetch("b"))
    print(results)

asyncio.run(main())`]},
{h:"10.2 条件竞争（审计重点）", code:[
`# ❌ 先检查再操作 —— 两步之间有时间窗口
def withdraw(user_id, amount):
    balance = get_balance(user_id)      # ① 查余额
    if balance >= amount:               # ② 判断
        set_balance(user_id, balance - amount)   # ③ 扣款
    # 两个请求同时进来，都读到同样的余额，就会「扣两次」

# ✅ 修复一：把判断写进数据库的原子操作里
# UPDATE account SET balance = balance - ?
#   WHERE id = ? AND balance >= ?
# 然后检查影响行数是否为 1

# ✅ 修复二：加锁
import threading
lock = threading.Lock()
def withdraw_safe(user_id, amount):
    with lock:                          # 同一时刻只有一个线程能进来
        balance = get_balance(user_id)
        if balance >= amount:
            set_balance(user_id, balance - amount)

# ✅ 修复三：数据库唯一约束兜底（防重复领取）
# ALTER TABLE coupon_record ADD UNIQUE KEY uk (user_id, coupon_id);`],
warn:"<b>「检查再执行」是条件竞争的经典形态。</b>审计时看到这种模式要停下来想：「两步之间，另一个请求能插进来吗？」——<b>涉及余额、库存、优惠券、验证码、限次操作的地方，都要问这一句。</b>"},
{h:"10.3 共享状态与数据串号", code:[
`# 共享变量的经典问题
counter = 0
def increase():
    global counter
    counter += 1        # 这不是原子操作：读-改-写 三步，中间可能被打断

# ✅ 用锁保护
lock = threading.Lock()
def increase_safe():
    global counter
    with lock:
        counter += 1

# 更隐蔽的一类：用「全局变量」在请求之间传递数据
current_user = None              # ❌ Web 应用里这是灾难
def handle(request):
    global current_user
    current_user = load_user(request.token)     # 请求 A 设置
    do_something()                              # 期间请求 B 把它改了
    return current_user.name                    # ← 可能拿到 B 的用户！

# ✅ 正确做法：用请求级别的上下文（Flask 的 g、Django 的 request.user）
#    绝不把「当前用户」放在全局变量里`],
note:"<b>这条在真实漏洞里非常值钱：</b>如果一个 Web 应用把「当前登录用户」存在全局变量里，那么在高并发下，<b>用户 A 可能拿到用户 B 的数据</b>——这是一类极难复现、但危害很大的漏洞。审计时看到 <code>global</code> 修饰的、和请求相关的变量，就要警惕。"}
],
secview:"并发部分的审计要点：<b>「检查再执行」之间有没有窗口？共享的可变状态有没有保护？有没有用全局变量在请求之间传数据？</b>这三个问题能覆盖并发类漏洞的主要形态。"
}
];
