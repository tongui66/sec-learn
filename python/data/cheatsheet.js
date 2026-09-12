// Python 学习站 · 速查表（8 组）
var CHEATSHEET = [
{
 icon:"🚀", title:"环境与运行",
 items:[
  {k:"py --version", v:"确认本机 Python 版本（这台机器要用 py，不是 python）"},
  {k:"py -m venv .venv", v:"创建虚拟环境"},
  {k:".venv\\Scripts\\activate", v:"激活虚拟环境（Windows）", ex:".venv/bin/activate 是 Linux/Mac"},
  {k:"py -m pip install -U pip", v:"升级 pip（注意用 py -m pip，避免装错解释器）"},
  {k:"pip freeze > requirements.txt", v:"导出依赖（带 == 版本号，即锁版本）"},
  {k:"pip-audit", v:"扫描依赖里的已知漏洞（CVE）"},
  {k:"bandit -r . -ll", v:"扫描源码安全问题，只报中危以上"},
  {k:"ruff check .", v:"快速 lint"},
  {k:"py -c \"import sys; print(sys.executable)\"", v:"确认当前用的是哪个解释器"},
  {k:"py -m pydoc -b", v:"本地起文档服务器，离线查标准库"}
 ]},
{
 icon:"🧱", title:"语法与数据结构",
 items:[
  {k:"[x*2 for x in a if x>0]", v:"列表推导式（筛选 + 变换）"},
  {k:"{k: v for k, v in pairs}", v:"字典推导式"},
  {k:"a[1:5:2], a[::-1]", v:"切片：起点、终点、步长；[::-1] 是倒序"},
  {k:"a, b, *rest = seq", v:"解包（星号收集剩余元素）"},
  {k:"f\"{name} - {score:.2f}\"", v:"f-string 格式化"},
  {k:"d.get(k, default)", v:"取字典值，缺键返回默认值（比 d[k] 安全）"},
  {k:"set(a) & set(b)", v:"集合交集（也用于去重、白名单比对）"},
  {k:"a is None", v:"判断 None 用 is，不用 =="},
  {k:"sorted(xs, key=lambda t: t[1])", v:"按指定字段排序"},
  {k:"(x for x in a)", v:"生成器表达式：惰性求值，省内存"}
 ]},
{
 icon:"⚙️", title:"函数、类与工程",
 items:[
  {k:"def f(a, b=1, *args, **kw)", v:"参数顺序：位置、默认、可变位置、可变关键字"},
  {k:"def f(box=None): box = box or []", v:"可变默认参数的正确写法（别写 box=[]）"},
  {k:"@functools.wraps(fn)", v:"写装饰器时保留原函数元信息"},
  {k:"class A: def __init__(self)", v:"实例属性在 __init__ 里创建"},
  {k:"yield", v:"把函数变成生成器，惰性产出"},
  {k:"with open(p) as f:", v:"自动关闭资源（上下文管理器）"},
  {k:"try/except/else/finally", v:"精确捕获异常，不要写裸 except"},
  {k:"if __name__ == \"__main__\":", v:"只在直接运行时执行的入口判断"},
  {k:"logging.getLogger(__name__)", v:"标准日志用法（不要用 print 记日志）"},
  {k:"@dataclass", v:"自动生成 __init__ / __repr__，少写样板代码"}
 ]},
{
 icon:"📁", title:"文件与路径（安全写法）",
 items:[
  {k:"p = (base / name).resolve()", v:"先展开成绝对路径", ex:"顺序不能反：先 resolve 再判断"},
  {k:"p.relative_to(base)", v:"确认还在允许目录内（不在则抛 ValueError）"},
  {k:"Path.read_text(encoding=\"utf-8\")", v:"明确编码，避免 Windows 下乱码"},
  {k:"pathlib.Path vs os.path", v:"优先 pathlib，可读性好、有 resolve"},
  {k:"tempfile.mkstemp()", v:"安全创建临时文件（别用 mktemp）"},
  {k:"shutil.copy2(src, dst)", v:"复制文件（注意两个路径都要校验）"},
  {k:"os.path.basename(name) != name", v:"快速判断「是不是纯文件名」"},
  {k:"file.read(MAX_BYTES+1)", v:"限制读取大小，防大文件打爆内存"}
 ]},
{
 icon:"🌐", title:"网络与 HTTP",
 items:[
  {k:"requests.get(url, timeout=(3,10))", v:"永远写超时：连接超时 + 读取超时"},
  {k:"allow_redirects=False", v:"SSRF 场景禁止自动跳转（跳转可绕过校验）"},
  {k:"verify=True", v:"保持证书校验；verify=False 必须上报为问题"},
  {k:"socket.getaddrinfo(host, None)", v:"解析域名拿到 IP，用于内网地址判断"},
  {k:"ipaddress.ip_address(x).is_private", v:"判断是不是内网地址（还有 is_loopback/is_link_local）"},
  {k:"urlparse(url).scheme", v:"只允许 http/https，挡掉 file:// gopher:// 等"},
  {k:"Session() + HTTPAdapter(Retry(...))", v:"带重试的会话（注意重试次数也是攻击面）"},
  {k:"stream=True + iter_content", v:"大文件流式下载"},
  {k:"http.server", v:"标准库起一个最简服务，用于本地实验"}
 ]},
{
 icon:"🗄️", title:"数据库",
 items:[
  {k:"cur.execute(\"SELECT ... WHERE name = ?\", (name,))", v:"sqlite3 参数化（必须单独传参）"},
  {k:"%s 占位符", v:"PyMySQL / psycopg 的参数化写法"},
  {k:"ORDER BY 白名单映射", v:"排序字段不能参数化，只能白名单"},
  {k:"表名白名单", v:"表名和列名同样不能参数化"},
  {k:"\"?\" * len(ids)", v:"IN 列表：按长度拼占位符，值仍然单独传"},
  {k:"with sqlite3.connect(x) as conn:", v:"自动提交/回滚 + 关闭"},
  {k:".raw() / text() / extra()", v:"ORM 里的原始 SQL 出口——审计必搜"},
  {k:"executemany(sql, rows)", v:"批量插入（减少往返）"}
 ]},
{
 icon:"🔐", title:"密码学与随机",
 items:[
  {k:"secrets.token_urlsafe(32)", v:"生成安全随机令牌"},
  {k:"secrets.choice(digits)", v:"生成安全随机验证码"},
  {k:"hashlib.scrypt(pwd, salt=os.urandom(16))", v:"密码哈希（也可用 bcrypt/argon2）"},
  {k:"hmac.new(key, msg, hashlib.sha256)", v:"带密钥的签名"},
  {k:"hmac.compare_digest(a, b)", v:"常数时间比较，防时序攻击"},
  {k:"hashlib.md5/sha1", v:"❌ 不要用于安全场景（存密码、签名）"},
  {k:"random.randint", v:"❌ 不是密码学安全随机，不能用于令牌"},
  {k:"base64", v:"只是编码，不是加密"},
  {k:"itsdangerous.URLSafeTimedSerializer", v:"Flask 生态的「JSON + 签名 + 过期」方案"}
 ]},
{
 icon:"🛡️", title:"审计速查：危险函数与搜索词",
 items:[
  {k:"eval / exec / compile", v:"代码执行 —— 参数可控即高危"},
  {k:"ast.literal_eval", v:"✅ 只解析字面量的安全替代"},
  {k:"os.system / os.popen", v:"命令执行"},
  {k:"subprocess(..., shell=True)", v:"命令执行（shell=False + 列表参数才安全）"},
  {k:"__import__ / importlib.import_module", v:"动态导入，配合 getattr 可执行任意调用"},
  {k:"getattr / setattr / globals / locals / vars", v:"反射类调用，名字可控就危险"},
  {k:"pickle.load(s) / dill / joblib / torch.load", v:"反序列化 —— 对不可信数据等于 eval"},
  {k:"yaml.load（无 Loader）/ marshal.loads / shelve.open", v:"同类反序列化风险"},
  {k:"render_template_string / Template( / from_string", v:"SSTI"},
  {k:"open(路径) / send_file / send_from_directory", v:"路径穿越"},
  {k:"requests.get(用户 url) / urllib.urlopen", v:"SSRF"},
  {k:"execute(f\"...\") / .raw( / text(", v:"SQL 注入"},
  {k:"debug=True / verify=False / secret_key=", v:"危险配置"},
  {k:"全局搜索口令", v:"password、secret、token、api_key、AKIA、PRIVATE KEY"},
  {k:"全局搜索鉴权", v:"check_、verify_、auth、is_admin、permission、@csrf_exempt"}
 ]}
];
