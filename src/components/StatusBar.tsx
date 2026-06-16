import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Sun, Moon, Zap, Battery, Smile, Meh, Frown, Sparkles } from 'lucide-react';
import { MOOD_COLORS, MOOD_NAMES } from '../utils/constants';

export const StatusBar: React.FC = () => {
  const {
    dayTime,
    totalGeneration,
    totalConsumption,
    storedPower,
    maxStorage,
    satisfaction,
    moodBonus,
    openSettlement,
  } = useGameStore();

  const isDay = dayTime < 50;
  const netPower = totalGeneration - totalConsumption;
  const storagePercent = maxStorage > 0 ? (storedPower / maxStorage) * 100 : 0;

  const getSatisfactionIcon = () => {
    if (satisfaction >= 70) return <Smile className="w-5 h-5 text-green-500" />;
    if (satisfaction >= 40) return <Meh className="w-5 h-5 text-yellow-500" />;
    return <Frown className="w-5 h-5 text-red-500" />;
  };

  const getSatisfactionText = () => {
    if (satisfaction >= 80) return '非常满意';
    if (satisfaction >= 60) return '比较满意';
    if (satisfaction >= 40) return '一般';
    if (satisfaction >= 20) return '不太满意';
    return '非常不满';
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
              isDay ? 'bg-yellow-100' : 'bg-indigo-900'
            }`}
          >
            {isDay ? (
              <Sun className="w-6 h-6 text-yellow-500 animate-pulse" />
            ) : (
              <Moon className="w-6 h-6 text-indigo-300" />
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500">{isDay ? '白天' : '夜晚'}</p>
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${dayTime}%`,
                  background: isDay
                    ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
                    : 'linear-gradient(90deg, #6366F1, #4338CA)',
                }}
              />
            </div>
          </div>
        </div>

        <div className="h-10 w-px bg-gray-200" />

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">电力</p>
            <p className="text-sm font-bold">
              <span className="text-green-600">+{totalGeneration}</span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-red-500">-{totalConsumption}</span>
            </p>
            <p
              className={`text-xs font-semibold ${
                netPower >= 0 ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {netPower >= 0 ? '▲' : '▼'} {Math.abs(netPower)}
            </p>
          </div>
        </div>

        <div className="h-10 w-px bg-gray-200" />

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <Battery className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">蓄电池</p>
            <p className="text-sm font-bold text-gray-700">
              {Math.round(storedPower)} / {maxStorage}
            </p>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${storagePercent}%`,
                  background:
                    storagePercent > 60
                      ? 'linear-gradient(90deg, #34D399, #10B981)'
                      : storagePercent > 30
                      ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
                      : 'linear-gradient(90deg, #F87171, #EF4444)',
                }}
              />
            </div>
          </div>
        </div>

        <div className="h-10 w-px bg-gray-200" />

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
            {getSatisfactionIcon()}
          </div>
          <div>
            <p className="text-xs text-gray-500">居民满意度</p>
            <p className="text-sm font-bold text-gray-700">{getSatisfactionText()}</p>
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${satisfaction}%`,
                  background:
                    satisfaction >= 60
                      ? 'linear-gradient(90deg, #34D399, #10B981)'
                      : satisfaction >= 30
                      ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
                      : 'linear-gradient(90deg, #F87171, #EF4444)',
                }}
              />
            </div>
          </div>
        </div>

        <div className="h-10 w-px bg-gray-200" />

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">情绪共鸣</p>
            <div className="flex gap-1.5 items-center">
              {moodBonus.calmConsumptionReduction > 0 && (
                <div
                  className="text-xs font-semibold px-1.5 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${MOOD_COLORS.calm}20`,
                    color: MOOD_COLORS.calm,
                  }}
                  title="安宁：降低住房耗电"
                >
                  安宁 -{Math.round(moodBonus.calmConsumptionReduction * 100)}%
                </div>
              )}
              {moodBonus.focusOutputBoost > 0 && (
                <div
                  className="text-xs font-semibold px-1.5 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${MOOD_COLORS.focus}20`,
                    color: MOOD_COLORS.focus,
                  }}
                  title="专注：降低工坊耗电，提升产出效率"
                >
                  专注 +{Math.round(moodBonus.focusOutputBoost * 100)}%
                </div>
              )}
              {moodBonus.vitalityDayGenBoost > 0 && (
                <div
                  className="text-xs font-semibold px-1.5 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${MOOD_COLORS.vitality}20`,
                    color: MOOD_COLORS.vitality,
                  }}
                  title="活力：提升白天发电"
                >
                  活力 +{Math.round(moodBonus.vitalityDayGenBoost * 100)}%
                </div>
              )}
              {moodBonus.stableStorageBoost > 0 && (
                <div
                  className="text-xs font-semibold px-1.5 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${MOOD_COLORS.stable}20`,
                    color: MOOD_COLORS.stable,
                  }}
                  title="稳定：增加蓄电池容量"
                >
                  稳定 +{Math.round(moodBonus.stableStorageBoost * 100)}%
                </div>
              )}
              {moodBonus.chaosPenalty > 0 && (
                <div
                  className="text-xs font-semibold px-1.5 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${MOOD_COLORS.chaos}20`,
                    color: MOOD_COLORS.chaos,
                  }}
                  title="混乱：布局混杂，加成降低"
                >
                  混乱 -{Math.round(moodBonus.chaosPenalty * 100)}%
                </div>
              )}
              {moodBonus.regions.length === 0 && (
                <span className="text-xs text-gray-400">无共鸣</span>
              )}
            </div>
          </div>
        </div>

        <div className="h-10 w-px bg-gray-200" />

        <button
          onClick={openSettlement}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 text-sm"
        >
          📊 结算
        </button>
      </div>
    </div>
  );
};
