import {
  GridCell,
  GRID_SIZE,
  DIR_OFFSETS,
  BUILDING_MOOD,
  MoodType,
  MoodRegion,
  MoodBonus,
  MOOD_BONUS_THRESHOLDS,
  CHAOS_PENALTY,
} from './constants';

function getCellMood(cell: GridCell): MoodType {
  if (cell.faulty || cell.type === 'empty' || cell.type === 'wire') {
    return 'none';
  }
  return BUILDING_MOOD[cell.type];
}

function calculateRegionBonus(size: number): number {
  let bonus = 0;
  for (const threshold of MOOD_BONUS_THRESHOLDS) {
    if (size >= threshold.min) {
      bonus = threshold.bonus;
    }
  }
  return bonus;
}

function findMoodRegions(grid: GridCell[][]): MoodRegion[] {
  const visited = new Set<string>();
  const regions: MoodRegion[] = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const key = `${x},${y}`;
      if (visited.has(key)) continue;

      const cell = grid[y][x];
      const mood = getCellMood(cell);
      if (mood === 'none') continue;

      const regionCells: Array<{ x: number; y: number }> = [];
      const queue: Array<{ x: number; y: number }> = [{ x, y }];
      visited.add(key);

      while (queue.length > 0) {
        const current = queue.shift()!;
        regionCells.push(current);

        for (const [dx, dy] of DIR_OFFSETS) {
          const nx = current.x + dx;
          const ny = current.y + dy;

          if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) continue;

          const nKey = `${nx},${ny}`;
          if (visited.has(nKey)) continue;

          const neighbor = grid[ny][nx];
          const neighborMood = getCellMood(neighbor);

          if (neighborMood === mood) {
            visited.add(nKey);
            queue.push({ x: nx, y: ny });
          }
        }
      }

      if (regionCells.length >= 2) {
        const bonus = calculateRegionBonus(regionCells.length);
        regions.push({ mood, cells: regionCells, bonus });
      }
    }
  }

  return regions;
}

function calculateChaosPenalty(grid: GridCell[][]): number {
  const moodCounts: Record<MoodType, number> = {
    calm: 0,
    focus: 0,
    vitality: 0,
    chaos: 0,
    none: 0,
  };

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const cell = grid[y][x];
      const mood = getCellMood(cell);
      if (mood !== 'none') {
        moodCounts[mood]++;
      }
    }
  }

  const activeMoods = (['calm', 'focus', 'vitality'] as MoodType[]).filter(
    (m) => moodCounts[m] > 0
  );

  if (activeMoods.length >= 3) {
    return CHAOS_PENALTY;
  }

  return 0;
}

export function calculateMoodBonus(grid: GridCell[][]): MoodBonus {
  const regions = findMoodRegions(grid);
  const chaosPenalty = calculateChaosPenalty(grid);

  let calmConsumptionReduction = 0;
  let focusOutputBoost = 0;
  let vitalityDayGenBoost = 0;

  for (const region of regions) {
    const netBonus = Math.max(0, region.bonus - chaosPenalty);
    switch (region.mood) {
      case 'calm':
        calmConsumptionReduction = Math.max(calmConsumptionReduction, netBonus);
        break;
      case 'focus':
        focusOutputBoost = Math.max(focusOutputBoost, netBonus);
        break;
      case 'vitality':
        vitalityDayGenBoost = Math.max(vitalityDayGenBoost, netBonus);
        break;
    }
  }

  return {
    calmConsumptionReduction,
    focusOutputBoost,
    vitalityDayGenBoost,
    chaosPenalty,
    regions,
  };
}

export function getCellRegionIndex(
  x: number,
  y: number,
  regions: MoodRegion[]
): number {
  for (let i = 0; i < regions.length; i++) {
    if (regions[i].cells.some((c) => c.x === x && c.y === y)) {
      return i;
    }
  }
  return -1;
}
