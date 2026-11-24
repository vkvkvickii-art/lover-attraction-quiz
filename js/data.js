/**
 * 《测测你最容易吸引什么样的恋人》核心配置、15道精选大白话题库与10类恋人档案
 * 六大个人魅力与情感磁场维度：
 * - zhiyu   (温柔治愈力): 柔软包容、让人卸下防备的情绪温度
 * - duli    (清醒独立感): 边界清晰、不黏不作、自在松弛的酷感
 * - xianhuo (热烈生命力): 鲜活有趣、爱笑有梗、感染力十足的能量
 * - zhixing (智性神秘感): 有主见有深度、让人忍不住想探究的气场
 * - tashi   (笃定安全感): 靠谱实在、情绪稳定、把日子过踏实的定力
 * - langman (浪漫共情力): 细腻敏锐、懂氛围感、能捕捉微小情绪的灵气
 */

const QUIZ_CONFIG = {
  // 默认指向你的 GitHub Pages 线上公开测试地址
  defaultShareUrl: 'https://vkvkvickii-art.github.io/lover-attraction-quiz/'
};

const DIMENSIONS = [
  { key: 'zhiyu',   name: '治愈', fullName: '温柔治愈力', desc: '让人感到被包容、愿意卸下防备的情绪温度' },
  { key: 'duli',    name: '独立', fullName: '清醒独立感', desc: '不黏人、不内耗，保有自我节奏的松弛边界' },
  { key: 'xianhuo', name: '鲜活', fullName: '热烈生命力', desc: '有趣有梗、真诚外放，能瞬间点亮气氛的活力' },
  { key: 'zhixing', name: '智性', fullName: '智性神秘感', desc: '看事通透、有想法有层次，让人越品越上头的深度' },
  { key: 'tashi',   name: '踏实', fullName: '笃定安全感', desc: '情绪稳定、说到做到，让人无比安心的靠谱感' },
  { key: 'langman', name: '浪漫', fullName: '浪漫共情力', desc: '细腻敏感、懂仪式感与弦外之音的灵魂共鸣力' }
];

