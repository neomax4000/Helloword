// AFORE-SEMANAS — T03 de la semana de pruebas (26 nov 2026)
// Variables a probar: apertura = a mitad de la historia (chat ya empezado) · texto = medio, en burbujas ·
// estructura = caso con personaje (Ana, hipotético) · fondo = pantalla de chat (Remotion, sin marcas) · ~35-45 s · voz 3 + 5.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import data from '../public/afore-semanas/words.json';
import {Captions, Chip, FONT, FPS, Grain, Pop, Wd, buildGroups, cl, easeOut, lerp, prog, spr} from './pro';

const words = data.words as Wd[];
const blocks = data.blocks as {s: number; e: number}[];
export const AFORE_TOTAL = blocks[blocks.length - 1].e + 0.28;
const T = (i: number) => words[i].s;
const groups = buildGroups(words, blocks);
const KEYS = ['SETENTA', 'CINCO', 'SEMANAS', 'OCHOCIENTAS', 'TODAVÍA', 'MIL', 'COTIZANDO', 'IMSS', 'REVISA'];

const INK = '#1B2B2A';
const TEAL = '#0B4A44';
const GREEN = '#D5F5C8';
const RED = '#E5484D';
const GOLD = '#F2B43A';
const BG = '#E8DFD0';
const txt = (size: number, weight = 600, color = INK, ls = 0): React.CSSProperties => ({fontFamily: FONT, fontWeight: weight, fontSize: size, color, letterSpacing: `${ls}em`, lineHeight: 1.18});

/* ---------- burbujas ---------- */
const Bubble: React.FC<{side: 'in' | 'out'; children: React.ReactNode; pad?: string; bg?: string; w?: number}> = ({side, children, pad = '22px 30px 24px', bg, w}) => (
  <div style={{display: 'flex', justifyContent: side === 'in' ? 'flex-start' : 'flex-end'}}>
    <div style={{background: bg ?? (side === 'in' ? '#FFFFFF' : GREEN), borderRadius: side === 'in' ? '8px 34px 34px 34px' : '34px 8px 34px 34px', padding: pad, maxWidth: w ?? 760, boxShadow: '0 4px 0 rgba(0,0,0,0.12)'}}>{children}</div>
  </div>
);
const Meta: React.FC<{t: string}> = ({t}) => <span style={{...txt(24, 500, 'rgba(27,43,42,0.45)'), marginLeft: 16, float: 'right', marginTop: 14}}>{t}</span>;

type Msg = {at: number; node: React.ReactNode};
const Row: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const f = useCurrentFrame();
  const p = spr(f, at, 14, 190, 0.7);
  if (f / FPS < at - 0.001) return null;
  return (
    <div style={{display: 'grid', gridTemplateRows: `${cl(p, 0, 1.02)}fr`, opacity: cl(p * 2.2)}}>
      <div style={{minHeight: 0, overflow: 'hidden'}}>
        <div style={{paddingBottom: 26, transform: `scale(${lerp(0.88, 1, p)})`, transformOrigin: '0 100%'}}>{children}</div>
      </div>
    </div>
  );
};

const Dots: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Bubble side="in" pad="26px 34px">
      <div style={{display: 'flex', gap: 12}}>
        {[0, 1, 2].map((k) => (
          <span key={k} style={{width: 18, height: 18, borderRadius: 99, background: '#8A9A97', display: 'inline-block', transform: `translateY(${Math.sin(f / 4 - k * 0.9) * 7}px)`}} />
        ))}
      </div>
    </Bubble>
  );
};

