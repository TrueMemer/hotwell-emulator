
import React from 'react';
import { FaultCode } from '../types';

const Documentation: React.FC = () => {
  return (
    <div className="bg-gray-800 text-gray-200 p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Заголовок */}
      <section className="border-b border-gray-700 pb-6 text-center">
        <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Технический Паспорт и Руководство</h1>
        <p className="text-blue-400 font-bold tracking-widest uppercase text-sm">Газовые водогрейные котлы серии Hot-Well (Standart / Smart)</p>
      </section>

      {/* Схематический чертеж (SVG) */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fa-solid fa-drafting-compass text-blue-500"></i>
          1. Схема устройства
        </h2>
        <div className="bg-[#1a1a1c] p-10 rounded-xl border border-gray-900 flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2">
            <svg viewBox="0 0 400 500" className="w-full h-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              {/* Корпус */}
              <rect x="50" y="50" width="300" height="400" rx="10" fill="none" stroke="#4b5563" strokeWidth="4" />
              <line x1="50" y1="120" x2="350" y2="120" stroke="#4b5563" strokeWidth="2" strokeDasharray="5,5" />
              
              {/* Теплообменник */}
              <path d="M 80 150 L 320 150 L 320 180 L 80 180 Z" fill="#1e3a8a" opacity="0.4" />
              <path d="M 80 200 L 320 200 L 320 230 L 80 230 Z" fill="#1e3a8a" opacity="0.4" />
              <text x="120" y="170" fill="#93c5fd" fontSize="12" fontWeight="bold">ПЕРВИЧНЫЙ ТЕПЛООБМЕННИК</text>

              {/* Горелки */}
              <rect x="100" y="380" width="200" height="20" rx="5" fill="#374151" />
              <path d="M 110 375 Q 120 350 130 375 T 150 375 T 170 375 T 190 375 T 210 375 T 230 375 T 250 375 T 270 375 T 290 375" fill="none" stroke="#fb923c" strokeWidth="2" className="animate-pulse" />
              <text x="145" y="415" fill="#f97316" fontSize="10" fontWeight="bold">ГОРЕЛОЧНОЕ УСТРОЙСТВО</text>

              {/* Дымоход */}
              <rect x="150" y="10" width="100" height="40" fill="none" stroke="#4b5563" strokeWidth="3" />
              <text x="175" y="35" fill="#6b7280" fontSize="10">ДЫМОХОД</text>

              {/* Насос */}
              <circle cx="320" cy="420" r="20" fill="none" stroke="#10b981" strokeWidth="3" />
              <path d="M 310 420 L 330 420 M 320 410 L 320 430" stroke="#10b981" strokeWidth="2" />
              <text x="350" y="425" fill="#34d399" fontSize="10">НАСОС</text>
            </svg>
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <h3 className="text-lg font-bold text-blue-400">Основные узлы:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2 items-start"><span className="text-blue-500 font-bold">1.</span> Жаротрубный теплообменник с турбулизаторами для повышения КПД.</li>
              <li className="flex gap-2 items-start"><span className="text-blue-500 font-bold">2.</span> Атмосферная газовая горелка с модуляцией пламени (2 ступени).</li>
              <li className="flex gap-2 items-start"><span className="text-blue-500 font-bold">3.</span> Прессостат тяги для контроля отвода продуктов сгорания.</li>
              <li className="flex gap-2 items-start"><span className="text-blue-500 font-bold">4.</span> Датчик перегрева (STB) — механический размыкатель при 95°C.</li>
              <li className="flex gap-2 items-start"><span className="text-blue-500 font-bold">5.</span> Электронный блок управления (Smart SL/SR).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Логика работы */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fa-solid fa-gears text-blue-500"></i>
          2. Логика управления
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-snowflake text-blue-400"></i>
              Режим "ЗИМА"
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Котёл работает на отопление и ГВС (через внешний бойлер). 
              Поддерживается заданная температура теплоносителя. 
              При падении температуры ниже <span className="text-white">T1</span> включается 1-я ступень горелки. 
              Если падение продолжается ниже <span className="text-white">T2</span>, подключается 2-я ступень для форсированного нагрева.
            </p>
          </div>
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-sun text-yellow-400"></i>
              Режим "ЛЕТО"
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Работа на отопление отключена. Система активна только для поддержания готовности или работы в паре с внешним бойлером косвенного нагрева. 
              Циркуляционный насос включается периодически (защита от заклинивания).
            </p>
          </div>
        </div>
      </section>

      {/* Ошибки */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
          3. Таблица кодов неисправностей
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700">
                <th className="p-4 text-blue-400">Код</th>
                <th className="p-4 text-blue-400">Описание</th>
                <th className="p-4 text-blue-400">Причины и действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="p-4 font-mono font-bold text-red-400">E1</td>
                <td className="p-4">Ошибка клавиатуры</td>
                <td className="p-4 text-gray-400">Залипание кнопок или обрыв шлейфа. Перезагрузите питание.</td>
              </tr>
              <tr>
                <td className="p-4 font-mono font-bold text-red-400">E4</td>
                <td className="p-4">Отсутствие розжига</td>
                <td className="p-4 text-gray-400">Закрыт газовый кран, загрязнен электрод или неисправен трансформатор розжига.</td>
              </tr>
              <tr>
                <td className="p-4 font-mono font-bold text-red-400">E6</td>
                <td className="p-4">Низкое давление газа</td>
                <td className="p-4 text-gray-400">Сработал датчик минимального давления. Проверить входящую магистраль.</td>
              </tr>
              <tr>
                <td className="p-4 font-mono font-bold text-red-400">E7</td>
                <td className="p-4">Нет тяги</td>
                <td className="p-4 text-gray-400">Засорен дымоход или неисправен вентилятор (для серии E). Остановка через 2 мин.</td>
              </tr>
              <tr>
                <td className="p-4 font-mono font-bold text-red-400">E9</td>
                <td className="p-4">Перегрев (&gt;95°C)</td>
                <td className="p-4 text-gray-400">Сработал термостат STB. Требуется ручной сброс на датчике и на панели.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Полезная информация */}
      <section className="bg-blue-900/10 border border-blue-800/50 p-6 rounded-xl">
        <h2 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-lightbulb"></i>
          Важные примечания
        </h2>
        <div className="text-sm text-gray-300 space-y-3 leading-relaxed">
          <p>• Для моделей <span className="font-bold text-white">Standart</span> сброс блокировок осуществляется кнопкой на передней панели.</p>
          <p>• Модели <span className="font-bold text-white">Smart</span> позволяют объединять до 8 котлов в каскад без дополнительных модулей.</p>
          <p>• Минимальное давление в системе отопления: <span className="text-white">0.8 бар</span>. Максимальное: <span className="text-white">3.0 бар</span>.</p>
        </div>
      </section>
    </div>
  );
};

export default Documentation;
