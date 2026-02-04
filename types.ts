
// types.ts: Shared type definitions for the Stone Calculator application

export type CalcMode = 'toMurubba' | 'toMurubbaFromPieces' | 'toPieces' | 'toPiecesFromMeter';
export type Language = 'bn' | 'en' | 'hi' | 'ar';

export interface UserProfile {
  name: string;
  mobile: string;
  isLoggedIn: boolean;
}

export interface CalculationResult {
  calcMode: CalcMode;
  inputUnit: 'metric';
  length: number;
  width: number;
  height: number;
  quantity: number;
  totalVolumeM3: number;
  totalMurubba: number;
  totalArea: number;
  piecesPerMurubba: number;
  piecesPerLinearUnit: number;
  targetValue: number;
  totalLinearUnit: number;
  unitPrice: number;
  totalPrice: number;
  estimatedWeightTon: number;
}

export interface HistoryItem extends CalculationResult {
  id: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isMine: boolean;
}
