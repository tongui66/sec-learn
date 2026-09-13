// 英语四级 · 第 12-17 章：四大题型
var CHAPTERS_C = [
{
id:12, title:"听力（一）：短篇新闻", stage:"四大题型",
intro:"短篇新闻是听力开头的 7 道题（49.7 分）。<b>它的特点是「语速快、信息密、开头就是重点」</b>——这一章教你新闻听力的固定套路。",
sections:[
{h:"12.1 短篇新闻的结构（三段七题）", tbl:[
["项目","内容"],
["题量","3 篇新闻，共 7 道题"],
["分值","每题 7.1 分，合计 49.7 分"],
["语速","约 130-150 词/分钟（比长对话快）"],
["长度","每篇 120-180 词"],
["特点","<b>开头句 = 主旨</b>；一句一信息；数字、原因、结果必考"]]},
{note:"<b>新闻听力的黄金规律：第一句话就是全文主旨，第一句必定出题。</b>很多人开局走神，第一题就丢了——<b>听力开始前的那 30 秒，一定要预读选项。</b>"},
{h:"12.2 预读选项：听力最重要的动作", p:["音频播放前有几十秒空隙。<b>这段时间不是用来休息的，是用来预读选项、预测问题的。</b>"]},
{code:[
`预读时快速圈出这些词：

  A) The number of visitors increased sharply.
  B) The museum was closed for repairs.
  C) A new exhibition will open next month.
  D) The tickets are sold out.

  → 圈出名词：visitors, museum, exhibition, tickets
  → 判断话题：博物馆相关
  → 预测问题：可能问「发生了什么事 / 博物馆怎么安排」
  → 听的时候重点抓：数字变化、关闭、开放时间

结论：预读让你「带着问题去听」，而不是「听完再想它说了什么」。`]},
{tip:"<b>预读的正确顺序：</b>先看题干关键词（名词、数字），再看选项差异。<b>选项里反复出现的词，就是这段话的主题。</b>听到主题词时立刻警觉——答案就在附近。"},
{h:"12.3 新闻里的三类必考点", tbl:[
["考点","信号词","例子"],
["<b>数字与变化</b>","increased / dropped / rose by / percent","Sales rose by 15 percent last quarter."],
["<b>原因与结果</b>","because of / due to / as a result / led to","The flight was delayed due to heavy fog."],
["<b>时间与地点</b>","on Monday / in the northern region / since 2019","The meeting will be held on Monday."]]},
{code:[
`真题高频新闻话题（听到这些词就要警觉）：

  事故类：accident, crash, injure, rescue, casualty
  天气类：storm, flood, drought, temperature, forecast
  经济类：economy, unemployment, inflation, GDP, trade
  科技类：research, study, technology, launch, discover
  健康类：disease, vaccine, hospital, treatment, outbreak
  教育类：university, students, tuition, scholarship

  动词信号：announce / report / reveal / warn / urge / ban`]},
{h:"12.4 视听一致：听到什么选什么", p:["短篇新闻的答案<b>绝大多数是原文的原词复现</b>，不需要你推理。这一条和长对话不同——<b>长对话靠同义替换，新闻靠原词复现。</b>"]},
{code:[
`视听一致的三种形态：

  ① 完全原词：听到 The museum will close on Monday.
              → 选项：The museum will close on Monday. ✓

  ② 部分原词 + 同义替换：
     听到：The number of tourists dropped by 20 percent.
     选项：Visitor numbers fell considerably. ✓

  ③ 顺序一致原则：题号顺序 = 音频顺序
     第 1 题答案一定在第 2 题之前出现，
     所以做完一题要立刻扫下一题的选项。`]},
{h:"12.5 听不懂时的三个应急策略", ol:["<b>抓开头句</b>：新闻第一句就是主旨。<b>哪怕后面全听不懂，抓住第一句也能做对一道题。</b>",
"<b>抓重复词</b>：重复出现两次以上的词，一定是主题词，和它相关的选项优先。",
"<b>抓转折后</b>：but / however / yet 后面的内容才是重点，前面的都是铺垫。",
"<b>果断放弃</b>：一题没听懂就立刻跳下一题，<b>不要纠结，否则会连丢三题。</b>"]},
{tip:"<b>最重要的一条：听力不能回头。</b>音频只放一遍，纠结一题 = 放弃三题。<b>没听懂就凭语感选一个，立刻看下一题的选项。</b>"},
{h:"12.6 练习方法：三遍精听法", ol:["<b>第一遍：模拟考试。</b>不看原文、不复听、限时做题。做完对答案，只标记对错，先不分析。",
"<b>第二遍：逐句精听。</b>一句一句暂停，写下来你听到的内容（听写）。<b>写不出来的地方就是你的听力盲区。</b>",
"<b>第三遍：对照原文跟读。</b>打开原文，找出「为什么没听出来」——是生词？连读？还是语速？然后跟着音频读 3 遍。"]},
{note:"<b>三遍精听法的价值在于第二遍。</b>很多人做完题只对答案，那等于把 90% 的价值扔掉了。<b>「没听出来的原因」才是你要补的东西。</b>"}
],
secview:"短篇新闻的打法：<b>预读选项圈名词 → 抓第一句主旨 → 数字/原因/时间必考 → 听到什么选什么 → 不懂就跳</b>。<b>再用三遍精听法练 10 篇新闻，这一块能稳定提高。</b>"
},
{
id:13, title:"听力（二）：长对话与听力篇章", stage:"四大题型",
intro:"长对话（8 题 56.8 分）和听力篇章（10 题 142 分）加起来 <b>198.8 分</b>，是听力里的大头。<b>听力篇章每题 14.2 分，是全卷最值钱的题之一。</b>",
sections:[
{h:"13.1 长对话：抓住「问答」和「转折」", p:["长对话是两个人的交谈（通常一男一女）。<b>题目顺序和对话顺序完全一致</b>，所以可以边听边做。"]},
{tbl:[
["出题位置","信号","例子"],
["<b>问答处</b>","第二个人回答的内容","Why did you choose...? / Well, because..."],
["<b>转折后</b>","but / however / actually / to be honest","I thought so too, but actually..."],
["<b>建议句</b>","Why not / How about / You'd better / I suggest","Why not try the online course?"],
["<b>数字与时间</b>","at 3 o'clock / on Friday / $50","Let's meet at 3 instead of 2."],
["<b>态度变化</b>","I'm afraid / To be honest / That's a problem","I'm afraid I can't make it."]]},
{code:[
`长对话最常考的三类问题：

  ① What is the man/woman going to do?
     → 抓「决定」和「计划」的句子：I'll... / I'm going to... / Let's...

  ② What do we learn about the man/woman?
     → 抓「身份、职业、态度」的暗示：
       I've been working in this hospital for... → 他是医生/护士

  ③ Why does the man/woman say that?
     → 抓这句话后面紧跟的解释（because / you see / the thing is）`]},
{h:"13.2 听力篇章：抓首句和主题词", p:["听力篇章是 3 段短文（每段 200 词左右），共 10 题。<b>它像一篇小阅读，结构清晰：开头立论 → 中间举例 → 结尾总结。</b>"]},
{code:[
`篇章的固定结构（听的时候按这个框架装信息）：

  第 1 句     → 主题句（必出题）
  中间段首句  → 分论点（可能出题）
  举例处      → for example / such as / take...as an example（细节题）
  数字处      → 时间、比例、金额（细节题）
  结尾处      → in conclusion / all in all / therefore（主旨题、态度题）

听力篇章的高频主题：
  研究发现、健康建议、职场方法、教育现象、环保问题、科技影响`]},
{note:"<b>听力篇章和阅读的文章结构几乎一样。</b>所以你在阅读里练的「找主题句、找论据」的能力，<b>可以直接搬到听力篇章上用。</b>"},
{h:"13.3 三大听力法则（通用）", tbl:[
["法则","含义","怎么用"],
["<b>视听一致</b>","听到的词和选项一致的多半是答案","新闻、篇章主要靠这条"],
["<b>同义替换</b>","正确答案常换一种说法","长对话主要靠这条，<b>要警惕原词陷阱</b>"],
["<b>顺序原则</b>","题目顺序 = 音频顺序","做完一题立刻扫下一题选项"]],
warn:"<b>特别注意「原词陷阱」：</b>长对话里，如果某个选项和原文用词一模一样，<b>反而要警惕</b>——它可能只是提到过但并非答案。<b>而仔细阅读里的正确答案，往往是同义改写。</b>"},
{h:"13.4 数字题的特殊处理", code:[
`数字题几乎每次必考，而且经常设「干扰数字」。听的时候要听清「关系」：

  1) 数字 + 变化：
     rose by 20%      → 增加了 20%
     rose to 20%      → 增加到 20%
     dropped from 40% to 25%  → 从 40% 降到 25%

  2) 数字 + 计算：
     The ticket is $30, but students get a 50% discount.
     → 学生票价是 $15（要算，不是听 $30）

  3) 时间 + 变动：
     The meeting was moved from Tuesday to Thursday.
     → 答案是 Thursday，不是 Tuesday

结论：听到数字先记下来，等听完再判断「它是不是答案」。`]},
{h:"13.5 时间分配与答题节奏", ol:["<b>听力开始前</b>：快速扫一遍所有选项，圈出名词和数字（这一步最关键）。",
"<b>播放中</b>：眼睛永远比耳朵提前一步——听第 1 题的时候，眼睛已经在扫第 2 题的选项。",
"<b>听不懂时</b>：立刻放弃，果断选一个，把注意力交给下一题。",
"<b>结束前</b>：听力播完后不再有额外时间，<b>所以答题卡必须边听边涂</b>。"]},
{tip:"<b>一个统计上的事实：四级听力里，长对话和篇章的答案，有相当比例出现在「对话中的第二个人说的内容」和「段落的第一句」。</b>没把握的时候，优先看这两处的选项。"}
],
secview:"长对话靠<b>问答 + 转折 + 建议</b>定位，听力篇章靠<b>首句 + 例子 + 结论</b>装信息；<b>三大法则（视听一致 / 同义替换 / 顺序原则）要能在听的时候自动运行，数字题要听清关系不算错。</b>"
},
{
id:14, title:"阅读（一）：长篇阅读匹配", stage:"四大题型",
intro:"长篇阅读（10 题 71 分）是「<b>送分题</b>」——只要方法对，正确率能到 8-10 题。<b>它的本质是「找对应」，不是「读懂」。</b>",
sections:[
{h:"14.1 长篇阅读长什么样", tbl:[
["项目","内容"],
["形式","1 篇约 1000 词的长文，分 A-O 共 15 段；10 个句子（题干）"],
["任务","给每个句子找到它出自哪一段"],
["分值","每题 7.1 分，共 71 分"],
["关键规则","<b>有的段落会被选两次，有的段落一次都不选</b>"],
["难度","<b>全卷最容易提分的一块</b>：不需要读懂全文，只需要定位"]]},
{note:"<b>为什么说它最容易？</b>因为它不考推理、不考主旨，只考「<b>这句话在原文哪里出现过</b>」。<b>你只要会找关键词、会做同义替换的比对，就能拿分。</b>"},
{h:"14.2 三步定位法", ol:["<b>第一步：给 10 个题干编号，圈出每句的「独特关键词」。</b>优先圈：① 大写专有名词 ② 数字和时间 ③ 生僻名词 ④ 绝对词（only、most、first）。<b>不要圈那些满篇都是的词</b>（people、study、research）。",
"<b>第二步：拿关键词回原文扫段落，先找「原词」，再找「同义替换」。</b>看到匹配的段落就先标上，不用马上确认。",
"<b>第三步：确认语义。</b>找到的段落里，必须有一整句和题干意思对应，而不只是出现过同一个词。<b>这一步专门对付「同词不同义」的陷阱。</b>"]},
{code:[
`实战示范：

题干 46) Some companies encourage employees to work from home
         to reduce office costs.

圈关键词：companies / work from home / reduce office costs

扫原文，找到 D 段：
  Many firms have adopted remote working policies,
  which allows them to cut down on expensive office space.

  companies  = firms（同义替换）
  work from home = remote working（同义替换）
  reduce office costs = cut down on expensive office space（同义替换）

→ 答案是 D。注意：这一段一个原词都没有，全是替换！`]},
{tip:"<b>同义替换是长篇阅读的灵魂。</b>平时练的时候，每做一题就把「题干词 → 原文词」的对应写下来，<b>积累 50 组以后，你会发现自己找答案的速度快一倍。</b>"},
{h:"14.3 常见同义替换（背下来能直接提速）", tbl:[
["题干常用词","原文可能的说法"],
["important","significant / vital / crucial / essential"],
["increase","rise / grow / surge / climb / go up"],
["decrease","decline / drop / fall / reduce / cut down"],
["cause","lead to / result in / give rise to / bring about"],
["solve","address / tackle / deal with / cope with"],
["many","a large number of / numerous / a great deal of"],
["some","a few / several / a certain number of"],
["people","individuals / citizens / the public / residents"],
["company","firm / corporation / enterprise / business"],
["research","study / survey / investigation / experiment"],
["show","reveal / indicate / suggest / demonstrate"],
["think","believe / argue / hold / maintain / claim"],
["difficult","hard / tough / challenging / demanding"],
["necessary","essential / indispensable / required"]]},
{h:"14.4 时间策略：10-12 分钟做完", ol:["<b>先扫一遍 10 个题干</b>（不是读原文），圈关键词。用时 2 分钟。",
"<b>优先做「有明显关键词」的题</b>（带数字、大写名词、生僻词的），这些题定位最快。",
"<b>剩下的题按段落顺序扫</b>，边扫边标。不要来回跳。",
"<b>最后用排除法</b>：如果某段已被选了两次，剩下的题就别再往那里找。",
"<b>时间上限 12 分钟</b>，到点就走，把时间留给仔细阅读。"]},
{warn:"<b>最大的误区：先通读全文再做题。</b>1000 词通读一遍就要 8-10 分钟，你根本没有时间做题了。<b>正确做法是「先看题干，带关键词回原文扫」。</b>"},
{h:"14.5 训练方法", code:[
`每周做 3 篇长篇阅读，每篇做完后做这件事（这是提分的关键）：

  1) 把错题重新定位一次，写下：
       题干关键词是什么？
       原文对应句是哪一句？
       我是被哪个「同义词」骗了？

  2) 把这一篇里的同义替换整理成 3-5 组，抄进本子：
       e.g.  reduce costs ↔ cut down on expenses

  3) 下一周开始前，先把上周整理的替换词组读一遍。

坚持一个月，你会发现自己「一眼就能看出哪个段落对应哪句话」。`]}
],
secview:"长篇阅读是<b>性价比最高的题型</b>：不用通读、只要定位。<b>核心动作是「圈关键词 → 找同义替换 → 确认语义」，核心储备是那 14 组高频替换。</b>练 20 篇，这一块能接近满分。"
},
{
id:15, title:"阅读（二）：仔细阅读", stage:"四大题型",
intro:"仔细阅读 10 题 <b>142 分</b>，是全卷分值最高的两块之一（另一块是听力篇章）。<b>每一题 14.2 分——多对 3 题就够你从 398 冲到 425。</b>",
sections:[
{h:"15.1 题型与分值", tbl:[
["项目","内容"],
["形式","2 篇文章，每篇 300-350 词，各 5 题"],
["分值","每题 14.2 分，共 142 分"],
["时间","建议 18-20 分钟（每篇 9-10 分钟）"],
["文章类型","社会科学、教育、科技、健康、商业、心理"],
["核心能力","定位 + 同义替换 + 排除干扰"]]},
{note:"<b>算一笔账：</b>仔细阅读每题 14.2 分。<b>你现在如果对 4 题，练到对 8 题，就是 +57 分</b>——这一块就够你过线了。<b>所以时间要优先投给这里。</b>"},
{h:"15.2 十大题型（按出现频率）", tbl:[
["题型","典型问法","解法"],
["① 细节题","According to the passage, ...","<b>关键词定位，找同义替换</b>"],
["② 推断题","It can be inferred that ...","定位后往前推一步，<b>不能推太远</b>"],
["③ 词义题","The word \"X\" in Para. 3 means ...","<b>看上下文</b>：同义重复或反义对比"],
["④ 主旨题","What is the passage mainly about?","看首段末句 + 各段首句"],
["⑤ 态度题","What is the author's attitude?","找评价性形容词、副词"],
["⑥ 指代题","What does \"they\" refer to?","<b>往前找复数名词</b>，注意单复数一致"],
["⑦ 因果题","Why did ... ?","找 because / due to / result from"],
["⑧ 例证题","The author mentions X to ...","<b>例子的作用永远是为观点服务</b>"],
["⑨ 结构题","How is the passage organized?","看各段之间的逻辑词"],
["⑩ 是非题","Which of the following is TRUE?","<b>逐个选项回原文核对</b>"]]},
{h:"15.3 干扰项的四种设错方式（最重要）", tbl:[
["干扰类型","特征","怎么识破"],
["<b>偷换概念</b>","把原文的 A 换成相近的 B","<b>逐词比对</b>，看主语和宾语有没有换"],
["<b>以偏概全</b>","把「部分」说成「全部」","警惕 all / always / never / must 这类绝对词"],
["<b>无中生有</b>","原文没提，但听起来很合理","<b>必须能在原文找到依据</b>，主观常识不算"],
["<b>正话反说</b>","意思刚好说反","注意否定词 not / few / hardly / rarely"]]},
{code:[
`实例分析（原文 vs 干扰项）：

原文：Some researchers believe that moderate coffee drinking
      may have beneficial effects on heart health.

选项 A) Coffee drinking always improves heart health.
    ✗ 绝对词 always + 丢掉了 moderate，以偏概全 + 偷换概念

选项 B) Moderate coffee consumption might be good for the heart.
    ✓ some → might；beneficial effects → good；heart health → the heart
      —— 完全是同义替换

选项 C) Researchers have proved that coffee prevents heart disease.
    ✗ believe → proved（语气加强），may have → prevents（过度推断）

选项 D) Coffee is harmful to people with heart problems.
    ✗ 原文说的是 beneficial，这里说 harmful，正话反说

结论：正确答案是「和原文用词最接近、语气最一致」的那一个。`]},
{tip:"<b>一条铁律：选项里的语气，要和原文的语气一致。</b>原文说 <b>may / might / suggest</b>（可能），选项就不能用 <b>prove / must / always</b>（一定）。<b>语气被夸大的选项，基本都是错的。</b>"},
{h:"15.4 做题四步法（每篇 9 分钟）", ol:["<b>第一步：读首段 + 各段首句</b>（1 分钟）。知道文章讲什么、结构怎样，不要通读。",
"<b>第二步：看题干，圈关键词</b>（1 分钟）。<b>不读选项</b>，只圈题干的名词、数字、专有名词。",
"<b>第三步：带关键词回原文定位</b>（4 分钟）。找到那一句，<b>答案通常就在这一句或它的上下句</b>。",
"<b>第四步：比对选项，排除干扰</b>（3 分钟）。<b>逐个选项回原文核对</b>——这是仔细阅读得分的关键动作。"]},
{warn:"<b>两个致命习惯要改掉：</b><br>① <b>先读完全文再做题</b>（时间不够，而且读了也记不住）；<br>② <b>凭印象选选项</b>（不回到原文核对）。<b>仔细阅读的答案必须能在原文找到依据。</b>"},
{h:"15.5 生词多的时候怎么办", ul:["<b>跳过形容词和副词</b>：它们只影响细节，不影响句子主干。",
"<b>看构词猜词</b>（第 3 章的方法），猜不出就跳过。",
"<b>抓逻辑词判断态度</b>：but / however 后面是重点；moreover 后面是同向补充。",
"<b>用中文思维理解段落大意</b>：知道这段在说「好处」还是「问题」就够了，不必逐字翻译。",
"<b>千万别停</b>：一个生词卡住 5 秒以上，直接跳。"]},
{h:"15.6 提分训练法：精读一篇 = 做十篇", code:[
`每做完一篇仔细阅读，做下面四件事（40 分钟）：

  1) 逐题定位：在原文里划出每道题对应的那一句，
     并写下「题干词 → 原文词」的替换关系。

  2) 分析每个错误选项：它属于哪一种设错
     （偷换概念 / 以偏概全 / 无中生有 / 正话反说）？

  3) 抄出 5 个生词 + 5 个短语，写进错题本。

  4) 隔一天再重做这一篇（不看笔记），看能不能全对。

这样的「一篇精读」胜过你做十篇只对答案的题。`]}
],
secview:"仔细阅读的全部技术含量在这三件事：<b>① 关键词定位（不读全文）② 同义替换比对 ③ 排除四类干扰项</b>。<b>每题 14.2 分，是这门课最该投入时间的地方。</b>"
},
{
id:16, title:"写作（一）：议论文三段式", stage:"四大题型",
intro:"写作 106.5 分，而且是<b>全卷最容易在短期内提分的一块</b>。<b>它不考文采，只考「结构清楚 + 语法正确 + 字数够」。</b>",
sections:[
{h:"16.1 四级写作的真实评分标准", tbl:[
["档位","特征","分数段"],
["高分","结构清晰、切题、基本无语法错误、有句型变化","12-15 分（满分 15）"],
["中分","结构清楚、内容切题、有少量语法错误","8-11 分"],
["低分","偏题、结构混乱、错误较多","4-7 分"],
["最低","跑题、字数严重不足、无法理解","0-3 分"]],
note:"<b>最重要的两个发现：</b>① <b>「切题」比「文采」重要得多</b>——跑题直接掉到最低档；② <b>「少量语法错误」在中分档是可以接受的</b>，所以不要为了炫技写没把握的句子。"},
{h:"16.2 三段式结构（万能模板）", code:[
`第一段：引出话题 + 亮明观点（2-3 句）
     Nowadays, there is a growing concern over ______.
     From my perspective, ______ plays an important role in ______.

第二段：论点 1 + 例证（3-4 句）
     First and foremost, ______.
     For example, ______.
     This clearly shows that ______.

第三段：论点 2 + 总结 / 建议（3-4 句）
     Moreover, ______.
     In conclusion, ______.
     It is high time that we ______.`]},
{tip:"<b>这个模板的价值在于「结构分」。</b>阅卷老师看几十秒，先看结构——<b>有 First / Moreover / In conclusion，结构分就稳了</b>，剩下的才是语法和词汇。"},
{h:"16.3 三段式的高分句型库", code:[
`【开头段】
  Nowadays, an increasing number of people are concerned about ______.
  It is widely acknowledged that ______.
  There is a heated debate over whether ______.
  As is shown in the chart, ______ has changed greatly in recent years.

【中间段】
  First and foremost, ______. (首先)
  What is more, ______. (而且)
  Take ______ as an example. (以…为例)
  A case in point is that ______. (一个恰当的例子是)
  Statistics show that ______. (数据显示)

【结尾段】
  In conclusion / To sum up, ______.
  It is high time that we took effective measures to ______.
  Only in this way can we ______. (倒装，加分)
  As far as I am concerned, ______.`]},
{h:"16.4 三种常见题型的写法", tbl:[
["题型","结构","模板句"],
["<b>观点讨论型</b>（有人赞成有人反对）","① 引出争议 ② 一方观点 ③ 另一方观点 ④ 我的看法","Some people argue that... Others, however, hold that... Personally, I believe..."],
["<b>现象分析型</b>（某个社会现象）","① 描述现象 ② 原因 ③ 影响 ④ 建议","In recent years, ______ has become a common phenomenon. There are several reasons for this."],
["<b>图表/图画型</b>","① 描述数据 ② 分析原因 ③ 评价 ④ 结论","As is vividly shown in the chart, the number of ______ has risen sharply."]]},
{h:"16.5 套用模板的四条纪律", ul:["<b>模板只占 1/3。</b>如果整篇都是模板句，内容空洞，分数反而低。<b>每段至少有一句是你自己的内容。</b>",
"<b>每段不超过 4 句。</b>句子太多容易出错，而且字数已经够了。",
"<b>用「简单但正确」的句子。</b>一个正确的简单句，比一个错误的长句值钱得多。",
"<b>字数控制在 130-160 词。</b>低于 120 词要扣分，超过 180 词容易出错（且时间不够）。"]},
{code:[
`字数怎么控制（写完数一下）：

  开头段 2-3 句  ≈ 35 词
  中间段 4 句    ≈ 60 词
  结尾段 3 句    ≈ 45 词
  ----------------------------
  合计 9-10 句   ≈ 140 词  ✓ 刚好在安全区间

写作时间分配（30 分钟）：
  审题 + 列提纲   5 分钟
  写              20 分钟
  检查            5 分钟  ← 这一步很多人省略，但能救回 2-3 分`]},
{h:"16.6 检查清单（考前背下来）", ol:["<b>主谓一致</b>：每个句子的主语和谓语单复数对不对？",
"<b>时态统一</b>：全文时态有没有乱？（一般现在 + 一般过去 + 现在完成是安全组合）",
"<b>冠词</b>：可数名词单数前有没有 a/an/the？",
"<b>拼写</b>：常见词有没有拼错？（government、environment、necessary、receive）",
"<b>字数</b>：够不够 120 词？",
"<b>切题</b>：有没有偏题？开头和结尾是不是在回答题目？"]},
{warn:"<b>最容易丢分的三件事：</b>① <b>跑题</b>（题目问「影响」，你写「怎么办」）；② <b>字数不够</b>（少于 120 词直接降档）；③ <b>通篇简单句没有任何句型变化</b>（分数上不去）。<b>把这三条对着检查，就能稳住中档以上。</b>"}
],
secview:"写作的得分逻辑是<b>「切题 + 结构 + 正确」</b>，不是文采。<b>三段式模板 + 每段一句自己的内容 + 写完检查一遍</b>，这一块就能从低档提到中高档。"
},
{
id:17, title:"写作（二）：应用文与高级表达", stage:"四大题型",
intro:"除了议论文，四级也考<b>应用文</b>（书信、通知、报告）。<b>应用文比议论文更好写——因为格式是固定的。</b>这一章把三种格式一次讲清。",
sections:[
{h:"17.1 书信：结构最固定的文体", code:[
`Dear Professor Smith,                        ← 称呼（顶格，逗号结尾）

  I am writing to express my sincere gratitude   ← 第一句：说明写信目的
  for your generous help with my application.

  （中间段：具体说明事情经过 / 你的诉求）
  Thanks to your advice, I have made great
  progress in my research. I would like to
  invite you to attend our graduation ceremony.

  I would appreciate it if you could reply at     ← 结尾：表达期待
  your earliest convenience.

Yours sincerely,                              ← 落款（左对齐）
Li Ming                                       ← 签名`]},
{tbl:[
["书信类型","开头句","结尾句"],
["感谢信","I am writing to express my gratitude for...","Thank you again for your kindness."],
["申请信","I am writing to apply for the position of...","I would appreciate the opportunity to..."],
["建议信","I am writing to offer some suggestions on...","I hope you will find these suggestions helpful."],
["道歉信","I am writing to apologize for...","Please accept my sincere apology."],
["邀请信","I am writing to invite you to...","I would be grateful if you could attend."],
["投诉信","I am writing to complain about...","I would appreciate it if you could look into the matter."]]},
{h:"17.2 通知与告示", code:[
`NOTICE                                    ← 标题居中，全大写

  In order to enrich campus life, the Student    ← 第一句：说明活动目的
  Union is going to hold a speech contest
  on English learning.

  Details are as follows:                        ← 分条列出信息
  Time: 7:00 p.m., December 20
  Place: Room 301, Teaching Building 2
  Requirements: All students are welcome to
  sign up before December 15.

  Everyone is welcome to take part in it.        ← 号召

  The Student Union                              ← 落款（单位）
  December 10, 2026                              ← 日期`]},
{note:"<b>通知的得分点就三个：</b>① 标题 NOTICE（居中）② 时间、地点、要求三个要素齐全 ③ 落款单位 + 日期。<b>把这三样写全，内容再简单也是中档以上。</b>"},
{h:"17.3 报告与总结", code:[
`A Report on Students' Internet Use

  Introduction:                              ← 说明目的
  The purpose of this report is to analyze
  how students in our university use the
  Internet in their daily life.

  Findings:                                  ← 列出发现（用数据）
  According to a recent survey of 500 students,
  about 70 percent of them spend more than
  three hours online every day. The most
  common activities are social media and
  online games.

  Conclusion and Suggestions:                 ← 结论和建议
  In conclusion, students' Internet use needs
  to be guided. It is suggested that the
  university provide more offline activities.`]},
{h:"17.4 让作文「显得高级」的三个办法", p:["<b>注意：不是用难词，而是用对结构。</b>阅卷老师更看重「句型有变化」，而不是「词汇有多生僻」。"]},
{code:[
`办法一：把「简单句」换成「从句」或「非谓语」
  ❌ Many students are addicted to games. They forget their studies.
  ✅ Many students who are addicted to games forget their studies.
  ✅ Addicted to games, many students forget their studies.

办法二：用「It 引导的形式主语 / 强调句」
  ❌ To learn English well is important.
  ✅ It is important to learn English well.
  ✅ It is hard work that leads to success.

办法三：结尾用倒装或 only 结构（一句就够）
  ✅ Only by working hard can we achieve our goals.
  ✅ Not only does reading broaden our horizons, but it also
     improves our writing skills.`]},
{warn:"<b>高级表达是「锦上添花」，不是「雪中送炭」。</b>如果一篇作文里有 5 个语法错误，再加两个倒装句也不会得高分。<b>先把正确率做到 90%，再追求句式变化。</b>"},
{h:"17.5 写作模板速记卡", code:[
`【任何作文都能用的 5 个万能句】

  ① 引出现象：Nowadays, ______ has become a hot topic
               among the public.
  ② 表达观点：From my perspective, ______.
  ③ 举例论证：Take ______ as an example.
  ④ 提出建议：It is high time that we ______.
  ⑤ 总结升华：Only in this way can we ______.

【三段式时间分配】
  5 分钟审题列提纲 → 20 分钟写 → 5 分钟检查

【检查四个高频错误】
  主谓一致 / 时态统一 / 冠词 / 拼写`]},
{tip:"<b>考前最后一周做的事：</b>把这 5 个万能句和上面的检查清单默写 3 遍，<b>做到不假思索就能写出来</b>。考场上你就不需要再想结构，能把全部注意力放在「内容不偏题、语法不错」上。"}
],
secview:"应用文的优势是<b>格式固定、有模板可套</b>：书信（称呼 → 目的 → 内容 → 期待 → 落款）、通知（NOTICE → 目的 → 时间地点要求 → 落款）、报告（目的 → 发现 → 结论建议）。<b>把三个格式练熟，这一块就是稳分题。</b>"
}
];
