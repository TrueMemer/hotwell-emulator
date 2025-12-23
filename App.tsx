
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BoilerState, BoilerModel, FaultCode } from './types';
import ControlPanelStandart from './components/ControlPanelStandart';
import ControlPanelSmart from './components/ControlPanelSmart';
import Documentation from './components/Documentation';
import { getTechnicalSupport } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'emulator' | 'documentation'>('emulator');
  const [model, setModel] = useState<BoilerModel>(BoilerModel.STANDART);
  const [state, setState] = useState<BoilerState>({
    isOn: false,
    currentTemp: 20.5,
    targetTemp1: 55,
    targetTemp2: 45,
    isBurner1Active: false,
    isBurner2Active: false,
    isPumpActive: false,
    fault: FaultCode.NONE,
    mode: 'winter',
    operationMode: 'autonomous',
    flameLocked: false,
    draftLocked: false,
    gasLocked: false,
    overheatLocked: false,
  });

  const [aiSupport, setAiSupport] = useState<string>('');
  const [loadingSupport, setLoadingSupport] = useState(false);

  // Параметры симуляции
  const coolingRate = 0.05; // Потеря градусов в секунду
  const heatingRate1 = 0.25; // Прирост градусов в секунду (1 ступень)
  const heatingRate2 = 0.45; // Прирост градусов в секунду (2 ступени суммарно)

  // Цикл симуляции
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        if (!prev.isOn || prev.fault !== FaultCode.NONE) {
          // Пассивное охлаждение, если выключен или ошибка
          return {
            ...prev,
            currentTemp: Math.max(18, prev.currentTemp - coolingRate),
            isBurner1Active: false,
            isBurner2Active: false,
            isPumpActive: false
          };
        }

        let nextTemp = prev.currentTemp - coolingRate;
        let b1 = false;
        let b2 = false;

        // Логика работы горелок
        if (prev.currentTemp < prev.targetTemp1) {
          b1 = true;
          nextTemp += heatingRate1;
        }

        if (prev.currentTemp < prev.targetTemp2) {
          b2 = true;
          nextTemp += (heatingRate2 - heatingRate1);
        }

        // Защита: Перегрев
        if (nextTemp > 95) {
          return {
            ...prev,
            currentTemp: nextTemp,
            fault: FaultCode.E9,
            overheatLocked: true,
            isBurner1Active: false,
            isBurner2Active: false,
            isOn: false
          };
        }

        return {
          ...prev,
          currentTemp: nextTemp,
          isBurner1Active: b1,
          isBurner2Active: b2,
          isPumpActive: true
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = (key: keyof BoilerState) => {
    setState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSetTemp = (stage: 1 | 2, value: number) => {
    if (stage === 1) {
      setState(prev => ({ ...prev, targetTemp1: value }));
    } else {
      setState(prev => ({ ...prev, targetTemp2: value }));
    }
  };

  const handleSetOperationMode = (mode: BoilerState['operationMode']) => {
    setState(prev => ({ ...prev, operationMode: mode }));
  };

  const handleSmartTemp = (stage: 1 | 2, delta: number) => {
    setState(prev => ({
      ...prev,
      targetTemp1: Math.min(90, Math.max(30, prev.targetTemp1 + delta)),
      targetTemp2: Math.min(prev.targetTemp1, Math.max(30, prev.targetTemp2 + delta))
    }));
  };

  const handleReset = () => {
    setState(prev => ({
      ...prev,
      fault: FaultCode.NONE,
      flameLocked: false,
      draftLocked: false,
      gasLocked: false,
      overheatLocked: false,
      isOn: true // Попытка перезапуска
    }));
    setAiSupport('');
  };

  const triggerFault = (fault: FaultCode) => {
    setState(prev => ({
      ...prev,
      fault,
      isOn: false,
      flameLocked: fault === FaultCode.E4 || fault === FaultCode.E3,
      draftLocked: fault === FaultCode.E7,
      gasLocked: fault === FaultCode.E6,
      overheatLocked: fault === FaultCode.E9
    }));
  };

  const askGemini = async () => {
    if (state.fault === FaultCode.NONE) return;
    setLoadingSupport(true);
    try {
      const advice = await getTechnicalSupport(state.fault, state);
      setAiSupport(advice || 'Нет ответа от AI');
    } catch (e) {
      setAiSupport('Ошибка подключения к сервису поддержки.');
    } finally {
      setLoadingSupport(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto flex flex-col gap-8">
      {/* Основная навигация */}
      <nav className="flex justify-center mb-4">
        <div className="bg-gray-800 p-1 rounded-xl border border-gray-700 flex gap-1">
          <button 
            onClick={() => setActiveView('emulator')}
            className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeView === 'emulator' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <i className="fa-solid fa-microchip"></i>
            Эмулятор
          </button>
          <button 
            onClick={() => setActiveView('documentation')}
            className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeView === 'documentation' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <i className="fa-solid fa-file-contract"></i>
            Документация
          </button>
        </div>
      </nav>

      {activeView === 'emulator' ? (
        <>
          {/* Шапка и выбор модели */}
          <header className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <div>
              <h1 className="text-3xl font-black text-blue-400 uppercase tracking-tighter">ЭМУЛЯТОР HOT-WELL</h1>
              <p className="text-sm text-gray-400 font-medium">Официальная техническая симуляция v1.0</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              {[BoilerModel.STANDART, BoilerModel.SMART].map(m => (
                <button
                  key={m}
                  onClick={() => setModel(m)}
                  className={`px-6 py-2 rounded-full font-bold transition-all border-2 ${model === m ? 'bg-blue-600 border-blue-400 text-white' : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </header>

          {/* Основная область симуляции */}
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-500">
            {/* Секция панели управления */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {model === BoilerModel.STANDART ? (
                <ControlPanelStandart 
                  state={state} 
                  onToggle={handleToggle} 
                  onSetTemp={handleSetTemp} 
                  onSetOperationMode={handleSetOperationMode}
                  onTriggerFault={triggerFault}
                  onReset={handleReset} 
                />
              ) : (
                <ControlPanelSmart 
                  state={state} 
                  onToggle={handleToggle} 
                  onSetTemp={handleSmartTemp} 
                  onTriggerFault={triggerFault}
                  onReset={handleReset} 
                />
              )}

              {/* Инъектор ошибок */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-inner">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                   <i className="fa-solid fa-circle-info text-blue-400"></i>
                   Управление неисправностями
                </h3>
                <p className="text-xs text-gray-500 mb-4 italic">
                  Вы также можете инициировать ошибки, нажимая на индикаторы ГАЗ, ТЯГА, ПЛАМЯ или ПЕРЕГРЕВ непосредственно на панели управления котла.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => triggerFault(FaultCode.E4)} className="px-3 py-2 bg-gray-700 hover:bg-red-900/50 rounded text-xs font-mono transition-colors border border-gray-600">Симул. E4 (Розжиг)</button>
                  <button onClick={() => triggerFault(FaultCode.E6)} className="px-3 py-2 bg-gray-700 hover:bg-red-900/50 rounded text-xs font-mono transition-colors border border-gray-600">Симул. E6 (Газ)</button>
                  <button onClick={() => triggerFault(FaultCode.E7)} className="px-3 py-2 bg-gray-700 hover:bg-red-900/50 rounded text-xs font-mono transition-colors border border-gray-600">Симул. E7 (Тяга)</button>
                  <button onClick={() => triggerFault(FaultCode.E9)} className="px-3 py-2 bg-gray-700 hover:bg-red-900/50 rounded text-xs font-mono transition-colors border border-gray-600">Симул. E9 (Перегрев)</button>
                  <button onClick={() => triggerFault(FaultCode.E2)} className="px-3 py-2 bg-gray-700 hover:bg-red-900/50 rounded text-xs font-mono transition-colors border border-gray-600">Симул. E2 (Датчик)</button>
                </div>
              </div>
            </div>

            {/* Секция диагностики */}
            <aside className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-full flex flex-col shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                   <i className="fa-solid fa-microchip text-blue-500"></i>
                   Статус системы
                </h3>
                <div className="space-y-4 text-sm flex-1">
                   <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-500">Состояние:</span>
                      <span className={state.isOn ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                        {state.isOn ? 'РАБОТА' : 'ОСТАНОВ'}
                      </span>
                   </div>
                   <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-500">Режим:</span>
                      <span className="text-gray-300 font-bold uppercase">{
                        state.operationMode === 'autonomous' ? 'Автономный' : 
                        state.operationMode === 'cascade' ? 'Каскад' : 
                        state.operationMode === 'test' ? 'Тест' : 'Ручной'
                      }</span>
                   </div>
                   <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-500">Темп. воды:</span>
                      <span className="text-blue-400 font-mono font-bold text-lg">{state.currentTemp.toFixed(1)}°C</span>
                   </div>
                   <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-500">Цирк. насос:</span>
                      <span className={state.isPumpActive ? 'text-green-400' : 'text-gray-600'}>
                        {state.isPumpActive ? 'АКТИВЕН' : 'ВЫКЛЮЧЕН'}
                      </span>
                   </div>
                   <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-500">Клапан 1 ст.:</span>
                      <span className={state.isBurner1Active ? 'text-orange-500 animate-pulse font-bold' : 'text-gray-600'}>
                        {state.isBurner1Active ? 'ОТКРЫТ' : 'ЗАКРЫТ'}
                      </span>
                   </div>
                   <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-500">Клапан 2 ст.:</span>
                      <span className={state.isBurner2Active ? 'text-orange-500 animate-pulse font-bold' : 'text-gray-600'}>
                        {state.isBurner2Active ? 'ОТКРЫТ' : 'ЗАКРЫТ'}
                      </span>
                   </div>
                </div>

                {state.fault && (
                  <div className="mt-8 bg-red-900/30 border border-red-500 p-4 rounded-lg animate-pulse">
                    <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
                      <i className="fa-solid fa-triangle-exclamation"></i>
                      <span>АВАРИЙНАЯ ОШИБКА</span>
                    </div>
                    <p className="text-sm font-mono text-red-100 mb-4 p-2 bg-red-900/40 rounded border border-red-800/50">
                      {state.fault}
                    </p>
                    <button 
                      onClick={askGemini}
                      disabled={loadingSupport}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs uppercase disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      {loadingSupport ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-robot"></i>}
                      Спросить AI-инженера
                    </button>
                  </div>
                )}
              </div>

              {aiSupport && (
                <div className="bg-blue-900/20 border border-blue-500 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl">
                  <h4 className="text-sm font-bold text-blue-300 uppercase mb-3 flex items-center gap-2">
                    <i className="fa-solid fa-comment-medical text-blue-400"></i>
                    Анализ сервисного инженера
                  </h4>
                  <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-medium italic">
                    {aiSupport}
                  </div>
                </div>
              )}
            </aside>
          </main>
        </>
      ) : (
        <Documentation />
      )}

      {/* Технический подвал */}
      <footer className="text-center text-gray-600 text-[10px] mt-auto py-8 uppercase tracking-widest border-t border-gray-800">
        <p>© 2024 Промышленные котлы Hot-Well | Официальный симулятор контроллера</p>
        <p className="mt-2 text-gray-700">Все права защищены. Использование эмулятора допустимо только в рамках обучения персонала.</p>
      </footer>
    </div>
  );
};

export default App;
