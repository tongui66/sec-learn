// 英语四级 · 第 6-11 章：语法体系
var CHAPTERS_B = [
{
id:6, title:"句子骨架：五种基本句型", stage:"语法体系",
intro:"四级阅读里那些「长得吓人」的句子，拆开看都只有五种骨架。<b>这一章教你一眼找出主干——找到主干，长难句就塌了。</b>",
sections:[
{h:"6.1 五种基本句型", p:["英语句子无论多长，主干一定是下面五种之一。<b>先找主语和谓语，其他都是挂在上面的。</b>"]},
{tbl:[
["句型","结构","例句"],
["① 主谓","S + V","The economy grew."],
["② 主谓宾","S + V + O","Students need practice."],
["③ 主系表","S + V + P","The plan sounds reasonable."],
["④ 主谓双宾","S + V + O1 + O2","The teacher gave us advice."],
["⑤ 主谓宾补","S + V + O + C","They elected him president."]]},
{code:[
`怎么用这五种句型读长句？举例：

  The researchers who studied 3,000 students over five years
  have found that regular exercise improves memory.

  第一步：找谓语 —— have found（前面的 studied 是定语从句里的）
  第二步：找主语 —— The researchers（后面 who... 是修饰它的）
  第三步：找宾语 —— that 从句
  主干 = The researchers have found that...
  → 去掉枝叶，句子的意思立刻就清楚了。`]},
{tip:"<b>长难句的唯一心法是「先去掉修饰，再读主干」。</b>修饰成分的三大标志：① 从句（that/which/who...）② 介词短语（of/in/with...）③ 分词短语（doing/done...）。<b>遇到它们先划掉，句子立刻变短。</b>"},
{h:"6.2 句子成分：谁是主角，谁是配角", tbl:[
["成分","作用","常见形式"],
["主语","句子的主角（谁/什么）","名词、代词、动名词、不定式、主语从句"],
["谓语","主语做什么/是什么","动词（时态、语态都体现在这里）"],
["宾语","动作的承受者","名词、代词、动名词、不定式、宾语从句"],
["表语","说明主语是什么样","名词、形容词、介词短语、表语从句"],
["定语","修饰名词（谁的、什么样的）","形容词、介词短语、定语从句、分词"],
["状语","修饰动词/整句（时间、地点、原因、让步）","副词、介词短语、状语从句"],
["补语","补充说明宾语或主语","名词、形容词、分词"]]},
{note:"<b>四级阅读的一个实用技巧：</b>指代题（What does \"they\" refer to?）考的就是「找主语」。<b>往前找一个复数名词，且和谓语单复数一致</b>——答案通常就是它。"},
{h:"6.3 主谓一致：最容易被忽略的错误点", p:["主谓一致是写作和翻译里最常见的扣分点，也是选词填空的常考点。"]},
{code:[
`① 主语后面跟 with / along with / as well as → 谓语看主语
   The teacher, along with the students, IS going.  ← 看 teacher

② each / every / either / neither 作主语 → 谓语用单数
   Every student HAS a book.

③ 集合名词 family / team / class 强调整体用单数，强调成员用复数
   The team IS winning.  /  The team ARE arguing.

④ 分数/百分数 + of + 名词 → 谓语看后面的名词
   Two thirds of the students ARE...  /  Two thirds of the water IS...

⑤ There be 句型 → be 动词看后面第一个名词
   There IS a book and two pens.`]},
{h:"6.4 长难句切分四步法", ol:["<b>找谓语动词</b>：一个句子有几个谓语，就有几个分句。找不到谓语，说明它被省略或变成了非谓语。",
"<b>去掉从句</b>：遇到 that/which/who/when/because 引导的从句，先用括号括起来。",
"<b>去掉介词短语</b>：of the students / in the past decade 这类，整块划掉。",
"<b>读主干</b>：剩下的就是主谓宾或主系表，这时候意思基本能看懂了。"]},
{code:[
`实战切分（这是四级真题里常见的句子类型）：

  Because the company that was founded in 1995 has been
  expanding its business, the number of employees
  who work in the headquarters has increased sharply.

  ① 找谓语：has been expanding / has increased（founded、work 是从句里的）
  ② 去从句：(that was founded in 1995) (who work in the headquarters)
  ③ 去介词短语：(in 1995) (of employees) (in the headquarters)
  ④ 读主干：Because the company has been expanding its business,
           the number has increased sharply.
           = 因为公司一直在扩张业务，员工数量急剧增加。`]},
{tip:"<b>练法：</b>每天从真题里挑 3 个长句，用这个方法划一遍。<b>做满两周，你读长句的速度会明显变快</b>——因为你的眼睛会自动跳过修饰成分。"},
{h:"6.5 写作里怎么用「骨架」拿分", p:["阅卷老师看一篇作文只有几十秒。<b>他要找的是「句型正确、结构清楚」</b>，而不是华丽的词。"]},
{ul:["<b>保证每个句子都有明确的主谓</b>——这是最基本的得分线，也是中式英语最容易出错的地方。",
"<b>开头用主系表</b>：It is widely believed that... / This is a common phenomenon. 稳、好写。",
"<b>中间用主谓宾 + 定语从句</b>：People who live in cities tend to... 显出句型能力。",
"<b>结尾用主谓双宾/宾补</b>：The government should give citizens more support. / We should keep our environment clean. 有力。"]},
{warn:"<b>写作最大的杀手是「一个句子写太长」。</b>长句一旦出错，整句都拿不到分。<b>宁可写 3 个短句，不要写 1 个错长句。</b>"}
],
secview:"这一章给你的是<b>「拆句子的能力」</b>：五种骨架 + 主谓一致 + 四步切分。<b>从这一章开始，你读长句应该养成一个习惯：先用笔划掉修饰，再读主干。</b>"
},
{
id:7, title:"时态体系：8 个必须用对", stage:"语法体系",
intro:"时态是英语的骨架，也是四级写作翻译最大的扣分点。<b>但要提醒你：四级不考 16 个时态，真正高频的只有 8 个。</b>这一章只讲这 8 个，讲清「什么时候用」。",
sections:[
{h:"7.1 时态 = 时间 + 状态", p:["把时态拆成两部分看：<b>时间</b>（现在 / 过去 / 将来 / 过去将来）× <b>状态</b>（一般 / 进行 / 完成 / 完成进行）。",
"<b>别去数 16 个组合。</b>你只需要掌握下面 8 个高频时态，四级就够用了。"]},
{tbl:[
["时态","形式","什么时候用","例句"],
["一般现在","do / does","事实、习惯、客观规律","Water boils at 100°C."],
["一般过去","did","过去发生、已结束","He worked here in 2020."],
["一般将来","will do / be going to","将来会发生","The meeting will start at 9."],
["现在完成","have / has done","过去发生，影响到现在","I have finished my homework."],
["过去完成","had done","「过去的过去」","He had left before I arrived."],
["现在进行","am / is / are doing","此刻正在做","She is studying for CET-4."],
["过去进行","was / were doing","过去某刻正在做","I was reading when he called."],
["将来完成","will have done","到将来某时已完成","By 2030 we will have built it."]]},
{note:"<b>记忆法：把时态想成「时间轴上的一个点或一段」。</b>一般态 = 一个点；进行态 = 正在那一段；完成态 = 从过去延伸到现在的线。<b>画一条线，比背定义管用。</b>"},
{h:"7.2 现在完成时：四级最爱考的一个", p:["它最容易被用错，因为中文里没有对应的概念。<b>它的核心是「过去的动作，和现在有关」。</b>"]},
{code:[
`什么时候必须用现在完成时（三个标志）：

① 有 for / since 的时间段（持续到现在）
   I have lived here for ten years.        ← 现在还住这儿
   对比：I lived there for ten years.       ← 现在不住了

② 有 already / yet / just / ever / never / so far / recently
   We have already finished the project.

③ 重点在「结果对现在的影响」
   I have lost my key.   ← 所以现在进不去门（影响现在）
   对比：I lost my key yesterday.  ← 只陈述过去的事

❌ 常见错误：I have seen him yesterday.
   （yesterday 是明确过去时间，不能用现在完成时）`]},
{warn:"<b>最容易错的一条：</b>句子里有明确的过去时间状语（yesterday、last week、in 2019、just now）时，<b>绝对不能用现在完成时</b>，要用一般过去时。"},
{h:"7.3 过去完成时：讲清「谁先谁后」", p:["过去完成时表示「<b>在过去某个时间之前</b>就已经完成的动作」——也就是「过去的过去」。"]},
{code:[
`用法核心：句子里有「两个过去动作」时，先发生的用过去完成时。

  By the time the ambulance ARRIVED, the patient HAD DIED.
     后发生（一般过去）              先发生（过去完成）

  He HAD LEARNED English before he CAME to the US.

常见标志词：by the time / before / after / when / already / by 1990

写作里的高分句型（背下来直接用）：
  By the time I realized my mistake, I had already wasted a year.
  （等我意识到错误时，我已经浪费了一年。）`]},
{h:"7.4 时态在写作里怎么用（评分点）", tbl:[
["场景","该用什么时态","配句"],
["描述普遍现象/观点","一般现在","Nowadays, more and more students choose to study abroad."],
["举过去的例子","一般过去","For example, my grandfather learned English at 60."],
["引用研究结果","现在完成","Recent studies have shown that..."],
["描述趋势变化","现在完成进行 / 现在完成","The number has been rising steadily."],
["预测未来","一般将来","This trend will continue in the coming years."],
["提建议","should + 动词原形","The government should take measures to..."]]},
{tip:"<b>作文里最保险的组合：</b>开头用<b>一般现在</b>陈述现象 → 中间用<b>一般过去</b>举例子 → 引用数据用<b>现在完成</b> → 结尾用<b>should</b>提建议。<b>这套组合四平八稳，几乎不会因为时态扣分。</b>"},
{h:"7.5 翻译里的时态陷阱", ul:["<b>汉语没有时态，英文必须有。</b>「我已经学英语十年了」不能翻成 I learn English for ten years.，要用 <b>I have learned English for ten years.</b>",
"<b>「了」不一定等于过去。</b>「这本书我看了三天了」是 <b>I have read the book for three days.</b>",
"<b>「会」可能是一般将来。</b>「明天我会去」= I will go tomorrow.，不是 I can go。",
"<b>时间状语是唯一线索。</b>翻译前先圈出所有时间词（已经、曾经、一直、明年、去年），<b>再决定时态</b>。"]},
{code:[
`翻译对照（注意时态）：

  中文：自从 2010 年以来，这座城市发生了巨大的变化。
  ❌ Since 2010, this city changed greatly.
  ✅ Since 2010, this city HAS CHANGED greatly.
     （since + 时间点 → 必须用现在完成时）

  中文：等我到达车站时，火车已经开走了。
  ❌ When I arrived at the station, the train left.
  ✅ When I arrived at the station, the train HAD LEFT.
     （两个过去动作，先发生的用过去完成时）`]}
],
secview:"时态只要求你<b>用对 8 个</b>：一般现在/过去/将来、现在/过去进行、现在/过去完成、将来完成。<b>判断顺序是「先看时间词，再看动作关系（谁先谁后），最后看是否影响现在」。</b>"
},
{
id:8, title:"语态与情态动词", stage:"语法体系",
intro:"被动语态让句子「显得客观」，是学术文章和四级阅读的最爱；情态动词则决定一句话的<b>语气强弱</b>——而语气，正是听力态度题和阅读推断题的考点。",
sections:[
{h:"8.1 被动语态：什么时候必须用", p:["被动语态的结构是 <b>be + 过去分词</b>。当「动作的承受者」比「执行者」更重要（或不知道执行者是谁）时，就用被动。"]},
{tbl:[
["主动","被动"],
["They built the bridge in 1990.","The bridge was built in 1990."],
["Researchers have found a new method.","A new method has been found."],
["We must protect the environment.","The environment must be protected."],
["People are discussing the plan.","The plan is being discussed."],
["They will announce the results.","The results will be announced."]]},
{note:"<b>四级阅读里的信号：</b>科技、研究、政策类文章大量使用被动（<code>It has been proved that...</code>、<code>Measures should be taken...</code>）。<b>看到被动，说明重点在后半句的「结果」上。</b>"},
{h:"8.2 三个被动语态的高频考点", ol:["<b>不及物动词没有被动。</b>happen、occur、appear、rise、arrive 这类词<b>不能用被动</b>。<br>❌ An accident was happened.　✅ An accident happened.",
"<b>感官动词和使役动词的被动要还原 to。</b><br>主动：They made him work late.　被动：He was made <b>to</b> work late.",
"<b>短语动词的介词不能丢。</b><br>The children were well looked <b>after</b>.　（不能写成 looked）"]},
{h:"8.3 情态动词：语气的强弱表", tbl:[
["情态动词","语气","意思","例句"],
["can / could","能力、可能","能、可以","She can speak French."],
["may / might","<b>不确定的可能</b>","也许（可能性比 can 低）","It may rain tomorrow."],
["must","<b>最强的肯定推测</b>","一定、必须","He must be tired."],
["can't","<b>最强的否定推测</b>","不可能","It can't be true."],
["should / ought to","建议、应该","应该","You should see a doctor."],
["had better","<b>强烈建议（带警告）</b>","最好","You'd better not be late."],
["needn't","不必要","不必","You needn't worry."],
["would","过去习惯、委婉","会、愿意","He would walk to school every day."]]},
{code:[
`推测类情态动词的「可能性阶梯」（听力态度题常考）：

  must  ＞  should  ＞  may  ＞  might  ＞  could  ＞  can't
  一定      很可能     也许      也许(更弱)   可能        不可能

真题例句：
  The project MUST be completed by Friday.     → 语气最强：必须
  The project SHOULD be completed by Friday.   → 应该（有商量余地）
  The project MIGHT be delayed.                → 也许会被推迟（不确定）`]},
{h:"8.4 虚拟语气：和事实相反", p:["虚拟语气表示「<b>和事实相反或者不太可能发生</b>」的情况。它的形式有规律：<b>时态往前推一格</b>。"]},
{tbl:[
["情况","if 从句","主句"],
["和现在相反","did（一般过去）","would / could / might do"],
["和过去相反","had done（过去完成）","would / could / might have done"],
["和将来相反（不太可能）","were to do / should do","would do"]]},
{code:[
`例句对照：

  和现在相反：
  If I WERE you, I WOULD take the exam again.
  （我现在不是你 —— 事实相反）

  和过去相反：
  If I HAD STUDIED harder, I WOULD HAVE PASSED.
  （我过去没努力，所以没通过 —— 遗憾）

  wish 后面的虚拟（作文里能用上）：
  I wish I HAD MORE TIME.          （现在）
  I wish I HAD STARTED earlier.    （过去）`]},
{tip:"<b>识别口诀：看到 if 从句用过去时、主句却用 would，就是虚拟语气。</b>阅读里遇到虚拟语气，往往表示「<b>作者认为现实不是这样</b>」——<b>这正是推断题的答案来源。</b>"},
{h:"8.5 写作里的被动与情态（提分句）", code:[
`建议类（作文结尾最好用）：
  Measures SHOULD BE TAKEN to solve this problem.
  More attention SHOULD BE PAID to mental health.
  It IS WIDELY BELIEVED that education changes lives.
  The problem CANNOT BE IGNORED any longer.

分析类（中间段好用）：
  It HAS BEEN PROVED that regular exercise improves memory.
  This phenomenon IS OFTEN ATTRIBUTED TO social pressure.
  The issue SHOULD BE VIEWED from two angles.`]},
{warn:"<b>别整篇都用被动。</b>被动用太多会显得「没人负责、没有力量」。<b>结尾段用一次 should be done 足够</b>，其余还是主动句更清楚。"}
],
secview:"这一章的落点：<b>被动语态用来把「结果」推到句子前面（阅读定位、写作客观化），情态动词用来表达语气强弱（听力态度、阅读推断）。</b>两者都是「看懂了就能拿分」的考点。"
},
{
id:9, title:"非谓语动词：to do / doing / done", stage:"语法体系",
intro:"非谓语动词是四级语法里<b>最难也最值钱</b>的一块：选词填空考它的形式，阅读考它的修饰关系，写作里用对了能直接提分。这一章把它讲透。",
sections:[
{h:"9.1 什么是非谓语动词", p:["一个简单句里<b>只能有一个谓语动词</b>。当你要用第二个动词时，就得把它变成非谓语形式：<b>to do / doing / done</b>。"]},
{code:[
`对比一下就清楚了：

  ❌ I want go home.                 （两个动词并列，错）
  ✅ I want TO GO home.              （第二个动词变不定式）

  ❌ He finished write the report.
  ✅ He finished WRITING the report. （第二个动词变动名词）

  ❌ The book writing by him is good.
  ✅ The book WRITTEN by him is good.（被动关系用过去分词）`]},
{h:"9.2 三种形式的核心区别", tbl:[
["形式","含义","和逻辑主语的关系","例"],
["to do","要去做（目的、将来）","主动","I have a lot of work to do."],
["doing","正在做 / 主动 / 抽象名词","主动进行","The man standing there is my teacher."],
["done","被做（被动、已完成）","被动","The window broken yesterday has been fixed."]]},
{note:"<b>判断三步走：</b>① 这个动词和它的逻辑主语是<b>主动</b>还是<b>被动</b>？② 动作是<b>已发生</b>还是<b>将发生</b>？③ 它在句子里做什么成分？<b>三问一过，答案就出来了。</b>"},
{h:"9.3 不定式 vs 动名词：只跟一种的动词", p:["有些动词后面只能跟 to do，有些只能跟 doing，还有的意思会变。<b>这是选择题和写作的高频失分点。</b>"]},
{tbl:[
["只跟 to do","只跟 doing","意思会变"],
["want / hope / decide","enjoy / finish / avoid","stop / remember / forget"],
["plan / agree / refuse","mind / suggest / practice","try / regret / mean"],
["manage / afford / expect","consider / imagine / keep","go on / need"]]},
{code:[
`意思会变的三组（重要！）：

  stop to do     停下来去做另一件事
  stop doing     停止做这件事
  → He stopped TO SMOKE.   （他停下来，去抽烟）
  → He stopped SMOKING.    （他戒烟了）

  remember to do   记得去做（还没做）
  remember doing   记得做过（已经做了）
  → Remember TO LOCK the door.  （记得去锁门）
  → I remember LOCKING the door.（我记得锁过门了）

  try to do      努力去做
  try doing      试着做做看（试试这个办法）
  → He tried TO OPEN the door.  （他努力想打开）
  → He tried OPENING the door.  （他试着开门看看）`]},
{h:"9.4 分词作定语和状语（阅读高频）", code:[
`做定语（修饰名词，可以还原成定语从句）：

  the girl SINGING on the stage
    = the girl who IS SINGING on the stage

  the letter WRITTEN in 1990
    = the letter which WAS WRITTEN in 1990

做状语（表示时间、原因、条件、结果）：

  HAVING FINISHED his work, he went home.
    = After he had finished his work, he went home.（时间）

  NOT KNOWING the answer, she kept silent.
    = Because she did not know the answer, she kept silent.（原因）

  GIVEN more time, we could do it better.
    = If we were given more time, we could do it better.（条件）`]},
{tip:"<b>阅读里怎么用：</b>看到句首的 doing/done 短语，直接在心里加个「因为 / 当…时」，<b>它修饰的是主句的主语</b>。<b>看懂了这层关系，长句就少一个障碍。</b>"},
{h:"9.5 独立主格：写作里的高阶句型", p:["当分词短语的逻辑主语和主句主语不一致时，就要在前面加一个自己的主语，这叫独立主格。<b>用对了是加分项，用错了是灾难。</b>"]},
{code:[
`  Time PERMITTING, we will visit the museum tomorrow.
    = If time permits, we will visit the museum tomorrow.

  The work FINISHED, we went out for dinner.
    = After the work was finished, we went out for dinner.

  There BEING no bus, we had to walk home.
    = Because there was no bus, we had to walk home.`]},
{h:"9.6 三条最容易踩的坑", ul:["<b>不要把非谓语当谓语用。</b>❌ The students <b>studying</b> hard every day.（没有主句谓语）",
"<b>不要忘记被动形式。</b>❌ the problem <b>solving</b> yesterday　✅ the problem <b>solved</b> yesterday",
"<b>不要漏掉 not 的位置。</b>❌ <b>Not having</b> finished...　✅ 正确；但 ❌ <b>Having not</b> finished...（错误）"]},
{tip:"<b>写作使用建议：</b>非谓语不是越多越好。<b>一篇作文用 2-3 个就够</b>（比如开头一个分词状语、中间一个定语从句、结尾一个不定式表目的）。<b>用多了容易出错，反而扣分。</b>"}
],
secview:"非谓语动词的<b>核心判断三步</b>：① 主动还是被动？② 已发生还是将发生？③ 在句中做什么成分？<b>做题时套这三步，写作时只用最有把握的 2-3 个，这一块就能稳定拿分。</b>"
},
{
id:10, title:"复合句（一）：定语从句与状语从句", stage:"语法体系",
intro:"四级阅读的长句，八成靠从句撑起来。<b>这一章讲清「从句修饰谁」——从句一旦定位错了，整句意思就反了。</b>",
sections:[
{h:"10.1 定语从句：修饰名词的句子", p:["定语从句紧跟在名词后面，<b>修饰这个名词</b>。这个被修饰的词叫「先行词」。"]},
{code:[
`结构：先行词 + 关系词 + 从句

  The man WHO IS STANDING THERE is my teacher.
  （先行词：man；关系词：who；从句：who is standing there）

  → 翻译成中文时，把从句放到名词前面：
     「站在那里的那个人是我的老师。」`]},
{h:"10.2 关系词怎么选（一张表记住）", tbl:[
["关系词","先行词","在从句中作","例句"],
["who","人","主语 / 宾语","The girl who won is my sister."],
["whom","人","宾语（正式）","The man whom you met is my uncle."],
["whose","人 / 物","定语（谁的）","The student whose bag was stolen cried."],
["which","物","主语 / 宾语","The book which I bought is useful."],
["that","人 / 物","主语 / 宾语","The book that I bought is useful."],
["when","时间","时间状语","I remember the day when we met."],
["where","地点","地点状语","This is the school where I studied."],
["why","原因","原因状语","That's the reason why he left."]]},
{note:"<b>记忆法：关系词 = 它在从句里扮演的角色。</b>从句里缺主语 → 用 who/which/that；缺宾语 → 同样；缺「…的」→ whose；从句完整（不缺成分）→ 用 when/where/why。<b>先看从句缺什么，再选词。</b>"},
{h:"10.3 that 和 which 的区别（必考）", ul:["<b>非限制性定语从句只能用 which，不能用 that。</b>（有逗号的就是非限制性）<br>✅ Beijing, <b>which</b> is the capital, is beautiful.　❌ Beijing, that is...",
"<b>介词后面只能用 which / whom。</b><br>✅ the house <b>in which</b> he lives　❌ the house in that he lives",
"<b>先行词是 all / everything / nothing / the only / the first 时，多用 that。</b><br>✅ This is the only book <b>that</b> I have.",
"<b>先行词既有人又有物时，用 that。</b>"]},
{h:"10.4 状语从句：九种逻辑关系", tbl:[
["关系","连词","例句"],
["时间","when / while / as / before / after / until / since","When he arrived, we were eating."],
["地点","where / wherever","Put it where you can find it."],
["原因","because / since / as / now that","Since you're here, let's start."],
["结果","so...that / such...that","It was so cold that we stayed in."],
["目的","so that / in order that","He left early so that he could catch the bus."],
["条件","if / unless / as long as / provided that","Unless you hurry, you'll be late."],
["让步","although / though / even if / while","Although it rained, we went out."],
["比较","than / as...as","He is taller than I am."],
["方式","as / as if / as though","Do as I told you."]]},
{warn:"<b>三个高频错误：</b><br>① <b>although 和 but 不能同时用</b>（中文里「虽然…但是…」是习惯，英文只留一个）。<br>② <b>because 和 so 不能同时用</b>。<br>③ <b>让步从句用 although 时，主句不能加 but</b>——这三条每次考试都有人错。"},
{h:"10.5 阅读实战：从句定位法", p:["阅读题里的细节题，答案往往就在<b>从句或被从句修饰的名词附近</b>。"]},
{code:[
`题目：What is the main reason that young people avoid
      working in rural areas?

题干关键词：reason / avoid / rural areas

原文：Many young people, WHO grew up in cities, avoid working
      in rural areas BECAUSE they are unwilling to give up
      the convenience of urban life.

定位：以题干的 reason / avoid / rural areas 找到这一句，
      答案在 because 引导的原因状语从句里：
      → unwilling to give up the convenience of urban life
      （不愿放弃城市生活的便利）`]},
{tip:"<b>定位口诀：</b>题干里的<b>名词</b>（reason、result、purpose）直接对应原文的<b>连接词</b>（because、so that、in order to）。<b>看到题干问 reason，就去原文找 because</b>——这是最快的一条路。"}
],
secview:"定语从句的关键是<b>「从句修饰哪个名词」</b>，状语从句的关键是<b>「表达哪种逻辑关系」</b>。<b>把这两张表记熟，再配合「找 because / so that」的定位法，阅读里的长句就不再是障碍。</b>"
},
{
id:11, title:"复合句（二）：名词性从句与特殊结构", stage:"语法体系",
intro:"名词性从句是「一整句话当一个名词用」——它是四级阅读里<b>最容易被读错</b>的结构，因为 that 从句经常很长，而它其实是句子的主语或宾语。",
sections:[
{h:"11.1 名词性从句的四种位置", tbl:[
["类型","在句中作","例"],
["主语从句","主语","<b>What he said</b> surprised everyone."],
["宾语从句","宾语","I don't know <b>whether he will come</b>."],
["表语从句","表语","The problem is <b>that we have no time</b>."],
["同位语从句","解释前面的名词","The fact <b>that he lied</b> shocked us."]]},
{code:[
`读长句的关键：看到句首很长的一段，先问「它的谓语在哪」。

  What the researchers discovered after ten years of study
  is that sleep quality affects memory.

  主语 = What the researchers discovered after ten years of study
  谓语 = is
  表语 = that sleep quality affects memory

  → 主干：What they discovered IS that...
  → 意思：他们发现的是——睡眠质量影响记忆。`]},
{h:"11.2 that / whether / if 怎么选", ul:["<b>that</b>：陈述事实。从句意思完整，不缺成分。在宾语从句里 that 可以省略。",
"<b>whether</b>：是否。<b>下列情况只能用 whether，不能用 if</b>：① 句首作主语　② 介词后面　③ 与 or not 连用　④ 不定式前面。",
"<b>if</b>：只在<b>宾语从句</b>里表示「是否」，其他位置一律用 whether。",
"<b>连接代词</b>（what、who、which、whose）和<b>连接副词</b>（when、where、why、how）：<b>从句本身缺成分时用它们。</b>"]},
{code:[
`对比记忆：

  I don't know IF / WHETHER he will come.     ✅ 都可以（宾语从句）
  WHETHER he will come is unknown.            ❌ 不能用 If
  It depends on WHETHER he agrees.            ❌ 不能用 if（介词后）
  I wonder WHETHER OR NOT he agrees.          ❌ 不能用 if

  WHAT he said is true.        （从句缺宾语 → 用 what）
  THAT he said so is true.     （从句完整 → 用 that）`]},
{h:"11.3 同位语从句 vs 定语从句（易混）", tbl:[
["","同位语从句","定语从句"],
["作用","解释前面名词的<b>内容</b>","修饰前面名词，限定<b>是哪一个</b>"],
["that 的角色","只起连接作用，不作成分","作从句的主语或宾语"],
["例句","The news <b>that</b> he won made us happy.","The news <b>that</b> he told us was false."],
["判断","去掉 that，剩下的是完整句子","去掉 that，句子缺成分"]]},
{tip:"<b>判断方法：</b>把 that 后面的部分单独拿出来读——<b>如果它本身就是一个完整的句子，那就是同位语从句</b>（解释内容）；<b>如果它缺主语或宾语，那就是定语从句</b>。"},
{h:"11.4 强调句：It is ... that ...", code:[
`结构：It is / was + 被强调部分 + that + 其余部分

  原句：Tom broke the window yesterday.

  强调主语：It was TOM that broke the window yesterday.
  强调宾语：It was THE WINDOW that Tom broke yesterday.
  强调时间：It was YESTERDAY that Tom broke the window.

  判断是不是强调句：去掉 It is 和 that，句子依然完整 → 就是强调句。

阅读里的作用：强调句往往就是作者最想说的那句话，
             也是细节题最爱的出题位置。`]},
{h:"11.5 倒装与省略", code:[
`倒装（作文里能拿分，但要慎用）：

  否定词放句首要倒装：
    Not only DID he pass the exam, but he also got an A.
    Never HAVE I seen such a beautiful place.

  虚拟条件句省略 if：
    HAD I known earlier, I would have helped.
    = If I had known earlier...

  让步倒装：
    Young AS he is, he knows a lot.
    = Although he is young, he knows a lot.

省略（阅读里要能还原）：
    When (he was) asked, he kept silent.
    If (it is) possible, please call me.`]},
{h:"11.6 写作里的四个高分句型", code:[
`① 主语从句开头（显得客观、正式）
   What matters most is not the result but the process.

② It 作形式主语的强调句
   It is widely acknowledged that reading broadens our horizons.

③ not only ... but also 倒装
   Not only does exercise strengthen our body, but it also
   relieves mental pressure.

④ 同位语从句引出观点
   There is no denying the fact that environmental protection
   requires everyone's effort.`]},
{warn:"<b>这四个句型，一篇作文用两个就够。</b>倒装句一旦用错（比如助动词位置写错），反而会暴露语法问题。<b>基础不牢时，宁可写「It is widely believed that...」这种稳的。</b>"}
],
secview:"名词性从句的本质是<b>「一整句当一个名词」</b>：作主语就是主语从句，作宾语就是宾语从句。<b>读长句时先找主干谓语，再看从句扮演什么角色；写作时只用最有把握的 2 个句型。</b>"
}
];
