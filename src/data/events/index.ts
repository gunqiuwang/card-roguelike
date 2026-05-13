/**
 * 奇遇事件库 · v1.0 完整版
 *
 * 含四章事件（每章3个，共12个）
 */

import type { EventDef, RunState } from '../../types';
import { CARD_BURN, CARD_EXORCISE, CARD_PEARL } from '../cards';

// ============================================================================
// 第一章 · 青丘残岭
// ============================================================================

export const EVENT_GRAVE: EventDef = {
  id: 'grave',
  title: '荒 坟',
  body: `你踏过一片坟岗，突然听见小孩的哭声从坟里传来。
靠近，是一个穿白衣的女童，坐在坟上啃一只生鸡。
她抬头看你，笑了。嘴角裂到耳根。`,
  chapter: 'qingqiu',
  choices: [
    {
      label: '斩',
      description: '一刀斩向她。获得 10 灵气。',
      apply: (run: RunState) => {
        run.currency += 10;
        return '女童化作青烟散去，你在灰里捡到一束铜钱。（+10 灵气）';
      },
    },
    {
      label: '递符',
      description: '递给她一张符。获得一张「驱邪符」入牌组。',
      apply: (run: RunState) => {
        run.deck.push(CARD_EXORCISE);
        return '她接过符，端端正正地咬了一口。你得到一张驱邪符。';
      },
    },
    {
      label: '离开',
      description: '转身离开。你感到有些不安。',
      apply: (run: RunState) => {
        run.hp = Math.max(1, run.hp - 3);
        return '你走出很远，仍听见身后有细碎的笑声。（-3 气血）';
      },
    },
  ],
};

export const EVENT_WELL: EventDef = {
  id: 'well',
  title: '古 井',
  body: `一口枯井，井边有半卷湿透的符纸。
俯身看去，井底漆黑，却似有什么在慢慢向上爬。`,
  chapter: 'qingqiu',
  choices: [
    {
      label: '取符',
      description: '取走井边的湿符。获得一张「聚灵珠」。',
      apply: (run: RunState) => {
        run.deck.push(CARD_PEARL);
        return '你小心展开湿符，墨迹未干，竟是一枚聚灵珠的简图。';
      },
    },
    {
      label: '投石',
      description: '扔一块石头下去。获得 15 灵气。',
      apply: (run: RunState) => {
        run.currency += 15;
        return '井中传来一声闷响，而后静了。你发现井口的青苔下藏着一串铜钱。（+15 灵气）';
      },
    },
    {
      label: '俯身',
      description: '俯身朝井里看久一点。',
      apply: (run: RunState, rng) => {
        if (rng() < 0.5) {
          run.hp = Math.max(1, run.hp - 5);
          return '井底有双眼睛与你对视。你头重脚轻，吐出一口黑血。（-5 气血）';
        }
        run.maxHp += 3;
        run.hp += 3;
        return '井水映出你自己的脸，多了一丝你未曾见过的安稳。（最大气血 +3）';
      },
    },
  ],
};

export const EVENT_PEDDLER: EventDef = {
  id: 'peddler',
  title: '山 道 符 贩',
  body: `山道中坐着一老者，背上负一只半死不活的狐狸。
他展开一张焦黄的符纸：
"小友，灼焰箓，二十灵气。你若买，它就是你的；你若不买——"
他笑了笑，没有说下去。`,
  chapter: 'qingqiu',
  choices: [
    {
      label: '买',
      description: '花 20 灵气，获得一张「灼焰箓」。',
      apply: (run: RunState) => {
        if (run.currency >= 20) {
          run.currency -= 20;
          run.deck.push(CARD_BURN);
          return '老者把符纸轻轻按上你的手心，转身而去，连狐狸都不看一眼。（-20 灵气，+1 灼焰箓）';
        }
        return '你摸了摸口袋，灵气不够。老者笑笑，把符折起。';
      },
    },
    {
      label: '不买',
      description: '走开。',
      apply: () => {
        return '老者没有追你。狐狸的眼睛跟你走了很远。';
      },
    },
    {
      label: '抢',
      description: '直接抢。',
      apply: (run: RunState, rng) => {
        if (rng() < 0.5) {
          run.deck.push(CARD_BURN);
          run.hp = Math.max(1, run.hp - 6);
          return '老者反应比你想的快。你抢到符，却被抓了一爪。（+1 灼焰箓，-6 气血）';
        }
        run.hp = Math.max(1, run.hp - 10);
        return '老者眼睛一闪，狐狸扑来。你只抢到一地的纸灰。（-10 气血）';
      },
    },
  ],
};

