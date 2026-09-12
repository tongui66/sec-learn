"""
deserialize_demo.py —— 第 17 章 · 为什么反序列化会执行代码

怎么跑：  py deserialize_demo.py
应该看到：__reduce__ 里登记的调用在反序列化时被触发；json 没有这个问题
安全等级：⚠️ 教学演示，不包含任何可用攻击载荷
"""

import json
import pickle


# ============ 演示：类可以定制自己的「反序列化行为」 ============
class Demo:
    """__reduce__ 返回 (可调用对象, 参数元组)。

    pickle 在「序列化」时记录它，在「反序列化」时执行它 ——
    这就是 pickle 能在 load() 内部执行代码的原理。

    这里用的是 print 这种无害函数，只为说明机制。
    真实攻击会用能执行命令的函数，所以 pickle.loads 对不可信数据
    等价于 eval —— 这是官方文档明确写过的结论。
    """

    def __reduce__(self):
        return (print, ("【注意】反序列化时我被调用了 —— 这就是风险所在",))


raw = pickle.dumps(Demo())
print("pickle 字节流长度：", len(raw), "字节")
print("下面这一行会触发上面登记的调用：")
pickle.loads(raw)


# ============ 对比：json 只能表达基础类型，没有副作用 ============
data = {"name": "tom", "scores": [90, 85]}
blob = json.dumps(data).encode()
print()
print("json 字节流：", blob)
print("json 解析结果：", json.loads(blob))

print()
print("结论：")
print("  1) pickle 对不可信数据 = eval，必须换成 json 或「JSON + 签名」")
print("  2) yaml.load 要用 yaml.safe_load")
print("  3) 签名的正确顺序是「先验完整性，再解析内容」")
print("  4) marshal / shelve / dill / joblib / torch.load 属于同一类风险")
