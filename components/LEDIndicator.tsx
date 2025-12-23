
import React from 'react';

interface LEDIndicatorProps {
  active: boolean;
  color: 'red' | 'green' | 'yellow';
  label: string;
}

const LEDIndicator: React.FC<LEDIndicatorProps> = ({ active, color, label }) => {
  const colorClasses = {
    red: active ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-red-950',
    green: active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-green-950',
    yellow: active ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]' : 'bg-yellow-950',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div className={`w-3 h-3 rounded-full border border-gray-600 transition-all duration-300 ${colorClasses[color]}`} />
      <span className="text-[10px] uppercase font-bold text-gray-400 text-center leading-none px-1">
        {label}
      </span>
    </div>
  );
};

export default LEDIndicator;
