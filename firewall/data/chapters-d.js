// 防火墙学习站 v2 · 第 15-17 章：主机与云
var CHAPTERS_D = [
{
id:15, title:"Windows 防火墙实战", stage:"主机与云",
intro:"Windows 防火墙是你能零成本马上动手的实验台：不用装虚拟机、不用买设备，一台电脑就能练完整的入站/出站规则。而且它的规则优先级有个和 Linux 不太一样的地方，做运维一定会遇到。",
sections:[
{h:"15.1 三个配置文件（Profile）", tbl:[
["配置文件","什么时候生效","默认策略倾向"],
["域（Domain）","电脑加入了域，且能联系到域控","相对宽松（信任企业网络）"],
["专用（Private）","家庭/办公等可信网络","中等"],
["公用（Public）","机场、咖啡厅等不可信网络","最严格"]],
p:["Windows 会依据当前网络的类型选择对应配置文件。注意：<b>如果同时有多个配置文件匹配，取最严格的那一个</b>。所以「我在专用网络放行了，怎么还是不通」常常是因为 Windows 认为当前网络是公用。"]},
{code:[
"# 查看三个配置文件的状态（管理员 PowerShell 或 CMD）\nnetsh advfirewall show allprofiles\nnetsh advfirewall show allprofiles state\n\n# PowerShell 方式\nGet-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction, DefaultOutboundAction"]},
{h:"15.2 默认行为与优先级", ul:["<b>入站默认阻止，出站默认允许</b>——这是 Windows 防火墙的出厂设置。",
"<b>阻止规则优先于允许规则</b>：如果同一个流量同时命中一条允许和一条阻止，结果是阻止（除非用「覆盖阻止规则」的显式设置）。这一点和 iptables 的「首条命中」逻辑不同。",
"<b>本机到本机的回环流量不受防火墙规则限制</b>：所以你在本机测试服务永远成功，别的机器却连不上——这个差异坑过无数人。"]},
{warn:"因为「阻止优先」，出问题时不要只盯着允许规则：还要 `Get-NetFirewallRule -Action Block` 查一下有没有隐藏的阻止规则（某些软件会自动创建）。"},
{h:"15.3 图形界面：wf.msc", code:[
"# 打开高级安全 Windows Defender 防火墙\nWin + R  →  输入 wf.msc  →  回车\n\n界面结构：\n  入站规则 / 出站规则\n    每一项可以按「配置文件」和「协议端口」筛选\n  新建规则向导：\n    程序  → 指定 exe 的访问权限\n    端口  → 指定 TCP/UDP 端口\n    预定义 → 系统内置的服务组"]},
{tip:"学习最快的路径：先用向导建一条规则，然后回到列表里双击它，看它到底生成了哪几条属性（协议、端口、配置文件、远程地址、操作）。<b>看懂生成物，比记住向导流程有用得多。</b>"},
{h:"15.4 netsh 命令行（兼容性最好）", code:[
"# 查看全部规则（输出很长，建议配合 findstr 过滤）\nnetsh advfirewall firewall show rule name=all\nnetsh advfirewall firewall show rule name=all | findstr /i 3389\n\n# 放行入站 TCP 3389（远程桌面）\nnetsh advfirewall firewall add rule name=允许RDP dir=in action=allow protocol=TCP localport=3389\n\n# 只允许指定来源访问 22 端口\nnetsh advfirewall firewall add rule name=白名单SSH dir=in action=allow protocol=TCP localport=22 remoteip=192.168.1.100\n\n# 阻止某端口入站（注意：阻止优先，加了这条即使有允许规则也会被挡）\nnetsh advfirewall firewall add rule name=禁止MySQL dir=in action=block protocol=TCP localport=3306\n\n# 删除规则（按名字）\nnetsh advfirewall firewall delete rule name=禁止MySQL\n\n# 开/关防火墙（按配置文件）\nnetsh advfirewall set allprofiles state on\nnetsh advfirewall set publicprofile state off\n\n# 开启被丢弃连接的日志\nnetsh advfirewall set allprofiles logging droppedconnections enable"]},
{h:"15.5 PowerShell 命令行（现代做法）", code:[
"# 新建一条入站放行规则\nNew-NetFirewallRule -DisplayName \「允许RDP-仅专用网络\" `\n  -Direction Inbound -Protocol TCP -LocalPort 3389 -Action Allow -Profile Private\n\n# 只允许指定网段\nNew-NetFirewallRule -DisplayName \」允许内网SSH\" `\n  -Direction Inbound -Protocol TCP -LocalPort 22 -RemoteAddress 192.168.1.0/24 -Action Allow\n\n# 查看规则及其端口条件\nGet-NetFirewallRule -DisplayName \"*RDP*\" | Get-NetFirewallPortFilter\n\n# 只列出阻止类规则（排查隐藏阻止）\nGet-NetFirewallRule -Action Block -Enabled True | Select-Object DisplayName, Profile, Direction\n\n# 修改已有规则 / 删除规则\nSet-NetFirewallRule -DisplayName \「允许RDP-仅专用网络\" -Enabled False\nRemove-NetFirewallRule -DisplayName \」允许RDP-仅专用网络\"\n\n# 用组批量启用/禁用\nEnable-NetFirewallRule -DisplayGroup \「远程桌面\」"]},
{note:"netsh 和 PowerShell 是同一套底层规则的两种写法，改其中一边另一边都能看到。微软已经把 netsh 标为「不推荐新用」，<b>新脚本建议用 PowerShell 写</b>，但你要能读懂 netsh 写法——大量存量资料和面试题都是 netsh。"},
{h:"15.6 日志：问题现场在哪", code:[
"# 日志默认是关闭的，先开\nnetsh advfirewall set allprofiles logging droppedconnections enable\nnetsh advfirewall set allprofiles logging maxfilesize 8192\n\n# 日志文件位置（默认）\n%systemroot%\\system32\\LogFiles\\Firewall\\pfirewall.log\n\n# 用 PowerShell 直接读最近的丢弃记录\nGet-Content \"$env:systemroot\\system32\\LogFiles\\Firewall\\pfirewall.log\" -Tail 50"]},
{h:"15.7 常见坑（每一个都真实高频）", tbl:[
["现象","真实原因","怎么确诊"],
["本机访问正常，别人连不上","服务只绑了 127.0.0.1，或防火墙没放入站","netstat -ano | findstr 端口 看监听地址"],
["加了允许规则还是不通","同时存在阻止规则（阻止优先）","Get-NetFirewallRule -Action Block"],
["规则加了只在某些网络生效","配置文件不匹配（专用 vs 公用）","看规则属性里的 Profile，和当前网络类型比对"],
["用程序规则不生效","程序路径变了，或服务以系统账户运行","改用端口规则，或核对可执行文件路径"],
["远程改防火墙把自己锁死","先加了阻止/关掉了防火墙","远程操作前先加一条保命允许规则"],
["端口在监听但连不上","只放了 TCP，实际服务用 UDP（或反之）","netstat 看协议"]],
warn:"如果你正在通过远程桌面管理一台机器，<b>改防火墙前务必先加一条明确的「允许 3389 入站」规则并确认它在生效列表里</b>，然后再做其他改动。这样即使配错了，你也还能进去。"},
{h:"15.8 排查三板斧", code:[
"# ① 端口有没有在听（含监听地址）\nnetstat -ano | findstr :3389\nGet-NetTCPConnection -LocalPort 3389 -State Listen\n\n# ② 从本机测对端端口通不通（Test-NetConnection 的别名是 tnc）\nTest-NetConnection -ComputerName 10.0.0.5 -Port 3389\n\n# ③ 看是哪条规则在拦\nGet-NetFirewallRule -Enabled True -Direction Inbound | Get-NetFirewallPortFilter\n\n# 补充：看当前网络类型（决定哪个配置文件生效）\nGet-NetConnectionProfile"]},
{note:"Windows 侧的排查顺序和 Linux 完全一致：<b>先看服务在不在听、再看到底是哪个配置文件在生效、最后才看规则细节</b>。「本机能连说明服务没问题」这个结论在 Windows 上是<b>错</b>的，因为回环流量根本不经过防火墙。"}
],
secview:"Windows 防火墙记住三件事：入站默认阻止、阻止优先于允许、本机回环不受规则影响。这三条能解释绝大多数「明明放行了却连不上」的问题。"
},
{
id:16, title:"主机加固与自动封禁", stage:"主机与云",
intro:"防火墙只控制「谁能连进来」，主机加固负责「就算连进来也拿不到什么」。这两件事是一套的：暴露面越小，防火墙越容易配得对。",
sections:[
{h:"16.1 第一步永远是关闭不需要的服务", code:[
"# 看本机到底听了哪些端口（-l 监听 -n 数字 -t TCP -u UDP -p 进程）\nsudo ss -lntup\n\n# 对照第 3 章的端口表，逐个问：这个端口是谁开的？需要对外吗？\n\n# 查看某个进程是什么服务\nsudo ss -lntp | grep 6379\nsudo systemctl status redis\n\n# 关掉不需要的\nsudo systemctl disable --now redis-server"]},
{tip:"这一条的价值被严重低估。很多「高危漏洞」的本质是：<b>一个根本不需要对外的主机，开着一堆根本用不到的服务</b>。先做减法，再做规则，攻击面会小一个数量级。"},
{h:"16.2 SSH 加固（最值得花时间的十分钟）", code:[
"# /etc/ssh/sshd_config 里的关键项\n\nPort 2222                     # 换个端口，减少自动化扫描噪音（不是安全边界！）\nPermitRootLogin no            # 禁止 root 直接登录\nPasswordAuthentication no     # 只允许密钥登录\nPubkeyAuthentication yes\nMaxAuthTries 3                # 减少尝试次数\nAllowUsers deploy ops         # 只允许指定用户登录\nClientAliveInterval 300\nClientAliveCountMax 2\n\n# 改完检查语法，再重启（先检查！）\nsudo sshd -t\nsudo systemctl restart sshd\n\n# 再配合防火墙限源，双保险\nsudo iptables -A INPUT -p tcp --dport 2222 -s 10.0.0.0/24 -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 2222 -j DROP"]},
{warn:"改 SSH 端口常被误认为是安全措施。<b>它挡不住有备而来的攻击者，只是减少日志噪音。</b>真正的防线是：密钥登录 + 禁止 root + 限源 + fail2ban。改端口时务必先确认新端口已放行、旧会话不要关，否则一样会锁死自己。"},
{h:"16.3 fail2ban：从日志里自动发现并封禁", p:["原理很简单：<b>读日志 → 匹配失败模式 → 超过阈值就调用防火墙封禁 IP 一段时间</b>。它是「可观测 + 自动响应」的最小实现，很值得理解。"]},
{code:[
"# 安装\nsudo apt install fail2ban\n\n# 不要改 jail.conf（升级会被覆盖），改为新建 /etc/fail2ban/jail.local\n\n[DEFAULT]\nbantime  = 3600          # 封禁时长（秒）\nfindtime = 600           # 统计窗口\nmaxretry = 5             # 窗口内失败几次就封\nbackend  = systemd\nbanaction = iptables-multiport\n\n[sshd]\nenabled = true\nport    = 2222\n\n# 启动并查看\nsudo systemctl enable --now fail2ban\nsudo fail2ban-client status sshd\n\n# 手动解封（万一封了自己）\nsudo fail2ban-client set sshd unbanip 203.0.113.66"]},
{note:"看看它的 banaction 就明白了：fail2ban 自己不做过滤，它只是<b>帮你在 iptables / nftables / firewalld 里增删规则</b>。所以「fail2ban 的原理」这道面试题，答案就是第 11 章那个 recent 模块的自动化版本。"},
{h:"16.4 别忘了：防火墙之外的主机防线", tbl:[
["机制","作用","和防火墙的关系"],
["SELinux / AppArmor","限制进程能访问哪些资源","完全不同的层：管的是「程序能做什么」"],
["最小权限","服务用低权限账户运行","即使被打穿，损失也有限"],
["补丁管理","修掉已知漏洞","防火墙挡不住应用层漏洞"],
["文件权限与审计","防止本地提权与留后门","纵深防御的最后一环"],
["EDR / 主机监控","发现异常进程与行为","防火墙看不到进程层的事"]],
p:["常见的思维误区是「把防火墙当成万能防线」。防火墙管的是<b>网络可达性</b>；SELinux 管的是<b>进程能力</b>；补丁管的是<b>漏洞本身</b>。三者不能互相替代。"]},
{h:"16.5 主机加固检查清单", ol:["`ss -lntup` 逐个确认监听的端口，关掉不需要的服务",
"操作系统与中间件补丁到最近的安全版本",
"SSH：禁 root、禁密码、限源、限尝试次数",
"数据库、Redis、Docker API 等只监听内网地址（不要绑 0.0.0.0）",
"防火墙默认拒绝，只放行业务必要端口，且尽量限源",
"开启防火墙日志与登录日志，并定期查看",
"部署 fail2ban 或类似的自动封禁",
"确认 SELinux / AppArmor 的状态（不用可以，但要知道它当前是什么状态）",
"给关键操作留下审计痕迹（谁在什么时候改了什么）"]}
],
secview:"主机加固的顺序是：先做减法（关掉不需要的服务），再做限制（最小权限、限源），最后做响应（日志 + 自动封禁）。防火墙只是这套流程里的一环，不是全部。"
},
{
id:17, title:"云防火墙：安全组、NACL 与云上排查顺序", stage:"主机与云",
intro:"云上的防火墙逻辑和物理网络一样，但多了一层抽象，而且非常容易「漏看一层」——本机防火墙配好了、安全组却忘了开，或者反过来。这一章把云上的层次理清楚。",
sections:[
{h:"17.1 云网络的防护层次", code:[
"  流量进入\n     │\n     ▼\n  ① DDoS 防护 / 云清洗         ← 抗流量攻击\n     │\n     ▼\n  ② WAF / 云防火墙             ← 应用层过滤、访问控制\n     │\n     ▼\n  ③ 网络 ACL（子网级）          ← 无状态、按规则号匹配\n     │\n     ▼\n  ④ 安全组（实例级）            ← 有状态、默认拒绝入站\n     │\n     ▼\n  ⑤ 云主机本机防火墙            ← iptables / ufw / Windows 防火墙\n     │\n     ▼\n  ⑥ 服务监听                    ← 这一步没做，前面全白搭"]},
{tip:"云上排查的黄金顺序就是<b>从下往上</b>：先确认服务在监听，再查本机防火墙，再查安全组，再查 NACL，最后查云防火墙。反过来查会浪费大量时间，因为绝大多数故障在下面三层。"},
{h:"17.2 安全组 vs 网络 ACL", tbl:[
["对比项","安全组（Security Group）","网络 ACL（NACL）"],
["作用范围","实例（网卡）级","子网级"],
["是否有状态","<b>有状态</b>：放行入站后回包自动放行","<b>无状态</b>：入站和出站要分别放行"],
["规则类型","多数云只支持「允许」规则","允许 + 拒绝都支持"],
["匹配方式","全部规则合并判断","按规则号从小到大，首条命中即生效"],
["默认行为","默认拒绝所有入站、允许所有出站","默认允许全部"],
["典型用途","精细控制单台机器","子网级的粗粒度隔离"]],
warn:"NACL 是<b>无状态</b>的，这是最容易踩的坑：你在入站放行了 443，如果出站没放行对应的返回流量（临时端口段），连接照样不通。<b>安全组有状态所以不需要担心回包，NACL 必须双向都配。</b>"},
{h:"17.3 安全组的六个高频坑", ol:["<b>出站规则忘了配</b>：有些云的安全组默认允许出站，但如果你手动改了，可能连更新都下不来。",
"<b>只加了入站没加出站</b>（部分云的安全组出站默认拒绝）。",
"<b>把管理端口开成 0.0.0.0/0</b>：22 / 3389 对全网开放，日志里很快就会满是爆破记录。",
"<b>用另一个安全组做来源</b>：云上支持「源=某安全组」的写法，比写 IP 段更好维护，但很多人不知道。",
"<b>默认安全组没清理</b>：新实例如果不指定，会挂到默认安全组上，而它可能被改得很宽。",
"<b>忘记 NACL 与路由表</b>：安全组放行了，但子网路由表没有指向网关，或者 NACL 挡了。"]},
{code:[
"# 云上排查清单（以「外网访问不了」为例）\n\n# ① 服务在监听吗？监听地址对不对？\nsudo ss -lntp\n\n# ② 本机防火墙放行了吗？\nsudo iptables -L INPUT -n -v\nsudo ufw status\n\n# ③ 安全组放行了入站端口吗？（控制台检查，注意协议和源地址范围）\n# ④ 出站规则允许回包吗？\n# ⑤ 子网关联的 NACL 双向都放行了吗？\n# ⑥ 路由表有指向 Internet 网关 / NAT 网关的默认路由吗？\n# ⑦ 有没有绑定弹性公网 IP / 负载均衡？\n# ⑧ 云防火墙 / WAF 上有没有额外的拦截策略？"]},
{h:"17.4 云上防护的最佳实践", tbl:[
["实践","做法","收益"],
["分层安全组","web 组 / app 组 / db 组，组间用「来源=安全组」互通","改 IP 不用改规则"],
["管理端口限源","22 / 3389 只允许堡垒机或办公出口网段","爆破日志几乎归零"],
["数据库不放公网","只允许应用安全组访问 3306","消除最大的拖库风险"],
["出站受控","限制出站目标，阻断异常外连","减少数据外传与 C2 回连"],
["日志与告警","开启流日志，对异常连接告警","可观测性"],
["基础设施即代码","安全组规则用配置文件管理","可审计、可回滚、防手抖"]],
note:"云安全有一个和物理网络不同的特点：<b>改一条安全组规则只需要几秒钟，而且往往是几十台机器同时生效</b>。方便的同时意味着风险放大的速度也快——所以「用配置文件和评审流程管理规则」在云上比在机房里更重要。"}
],
secview:"云上排查记住六个字：从下往上、逐层排除。服务监听 → 本机防火墙 → 安全组 → NACL → 路由 → 云防火墙。安全组有状态、NACL 无状态，这是最容易搞混的一对概念。"
}
];
