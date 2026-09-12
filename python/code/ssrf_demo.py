"""
ssrf_demo.py —— 第 12 章 · SSRF 演示（本地）

怎么跑：  终端 1： py -m http.server 9000 --bind 127.0.0.1
          终端 2： pip install flask requests
                  py ssrf_demo.py
          浏览器： http://127.0.0.1:5000/bad?url=http://127.0.0.1:9000/
应该看到：/bad 把本地 9000 端口的内容取回来了（这就是 SSRF）；/safe 返回 400
安全等级：⚠️ 含漏洞示范（只在 127.0.0.1 上实验）
"""

import ipaddress
import socket
from urllib.parse import urlparse

import requests
from flask import Flask, request

app = Flask(__name__)

# 只允许这两个域名 —— 白名单是 SSRF 防御的核心
ALLOW = {"example.com", "www.example.com"}


@app.route("/bad")
def bad():
    """❌ url 完全来自用户，等于让攻击者借服务器的身份发请求。"""
    url = request.args.get("url", "")
    try:
        return requests.get(url, timeout=3).text[:500]
    except Exception as e:
        return "出错：" + str(e)


def is_internal_host(host):
    """解析域名拿到 IP，判断是不是内网地址。解析失败一律拒绝。"""
    try:
        for info in socket.getaddrinfo(host, None):
            ip = ipaddress.ip_address(info[4][0])
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
                return True
    except Exception:
        return True
    return False


@app.route("/safe")
def safe():
    """✅ 协议白名单 + 域名白名单 + 内网地址校验 + 禁止跳转。"""
    url = request.args.get("url", "")
    u = urlparse(url)
    if u.scheme not in ("http", "https"):
        return "非法协议", 400
    if u.hostname not in ALLOW:
        return "域名不在白名单", 400
    if is_internal_host(u.hostname):
        return "禁止内网地址", 400
    return requests.get(url, timeout=3, allow_redirects=False).text[:500]


if __name__ == "__main__":
    print("打开 http://127.0.0.1:5000/bad?url=http://127.0.0.1:9000/")
    print("再试 http://127.0.0.1:5000/safe?url=http://127.0.0.1:9000/")
    print("思考：只屏蔽 127.0.0.1 能不能挡住 127.1 / 0.0.0.0 / localhost？")
    app.run(port=5000, debug=False)