// ============================================================================
// 第二章 · 饕餮古镇
// ============================================================================

export const EVENT_GREED_TEMPLE: EventDef = {
  id: 'greed_temple',
  title: '贪 寺',
  body: `一座破败的古寺，门楣上依稀可见"贪"字。
殿内供着一尊无头神像，身躯挂满金银珠宝。
一只饿得皮包骨的狸猫守着香炉，见你进来，开了口：
"供品放下，拿起一样。公平交易。"`,
  chapter: 'taotie',
  choices: [
    {
      label: '全拿',
      description: '贪心发作，全拿走。获得 30 灵气，但损失 10 气血。',
      apply: (run: RunState) => {
        run.currency += 30;
        run.hp = Math.max(1, run.hp - 10);
        return '狸猫笑了笑，眼睛在黑暗里发绿。你怀里沉甸甸的，身上却轻飘飘的。（+30 灵气，-10 气血）';
      },
    },
    {
      label: '放供品',
      description: '放下供品，换一件便宜宝物。获得 15 灵气。',
      apply: (run: RunState) => {
        run.currency += 15;
        return '狸猫用爪子把一枚铜钱拨到你面前。你拿了就走，它没追。';
      },
    },
    {
      label: '离开',
      description: '摇摇头离开。',
      apply: () => {
        return '狸猫没拦你。你知道它记得你的脸。';
      },
    },
  ],
};

export const EVENT_FURNACE: EventDef = {
  id: 'furnace',
  title: '炉 火 镇',
  body: `一座以熔炉为中心的小镇，家家户户门前一口炉。
空气中弥漫着铁锈和血的味道。
街角有个打铁少年，铁锤飞舞，却不见产品。
"我在打一口能装下贪婪的棺材，"他说，"你要不要看看。"`,
  chapter: 'taotie',
  choices: [
    {
      label: '看',
      description: '看看他的作品。获得 8 气·御。',
      apply: (run: RunState) => {
        run.hp = Math.min(run.maxHp, run.hp + 8);
        return '那是一块不成形的铁，却烫得你手心发麻。你感觉身上有了力气。';
      },
    },
    {
      label: '帮忙',
      description: '帮他打铁。获得 20 灵气。',
      apply: (run: RunState) => {
        run.currency += 20;
        return '你挥了几下锤，满手血泡。少年递来一串铜钱，说这是工钱。';
      },
    },
    {
      label: '离开',
      description: '这里的气味让你不安。',
      apply: () => {
        return '少年没抬头，继续敲他的棺材。';
      },
    },
  ],
};

export const EVENT_GOLD_RIVER: EventDef = {
  id: 'gold_river',
  title: '金 水 河',
  body: `一条河，河底铺满碎金。
河面浮着一层油光，是上游漂下来的污秽。
有个人跪在河边，用双手拼命捐水。
"我只要一点点金子治病，"他说，"只要一点点。"`,
  chapter: 'taotie',
  choices: [
    {
      label: '帮他',
      description: '给他一些灵气买药。消耗 15 灵气，最大气血 +5。',
      apply: (run: RunState) => {
        if (run.currency >= 15) {
          run.currency -= 15;
          run.maxHp += 5;
          run.hp += 5;
          return '他哭了。你第一次见人哭得这么安静。你感觉胸口有什么东西松了。';
        }
        return '你摸了摸口袋，空的。他苦笑，说没关系。';
      },
    },
    {
      label: '淘金',
      description: '不管他，自己淘金。获得 25 灵气。',
      apply: (run: RunState) => {
        run.currency += 25;
        return '你淘了一上午，手上全是金粉。他不知什么时候离开了。';
      },
    },
    {
      label: '离开',
      description: '这河让你恶心。',
      apply: () => {
        return '你快步走过，没回头。那人的哭声追了一路。';
      },
    },
  ],
};

// ============================================================================
// 第三章 · 归墟冥海
// ============================================================================

