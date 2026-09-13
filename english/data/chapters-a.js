// 英语四级 · 第 1-5 章：语音与词汇
var CHAPTERS_A = [
{
id:1, title:"四级考试全景与提分地图", stage:"语音与词汇",
intro:"先把这场考试看透：<b>它考什么、多少分、时间怎么分、你的分该从哪里涨。</b>不知道分值地图就开始背单词，是最常见的白费力。",
sections:[
{h:"1.1 四级到底是什么", p:["大学英语四级（CET-4）是<b>标准化考试</b>，总分 <b>710 分</b>，<b>425 分</b>算通过。",
"它考的是「<b>你在有限时间里处理英文信息的能力</b>」，不是「你懂多少语法术语」。这个认识很重要——它决定了你该怎么练。"],
tbl:[
["部分","分值","占比","题量","时长"],
["写作","106.5","15%","1 篇","30 分钟"],
["听力","248.5","35%","25 题","约 25 分钟（自动播放，不能暂停）"],
["阅读","248.5","35%","30 题","40 分钟"],
["翻译","106.5","15%","1 段汉译英","30 分钟"],
["合计","710","100%","56 题","约 125 分钟"]],
note:"<b>看见了吗？听力和阅读加起来占 70%（497 分）。</b>写作和翻译加起来只占 30%。所以「背作文模板」能保底，但<b>真正决定过不过的是阅读和听力</b>。"},
{h:"1.2 一场考试的真实流程", ol:["<b>先写作文</b>（30 分钟）。注意：作文时间一到就收卷，所以必须限时练过。",
"<b>然后听力</b>（约 25 分钟）。听力音频<b>只放一遍</b>，而且放完立刻收答题卡一，没有补涂时间。",
"<b>接着做阅读</b>（40 分钟）：选词填空 → 长篇阅读 → 仔细阅读，三部分共 30 题。",
"<b>最后做翻译</b>（30 分钟）：一段 140-160 字的汉语，译成英文。",
"<b>全场约 125 分钟</b>，中间没有休息。所以<b>考前一定要完整模拟至少 3 次</b>，否则考场会崩。"],
tip:"<b>听力的「自动播放、不能暂停」是很多人翻车的地方。</b>平时练习时如果习惯「听不懂就倒回去」，考场上会完全失控。<b>从今天起，所有听力练习都一次过，不复听。</b>"},
{h:"1.3 分值地图：每一分从哪来", tbl:[
["题型","题数","每题分值","总分","性价比"],
["写作","1","106.5","106.5","中（模板可保底）"],
["短篇新闻","7","7.1","49.7","中"],
["长对话","8","7.1","56.8","<b>高</b>"],
["听力篇章","10","14.2","142","<b>最高</b>"],
["选词填空","10","3.55","35.5","<b>最低</b>（别死磕）"],
["长篇阅读匹配","10","7.1","71","高"],
["仔细阅读","10","14.2","142","<b>最高</b>"],
["翻译","1","106.5","106.5","中"]],
note:"<b>这张表是这门课的指挥棒。</b>听力篇章和仔细阅读各 142 分、每题 14.2 分——<b>这两块多对 5 题就是 +71 分</b>。而选词填空 10 题做完才 35.5 分，还最费时间。<b>所以做题顺序和练习时间的分配，都应该按这张表来。</b>"},
{h:"1.4 398 分意味着什么", p:["你现在的 398 分，距离 425 差 27 分。听起来很近，但要看清这 27 分从哪里来——<b>差 27 分，通常意味着有 2-3 个题型明显偏弱</b>，而不是「整体差一点」。"],
ul:["<b>情况 A：阅读弱</b>（最常见）。仔细阅读对 3-4 题就丢 80-100 分。<b>涨分空间最大</b>。",
"<b>情况 B：听力弱</b>。长对话和篇章靠猜，稳定丢 60-90 分。<b>靠技巧能涨，但需要时间。</b>",
"<b>情况 C：写作翻译低</b>。作文跑题或语法错误太多，翻译写不出完整句子。<b>涨分最快，两三周见效。</b>",
"<b>情况 D：广度不够</b>。每个板块都中等，没有明显短板，但都拿不到高分。<b>要靠真题量堆上去。</b>"],
tip:"<b>做一次完整的真题（严格限时、含听力），把四个板块的分数分别算出来。</b>哪块最低就先攻哪块——这比「平均用力」效率高得多。第 20 章有完整的诊断表和 30 天冲刺计划。"},
{h:"1.5 100 天提分路线", tbl:[
["阶段","重点","每天做什么","目标"],
["① 基础夯实（约 35 天）","单词一轮 + 语音 + 长难句","单词 30 分钟 + 精听/精读 45 分钟","能看懂长句、听懂慢速新闻"],
["② 专项突破（约 35 天）","四大题型逐个打","每天一个题型 20 题 + 复盘","每个题型有稳定正确率"],
["③ 模拟冲刺（约 25 天）","限时真题","每 3 天一套完整真题","适应时间压力"],
["④ 考前调整（约 5 天）","错题 + 模板 + 手感","作文 1 篇 + 真题 1 套","状态稳定，不学新东西"]],
note:"<b>阶段划分不是死的，但「顺序」是重要的：</b>词汇和语音不过关就去做真题，等于每次都在经受打击，正确率上不去、信心还被磨掉。<b>先把地基打好，再上强度。</b>"},
{h:"1.6 这门课怎么学", ol:["<b>读</b>：每章 5-6 节，讲的是「真题里怎么用」，不是语法书上的定义。",
"<b>做</b>：每章 4 道题，选完立刻出解析，错题自动进错题本。",
"<b>练</b>：「训练」页有 12 个专项训练（跟读、精听、长难句切分、回译……）。<b>这才是提分的地方。</b>",
"<b>实战</b>：「实战演练」页有 10 组迷你真题，限时做，做完看解析。",
"<b>查</b>：「速查」查语法点和模板，「术语」查概念，「词汇」滚动背 300 核心词。"]},
{h:"1.7 三条必须记住的原则", ul:["<b>不复盘等于没做。</b>做完题必须回到原文，找出「这道题考的是哪一句」。",
"<b>英语是技能，不是知识。</b>看懂≠会做。所有技能都要靠重复动作练出来。",
"<b>单词必须每天背，一天都不能停。</b>停三天，前面一周白费。"]}
,
{warn:"<b>两个必须避开的坑：</b><br>① <b>不要用模拟题代替真题。</b>模拟题的难度和出题思路与真题差距很大，做多了反而带偏判断。至少要准备 10 套真题。<br>② <b>不要只背单词不做题。</b>单词是原料、题是加工，只存原料不出产品，分数不会动。<b>这门课每一章都配了训练，跳过训练等于白学。</b>"}
],
secview:"这一章建立的是一张<b>地图</b>：710 分怎么分布、时间怎么走、你的 27 分从哪涨。<b>接下来每一章，都是往这张地图上的某一块填内容。</b>"
},
{
id:2, title:"语音基础：听力的地基", stage:"语音与词汇",
intro:"很多人以为听力差是「听得少」。但真相往往是：<b>你脑子里存的那个词的发音，和录音里的发音根本不一样</b>——所以听见了也认不出来。这一章解决这个。",
sections:[
{h:"2.1 为什么「听着很熟就是想不起」", p:["背单词时你记的是<b>拼写 + 中文</b>，从来没有把<b>发音</b>存进去。而听力考的是「声音 → 意思」这条通路。",
"更麻烦的是：真实语流里，单词<b>不是一个个念出来的</b>，而是连在一起、有强弱、有吞音的。"],
code:[
`你脑子里的：  not   at    all
录音里的：      no-ta-dall        ← 连读以后完全变样

你脑子里的：  What do you want to do?
录音里的：      Whaddaya wanna do?   ← 缩读以后只剩一半音节

你脑子里的：  government
录音里的：      gov-ern-ment → gov-ment  ← 中间音节被吞掉`],
note:"<b>结论：听力不是「听不懂意思」，是「没听出单词」。</b>解决办法只有一个——<b>把每个词的发音、以及在语流里的变化，重新存进脑子。</b>方法就是「跟读」（本章训练页第 1、2 个训练）。"},
{h:"2.2 四十八个音标：先分清这几组就够用", tbl:[
["容易混的组","区别","例词"],
["/iː/ 与 /ɪ/","长音 vs 短音","sheep / ship，feel / fill"],
["/æ/ 与 /e/","嘴张得更大 vs 小","bad / bed，man / men"],
["/θ/ 与 /s/","咬舌 vs 不咬舌","think / sink，three / see"],
["/ð/ 与 /z/","咬舌浊音 vs 不咬","this / zis（错误发音）"],
["/v/ 与 /w/","上齿咬下唇 vs 圆唇","very / wary，vest / west"],
["/l/ 与 /r/","舌尖顶上齿龈 vs 卷舌","light / right，play / pray"],
["/n/ 与 /ŋ/","舌尖鼻音 vs 舌根鼻音","sin / sing，ban / bang"]],
tip:"<b>不用把 48 个音标全背下来。</b>先练上面这 7 组——<b>四级听力里因为这几组听错而丢的分，占了一大半。</b>每天对着镜子读 3 分钟，一周就能感觉到变化。"},
{h:"2.3 连读：四种最常见的形态", ol:["<b>辅音 + 元音</b> 连读：<code>not at all</code> → no-ta-dall；<code>turn it off</code> → tur-ni-toff",
"<b>元音 + 元音</b> 加过渡音：<code>go on</code> → go-w-on；<code>I am</code> → I-y-am",
"<b>相同辅音只读一次</b>：<code>take care</code> → ta-care；<code>good day</code> → goo-day",
"<b>/t/ 和 /d/ 的浊化（美音）</b>：<code>water</code> → wader；<code>better</code> → beder"],
code:[
`真题里最常出现的连读（背下来，听到就是这几个）：

check it out        → che-ki-tout
find out            → fin-dout
in an hour          → i-na-nour
as a result         → a-za-result
first of all        → firs-to-vall
at the end of       → a-thee-en-dof
more and more       → mo-ran-more
all over the world  → a-lo-ver-the-world`],
note:"<b>这些不是「花哨技巧」，是录音里真实的样子。</b>建议把这 8 条抄在纸上，每天读 10 遍，读到不用想就能连着说出来——<b>你的耳朵就会开始把它们当成一个整体来听。</b>"},
{h:"2.4 弱读与缩读：为什么句子听起来「很轻」", p:["英文句子里，<b>只有实词重读</b>（名词、动词、形容词、副词），虚词一律弱读（冠词、介词、连词、助动词）。这就是为什么你觉得录音「语速快」——<b>其实是重读信息之间的连接被磨平了。</b>"],
tbl:[
["单词","重读（原音）","弱读（真实语流）"],
["and","/ænd/","/ən/（ən）"],
["of","/ɒv/","/əv/（əv）"],
["to","/tuː/","/tə/（tə）"],
["for","/fɔːr/","/fər/（fər）"],
["can","/kæn/","/kən/（kən）"],
["are","/ɑːr/","/ər/（ər）"],
["you","/juː/","/jə/（jə）"]],
code:[
`缩读（听到要能立刻反应过来）：

I am      → I'm            they are   → they're
will not  → won't          cannot     → can't
going to  → gonna          want to    → wanna
kind of   → kinda          let me     → lemme
what do you → whaddaya     did you    → didja`],
warn:"<b>缩读只要求「听懂」，不要求「会用」。</b>作文和翻译里写 gonna、wanna 是<b>严重失分</b>的。<b>听得出 = 能得分，写出来 = 扣分</b>，这两件事要分清楚。"},
{h:"2.5 失去爆破与同化", p:["两个爆破音相邻时，<b>前一个只做口型不出声</b>，这就是失去爆破。而同化是指相邻音互相影响、变成一个第三音。"],
code:[
`失去爆破（前一个音只做口型）：

  a(t)  ten          goo(d)  bye
  bla(ck) board      Si(t)   down
  take (c)are        wha(t)  time

同化（两个音变成一个音）：

  don't you   → don-chu
  would you   → wou-ju
  missed you  → miss-chu
  this year   → thi-shear
  in bed      → im-bed   （n 被 b 同化为 m）`],
tip:"<b>练法：</b>打开一段听力原文，<b>先把所有失去爆破和同化的地方圈出来</b>，然后用「连读 + 弱读 + 吞音」的方式读一遍。你会发现——<b>你读出来的样子，和录音一模一样。</b>"},
{h:"2.6 重音与语调：意思藏在里面", p:["同一个句子，重音不同，意思完全不同。<b>四级听力里，答案往往就在被重读的那个词上。</b>"],
code:[
`I didn't say he stole the money.   （重读不同，意思不同）

  I    didn't say he stole the money  → 是我没说（别人说的）
  I didn't SAY he stole the money     → 我没「说」，只是暗示
  I didn't say HE stole the money     → 我没说是他偷的
  I didn't say he STOLE the money     → 我没说「偷」，可能是借
  I didn't say he stole the MONEY     → 他偷的不是钱`],
note:"<b>实战用法：</b>听长对话时，如果某个词被特别加重或放慢，<b>那八成是出题点</b>。转折词（but、however、actually）后面的内容，几乎必考。"}
],
secview:"这一章的落点是<b>「把耳朵里的词和脑子里的词对上」</b>：音标分清易混组、连读弱读吞音要能听出来、重音是答案信号。<b>接下来两章补词汇，然后就能开始练真题听力了。</b>"
},
{
id:3, title:"构词法：用词根词缀猜词", stage:"语音与词汇",
intro:"四级大纲词约 4500 个，你不可能全背完。但<b>词根词缀是「一份投入、长期收益」的东西</b>——学会 40 个词根词缀，能猜出上千个词的意思。",
sections:[
{h:"3.1 四级词汇的真实构成", p:["四级考纲词汇里，<b>真正「完全没见过」的词很少</b>。绝大多数是：<b>你认识的词 + 一个前缀/后缀</b>。"],
code:[
`认识 port（搬运）以后：

  import    = im(向内) + port   → 输入、进口
  export    = ex(向外) + port   → 输出、出口
  transport = trans(跨越) + port → 运输
  support   = sup(在下面) + port → 支撑、支持
  portable  = port + able(能…的) → 便携的

一个词根 = 五个单词。这就是构词法的价值。`],
note:"<b>但要诚实说一句：</b>构词法用来「<b>猜词和记词</b>」非常有用，用来「<b>确定词义</b>」只能算参考。<b>阅读里遇到生词，先用构词法猜，再用上下文验证。</b>"},
{h:"3.2 高频前缀（按意思归类）", tbl:[
["类别","前缀","意思","例词"],
["否定","un- / in- / im- / il- / ir-","不","unfair、incorrect、impossible"],
["否定","dis-","不、相反","disagree、discover"],
["否定","non- / mis-","非 / 错误地","nonsense、misunderstand"],
["方向","ex- / e-","向外","export、exclude"],
["方向","im- / in-","向内","import、include"],
["方向","sub-","在下面","subway、substitute"],
["方向","super- / over-","超过、在上","supermarket、overcome"],
["方向","trans-","跨越","transport、translate"],
["方向","pre- / post-","前 / 后","preview、postpone"],
["程度","over- / under-","过度 / 不足","overwork、underestimate"],
["数字","mono- / bi- / tri-","一 / 二 / 三","monopoly、bicycle、triangle"],
["共同","co- / com- / con-","共同","cooperate、combine、connect"],
["反向","anti- / counter-","反对","antivirus、counterattack"]],
tip:"<b>注意拼写变化：</b>in- 在 p、b、m 前面变成 im-（impossible、imbibe）；在 l 前面变 il-（illegal）；在 r 前面变 ir-（irregular）。<b>这不是例外，是发音的顺口规则。</b>"},
{h:"3.3 高频后缀：看到它就知道词性", tbl:[
["词性","后缀","例词"],
["名词（人）","-er / -or / -ist / -ant","teacher、actor、scientist、assistant"],
["名词（抽象）","-tion / -sion / -ment / -ness / -ity","education、decision、development、happiness、ability"],
["形容词","-ful / -less / -ous / -ive / -able","useful、careless、famous、active、comfortable"],
["形容词","-al / -ic / -ent / -ant","natural、scientific、different、important"],
["动词","-ize / -ify / -en / -ate","realize、simplify、strengthen、calculate"],
["副词","-ly / -ward","quickly、forward"]],
note:"<b>后缀最大的用处不是记词，是判断题干和选项的词性。</b>第 5 章的选词填空，第一步就是「给 15 个选项标词性」——靠的就是这张表。"},
{h:"3.4 二十个高频词根（背下来）", tbl:[
["词根","意思","例词"],
["spect / spic","看","inspect、respect、suspicious"],
["port","搬运","import、transport、portable"],
["dict","说","predict、contradict、dictionary"],
["duc / duct","引导","produce、introduce、conduct"],
["ject","投掷","reject、project、object"],
["scrib / script","写","describe、prescribe、manuscript"],
["struct","建造","construct、instruct、structure"],
["tract","拉","attract、contract、extract"],
["vis / vid","看","visible、provide、evidence"],
["form","形状","reform、uniform、transform"],
["press","压","express、impress、compress"],
["pos / pon","放","compose、expose、postpone"],
["mit / miss","送","submit、permit、mission"],
["fer","带来","offer、refer、transfer"],
["cap / cept / cip","拿、抓","accept、receive、capture"],
["cred","相信","credit、incredible"],
["grad / gress","走、步","graduate、progress、aggressive"],
["log / logy","说、学科","dialogue、biology、technology"],
["tempor","时间","temporary、contemporary"],
["vac / van / void","空","vacation、vanish、avoid"]],
tip:"<b>背词根的方法：</b>不要单独背词根，而是<b>「一个词根 + 3 个例词」一起背</b>。比如记 spect 的时候，同时记住 respect（反复看 = 尊重）、inspect（往里看 = 检查）、suspicious（往上看 = 可疑）。<b>有故事才记得住。</b>"},
{h:"3.5 猜词实战：阅读里遇到生词怎么办", ol:["<b>看构词</b>：拆出前缀词根后缀，猜大致方向（是褒义还是贬义、是名词还是动词）。",
"<b>看词性</b>：它在句子里做什么成分？决定了你要找的是「东西」还是「动作」。",
"<b>看上下文</b>：前后句有没有同义重复（that is、in other words）或反义对比（but、however）？",
"<b>看态度</b>：作者是支持还是批评？<b>很多时候你只需要判断褒贬，不需要知道确切意思。</b>",
"<b>别停</b>：一个生词卡住 5 秒以上就跳过去。<b>四级阅读考的是抓主旨和定位，不是逐词翻译。</b>"],
code:[
`实战演练：猜出下面加粗词的意思（先自己想，再看答案）

1. The new policy was designed to **eliminate** unfair competition.
   → e(出) + limin(门槛) + ate(动词) = 把…赶出门槛 = 消除、淘汰

2. His explanation was so **ambiguous** that nobody understood it.
   → ambi(两边) + gu(走) + ous(形容词) = 两边都能走的 = 模棱两可的

3. The company decided to **postpone** the meeting.
   → post(后) + pone(放) = 往后放 = 推迟`],
note:"<b>注意第 2 个词的思路：</b>你不一定知道 ambi- 是「两边」，但看到句子后半句「nobody understood it」，就已经能判断它是个<B>负面词</B>了。<b>这就是「用上下文验证构词猜测」。</b>"}
],
secview:"构词法给你的是一把<b>「猜词的钥匙」</b>：前缀定方向、后缀定词性、词根定含义。<b>配合下一章的 300 核心词，你的词汇量会有一个台阶式的提升。</b>"
},
{
id:4, title:"核心词汇：怎么背才不白背", stage:"语音与词汇",
intro:"背单词是四级里最容易「看起来很努力、实际没效果」的事。这一章讲清<b>为什么大部分人的背词方法是无效的</b>，以及正确做法。",
sections:[
{h:"4.1 三种常见的无效背词法", tbl:[
["错误做法","为什么无效"],
["<b>只背中文意思，不看例句</b>","四级考的是「在句子里认出它」，不是「默写释义」。没有语境 = 考场上认不出。"],
["<b>只背拼写，不记发音</b>","听力考的是声音。发音没存进去，听到也反应不过来。"],
["<b>一天背 200 个新词</b>","当天很爽，三天后全忘。<b>遗忘曲线不给你面子。</b>"]],
note:"<b>核心问题：你背的是「单词卡」，考场考的是「单词在句子里的意思」。</b>所以正确的背词单位不是「词」，而是「<b>词 + 一个搭配 + 一个例句</b>」。"},
{h:"4.2 有效背词法：三件套 + 滚动", p:["一个词要记住三样东西：<b>意思、发音、搭配</b>。缺一个，考场上就用不上。"],
code:[
`❌ 无效的卡片：
    adopt  采用

✅ 有效的卡片（三件套）：
    adopt /əˈdɒpt/  v.
    ① 采用（方法、政策）  adopt a new method
    ② 收养              adopt a child
    例句：The company decided to adopt a new strategy.

→ 考场价值：阅读里看到 adopt 能立刻反应「采用」；
         听力里听到 /əˈdɒpt/ 能立刻反应；
         写作里能自己写出 adopt a policy。`],
tip:"<b>「滚动」比「新词量」重要得多。</b>正确节奏是：<b>每天新词 30 个 + 复习前 3 天的 90 个</b>。宁可新词少、复习足，也不要一天冲 200 个然后忘光。"},
{h:"4.3 高频易混词辨析（四级常考）", tbl:[
["易混词","区别","例句"],
["affect / effect","affect 是动词「影响」；effect 是名词「影响」","Smoking affects health. / It has a bad effect on health."],
["adapt / adopt","adapt 适应、改编；adopt 采用、收养","adapt to city life / adopt a method"],
["principal / principle","principal 主要的、校长；principle 原则","the principal reason / a basic principle"],
["personal / personnel","personal 个人的；personnel 人员（集合）","personal opinion / sales personnel"],
["economic / economical","economic 经济的；economical 节约的","economic growth / an economical car"],
["respectable / respectful / respective","可敬的 / 尊敬他人的 / 各自的","a respectable man / respectful to elders / their respective jobs"],
["considerable / considerate","相当大的 / 体贴的","a considerable amount / a considerate person"],
["sensible / sensitive","明智的 / 敏感的","a sensible decision / sensitive skin"],
["desert / dessert","沙漠、抛弃 / 甜点","desert the plan / ice cream for dessert"]],
warn:"<b>这类题在选词填空和仔细阅读里都出现过。</b>建议把这张表抄一遍——<b>手写一遍抵得上读十遍。</b>"},
{h:"4.4 熟词僻义：你认识的词，考的是另一个意思", p:["四级最爱考这种。你以为自己认得这个词，结果它的意思在句子里说不通。"],
code:[
`address   常见：地址      僻义：处理、解决（address the issue）
appreciate 常见：感激     僻义：意识到、理解（I appreciate the difficulty.）
article   常见：文章      僻义：条款（Article 3 of the agreement）
capital   常见：首都      僻义：资本（capital investment）
company   常见：公司      僻义：陪伴（keep sb. company）
figure    常见：数字      僻义：认为（I figure he will come.）
issue     常见：问题      僻义：发行、期刊（the latest issue）
matter    常见：事情      僻义：要紧（It doesn't matter.）
observe   常见：观察      僻义：遵守（observe the rules）
practice  常见：练习      僻义：惯例、做法（a common practice）
subject   常见：科目      僻义：使遭受（be subject to）
term      常见：学期      僻义：术语、条件（technical terms）`],
note:"<b>怎么防：</b>读句子时如果发现「按常见意思翻译不通」，<b>立刻停下来想「它还有什么别的意思」</b>。这个习惯能救回好几道题。"},
{h:"4.5 真题高频短语（背搭配，不背单词）", tbl:[
["短语","意思","出现场景"],
["account for","占（比例）；解释","图表、数据类阅读"],
["be subject to","易受…影响；取决于","政策、条件类"],
["in terms of","就…而言","对比类"],
["as a result of","由于","因果类（必考）"],
["result in / result from","导致 / 由…引起","<b>分清方向！</b>"],
["contribute to","有助于；导致","因果类"],
["give rise to","引起","因果类"],
["take into account","考虑到","建议类"],
["at the expense of","以…为代价","转折类（态度题）"],
["play a vital role in","在…起关键作用","主旨类"],
["in the long run","从长远看","结论类"],
["shed light on","阐明","研究发现类"],
["be attributed to","归因于","因果类"],
["make sense of","理解","认知类"]],
tip:"<b>注意 result in 和 result from 的方向：</b><b>result in = 导致（前因后果）</b>；<b>result from = 由…造成（前果后因）</b>。这两个短语在四级里已经考过多次，也最容易被理解反。"},
{h:"4.6 复习节奏：把艾宾浩斯落到实处", tbl:[
["时间","做什么","用时"],
["早上","新词 30 个（三件套：意思 + 发音 + 搭配）","20 分钟"],
["中午","快速过一遍早上的 30 个（只看英文想中文）","5 分钟"],
["晚上","复习今天的 30 个 + 前 3 天的 90 个","15 分钟"],
["周末","把这一周所有词打乱顺序测一遍，错的单独抄出来","30 分钟"],
["本站词汇页","每天滚动一组（30 词），自测模式做错的会自动重考","10 分钟"]],
note:"<b>本站的「词汇」页已经内置了 300 个四级核心高频词</b>，分 10 组，有浏览模式和自测模式（答错的词会自动回到队尾重考）。<b>但这 300 词只是「核心」，不是大纲全部。</b>真正要过关，还需要每天用单词 App 再背 30 个大纲词。"}
],
secview:"词汇这一章的要点：<b>背词单位是「词 + 搭配 + 例句」、必须记发音、必须滚动复习</b>；<b>同时要防熟词僻义、分清易混词</b>。<b>词汇是每天都要做的事，不是「学完这一章就结束」的事。</b>"
},
{
id:5, title:"选词填空：先词性，后词义", stage:"语音与词汇",
intro:"选词填空只占 5%（35.5 分），却是很多人耗时间最多的地方。<b>这一章教你用「词性判断法」在 7 分钟内做完，并且正确率比瞎猜高得多。</b>",
sections:[
{h:"5.1 选词填空考什么", p:["一篇 200-250 词的文章，挖掉 <b>10 个空</b>，给你 <b>15 个选项</b>（A-O），从中选 10 个填进去。",
"<b>关键提示：选项是按字母顺序给的，而且每个词只能用一次。</b>这就意味着——<b>先做完有把握的，剩下的自然就缩小范围。</b>"],
tbl:[
["特点","意味着什么"],
["15 选 10，不是 15 选 15","有 5 个词是干扰项，最后可以靠排除法"],
["选项按字母排列","相邻选项意思可能完全无关，不能靠位置猜"],
["考词性 > 考词义","<b>先判断空需要什么词性，能直接排除一半选项</b>"],
["10 题只值 35.5 分","<b>性价比最低，放到最后做</b>"]],
note:"<b>先把这句话记住：选词填空的第一原则是「先判断词性，再判断词义」。</b>因为 15 个选项里，通常名词 5 个、动词 5 个、形容词/副词 5 个左右——<b>确定了词性，就只剩 5 选 1 了。</b>"},
{h:"5.2 第一步：给 15 个选项标词性", code:[
`拿到选项先做这件事（30 秒）：

  A) available    adj.   可获得的
  B) benefit     n./v.   好处 / 使受益
  C) carefully   adv.    仔细地
  D) challenge   n./v.   挑战
  E) conscious   adj.   有意识的
  ...

标完你会发现：名词 5 个、动词 5 个、形容词 4 个、副词 1 个。

→ 某个空明显需要副词，那答案就在那 1 个副词里，直接锁死。
→ 某个空需要形容词，就只在 4 个形容词里挑。`],
tip:"<b>判断词性的最快办法是看后缀</b>（第 3 章那张表）：<code>-tion/-ment/-ness/-ity</code> 是名词；<code>-ful/-ous/-ive/-able/-al</code> 是形容词；<code>-ly</code> 多半是副词；<code>-ize/-ify/-ate</code> 是动词。<b>用后缀判断，比查词性快得多。</b>"},
{h:"5.3 第二步：判断空格需要什么词性", tbl:[
["空格位置","需要词性","判断依据"],
["<code>a / an / the / 形容词 + ___</code>","<b>名词</b>","冠词和形容词后面一定是名词"],
["<code>___ + 名词</code>","形容词","修饰名词的是形容词"],
["<code>主语 + ___ + 宾语</code>","<b>动词</b>","主谓宾结构，缺谓语"],
["<code>be / have / will / can + ___</code>","动词（过去分词/原形）","助动词后面跟动词"],
["<code>___ + 动词 / 形容词</code>","<b>副词</b>","修饰动词和形容词的是副词"],
["<code>介词 + ___</code>","名词 / 动名词","介词后面接名词性质的东西"],
["<code>逗号前/后独立成分</code>","副词 / 分词","插入语常见副词"]],
code:[
`实战：先标词性，再选答案

  The company has made a significant ___ in renewable energy.

  空格前有 a + significant（形容词），后面是 in
  → a + adj. + ___ → 需要【名词】
  → 在名词选项里找「投资 / 进步 / 突破」这类意思
  → 答案：investment（投资）

  再看一句：
  The results were ___ reported in the local newspaper.

  were 后面 + reported（动词过去分词），中间插一个空
  → 修饰动词 reported 的只能是【副词】
  → 在副词里找，答案：accurately（准确地）`],
note:"<b>你注意到了吗：上面两题我根本没有读完整篇文章就选出了答案。</b>因为词性一旦确定，选择范围就只剩几个。这就是选词填空的正确打开方式——<b>不是「读懂全文再选」，而是「按语法结构定位」。</b>"},
{h:"5.4 第三步：在候选里比语义和搭配", p:["词性确定后，如果还剩 2-3 个候选，就用<b>搭配</b>和<b>上下文态度</b>来定。"],
code:[
`常见的高频搭配（背下来能救分）：

  make a contribution to      对…做贡献
  take measures to             采取措施
  play a role in               在…起作用
  have access to               有机会使用
  be aware of                  意识到
  in response to               作为对…的回应
  at the cost of               以…为代价
  be responsible for           对…负责
  according to                 根据
  compared with                与…相比`]},
{h:"5.5 三个常见陷阱", ul:["<b>一词多性。</b>比如 benefit 既是名词也是动词，challenge 同样。<b>必须两个词性都标上</b>，否则会漏掉答案。",
"<b>同一个词形的不同形式。</b>选项里可能同时出现 contribute（原形）和 contributed（过去式）——<b>看空格前后的语法结构</b>决定用哪个。",
"<b>看似同义的干扰项。</b>两个词中文意思差不多，但搭配不同。这时<b>看它前后跟什么介词</b>。"]},
{h:"5.6 时间策略：把它放到最后", ol:["<b>答题顺序</b>：写作 → 听力 → <b>仔细阅读（142 分）→ 长篇阅读（71 分）→ 选词填空（35.5 分）→ 翻译</b>。",
"<b>为什么最后做选词填空</b>：它 10 题才 35.5 分，而仔细阅读 10 题 142 分。<b>同样的时间花在仔细阅读上，收益是它的 4 倍。</b>",
"<b>限时 7 分钟</b>：到点不管做没做完，全部填满（用排除法猜剩下的），然后去做翻译。",
"<b>绝不死磕</b>：一个空卡住超过 20 秒，先跳过，做完后面的回头再看——<b>后面的选项会帮你排除。</b>"],
tip:"<b>考场心态：</b>选词填空是「性价比最低」的题，<b>它存在的意义之一就是消耗你的时间</b>。你能果断地放弃它、把时间留给仔细阅读，就已经赢了一半。"}
],
secview:"选词填空的完整套路：<b>① 给 15 个选项标词性 → ② 判断每空需要什么词性 → ③ 在候选里比搭配和语义 → ④ 用排除法收尾</b>。<b>再加上「放到最后做、限时 7 分钟」的时间策略，这一块就不会再拖你后腿。</b>"
}
];
