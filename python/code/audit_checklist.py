"""
audit_checklist.py —— 第 15、20 章 · 项目自查脚本

怎么跑：  py audit_checklist.py <要审计的项目目录>
          例：py audit_checklist.py C:\\myproject
应该看到：按「危险函数 / 危险配置 / 疑似密钥」分类，列出命中的文件和行号
安全等级：✅ 安全（只读，不修改任何文件）

说明：这只是「第一遍粗筛」。命中的行必须人工确认数据流；
      没命中的地方也不能默认安全（静态搜索一定有漏报）。
"""

import re
import sys
from pathlib import Path

# 每一条：(标签, 正则, 说明)
PATTERNS = [
    ("代码执行", r"\beval\s*\(", "eval：参数可控即任意代码执行"),
    ("代码执行", r"\bexec\s*\(", "exec：同上"),
    ("命令执行", r"os\.system\s*\(", "命令拼接"),
    ("命令执行", r"os\.popen\s*\(", "命令拼接"),
    ("命令执行", r"shell\s*=\s*True", "subprocess shell=True"),
    ("动态导入", r"__import__\s*\(", "模块名可控即危险"),
    ("动态导入", r"import_module\s*\(", "同上"),
    ("反射", r"\bgetattr\s*\(", "名字可控时可执行任意调用"),
    ("反射", r"\b(globals|locals|vars)\s*\(", "动态作用域访问"),
    ("反序列化", r"pickle\.loads?\s*\(", "对不可信数据等于 eval"),
    ("反序列化", r"marshal\.loads?\s*\(", "同类风险"),
    ("反序列化", r"yaml\.load\s*\(", "需确认是否显式用了 SafeLoader"),
    ("反序列化", r"(dill|joblib|torch)\.load\s*\(", "模型文件也可能是恶意的"),
    ("模板注入", r"render_template_string\s*\(", "确认模板里有没有用户输入"),
    ("模板注入", r"\bTemplate\s*\(", "确认模板来源"),
    ("SQL 注入", r'execute\s*\(\s*f["\']', "f-string 拼 SQL"),
    ("SQL 注入", r"execute\s*\([^)]*%", "百分号格式化拼 SQL"),
    ("SQL 注入", r"\.raw\s*\(", "ORM 的原始 SQL 出口"),
    ("SQL 注入", r"\.extra\s*\(", "ORM 的 extra 出口"),
    ("路径问题", r"send_file\s*\(", "确认路径是否可穿越"),
    ("路径问题", r"send_from_directory\s*\(", "同上"),
    ("路径问题", r"tempfile\.mktemp\s*\(", "有竞态，应改 mkstemp"),
    ("网络", r"requests\.(get|post|put|delete)\s*\(", "确认有无 timeout、url 是否可控"),
    ("网络", r"verify\s*=\s*False", "关闭了证书校验"),
    ("危险配置", r"debug\s*=\s*True", "生产环境必须关闭"),
    ("危险配置", r"secret_key\s*=", "确认是否硬编码或弱密钥"),
    ("危险配置", r"csrf_exempt", "确认是否真的需要豁免 CSRF"),
    ("鉴权风险", r"except[^:]*:\s*$", "确认 except 之后是否中断执行"),
    ("随机与哈希", r"hashlib\.(md5|sha1)\s*\(", "不要用于密码或签名"),
    ("随机与哈希", r"\brandom\.(random|randint|choice)\s*\(", "安全场景应该用 secrets"),
    ("疑似密钥", r'(?i)(password|passwd|secret|api_key|apikey|token)\s*=\s*["\'][^"\']{3,}["\']', "疑似硬编码凭据"),
    ("疑似密钥", r"AKIA[0-9A-Z]{16}", "疑似 AWS Access Key"),
]

SKIP_DIRS = {".git", ".venv", "venv", "__pycache__", "node_modules", "dist", "build", ".idea"}


def scan(root: Path):
    hits = []
    for path in root.rglob("*.py"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        try:
            lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
        except Exception:
            continue
        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            if stripped.startswith("#"):
                continue
            for tag, pattern, desc in PATTERNS:
                if re.search(pattern, line):
                    hits.append((tag, path, i, desc, stripped[:100]))
    return hits


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        print("用法： py audit_checklist.py <项目目录>")
        return
    root = Path(sys.argv[1]).resolve()
    if not root.is_dir():
        print("不是有效目录：", root)
        return

    print(f"扫描目录：{root}")
    print()
    hits = scan(root)
    if not hits:
        print("没有命中任何已知的危险模式。")
        print("注意：这不代表代码安全 —— 静态搜索一定有漏报。")
        return

    order = ["代码执行", "命令执行", "反序列化", "模板注入", "SQL 注入",
             "动态导入", "反射", "路径问题", "危险配置", "鉴权风险",
             "随机与哈希", "网络", "疑似密钥"]
    for tag in order:
        group = [h for h in hits if h[0] == tag]
        if not group:
            continue
        print(f"=== {tag}（{len(group)} 处）===")
        for _, path, line, desc, src in group:
            rel = path.relative_to(root)
            print(f"  {rel}:{line}  {desc}")
            print(f"      {src}")
        print()

    print(f"共命中 {len(hits)} 处。")
    print("下一步：对每一处按四步法追数据流 —— 输入点是谁、有没有过滤、能不能打到危险函数。")


if __name__ == "__main__":
    main()
