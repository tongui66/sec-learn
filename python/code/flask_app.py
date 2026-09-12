"""
flask_app.py —— 第 18 章 · SSTI 演示与正确写法

怎么跑：  pip install flask
          py flask_app.py
          浏览器： http://127.0.0.1:5001/welcome?nick=同学
应该看到：/welcome 的模板里拼了用户输入（有风险）；/welcome_safe 是正确写法
安全等级：⚠️ 含漏洞示范（只在 127.0.0.1 上实验，debug 保持关闭）
"""

from flask import Flask, render_template_string, request

app = Flask(__name__)


@app.route("/welcome")
def welcome():
    """❌ 模板字符串里拼了用户输入 —— 这就是 SSTI 的成因。

    攻击者在 nick 里写模板语法，就会被真正当成模板执行。
    这里不做演示性输入，只让你看清代码结构。
    """
    nick = request.args.get("nick", "游客")
    tpl = "<h1>欢迎 " + nick + " 来到 Python 学习站</h1>"
    return render_template_string(tpl)


@app.route("/welcome_safe")
def welcome_safe():
    """✅ 正确写法：模板固定，用户输入只作为「值」传入。"""
    nick = request.args.get("nick", "游客")
    return render_template_string("<h1>欢迎 {{ nick }} 来到 Python 学习站</h1>", nick=nick)


@app.route("/hello/<name>")
def hello(name):
    """✅ 更常见的正确写法：模板是文件，不是字符串。"""
    return render_template_string("<p>你好，{{ name }}！</p>", name=name)


if __name__ == "__main__":
    print("打开 http://127.0.0.1:5001/welcome?nick=同学       （有风险的写法）")
    print("再试 http://127.0.0.1:5001/welcome_safe?nick=同学   （正确写法）")
    print("对比两段代码，找出「模板字符串里有没有用户输入」这个差别。")
    app.run(port=5001, debug=False)
