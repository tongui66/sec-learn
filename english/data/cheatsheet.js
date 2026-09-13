// 英语四级 · 速查表（8 组）
var CHEATSHEET = [
{
 icon:"⏰", title:"考试流程与时间分配",
 items:[
  {k:"总分与及格", v:"710 分，425 分通过（约 60%）"},
  {k:"写作", v:"106.5 分，1 篇，30 分钟", ex:"强制先做，时间到收卷一"},
  {k:"听力", v:"248.5 分，25 题，约 25 分钟", ex:"自动播放，只放一遍，播完立刻收答题卡一"},
  {k:"阅读", v:"248.5 分，30 题，40 分钟", ex:"仔细阅读 142 + 长篇匹配 71 + 选词填空 35.5"},
  {k:"翻译", v:"106.5 分，1 段，30 分钟", ex:"140-160 字汉语译成英文"},
  {k:"推荐做题顺序", v:"写作 → 听力 → 仔细阅读 → 长篇匹配 → 翻译 → 选词填空", ex:"按分值从高到低，选词填空放最后"},
  {k:"听力涂卡", v:"必须边听边涂", ex:"听力结束立刻收卡，没有补涂时间"},
  {k:"检查时间", v:"留 5 分钟", ex:"查有没有漏涂、错位"}
 ]},
{
 icon:"📚", title:"语法速查：句子与动词",
 items:[
  {k:"五种基本句型", v:"S+V / S+V+O / S+V+P / S+V+O1+O2 / S+V+O+C", ex:"读长句先找这五种主干"},
  {k:"主谓一致", v:"along with / as well as 后面不影响主语", ex:"The teacher, along with the students, IS..."},
  {k:"长难句切分", v:"找谓语 → 去从句 → 去介词短语 → 读主干", ex:"修饰的三大标志：从句、介词短语、分词"},
  {k:"一般现在", v:"do / does", ex:"事实、习惯、客观规律"},
  {k:"一般过去", v:"did", ex:"过去发生、已结束"},
  {k:"现在完成", v:"have / has done", ex:"过去发生 + 影响到现在；配 for / since / already / so far"},
  {k:"过去完成", v:"had done", ex:"过去的过去；两个过去动作里先发生的那个"},
  {k:"将来完成", v:"will have done", ex:"到将来某时已完成；配 by + 时间"},
  {k:"❌ 现在完成时的禁区", v:"不能和 yesterday / last week / in 2019 连用", ex:"I have seen him yesterday ✗"},
  {k:"被动语态", v:"be + 过去分词", ex:"时态体现在 be 上：is done / has been done / must be done"},
  {k:"❌ 没有被动的动词", v:"happen / occur / appear / rise / arrive", ex:"An accident was happened ✗"},
  {k:"虚拟语气（现在）", v:"If + 过去式, would + 动词原形", ex:"If I were you, I would..."},
  {k:"虚拟语气（过去）", v:"If + had done, would have done", ex:"If I had studied, I would have passed."}
 ]},
{
 icon:"🔗", title:"语法速查：从句与非谓语",
 items:[
  {k:"定语从句（人）", v:"who（主语/宾语）、whom（宾语）、whose（谁的）", ex:"The man who is standing there is my teacher."},
  {k:"定语从句（物）", v:"which / that", ex:"The book which I bought is useful."},
  {k:"定语从句（时间/地点/原因）", v:"when / where / why", ex:"the day when we met"},
  {k:"❌ that 不能用的情况", v:"非限制性从句（有逗号）、介词后面", ex:"Beijing, WHICH is the capital..."},
  {k:"状语从句：原因", v:"because / since / as / now that", ex:"❌ 不能和 so 同时用"},
  {k:"状语从句：让步", v:"although / though / even if / while", ex:"❌ 不能和 but 同时用"},
  {k:"状语从句：条件", v:"if / unless / as long as / provided that", ex:"Unless you hurry, you'll be late."},
  {k:"状语从句：目的", v:"so that / in order that", ex:"He left early so that he could catch the bus."},
  {k:"名词性从句：是否", v:"whether（所有位置）／ if（只在宾语从句）", ex:"介词后、句首、or not 前只能用 whether"},
  {k:"强调句", v:"It is / was + 被强调部分 + that + 其余", ex:"去掉 It is 和 that 句子仍完整 → 就是强调句"},
  {k:"非谓语：to do", v:"要去做（目的、将来），主动", ex:"I have a lot of work to do."},
  {k:"非谓语：doing", v:"正在做 / 主动 / 抽象名词", ex:"The man standing there is my teacher."},
  {k:"非谓语：done", v:"被做（被动、已完成）", ex:"The window broken yesterday has been fixed."},
  {k:"非谓语只在后面跟一种", v:"to do：want / hope / decide / plan / manage", ex:"doing：enjoy / finish / avoid / mind / suggest"},
  {k:"⚠️ 意思会变的动词", v:"stop / remember / forget / try / regret", ex:"stop to do 停下来去做；stop doing 停止做"}
 ]},
{
 icon:"🎧", title:"听力技巧",
 items:[
  {k:"预读选项", v:"播放前的几十秒圈出名词和数字", ex:"选项里反复出现的词 = 话题"},
  {k:"视听一致", v:"听到什么选什么", ex:"短篇新闻主要靠这条"},
  {k:"同义替换", v:"正确答案常换说法", ex:"长对话主要靠这条，要警惕原词陷阱"},
  {k:"顺序原则", v:"题目顺序 = 音频顺序", ex:"做完一题立刻扫下一题选项"},
  {k:"短篇新闻", v:"第一句是主旨，必出题", ex:"数字、原因、时间地点必考"},
  {k:"长对话出题点", v:"问答处 / 转折后 / 建议句 / 结尾句", ex:"Why not / You'd better / Have you considered"},
  {k:"听力篇章结构", v:"开头立论 → 中间举例 → 结尾总结", ex:"和阅读文章结构一样"},
  {k:"数字题", v:"听清关系，不算错", ex:"rose by 20%（增 20%）vs rose to 20%（增到 20%）"},
  {k:"听不懂的应急", v:"立刻放弃，选一个，看下一题", ex:"纠结一题 = 丢三题"},
  {k:"三遍精听法", v:"① 模拟 ② 逐句听写 ③ 对照跟读", ex:"第二遍最有价值：找出「为什么没听出来」"},
  {k:"跟读（shadowing）", v:"音频说三个词，你跟着说", ex:"跟不上就 0.75 倍速"}
 ]},
{
 icon:"📖", title:"阅读技巧",
 items:[
  {k:"做题顺序", v:"仔细阅读（142）→ 长篇匹配（71）→ 选词填空（35.5）", ex:"选词填空放最后，限时 7 分钟"},
  {k:"仔细阅读步骤", v:"读首段+各段首句 → 看题干圈关键词 → 回原文定位 → 逐项比对", ex:"不要通读全文"},
  {k:"四类干扰项", v:"偷换概念 / 以偏概全 / 无中生有 / 正话反说", ex:"看到 all / always / never 先警惕"},
  {k:"语气一致原则", v:"原文 may／might，选项不能 must／prove／always", ex:"语气被夸大的选项通常是错的"},
  {k:"态度题", v:"找评价性形容词和副词", ex:"作者态度几乎不走极端"},
  {k:"推断题", v:"定位后往前走一步", ex:"走两步就是过度推断，错"},
  {k:"词义题", v:"看上下文：同义重复 or 反义对比", ex:"in other words / but / however"},
  {k:"指代题", v:"往前找复数名词，注意单复数一致", ex:"they / these / such"},
  {k:"长篇匹配三步", v:"圈独特关键词 → 回原文扫 → 确认语义", ex:"15 段对 10 题，有 5 段不被选"},
{k:"高端同义替换", v:"important=significant；reduce=cut down；solve=address", ex:"积累 50 组，定位速度翻倍"},
  {k:"生词太多时", v:"跳形容词副词，抓逻辑词判态度", ex:"一个生词卡 5 秒以上就跳"},
  {k:"精读一篇=做十篇", v:"逐题定位 + 分析每个错误选项 + 抄 5 词 5 短语", ex:"隔天重做一遍"}
 ]},
{
 icon:"✍️", title:"写作模板与高分句型",
 items:[
  {k:"三段式", v:"引出话题+观点 → 论点+例证 → 总结+建议", ex:"每段不超过 4 句"},
  {k:"字数", v:"120-180 词；约 140 词最稳", ex:"开头 35 + 中间 60 + 结尾 45"},
{k:"开头万能句", v:"Nowadays, there is a growing concern over ______."},
  {k:"观点句", v:"From my perspective, ______ plays an important role in ______."},
  {k:"论点 1", v:"First and foremost, ______. For example, ______."},
  {k:"论点 2", v:"Moreover, ______. A case in point is that ______."},
  {k:"结尾", v:"In conclusion, ______. It is high time that we ______."},
  {k:"倒装（加分）", v:"Only in this way can we ______.", ex:"一句就够，别多用"},
  {k:"强调句（加分）", v:"It is widely acknowledged that ______."},
  {k:"书信格式", v:"Dear + 称呼, → I am writing to... → 内容 → I would appreciate it if... → Yours sincerely, + 签名"},
  {k:"通知格式", v:"NOTICE（居中）→ 目的 → 时间 / 地点 / 要求 → 落款单位 + 日期"},
  {k:"⚠️ 最高扣分项", v:"跑题 > 字数不足 > 通篇简单句", ex:"写前 5 分钟审题列提纲"},
  {k:"写完必查", v:"主谓一致 / 时态 / 冠词 / 拼写 / 字数 / 切题", ex:"留 5 分钟"}
 ]},
{
 icon:"🌏", title:"翻译技巧与高频词",
 items:[
  {k:"五步法", v:"通读定时态 → 断句 → 找主干 → 补修饰 → 检查", ex:"一句中文 = 一句英文"},
  {k:"无主句", v:"改被动，或补主语 we / people", ex:"Measures should be taken to..."},
  {k:"流水句", v:"断句 + 分词 / 从句 / and 连接", ex:"Built in 1990, this bridge is..."},
  {k:"文化词", v:"拼音 + 简单解释", ex:"zongzi, a traditional Chinese food made of rice"},
  {k:"「越来越多」", v:"an increasing number of", ex:"比 more and more 更书面"},
  {k:"「随着…的发展」", v:"With the development of ..."},
  {k:"「追溯到」", v:"date back to / trace back to"},
  {k:"「起重要作用」", v:"play an important role in"},
  {k:"「不仅…而且」", v:"not only ... but also ...", ex:"放句首要倒装"},
  {k:"高频话题词：文化", v:"traditional culture, cultural heritage, custom, preserve"},
  {k:"高频话题词：经济", v:"economy, economic growth, income, consumption, rapidly"},
  {k:"高频话题词：科技", v:"technology, innovation, artificial intelligence, mobile payment"},
  {k:"高频话题词：环境", v:"environment, pollution, sustainable, emission, energy"},
  {k:"⚠️ 翻译忠告", v:"宁可写简单句，每句都写、每句都对", ex:"一句错的长难句可能一分不得"}
 ]},
{
 icon:"⚡", title:"考场应急与检查清单",
 items:[
  {k:"听力没听懂", v:"立刻放掉，选一个，看下一题"},
  {k:"阅读一篇完全看不懂", v:"先做有把握的，其余按态度倾向猜", ex:"选客观、温和的选项"},
  {k:"时间不够", v:"保翻译和仔细阅读；选词填空全涂一个答案"},
  {k:"作文写不出来", v:"先写模板句搭起结构，再填内容"},
  {k:"翻译卡住一个词", v:"换说法或用拼音加解释，不要空着"},
  {k:"推断题没把握", v:"选语气温和、平衡的那个（objective / neutral）"},
  {k:"考前 3 天", v:"看错题本 + 背模板 + 1 套真题保持手感", ex:"不做新题、不背新词"},
  {k:"错题四栏记录", v:"题目信息 / 我选了什么 / 错因归类 / 下次怎么做"},
  {k:"错因只有四类", v:"没定位到 / 词汇不认识 / 语气判断错 / 时间不够", ex:"统计出最多的那类，就是你该补的方向"},
  {k:"真题资源", v:"english-exam.lazynote.cn/cet4/", ex:"懒笔记四级真题全集，2015-2026 共 76 套"},
  {k:"单词 App", v:"百词斩 / 不背单词，每天再背 30 个大纲词", ex:"本站 300 词是核心，不是全部"}
 ]}
];
