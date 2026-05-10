/**
 * 夜间反噬弹窗 · 牌组妖性过高时，非战斗节点结束后触发
 * store 将 message 塞入 backlashMessage，确认后清空。
 */

import { useGame } from '../../../store/GameStore';
import { Button } from '../../ui/Button';

export function BacklashModal() {
  const { backlashMessage, acknowledgeBacklash } = useGame();
  if (!backlashMessage) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-deep/90 backdrop-blur p-6">
      <div className="max-w-md w-full bg-ink-soft border-2 border-vermillion/60 rounded p-6 shadow-seal text-center">
        <div className="text-vermillion-light font-heading tracking-widest text-sm mb-2">
          · 反 噬 ·
        </div>
        <h2 className="font-heading text-parchment-light text-xl tracking-widest mb-3">
          妖 气 入 梦
        </h2>
        <p className="text-parchment/85 italic leading-loose mb-5 whitespace-pre-line">
          {backlashMessage}
        </p>
        <div className="text-mist text-xs font-heading tracking-widest mb-4">
          提示 · 去祭坛「驯妖」或「删卡」可降低妖性。
        </div>
        <Button onClick={acknowledgeBacklash}>勉 强 撑 起</Button>
      </div>
    </div>
  );
}
