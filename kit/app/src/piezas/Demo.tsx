// Demo de verificación de las piezas (no es un video publicable).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop} from '../pro';
import {RecetaVideo, Receta} from './Receta';

export const receta: Receta = {
  moods: [{at: 0, mood: 'navy'}, {at: 4, mood: 'plum'}, {at: 8, mood: 'forest'}],
  escenas: [
    {a: 0, b: 4, piezas: [
      {pieza: 'Duelo', props: {at: 0.2, a: {etiqueta: 'HACE UN AÑO', valor: '7.05 %', sub: 'CETES a 28 días', color: '#2C5AA8'}, b: {etiqueta: 'HOY', valor: '6.20 %', sub: 'CETES a 28 días', color: '#FF5A5F'}}},
      {pieza: 'StickerLegal', props: {texto: 'Ejemplo · revisa la vigente', at: 1.5, y: 1500}},
      {pieza: 'Personaje', props: {quien: 'puerquito', vista: 'front', expr: 'sorpresa', x: 900, y: 1700, alto: 300, at: 1}},
    ]},
    {a: 4, b: 8, piezas: [
      {pieza: 'Contador', props: {desde: 10, hasta: 13780, at: 4.2, dur: 2.5, y: 330, etiqueta: 'AL FINAL DEL AÑO'}},
      {pieza: 'Cuenta', props: {y: 700, titulo: 'La cuenta', filas: [{at: 5, izq: '52 semanas', der: '×'}, {at: 5.6, izq: 'Promedio', der: '$265'}, {at: 6.3, izq: 'Total', der: '$13,780', color: '#0B8F5B', fuerte: true}]}},
      {pieza: 'Personaje', props: {quien: 'anfitrion', vista: 'moneda', x: 540, y: 1780, alto: 520, at: 5}},
    ]},
    {a: 8, piezas: [
      {pieza: 'LineaTiempo', props: {top: 300, nodos: [{at: 8.2, titulo: 'Día 1', detalle: 'Se vence el pago'}, {at: 9, titulo: 'Día 30', detalle: 'Intereses', color: '#FF5A5F'}, {at: 9.8, titulo: 'Día 90', detalle: 'Reporte', color: '#7FB2FF'}]}},
      {pieza: 'Personaje', props: {quien: 'puerquito', vista: 'front', expr: 'dormido', x: 540, y: 1650, alto: 320, at: 10.5}},
    ]},
  ],
};

export const DemoPiezas: React.FC = () => (
  <AbsoluteFill>
    <RecetaVideo receta={receta} />
  </AbsoluteFill>
);
