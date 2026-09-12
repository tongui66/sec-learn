"""
scope_demo.py —— 第 4 章 · 可变默认参数与全局状态

怎么跑：  py scope_demo.py
应该看到：漏洞版会「记住」上一次调用的数据；安全版不会
安全等级：⚠️ 含漏洞示范（仅供学习，不要照抄）
"""

# ============ 问题一：可变默认参数 ============
def add_item_bad(item, box=[]):
    """❌ 默认值 [] 只在函数定义时创建一次，所有调用共享同一个列表。"""
    box.append(item)
    return box


print("漏洞版第一次：", add_item_bad("a"))
print("漏洞版第二次：", add_item_bad("b"))


def add_item_ok(item, box=None):
    """✅ 用 None 作默认值，每次调用创建新列表。"""
    if box is None:
        box = []
    box.append(item)
    return box


print("安全版第一次：", add_item_ok("a"))
print("安全版第二次：", add_item_ok("b"))


# ============ 问题二：全局变量当「当前用户」 ============
current_user = None


def set_user(name):
    global current_user
    current_user = name


def whoami():
    return current_user


set_user("alice")
print("当前用户：", whoami())

# 想象一下 Web 场景：
#   请求 A 调用 set_user("alice")
#   请求 B 调用 set_user("bob")
#   请求 A 再调用 whoami()  →  可能拿到 "bob"
# 这就是「用户串号」。正确做法是用请求级上下文
# （Flask 的 g、Django 的 request.user），绝不放在全局变量里。

print()
print("结论：看到「可变默认参数」和「global 修饰的请求相关变量」，都要停下来想一想。")
