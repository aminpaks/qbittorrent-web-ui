import Color from 'color';

export const colorAlpha = (color: string, alpha: number) => Color(color).alpha(alpha).rgb();
