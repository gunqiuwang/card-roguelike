/**
 * 奇遇事件库 · v0.2 第一章
 *
 * 对齐 docs/DESIGN_v0.2.md §8.2。
 * 每个事件 3 选 1：有代价、有好处、有神秘。不设"正确答案"。
 *
 * 副作用：`choice.apply(run, rng)` 直接修改 run，返回人类可读的结算文案。
 */

import type { EventDef, RunState } from '../../types';
import { CARD_BURN, CARD_EXORCISE, CARD_PEARL } from '../cards';

// ============================================================================
// 1 · 荒坟
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

// ============================================================================
// 2 · 井中有物
// ============================================================================
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

// ============================================================================
// 3 · 符贩
// ============================================================================
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
// 导出
// ============================================================================
export const ALL_EVENTS: readonly EventDef[] = [
  EVENT_GRAVE,
  EVENT_WELL,
  EVENT_PEDDLER,
];

const eventIndex: Record<string, EventDef> = Object.fromEntries(
  ALL_EVENTS.map((e) => [e.id, e]),
);

export function getEvent(id: string): EventDef {
  const e = eventIndex[id];
  if (!e) throw new Error(`Unknown event id: ${id}`);
  return e;
}
