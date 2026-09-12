"""
decorator_generator.py —— 第 7 章 · 装饰器与生成器

怎么跑：  py decorator_generator.py
应该看到：耗时输出、鉴权被拦下、生成器逐行读文件
安全等级：✅ 安全
"""

import functools
import time


# ---- 计时装饰器 ----
def timer(fn):
    @functools.wraps(fn)                 # 保留原函数的名字和文档
    def wrapper(*args, **kwargs):
        t = time.perf_counter()
        result = fn(*args, **kwargs)
        print(f"[timer] {fn.__name__} 耗时 {time.perf_counter() - t:.4f}s")
        return result
    return wrapper


# ---- 鉴权装饰器（框架里最常见的形态）----
CURRENT_USER = {"name": "alice", "role": "user"}


def require_admin(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        if CURRENT_USER.get("role") != "admin":
            raise PermissionError("需要管理员权限")
        return fn(*args, **kwargs)
    return wrapper


@timer
def heavy_work():
    time.sleep(0.05)
    return "完成"


@require_admin
def delete_user(uid):
    return f"已删除用户 {uid}"


print(heavy_work())

try:
    print(delete_user(1))
except PermissionError as e:
    print("被装饰器拦下：", e)

# 把角色改成 admin 就能过 —— 取消下面两行的注释试试
# CURRENT_USER["role"] = "admin"
# print(delete_user(1))


# ---- 生成器：逐行读，不把整个文件读进内存 ----
def read_lines(path, limit=None):
    with open(path, encoding="utf-8") as f:
        for i, line in enumerate(f):
            if limit is not None and i >= limit:
                break
            yield line.rstrip()


print()
print("读取本文件前 5 行：")
for line in read_lines(__file__, limit=5):
    print("  ", line)

print()
print("审计提醒：@lru_cache 套在鉴权结果上会造成越权，缓存键必须包含用户身份。")
