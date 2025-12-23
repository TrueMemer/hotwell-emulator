
export enum BoilerModel {
  STANDART = 'Standart',
  SMART = 'Smart',
  INTELLECT = 'Intellect'
}

export enum FaultCode {
  NONE = '',
  E0 = 'E0: Ошибка контрольной суммы',
  E1 = 'E1: Неисправность клавиатуры',
  E2 = 'E2: Отказ датчика температуры',
  E3 = 'E3: Пламя при закрытых клапанах',
  E4 = 'E4: Ошибка розжига',
  E5 = 'E5: Систематическое угасание пламени',
  E6 = 'E6: Ошибка давления газа',
  E7 = 'E7: Ошибка тяги',
  E8 = 'E8: Систематический перегрев',
  E9 = 'E9: Критический перегрев',
  EA = 'EA: Множественные блокировки (>30 мин)'
}

export interface BoilerState {
  isOn: boolean;
  currentTemp: number;
  targetTemp1: number;
  targetTemp2: number;
  isBurner1Active: boolean;
  isBurner2Active: boolean;
  isPumpActive: boolean;
  fault: FaultCode;
  mode: 'winter' | 'summer';
  operationMode: 'autonomous' | 'cascade' | 'test' | 'manual';
  flameLocked: boolean;
  draftLocked: boolean;
  gasLocked: boolean;
  overheatLocked: boolean;
}
