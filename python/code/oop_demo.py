"""
oop_demo.py —— 第 6 章 · 类属性 vs 实例属性

怎么跑：  py oop_demo.py
应该看到：漏洞版两个「用户」共享同一个购物车；安全版各自独立
安全等级：⚠️ 含漏洞示范（仅供学习，不要照抄）
"""


# ============ 漏洞版：可变类属性被所有实例共享 ============
class CartBad:
    items = []          # ❌ 类属性，而且是可变对象

    def add(self, x):
        self.items.append(x)
        return self.items


a, b = CartBad(), CartBad()
print("用户 A 加购：", a.add("A 的商品"))
print("用户 B 加购：", b.add("B 的商品"))     # ← 串了！


# ============ 安全版：在 __init__ 里创建实例属性 ============
class CartOk:
    def __init__(self):
        self.items = []              # ✅ 每个实例一个列表

    def add(self, x):
        self.items.append(x)
        return self.items

    def __repr__(self):
        return f"CartOk({self.items})"


c, d = CartOk(), CartOk()
print("用户 A 加购：", c.add("A 的商品"))
print("用户 B 加购：", d.add("B 的商品"))
print("对象表示：  ", c, "|", d)

print()
print("结论：可变状态必须放在实例上（或请求级上下文里），不能放在类上。")
