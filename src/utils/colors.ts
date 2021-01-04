import Color from 'color';

export const colorAlpha = (color: string, alpha: number) => Color(color).rgb().alpha(alpha).rgb();

export const color = (color: string) => Color(color);
