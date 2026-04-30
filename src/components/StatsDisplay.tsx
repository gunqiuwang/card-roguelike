import { useState, useEffect } from 'react';
import { getStats, getAchievements, GameStats, Achievement } from '../store/achievements';

export function StatsDisplay() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const loadData = () => {
    setStats(getStats());
    setAchievements(getAchievements());
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!stats) return null;

  return (
    <>
      {/* Stats Button */}
      <button
        onClick={() => { loadData(); setIsOpen(true); }}
        className="fixed bottom-20 right-2 px-3 py-2 text-sm bg-gray-800/80 text-white/70 rounded-lg hover:bg-gray-700 z-40"
      >
        📊 统计
      </button>

      {/* Stats Modal */}
      {isOpen && (
        <div className="
          fixed inset-0 bg-black/80 backdrop-blur-sm
          flex items-center justify-center z-50
          p-4
        ">
          <div className="
            bg-gray-900 rounded-2xl p-6 max-w-md w-full
            border border-gray-700
            max-h-[80vh] overflow-y-auto
          ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">游戏统计</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatBox label="总场次" value={stats.totalGames} />
              <StatBox label="胜利" value={stats.totalWins} />
              <StatBox label="失败" value={stats.totalLosses} />
              <StatBox label="最高连胜" value={stats.longestWinStreak} />
              <StatBox label="造成伤害" value={stats.totalDamageDealt} />
              <StatBox label="治疗量" value={stats.totalHealing} />
              <StatBox label="使用卡牌" value={stats.cardsPlayed} />
              <StatBox label="最高伤害" value={stats.highestDamage} />
            </div>

            {/* Achievements */}
            <h3 className="text-lg font-bold text-white mb-3">成就</h3>
            <div className="space-y-2">
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg
                    ${achievement.unlocked ? 'bg-gray-800' : 'bg-gray-800/50 opacity-50'}
                  `}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <div className="font-medium text-white">
                      {achievement.unlocked ? achievement.name : '???'}
                    </div>
                    <div className="text-xs text-white/60">
                      {achievement.description}
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <span className="ml-auto text-green-400">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-800 rounded-lg p-3 text-center">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/60">{label}</div>
    </div>
  );
}