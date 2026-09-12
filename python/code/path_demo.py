"""
path_demo.py —— 第 8 章 · 路径穿越的漏洞版与安全版

怎么跑：  py path_demo.py
应该看到：漏洞版读到了沙箱目录之外的文件；安全版把它拦下
安全等级：⚠️ 含漏洞示范（只在脚本自建的沙箱目录里操作）
"""

from pathlib import Path

# 所有操作都限制在脚本自己创建的沙箱目录里
LAB = Path(__file__).resolve().parent / "_sandbox"
BASE = LAB / "files"
BASE.mkdir(parents=True, exist_ok=True)

(BASE / "secret.txt").write_text("这是允许被读取的文件", encoding="utf-8")
(LAB / "outside.txt").write_text("这是不该被读到的文件", encoding="utf-8")


# ============ 漏洞版：直接拼接 ============
def read_bad(name):
    """❌ 用户传 "../outside.txt" 就逃出了 BASE 目录。"""
    return (BASE / name).read_text(encoding="utf-8")


# ============ 安全版：先 resolve 展开，再确认还在 BASE 里 ============
def read_ok(name):
    """✅ 顺序很重要：先 resolve 展开成绝对路径，再判断是否还在允许目录内。"""
    base = BASE.resolve()
    target = (BASE / name).resolve()
    try:
        target.relative_to(base)        # 不在 base 下面会抛 ValueError
    except ValueError:
        raise ValueError(f"非法路径：{name}")
    return target.read_text(encoding="utf-8")


print("正常访问：", read_bad("secret.txt"))
print("穿越访问：", read_bad("../outside.txt"))     # ← 读到了外面的文件！

try:
    print(read_ok("../outside.txt"))
except ValueError as e:
    print("安全版拦截成功：", e)

print()
print("思考：只检查「路径里有没有两个点」能挡住吗？试试 '....//outside.txt' 和绝对路径。")
print("沙箱目录位置：", LAB)
