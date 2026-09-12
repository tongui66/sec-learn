// Python 学习站 · 第 1-6 章：语言基础
var CHAPTERS_A = [
{
id:1, title:"Python 与代码审计：先建立地图", stage:"语言基础",
intro:"学 Python 有很多理由，但你的理由很具体：<b>看懂别人写的 Python 代码里藏着什么</b>。这一章先讲清 Python 怎么跑、它的安全特点，以及整门课要带你去哪。",
sections:[
{h:"1.1 Python 是怎么跑起来的", p:["Python 是<b>解释型</b>语言。你写的 .py 文件不是直接执行的，而是先被编译成<b>字节码</b>（.pyc），再由 Python 虚拟机逐条执行。",
"这件事和安全有关：<b>.pyc 文件可以被反编译回接近源码的形式</b>，所以「把源码编译掉」不构成保护。审计时如果对方只给了 .pyc，你照样能还原出逻辑。"]},
{code:[
`# 看看字节码长什么样
import dis

def add(a, b):
    return a + b

dis.dis(add)
#  2           0 LOAD_FAST                0 (a)
#              2 LOAD_FAST                1 (b)
#              4 BINARY_OP                0 (+)
#              6 RETURN_VALUE`]},
{h:"1.2 Python 和 PHP/Java 在安全上的差别", tbl:[
["对比项","Python","对安全的影响"],
["运行方式","解释执行，脚本直接跑","没有「Web 根目录」概念，暴露面取决于你怎么部署"],
["类型系统","动态强类型（不隐式转换）","<b>没有 PHP 那种弱类型绕过</b>，但运行时类型错误会变成异常"],
["危险面","反序列化、模板注入、命令执行","pickle/SSTI 是 Python 特有的重灾区"],
["依赖生态","pip 装第三方包","<b>供应链风险</b>：一个包被投毒，全项目沦陷"],
["Web 框架","Flask / Django","框架本身较安全，<b>出事基本是开发者用错</b>"]],
note:"<b>一句话记住差异：Python 的漏洞很少来自语言本身，大多来自「你把用户输入交给了哪个函数」。</b>和 PHP 一样，审计的核心动作依然是「追数据流」。"},
{h:"1.3 代码审计在审什么", p:["定义：<b>顺着「不可信的数据」这条线，看它有没有被安全地使用。</b>"]},
{tbl:[
["步骤","做什么","产出"],
["① 找输入点","标出所有外部数据来源","request.args / input() / 环境变量 / 文件名 / 网络数据"],
["② 找危险函数","标出所有可能造成危害的调用","eval / exec / os.system / subprocess / pickle / yaml / SQL 拼接"],
["③ 追数据流","从输入点沿代码走到危险函数，中间有没有校验、白名单、转义","漏洞是否成立"],
["④ 定级与修复","按危害排序，给出修复代码与复测方法","可提交的报告"]],
tip:"这四步会和 PHP 课完全一致——<b>审计的方法论是跨语言的，变的只是「危险函数清单」和「危险模式」。</b>你学 PHP 时练的那套，在 Python 这里能直接迁移，只需要换一本「函数字典」。"},
{h:"1.4 这门课怎么学", ol:["<b>读</b>：读一章，重点是「这段代码里的数据从哪来、到哪去」。",
"<b>跑</b>：在虚拟环境里把示例跑起来，看真实输出或报错。",
"<b>审</b>：去「审计靶场」读一段代码，先自己写判断，再对答案。",
"<b>写</b>：把你发现的漏洞按模板写成报告。"]},
{h:"1.5 你的环境（已经装好了）", tbl:[
["项目","状态","怎么用"],
["Python 3.14","已装","用 <code>py</code> 命令，不是 <code>python</code>（第 2 章细讲）"],
["虚拟环境","需要自己建","<code>py -m venv .venv</code>，第 5 章讲"],
["Web 实验","按需安装","<code>pip install flask</code>"],
["编辑器","建议装 VS Code","免费，装 Python 扩展就有补全和调试"]],
warn:"<b>本课程的示例里有一部分是故意有漏洞的代码</b>（命令执行、反序列化、SSTI）。它们只允许在你自己的电脑、自己的虚拟环境里运行。<b>把它们部署到公网服务器 == 把一台靶机挂在网上。</b>"}
],
secview:"这一章建立的是审计的世界观：Python 安全问题的核心不是语法，而是「数据的流向」。四步法（找输入点 → 找危险函数 → 追数据流 → 定级修复）会贯穿整门课，第 15 章会把它变成可执行的流程。"
},
{
id:2, title:"基础语法与数据类型", stage:"语言基础",
intro:"这一章讲最基础的语法，同时埋下两个审计伏笔：<b>类型错误会变成异常</b>、<b>输入永远来自不可信的地方</b>。",
sections:[
{h:"2.1 第一个程序与运行方式", code:[
`# hello.py
print("Hello, Python!")

name = "同学"          # 不需要声明类型
age = 20
print(f"欢迎，{name}，你 {age} 岁")   # f-string（3.6+）

# 运行方式（本机 python 命令是商店占位符，要用 py）
#   py hello.py
# 或者进入交互式解释器
#   py`],
note:"<b>为什么强调用 py 而不是 python？</b>很多 Windows 上装完 Python 的人直接敲 <code>python</code> 会被带到微软商店——因为系统里有个同名的占位程序。这不是课程的重点，但是<b>你第一次跑代码就会踩的坑</b>。"},
{h:"2.2 核心数据类型", tbl:[
["类型","例子","说明"],
["int 整数","42 / 0xff / 1_000_000","任意精度，不会溢出"],
["float 浮点","3.14 / 1e-3","有精度问题：<code>0.1 + 0.2 != 0.3</code>"],
["str 字符串","'abc' / \"abc\" / '''多行'''","不可变序列"],
["bool","True / False","注意首字母大写"],
["NoneType","None","表示「没有值」"],
["容器","list / tuple / dict / set","第 3 章专讲"]],
code:[
`# 类型与转换（Python 是强类型：不会自动把字符串当数字）
print(1 + 1)            # 2
print("1" + "1")        # 11   字符串拼接
# print("1" + 1)        # ❌ TypeError：这是好事，PHP 那种弱类型坑在这里不存在

print(int("123"))       # 123
print(str(123))         # "123"
print(type(123))        # <class 'int'>

# 浮点的精度陷阱（涉及金额必须用 decimal）
print(0.1 + 0.2)        # 0.30000000000000004
from decimal import Decimal
print(Decimal("0.1") + Decimal("0.2"))   # 0.3`]},
{h:"2.3 字符串与输入", code:[
`# 三种引号
s1 = '单引号'
s2 = "双引号"
s3 = """三引号
可以跨行，也可以直接当文档字符串"""

# 常用操作
text = "  Hello World  "
print(text.strip())          # 去首尾空白
print(text.upper())          # 转大写
print(text.split())          # 按空白切分成列表
print("-".join(["a", "b"]))  # a-b
print(text.replace("o", "0"))

# 输入：注意它拿到的一定是字符串
name = input("请输入名字：")
print(type(name))            # <class 'str'>`],
warn:"<b><code>input()</code> 是第一个「输入点」。</b>它拿到的永远是不可信的用户输入，而且注意：在 Python 2 里 <code>input()</code> 会直接执行输入的内容（相当于 eval）——所以审计老代码时，看到 <code>input()</code> 要特别警惕。<b>Python 3 里它只返回字符串，安全。</b>"},
{h:"2.4 真假值判断", code:[
`# 哪些值在布尔判断里是假？
print(bool(0), bool(0.0), bool(""), bool([]), bool({}), bool(None), bool(set()))
# 全是 False

# 其余都是真，包括这些容易误判的
print(bool("0"), bool(" "), bool([0]), bool(-1))
# 全是 True —— 注意 "0" 和 " " 都是真

if "0":
    print("字符串 '0' 是真值")   # 会执行

# 正确的判断方式
x = "0"
if x != "":
    print("x 不是空字符串")`],
tip:"<b>和 PHP 的差别值得记住：</b>PHP 里 <code>'0'</code> 是假值，Python 里 <code>'0'</code> 是真值。这类差异在审计「配置开关」「权限判断」时很关键——<b>不要用直觉判断，用 <code>bool()</code> 验证。</b>"}
],
secview:"语法本身不难，但有两个审计伏笔值得带走：<b>① <code>input()</code> 是输入点，老代码里的 <code>input()</code> 更危险；② 真假值判断在不同语言里不一样，看到 <code>if x:</code> 要先想「x 可能是什么类型」。</b>"
},
{
id:3, title:"数据结构与推导式", stage:"语言基础",
intro:"列表、字典、集合是 Python 的日常。这一章的重点是「写得 Pythonic」——因为<b>读懂别人的代码，前提是熟悉 Pythonic 的写法</b>，而审计时你要读的正是别人写的代码。",
sections:[
{h:"3.1 四种容器", tbl:[
["容器","写法","特点","典型用途"],
["list 列表","[1, 2, 3]","有序、可变","存一组数据"],
["tuple 元组","(1, 2, 3)","有序、<b>不可变</b>","固定组合（如坐标）"],
["dict 字典","{'a': 1}","键值对，查找快","配置、JSON 数据"],
["set 集合","{1, 2, 3}","无序、自动去重","去重、成员判断"]],
code:[
`nums = [3, 1, 2]
nums.append(4)          # 追加
nums.sort()             # 排序：[1,2,3,4]
print(nums[0], nums[-1])   # 1 4      负索引从尾部数
print(nums[1:3])           # [2, 3]   切片

user = {"name": "Alice", "role": "admin"}
print(user["name"])               # Alice
print(user.get("age", "未知"))     # 取不到时给默认值（推荐）
# print(user["age"])              # ❌ KeyError

print(set([1, 1, 2, 3]))          # {1, 2, 3}  自动去重`]},
{h:"3.2 推导式：Python 最显眼的写法", code:[
`# 列表推导式
squares = [x * x for x in range(5)]              # [0,1,4,9,16]
evens   = [x for x in range(10) if x % 2 == 0]   # [0,2,4,6,8]

# 字典推导式
lengths = {w: len(w) for w in ["a", "bb", "ccc"]}   # {'a':1,'bb':2,'ccc':3}

# 集合推导式
initials = {w[0] for w in ["apple", "banana", "avocado"]}   # {'a','b'}

# 嵌套推导（读代码时会遇到，一眼要认出结构）
matrix = [[1,2],[3,4]]
flat = [n for row in matrix for n in row]        # [1,2,3,4]

# 生成器表达式（用圆括号，惰性求值，不占内存）
total = sum(x * x for x in range(1000000))`],
note:"<b>审计时为什么要熟悉推导式？</b>因为它把「循环 + 条件 + 赋值」压缩成了一行。一段真实的代码里，过滤逻辑很可能就藏在推导式的 <code>if</code> 里。<b>看到 <code>[x for x in data if check(x)]</code>，你要能立刻看出「这是在过滤」。</b>"},
{h:"3.3 解包与常用操作", code:[
`# 解包
a, b = 1, 2
first, *rest = [1, 2, 3, 4]      # first=1, rest=[2,3,4]
x, y = y, x                      # 交换变量

# 遍历字典
for k, v in user.items():
    print(k, v)

# 常用内置函数
print(len(nums), max(nums), min(nums), sum(nums))
print(sorted(nums, reverse=True))
print(list(zip([1,2], ["a","b"])))    # [(1,'a'), (2,'b')]
print(enumerate(["a","b"]))           # 带下标遍历`],
tip:"<b><code>zip()</code> 和 <code>enumerate()</code> 是 Python 代码里到处出现的写法。</b>如果你读代码时看到这两个函数会停顿，说明还不熟悉 Python 的「表达习惯」——<b>而审计的瓶颈往往不是逻辑难，而是读得慢。</b>"},
{h:"3.4 可变与不可变（一个真实的安全影响）", code:[
`# 可变对象作为默认参数 —— 经典的 Python 陷阱
def add_item(item, bucket=[]):        # ❌ 默认值只创建一次！
    bucket.append(item)
    return bucket

print(add_item("a"))    # ['a']
print(add_item("b"))    # ['a', 'b']   ← 不是 ['b']，默认值被共享了

# 正确写法
def add_item_safe(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket

# 同样地，赋值不是复制
a = [1, 2]
b = a                # b 和 a 指向同一个列表
b.append(3)
print(a)             # [1, 2, 3]   a 也变了
c = a.copy()         # 这才是复制（浅拷贝）`],
warn:"<b>共享可变状态在审计里是有意义的</b>：如果一处代码修改了「本该独立」的列表或字典，另一处的判断就可能被影响。<b>看权限校验、缓存、全局配置时，注意它们是不是被共享的可变对象。</b>"}
],
secview:"这一章的收获应该是「读代码不再卡壳」：容器操作、推导式、解包、zip/enumerate 要变成条件反射。另外记住那个可变默认参数的坑——<b>它是 Python 里最容易写出 bug 的地方之一，也是审计时值得留意的一类模式。</b>"
},
{
id:4, title:"流程控制与函数", stage:"语言基础",
intro:"这一章是写逻辑的基础。审计视角的重点是<b>「条件写错了会怎样」</b>——绝大多数逻辑漏洞，本质都是一个条件写错了或者一个异常没处理。",
sections:[
{h:"4.1 条件与循环", code:[
`# if / elif / else（注意没有 elseif）
score = 85
if score >= 90:
    print("优秀")
elif score >= 60:
    print("及格")
else:
    print("不及格")

# 链式比较（Python 特有的写法）
if 60 <= score < 90:
    print("分数在 [60, 90) 区间")

# 循环
for i in range(3):          # 0 1 2
    print(i)

for item in ["a", "b"]:
    print(item)

# while 循环：条件为真就一直执行
n = 0
while n < 3:
    print(n)
    n += 1

# 循环控制
for n in range(10):
    if n == 2: continue     # 跳过本次
    if n == 5: break        # 结束循环
else:
    print("循环正常结束才会执行（for-else 是 Python 特色）")`]},
{h:"4.2 函数", code:[
`def greet(name, greeting="你好"):        # 默认参数
    """文档字符串：说明这个函数做什么"""
    return f"{greeting}，{name}"

print(greet("小明"))                     # 你好，小明
print(greet("Bob", "Hello"))             # Hello，Bob
print(greet(greeting="Hi", name="Alice"))  # 关键字参数

# 可变参数
def total(*args, **kwargs):
    print(args)      # 位置参数打包成元组
    print(kwargs)    # 关键字参数打包成字典

total(1, 2, 3, mode="fast")

# 函数是一等对象：可以赋值、可以传参
fn = greet
print(fn("测试"))`],
note:"<b>审计相关：</b><code>*args</code> / <code>**kwargs</code> 会让「这个函数到底接收了什么」变得不直观。<b>看到它们，要特别注意调用方到底传了什么进去</b>——这也是为什么很多危险函数调用藏得深。"},
{h:"4.3 异常处理（审计重点）", code:[
`# 基本写法
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print("除零错误：", e)
except (ValueError, TypeError):
    print("类型或值不对")
else:
    print("没出错才执行")
finally:
    print("无论如何都执行（常用于清理资源）")

# ❌ 危险写法一：裸 except 吞掉一切
try:
    do_something()
except:                 # 连 KeyboardInterrupt 都吞了，问题被隐藏
    pass

# ❌ 危险写法二：异常被忽略，逻辑继续往下走
try:
    user = get_user(request.args["id"])
except Exception:
    user = None
if user is None or user.role == "admin":   # ← 出异常反而变成「通过」了？
    allow_access()                          # 这类写法就是逻辑漏洞的温床`],
warn:"<b>异常处理是审计里极容易漏的一块。</b>判断标准和上面那三个问题一样：<b>① 是不是裸 except 吞掉了错误？② 出错之后程序继续走的分支，安全吗？③ 失败时默认放行还是默认拒绝？</b>很多鉴权绕过，本质就是「让程序抛异常，然后走进那个宽松的分支」。"},
{h:"4.4 作用域与闭包", code:[
`count = 0

def increase():
    global count        # 声明用全局变量（不声明就是新建局部变量）
    count += 1

# 闭包：内部函数记住了外部的变量
def make_counter():
    n = 0
    def inner():
        nonlocal n      # 声明用外层的变量
        n += 1
        return n
    return inner

c = make_counter()
print(c(), c(), c())    # 1 2 3

# 变量作用域的几个要记住的点
# 1) 函数内赋值 = 创建局部变量，除非用了 global / nonlocal
# 2) 列表、字典等可变对象不需要 nonlocal 也能改内容
# 3) LEGB 查找顺序：Local → Enclosing → Global → Builtin`]}
],
secview:"条件与函数是逻辑的骨架，而<b>异常处理是审计的高发区</b>。记住那一句判断标准：<b>「出错之后，程序走进了哪个分支？那个分支安全吗？」</b>——这一句能帮你找出很多鉴权绕过。"
},
{
id:5, title:"模块、包与虚拟环境", stage:"语言基础",
intro:"Python 项目从来不是单个文件。<b>这一章讲「一个真实项目长什么样」，以及依赖管理——而依赖正是 Python 最大的安全风险来源之一。</b>",
sections:[
{h:"5.1 模块与导入", code:[
`# 三种导入方式
import os                      # 导入模块，用 os.path 访问
from pathlib import Path       # 导入具体名字，直接用 Path
import subprocess as sp        # 起别名

# 常用标准库速览
import os, sys, json, re, hashlib, secrets, subprocess, pathlib, shutil, time

# 相对导入（包内部）
# from .utils import helper     # 同一个包里的模块
# from ..config import DB       # 上一级包`],
note:"<b><code>import</code> 这一行在审计里很重要。</b>一眼扫过 import 列表，就能知道这个文件「能干什么」——有 <code>subprocess</code> 就可能执行命令，有 <code>pickle</code> 就可能反序列化，有 <code>sqlite3</code> 就可能拼 SQL。<b>看文件先看 import，是审计的高效起手式。</b>"},
{h:"5.2 一个真实项目的结构", code:[
`myproject/
├── .venv/                # 虚拟环境（不进版本库）
├── .gitignore
├── README.md
├── requirements.txt      # 依赖清单
├── pyproject.toml        # 现代项目配置
├── src/
│   └── myproject/
│       ├── __init__.py   # 标记这是一个包
│       ├── main.py       # 入口
│       ├── config.py     # 配置（常含密钥！）
│       ├── models.py
│       └── utils.py
├── tests/
│   └── test_main.py
└── data/`],
tip:"<b>审计一个陌生项目时，先看这四个文件：<code>requirements.txt</code>（依赖与版本，对应已知漏洞）、<code>config.py</code>/<code>.env</code>（密钥）、<code>main.py</code>（入口与路由）、<code>utils.py</code>（公共函数，常藏着危险封装）。</b>这比从头读代码快十倍。"},
{h:"5.3 虚拟环境（必会）", code:[
`# 为什么要用虚拟环境：不同项目依赖不同版本的包，装在全局会互相打架

# 创建（在项目根目录）
py -m venv .venv

# 激活（Windows PowerShell）
.venv\Scripts\Activate.ps1
# 激活后命令行前面会出现 (.venv)

# 装依赖
pip install flask requests
pip install -r requirements.txt      # 按清单装

# 导出当前环境（别人拿到就能复现）
pip freeze > requirements.txt

# 退出
deactivate

# 如果 PowerShell 报「禁止运行脚本」
#   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`],
warn:"<b>看到 <code>pip install</code> 时要想两件事：</b>① 这个包是谁维护的、有没有已知漏洞；② 如果是 <code>pip install -r requirements.txt</code> 且清单没锁版本，那生产环境装到的可能是几年后的新版本——<b>依赖不锁版本 = 每次部署都在赌运气</b>。"},
{h:"5.4 依赖与供应链安全", code:[
`# 查看已安装的包与版本
pip list
pip show flask

# 检查已知漏洞（需要装 pip-audit）
pip install pip-audit
pip-audit

# 典型的供应链攻击面：
#   1) 包名仿冒（typosquatting）：reqeusts 冒充 requests
#   2) 依赖混淆：内部包名被公开包抢先注册
#   3) setup.py 在安装时执行任意代码（pip install 就等于运行代码！）
#   4) 版本范围过宽，自动升级到被投毒的版本

# 防御要点：
#   · requirements.txt 锁死版本（== 而不是 >=）
#   · 用 pip-audit / safety 定期扫
#   · 私有包配置私有源，避免被公开源同名包劫持`],
note:"<b>「<code>pip install</code> 等于执行别人的代码」这件事，很多开发者没有意识到。</b>安装包时执行的 <code>setup.py</code> 拥有你的全部权限。<b>所以审计 Python 项目时，「依赖清单」是必须单独看一遍的一块。</b>"}
],
secview:"这一章把「单个文件」变成「一个项目」：<b>看 import 就知道这个文件能干什么；看 requirements.txt 就知道项目的依赖风险；看 config 与 utils 就知道密钥和最危险的公共封装在哪。</b>这是审计的快速入门路径。"
},
{
id:6, title:"面向对象与异常进阶", stage:"语言基础",
intro:"Python 的类用得比 PHP 更克制，但有两个特性在安全里非常关键：<b>魔术方法（决定对象在特殊场景下怎么表现）</b>和<b>继承与覆写</b>。它们和后面的反序列化、沙箱逃逸直接相关。",
sections:[
{h:"6.1 类的基础", code:[
`class User:
    # 类属性（所有实例共享）
    platform = "web"

    def __init__(self, name, role="user"):     # 构造方法
        self.name = name                        # 实例属性
        self.role = role

    def is_admin(self):                         # 实例方法，第一个参数是 self
        return self.role == "admin"

    def __str__(self):                          # 魔术方法：print 时调用
        return f"User({self.name})"

u = User("Alice", "admin")
print(u.name, u.is_admin(), u)      # Alice True User(Alice)

# 继承
class Admin(User):
    def __init__(self, name):
        super().__init__(name, role="admin")   # 调用父类构造
    def is_admin(self):
        return True                            # 覆写父类方法`]},
{h:"6.2 魔术方法（安全重点）", tbl:[
["魔术方法","什么时候自动调用","安全相关性"],
["`__init__`","创建实例时","反序列化<b>不会</b>调用它"],
["`__str__` / `__repr__`","被当字符串用时","日志注入、信息泄露"],
["`__eq__`","用 == 比较时","<b>鉴权比较若被自定义，可能绕过</b>"],
["`__getattr__` / `__getattribute__`","访问属性时","可拦截属性读取，链式利用的中间环节"],
["`__reduce__` / `__reduce_ex__`","pickle 序列化时","<b>反序列化 RCE 的核心</b>（第 17 章）"],
["`__call__`","把对象当函数调用时","配合 getattr 链"],
["`__enter__` / `__exit__`","with 语句","资源清理，清理失败会成为漏洞"]],
warn:"<b><code>__reduce__</code> 是必须记住的一个方法。</b>pickle 在序列化一个对象时会调用它，而反序列化时会执行它返回的内容——<b>这就是 pickle 反序列化能直接导致命令执行的原因</b>。第 17 章会完整讲这条链。"},
{h:"6.3 属性访问与动态调用", code:[
`# 动态取属性 —— 审计重点
class Config:
    SECRET_KEY = "xxx"
    DEBUG = True

print(getattr(Config, "SECRET_KEY"))       # 正常用法

# ❌ 危险：属性名来自用户
name = input("要读哪个配置？")
print(getattr(Config, name))               # 用户能读任意属性

# ❌ 更危险：连对象都能被控制
#   真实漏洞里常见 getattr(obj, user_input)() 这种链式调用
#   配合 __import__ 就能调用任意模块的函数

# 正确做法：白名单
allow = {"debug": "DEBUG", "version": "VERSION"}
key = allow.get(user_input)
if key:
    print(getattr(Config, key))`],
note:"<b><code>getattr</code> / <code>setattr</code> / <code>__import__</code> 这三个是 Python 审计里「动态调用」的三件套。</b>它们本身不是漏洞，但只要参数来自用户，就等于把「调用什么」交给了对方——这和我们讲 PHP 时说的「可变函数」是同一类问题。"},
{h:"6.4 上下文管理器（with）", code:[
`# with 保证资源被正确释放，即使中途抛异常
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
# 出了 with 块，文件自动关闭

# 本质是实现了 __enter__ / __exit__
class Safe:
    def __enter__(self):
        print("进入")
        return self
    def __exit__(self, exc_type, exc, tb):
        print("退出（即使抛异常也会执行）")
        return False        # False 表示异常继续往外抛

with Safe():
    print("工作中")

# 安全相关：用 with 管理「锁」「数据库事务」「临时文件」
# 不用 with 的代码，一旦中途出错，清理逻辑就可能被跳过`],
tip:"<b>审计时注意「清理逻辑有没有被绕过」。</b>比如「临时文件用完要删除」——如果删除写在正常流程里而没有放在 <code>finally</code> 或 <code>with</code> 里，那么攻击者只要制造一个异常，临时文件就会留在磁盘上。<b>这类「异常导致清理失败」的问题很隐蔽，但很常见。</b>"}
],
secview:"类的语法不难，但两个点必须记住：<b>魔术方法决定对象在特殊场景下的行为（尤其 <code>__reduce__</code> 与反序列化直接相关）</b>，以及<b>动态调用（getattr / __import__）只要参数可控就是漏洞</b>。这两条会在第 15-19 章反复出现。"
}
];
