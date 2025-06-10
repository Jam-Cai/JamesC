import { useMemo } from 'react';

// Memoized color interpolation
export const interpolateRGB = (dayRGB: number[], nightRGB: number[], progress: number): number[] => {
  const r = Math.round(dayRGB[0] + (nightRGB[0] - dayRGB[0]) * progress);
  const g = Math.round(dayRGB[1] + (nightRGB[1] - dayRGB[1]) * progress);
  const b = Math.round(dayRGB[2] + (nightRGB[2] - dayRGB[2]) * progress);
  return [r, g, b];
};

export const useGradualColors = (progress: number) => {
  return useMemo(() => {
    // Day and night color definitions
    const dayColors = {
      cardBg: [[255, 255, 255, 0.2], [255, 255, 255, 0.1]],
      techBg: [[251, 146, 60], [239, 68, 68]],
      dateText: [251, 146, 60],
    };
    
    const nightColors = {
      cardBg: [[55, 65, 81, 0.4], [17, 24, 39, 0.4]],
      techBg: [[147, 51, 234], [37, 99, 235]],
      dateText: [196, 181, 253],
    };
    
    // Calculate interpolated colors
    const cardBgStart = interpolateRGB(dayColors.cardBg[0].slice(0, 3), nightColors.cardBg[0].slice(0, 3), progress);
    const cardBgEnd = interpolateRGB(dayColors.cardBg[1].slice(0, 3), nightColors.cardBg[1].slice(0, 3), progress);
    const cardOpacity = dayColors.cardBg[0][3] + (nightColors.cardBg[0][3] - dayColors.cardBg[0][3]) * progress;
    
    const techBgStart = interpolateRGB(dayColors.techBg[0], nightColors.techBg[0], progress);
    const techBgEnd = interpolateRGB(dayColors.techBg[1], nightColors.techBg[1], progress);
    
    const dateTextColor = interpolateRGB(dayColors.dateText, nightColors.dateText, progress);
    
    return {
      cardBg: `linear-gradient(135deg, rgba(${cardBgStart.join(',')}, ${cardOpacity}), rgba(${cardBgEnd.join(',')}, ${cardOpacity}))`,
      techBg: `linear-gradient(90deg, rgb(${techBgStart.join(',')}), rgb(${techBgEnd.join(',')}))`,
      dateColor: `rgb(${dateTextColor.join(',')})`,
    };
  }, [progress]);
}; 