export const EVENT_SEA_GHOST: EventDef = {
  id: 'sea_ghost',
  title: '海 底 亡 灵',
  body: `潜入深海，你见到一群亡魂围着一艘沉船打转。
他们生前行船，死后仍在这里打转。
为首的一个朝你伸手："新人？来帮我们把船往上拖。"
他的手冰凉，但你感觉到一股请求。`,
  chapter: 'guixu',
  choices: [
    {
      label: '帮忙',
      description: '帮他们拖船。消耗 10 灵气，回复 15 气血。',
      apply: (run: RunState) => {
        run.currency = Math.max(0, run.currency - 10);
        run.hp = Math.min(run.maxHp, run.hp + 15);
        return '亡魂们发出无声的欢笑。船往上漂了一点，你感觉身上的寒气被抽走了。';
      },
    },
    {
      label: '拿宝物',
      description: '趁机搜刮沉船。获得 25 灵气，Hp -8。',
      apply: (run: RunState) => {
        run.currency += 25;
        run.hp = Math.max(1, run.hp - 8);
        return '你拿到一箱金市。亡魂们的眼神变了，你赶紧往上游。';
      },
    },
    {
      label: '离开',
      description: '这里的气息让你不安。',
      apply: () => {
        return '你快速上浮，亡魂们没追你。但你感觉他们在目送你。';
      },
    },
  ],
};

export const EVENT_SEA_TEMPLE: EventDef = {
  id: 'sea_temple',
  title: '海 底 废 墟',
  body: `一座沉在海底的古城，门前蹲着一只巨石蟹。
它横着走进廋岖的身子，用一只鳌指了指城里：
"里面的东西，只许拿一件。"
它的眼睛是俩窛深不见底的火。`,
  chapter: 'guixu',
  choices: [
    {
      label: '进城',
      description: '进城探索。随机获得强力效果。',
      apply: (run: RunState, rng) => {
        if (rng() < 0.5) {
          run.maxHp += 4;
          run.hp += 4;
          return '你在废墟中找到一块海皇颁布的简牍，上面刻着健康的符文。（最大Hp +4）';
        }
        run.currency += 20;
        return '你找到一箱被海水泡过的钱币，花了点时间晒干。（+20 灵气）';
      },
    },
    {
      label: '绕路',
      description: '绕开石蟹，从另一条路进。消耗 8 气血。',
      apply: (run: RunState) => {
        run.hp = Math.max(1, run.hp - 8);
        return '你从暗流中挤过，身上多了好几道口子，但终于绕过了石蟹。';
      },
    },
    {
      label: '离开',
      description: '不冒这个险。',
      apply: () => {
        return '石蟹用鳌敲了敲地面，像是笑你胆小。';
      },
    },
  ],
};

export const EVENT_SEA_ORACLE: EventDef = {
  id: 'sea_oracle',
  title: '深 渊 之 声',
  body: `深海的最深处，有一个声音在说话。
它不是任何语言，却能听懂。
"给我一个名字，我给你一个秘密。"
声音没有来源，像是从海底本身发出来的。`,
  chapter: 'guixu',
  choices: [
    {
      label: '答名字',
      description: '给它一个名字。随机获得强力效果。',
      apply: (run: RunState, rng) => {
        if (rng() < 0.5) {
          run.maxHp += 5;
          run.hp += 5;
          return '"贪婪。"你说。海底笑了。你感觉身体轻盈了一些。（最大Hp +5）';
        }
        run.currency += 30;
        return '"欲望。"你说。海底沉默了。你感觉口袋里多了东西。（+30 灵气）';
      },
    },
    {
      label: '拒绝',
      description: '说"我没有名字给你"。',
      apply: () => {
        return '"那就记住我的。"声音说完，退去了。你在黑暗中独自站了一会儿。';
      },
    },
    {
      label: '离开',
      description: '这地方让你害怕。',
      apply: () => {
        return '你没说话。海底也没再出声。你浮上去的时候，背脊发凉。';
      },
    },
  ],
};

// ============================================================================
// 第四章 · 昆仑仙境
// ============================================================================

export const EVENT_KUNLUN_GATE: EventDef = {
  id: 'kunlun_gate',
  title: '天 门',
  body: `云层之上，一座巨大的石门立在路中央。
门上刻着四个大字："天道无亲"。
门前站着一位白发老者，衣袖飘飘。
"能开此门者，需有一颗不动之心，"他说，"你有吗？"`,
  chapter: 'kunlun',
  choices: [
    {
      label: '撞门',
      description: '用勇气撞开天门。获得 40 灵气。',
      apply: (run: RunState) => {
        run.currency += 40;
        return '你撞向石门，手臂折了。门开了，里面金光如柱。';
      },
    },
    {
      label: '问答',
      description: '回答老者的问题。',
      apply: (run: RunState, rng) => {
        if (rng() < 0.6) {
          run.maxHp += 8;
          run.hp += 8;
          return '"无欲则刚。"老者笑了，门开了，你感觉身体轻得像云。（最大Hp +8）';
        }
        run.hp = Math.max(1, run.hp - 5);
        return '老者摇摇头，天门紧闭。你被一股力量弹开。（-5 气血）';
      },
    },
    {
      label: '离开',
      description: '时机未到。',
      apply: () => {
        return '老者拱了拱手，说下次再来。你感觉他说的是真的。';
      },
    },
  ],
};

