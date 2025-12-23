
import React from 'react';
import { BoilerState, FaultCode } from '../types';
import LEDIndicator from './LEDIndicator';

interface Props {
  state: BoilerState;
  onToggle: (key: keyof BoilerState) => void;
  onSetTemp: (stage: 1 | 2, delta: number) => void;
  onTriggerFault: (fault: FaultCode) => void;
  onReset: () => void;
}

const ControlPanelSmart: React.FC<Props> = ({ state, onToggle, onSetTemp, onTriggerFault, onReset }) => {
  const displayValue = state.fault !== FaultCode.NONE 
    ? state.fault.split(':')[0] 
    : state.isOn ? `${Math.round(state.currentTemp)}` : '';

  return (
    <div className="bg-[#343438] p-6 rounded-2xl border-x-8 border-b-8 border-t-2 border-gray-600 shadow-2xl w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black text-white italic tracking-tighter">Hot•Well</h2>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Контроллер</span>
          <span className="text-sm font-bold text-gray-200 uppercase">Smart SL/SR</span>
        </div>
      </div>

      <div className="bg-[#121214] p-8 rounded-lg border-2 border-gray-700 relative overflow-hidden">
        {/* Эффект свечения */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        
        <div className="grid grid-cols-12 gap-4">
          {/* Левые элементы управления */}
          <div className="col-span-3 flex flex-col justify-between">
            <button 
              onClick={() => onToggle('isOn')}
              className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${state.isOn ? 'bg-green-600 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-gray-800 border-gray-600'}`}
              title="Вкл/Выкл"
            >
              <i className="fa-solid fa-power-off text-white"></i>
            </button>
            <div className="space-y-2 mt-4">
              <LEDIndicator active={state.isOn && state.isBurner1Active} color="green" label="I ст." />
              <LEDIndicator active={state.isOn && state.isBurner2Active} color="green" label="II ст." />
            </div>
          </div>

          {/* Центральный дисплей */}
          <div className="col-span-6 flex flex-col items-center justify-center">
            <div className="bg-[#0a0a0c] w-full h-32 rounded-lg border border-gray-800 flex items-center justify-center shadow-inner">
               <span className={`text-6xl font-mono font-bold tracking-widest ${state.fault ? 'text-red-500' : 'text-green-500'} drop-shadow-[0_0_5px_currentColor]`}>
                  {displayValue || '··'}
               </span>
            </div>
            <div className="flex gap-4 mt-4 w-full justify-center">
              <button onClick={() => onSetTemp(1, -1)} className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center border-b-2 border-gray-900"><i className="fa-solid fa-minus"></i></button>
              <button onClick={() => onSetTemp(1, 1)} className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center border-b-2 border-gray-900"><i className="fa-solid fa-plus"></i></button>
            </div>
          </div>

          {/* Правый статус */}
          <div className="col-span-3 flex flex-col justify-between items-end">
            <div className="space-y-2">
              <button onClick={() => onTriggerFault(FaultCode.E6)} className="w-full">
                <LEDIndicator active={state.gasLocked} color="red" label="ГАЗ" />
              </button>
              <button onClick={() => onTriggerFault(FaultCode.E7)} className="w-full">
                <LEDIndicator active={state.draftLocked} color="red" label="ТЯГА" />
              </button>
              <button onClick={() => onTriggerFault(FaultCode.E4)} className="w-full">
                <LEDIndicator active={state.flameLocked} color="red" label="ПЛАМЯ" />
              </button>
            </div>
            <button 
              onClick={onReset}
              className="px-3 py-1 bg-red-900 hover:bg-red-800 text-[10px] text-white font-bold uppercase rounded border border-red-700 transition-colors shadow-lg"
            >
              СБРОС
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">
         <span>Микропроцессорное управление</span>
         <span>Статус системы: {state.isOn ? 'Активен' : 'Ожидание'}</span>
      </div>
    </div>
  );
};

export default ControlPanelSmart;
