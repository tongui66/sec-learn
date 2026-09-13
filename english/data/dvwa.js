// 英语四级 · 实战演练（10 组迷你真题）
// 用法：先限时自己做，写完再看「你应该看到什么」里的解析。
var DVWA = [
{
 title:"实战 1 · 选词填空（限时 7 分钟）",
 meta:"难度 ★★☆　题量 10 空　建议用时 7 分钟",
 goal:"用「先标词性、后判空位」的方法完成一组选词填空。",
 chapters:"对应第 3 章（构词法）、第 5 章（选词填空）",
 code:`Directions: Fill in each blank with one word from the list.

  A) available   B) benefit    C) carefully  D) challenge
  E) conscious   F) contribute G) essential  H) firmly
  I) gradually   J) influence  K) limited    L) obviously
  M) participate N) practical  O) recently

Many students today are 1)______ of the importance of
exercise, but few of them actually 2)______ in physical
activities regularly. A recent survey shows that only a
3)______ number of college students work out more than
three times a week.

Researchers point out that regular exercise can 4)______
greatly to both physical and mental health. It is
5)______ for students to develop a habit of exercising,
since a healthy body is the 6)______ basis for academic
success.

Physical education courses are 7)______ to all students
on campus. However, many students 8)______ choose to
skip them and spend the time on their phones. Experts
9)______ this trend, warning that it may have a
negative 10)______ on students' long-term health.`,
 expect:["<b>1) E conscious</b> —— be conscious of 固定搭配「意识到」。be 动词后面要形容词。",
"<b>2) M participate</b> —— participate in 固定搭配「参加」。主语 they 后面缺谓语，用动词原形。",
"<b>3) K limited</b> —— a limited number of「数量有限的」。修饰名词 number 需要形容词。",
"<b>4) F contribute</b> —— contribute to「有助于」。情态动词 can 后面跟动词原形。",
"<b>5) G essential</b> —— It is essential for sb. to do sth.「对某人来说做某事是必要的」。",
"<b>6) N practical</b> —— the practical basis for...「…的实际基础」。<b>空格在 the 和 basis 之间，修饰名词 → 必须用形容词</b>（firmly 是副词，不能填这里）。",
"<b>7) A available</b> —— be available to sb.「对某人开放、可用」。",
"<b>8) L obviously</b> —— 修饰动词 choose，需要副词。",
"<b>9) D challenge</b> —— 缺谓语动词，experts challenge this trend「专家质疑这一趋势」。分词 warning 提示后面是「专家的看法」。",
"<b>10) J influence</b> —— a negative influence on「对…的负面影响」，固定搭配。",
"<b>这道题的五个干扰项是：B benefit、C carefully、H firmly、I gradually、O recently。</b>注意——<b>C、H、I、O 全都是副词，而全文只有第 8 空需要副词。</b>「副词选项远多于副词空位」是选词填空最常见的设题方式：<b>只要你先把词性标出来，这 4 个副词里只有一个可能被选中。</b>",
"<b>训练结论：</b>这道题里 10 个空，<b>有 6 个是「先判词性就能锁定」的</b>（1、3、5、6、7、8），剩下 4 个才需要看搭配和语义。<b>这就是第 5 章说的「先词性、后词义」为什么能省一半时间。</b>"],
 undo:"如果 7 分钟做不完，说明词性标注还不够快。回去做训练 9，先只练「给 15 个选项标词性」。",
 why:"选词填空不考理解，只考「词性 + 搭配」两个判断。<b>你刚才体验的正是它的全部难点：副词多、形容词少、动词形式要统一。</b>",
 tip:"考场上这一题<b>放最后做</b>，7 分钟到点就全填满走人。"
},
{
 title:"实战 2 · 长篇阅读匹配（限时 12 分钟）",
 meta:"难度 ★★☆　题量 5 句　建议用时 6-8 分钟",
 goal:"练习「圈关键词 → 扫原文 → 认同义替换」的定位法。",
 chapters:"对应第 14 章（长篇阅读匹配）",
 code:`Directions: Match each statement with the section it comes from.

  A) Sleep researchers have long known that the human
     body follows a natural 24-hour cycle, known as the
     circadian rhythm. When this cycle is disturbed, the
     consequences go far beyond feeling tired.

  B) One of the most common causes of disturbed sleep
     among young people is the use of electronic devices
     before bedtime. The blue light emitted by screens
     tells the brain that it is still daytime.

  C) Interestingly, some studies suggest that the content
     we consume matters as much as the light itself.
     Anxious messages and endless scrolling keep the mind
     active long after the screen is turned off.

  D) Employers have begun to take notice. Several large
     companies now offer flexible working hours, allowing
     staff to start later if they have slept poorly.

  E) The economic cost is significant. Researchers
     estimate that sleep deprivation reduces productivity
     by up to 20 percent, costing billions every year.

  F) What can individuals do? Sleep experts recommend a
     simple rule: keep phones out of the bedroom, and
     establish a fixed bedtime that does not change at
     weekends.

Statements:
  46. Poor sleep may reduce how much work employees
      can get done.                        → ______
  47. Some companies now let workers begin their day
      at a later time.                     → ______
  48. The things people read on their phones may
      affect sleep more than the light.    → ______
  49. Experts advise keeping a regular sleep schedule
      even on weekends.                    → ______
  50. Disruption of the body's natural cycle has
      serious effects.                     → ______`,
 expect:["<b>46 → E</b>　题干 reduce how much work employees can get done ↔ 原文 reduces productivity。",
"<b>47 → D</b>　题干 let workers begin their day at a later time ↔ 原文 allow staff to start later。",
"<b>48 → C</b>　题干 the things people read ↔ 原文 the content we consume；may affect sleep more than the light ↔ matters as much as the light itself。",
"<b>49 → F</b>　题干 keeping a regular sleep schedule even on weekends ↔ 原文 a fixed bedtime that does not change at weekends。",
"<b>50 → A</b>　题干 disruption of the body's natural cycle ↔ 原文 this cycle is disturbed；serious effects ↔ consequences go far beyond feeling tired。",
"<b>训练重点：这 5 题里，没有一题的题干和原文是完全一样的词。</b>全都是同义替换（productivity ↔ how much work can get done；start later ↔ begin the day at a later time）。<b>这就是长篇阅读的真面目。</b>",
"<b>B 段没有被选</b>——这是正常的，15 段对 10 题时一定有段落用不到。"],
 undo:"如果你是按段落顺序逐段翻译的，说明方法不对。改回「先看题干圈关键词，再回原文扫」。",
 why:"长篇阅读是四级里<b>最不依赖英语水平、最依赖方法</b>的题型。<b>你今天体验的「题干词和原文词完全不同、但意思一样」，就是它的核心考点。</b>",
 tip:"把今天遇到的同义替换抄下来（4 组），<b>做满 50 组以后，你的定位速度会翻倍。</b>"
},
{
 title:"实战 3 · 仔细阅读 Passage 1（限时 9 分钟）",
 meta:"难度 ★★★　题量 5 题　建议用时 9 分钟",
 goal:"练习「题干定位 + 干扰项排除」，体验 14.2 分一题的题型。",
 chapters:"对应第 15 章（仔细阅读）",
 code:`Many people assume that creativity is a gift that
some are born with and others are not. Yet a growing
body of research suggests that creativity is less a
matter of natural talent than of habit and environment.

Psychologist Teresa Amabile has spent decades studying
what she calls the "creativity gap" — the distance
between what people are capable of and what they
actually produce. Her conclusion is striking: the
single biggest obstacle is not a lack of ideas but
fear of judgment. When people believe their work will
be evaluated harshly, they produce fewer and less
original ideas.

This finding has practical implications for schools
and companies. In one experiment, teams that were told
their ideas would be judged on originality generated
twice as many workable proposals as teams that were
told their work would be assessed by senior managers.
The difference was not talent, but the perception of
safety.

Amabile argues that organizations should therefore
focus less on hiring "creative people" and more on
creating conditions in which ordinary people feel
safe enough to take risks. That, she says, is where
innovation actually comes from.

1. What is commonly believed about creativity?
   A) It depends mainly on habit.
   B) It is a natural gift that only some people have.
   C) It can be taught in any school.
   D) It is more common in companies than in schools.

2. What does Amabile consider the biggest obstacle
   to creativity?
   A) A shortage of new ideas.
   B) Lack of professional training.
   C) Fear of being judged harshly.
   D) Too much pressure from senior managers.

3. What did the experiment mentioned in Para. 3 show?
   A) Teams judged on originality produced far more
      workable ideas.
   B) Senior managers generated the best proposals.
   C) Talent was the key factor in performance.
   D) Teams performed better when they worked longer.

4. What does Amabile suggest organizations should do?
   A) Hire only highly creative people.
   B) Assess employees more strictly.
   C) Reduce the number of team members.
   D) Create conditions where people feel safe.

5. What can be inferred about innovation?
   A) It always comes from gifted individuals.
   B) It can be encouraged by the right environment.
   C) It is impossible to measure.
   D) It depends mainly on financial investment.`,
 expect:["<b>1) B</b>　定位第 1 段第 1 句：creativity is a gift that some are born with。题干 commonly believed 对应原文 Many people assume。",
"<b>2) C</b>　定位第 2 段：the single biggest obstacle is not a lack of ideas but fear of judgment。<b>注意 A 是「以偏概全 / 正话反说」——原文明确说不是缺少想法。</b>",
"<b>3) A</b>　定位第 3 段：generated twice as many workable proposals。<b>twice as many = far more，这是同义替换。</b>C 是「偷换概念」——原文说 The difference was not talent。",
"<b>4) D</b>　定位第 4 段：creating conditions in which ordinary people feel safe enough to take risks。",
"<b>5) B</b>　推断题。原文最后一句说 innovation actually comes from 那些条件，所以可以推出「合适的环境能催生创新」。<b>A 和原文相反；C、D 是「无中生有」。</b>",
"<b>四类干扰项在本题中的体现：</b><br>· 偷换概念：第 3 题 C（把 talent 说成关键）<br>· 以偏概全 / 正话反说：第 2 题 A（原文明确否定）<br>· 无中生有：第 5 题 C、D<br>· 过度推断：第 5 题 A<br><b>把这四类认熟，正确率会明显提高。</b>"],
 undo:"如果 9 分钟做不完，先把速度放一边，<b>练「每题都回原文划出定位句」</b>。定位准了，速度自然会来。",
 why:"仔细阅读每题 14.2 分。<b>你刚才做的 5 题价值 71 分——比整块选词填空（35.5 分）还多一倍。</b>这就是为什么要把时间优先给这里。",
 tip:"<b>做对的题也要定位。</b>很多人「蒙对」了却不知道，下次同样的题还是错。"
},
{
 title:"实战 4 · 仔细阅读 Passage 2（态度与推断）",
 meta:"难度 ★★★　题量 5 题　建议用时 9 分钟",
 goal:"专练最容易失分的两类题：作者态度题和推断题。",
 chapters:"对应第 15 章（仔细阅读 15.2、15.3 节）",
 code:`Remote work was once seen as a temporary
arrangement, a compromise for employees who could not
come to the office. That view has largely disappeared.
Today, surveys suggest that a majority of office
workers would prefer to work from home at least part
of the week, and many would change jobs to do so.

The benefits for employees are fairly clear: no
commuting, more control over their schedule, and
often a quieter environment for concentrated work.
Yet the picture is not entirely positive. Several
studies have found that remote workers report
feeling more isolated, and that informal learning —
the kind that happens when you overhear a colleague
solving a problem — largely disappears.

Employers, meanwhile, face their own dilemma. On one
hand, remote work reduces the cost of office space.
On the other, managers worry that innovation depends
on unplanned conversations, which are hard to
reproduce online.

It would be a mistake, however, to treat this as a
simple choice between two extremes. The most
successful arrangements appear to be hybrid ones, in
which employees spend two or three days in the office
and the remainder at home. Such arrangements preserve
the flexibility that workers value while keeping
enough face-to-face contact to sustain team
relationships.

1. What was the traditional attitude towards remote
   work?
   A) It was considered a temporary compromise.
   B) It was regarded as the future of work.
   C) It was limited to senior managers.
   D) It was popular among most employees.

2. What is mentioned as a disadvantage of remote work
   for employees?
   A) Higher commuting costs.
   B) Less control over their schedule.
   C) Feeling more isolated.
   D) A noisier working environment.

3. What is employers' main concern about remote work?
   A) It increases the cost of office space.
   B) It may reduce innovation based on unplanned talks.
   C) It makes employees work too many hours.
   D) It is difficult to measure productivity.

4. What is the author's attitude towards hybrid
   arrangements?
   A) Strongly critical.
   B) Completely indifferent.
   C) Generally supportive.
   D) Cautious but hostile.

5. What can be inferred from the passage?
   A) Remote work will replace office work entirely.
   B) Employees prefer working alone to working in teams.
   C) Office space is the most important consideration.
   D) A balance between flexibility and contact is
      probably the best solution.`,
 expect:["<b>1) A</b>　定位第 1 段第 1 句：Remote work was once seen as a temporary arrangement, a compromise。",
"<b>2) C</b>　定位第 2 段：remote workers report feeling more isolated。<b>A、B、D 都是「正话反说」——原文说 no commuting、more control、quieter environment，选项全反了。</b>",
"<b>3) B</b>　定位第 3 段：managers worry that innovation depends on unplanned conversations。<b>A 是「正话反说」——原文说 reduces the cost。</b>",
"<b>4) C</b>　态度题。第 4 段的措辞是：<b>It would be a mistake</b> to treat this as a simple choice（否定极端），<b>the most successful</b> arrangements appear to be hybrid（正面评价），preserve the flexibility / sustain team relationships（褒义）。<b>整体是「支持、但不是狂热支持」→ generally supportive。</b>",
"<b>5) D</b>　推断题。全文结论就是「混合模式最好」，D 是它的复述。<b>A 是过度推断（原文说不能二元对立）；B 与原文相反；C 是「以偏概全」（成本只是其中一点）。</b>",
"<b>态度题的判断方法：找评价性的形容词和副词。</b>本题里：mistake（否定极端）、most successful（肯定）、preserve（褒义）、sustain（褒义）。<b>四个词一定性，答案就出来了——而且绝不会是 extreme 的选项。</b>"],
 undo:"态度题做错，通常是没找到评价性词汇。<b>回原文把所有形容词、副词圈出来，态度就藏在那里。</b>",
 why:"态度题和推断题是仔细阅读里最容易失分的两类，因为它们不靠「找原句」能直接得出答案。<b>态度看措辞，推断走一步——这两条记住就够。</b>",
 tip:"<b>四级阅读里作者的态度几乎不会走极端。</b>如果两个选项分别是「强烈批评」和「总体支持」，而有一项是「完全漠不关心」——后者通常是错的，因为作者写了这么多字，不可能漠不关心。"
},
{
 title:"实战 5 · 短篇新闻（文字稿版 + 3 题）",
 meta:"难度 ★★☆　题量 3 题　建议用时 4 分钟",
 goal:"练「抓第一句主旨 + 抓数字关系」的新闻听力打法。",
 chapters:"对应第 12 章（短篇新闻）",
 code:`【训练说明】
先用「朗读」的方式读一遍下面这段新闻（或者找一段真题音频），
然后回答 3 个问题。听完/读完后不要回头看原文，先做题。

A new study published on Monday suggests that
employees who take short breaks during the working
day are significantly more productive than those who
work without stopping. The research, conducted by a
team at a British university, followed 800 office
workers over a period of six months.

Researchers found that participants who took a
five-minute break every hour completed about 15
percent more tasks than those who worked continuously.
The study also noted that the type of break mattered:
workers who used their breaks to look at their phones
showed no improvement, while those who walked around
or talked to colleagues performed noticeably better.

The team's lead author said the findings should
encourage employers to reconsider the value of short,
frequent breaks. "Many companies still treat breaks
as lost time," she said. "Our data suggest the
opposite — breaks may be an investment."

1. What does the new study suggest?
   A) Longer working hours lead to better results.
   B) Short breaks can make employees more productive.
   C) Office workers should work without stopping.
   D) Employers should reduce the number of tasks.

2. What did the study find about the type of break?
   A) All breaks improved performance equally.
   B) Breaks spent on phones were the most effective.
   C) Walking or talking with colleagues worked better.
   D) The type of break made no difference.

3. What did the lead author say about breaks?
   A) They should be seen as an investment.
   B) They are a waste of company time.
   C) They should be longer than five minutes.
   D) They are only useful for senior staff.`,
 expect:["<b>1) B</b>　第一句就是主旨：employees who take short breaks ... are significantly more productive。<b>听力新闻的第一句永远是主旨句，也永远出题。</b>",
"<b>2) C</b>　原文：workers who used their breaks to look at their phones showed no improvement, while those who walked around or talked to colleagues performed noticeably better。<b>walked around or talked to colleagues = walking or talking with colleagues，原词复现 + 简单替换。</b>",
"<b>3) A</b>　原文引语：breaks may be an investment。<b>这是「原词复现」——视听一致的典型。</b>",
"<b>数字关系要注意：</b>原文说 completed about 15 percent more tasks（多完成 15%），而不是「15% 的时间」或「15 个人」。<b>听力数字题一定要听清「数字后面跟的是什么」。</b>",
"<b>本题的训练重点：</b>3 道题全部能在原文找到明确对应，<b>没有一道需要推理</b>——这就是短篇新闻的特点。<b>听懂 = 得分。</b>"],
 undo:"如果第一遍听不懂，先不要看文字稿，再听一遍；两遍都听不懂再看稿，<b>然后找出「是哪个词卡住了」</b>。",
 why:"短篇新闻是听力里最「直白」的题型：<b>开头是主旨、答案靠视听一致、数字要听清关系</b>。这三条掌握了，7 道题能稳拿 4-5 道。",
 tip:"<b>用真题音频练这一篇效果最好。</b>本页给的是文字稿，请配合真题听力音频使用（真题资源见「速查」页的备考资源）。"
},
{
 title:"实战 6 · 长对话（文字稿版 + 4 题）",
 meta:"难度 ★★★　题量 4 题　建议用时 5 分钟",
 goal:"练「抓问答、转折、建议」的长对话定位法。",
 chapters:"对应第 13 章（长对话与听力篇章）",
 code:`【训练说明】先读一遍对话（或听真题音频），然后做题。

M: Hi Sarah. You look tired. Did you stay up late again?
W: Don't remind me. I was up until two o'clock finishing
   the report. I thought I'd get it done in an hour, but
   the data just wouldn't make sense.
M: You should really stop leaving things to the last
   minute. Why not set a deadline two days before the
   real one?
W: I know, I know. It's just that I work better under
   pressure. At least I thought I did. To be honest,
   by midnight I couldn't even think straight.
M: Have you considered talking to the manager about the
   workload? Three reports a week seems a lot for one
   person.
W: I did mention it last month, but nothing changed.
   Actually, I've been thinking about applying for a
   transfer to the research team. Their pace is slower.
M: But wouldn't that mean giving up the projects you
   enjoy? You've always said you loved field work.
W: That's the problem. I'd miss it. Maybe I should just
   try the deadline thing first and see if it helps.

1. Why does the woman look tired?
   A) She has been ill.
   B) She stayed up late finishing a report.
   C) She traveled for work.
   D) She had an argument with her manager.

2. What does the man suggest the woman do?
   A) Talk to the manager immediately.
   B) Ask for fewer reports.
   C) Set a deadline earlier than the real one.
   D) Take a few days off.

3. What has the woman already tried?
   A) Applying for a transfer.
   B) Mentioning the workload to her manager.
   C) Working from home.
   D) Asking a colleague for help.

4. What will the woman probably do?
   A) Apply for a transfer right away.
   B) Leave the company.
   C) Give up field work.
   D) Try setting an earlier deadline first.`,
 expect:["<b>1) B</b>　原文：I was up until two o'clock finishing the report。",
"<b>2) C</b>　<b>建议句是出题点：</b>Why not set a deadline two days before the real one? Why not 就是 suggestion 的标志词。",
"<b>3) B</b>　原文：I did mention it last month, but nothing changed。<b>注意「already tried」= did mention（过去已经做过）</b>，而 applying for a transfer 只是「一直在考虑」（I've been thinking about），还没做——<b>A 是典型的「时态陷阱」。</b>",
"<b>4) D</b>　原文最后：Maybe I should just try the deadline thing first and see if it helps。<b>对话的最后一句话常是答案</b>，而且常常是「先试试某个办法」。",
"<b>长对话的三个出题标志（本题全都出现了）：</b><br>① <b>建议句</b>：Why not... / You should... / Have you considered...（第 2 题）<br>② <b>转折后</b>：but nothing changed / Actually...（第 3 题）<br>③ <b>结尾句</b>：Maybe I should just...（第 4 题）",
"<b>另外注意「原词陷阱」：</b>第 3 题 A 选项 applying for a transfer 在原文原样出现过，但它是「还没做」的事。<b>听到原词别急着选，先看时态和语气。</b>"],
 undo:"如果第 3 题选错了，说明「已经做」和「打算做」没分清。回去看第 7 章时态部分。",
 why:"长对话是听力里<b>最有规律</b>的题型：问答处、转折后、建议句、结尾句——四个位置几乎覆盖所有题目。<b>把「听位置」练成习惯，比练「听懂每个词」有效得多。</b>",
 tip:"长对话里<b>第二个人的回答</b>往往是答案所在。听的时候特别留意 W 说了什么。"
},
{
 title:"实战 7 · 写作：议论文（限时 30 分钟）",
 meta:"难度 ★★★　题量 1 篇　建议用时 30 分钟",
 goal:"用三段式模板在 30 分钟内写出 120-180 词的作文，并自己批改一遍。",
 chapters:"对应第 16 章（议论文三段式）",
 code:`Directions: Write an essay on the importance of
developing good time-management skills for college
students. You should write at least 120 words but no
more than 180 words.

【限时 30 分钟，按这个节奏来】
  0-5 分钟：审题 + 列提纲（三个关键词写在草稿上）
  5-25 分钟：写正文
  25-30 分钟：检查（主谓一致 / 时态 / 冠词 / 拼写 / 字数）

【提纲示范】
  第一段：时间管理对大学生的意义（引出话题 + 观点）
  第二段：为什么重要 —— 论点 + 例证
  第三段：怎么做 —— 建议 + 总结

【参考作文（约 150 词）】

Time management is one of the most important skills
for college students. With more freedom and fewer
fixed schedules than in high school, students who
cannot manage their time well often end up
overwhelmed by deadlines.

First and foremost, good time-management skills help
students reduce stress. For example, a student who
begins a term paper three weeks before the deadline
will feel far more confident than one who starts the
night before. Moreover, effective time management
allows students to balance study, exercise and social
life, which contributes to both physical and mental
health.

In conclusion, learning to manage time is not merely
a study skill; it is a life skill. It is high time
that students took action to plan their days carefully
and set realistic goals. Only in this way can they
make the most of their college years.`,
 expect:["<b>结构分（拿稳）：</b>Nowadays/One of the most... → First and foremost + For example → Moreover → In conclusion / It is high time that... / Only in this way can...",
"<b>句型分：</b>① 定语从句 who cannot manage their time well　② 非限制性从句 which contributes to　③ 强调句 not merely... it is　④ 虚拟语气 It is high time that... took　⑤ 倒装 Only in this way can they...<b>正好 5 个，不多不少。</b>",
"<b>字数：</b>约 150 词，落在 120-180 的安全区间。",
"<b>自改检查清单（写完后逐条对照）：</b><br>□ 主谓一致：students who cannot... end up（复数一致）<br>□ 时态：全文一般现在时，没有乱跳<br>□ 冠词：a student / the deadline<br>□ 拼写：overwhelmed、deadline、realistic<br>□ 切题：全文都在讲「时间管理对大学生的重要性」<br>□ 字数：≥120",
"<b>这篇能拿中高档的原因：</b>结构清楚、每段有自己的内容（不是纯模板）、句型有变化但都不难、没有明显语法错误。<b>这正是四级写作的得分逻辑——切题 + 结构 + 正确。</b>"],
 undo:"如果 30 分钟写不完，先把模板句背到不假思索，这样审题后能立刻动笔，省下的时间就是你的。",
 why:"写作是<b>短期提分最快</b>的板块：结构分和句型分占了大头，而它们都可以靠背模板 + 刻意练习拿到。<b>一篇 150 词的作文，把检查清单走一遍，就能避开 80% 的扣分点。</b>",
 tip:"<b>把参考作文里的 5 个句型抄下来，各造一句自己的话。</b>这 5 个句型可以套用到任何议论文题目上。"
},
{
 title:"实战 8 · 写作：应用文（书信）",
 meta:"难度 ★★☆　题量 1 篇　建议用时 25 分钟",
 goal:"掌握书信的固定格式，写出一封结构完整的建议信。",
 chapters:"对应第 17 章（应用文）",
 code:`Directions: Suppose you are Li Ming, a student who has
just finished a term of online courses. Write a letter
to your teacher, Professor Wang, to suggest some
improvements for future online courses. You should
write at least 120 words but no more than 180 words.

【格式骨架（背下来）】
  Dear Professor Wang,
  ───────────────────────────────
  ① 说明写信目的：I am writing to ...
  ② 具体内容：First... / Second... / Finally...
  ③ 期待与感谢：I would appreciate it if ...
  ───────────────────────────────
  Yours sincerely,
  Li Ming

【参考作文（约 145 词）】

Dear Professor Wang,

  I am writing to offer some suggestions on the online
courses you taught this term. I have benefited a great
deal from your lectures, and I hope the following
points may be helpful for future courses.

  First, it would be helpful if the video lectures
could be shortened to about twenty minutes each.
It is difficult to stay focused when a single video
lasts over an hour. Second, more opportunities for
discussion would be welcome. Students often have
questions that are hard to express in written form.
Finally, uploading the slides before each class would
allow us to prepare in advance.

  I would appreciate it if you could take my
suggestions into consideration. Thank you again for
your patience and support throughout the term.

Yours sincerely,
Li Ming`,
 expect:["<b>格式分（本题最容易拿的分）：</b>Dear + 称呼（顶格，逗号）→ 正文 → Yours sincerely, → 签名。<b>缺任何一项都要扣分。</b>",
"<b>内容分：三条建议必须具体</b>（缩短视频、增加讨论、提前发课件），<b>不能只写 make the course better 这种空话。</b>",
"<b>语气分：建议信用 I would appreciate it if... / it would be helpful if...</b> 这类委婉表达，不用 You must / You should。<b>这是「得体」的得分点。</b>",
"<b>常见错误提醒：</b><br>❌ Dear Professor Wang:（应用逗号，不是冒号）<br>❌ Yours sincerely 后面没有逗号<br>❌ 忘记写签名 Li Ming<br>❌ 开头第一句没写清楚写信目的",
"<b>字数：</b>约 145 词 ✓（应用文同样要求 120-180 词）"],
 undo:"格式记不住就先背骨架（Dear / I am writing to / 正文 / I would appreciate it if / Yours sincerely）。<b>骨架写对，格式分就拿到了。</b>",
 why:"应用文比议论文<b>更好写</b>，因为格式固定、语言套路化。<b>把书信、通知、报告三种格式各练一遍，这一块就是稳分题。</b>",
 tip:"考场上如果时间紧，<b>先写格式骨架再填内容</b>——因为格式分是「有或没有」，而内容分是「多或少」。"
},
{
 title:"实战 9 · 翻译：中国文化（限时 25 分钟）",
 meta:"难度 ★★★　题量 1 段　建议用时 25 分钟",
 goal:"练「无主句改被动 + 流水句断句 + 文化词处理」三大技巧。",
 chapters:"对应第 18 章（汉译英）",
 code:`Directions: Translate the following passage into English.
You should write your answer on Answer Sheet 2.

  中国的传统节日大多与农业有关，反映了人们对自然的敬畏。
  春节是最重要的节日，家人无论多忙都会聚在一起吃年夜饭。
  近年来，越来越多的年轻人开始重新重视这些传统节日，
  这不仅是对文化的传承，也让家庭关系更加紧密。

【五步法】
  ① 通读全段 → 判断时态：讲传统（现在时）+ 讲近年变化（现在完成时）
  ② 断句 → 三句中文 ≈ 三到四句英文
  ③ 找主干 → 每个句子先确定「谁 + 做什么」
  ④ 补修饰 → 用分词、从句、介词短语挂上去
  ⑤ 检查 → 主谓一致 / 时态 / 冠词 / 单复数

【参考译文】

  Most traditional Chinese festivals are related to
agriculture, reflecting people's respect for nature.
The Spring Festival is the most important one, and
family members will gather together for the New
Year's Eve dinner no matter how busy they are.

  In recent years, an increasing number of young
people have begun to value these traditional
festivals again. This is not only a way of passing
on culture, but also helps to strengthen family
relationships.`,
 expect:["<b>第 1 句：无主句 + 流水句的处理</b><br>中文「反映了人们对自然的敬畏」没有主语 → 用分词 <b>reflecting</b> 挂到主句上（这是最地道的处理，比 and it reflects 更简洁）。",
"<b>第 2 句：文化词 + 让步结构</b><br>「春节」= the Spring Festival；「年夜饭」= the New Year's Eve dinner；「无论多忙」= no matter how busy they are（让步状语从句）。",
"<b>第 3 句：时态是本题的关键</b><br>「近年来」→ <b>In recent years</b> → 必须用<b>现在完成时</b> have begun。很多人写成 began，直接扣分。",
"<b>「越来越多」的三种译法：</b>an increasing number of / more and more / a growing number of。<b>推荐第一种，更书面。</b>",
"<b>第 4 句：「这不仅…也让…」</b><br>not only... but also...。注意 not only 放在句首时要倒装，但这里它在句子中间，<b>不需要倒装</b>。",
"<b>常见扣分点：</b><br>❌ 忘记时态：In recent years, more young people began...<br>❌ 逐字翻译：「反映了」写成 reflected（时态错）<br>❌ 漏译「重新」：begin to value 少了 again<br>❌ 中式英语：「让家庭关系更加紧密」写成 let family relationship more close"],
 undo:"如果无主句处理不顺手，先只练一种改法：<b>把它改成被动语态</b>。Measures should be taken... 这种最保险。",
 why:"翻译是<b>按句给分</b>的。<b>每句都写、每句基本正确</b>，就能拿到大部分分数。<b>而本题的三个考点（无主句、流水句、时态）覆盖了四级翻译 80% 的难点。</b>",
 tip:"<b>遇到不会的文化词，用「拼音 + 简单解释」代替</b>，比如「饺子」可以写 jiaozi, a traditional Chinese food。阅卷看的是有没有传达意思。"
},
{
 title:"实战 10 · 翻译：社会发展（限时 25 分钟）",
 meta:"难度 ★★★　题量 1 段　建议用时 25 分钟",
 goal:"练「数据表达 + 因果关系 + 建议句」的翻译套路。",
 chapters:"对应第 18 章（汉译英）、第 19 章（实战节奏）",
 code:`Directions: Translate the following passage into English.

  过去十年，中国的高速铁路发展迅速，运营里程已经超过
  四万公里，居世界第一。高铁不仅大大缩短了城市之间的
  旅行时间，也促进了沿线地区的经济发展。专家认为，
  未来高铁网络还将继续扩展，为更多人提供便利的出行方式。

【五步法】
  ① 时态：讲过去十年（现在完成时）+ 讲未来（一般将来时）
  ② 断句：三句中文 → 三句英文
  ③ 主干：铁路发展 / 高铁缩短并促进 / 专家认为
  ④ 修饰：用分词、同位语、宾语从句
  ⑤ 检查

【参考译文】

  Over the past decade, China's high-speed rail has
developed rapidly, with its operating length exceeding
40,000 kilometers — the longest in the world.

  High-speed rail has not only greatly shortened the
travel time between cities, but also promoted the
economic development of the regions along the lines.

  Experts believe that the high-speed rail network
will continue to expand in the future, providing more
convenient travel options for more people.`,
 expect:["<b>第 1 句：「过去十年」→ Over the past decade → 现在完成时</b><br>has developed rapidly。<b>「运营里程已经超过」用 with 复合结构</b>（with its operating length exceeding）比另起一句更简洁。",
"<b>「居世界第一」的三种译法：</b><br>· the longest in the world（最简洁，推荐）<br>· ranking first in the world<br>· which ranks first in the world",
"<b>第 2 句：not only... but also 是固定加分句型</b><br>「缩短了」和「促进了」都是现在完成的延续 → has not only shortened... but also promoted...。<b>注意 not only 后面接的部分要和 but also 后面结构对称。</b>",
"<b>第 3 句：宾语从句 + 分词</b><br>Experts believe that...（宾语从句）；providing more convenient travel options（现在分词作结果状语）。",
"<b>数据表达要注意：</b>「四万公里」= 40,000 kilometers（不是 40000 km 这种口语写法，最好写全）。<b>数字后面一定要带单位。</b>",
"<b>常见扣分点：</b><br>❌ 时态：In the past decade, China's high-speed rail developed...（该用现在完成）<br>❌ 漏译「沿线地区」：the regions along the lines<br>❌ 「为更多人提供」语序错误<br>❌ 中式英语：「居世界第一」写成 lives in the world first"],
 undo:"因果和递进句式写不顺，就先只用一种：<b>not only... but also...</b>。它是四级翻译里最万能也最安全的加分句型。",
 why:"社会发展类翻译是四级的高频题材，<b>考点高度固定：时态（现在完成）+ 数据表达 + not only...but also + 宾语从句</b>。<b>把这四个背熟，这类题就变成了填空题。</b>",
 tip:"<b>翻译和写作一样：宁可写简单句。</b>一句正确的简单句拿满分，一句错误的长难句可能一分不得。先把「每句都对」做到，再考虑句式变化。"
}
];