export const EVENT_CLOUD_GARDEN: EventDef = {
  id: 'cloud_garden',
  title: '云 中 药 圃',
  body: `云层里藏着一片药圃，种着各色奇花异草。
一个穿白衣的女子正在浇灌，嘴里哼着不知名的曲子。
"这些药草，"她头也不抬，"凡人闻一闻能治病，妖闻一闻能增道行。
你想要哪一味？"`,
  chapter: 'kunlun',
  choices: [
    {
      label: '求药',
      description: '求一味治病的药。回复 20 气血。',
      apply: (run: RunState) => {
        run.hp = Math.min(run.maxHp, run.hp + 20);
        return '她从圃中摘了一朵小蓝花，递到你手上。花瓣入掌心即化，暖流涌遍全身。';
      },
    },
    {
      label: '求毒',
      description: '求一味增强的毒。消耗 5 气血，获得 15 灵气。',
      apply: (run: RunState) => {
        run.hp = Math.max(1, run.hp - 5);
        run.currency += 15;
        return '她给了你一片红色的叶子。你吞下去，胃里着了火，但全身的经脉都在打通。（-5 气血，+15 灵气）';
      },
    },
    {
      label: '离开',
      description: '无功不受禄。',
      apply: () => {
        return '她笑了笑，说下次来可以带点茶。你觉得她是认真的。';
      },
    },
  ],
};

export const EVENT_PHOENIX_NEST: EventDef = {
  id: 'phoenix_nest',
  title: '凤 凰 巢',
  body: `昆仑的最高处，有一棵巨大的梧桐树。
树顶有鸟巢，巢中卧着一只雏凤。
它的羽毛还未丰，眼神却很老。
"你来了，"它说，"我等你很久了。"`,
  chapter: 'kunlun',
  choices: [
    {
      label: '问它',
      description: '问它为什么等你。',
      apply: (run: RunState, rng) => {
        if (rng() < 0.5) {
          run.maxHp += 8;
          run.hp += 8;
          return '它说："因为你身上有我认识的气息。"你想起很久以前的事。（最大Hp +8）';
        }
        run.currency += 35;
        return '它说："因为我需要一个帮手。"它给了你一根羽毛，说可以换钱。（+35 灵气）';
      },
    },
    {
      label: '偷蛋',
      description: '雏凤是传说之物。尝试偷蛋。',
      apply: (run: RunState, rng) => {
        if (rng() < 0.3) {
          run.maxHp += 5;
          run.currency += 30;
          return '你拿到了一枚温热的蛋。雏凤看了你一眼，没说话。（+5 最大Hp，+30 灵气）';
        }
        run.hp = Math.max(1, run.hp - 15);
        return '雏凤一声鸣叫，你被从树上烧了下来。（-15 气血）';
      },
    },
    {
      label: '离开',
      description: '它的眼神让你不安。',
      apply: () => {
        return '雏凤用喙梳理羽毛，没看你。你转身下山，知道它还在看你。';
      },
    },
  ],
};

// ============================================================================
// 导出
// ============================================================================
export const ALL_EVENTS: readonly EventDef[] = [
  EVENT_GRAVE, EVENT_WELL, EVENT_PEDDLER,
  EVENT_GREED_TEMPLE, EVENT_FURNACE, EVENT_GOLD_RIVER,
  EVENT_SEA_GHOST, EVENT_SEA_TEMPLE, EVENT_SEA_ORACLE,
  EVENT_KUNLUN_GATE, EVENT_CLOUD_GARDEN, EVENT_PHOENIX_NEST,
];

const eventIndex: Record<string, EventDef> = Object.fromEntries(
  ALL_EVENTS.map((e) => [e.id, e]),
);

export function getEvent(id: string): EventDef {
  const e = eventIndex[id];
  if (!e) throw new Error(`Unknown event id: ${id}`);
  return e;
}