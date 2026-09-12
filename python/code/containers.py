"""
containers.py —— 第 3 章 · 容器与推导式

怎么跑：  py containers.py
应该看到：各种推导式、切片、解包的输出
安全等级：✅ 安全
"""

nums = [1, 2, 3, 4, 5, 6]

# ---- 三种推导式 ----
print("列表推导式：", [n * 2 for n in nums])
print("带条件：    ", [n for n in nums if n % 2 == 0])
print("字典推导式：", {n: n * n for n in nums})
print("集合推导式：", {n % 3 for n in nums})

# ---- 切片 ----
s = "abcdefg"
print("s[2:5]  ->", s[2:5])
print("s[::-1] ->", s[::-1])
print("s[-3:]  ->", s[-3:])

# ---- 解包 ----
a, b, *rest = nums
print("解包：", a, b, rest)

# ---- 常见操作 ----
pairs = [("alice", 90), ("bob", 85)]
print("转字典：  ", dict(pairs))
print("按分数排：", sorted(pairs, key=lambda t: t[1], reverse=True))

# ---- 审计视角：白名单就是「集合 + in」 ----
ALLOWED_TABLES = {"users", "orders", "products"}
user_input = "orders"
print("白名单检查：", user_input in ALLOWED_TABLES)

# 练习：筛出长度大于 5 且不含数字的名字
names = ["alice", "bob123", "charlotte", "dave9", "frankie"]
ok = [x for x in names if len(x) > 5 and not any(c.isdigit() for c in x)]
print("筛选结果：", ok)
