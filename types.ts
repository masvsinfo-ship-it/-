
export type CalcMode = 'toMurubba' | 'toPieces' | 'toPiecesFromMeter' | 'toMurubbaFromPieces';

export interface CalculationResult {
  calcMode: CalcMode;
  length: number;
  width: number;
  heightCm: number;
  quantity: number;
  totalVolumeM3: number;
  totalMurubba: number;
  totalAreaM2: number;
  piecesPerMurubba: number;
  piecesPerMeter: number;
  targetValue?: number; // Can be targetMurubba, targetMeter, or targetPieces
  totalLinearMeter?: number;
}

export interface HistoryItem extends CalculationResult {
  id: string;
  timestamp: number;
  label?: string;
}
