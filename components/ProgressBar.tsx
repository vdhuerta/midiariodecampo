import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const cappedProgress = Math.max(0, Math.min(progress, 100));

  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
      <div
        className="bg-sky-600 h-2.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${cappedProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