const QUESTIONS = [
  // Part 01 · 聊天信号
  {
    id: 1,
    chapter: 'Part 01 · 聊天信号',
    question: '有好感的人半天没回你微信，结果你刷到他刚发了一条朋友圈，你第一反应是？',
    options: [
      { label: 'A', text: '行吧，直接把手机一扣干自己的事去，他不回我也绝不追着发', scores: { duli: 3, zhixing: 2, zhiyu: -2 } },
      { label: 'B', text: '反手在他朋友圈底下点个赞或者评论调侃一句：“抓获失踪人口！”', scores: { xianhuo: 3, duli: 1, zhixing: -2 } },
      { label: 'C', text: '心里有点小失落，会忍不住猜他是不是不想理我，但忍着不说', scores: { langman: 3, zhiyu: 2, duli: -3 } },
      { label: 'D', text: '没多想，可能人家随手发完就去忙了，等他空了自然会回', scores: { tashi: 3, zhiyu: 2, langman: -2 } }
    ]
  },
  {
    id: 2,
    chapter: 'Part 01 · 聊天信号',
    question: '平时跟喜欢的人微信闲聊，你的聊天画风更像哪一种？',
    options: [
      { label: 'A', text: '表情包大户 + 分享欲爆棚，路上看见只小猫都要拍给他看', scores: { xianhuo: 3, langman: 2, duli: -2 } },
      { label: 'B', text: '平时各忙各的不怎么刷屏，但一聊起来就能聊很深的话题，句句走心', scores: { zhixing: 3, duli: 3, xianhuo: -2 } },
      { label: 'C', text: '温柔捧场王，不管对方抛什么话都不会让他掉地上，情绪价值拉满', scores: { zhiyu: 3, tashi: 2, duli: -1 } },
      { label: 'D', text: '经常互甩搞笑视频和损人烂梗，聊着聊着就像在说相声', scores: { xianhuo: 3, duli: 1, langman: -3 } }
    ]
  },
  {
    id: 3,
    chapter: 'Part 01 · 聊天信号',
    question: '半夜十二点，你在朋友圈发了一首有点伤感或小众的歌，一般是因为？',
    options: [
      { label: 'A', text: '纯粹觉得前奏和旋律太绝了，大半夜刚好戳中那点微妙的氛围感', scores: { langman: 3, zhixing: 2, tashi: -1 } },
      { label: 'B', text: '其实心里藏了点心事，暗戳戳希望某个人看到能来问我一句怎么了', scores: { langman: 3, zhiyu: 2, duli: -3, tashi: -1 } },
      { label: 'C', text: '我几乎不干这事，半夜十二点要么在刷搞笑视频，要么早就睡着了', scores: { tashi: 3, duli: 2, langman: -3 } },
      { label: 'D', text: '白天装大人太累了，深夜留一点只有自己懂的小情绪透透气', scores: { zhixing: 3, duli: 2, xianhuo: -2 } }
    ]
  },

  // Part 02 · 社交气场
  {
    id: 4,
    chapter: 'Part 02 · 社交气场',
    question: '去参加一个有一半人都不认识的朋友聚会，你在局上通常是什么状态？',
    options: [
      { label: 'A', text: '热场小能手，没过半小时就能跟一桌子人加微信开玩笑了', scores: { xianhuo: 3, duli: 1, zhixing: -2 } },
      { label: 'B', text: '安安静静坐在边上吃东西，别人主动跟我聊就礼貌笑笑，不凑热闹', scores: { duli: 3, zhixing: 2, xianhuo: -3 } },
      { label: 'C', text: '默默递纸巾、倒水、照顾落单害羞的人，让大家坐着都不尴尬', scores: { zhiyu: 3, tashi: 2, duli: -1 } },
      { label: 'D', text: '挑一两个看着最有意思的人深聊，其他吵吵闹闹的局自动屏蔽', scores: { zhixing: 3, langman: 2, tashi: -2 } }
    ]
  },
  {
    id: 5,
    chapter: 'Part 02 · 社交气场',
    question: '跟你混熟了之后，朋友们最常说对你的“反差印象”是哪句？',
    options: [
      { label: 'A', text: '“刚认识以为你挺高冷不好惹，熟了发现你其实特好说话、超温柔！”', scores: { zhixing: 2, zhiyu: 2, duli: 2, xianhuo: -2 } },
      { label: 'B', text: '“看你平时大大咧咧没心没肺的，其实心思特别细，什么都懂！”', scores: { xianhuo: 3, langman: 2, tashi: -2 } },
      { label: 'C', text: '“以为你是个软萌乖乖牌，没想到遇到大事比谁都冷静有主见！”', scores: { zhiyu: 2, duli: 3, zhixing: 2 } },
      { label: 'D', text: '“你这人表里如一，刚认识觉得靠谱实在，处久了发现更靠谱！”', scores: { tashi: 3, zhiyu: 2, zhixing: -2, langman: -2 } }
    ]
  },
  {
    id: 6,
    chapter: 'Part 02 · 社交气场',
    question: '出门见有好感的人之前，你在穿搭和打扮上一般是什么路数？',
    options: [
      { label: 'A', text: '精心搭一套看似毫不费力、其实连香水味和发丝都算好的氛围感穿搭', scores: { langman: 3, zhixing: 2, tashi: -2 } },
      { label: 'B', text: '干净舒服最重要，穿自己平时最自在好看的那套，不硬凹造型', scores: { tashi: 3, duli: 2, langman: -2 } },
      { label: 'C', text: '走明艳元气或者很有辨识度的风格，让人老远一眼就能看到我', scores: { xianhuo: 3, duli: 1, zhiyu: -2 } },
      { label: 'D', text: '温柔亲切没攻击性的色系，看着就让人觉得软乎乎很好亲近', scores: { zhiyu: 3, langman: 1, duli: -2 } }
    ]
  },

  // Part 03 · 约会日常
  {
    id: 7,
    chapter: 'Part 03 · 约会日常',
    question: '跟暧昧对象第一次单独约会，下面四个安排你最喜欢哪个？',
    options: [
      { label: 'A', text: '吃完晚饭沿着江边或老街慢慢散步吹晚风，有一搭没一搭地聊天', scores: { langman: 3, zhiyu: 2, xianhuo: -1 } },
      { label: 'B', text: '一起去游乐园、密室、电玩城或者看脱口秀，边玩边闹绝对不冷场', scores: { xianhuo: 3, tashi: 1, zhixing: -2 } },
      { label: 'C', text: '找家安静有格调的小酒馆或独立书店咖啡馆，微醺着聊点走心话题', scores: { zhixing: 3, langman: 3, tashi: -2 } },
      { label: 'D', text: '去吃一家口碑超好的地道馆子，吃饱喝足顺便逛逛超市，自然又踏实', scores: { tashi: 3, zhiyu: 2, langman: -2 } }
    ]
  },
  {
    id: 8,
    chapter: 'Part 03 · 约会日常',
    question: '两个人一起出去旅游，你更喜欢什么样的分工模式？',
    options: [
      { label: 'A', text: '对方把机酒路线全安排妥当，我只管背着小包跟在后面当开心果夸夸他', scores: { zhiyu: 2, xianhuo: 2, duli: -3, tashi: -1 } },
      { label: 'B', text: '大攻略我来做主拍板，对方只要情绪稳定、帮提行李不扫兴就行', scores: { duli: 3, tashi: 3, langman: -2 } },
      { label: 'C', text: '干脆不做死板攻略，睡到自然醒随心瞎逛，走到哪算哪更有惊喜感', scores: { langman: 3, xianhuo: 2, tashi: -3 } },
      { label: 'D', text: '一人负责订票看路、一人负责找美食拍照，分工清楚配合默契', scores: { tashi: 3, duli: 2, zhixing: 1 } }
    ]
  },
  {
    id: 9,
    chapter: 'Part 03 · 约会日常',
    question: '对象最近连轴转加班特别忙，好几天没空好好陪你，你会怎么处理？',
    options: [
      { label: 'A', text: '正好跟朋友约饭、自己追剧健身，我的生活丰富着呢，一点不觉得空虚', scores: { duli: 3, xianhuo: 2, zhiyu: -2 } },
      { label: 'B', text: '不去烦他，算准他下班时间点份热乎夜宵送到他楼下，抱一下就走', scores: { zhiyu: 3, tashi: 3, duli: 1 } },
      { label: 'C', text: '嘴上懂事说“你先忙”，其实过了三天就开始委屈，希望他抽五分钟哄哄我', scores: { langman: 3, zhiyu: 2, duli: -3, tashi: -1 } },
      { label: 'D', text: '发个搞笑表情包逗他开心，顺便帮他看看手里有没有我能搭把手分担的事', scores: { tashi: 2, xianhuo: 2, zhixing: 1 } }
    ]
  },

  // Part 04 · 吵架磨合
  {
    id: 10,
    chapter: 'Part 04 · 吵架磨合',
    question: '两个人吵架僵住了，气氛降到冰点的时候，你一般怎么收场？',
    options: [
      { label: 'A', text: '最受不了冷战过夜，就算不是我的错，也会主动戳戳他递个台阶先软下来', scores: { zhiyu: 3, tashi: 2, duli: -2 } },
      { label: 'B', text: '绝对不先低头，他冷我也冷，比耐心我还没输过谁，等他想通了来找我', scores: { duli: 3, zhixing: 2, zhiyu: -3 } },
      { label: 'C', text: '只要对方随便找个借口问“饿不饿/喝不喝奶茶”，我立马顺坡下驴翻篇', scores: { xianhuo: 3, zhiyu: 2, zhixing: -2 } },
      { label: 'D', text: '必须把前因后果和道理掰扯清楚、达成共识，不能糊里糊涂抱一下就混过去', scores: { zhixing: 3, tashi: 2, langman: -1 } }
    ]
  },
  {
    id: 11,
    chapter: 'Part 04 · 吵架磨合',
    question: '恋爱里如果对方踩了下面哪条线，会让你瞬间下头、好感清零？',
    options: [
      { label: 'A', text: '控制欲爆棚，天天查岗翻手机、管我穿什么跟谁玩，让人窒息', scores: { duli: 3, xianhuo: 2, tashi: -1 } },
      { label: 'B', text: '遇到事只会逃避装死、不回消息玩冷暴力，半点担当都没有', scores: { tashi: 3, xianhuo: 1, zhixing: -1 } },
      { label: 'C', text: '说话大脑空空没深度，或者审美俗气、完全听不懂我的梗和情绪', scores: { zhixing: 3, langman: 3, tashi: -2 } },
      { label: 'D', text: '脾气暴躁爱说狠话，对我和身边服务员一点温柔耐心都没有', scores: { zhiyu: 3, langman: 1, duli: -1 } }
    ]
  },
  {
    id: 12,
    chapter: 'Part 04 · 吵架磨合',
    question: '当你在外面受了大委屈、心情特别丧的时候，你对另一半是怎么表现的？',
    options: [
      { label: 'A', text: '钻进他怀里大哭或者疯狂吐槽，急需他无条件站在我这边抱抱我、替我出气', scores: { zhiyu: 3, langman: 2, xianhuo: 1, duli: -3 } },
      { label: 'B', text: '习惯自己先躲进壳里消化完，等情绪平复了再云淡风轻当个故事讲给他听', scores: { duli: 3, zhixing: 3, zhiyu: -2, xianhuo: -1 } },
      { label: 'C', text: '拉着他去吃顿大餐或者喝一杯，只要他在旁边陪着玩一会儿就满血复活了', scores: { xianhuo: 3, tashi: 2, zhixing: -2 } },
      { label: 'D', text: '把来龙去脉讲给他听，希望他能帮我理性分析一下破局办法', scores: { tashi: 2, zhixing: 3, langman: -2 } }
    ]
  },

  // Part 05 · 心动与底色
  {
    id: 13,
    chapter: 'Part 05 · 心动底色',
    question: '当你发现自己对一个人有点上头、动心了，你的操作通常是？',
    options: [
      { label: 'A', text: '打直球！主动约吃饭、主动找话题，喜欢就大大方方让他知道', scores: { xianhuo: 3, duli: 1, zhixing: -3 } },
      { label: 'B', text: '高端猎手往往以猎物的方式出现——制造偶遇和眼神拉丝，引他主动来追我', scores: { zhixing: 3, langman: 2, duli: 2, tashi: -3 } },
      { label: 'C', text: '越喜欢越怂、越装镇定，表面上比对普通朋友还客气，心里早就小鹿乱撞了', scores: { langman: 2, zhiyu: 2, xianhuo: -3 } },
      { label: 'D', text: '润物细无声地对他好，记住他的喜好照顾他，日久生情水到渠成', scores: { zhiyu: 3, tashi: 3, xianhuo: -1 } }
    ]
  },
  {
    id: 14,
    chapter: 'Part 05 · 心动底色',
    question: '下面四个瞬间，哪一个最容易让你心脏漏跳半拍、突然对人动心？',
    options: [
      { label: 'A', text: '遇到突发乱子大家都在慌，他淡定站出来三两下摆平说“别怕，交给我”的时候', scores: { zhiyu: 2, langman: 2, duli: -2, tashi: 2 } },
      { label: 'B', text: '他在自己擅长的领域侃侃而谈、专注投入，眼里闪着自信光芒的时候', scores: { zhixing: 3, duli: 2, zhiyu: -1 } },
      { label: 'C', text: '人群里无论什么时候回头，都发现他正笑盈盈地看着我、满眼偏爱的时候', scores: { langman: 3, xianhuo: 2, zhixing: -1 } },
      { label: 'D', text: '冬天下班走出地铁口，看见他揣着热烤红薯在冷风里冲我挥手傻笑的时候', scores: { tashi: 3, zhiyu: 3, zhixing: -2 } }
    ]
  },
  {
    id: 15,
    chapter: 'Part 05 · 心动底色',
    question: '最后凭直觉选：在一段长期关系里，什么最能给你源源不断的安全感？',
    options: [
      { label: 'A', text: '事事有回应、件件有着落，说好几点来接我就绝不会迟到的靠谱行动', scores: { tashi: 3, zhiyu: 2, langman: -2 } },
      { label: 'B', text: '我自己鼓鼓的钱包和随时敢转身离开的底气，安全感永远是自己给的', scores: { duli: 3, zhixing: 3, zhiyu: -2 } },
      { label: 'C', text: '不管过了多久，他看我的眼神依然有热烈的心动、新鲜感和分享欲', scores: { langman: 3, xianhuo: 3, tashi: -2 } },
      { label: 'D', text: '在他面前我可以卸下所有坚强伪装，哪怕犯蠢脆弱也知道他绝不会嫌弃我', scores: { zhiyu: 3, langman: 2, duli: -2 } }
    ]
  }
];

