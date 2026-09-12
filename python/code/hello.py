"""
hello.py —— 第 2 章 · 第一个程序

怎么跑：  py hello.py
应该看到：欢迎语、解释器路径、Python 版本
安全等级：✅ 安全
"""

print("Hello, Python!")

name = "同学"
age = 20
print(f"欢迎，{name}！你今年 {age} 岁。")

# 三种引号
print('单引号：原样写，但要小心里面的单引号')
print("双引号：可以直接写英文单引号 ' ")
print("""三引号：可以写多行
第二行
第三行""")

# int 是任意精度，不会溢出
big = 2 ** 200
print("2 的 200 次方有", len(str(big)), "位数字 —— Python 的 int 不会溢出")

# 看看自己在哪个解释器里跑（排查环境问题的第一步）
import sys
print("解释器路径：", sys.executable)
print("版本：", sys.version.split()[0])

# 类型是可以查的
for v in [1, 1.5, "abc", True, None, [1], {"a": 1}]:
    print(f"{str(v):>12}  →  {type(v).__name__}")
