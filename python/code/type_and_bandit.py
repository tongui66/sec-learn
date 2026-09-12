"""
type_and_bandit.py —— 第 9、14 章 · 类型注解的局限 + 会被 bandit 抓出来的写法

怎么跑：  ❌ 不要运行！只用来给 bandit 扫描
          bandit -r type_and_bandit.py
          bandit -ll type_and_bandit.py
应该看到：多条告警，含 B307(eval)、B602(shell=True)、B324(md5)、B301(pickle) 等
安全等级：⚠️ 只扫描不运行
"""

import hashlib
import os
import random
import subprocess
import pickle
import yaml


# ============ 类型注解：只是「期望」，不是「保证」 ============
def top_k(items: list, k: int) -> list:
    """注解写了 k: int，但运行时传字符串也能进来 —— 注解不做校验。"""
    return items[:k]


print(top_k([1, 2, 3], "2"))     # 不报错！注解不是校验


# ============ 下面全是 bandit 会抓出来的写法（❌ 反面教材）============

def cmd_injection(user_input):
    os.system("echo " + user_input)                       # B605/B607


def eval_injection(user_input):
    return eval(user_input)                               # B307


def popen_shell(name):
    return subprocess.Popen("ls " + name, shell=True)      # B602


def weak_hash(pwd):
    return hashlib.md5(pwd.encode()).hexdigest()           # B324


def weak_random():
    return random.random()                                 # B311


def unsafe_pickle(data):
    return pickle.loads(data)                              # B301


def unsafe_yaml(data):
    return yaml.load(data)                                 # B506


def unsafe_tmpfile():
    import tempfile
    return tempfile.mktemp()                               # B306


# ============ 对照：安全版本应该长这样 ============
#   os.system("echo " + x)   →  subprocess.run(["echo", x], shell=False)
#   eval(x)                  →  ast.literal_eval(x)
#   Popen(..., shell=True)   →  subprocess.run([...])  列表参数
#   hashlib.md5              →  hashlib.scrypt / bcrypt / argon2
#   random.random()          →  secrets.token_hex()
#   pickle.loads(x)          →  json.loads(x)
#   yaml.load(x)             →  yaml.safe_load(x)
#   tempfile.mktemp()        →  tempfile.mkstemp()

if __name__ == "__main__":
    print("这个文件只用于静态扫描，请不要运行里面的函数。")
