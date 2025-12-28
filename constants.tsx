
import React from 'react';

export const COLORS = {
  terracotta: '#cc5500',
  sage: '#4b5e4c',
  midnight: '#0b0f1a',
  parchment: '#1e293b',
  gold: '#d4af37'
};

export const NativePattern: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`h-2 w-full opacity-40 ${className}`} style={{
    backgroundImage: `repeating-linear-gradient(45deg, ${COLORS.terracotta} 0, ${COLORS.terracotta} 10px, transparent 10px, transparent 20px)`
  }} />
);

export const WEEKLY_TOPICS = [
  "Week 1: My Sacred Space",
  "Week 2: River of Release",
  "Week 3: Mother’s Mirror",
  "Week 4: My Medicine Bundle"
];
