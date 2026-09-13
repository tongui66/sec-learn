// 英语四级 · 章节练习（20 章 × 4 题 = 80 题）
// 答案分布：每章四个答案是 A/B/C/D 各一次，全书 20 章 → 每个字母各 20 题
var EXERCISES = {
1: [
 { q: "四级考试的总分和及格线是？", options: ["710 分，425 分及格", "710 分，500 分及格", "100 分，60 分及格", "850 分，425 分及格"], answer: 0, explain: "四级总分 710 分，425 分算通过（约 60%）。写作和翻译各 106.5 分，听力和阅读各 248.5 分。" },
 { q: "四大部分里占比最大的是？", options: ["写作", "听力（35%）", "翻译", "选词填空"], answer: 1, explain: "听力和阅读各占 35%（各 248.5 分），加起来 70%。写作和翻译各占 15%。所以真正决定过不过的是听力和阅读。" },
 { q: "听力音频播放结束后会发生什么？", options: ["可以继续慢慢涂卡", "有 5 分钟补涂时间", "立刻收答题卡一，没有补涂时间", "休息十分钟再继续"], answer: 2, explain: "听力播完马上收答题卡一，所以必须边听边涂。这是很多人丢分的地方——听懂了自己却卡在没涂完。" },
 { q: "性价比最低、应该放到最后做的题型是？", options: ["仔细阅读", "听力篇章", "长篇阅读匹配", "选词填空"], answer: 3, explain: "选词填空 10 题只值 35.5 分（每题 3.55），而仔细阅读 10 题值 142 分（每题 14.2）。同样时间花在仔细阅读上收益是它的 4 倍。" }
],
2: [
 { q: "听力「听着熟但想不起意思」，最常见的原因是？", options: ["词汇量太小", "脑子里存的发音和录音里的发音不一样", "录音速度太快", "没有字幕"], answer: 1, explain: "背单词时只记拼写和中文，没把发音存进去；再加上连读、弱读、吞音，实际读音和你以为的差很远。解决方法是跟读。" },
 { q: "not at all 在真实语流里接近哪种读音？", options: ["not-at-all", "no-ta-tall", "no-ta-dall", "no-tat-al"], answer: 2, explain: "辅音+元音连读，t 在两个元音之间浊化成 d：not at all → no-ta-dall。这是听力里最典型的连读形态。" },
 { q: "英语句子里重读与弱读的规律是？", options: ["所有词都要重读", "只有动词重读", "实词弱读、虚词重读", "实词重读、虚词弱读"], answer: 3, explain: "名词、动词、形容词、副词等实词重读；冠词、介词、连词、助动词等虚词弱读。所以你听到的「信息点」是实词。" },
 { q: "下面哪一组最容易听错、也最该优先练？", options: ["sheep / ship（长音与短音）", "cat / dog", "book / pen", "red / blue"], answer: 0, explain: "长音与短音（/iː/ 与 /ɪ/、/æ/ 与 /e/）是最容易混的一组。四级听力里因为这几组听错而丢的分占很大比例。" }
],
3: [
 { q: "前缀 im- 加在 possible 前面表示？", options: ["非常可能", "再一次可能", "否定（不可能）", "提前发生"], answer: 2, explain: "im- 是否定前缀 in- 在 p、b、m 前面的变体：impossible、impolite、imbalance。同理 il-（illegal）、ir-（irregular）。" },
 { q: "词根 spect 的意思是？", options: ["写", "搬运", "说", "看"], answer: 3, explain: "spect / spic = 看：inspect（往里看=检查）、respect（反复看=尊重）、suspicious（往上看=可疑）、prospect（往前看=前景）。" },
 { q: "后缀 -tion 通常构成什么词性？", options: ["名词", "动词", "形容词", "副词"], answer: 0, explain: "-tion/-sion/-ment/-ness/-ity 都是名词后缀。选词填空第一步给选项标词性，靠的就是这些后缀。" },
 { q: "transport 里的前缀 trans- 表示？", options: ["向内", "跨过、转移", "向外", "反对"], answer: 1, explain: "trans- = 跨越：transport（运输）、translate（翻译）、transform（转化）、transplant（移植）。" }
],
4: [
 { q: "affect 和 effect 的正确区别是？", options: ["两个都是名词", "两个都是动词", "affect 是名词，effect 是动词", "affect 是动词（影响），effect 是名词（影响）"], answer: 3, explain: "Smoking affects health.（动词）／It has a bad effect on health.（名词）。四级选择题和写作里都常考这一组。" },
 { q: "有效背单词的「三件套」是？", options: ["意思、发音、搭配", "拼写、拼写、拼写", "中文、中文、中文", "字母顺序、页码、组号"], answer: 0, explain: "一个词要记住意思、发音、搭配三样。缺了发音，听力用不上；缺了搭配，写作和选词填空用不上。" },
 { q: "短语 result in 的意思是？", options: ["由…引起", "导致", "在…之后", "与…有关"], answer: 1, explain: "result in = 导致（前因后果）；result from = 由…造成（前果后因）。这两个方向最容易搞反，已经考过多次。" },
 { q: "在「address the issue」中，address 的意思是？", options: ["地址", "演讲", "处理、解决", "写给"], answer: 2, explain: "这是典型的「熟词僻义」。address 除了「地址」，还常表示「处理、解决（问题）」和「向…讲话」。按常见意思翻译不通时，要想到僻义。" }
],
5: [
 { q: "做选词填空的正确第一步是？", options: ["给 15 个选项标出词性", "先通读全文并翻译", "先读题目再读选项", "直接凭语感填"], answer: 0, explain: "先标词性，确定每个空需要什么词性，就能直接把 15 选 1 缩小到 5 选 1 甚至 1 选 1。这是最省时间的做法。" },
 { q: "a / an / the + 形容词 + ___，空格里需要什么词性？", options: ["动词", "名词", "副词", "形容词"], answer: 1, explain: "冠词和形容词后面一定是名词（在名词短语里）。这是判断词性最快的一条规则。" },
 { q: "修饰动词和形容词的成分是？", options: ["名词", "冠词", "副词", "介词"], answer: 2, explain: "副词修饰动词、形容词和另一个副词（reported accurately / extremely important）。看到「动词前后插一个空」，优先考虑副词。" },
 { q: "选词填空在整张卷子里应该怎么安排？", options: ["最先做", "放在听力之前做", "和翻译交替做", "放到最后做，限时 7 分钟"], answer: 3, explain: "它 10 题只值 35.5 分且最费时间。放最后做，时间不够就全部涂一个答案，把时间留给仔细阅读和翻译。" }
],
6: [
 { q: "五种基本句型中 S + V + O 表示？", options: ["主系表", "主谓宾", "主谓双宾", "主谓宾补"], answer: 1, explain: "S+V+O = 主谓宾（Students need practice.）。知道五种骨架，读长句时就能快速找出主干。" },
 { q: "The teacher, along with the students, ___ going. 该填什么？", options: ["are（看 students）", "were", "is（看主语 teacher）", "be"], answer: 2, explain: "along with / as well as / together with 只是插入成分，谓语看真正的主语 teacher，所以用 is。" },
 { q: "长难句切分的第一步是？", options: ["先翻译每一个词", "先找出所有修饰成分", "先看标点符号", "先找谓语动词"], answer: 3, explain: "有几个谓语就有几个分句。先找谓语，再找主语和宾语，主干就出来了。" },
 { q: "下面哪一组是「修饰成分」的三大标志？", options: ["从句、介词短语、分词短语", "主语、谓语、宾语", "句号、逗号、分号", "大写字母、数字、引号"], answer: 0, explain: "读长句时先用括号把这些划掉，剩下的就是主干。这是提高阅读速度最有效的一个动作。" }
],
7: [
 { q: "I have seen him yesterday. 这句话错在哪？", options: ["不该用 him", "yesterday 该放句首", "yesterday 是明确过去时间，不能用现在完成时，应改成 I saw him yesterday", "seen 应该改成 saw 但保留 have"], answer: 2, explain: "现在完成时的核心是「和现在有关」，不能和明确的过去时间状语（yesterday、last week、in 2019）连用。" },
 { q: "表示「过去的过去」，应该用什么时态？", options: ["一般过去时", "现在完成时", "过去进行时", "过去完成时"], answer: 3, explain: "过去完成时（had done）表示在过去某个时间点之前就已经完成的动作。两个过去动作并存时，先发生的用过去完成时。" },
 { q: "Since 2010, this city ___ greatly.（该用什么时态）", options: ["现在完成时（has changed）", "一般过去时（changed）", "一般将来时（will change）", "过去完成时（had changed）"], answer: 0, explain: "since + 时间点表示「从那时持续到现在」，必须用现在完成时。翻译和写作里这是高频考点。" },
 { q: "作文里引用研究结果，最常用的时态是？", options: ["一般过去", "现在完成（Recent studies have shown that...）", "过去完成", "将来完成"], answer: 1, explain: "「最近的研究已经表明」用现在完成时最自然，因为它强调的是「结论对现在有效」。" }
],
8: [
 { q: "被动语态的结构是？", options: ["have + 过去分词", "be + doing", "will + 动词原形", "be + 过去分词"], answer: 3, explain: "被动语态是 be + 过去分词，时态变化体现在 be 上：is done / was done / has been done / must be done。" },
 { q: "happen 这个词能不能用被动语态？", options: ["不能，它是不及物动词", "能，An accident was happened 是对的", "只能在过去时用被动", "只能在现在完成时用被动"], answer: 0, explain: "happen、occur、appear、rise、arrive 等不及物动词没有被动语态。这是改错和写作里的高频错误点。" },
 { q: "must 表示推测时，语气强度是？", options: ["最弱的可能", "最强的肯定（一定）", "否定（不可能）", "建议"], answer: 1, explain: "可能性阶梯：must（一定）＞ should（很可能）＞ may ＞ might ＞ could ＞ can't（不可能）。听力态度题常考这个梯度。" },
 { q: "If I ___ you, I would take the exam again.", options: ["am", "was", "were", "will be"], answer: 2, explain: "这是与现在事实相反的虚拟语气：if 从句用过去式（be 动词统一用 were），主句用 would + 动词原形。" }
],
9: [
 { q: "enjoy 后面应该接什么形式？", options: ["doing（动名词）", "to do（不定式）", "动词原形", "过去分词"], answer: 0, explain: "enjoy / finish / avoid / mind / suggest / practice / consider 等后面只跟动名词 doing。" },
 { q: "stop doing 和 stop to do 的区别是？", options: ["意思完全一样", "stop doing 是停止做这件事；stop to do 是停下来去做另一件事", "stop doing 是将来时", "stop to do 是错误用法"], answer: 1, explain: "He stopped smoking. = 他戒烟了；He stopped to smoke. = 他停下来去抽烟。这类「意思会变」的动词还有 remember / forget / try / regret。" },
 { q: "The window ___ yesterday has been fixed.", options: ["breaking", "to break", "broken", "breaks"], answer: 2, explain: "窗户是「被打破」的，和逻辑主语是被动关系，所以用过去分词 broken 作后置定语（= which was broken yesterday）。" },
 { q: "判断非谓语动词用哪种形式，正确的三步是？", options: ["看时态、看语态、看主谓一致", "看主谓、看宾语、看定语", "看词性、看搭配、看语义", "先看主动还是被动，再看动作已发生还是将发生，最后看它在句中作什么成分"], answer: 3, explain: "这三步能解决绝大多数非谓语动词题。写作里只用最有把握的 2-3 个，避免出错。" }
],
10: [
 { q: "先行词是「人」且在从句中作主语时，用什么关系词？", options: ["which", "who", "whose", "where"], answer: 1, explain: "who 指人作主语/宾语；which 指物；whose 表示「谁的」；where 指地点（从句不缺成分时用）。" },
 { q: "Beijing, ___ is the capital, is beautiful.", options: ["that", "what", "which", "where"], answer: 2, explain: "有逗号的是非限制性定语从句，只能用 which，不能用 that。这是必考语法点。" },
 { q: "下面哪个连词引导「原因」状语从句？", options: ["although", "unless", "so that", "because"], answer: 3, explain: "because / since / as / now that 表原因；although 表让步；unless 表条件；so that 表目的。" },
 { q: "Although it rained, but we went out. 这句话的问题是？", options: ["although 和 but 不能同时出现，应该去掉 but", "缺少主语", "时态错误", "完全没有问题"], answer: 0, explain: "中文里「虽然…但是…」是习惯，英文里只能说 Although it rained, we went out. 或 It rained, but we went out.。同理 because 和 so 也不能同时用。" }
],
11: [
 { q: "名词性从句在句中作主语时，叫什么从句？", options: ["定语从句", "状语从句", "主语从句", "同位语从句"], answer: 2, explain: "名词性从句按位置分四种：作主语是主语从句，作宾语是宾语从句，作表语是表语从句，解释前面名词是同位语从句。" },
 { q: "下列哪种情况只能用 whether，不能用 if？", options: ["宾语从句", "口语中", "否定句中", "介词后面"], answer: 3, explain: "只能用 whether 的四种情况：① 句首作主语 ② 介词后面 ③ 与 or not 连用 ④ 不定式前面。if 只在宾语从句里表示「是否」。" },
 { q: "The news ___ he won made us happy. 这个从句属于？", options: ["同位语从句", "定语从句", "状语从句", "宾语从句"], answer: 0, explain: "that 后面的 he won 本身是完整句子，说明它是在解释 the news 的「内容」，所以是同位语从句。" },
 { q: "怎么判断 It is ... that ... 是不是强调句？", options: ["看有没有逗号", "去掉 It is 和 that，句子依然完整", "看时态是不是过去时", "看主语是不是人"], answer: 1, explain: "能还原成完整句子就是强调句。强调句的位置往往就是作者最想说的内容，也是细节题爱出题的地方。" }
],
12: [
 { q: "短篇新闻最重要的规律是？", options: ["结尾句是主旨", "中间段落最重要", "只考数字", "开头句往往是主旨，第一句常出题"], answer: 3, explain: "新闻的第一句通常概括整条新闻（who/what/when/where）。很多人开局走神，第一题就丢了。" },
 { q: "听力音频播放前的那几十秒，应该做什么？", options: ["预读选项，圈出名词和数字", "闭眼休息", "回忆单词拼写", "先看作文题目"], answer: 0, explain: "预读让你「带着问题去听」。圈出选项里反复出现的名词，就能预测话题；圈数字，就等着听数字题。" },
 { q: "短篇新闻的答案主要靠哪条法则？", options: ["同义替换", "视听一致（听到什么选什么）", "排除法", "逻辑推理"], answer: 1, explain: "短篇新闻大多是原词复现，视听一致最有效；长对话则更多靠同义替换，并且要警惕「原词陷阱」。" },
 { q: "三遍精听法中，哪一遍最有价值？", options: ["第一遍（模拟考试）", "第三遍（跟读）", "第二遍（逐句精听、写下没听出来的原因）", "三遍差不多"], answer: 2, explain: "很多人做完题只对答案，等于丢掉 90% 的价值。第二遍找出「为什么没听出来」——是生词、连读还是语速——那才是你要补的东西。" }
],
13: [
 { q: "长对话的出题位置通常是？", options: ["问答处、转折词后、建议句", "只在第一句", "只在最后一句", "完全随机"], answer: 0, explain: "问答处（第二个人的回答）、转折后（but/however）、建议句（Why not / You'd better）几乎是长对话的固定出题点。" },
 { q: "听力篇章的结构通常是？", options: ["没有规律", "开头立论、中间举例、结尾总结", "倒叙", "只有例子"], answer: 1, explain: "听力篇章的结构和阅读文章几乎一样。所以阅读里练的「找主题句、找论据」可以直接搬到听力篇章上用。" },
 { q: "长对话里的「原词陷阱」指的是？", options: ["选项里的词太简单", "原文里根本没有这个词", "选项和原文用词完全一样，但它可能只是被提到、并不是答案", "原文重复两次的词"], answer: 2, explain: "长对话里，太「巧合」的原词往往不是答案；正确答案通常是同义改写。这一点和短篇新闻正好相反。" },
 { q: "The meeting was moved from Tuesday to Thursday. 答案应该是？", options: ["Tuesday", "两个都对", "不确定", "Thursday"], answer: 3, explain: "数字题要听清「关系」：moved from A to B，答案是 B。同理 rose by 20%（增加 20%）和 rose to 20%（增加到 20%）也不一样。" }
],
14: [
 { q: "长篇阅读匹配题的正确做法是？", options: ["先通读全文再做", "先看 10 个题干、圈关键词，再带关键词回原文扫", "先读所有选项", "按段落顺序逐段翻译"], answer: 1, explain: "通读 1000 词要花 8-10 分钟，做完就没时间了。正确做法是「先看题干圈关键词，再回原文定位」。" },
 { q: "题干里应该优先圈哪类词？", options: ["people、study 这类满篇都是的词", "所有名词都圈", "专有名词、数字、生僻名词、绝对词", "只圈动词"], answer: 2, explain: "关键词要「独特」才有定位价值。people、study、research 这种满篇都有的词，圈了等于没圈。" },
 { q: "题干里的 important，在原文中可能写成？", options: ["importance", "importantly", "importance of", "significant / vital / crucial"], answer: 3, explain: "长篇阅读的灵魂就是同义替换。题干和原文一个原词都不重合、全是替换，这种情况很常见。" },
 { q: "长篇阅读有 15 个段落、10 道题，规则是？", options: ["有的段落会被选两次，有的段落一次都不选", "每段只能用一次", "每段都必须用", "段落数一定等于题数"], answer: 0, explain: "15 段对 10 题，必然有 5 个段落不被选。所以「某段已经选过两次」之后，就可以不再往那里找了。" }
],
15: [
 { q: "仔细阅读每题多少分？", options: ["3.55 分", "7.1 分", "14.2 分", "106.5 分"], answer: 2, explain: "仔细阅读 10 题共 142 分，每题 14.2 分，是全卷性价比最高的题型之一。多对 3 题就够从 398 冲到 425。" },
 { q: "下面哪种属于「以偏概全」的干扰项？", options: ["正话反说", "无中生有", "偷换概念", "把原文的「部分」说成「全部」，常配 always / all"], answer: 3, explain: "四类干扰项：偷换概念、以偏概全、无中生有、正话反说。看到绝对词（always/never/must/all）就要警觉。" },
 { q: "原文用了 may、might 这类词时，正确选项的语气应该？", options: ["也用可能性语气（可能、也许）", "用 must（一定）", "用 prove（证明）", "用 always"], answer: 0, explain: "选项的语气必须和原文一致。原文说可能，选项说「一定」，就是过度推断，往往就是错误项。" },
 { q: "仔细阅读建议的做题步骤是？", options: ["通读全文 → 做题 → 检查", "读首段和各段首句 → 看题干圈关键词 → 回原文定位 → 逐项比对排除", "先看选项 → 通读全文 → 直接选", "跳读找答案"], answer: 1, explain: "关键是「不读全文」+「逐项回原文核对」。凭印象选答案是仔细阅读失分最大的原因。" }
],
16: [
 { q: "四级作文最容易掉到最低档的原因是？", options: ["词汇太简单", "字数超了", "没有用倒装句", "跑题"], answer: 3, explain: "跑题直接掉到最低档，比语法错误严重得多。写之前必须花 5 分钟审题、列提纲，确认自己在回答题目问的问题。" },
 { q: "三段式的标准结构是？", options: ["引出话题+观点 → 论点+例证 → 总结+建议", "开头 → 结尾", "问题 → 答案", "总述 → 分述"], answer: 0, explain: "三段式是四级作文最稳的结构。阅卷时间只有几十秒，结构清晰（First / Moreover / In conclusion）本身就是得分点。" },
 { q: "作文里表示「首先」，最常用的高分表达是？", options: ["At last", "First and foremost", "In conclusion", "For example"], answer: 1, explain: "First and foremost 比 First 更书面；此外还有 What is more（而且）、Last but not least（最后但同样重要）。" },
 { q: "四级作文建议的字数是？", options: ["80-100 词", "200 词以上", "120-180 词", "不限字数"], answer: 2, explain: "低于 120 词要扣分，超过 180 词容易出错而且时间不够。写成 9-10 句、约 140 词最稳。" }
],
17: [
 { q: "书信的第一句应该写什么？", options: ["说明写信目的（I am writing to...）", "先寒暄天气", "先做自我介绍", "直接写落款"], answer: 0, explain: "四级书信固定套路：Dear + 称呼 → I am writing to... → 具体内容 → 期待回复 → Yours sincerely + 签名。" },
 { q: "通知（NOTICE）必须包含的三要素是？", options: ["标题、正文、签名", "时间、地点、要求", "称呼、落款、日期", "开头、中间、结尾"], answer: 1, explain: "NOTICE 居中，正文里必须写清「时间、地点、要求」，最后是落款单位和日期。三要素齐全就是中档以上。" },
 { q: "让作文「显得高级」最有效的办法是？", options: ["用最生僻的词", "写超长的句子", "句型有变化（从句、非谓语、倒装）并且用对", "多用感叹号"], answer: 2, explain: "阅卷看的是「句型有变化且正确」，不是词汇生僻。但前提是语法正确——错的长句比正确的短句更亏。" },
 { q: "关于「高级表达」的忠告是？", options: ["越多越好", "每一句都要用", "比正确性更重要", "先把正确率做到 90%，再追求句式变化"], answer: 3, explain: "一篇有 5 个语法错误的作文，加两个倒装句也不会得高分。先保证正确，再谈提升。" }
],
18: [
 { q: "「应该采取措施保护传统文化」的最佳翻译思路是？", options: ["直译成 Should take measures...", "改成被动：Measures should be taken to protect traditional culture.", "逐字翻译成英文", "省略主语不写"], answer: 1, explain: "中文常有无主句，英文必须有主语。两种改法：改成被动，或者补一个主语（We should take measures...）。" },
 { q: "中文的「流水句」翻译成英文时应该？", options: ["照搬逗号连着写", "全部写成一句超长句", "断句，用分词、从句或 and 连接", "用分号连接"], answer: 2, explain: "中文用逗号一路写下去，英文必须断句并标明关系：分词短语、定语从句、and 并列、同位语等。" },
 { q: "翻译时遇到不会的文化词，最好的办法是？", options: ["空着不写", "直接写中文", "随便编一个英文词", "用拼音加简单解释"], answer: 3, explain: "比如「粽子」可以写 zongzi, a traditional Chinese food made of rice wrapped in leaves。阅卷看的是你有没有把意思传达出来。" },
 { q: "翻译前第一步应该做什么？", options: ["通读全段，定下全文的时态基调", "先查生词", "先写第一句", "直接逐字翻译"], answer: 0, explain: "讲历史用过去时，讲现状用现在时，讲发展变化用现在完成时。时态定错了，整段都会扣分。" }
],
19: [
 { q: "听力结束后，正确的做法是？", options: ["可以慢慢补涂答题卡", "有 5 分钟检查时间", "立刻收答题卡一，所以必须边听边涂", "可以先做阅读再回来涂"], answer: 2, explain: "听力播完马上收答题卡一，没有补涂时间。这是流程性失分，完全可以通过平时习惯避免。" },
 { q: "推荐的答题顺序是？", options: ["完全按试卷顺序", "选词填空先做", "翻译最先做", "仔细阅读 → 长篇匹配 → 翻译 → 选词填空"], answer: 3, explain: "按分值从高到低做。仔细阅读 142 分、长篇匹配 71 分、翻译 106.5 分，选词填空 35.5 分放最后。" },
 { q: "为什么把选词填空放在最后？", options: ["它 10 题只值 35.5 分，性价比最低", "它是最难的题", "它是最简单的题", "时间不够可以不做"], answer: 0, explain: "同样 10 分钟，花在仔细阅读上的收益是选词填空的 4 倍。时间不够时，牺牲它最划算。" },
 { q: "下面哪一项不属于限时模拟的正确要求？", options: ["用真题，不用模拟题", "用模拟题代替真题", "完整 125 分钟，中间不休息", "听力外放、一次过、不复听"], answer: 1, explain: "模拟题的难度和出题思路与真题差距很大，必须用真题。另外三项都是还原考场环境的关键。" }
],
20: [
 { q: "考前 3 天应该做什么？", options: ["做大量新题", "背新单词", "开始学新的语法点", "看错题本、背模板、做 1 套保持手感"], answer: 3, explain: "考前学新东西只会增加焦虑、挤掉已经记住的内容。这时候要做的是「把已知的再确认一遍」。" },
 { q: "错题复盘的四栏记录法是哪四栏？", options: ["题目信息、我选了什么、错因归类、下次怎么做", "日期、分数、时长、心情", "单词、短语、句子、段落", "听力、阅读、写作、翻译"], answer: 0, explain: "关键在「错因归类」这一栏——把错误归到四类里，才能看出自己该补哪里。" },
 { q: "错题错因通常归为哪四类？", options: ["难、中、易、蒙", "没定位到 / 词汇不认识 / 语气判断错 / 时间不够", "听力、阅读、写作、翻译", "粗心、不会、没时间、没看清"], answer: 1, explain: "归到这四类以后，一周统计下来你会发现错误高度集中在某一两类——那就是提分方向。" },
 { q: "如果错题统计发现「没定位到」最多，应该重点练？", options: ["背更多单词", "练听力", "关键词定位（先圈题干名词，再回原文找原句）", "背写作模板"], answer: 2, explain: "不同错因对应不同训练。定位问题要靠「圈关键词 + 回原文核对」这个动作反复练，而不是继续背单词。" }
]
};
