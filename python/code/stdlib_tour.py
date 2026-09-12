"""
stdlib_tour.py —— 第 11 章 · 标准库速览

怎么跑：  py stdlib_tour.py
应该看到：各模块的最小可用示例
安全等级：✅ 安全
"""

import base64
import hashlib
import hmac
import json
import re
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path

# ---- pathlib：路径处理 ----
base = Path(".").resolve()
print("当前目录：", base)
print("路径拼接：", base / "sub" / "file.txt")

# ---- json：字符串与结构互转 ----
data = {"name": "tom", "scores": [90, 85]}
text = json.dumps(data, ensure_ascii=False)
print("json 编码：", text)
print("json 解码：", json.loads(text))

# ---- re：正则 ----
IPV4 = re.compile(r"^\d{1,3}(\.\d{1,3}){3}$")
print("IP 校验：", bool(IPV4.fullmatch("192.168.1.1")), bool(IPV4.fullmatch("1.2.3")))

# ---- hashlib / hmac：哈希与签名 ----
print("sha256：", hashlib.sha256(b"hello").hexdigest()[:16], "...")
key = secrets.token_bytes(32)
sig = hmac.new(key, b"message", hashlib.sha256).hexdigest()
print("hmac 签名：", sig[:16], "...")
print("常数时间比较：", hmac.compare_digest(sig, sig))

# ---- secrets：安全随机 ----
print("随机令牌：", secrets.token_urlsafe(16))
print("6 位验证码：", "".join(secrets.choice("0123456789") for _ in range(6)))

# ---- base64：只是编码，不是加密 ----
raw = b"admin:123456"
print("base64 编码：", base64.b64encode(raw).decode())
print("base64 解码：", base64.b64decode(base64.b64encode(raw)).decode())

# ---- datetime：带时区的时间 ----
now = datetime.now(timezone.utc)
print("UTC 现在：", now.isoformat())
print("一天后：  ", (now + timedelta(days=1)).isoformat())

# ---- collections / itertools：常用的数据处理 ----
from collections import Counter, defaultdict
from itertools import chain, islice

print("计数：", Counter("hello"))
groups = defaultdict(list)
groups["admin"].append("x")
print("defaultdict：", dict(groups))
print("串联：", list(chain([1, 2], [3, 4])))
print("取前 3：", list(islice(range(100), 3)))
