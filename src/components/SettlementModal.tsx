import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { GRID_SIZE, BUILDING_STATS, MOOD_COLORS, MOOD_NAMES } from '../utils/constants';
import { countPoweredBuildings } from '../utils/powerCalculator';
import { X, Smile, Meh, Frown, Zap, Battery, Home, Factory, Wind, Package, Sparkles } from 'lucide-react';

export const SettlementModal: React.FC = () => {
  const {
    showSettlement,
    closeSettlement,
    grid,
    satisfaction,
    totalGeneration,
    totalConsumption,
    storedPower,
    maxStorage,
    dayTime,
    poweredCells,
    poweredOutput,
    totalOutput,
    totalProducts,
    baseOutput,
    moodBonus,
  } = useGameStore();

  if (!showSettlement) return null;

  const { houses, poweredHouses, factories, poweredFactories } =
    countPoweredBuildings(grid, poweredCells);

  let windmills = 0;
  let batteries = 0;
  let faultyCount = 0;
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const cell = grid[y][x];
      if (cell.type === 'windmill') windmills++;
      if (cell.type === 'battery') batteries++;
      if (cell.faulty) faultyCount++;
    }
  }

  const totalBuildings = houses + factories;
  const totalPowered = poweredHouses + poweredFactories;
  const coverage = totalBuildings > 0 ? totalPowered / totalBuildings : 1;
  const isDay = dayTime < 50;
  const netPower = totalGeneration - totalConsumption;
  const storagePercent = maxStorage > 0 ? (storedPower / maxStorage) * 100 : 0;

  const getGrade = () => {
    if (satisfaction >= 90 && coverage >= 0.9) return { grade: 'S', color: 'text-yellow-400', desc: '完美电网！浮岛居民无比幸福！' };
    if (satisfaction >= 75 && coverage >= 0.7) return { grade: 'A', color: 'text-green-500', desc: '优秀电网！居民生活美满！' };
    if (satisfaction >= 55 && coverage >= 0.5) return { grade: 'B', color: 'text-blue-500', desc: '良好电网，还有提升空间。' };
    if (satisfaction >= 35) return { grade: 'C', color: 'text-orange-500', desc: '电网堪忧，居民不太满意。' };
    return { grade: 'D', color: 'text-red-500', desc: '电网崩溃！居民非常不满！' };
  };

  const gradeInfo = getGrade();

  const getSatisfactionIcon = () => {
    if (satisfaction >= 70) return <Smile className="w-8 h-8 text-green-500" />;
    if (satisfaction >= 40) return <Meh className="w-8 h-8 text-yellow-500" />;
    return <Frown className="w-8 h-8 text-red-500" />;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={closeSettlement}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-[scaleIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white relative">
          <button
            onClick={closeSettlement}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-2xl font-bold">📊 电网结算报告</h2>
          <p className="text-blue-100 text-sm mt-1">
            {isDay ? '☀️ 白天' : '🌙 夜晚'} · 浮岛电网运营状态
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className={`text-7xl font-black ${gradeInfo.color}`}>
              {gradeInfo.grade}
            </div>
            <p className="text-gray-500 text-sm mt-2">{gradeInfo.desc}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <Smile className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{Math.round(satisfaction)}%</p>
              <p className="text-xs text-gray-500">满意度</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Zap className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-800">{Math.round(coverage * 100)}%</p>
              <p className="text-xs text-gray-500">供电覆盖率</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-700">🏗️ 建筑统计</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-500" />
                <span className="text-gray-600">风车: <b>{windmills}</b> 座</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">住房: <b>{poweredHouses}/{houses}</b> 有电</span>
              </div>
              <div className="flex items-center gap-2">
                <Factory className="w-4 h-4 text-orange-500" />
                <span className="text-gray-600">工坊: <b>{poweredFactories}/{factories}</b> 有电</span>
              </div>
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4 text-amber-500" />
                <span className="text-gray-600">蓄电池: <b>{batteries}</b> 组</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-orange-500" />
              物资产出
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">基础产出</span>
                <span className="font-semibold">{baseOutput}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">加成产出</span>
                <span className="font-semibold text-orange-600">+{(totalOutput - baseOutput).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">当前产能</span>
                <span className="font-bold text-orange-600">{totalOutput}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">实际产出(有电)</span>
                <span className="font-bold text-green-600">+{poweredOutput.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">累计产出</span>
                <span className="font-bold text-amber-600">{Math.floor(totalProducts)} 📦</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              情绪共鸣
            </h3>
            <div className="space-y-2 text-sm">
              {moodBonus.calmConsumptionReduction > 0 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: MOOD_COLORS.calm }}
                    />
                    <span className="text-gray-600">安宁</span>
                  </span>
                  <span className="font-semibold" style={{ color: MOOD_COLORS.calm }}>
                    住房耗电 -{Math.round(moodBonus.calmConsumptionReduction * 100)}%
                  </span>
                </div>
              )}
              {moodBonus.focusOutputBoost > 0 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: MOOD_COLORS.focus }}
                    />
                    <span className="text-gray-600">专注</span>
                  </span>
                  <span className="font-semibold" style={{ color: MOOD_COLORS.focus }}>
                    工坊产出 +{Math.round(moodBonus.focusOutputBoost * 100)}%
                  </span>
                </div>
              )}
              {moodBonus.vitalityDayGenBoost > 0 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: MOOD_COLORS.vitality }}
                    />
                    <span className="text-gray-600">活力</span>
                  </span>
                  <span className="font-semibold" style={{ color: MOOD_COLORS.vitality }}>
                    白天发电 +{Math.round(moodBonus.vitalityDayGenBoost * 100)}%
                  </span>
                </div>
              )}
              {moodBonus.stableStorageBoost > 0 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: MOOD_COLORS.stable }}
                    />
                    <span className="text-gray-600">稳定</span>
                  </span>
                  <span className="font-semibold" style={{ color: MOOD_COLORS.stable }}>
                    蓄电池容量 +{Math.round(moodBonus.stableStorageBoost * 100)}%
                  </span>
                </div>
              )}
              {moodBonus.chaosPenalty > 0 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: MOOD_COLORS.chaos }}
                    />
                    <span className="text-gray-600">混乱</span>
                  </span>
                  <span className="font-semibold" style={{ color: MOOD_COLORS.chaos }}>
                    加成 -{Math.round(moodBonus.chaosPenalty * 100)}%
                  </span>
                </div>
              )}
              {moodBonus.regions.length === 0 && (
                <div className="text-center text-gray-400 text-sm py-2">
                  暂无情绪共鸣
                </div>
              )}
              <div className="text-xs text-gray-500 pt-2 border-t">
                共 {moodBonus.regions.length} 个共鸣区域
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-700">⚡ 电力概况</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">发电量</span>
                <span className="font-semibold text-green-600">+{totalGeneration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">耗电量</span>
                <span className="font-semibold text-red-500">-{totalConsumption}</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="text-gray-600">净电力</span>
                <span className={`font-bold ${netPower >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {netPower >= 0 ? '+' : ''}{netPower}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">蓄电池</span>
                <span className="font-semibold text-amber-600">
                  {Math.round(storedPower)}/{maxStorage} ({Math.round(storagePercent)}%)
                </span>
              </div>
            </div>
          </div>

          {faultyCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
              <p className="text-sm text-red-600 font-semibold">
                ⚠️ 当前有 {faultyCount} 处故障需要维修！
              </p>
            </div>
          )}

          <button
            onClick={closeSettlement}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02]"
          >
            继续游戏
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
