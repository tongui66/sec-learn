"""
db_demo.py —— 第 13 章 · SQL 注入与参数化对照

怎么跑：  py db_demo.py
应该看到：注入版对 "' OR '1'='1" 返回全部记录；参数化版返回空
安全等级：⚠️ 含漏洞示范（用的是内存数据库，不影响任何真实数据）
"""

import sqlite3

conn = sqlite3.connect(":memory:")      # 内存数据库，脚本结束就没了
cur = conn.cursor()
cur.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, pwd TEXT)")
cur.executemany(
    "INSERT INTO users (name, pwd) VALUES (?, ?)",
    [("admin", "s3cr3t"), ("bob", "123456")],
)
conn.commit()


def query_bad(name):
    """❌ f-string 拼接：用户输入会改变 SQL 的语义。"""
    sql = f"SELECT id, name FROM users WHERE name = '{name}'"
    print("  实际执行的 SQL：", sql)
    return cur.execute(sql).fetchall()


def query_ok(name):
    """✅ 参数化：数据库知道这一段是数据，不是代码。"""
    return cur.execute("SELECT id, name FROM users WHERE name = ?", (name,)).fetchall()


print("正常查询：")
print("  结果：", query_bad("admin"))
print()
print("注入查询（' OR '1'='1）：")
print("  结果：", query_bad("' OR '1'='1"))
print()
print("参数化版本，同样的输入：")
print("  结果：", query_ok("' OR '1'='1"))


# ============ 表名不能参数化，只能白名单 ============
TABLES = {"users"}


def count_table(t):
    if t not in TABLES:
        raise ValueError(f"非法表名：{t}")
    return cur.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]


print()
print("表名白名单：", count_table("users"))
try:
    count_table("users; DROP TABLE users")
except ValueError as e:
    print("拦截成功：", e)

print()
print("记住：占位符的重点不是「转义引号」，而是「让数据库区分代码和数据」。")
