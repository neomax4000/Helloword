export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const C = {
  bg0: '#03070F',
  bg1: '#041E42',
  text: '#F5F3EE',
  mute: '#B4BCCB',
  gold: '#B3A369',
  goldDeep: '#8F8250',
  blue: '#86A4F2',
  appBg: '#0A1018',
  field: '#202733',
  grey: '#626262',
  ok: '#79D2B0',
};

export const FONT = '"Poppins", system-ui, -apple-system, "Segoe UI", sans-serif';

// pantalla del teléfono (mismo aspecto que la captura de la app)
export const SC_W = 540;
export const SC_H = 968;
export const K = 540 / 1206; // factor captura -> pantalla

export const sec = (s: number) => Math.round(s * FPS);