/* ---------- tarjetas protagonistas dentro del chat ---------- */
const LeyCard: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const n = easeOut(prog(t, T(22), T(25) + 0.2));
  const fill = easeOut(prog(t, T(12), T(13) + 0.6));
  const gap = easeOut(prog(t, T(25) - 0.1, T(25) + 0.5));
  return (
    <Bubble side="in" w={900} pad="26px 34px 30px" bg="#FFF6DC">
      <div style={{...txt(30, 700, '#8A5A00', 0.14)}}>HOY LA LEY PIDE · 2026</div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 4}}>
        <span style={{...txt(170, 800, INK, -0.04), lineHeight: 1}}>{Math.round(875 * n)}</span>
        <span style={{...txt(52, 700, INK)}}>semanas</span>
      </div>
      <div style={{position: 'relative', height: 46, borderRadius: 23, background: 'rgba(27,43,42,0.12)', marginTop: 14, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * (800 / 875) * 100}%`, background: TEAL, borderRadius: 23}} />
        <div style={{position: 'absolute', top: 0, bottom: 0, left: `${(800 / 875) * 100}%`, width: `${gap * (75 / 875) * 100}%`, background: RED}} />
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12}}>
        <span style={{...txt(34, 700, TEAL)}}>800 de Ana</span>
        <span style={{...txt(34, 800, RED), opacity: gap}}>faltan 75</span>
      </div>
    </Bubble>
  );
};

const MetaCard: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const strike = easeOut(prog(t, T(48), T(48) + 0.45));
  const Col: React.FC<{lab: string; v: string; col: string; at: number; struck?: boolean}> = ({lab, v, col, at, struck}) => {
    const p = spr(f, at, 11, 220, 0.6);
    return (
      <div style={{flex: 1, textAlign: 'center', opacity: cl(p * 2), transform: `translateY(${(1 - p) * 40}px)`}}>
        <div style={{...txt(26, 700, 'rgba(27,43,42,0.55)', 0.14)}}>{lab}</div>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <div style={{...txt(78, 800, col, -0.03)}}>{v}</div>
          {struck && <div style={{position: 'absolute', left: -6, right: -6, top: '52%', height: 9, background: RED, borderRadius: 5, transform: `scaleX(${strike})`, transformOrigin: '0 50%'}} />}
        </div>
      </div>
    );
  };
  return (
    <Bubble side="out" w={900} pad="26px 24px 30px">
      <div style={{...txt(30, 700, '#2F6B2A', 0.14), paddingLeft: 10}}>LA META SUBE CADA AÑO</div>
      <div style={{display: 'flex', alignItems: 'flex-end', marginTop: 10, width: 840}}>
        <Col lab="ANTES" v="1,250" col="#6B7775" at={T(48) - 0.1} struck />
        <Col lab="HOY" v="875" col={TEAL} at={T(36)} />
        <Col lab="2031" v="1,000" col="#B5651D" at={T(40)} />
      </div>
    </Bubble>
  );
};

const CalcCard: React.FC<{a: number; b: number; big: string; small: string; col?: string}> = ({a, b, big, small, col = TEAL}) => {
  const f = useCurrentFrame();
  const p = spr(f, a, 12, 200, 0.6);
  return (
    <Bubble side="out" w={900} pad="24px 34px 28px">
      <div style={{...txt(34, 600, 'rgba(27,43,42,0.7)'), opacity: cl(p * 2)}}>{small}</div>
      <div style={{...txt(92, 800, col, -0.03), transform: `scale(${lerp(0.8, 1, spr(f, b, 10, 220, 0.6))})`, transformOrigin: '0 50%', opacity: cl(spr(f, b, 10, 220, 0.6) * 2)}}>{big}</div>
    </Bubble>
  );
};

/* ---------- chat ---------- */
const Chat: React.FC<{settled?: boolean}> = ({settled}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const S = settled ? -9 : 0;
  const msgs: Msg[] = [
    {at: -9, node: <Bubble side="in"><span style={txt(46)}>Hola, ya revisé mi cuenta del IMSS</span><Meta t="9:41" /></Bubble>},
    {at: -9, node: <Bubble side="out"><span style={txt(46)}>¿Y qué te dijeron?</span><Meta t="9:42 ✓✓" /></Bubble>},
    {at: S + T(0) - 0.05, node: <Bubble side="in"><span style={txt(52, 700)}>Ya fui al IMSS. Me faltan <b style={{color: RED}}>75 semanas</b></span><Meta t="9:43" /></Bubble>},
    {at: T(10) - 0.05, node: <Bubble side="out"><span style={txt(46)}>Llevas 800 semanas ≈ 15 años</span><br /><span style={{...txt(32, 600, 'rgba(27,43,42,0.6)')}}>800 ÷ 52 ≈ 15.4</span></Bubble>},
    {at: T(17) - 0.05, node: <LeyCard />},
    {at: T(26) - 0.05, node: <Bubble side="in"><span style={txt(50, 700)}>Todavía no me toca la pensión</span><Meta t="9:45" /></Bubble>},
    {at: T(35) - 0.05, node: <MetaCard />},
    {at: T(53) - 0.05, node: <Bubble side="in"><span style={txt(50, 700)}>Entonces sigo cotizando</span><Meta t="9:46" /></Bubble>},
    {at: T(58) - 0.05, node: <CalcCard a={T(58) - 0.05} b={T(68)} small="1 año ≈ 52 semanas · faltan 75" big="75 ÷ 52 ≈ 1.4 años" />},
    {at: T(75) - 0.05, node: <Bubble side="out" bg="#FFE1DF"><span style={txt(48, 700, '#9B1C22')}>Mes sin cotizar = 0 semanas</span></Bubble>},
  ];
  const typing = t < T(0) - 0.05 || t >= T(95) - 0.1 || settled;
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: 330, height: 860, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', maskImage: 'linear-gradient(180deg, transparent 0%, #000 12%)', WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 12%)'}}>
      {msgs.map((m, k) => (
        <Row key={k} at={m.at}>
          {m.node}
        </Row>
      ))}
      {typing && (
        <Row at={settled ? -9 : t >= T(95) - 0.1 ? T(95) - 0.1 : -9}>
          <Dots />
        </Row>
      )}
    </div>
  );
};

const Header: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 310, background: TEAL}} />
    <div style={{position: 'absolute', top: 96, left: 70, display: 'flex', alignItems: 'center', gap: 14, ...txt(26, 700, 'rgba(255,255,255,0.62)', 0.2)}}>
      <span style={{width: 16, height: 16, borderRadius: 99, background: GOLD, display: 'inline-block'}} />
      FINANZAS FÁCILES · TU AFORE
    </div>
    <div style={{position: 'absolute', left: 70, top: 168, display: 'flex', alignItems: 'center', gap: 26}}>
      <div style={{width: 100, height: 100, borderRadius: 99, background: '#F2B43A', display: 'flex', alignItems: 'center', justifyContent: 'center', ...txt(60, 800, TEAL)}}>A</div>
      <div>
        <div style={txt(50, 700, '#FFFFFF')}>Ana</div>
        <div style={txt(30, 500, 'rgba(255,255,255,0.7)')}>caso hipotético · en línea</div>
      </div>
    </div>
  </>
);

const Wall: React.FC = () => (
  <AbsoluteFill style={{background: BG}}>
    <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(11,74,68,0.09) 3px, transparent 3.6px)', backgroundSize: '70px 70px'}} />
  </AbsoluteFill>
);

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <>
      {t >= T(70) && (
        <div style={{position: 'absolute', right: 70, top: 190, opacity: cl(spr(f, T(70), 12, 200, 0.6) * 2), transform: `translateX(${(1 - spr(f, T(70), 12, 200, 0.6)) * 200}px)`}}>
          <Chip bg={GOLD} color={INK} size={26}>＋ SÍGUEME</Chip>
        </div>
      )}
      {t >= T(95) && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1215, display: 'flex', justifyContent: 'center', opacity: cl(spr(f, T(95), 12, 200, 0.6) * 2)}}>
          <Chip bg={TEAL} color="#FFFFFF" size={30}>¿YA SABES CUÁNTAS SEMANAS LLEVAS?</Chip>
        </div>
      )}
    </>
  );
};

const Foot: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, height: 10, width: `${(t / AFORE_TOTAL) * 100}%`, background: GOLD, borderRadius: '0 8px 8px 0'}} />
      <div style={{position: 'absolute', left: 70, right: 200, top: 1532, ...txt(23, 400, 'rgba(27,43,42,0.7)'), lineHeight: 1.3}}>
        Contenido educativo, no es recomendación de inversión. Caso hipotético. Fuentes: reforma de pensiones 2020 (CEFP, nota 090/2020); calendario de semanas 2026 (IMSS/Ley del Seguro Social).
      </div>
    </>
  );
};

export const AforeSemanasMain: React.FC<{audio?: boolean}> = ({audio = true}) => (
  <AbsoluteFill style={{background: BG}}>
    <Wall />
    <Chat />
    <Header />
    <Cta />
    <Grain />
    <Foot />
    <Captions groups={groups} keys={KEYS} />
    {audio && <Audio src={staticFile('afore-semanas/voz_mix.wav')} />}
  </AbsoluteFill>
);

export const AforeSemanasCover: React.FC = () => (
  <AbsoluteFill style={{background: BG}}>
    <Wall />
    <Chat settled />
    <Header />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1215, display: 'flex', justifyContent: 'center'}}>
      <Chip bg={TEAL} color="#FFFFFF" size={38}>TU AFORE · LAS SEMANAS</Chip>
    </div>
  </AbsoluteFill>
);
