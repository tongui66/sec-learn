// 防火墙学习站 v2 · 第 9-14 章：Linux 实战
var CHAPTERS_C = [
{
id:9, title:"iptables 体系结构：四表五链与数据包旅程", stage:"Linux 实战",
intro:"命令可以查，但结构必须理解。这一章解决一个核心问题：一个包从网卡进来，到底经过了什么、在哪个环节被哪张表处理——理解了这个，规则写在哪、为什么不生效，全都有答案。",
sections:[
{h:"9.1 netfilter 和 iptables 是什么关系", tbl:[
["概念","是什么","层次"],
["netfilter","Linux 内核里的包处理框架，在协议栈中埋了若干钩子（hook）","内核"],
["iptables","操作 netfilter 的命令行工具（前端）","用户态"],
["nftables","新一代内核子系统 + nft 命令，正在取代 iptables","内核 + 用户态"],
["ufw / firewalld","更友好的前端，最终仍然生成 iptables/nftables 规则","用户态"]],
p:["所以「iptables 防火墙」严格说应该是「netfilter 内核防火墙，用 iptables 来配置」。这个区分在排障时很重要：规则没生效，可能是前端没写进去，也可能是内核模块没加载。"]},
{h:"9.2 五个钩子与两次路由决策", code:[
"                        ┌──────────────┐\n   网卡收到包 ─────────►│  PREROUTING   │  raw → mangle → nat\n                        └──────┬───────┘\n                               │  第一次路由决策：这包是给我的，还是要转发？\n                 ┌─────────────┴─────────────┐\n         给我（本机）                    转发（不是给我）\n                 │                             │\n        ┌────────▼────────┐          ┌─────────▼─────────┐\n        │      INPUT      │          │      FORWARD      │\n        │  mangle→filter  │          │  mangle → filter  │\n        └────────┬────────┘          └─────────┬─────────┘\n                 │                             │\n            交给本机进程                   第二次路由决策（选出口）\n                 │                             │\n                 │                     ┌───────▼────────┐\n        本机发出的包 ────►┌───────────►  │  POSTROUTING   │  mangle → nat\n                         │              └───────┬────────┘\n                    ┌────┴─────┐                │\n                    │  OUTPUT  │            发往网卡\n                    │raw→mangle│\n                    │ →nat→filter          \n                    └──────────┘"]},
{h:"9.3 四张表各管什么", tbl:[
["表","职责","可用链","日常使用频率"],
["filter","过滤：放行还是拒绝","INPUT / FORWARD / OUTPUT","★★★★★ 90% 的规则在这"],
["nat","地址转换：SNAT / DNAT / MASQUERADE","PREROUTING / OUTPUT / POSTROUTING","★★★★ NAT 和端口转发"],
["mangle","修改包（TTL、TOS、标记）","五个链都有","★ 特殊需求才用"],
["raw","在连接跟踪之前处理（NOTRACK）","PREROUTING / OUTPUT","★ 极少用"]]},
{h:"9.4 处理优先级：同一个链上，表有先后", p:["一个包经过某个钩子时，如果这个钩子上挂了多张表，它们按<b>固定优先级</b>依次处理，而不是你写规则的顺序。"]},
{tbl:[
["顺序","表","优先级数值","说明"],
["1","raw","-300","最先，用于绕过连接跟踪"],
["2","mangle","-150","修改包内容"],
["3","nat","-100","地址转换"],
["4","filter","0","最后做放行/拒绝判断"],
["5","security","50","SELinux 等安全模块（很少见）"]],
tip:"为什么这个顺序重要？因为 <b>nat 在 filter 之前执行</b>。做 DNAT 时，filter 表看到的已经是转换后的地址了——所以 FORWARD 链里的放行规则要写<b>转换后的内网地址</b>，不是公网地址。这是 DNAT 配了不通的头号原因。"},
{h:"9.5 表 × 链 矩阵（背下这张表，规则就不会写错位置）", tbl:[
["", "PREROUTING","INPUT","FORWARD","OUTPUT","POSTROUTING"],
["raw","✓","","","✓",""],
["mangle","✓","✓","✓","✓","✓"],
["nat","✓","","","✓","✓"],
["filter","","✓","✓","✓",""]],
note:"判位置的口诀：<b>「进来的还没决定给我还是转发」用 PREROUTING；「确定是给我的」用 INPUT；「不是给我的、要转发」用 FORWARD；「本机发出去的」用 OUTPUT；「快出门了」用 POSTROUTING。</b>"},
{h:"9.6 iptables / nftables：现在该学哪个", ul:["<b>iptables（legacy）</b>：老实现，几乎所有教程和面试题的基础，必须会。",
"<b>iptables-nft</b>：同一个命令，底层走 nftables。现代发行版默认就是它，你敲的 iptables 命令其实已经是 nftables 了。",
"<b>nft</b>：新语法，性能和表达能力更强，新项目推荐（第 14 章）。"]},
{p:["结论：<b>先学 iptables 的模型</b>（四表五链是通用的思维方式），再看 nft。如果跳过模型直接学 nft 语法，你会背命令但不会设计策略。"]}
],
secview:"一个包的一生：PREROUTING 判断去向 → INPUT（给我）或 FORWARD（转发）→ 本机处理或继续转 → POSTROUTING 出去。表按 raw→mangle→nat→filter 的顺序处理。记住 nat 在 filter 之前，DNAT 的坑就解开了一半。"
},
{
id:10, title:"iptables 基础实战：从零配一台不锁死自己的防火墙", stage:"Linux 实战",
intro:"这一章的目标非常具体：给你一台空白的 Linux，配出一台有状态、默认拒绝、但不会把自己锁死的防火墙。每个命令都解释为什么，而不是让你照抄。",
sections:[
{h:"10.1 命令语法骨架", code:[
"iptables  [ -t 表名 ]  操作  链名  匹配条件  -j 动作\n\n#   -t filter      操作哪张表（不写就是 filter）\n#   操作           -A 追加 / -I 插入到指定位置 / -D 删除 / -L 列出 / -F 清空 / -P 默认策略\n#   链名           INPUT / OUTPUT / FORWARD …\n#   匹配条件       -p -s -d --sport --dport -i -o -m 模块\n#   -j 动作        ACCEPT / DROP / REJECT / LOG / 自定义链\n\n# 读一条规则：\nsudo iptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT\n#       └追加 └入站   └TCP   └目标端口22 └只允许这个网段   └放行\n# 翻译成人话：「只允许 192.168.1.0/24 这个网段访问本机的 22 端口」"]},
{h:"10.2 查看规则（-n -v --line-numbers 是必备三件套）", code:[
"# 基础查看（-n 不做域名解析，快且准确）\nsudo iptables -L -n\n\n# 带计数器和行号（-v 看每条命中了多少包，--line-numbers 方便删除）\nsudo iptables -L -n -v --line-numbers\n\n# 只看某条链\nsudo iptables -L INPUT -n --line-numbers\n\n# 导出成规则语法（最推荐的查看方式，能直接看到原始规则）\nsudo iptables-save\n\n# 按行号删除第 3 条规则\nsudo iptables -D INPUT 3"]},
{tip:"排查时优先用 <b>iptables-save</b>，因为它输出的是规则原文，不会像 -L 那样把匹配条件折叠显示。-L -n -v 的计数器（pkts/bytes）也很有用：如果某条规则计数器一直是 0，说明流量根本没走到它。"},
{h:"10.3 常用匹配条件", tbl:[
["匹配","含义","示例"],
["-p tcp/udp/icmp","协议","-p tcp"],
["-s 地址[/掩码]","源地址","-s 192.168.1.0/24"],
["-d 地址[/掩码]","目的地址","-d 10.0.0.5"],
["--sport / --dport","源端口 / 目的端口","--dport 443"],
["-i / -o","入接口 / 出接口","-i eth0"],
["-m state --state","连接状态（老写法，兼容好）","-m state --state NEW"],
["-m conntrack --ctstate","连接状态（新写法，推荐）","-m conntrack --ctstate ESTABLISHED,RELATED"],
["-m multiport --dports","一次匹配多个端口","-m multiport --dports 80,443"],
["-m iprange --src-range","地址段范围","-m iprange --src-range 10.0.0.10-10.0.0.20"],
["-m mac --mac-source","源 MAC（仅内网有效）","-m mac --mac-source AA:BB:CC:DD:EE:FF"],
["-m limit","限速","-m limit --limit 10/min"],
["-m recent","记录与检查来源（防爆破）","-m recent --name ssh --update --seconds 60"]],
note:"-m state 和 -m conntrack 都能用：前者是旧模块（部分环境已标记过时），后者是新模块。<b>新配置建议统一用 conntrack。</b>"},
{h:"10.4 常用动作（-j 后面跟什么）", tbl:[
["动作","行为","说明"],
["ACCEPT","放行","规则链结束"],
["DROP","静默丢弃","不回任何消息"],
["REJECT","拒绝并回应","可配 --reject-with"],
["LOG","记录日志后继续往下走","不终止匹配，所以后面还要有真正的处置规则"],
["RETURN","返回上一层链","自定义链里常用"],
["自定义链名","跳到自定义链","组织结构化规则集（企业里常用）"]],
warn:"LOG 不是终结动作！很多人写了 `-j LOG` 就以为拦住了，实际上包会继续往下匹配。<b>正确写法是 LOG 之后紧跟一条 DROP/REJECT</b>。"},
{h:"10.5 最小可用有状态防火墙（顺序就是生命线）", code:[
"# ⚠ 请严格按顺序执行，并且务必保留一个已连接的 SSH 会话\n\n# ① 先清空、建默认拒绝策略之前，先把保命规则放进去\nsudo iptables -A INPUT -i lo -j ACCEPT\nsudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT\n\n# ② 验证上面三条确实在\nsudo iptables -L INPUT -n --line-numbers\n\n# ③ 现在才能设默认策略\nsudo iptables -P INPUT DROP\nsudo iptables -P FORWARD DROP\nsudo iptables -P OUTPUT ACCEPT        # 出站一般先保持放行\n\n# ④ 按需追加业务端口\nsudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT\n\n# ⑤ 业务需要内网访问的，做批量放行（单个端口用 --dport）\nsudo iptables -A INPUT -p tcp -s 10.0.0.0/24 -m multiport --dports 80,443 -j ACCEPT"]},
{h:"10.6 持久化：重启之后规则还在吗", p:["iptables 的规则默认<b>只存在于内存</b>，重启就没了。这是新手第二天上班最常见的惊吓。"]},
{tbl:[
["发行版","持久化方式","命令"],
["Ubuntu / Debian","iptables-persistent","sudo apt install iptables-persistent<br>sudo netfilter-persistent save"],
["CentOS / RHEL 7+","firewalld 或 iptables-services","sudo yum install iptables-services<br>sudo service iptables save"],
["通用（手动）","导出到文件，开机脚本恢复","sudo iptables-save &gt; /etc/iptables.rules<br>sudo iptables-restore &lt; /etc/iptables.rules"],
["使用 ufw / firewalld","它们自己负责持久化","ufw 自动；firewalld 需要 --permanent"]],
warn:"`sudo iptables-save > /etc/iptables/rules.v4` 这条命令在没装 iptables-persistent 的系统上会直接报错（目录不存在），而且<b>更危险的是：命令失败但你以为保存成功了</b>。养成习惯：写完立刻 `cat` 一下确认文件真的有内容。"},
{h:"10.7 新手错误对照表", tbl:[
["症状","常见原因","怎么查"],
["规则加了不生效","被前面更宽的规则提前命中","-L -n -v 看计数器，检查顺序"],
["规则加了不生效（另一种）","加到了错误的链或错误的表","iptables-save 看它到底在哪个链"],
["重启后规则消失","没做持久化","10.6"],
["把自己锁在机器外","先改了默认策略再放行 SSH","带外管理/救援模式恢复"],
["端口通了但服务不能用","只放行了入站，忘了相关回包或依赖端口","用 conntrack -L 看实际连接"],
["加了 DROP 还是被访问","DROP 写在 ACCEPT 后面","调整顺序：精确规则放前面"]],
tip:"一个极其有用的习惯：<b>每次改防火墙前，先开一个自动化回滚。</b>例如 `sleep 300 && iptables-restore < /root/iptables.backup`，五分钟内如果你没确认成功，规则自动恢复。这一条能救你无数次。"}
],
secview:"iptables 最小可用集只有四条：放行 lo、放行 ESTABLISHED/RELATED、放行 SSH 等必要服务、默认 DROP。顺序错了就会锁死自己，规则写错位置就不生效。记住 -L -n -v 和 iptables-save 这两个查看命令，排障就有了眼睛。"
},
{
id:11, title:"iptables 进阶：匹配模块、限速与自动封禁", stage:"Linux 实战",
intro:"基础规则只能做「开哪个口」，进阶模块才能做「防爆破、限速、按来源封禁」。这一章的内容直接对应生产环境里的实际需求。",
sections:[
{h:"11.1 一次匹配多个端口与地址段", code:[
"# 多个端口（比写多条规则清晰，性能也更好）\nsudo iptables -A INPUT -p tcp -m multiport --dports 80,443,8080 -j ACCEPT\n\n# 连续端口范围\nsudo iptables -A INPUT -p tcp -m multiport --dports 1000:2000 -j ACCEPT\n\n# 源地址范围\nsudo iptables -A INPUT -s 10.0.0.0/24 -m iprange --src-range 10.0.0.100-10.0.0.150 \\\n  -p tcp --dport 3306 -j ACCEPT"]},
{h:"11.2 限速：让服务活着，但别被打死", code:[
"# 每秒最多 10 个新连接，突发允许 20（超出的丢弃）\nsudo iptables -A INPUT -p tcp --dport 80 -m conntrack --ctstate NEW \\\n  -m limit --limit 10/s --limit-burst 20 -j ACCEPT\n\n# ICMP 限速（允许 ping，但不允许被 ping 洪泛）\nsudo iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT\n\n# 日志限速（否则日志会被刷爆，磁盘打满）\nsudo iptables -A INPUT -m limit --limit 5/min -j LOG --log-prefix \"IPT-DROP: \" --log-level 4"]},
{warn:"限速规则是双刃剑：`--limit 10/s` 对正常业务是限制，对攻击是缓解。<b>阈值必须基于你自己的真实业务量来定</b>，拍脑袋设一个值很容易把正常用户挡在外面。上线前先观察现有连接速率。"},
{h:"11.3 用 recent 模块做 SSH 自动封禁（很实用的一招）", p:["思路：记录每个来源 IP 尝试连接 SSH 的次数，短时间内超过阈值就加入黑名单封禁一段时间。这就是 fail2ban 的核心原理，只不过用 iptables 原生实现。"]},
{code:[
"# ① 已封禁的 IP 直接丢弃\nsudo iptables -A INPUT -p tcp --dport 22 -m recent --name SSH_BAN --rcheck \\\n  --seconds 600 -j DROP\n\n# ② 放行已建立的 SSH 连接（避免把自己踢掉）\nsudo iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\n\n# ③ 记录新连接来源（更新计数器）\nsudo iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW \\\n  -m recent --name SSH_BAN --set -j ACCEPT\n\n# ④ 超过 4 次就进入 BAN 名单\nsudo iptables -A INPUT -p tcp --dport 22 -m recent --name SSH_BAN --update \\\n  --seconds 600 --hitcount 4 -j DROP\n\n# 查看当前名单\ncat /proc/net/xt_recent/SSH_BAN"]},
{note:"recent 模块的语义：<code>--set</code> 添加/更新来源记录，<code>--rcheck</code> 只检查，<code>--update</code> 检查并刷新时间戳。上面这套组合的顺序很关键，<b>第 ① 条必须在最前面</b>，否则先被别的规则放行了就轮不到封禁。"},
{h:"11.4 connlimit：限制单 IP 并发连接数", code:[
"# 单个 IP 最多 20 个并发连接到 80 端口\nsudo iptables -A INPUT -p tcp --dport 80 -m connlimit --connlimit-above 20 \\\n  --connlimit-mask 32 -j REJECT --reject-with tcp-reset\n\n# 作用：缓解单机发起的大量并发（CC 攻击的常见形态）"]},
{h:"11.5 内容匹配与其他模块", tbl:[
["模块","作用","注意"],
["-m string --string","匹配包里的字符串","性能开销大，明文流量才有效"],
["-m tcp --tcp-flags","精确匹配 TCP 标志位","如只放行 SYN 包"],
["-m mac","按 MAC 限制","只在同一广播域内有效，跨路由失效"],
["-m owner","按本机进程/用户限制","只对 OUTPUT 有效，可用于限制某用户出网"],
["-m geoip","按国家/地区限制","需额外模块，精度有限，谨慎用于封禁"]],
warn:"`-m string` 做内容过滤是典型的「看着有用、实际拖垮性能」的做法：它要在每个包上做字符串搜索，高流量下会把 CPU 打满，而且设计上只支持明文。内容过滤请交给 WAF，别用 iptables 硬扛。"},
{h:"11.6 规则太多怎么办：ipset", p:["iptables 的匹配是链表式逐条比对，规则越多越慢；而且你想封 10000 个 IP，写 10000 条规则既不优雅也不高效。ipset 解决的正是这个问题：<b>把一堆地址装进一个集合，用一条规则匹配整个集合</b>。"]},
{code:[
"# 安装（Ubuntu）\nsudo apt install ipset\n\n# 创建一个集合\nsudo ipset create blacklist hash:ip timeout 3600\n\n# 往集合里加地址\nsudo ipset add blacklist 203.0.113.66\nsudo ipset add blacklist 198.51.100.0/24\n\n# 在 iptables 里一条规则引用整个集合\nsudo iptables -I INPUT -m set --match-set blacklist src -j DROP\n\n# 查看\nsudo ipset list blacklist\n\n# 持久化：ipset save > /etc/ipset.conf，开机用 ipset restore 恢复"]},
{tip:"ipset 是「规则简洁 + 匹配高效」的典型代表。企业级方案（如自动封禁系统）几乎都基于它：检测程序只负责往集合里增删 IP，防火墙规则永远只有一条。"},
{h:"11.7 日志：让防火墙可观测", code:[
"# 记录被丢弃的入站包（注意限速，否则日志会爆）\nsudo iptables -A INPUT -m limit --limit 5/min -j LOG \\\n  --log-prefix \"[FW-DROP-IN] \" --log-level 4\nsudo iptables -A INPUT -j DROP\n\n# 日志去哪了？\n#   Debian/Ubuntu: /var/log/kern.log  或 journalctl -k\n#   CentOS/RHEL:   /var/log/messages\ntail -f /var/log/kern.log | grep FW-DROP\njournalctl -k -f | grep FW-DROP"]},
{note:"没有日志的防火墙等于盲人。至少要让「被丢弃的入站连接」留下痕迹，这样你才能回答两个关键问题：有没有人在扫我？我自己有没有误封业务？"},
{h:"11.8 规则性能的三个常识", ul:["<b>规则是有成本的</b>：链表式匹配，最坏情况要遍历全部规则。把命中率高的规则放前面。",
"<b>模块是有成本的</b>：`-m string`、`geoip` 这类比纯五元组匹配重得多。",
"<b>大集合要用 ipset</b>：几百条以上的同类规则，通常都该改成集合。",
"<b>conntrack 是最大变量</b>：状态表满了（第 6 章）会直接丢包，比规则慢得多的问题更致命。"]}
],
secview:"进阶模块的价值在于把「策略」变成「自适应行为」：超阈值自动封禁（recent）、单 IP 限制并发（connlimit）、大名单高效匹配（ipset）。而这一切的前提是可观测——日志必须开。"
},
{
id:12, title:"NAT 与端口转发实战", stage:"Linux 实战",
intro:"前面讲了 NAT 的原理，这一章落地成可运行的配置：让内网共享上网、把内网服务发布到公网、以及处理内网访问公网地址的 hairpin 问题。",
sections:[
{h:"12.1 第一步永远是开启转发", code:[
"# 临时开启\nsudo sysctl -w net.ipv4.ip_forward=1\n\n# 永久开启（写入 /etc/sysctl.d/99-forward.conf）\nnet.ipv4.ip_forward = 1\n\n# 确认\ncat /proc/sys/net/ipv4/ip_forward   # 应为 1"]},
{warn:"`ip_forward=0` 时，内核根本不会转发数据包，你写的所有 nat 规则都不会被触发——现象是「配置全对但就是不通」。排查 NAT 问题，第一个要确认的就是它。"},
{h:"12.2 让内网共享上网（MASQUERADE）", code:[
"# 场景：网关双网卡，eth0 接内网 192.168.1.0/24，eth1 接公网\n\n# ① 开启转发\nsudo sysctl -w net.ipv4.ip_forward=1\n\n# ② 出站做源地址伪装\nsudo iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth1 -j MASQUERADE\n\n# ③ 放行转发流量（⚠ 默认策略是 DROP 时，这条不能少）\nsudo iptables -A FORWARD -i eth0 -o eth1 -j ACCEPT\nsudo iptables -A FORWARD -i eth1 -o eth0 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\n\n# ④ 内网主机的网关要指向这台机器\n#    客户端：route add default gw 192.168.1.1   （或在 DHCP 里下发）"]},
{h:"12.3 固定出口用 SNAT", code:[
"# 出口 IP 固定（专线 / 云主机弹性 IP）时，用 SNAT 更明确\nsudo iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -o eth1 -j SNAT --to-source 203.0.113.10\n\n# 多 IP 轮询（地址池）\nsudo iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -j SNAT --to-source 203.0.113.10-203.0.113.12"]},
{h:"12.4 端口转发 DNAT：把内网服务发布出去", code:[
"# 目标：公网 203.0.113.10:8080 → 内网 192.168.1.50:80\n\n# ① 目的地址转换\nsudo iptables -t nat -A PREROUTING -d 203.0.113.10 -p tcp --dport 8080 \\\n  -j DNAT --to-destination 192.168.1.50:80\n\n# ② 放行转发（⚠ 写的是转换后的内网地址，不是公网地址！）\nsudo iptables -A FORWARD -d 192.168.1.50 -p tcp --dport 80 -j ACCEPT\n\n# ③ 回包放行（有状态的话通常已被 ESTABLISHED 规则覆盖）\nsudo iptables -A FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\n\n# ④ 另一种常见写法：把本机端口转发到内网（本机做跳板）\nsudo iptables -t nat -A PREROUTING -p tcp --dport 9000 -j REDIRECT --to-port 8080"]},
{warn:"第 ② 步是 DNAT 配了不通的头号原因：<b>nat 表按前面的优先级把目的地址改成了内网地址，接着 filter 表的 FORWARD 链看到的就是 192.168.1.50 这个地址</b>。如果你在 FORWARD 里写的是公网地址，规则永远匹配不上。"},
{h:"12.5 hairpin NAT：内网访问公网映射地址", code:[
"# 现象：外网能访问 203.0.113.10:8080，内网机器访问同一个地址不通\n# 原因：回包走了内网直连，源地址不是内网机期望的公网地址（详见第 7 章）\n\n# 解决：让内网到内网的这部分流量也做源地址转换\nsudo iptables -t nat -A POSTROUTING -s 192.168.1.0/24 -d 192.168.1.50 \\\n  -p tcp --dport 80 -j SNAT --to-source 192.168.1.1\n\n# 说明：这样服务器看到的源地址是网关，回包必然经过网关，由网关再做还原"]},
{tip:"判断技巧：如果「外网能通、内网不通」，先怀疑 hairpin；如果「两边都不通」，先怀疑 FORWARD 链和 ip_forward。这个二分法能省下大量时间。"},
{h:"12.6 验证与排障", code:[
"# 看 NAT 会话是否建立（-n 不解析域名）\nconntrack -L -n | grep -i dnat\ncat /proc/net/nf_conntrack | grep -i \"src=\"\n\n# 看 NAT 表的计数（命中次数能告诉你规则有没有被走到）\nsudo iptables -t nat -L -n -v\n\n# 看 FORWARD 链计数\nsudo iptables -L FORWARD -n -v\n\n# 抓包看地址是否真的被转换了（在服务器侧抓）\nsudo tcpdump -i any -nn port 80 -c 10\n\n# 确认路由是否正确（回包有没有走回网关）\nip route\nip route get 203.0.113.10"]},
{h:"12.7 NAT 配置检查清单", ol:["ip_forward 是否开启（=1）？",
"nat 规则的位置对不对（出站 POSTROUTING，入站 PREROUTING）？",
"FORWARD 链放行了吗？放行的地址写对了吗（转换后的地址）？",
"回包路径对不对？（多网卡时经常出现非对称路由）",
"是不是 hairpin 问题（内网访问公网地址）？",
"conntrack 会话建立了吗？连接是 NEW 还是 ESTABLISHED？",
"抓包确认地址是否真的被转换？"]}
],
secview:"NAT 实战就三句话：出站改源在 POSTROUTING，入站改目的在 PREROUTING，转换关系靠 conntrack 记住。而 90% 的故障落在两处：忘了开 ip_forward，或者在 FORWARD 链里写了转换前的地址。"
},
{
id:13, title:"持久化、日志与排障方法论", stage:"Linux 实战",
intro:"这一章是「从会用变成能解决问题」的分水岭。防火墙的排障不是玄学，它是一套固定的排查顺序和一个极小的命令集合。",
sections:[
{h:"13.1 持久化：三种情况分清", tbl:[
["你的环境","怎么保存","怎么恢复"],
["装了 iptables-persistent","sudo netfilter-persistent save","开机自动恢复"],
["使用 ufw","不需要手动保存","sudo ufw enable 即持久"],
["使用 firewalld","带 --permanent 才算永久","sudo firewall-cmd --reload"],
["手动管理","sudo iptables-save > /etc/iptables.rules","sudo iptables-restore < /etc/iptables.rules"],
["只想临时测试","不用保存（重启即恢复）","reboot"]],
tip:"实验阶段的技巧：<b>先不保存</b>。规则只在内存里，重启就回到干净状态，这正是你想要的安全网。等确认配置正确了再持久化。"},
{h:"13.2 日志：三个必看的位置", code:[
"# ① 内核日志（iptables 的 LOG 动作写到这里）\nsudo tail -f /var/log/kern.log        # Debian / Ubuntu\nsudo tail -f /var/log/messages        # CentOS / RHEL\nsudo journalctl -k -f                 # systemd 系统通用\n\n# ② conntrack 相关消息（表满等问题）\nsudo dmesg | grep -i conntrack\n\n# ③ 应用自己的日志（很多时候问题在这，不在防火墙）\nsudo tail -f /var/log/nginx/error.log\nsudo journalctl -u sshd -n 50"]},
{h:"13.3 排障方法论：分层四问", p:["遇到「连不上」，永远按这个顺序问，不要跳步。跳步就会出现「查了半天防火墙，结果服务根本没启动」这种时间浪费。"]},
{ol:["<b>服务在听吗？</b>  `ss -lntp` 看端口是否 LISTEN，监听的是 0.0.0.0 还是 127.0.0.1。",
"<b>本机防火墙放行了吗？</b>  `iptables -L -n -v` / `ufw status` 看规则和计数器。",
"<b>路由和网关对吗？</b>  `ip route`、`ip route get 目标IP` 看从哪个网卡出去。",
"<b>上游/对端有问题吗？</b>  在两端同时抓包，看包到底走到了哪里、有没有回包。"]},
{note:"这四个问题对应的工具极小：<b>ss、iptables -L、ip route、tcpdump</b>。把这四个命令练熟，你就具备了排查任何网络连通性问题的骨架。至于云上还要加安全组（第 17 章），那是这条链上的额外一层。"},
{h:"13.4 三板斧命令（背下来）", code:[
"# ① 本机在听哪些端口（-l 监听 -n 不解析 -t TCP -p 显示进程）\nsudo ss -lntp\n\n# ② 防火墙规则 + 命中计数\nsudo iptables -L -n -v --line-numbers\n\n# ③ 抓包（-i any 所有网卡，-nn 不做解析，-c 抓多少包）\nsudo tcpdump -i any -nn host 203.0.113.5 and port 443 -c 20\n\n# 补充：实时看连接状态\nsudo ss -tan state established\nsudo ss -s"]},
{h:"13.5 现象 → 结论 对照表（最有价值的一张表）", tbl:[
["现象","大概率原因","验证方法"],
["连接一直卡住，最后超时","被 DROP 丢弃，或对端不存在","两端口抓包：对端没收到就是中间丢了"],
["立刻返回连接被拒绝","端口没监听，或被 REJECT","ss -lntp 看监听；抓包看有没有 RST"],
["本机能连，别的机器连不上","服务只绑了 127.0.0.1","ss -lntp 看监听地址"],
["能 ping 通但端口不通","防火墙按端口拦了（ICMP 和 TCP 是不同规则）","iptables -L -n -v 看计数器"],
["偶尔通、偶尔不通","conntrack 表满 / 限速规则 / 负载均衡多台不一致","dmesg 查 conntrack"],
["重装系统后就不通了","规则没持久化","iptables-save 看当前规则"],
["加了规则还是不通","规则顺序错了，或加到了错的链","用计数器确认规则有没有被命中"],
["内网通、外网不通","NAT / 端口映射 / 安全组","从外网侧抓包，看包有没有到"]]},
{h:"13.6 抓包：怎么用结果说话", code:[
"# 场景：怀疑某个端口被防火墙拦了\n# 先在「客户端」抓包，看 SYN 到底发出去了\nsudo tcpdump -i any -nn tcp and port 3389\n\n# 判定逻辑：\n#   客户端发出 SYN，服务端没收到      → 中间设备丢了（防火墙/云安全组）\n#   服务端收到 SYN，但没回 SYN-ACK   → 服务端本机防火墙拦了\n#   服务端回了 SYN-ACK，客户端没收到  → 回程路径被拦\n#   服务端回 RST                       → 端口没监听，或被 REJECT\n\n# 同时在两端抓包，对比时间线，几乎所有连通性问题都能定位"]},
{tip:"抓包 + 两端对比是最有说服力的排障方式。它能把「我觉得是防火墙的问题」变成「服务端收到了 SYN 但没有回包，所以问题在服务端本机防火墙」——结论明确，不用猜。"},
{h:"13.7 一个完整的排障实例", p:["<b>现象</b>：用户反馈从办公网访问 10.0.0.20:3306 数据库不通，但从数据库本机能连。"]},
{ol:["<b>第一问（服务在听吗）</b>：`ss -lntp | grep 3306` → 显示监听在 0.0.0.0:3306，服务正常。排除「没启动」和「只绑本机」。",
"<b>第二问（本机防火墙）</b>：`iptables -L INPUT -n -v --line-numbers` → 发现默认策略 DROP，且只有 22/80/443 三条放行规则，没有 3306。",
"<b>确认是这条</b>：`iptables -L INPUT -n -v` 的默认策略行计数器在增长 —— 说明确实有包被默认拒绝，而且时间点和用户反馈吻合。",
"<b>修复</b>：按最小权限原则，只放行应用服务器网段，而不是全网：",
"`sudo iptables -I INPUT 3 -p tcp -s 10.0.1.0/24 --dport 3306 -j ACCEPT`",
"<b>验证</b>：让应用侧重试，同时 `iptables -L INPUT -n -v` 观察该条规则计数器 +1；连接成功。",
"<b>收尾</b>：`netfilter-persistent save` 持久化，并补一条说明写进变更记录。"]},
{note:"注意修复动作里用的是 <code>-I INPUT 3</code>（插入到第 3 条）而不是 <code>-A</code>（追加到末尾）。因为如果前面存在更宽的 DROP 规则，追加到末尾可能永远匹配不到——<b>这正是「加了规则不生效」的经典原因</b>。"}
],
secview:"排障的骨架是四个问题：服务在听吗、本机防火墙放行吗、路由对吗、上游有问题吗。工具只有四个：ss、iptables -L、ip route、tcpdump。把现象和原因的对照表记住，你的排查就从「猜」变成了「验证」。"
},
{
id:14, title:"ufw / firewalld / nftables：更现代的选择", stage:"Linux 实战",
intro:"日常运维很少直接手写 iptables，而是用 ufw（Ubuntu）或 firewalld（RHEL 系）。它们本质上是 iptables/nftables 的前端，理解底层之后学它们会非常快。",
sections:[
{h:"14.1 ufw：Ubuntu 的默认选择", code:[
"# ⚠ 顺序很重要：先放行 SSH，再启用\nsudo ufw allow 22\n\n# 启用（如果提示可能中断 SSH 连接，说明你还没放行 22，按 n 退出）\nsudo ufw enable\n\n# 查看状态（verbose 显示详细规则）\nsudo ufw status verbose\nsudo ufw status numbered      # 带编号，方便按编号删除\n\n# 放行端口 / 协议 / 来源\nsudo ufw allow 80\nsudo ufw allow 443/tcp\nsudo ufw allow from 192.168.1.100 to any port 3306\nsudo ufw allow from 10.0.0.0/24 to any port 22 proto tcp\n\n# 默认策略\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\n\n# 删除规则\nsudo ufw delete allow 80\nsudo ufw delete 3              # 按编号删\n\n# 临时关闭 / 重置\nsudo ufw disable\nsudo ufw reset"]},
{warn:"`ufw enable` 会立刻生效默认拒绝入站的策略。<b>如果你正在 SSH 上操作，且还没有放行 22，这一下就会断线。</b>要么先 allow 22，要么看到警告时选 n。"},
{h:"14.2 ufw 应用配置与 NAT", code:[
"# 使用预置的应用配置（内部就是一组规则）\nsudo ufw app list\nsudo ufw allow \"Nginx Full\"      # 同时放行 80 和 443\n\n# ufw 默认不暴露 NAT 配置入口，需要写进 /etc/ufw/before.rules 顶部\n#   *nat\n#   :PREROUTING ACCEPT [0:0]\n#   :POSTROUTING ACCEPT [0:0]\n#   -A POSTROUTING -s 192.168.1.0/24 -o eth1 -j MASQUERADE\n#   COMMIT\n# 同时要确认 /etc/ufw/sysctl.conf 里 net/ipv4/ip_forward=1\nsudo ufw reload"]},
{note:"ufw 的设计哲学是「简单场景为主」，一旦涉及 NAT、复杂策略，就会变得别扭。这时候直接回到 iptables/nftables 反而更清晰。这不是 ufw 的缺点，而是它的定位。"},
{h:"14.3 firewalld：以「区域」为中心", p:["firewalld 的核心概念是 <b>zone（区域）</b>：先给网卡分配一个区域，区域本身带有默认策略，你只需要往区域里加服务或端口。"]},
{tbl:[
["区域","默认行为","典型用途"],
["drop","丢弃所有入站，不回任何响应","最严格"],
["block","拒绝所有入站（有回应）","较严格"],
["public","放行常用服务，其余拒绝","公网网卡默认"],
["external","类似 public，启用地址伪装","出口网卡"],
["internal","信任内网，放行更多","内网网卡"],
["home / work","家庭/办公环境","宽松"],
["dmz","限定的对外服务区","DMZ"],
["trusted","全部放行","最高信任（慎用）"]]},
{h:"14.4 firewalld 常用命令", code:[
"# 查看当前生效的区域与网卡归属\nsudo firewall-cmd --get-active-zones\nsudo firewall-cmd --list-all\n\n# 放行服务（--permanent 才是永久，否则重启丢失）\nsudo firewall-cmd --permanent --add-service=http\nsudo firewall-cmd --permanent --add-service=https\nsudo firewall-cmd --permanent --add-port=8080/tcp\n\n# 永久规则必须 reload 才真正生效\nsudo firewall-cmd --reload\n\n# 把网卡分配到指定区域\nsudo firewall-cmd --permanent --zone=internal --change-interface=eth0\n\n# 富规则（rich rule）：表达更复杂的策略\nsudo firewall-cmd --permanent --add-rich-rule='rule family=\"ipv4\" source address=\"10.0.1.0/24\" port port=\"3306\" protocol=\"tcp\" accept'\n\n# 查看与删除\nsudo firewall-cmd --permanent --list-rich-rules\nsudo firewall-cmd --permanent --remove-port=8080/tcp"]},
{tip:"firewalld 最容易踩的坑：<b>忘了 --permanent，或者加了 --permanent 忘了 --reload</b>。前者导致重启丢失，后者导致「我明明加了却不生效」。养成习惯：加完规则后固定执行一次 reload，再用 --list-all 确认。"},
{h:"14.5 nftables：下一代语法", code:[
"# 创建表和链（inet 表示同时处理 IPv4 和 IPv6）\nsudo nft add table inet filter\nsudo nft add chain inet filter input '{ type filter hook input priority 0; policy drop; }'\n\n# 放行本机回环和已建立连接\nsudo nft add rule inet filter input iif lo accept\nsudo nft add rule inet filter input ct state established,related accept\n\n# 放行 SSH，并限制来源\nsudo nft add rule inet filter input tcp dport 22 ip saddr 10.0.0.0/24 accept\n\n# 集合：一条规则处理一堆地址（相当于 ipset 的内建能力）\nsudo nft add set inet filter blacklist '{ type ipv4_addr; }'\nsudo nft add element inet filter blacklist '{ 203.0.113.66 }'\nsudo nft add rule inet filter input ip saddr @blacklist drop\n\n# 查看与保存\nsudo nft list ruleset\nsudo nft list ruleset > /etc/nftables.conf"]},
{tbl:[
["对比点","iptables","nftables"],
["规则组织","表 + 链（固定）","表 + 链（自定义，更灵活）"],
["地址集合","需要额外 ipset","内建 set/map"],
["IPv4/IPv6","分别用 iptables / ip6tables","统一用 inet 表"],
["性能","链表式匹配","内部优化，规则多时更快"],
["原子更新","逐条生效","支持原子替换整套规则集"]]},
{h:"14.6 该用哪个：一张选择表", tbl:[
["场景","建议"],
["个人桌面 / 简单服务器","ufw（简单直观）"],
["RHEL / CentOS 系服务器","firewalld（生态一致）"],
["需要复杂 NAT / 精细策略","直接写 iptables 或 nftables"],
["规则规模大、要原子更新","nftables"],
["面试与考证","iptables 必考，nftables 加分"]],
note:"不管用哪个前端，<b>底层模型都是一样的</b>：默认拒绝、有状态放行、最小开放。工具只是语法糖，理解了第 9 章的数据包旅程，任何前端你都能在半小时内上手。"}
],
secview:"ufw 直白、firewalld 讲区域、nftables 更现代，但它们都在做同一件事：把「默认拒绝 + 最小开放」翻译成内核规则。工具会换代，策略思想不会。"
}
];