/**
 * 10类最易吸引的恋人画像库
 */
const CHARACTERS = [
  {
    id: 'mentor',
    name: '爹系/姐系引导型恋人',
    courtesy: '成熟控场 · 嘴硬心软的兜底掌舵人',
    title: '表面淡定挑剔 · 实则把你宠成小孩',
    seal: '引导系',
    accentColor: '#9E475B',
    bias: -0.1122,
    target: { zhiyu: 68, duli: 12, xianhuo: 62, zhixing: 26, tashi: 22, langman: 86 },
    quote: '“嘴上嫌你迷糊没长心眼，却早就顺手把你前面的坑全填平了。”',
    tags: ['成熟稳重', '嘴硬心软', '超强兜底力', '带你成长'],
    traits: '你身上有一种未经世故打磨掉的纯真灵气与柔软感。你真诚、有感染力，偶尔遇到复杂麻烦事时会流露出一点让人心软的小迷糊或小脆弱——这种真实不做作的生命力，对成熟强大的引导型恋人来说简直是精准狙击。',
    reason: '那些在社会上独当一面、习惯了照顾别人的“大魔王”，平时看腻了精明算计的人精；偏偏遇到鲜活柔软、懂得真诚依赖与赞美你的你时，保护欲和掌控欲会被瞬间激起，心甘情愿替你遮风挡雨。',
    advantage: '你天生擅长激发强者的温柔一面，能毫不费力地让对方体会到“被需要、被崇拜”的满足感，越宠你他自己越有成就感。',
    easterEgg: {
      scene: '工作交流局、前辈带新人，或你遇到棘手难题求助时他顺手帮了一把',
      sweetSpot: '一边叹气说“拿你没办法”，一边把剥好的虾和做好的攻略全推到你面前',
      warning: '小心别把成熟照顾和“爱说教爹味控制狂”混为一谈，真正爱你的人会尊重你的意愿'
    }
  },
  {
    id: 'puppy',
    name: '阳光直球小狗型恋人',
    courtesy: '热烈真诚 · 满眼是你的快乐永动机',
    title: '不管你在哪 · 第一眼永远奔向你',
    seal: '直球系',
    accentColor: '#C46851',
    bias: 0.0889,
    target: { zhiyu: 54, duli: 86, xianhuo: 18, zhixing: 80, tashi: 68, langman: 32 },
    quote: '“所有人都猜你高冷难追，只有他捧着一腔滚烫真心，非要把你逗笑不可。”',
    tags: ['打直球王者', '情绪超热烈', '黏人精反差', '满眼偏爱'],
    traits: '你骨子里非常清醒独立，平时情绪内敛克制，不爱乱搞暧昧，自带一层淡淡的距离感。你越是淡定自持、不轻易对人热情，就越容易吸引那种阳光坦荡、精力旺盛的“直球小狗型”恋人前赴后继地凑上来。',
    reason: '直球小狗天生对“神秘清冷又有主见”的人毫无抵抗力！你的淡定在他眼里是致命的酷，只要你偶尔冲他露出一个无奈又纵容的笑，他就能开心得在心里放三天烟花，死心塌地围着你转。',
    advantage: '你的稳重刚好能稳住他的跳脱，而他的热烈直白又能融化你心底不轻易示人的孤独感，是天造地设的冷热互补。',
    easterEgg: {
      scene: '朋友聚会、运动户外局，你在角落安安静静待着，他主动凑过来找话聊',
      sweetSpot: '秒回你的每一条消息，受了一点委屈只要你摸摸头夸一句就瞬间满血复活',
      warning: '别总端着冷脸让他一个人唱独角戏，偶尔主动回应一次，小狗会更爱你十倍'
    }
  },
  {
    id: 'intellectual',
    name: '智性恋高岭之花恋人',
    courtesy: '外冷内热 · 只对你破例的清醒派',
    title: '对世界疏离挑剔 · 唯独迷恋你的灵魂',
    seal: '智性系',
    accentColor: '#56597A',
    bias: -0.0206,
    target: { zhiyu: 16, duli: 96, xianhuo: 20, zhixing: 96, tashi: 62, langman: 56 },
    quote: '“我们不用谁依附谁，但只要一开口聊天，就知道全世界只有你接得住我的频率。”',
    tags: ['双强共振', '外冷内热', '审美与脑力齐飞', '极致专一'],
    traits: '你拥有极强的自我边界感与独立思考能力，讨厌庸俗肤浅的套路和黏糊糊的情绪绑架。你活得通透体面，有自己专注热爱的领域，这种“不讨好任何人的清醒感”散发着高级而迷人的智性魅力。',
    reason: '真正优秀的“高岭之花”慕强且挑剔，普通人的死缠烂打只会让他们退避三舍；唯独遇到同样聪明独立、聊得来深层话题又懂分寸的你，他们才会放下高冷防备，产生棋逢对手的强烈心动。',
    advantage: '你们之间不需要费劲解释边界，既有各自独立闪耀的空间，又有精神高度契合的默契，感情极其稳固长久。',
    easterEgg: {
      scene: '行业合作、读书看展、深度讨论某个话题时眼神交汇的那一秒',
      sweetSpot: '平时在外面冷静克制得像冰山，私下关起门来唯独对你流露出笨拙的反差温柔',
      warning: '两个聪明人都太习惯克制独立，记得多创造一点感性的肢体拥抱与烟火日常'
    }
  },
  {
    id: 'guardian',
    name: '温柔救赎守护型恋人',
    courtesy: '情绪超稳 · 接住你所有脆弱的避风港',
    title: '看穿你逞强的软肋 · 做你最安心的退路',
    seal: '治愈系',
    accentColor: '#735B82',
    bias: -0.1102,
    target: { zhiyu: 42, duli: 22, xianhuo: 76, zhixing: 44, tashi: 16, langman: 92 },
    quote: '“在别人面前你尽管光芒万丈，累了随时转过身，我永远稳稳接住你。”',
    tags: ['情绪稳定天花板', '极致耐心', '懂你的敏感', '事事有回应'],
    traits: '你其实是个感知力很敏锐、对感情很走心的人。平时在人群里你可能活泼大方、很会照顾场面，但夜深人静时偶尔会有缺乏安全感、容易多想或内耗的脆弱时刻，渴望一份真正笃定不摇摆的偏爱。',
    reason: '你身上“明明很敏感却努力表现得懂事鲜活”的特质，最容易打动内心温和强大、情绪极度稳定的守护者。他们能一眼看穿你笑容背后的疲惫，发自内心地想要给你一个永远不会落空的拥抱。',
    advantage: '你丰富的情感和浪漫灵气让他的平淡生活变得鲜活多彩，而他如山海般的稳定包容刚好治愈你所有的不安。',
    easterEgg: {
      scene: '你状态低落或加班疲惫的深夜，他不讲大道理，只是默默陪在你身边听你说完',
      sweetSpot: '不管你怎么闹小情绪都绝不冷暴力，永远温和坚定地告诉你“我在呢，别怕”',
      warning: '珍惜对方稳稳的温柔，有需求直接说出来，别用反复推开试探来考验他的耐心'
    }
  },
  {
    id: 'poet',
    name: '浪漫文艺灵魂伴侣',
    courtesy: '极致共情 · 懂你所有欲言又止的知音',
    title: '把平凡三餐四季 · 和你过成法式电影',
    seal: '浪漫系',
    accentColor: '#9E5872',
    bias: 0.1423,
    target: { zhiyu: 80, duli: 54, xianhuo: 24, zhixing: 84, tashi: 18, langman: 98 },
    quote: '“你随口拍的一朵晚霞，他都能读懂你没说出口的那句想念。”',
    tags: ['灵魂共振', '极致仪式感', '审美同频', '细腻入微'],
    traits: '你有一颗极其细腻、丰盈又讲究美感的心。你对周遭的氛围、音乐、光影和人心微小的起伏有着天然的捕捉力，比起世俗冰冷的条件匹配，你更渴望那种一个眼神就能心领神会的深度精神连接。',
    reason: '浪漫敏感的文艺灵魂一直在人群里寻找同类。当你不经意流露出独特的审美品味与温柔共情力时，就像在黑夜里亮起了一盏信号灯，会瞬间让同频的浪漫主义者为你深深着迷、视若珍宝。',
    advantage: '你们谈恋爱绝对不会沦为枯燥的搭伙过日子，哪怕只是雨天一起去买把伞，都能聊出满屏粉红泡泡与诗意。',
    easterEgg: {
      scene: '独立书店、音乐节、小众展览，或者因为同一首歌、同一部电影聊到深夜',
      sweetSpot: '记住每一个纪念日和你随口提过的愿望，手写信与小惊喜从不缺席',
      warning: '风花雪月固然迷人，遇到柴米油盐的现实问题时记得两个人一起脚踏实地面对'
    }
  },
  {
    id: 'playmate',
    name: '欢喜冤家最佳损友恋人',
    courtesy: '互怼互宠 · 接住你所有烂梗的灵魂搭子',
    title: '吵吵闹闹一辈子 · 和你在一起从不无聊',
    seal: '搭子系',
    accentColor: '#B85A6B',
    bias: -0.0526,
    target: { zhiyu: 54, duli: 68, xianhuo: 98, zhixing: 26, tashi: 38, langman: 18 },
    quote: '“嘴上天天嫌弃你是笨蛋，别人要是敢说你半句不好，他第一个撸袖子急眼！”',
    tags: ['搞笑搭子', '零包袱相处', '越怼越甜', '永远玩得来'],
    traits: '你性格爽朗真实、幽默有梗，最讨厌矫揉造作的偶像剧套路和沉重压抑的苦情戏。跟你待在一起完全不用端着架子，你自带一种鲜活轻快的开心果磁场，走到哪都能把无聊的日子过出乐子。',
    reason: '同样聪明有趣、热爱生活的人最容易被你的真实鲜活吸引！在你面前不用装深沉也不用猜心思，从饭搭子、游戏搭子一路互损互宠处成情侣，快乐直接翻倍。',
    advantage: '友情打底的爱情拥有最无敌的抗风险力！没有隔夜仇，吵架三分钟就能因为一个搞笑表情包破功笑场。',
    easterEgg: {
      scene: '朋友攒局的桌游火锅、同组共事吐槽奇葩，或者老熟人天天斗图突然变了味',
      sweetSpot: '无论半夜两点你想去吃烤串还是想疯玩，他永远一句“走啊谁怕谁”陪你到底',
      warning: '平时互怼开玩笑惯了，到关键纪念日或认真表白时别害羞打岔，该甜的时候大胆甜'
    }
  },
  {
    id: 'protector',
    name: '霸气护短行动派恋人',
    courtesy: '少说多做 · 明目张胆偏爱你的实力派',
    title: '不会花言巧语 · 但把最好的全都塞给你',
    seal: '偏爱系',
    accentColor: '#823B4A',
    bias: 0.0198,
    target: { zhiyu: 98, duli: 14, xianhuo: 78, zhixing: 16, tashi: 52, langman: 56 },
    quote: '“我不擅长说一百句漂亮情话，但我所有的钱、时间和退路都写着你的名字。”',
    tags: ['极度护短', '行动派天花板', '大方舍得', '满满安全感'],
    traits: '你身上有着非常温暖柔软的情绪治愈力，待人真诚体贴、懂得感恩和珍惜别人的付出。你不会把别人的好当成理所当然，每次收到一点善意都会回馈甜甜的开心，让人特别想把全世界最好的东西捧到你面前。',
    reason: '干脆利落、重情重义的行动派最吃“温柔甜妹/暖心伴侣”这一套！他们在外面雷厉风行硬邦邦，唯独遇到温柔贴心、会真心实意心疼他们的你，瞬间化为绕指柔，恨不得把你护在羽翼下谁也不许欺负。',
    advantage: '你的温柔体贴能彻底抚平他的棱角与紧绷，而他直接实在的物质与行动偏爱，能让你在感情里半点苦都不吃。',
    easterEgg: {
      scene: '别人刁难你时他霸气出头解围，或者你无意中关心了他一句让他记了很久',
      sweetSpot: '清空购物车从不含糊，对外永远无条件站你这边：“我家的人轮不到外人说”',
      warning: '行动派有时候嘴笨不懂弯弯绕绕的浪漫暗示，想要什么直接撒娇明说效果最好'
    }
  },
  {
    id: 'cat',
    name: '反差萌傲娇猫系恋人',
    courtesy: '矜持慢热 · 私下偷偷黏你的猫系傲娇鬼',
    title: '人前高贵冷艳 · 只有你能顺他的毛',
    seal: '猫系',
    accentColor: '#7D5A7A',
    bias: 0.1297,
    target: { zhiyu: 88, duli: 76, xianhuo: 10, zhixing: 54, tashi: 66, langman: 58 },
    quote: '“才不是特意来接你的，只是刚好顺路……算了，手伸出来给你牵一下。”',
    tags: ['傲娇反差萌', '慢热长情', '私下超黏人', '只信你一人'],
    traits: '你为人温和踏实、情绪稳定又有耐心，没有咄咄逼人的侵略性，给人一种像午后阳光一样暖融融的安全感。你不会急功近利地逼迫别人交出真心，而是懂得安静温和地陪伴。',
    reason: '防备心重、面子薄又慢热的“猫系恋人”，最怕油腻自来熟的人硬贴上来；只有你这种温柔恒定、永远不会突然凶他或丢下他的温暖体质，才能让他一点点卸下刺，变成只往你怀里钻的黏人小猫。',
    advantage: '一旦把傲娇猫系恋人顺好毛，他们的忠诚度是1000%！别人看到的都是他的冷脸，只有你独享他撒娇打滚的反差可爱。',
    easterEgg: {
      scene: '长期共事、同窗或邻居日常相处，你几次不动声色的温和照顾让他悄悄沦陷',
      sweetSpot: '嘴上说着“你好烦哦”，身体却诚实地往你身边贴，走哪都要牵着你的衣角',
      warning: '猫系恋人自尊心强容易口是心非，看破别拆穿，顺着毛哄两句他啥都听你的'
    }
  },
  {
    id: 'homemaker',
    name: '人间烟火踏实居家恋人',
    courtesy: '三餐四季 · 把喜欢熬进热汤里的实在人',
    title: '不玩暧昧虚招 · 只想和你认认真真过日子',
    seal: '烟火系',
    accentColor: '#A16752',
    bias: -0.1516,
    target: { zhiyu: 54, duli: 82, xianhuo: 24, zhixing: 18, tashi: 98, langman: 10 },
    quote: '“外面的风浪再大，只要推开家门闻到他做的饭香，心就彻底落定了。”',
    tags: ['情绪超稳', '顾家靠谱', '厨艺生活家', '奔着一辈子去'],
    traits: '你活得非常清醒务实、脚踏实地，反感虚头巴脑的画饼拉扯和狗血折腾。你把自己的生活打理得井井有条，对待感情认真专一，向往的是两个人舒舒服服、安安稳稳把小日子过红火的真实幸福。',
    reason: '靠谱顾家的实在人最欣赏你身上这份不作不闹、真诚通透的生活质感。你们三观一致、节奏合拍，不用费心猜忌试探，一拍即合就能开启热气腾腾的神仙眷侣日常。',
    advantage: '神仙级的低内耗高幸福感组合！在一起不仅情绪舒坦，还能一起攒钱买房、把生活品质越过越高。',
    easterEgg: {
      scene: '靠谱熟人介绍、社区运动/兴趣班，或日常工作往来中发现彼此三观超合拍',
      sweetSpot: '记得你的所有饮食忌口，冬天提前帮你暖好被窝，凡事把你放进未来规划里',
      warning: '日子太安稳偶尔会少点波澜，节假日不妨主动约他出去旅旅游制造点新鲜浪漫'
    }
  },
  {
    id: 'charmer',
    name: '致命引力推拉高手恋人',
    courtesy: '张力拉满 · 棋逢对手的迷人危险派',
    title: '万花丛中游刃有余 · 偏偏栽在你手里',
    seal: '引力系',
    accentColor: '#663F56',
    bias: 0.0664,
    target: { zhiyu: 14, duli: 90, xianhuo: 86, zhixing: 88, tashi: 14, langman: 68 },
    quote: '“本来只想跟你玩场高手过招的游戏，没想到最后先动真心认输的人是我。”',
    tags: ['性张力拉满', '高手过招', '浪子/浪女回头', '极致上头'],
    traits: '你身上同时兼具鲜活明艳的生命力与清醒独立的野生酷感！你聪明、敢爱敢恨、拿得起放得下，绝不会在一段关系里卑微恋爱脑——这种“你很好，但我也随时玩得起”的潇洒气场，拥有致命的吸引力。',
    reason: '那些魅力四射、见过世面的情场高手，最容易对乖巧顺从的人感到无聊，却唯独会被你这种又飒又鲜活、永远抓不住全貌的对手死死拿捏，越抓不住越上头，心甘情愿为你收心。',
    advantage: '火花四溅、性张力拉满！你们在一起就像拍都市爱情大片，既有势均力敌的过招快感，又有极致的浪漫激情。',
    easterEgg: {
      scene: '微醺派对、创意圈子、旅行途中，第一眼对视就闻到了同类的危险迷人气息',
      sweetSpot: '在别人面前游刃有余从不吃亏，唯独在你面前吃醋破防、乖乖交出主动权',
      warning: '前期火花虽燃，确认长期关系前一定要考察他在低谷与平淡期能不能守住真诚'
    }
  }
];
