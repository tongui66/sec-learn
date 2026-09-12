"""
concurrency_demo.py —— 第 10 章 · 「先检查再执行」的竞态

怎么跑：  py concurrency_demo.py
应该看到：漏洞版余额出现负数；安全版余额始终不小于 0
安全等级：⚠️ 含漏洞示范（演示竞态，不涉及外部系统）
"""

import threading
import time

# ============ 漏洞版：检查与扣款分成两步 ============
balance = 100


def withdraw_bad(amount):
    global balance
    if balance >= amount:          # 检查
        time.sleep(0.01)           # 模拟业务耗时（真实场景：查库、调接口）
        balance -= amount          # 执行


threads = [threading.Thread(target=withdraw_bad, args=(100,)) for _ in range(5)]
for t in threads:
    t.start()
for t in threads:
    t.join()
print("漏洞版余额：", balance)      # 很可能是负数


# ============ 安全版：用锁把「检查 + 执行」变成原子操作 ============
balance2 = 100
lock = threading.Lock()


def withdraw_ok(amount):
    global balance2
    with lock:
        if balance2 >= amount:
            time.sleep(0.01)
            balance2 -= amount


threads = [threading.Thread(target=withdraw_ok, args=(100,)) for _ in range(5)]
for t in threads:
    t.start()
for t in threads:
    t.join()
print("安全版余额：", balance2)     # 一定不会小于 0

print()
print("同样的模式出现在：库存扣减、优惠券领取、验证码校验、限次登录、支付回调。")
print("不完全依赖锁的做法（更适合分布式）：带条件的原子更新，")
print("例如 UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?")
