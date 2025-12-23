
import React from 'react';
import { BoilerState, FaultCode } from '../types';
import LEDIndicator from './LEDIndicator';

interface Props {
  state: BoilerState;
  onToggle: (key: keyof BoilerState) => void;
  onSetTemp: (stage: 1 | 2, value: number) => void;
  onSetOperationMode: (mode: BoilerState['operationMode']) => void;
  onTriggerFault: (fault: FaultCode) => void;
  onReset: () => void;
}

const ControlPanelStandart: React.FC<Props> = ({ state, onToggle, onSetTemp, onSetOperationMode, onTriggerFault, onReset }) => {
  const modes: { id: BoilerState['operationMode']; label: string }[] = [
    { id: 'autonomous', label: 'АВТО' },
    { id: 'cascade', label: 'КАСКАД' },
    { id: 'test', label: 'ТЕСТ' },
    { id: 'manual', label: 'РУЧН' },
  ];

  return (
    <div className="bg-[#2a2a2e] p-6 rounded-xl border-4 border-gray-700 shadow-2xl w-full max-w-2xl mx-auto select-none">
      <div className="flex justify-between items-start mb-8 border-b border-gray-600 pb-4">
        <div>
          <h2 className="text-2xl font-black text-gray-300 italic">Hot•Well</h2>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Серия Standart A/E</p>
        </div>
        <div className="flex gap-4">
           <LEDIndicator active={state.isOn && state.isBurner1Active} color="green" label="1-я ступ." />
           <LEDIndicator active={state.isOn && state.isBurner2Active} color="green" label="2-я ступ." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Левая сторона: Управление */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <button 
              onClick={() => onToggle('isOn')}
              className={`flex-1 p-3 rounded font-bold transition-all border-b-4 ${state.isOn ? 'bg-red-600 border-red-800 text-white shadow-inner translate-y-1' : 'bg-gray-700 border-gray-900 text-gray-400 hover:bg-gray-600'}`}
            >
              СЕТЬ
            </button>
            <button 
              onClick={() => onToggle('mode')}
              className={`flex-1 p-3 rounded font-bold transition-all border-b-4 bg-gray-700 border-gray-900 text-gray-300 hover:bg-gray-600`}
            >
              {state.mode === 'winter' ? 'ЗИМА' : 'ЛЕТО'}
            </button>
          </div>

          {/* Переключатель режимов работы */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Режим работы системы</label>
            <div className="grid grid-cols-4 gap-1 bg-black/30 p-1 rounded-lg border border-gray-800">
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSetOperationMode(m.id)}
                  className={`py-2 px-1 rounded text-[9px] font-black transition-all ${
                    state.operationMode === m.id 
                    ? 'bg-blue-600 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]' 
                    : 'text-gray-600 hover:text-gray-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#1e1e22] p-4 rounded border border-gray-800 space-y-4">
             <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-400 uppercase">Термостат 1 ст. ({state.targetTemp1}°C)</label>
                <input 
                  type="range" min="30" max="90" value={state.targetTemp1} 
                  onChange={(e) => onSetTemp(1, parseInt(e.target.value))}
                  className="w-32 accent-blue-500"
                />
             </div>
             <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-400 uppercase">Термостат 2 ст. ({state.targetTemp2}°C)</label>
                <input 
                  type="range" min="30" max="90" value={state.targetTemp2} 
                  onChange={(e) => onSetTemp(2, parseInt(e.target.value))}
                  className="w-32 accent-blue-500"
                />
             </div>
          </div>
        </div>

        {/* Правая сторона: Индикаторы и дисплей */}
        <div className="flex flex-col gap-6">
          <div className="bg-black p-4 rounded border-2 border-gray-800 flex justify-center items-center h-24">
            <div className="text-4xl font-mono text-blue-400">
              {state.isOn ? `${state.currentTemp.toFixed(1)}°C` : '--.-'}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 bg-gray-800 p-3 rounded">
            <button 
              onClick={() => onTriggerFault(FaultCode.E6)}
              className="hover:scale-105 transition-transform"
              title="Симулировать ошибку газа"
            >
              <LEDIndicator active={state.gasLocked} color="red" label="ГАЗ" />
            </button>
            <button 
              onClick={() => onTriggerFault(FaultCode.E7)}
              className="hover:scale-105 transition-transform"
              title="Симулировать ошибку тяги"
            >
              <LEDIndicator active={state.draftLocked} color="red" label="ТЯГА" />
            </button>
            <button 
              onClick={() => onTriggerFault(FaultCode.E4)}
              className="hover:scale-105 transition-transform"
              title="Симулировать ошибку розжига"
            >
              <LEDIndicator active={state.flameLocked} color="red" label="ПЛАМЯ" />
            </button>
            <button 
              onClick={() => onTriggerFault(FaultCode.E9)}
              className="hover:scale-105 transition-transform"
              title="Симулировать перегрев"
            >
              <LEDIndicator active={state.overheatLocked} color="red" label="ПЕРЕГРЕВ" />
            </button>
          </div>
          
          <button 
            onClick={onReset}
            className="w-full py-2 bg-gray-600 hover:bg-gray-500 rounded text-xs font-bold uppercase shadow-lg transition-colors border-b-2 border-gray-800"
          >
            Сброс блокировки
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanelStandart;
