import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import timing from '../public/timing.json';
import replicaTiming from '../public/replica/timing.json';
import {Replica} from './replica';
import {Narrador} from './narrador';
import {Interes} from './interes';
import {Banca} from './banca';
import {Sp500, SP_TOTAL} from './sp500';
import {Actigob, AG_TOTAL} from './actigob';
import {Fondos, FD_TOTAL} from './fondos';
import {Actimed, AM_TOTAL} from './actimed';
import {Vac, VC_TOTAL} from './vac';
import {Compara, CP_TOTAL} from './compara';
import {Vac2, V2_TOTAL} from './vac2';
import {Acticob, AC_TOTAL} from './acticob';
import {Activar, AV_TOTAL} from './activar';
import {Maya, MY_TOTAL} from './maya';
import {Acticre, AR_TOTAL} from './acticre';
import {Actied, AE_TOTAL} from './actied';
import {Pasact, PA_TOTAL} from './pasact';
import {Protege, PR_TOTAL} from './protege';
import {Actdual, AD_TOTAL} from './actdual';
import bancaData from '../public/banca/words.json';
import interesData from '../public/interes/words.json';
import narrData from '../public/narrador/words.json';
import {Background} from './common';
import {COVER_FRAMES, CoverProps, WithCover} from './cover';
import {C, FPS, H, W, sec} from './theme';
import {Biometricos, Confirmar, Intro, Outro, Paso1, Paso2, Paso3, Permisos, Props, Sms} from './scenes';

const MAP: Record<string, React.FC<Props>> = {
  intro: Intro,
  paso1: Paso1,
  permisos: Permisos,
  paso2: Paso2,
  sms: Sms,
  paso3: Paso3,
  confirmar: Confirmar,
  biometricos: Biometricos,
  outro: Outro,
};

const Main: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);

  const scenes = timing.scenes as any[];
  return (
    <AbsoluteFill style={{background: C.bg0}}>
      <Background />
      {scenes.map((sc, i) => {
        const from = sec(sc.start);
        const dur = sec(sc.end) - from + (i < scenes.length - 1 ? 8 : 0);
        const Comp = MAP[sc.id];
        return (
          <Sequence key={sc.id} from={from} durationInFrames={dur}>
            <Comp sc={sc} dur={dur} first={i === 0} last={i === scenes.length - 1} />
          </Sequence>
        );
      })}
      <Audio src={staticFile('narracion.wav')} />
    </AbsoluteFill>
  );
};

const ReplicaMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['400', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Replica />;
};

const Sp500Main: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Sp500 />;
};

const BancaMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Banca />;
};

const InteresMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['400', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Interes />;
};

const NarradorMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Narrador />;
};

const ActigobMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Actigob />;
};
const FondosMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700', '800'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Fondos />;
};
const ActimedMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Actimed />;
};
const VacMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Vac />;
};
const ComparaMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Compara />;
};
const Vac2Main: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Vac2 />;
};
const ActicobMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Acticob />;
};
const ProtegeMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Protege />;
};
const ActdualMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Actdual />;
};
const ActivarMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Activar />;
};
const MayaMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Maya />;
};
const ActicreMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Acticre />;
};
const ActiedMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Actied />;
};
const PasactMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Pasact />;
};
const cv = (cover: CoverProps, C: React.FC) => () => <WithCover cover={cover}><C /></WithCover>;
const COVERS: Record<string, CoverProps> = {
  Sp500: {tag: 'DATO ACTINVER', light: 'El índice', bold: 'S&P 500', sub: '¿Qué es y por qué importa?', icon: 'chart'},
  Banca: {tag: 'TUTORIAL APP', light: 'Banca electrónica', bold: 'Desbloqueo', sub: 'Paso a paso, en segundos', icon: 'phone'},
  Interes: {tag: 'FINANZAS', light: 'Interés', bold: 'Compuesto', sub: 'El efecto bola de nieve', icon: 'coins', logo: false},
  Actigob: {tag: 'DATO ACTINVER', light: 'Fondo', bold: 'ACTIGOB', sub: 'Liquidez diaria, riesgo bajo', icon: 'shield'},
  Fondos: {tag: 'FINANZAS FÁCILES', light: '¿Qué es un', bold: 'fondo de inversión?', sub: 'Explicado con una canasta de fresas', icon: 'basket', logo: false, pal: {bg1: '#0E1024', bg2: '#2A2F5A', acc: '#FFC857', tagText: '#1B1F3B'}},
  Actimed: {tag: 'DATO ACTINVER', light: 'Fondo', bold: 'ACTIMED', sub: 'Para tus metas de 1 a 3 años', icon: 'path'},
  Vac: {tag: 'DATO ACTINVER', light: 'Vida Ahorro', bold: 'Creciente', sub: 'Protejo y ahorro a la vez', icon: 'shield'},
  Compara: {tag: 'DATO ACTINVER', light: 'Pagaré, CD', bold: 'o Fondos', sub: 'Ventajas y desventajas de cada uno', icon: 'chart'},
  Vac2: {tag: 'VAC · CAPÍTULO 2', light: '¿Y si un año', bold: 'no puedo pagar?', sub: 'Periodo de descanso, retiros y aportaciones', icon: 'shield'},
  Acticob: {tag: 'SERIE DEL DÓLAR · 1', light: 'Fondo', bold: 'ACTICOB', sub: 'Para tus gastos y metas en dólares', icon: 'coins'},
  Protege: {tag: 'SERIE DEL DÓLAR · 2', light: 'Fondo', bold: 'PROTEGE', sub: 'Deuda del gobierno de EE.UU.', icon: 'shield'},
  Actdual: {tag: 'SERIE DEL DÓLAR · 3', light: 'Fondo', bold: 'ACTDUAL', sub: '¿Pesos o dólares? ¿Y si no eliges?', icon: 'coins'},
  Activar: {tag: 'RENTA VARIABLE LOCAL · 1', light: 'Fondo', bold: 'ACTIVAR', sub: 'La bolsa mexicana en un solo fondo', icon: 'chart'},
  Maya: {tag: 'RENTA VARIABLE LOCAL · 2', light: '¿Seguir al índice', bold: 'o superarlo?', sub: 'ACTIVAR y MAYA, frente a frente', icon: 'chart'},
  Acticre: {tag: 'RENTA VARIABLE LOCAL · 3', light: 'Fondo', bold: 'ACTICRE', sub: '¿Habías escuchado de la inversión en valor?', icon: 'chart'},
  Actied: {tag: 'RENTA VARIABLE LOCAL · 4', light: 'Fondo', bold: 'ACTIED', sub: '¿Crees que el nearshoring va a cambiar a México?', icon: 'path'},
  Pasact: {tag: 'FINANZAS FÁCILES', light: 'Fondo pasivo', bold: 'vs fondo activo', sub: 'Piloto automático o piloto manual', icon: 'chart'},
  Narrador: {tag: 'MI HISTORIA', light: 'Mi', bold: 'Carrera', sub: 'Cómo llegué hasta aquí', icon: 'path', logo: false},
};
const FondosC = cv(COVERS.Fondos, FondosMain);
const ActigobC = cv(COVERS.Actigob, ActigobMain);
const ActimedC = cv(COVERS.Actimed, ActimedMain);
const VacC = cv(COVERS.Vac, VacMain);
const ComparaC = cv(COVERS.Compara, ComparaMain);
const Vac2C = cv(COVERS.Vac2, Vac2Main);
const ActicobC = cv(COVERS.Acticob, ActicobMain);
const ProtegeC = cv(COVERS.Protege, ProtegeMain);
const ActdualC = cv(COVERS.Actdual, ActdualMain);
const ActivarC = cv(COVERS.Activar, ActivarMain);
const MayaC = cv(COVERS.Maya, MayaMain);
const ActicreC = cv(COVERS.Acticre, ActicreMain);
const ActiedC = cv(COVERS.Actied, ActiedMain);
const PasactC = cv(COVERS.Pasact, PasactMain);
const Sp500C = cv(COVERS.Sp500, Sp500Main), BancaC = cv(COVERS.Banca, BancaMain), InteresC = cv(COVERS.Interes, InteresMain), NarradorC = cv(COVERS.Narrador, NarradorMain);

export const Root: React.FC = () => (
  <>
    <Composition id="Bienvenida" component={Main} durationInFrames={sec(timing.total)} fps={FPS} width={W} height={H} />
    <Composition id="Replica" component={ReplicaMain} durationInFrames={sec(replicaTiming.total)} fps={FPS} width={W} height={H} />
    <Composition id="Sp500" component={Sp500Main} durationInFrames={sec(SP_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="Banca" component={BancaMain} durationInFrames={sec(bancaData.total)} fps={FPS} width={W} height={H} />
    <Composition id="Interes" component={InteresMain} durationInFrames={sec(interesData.total)} fps={FPS} width={W} height={H} />
    <Composition id="Narrador" component={NarradorMain} durationInFrames={sec(narrData.total)} fps={FPS} width={W} height={H} />
    <Composition id="Fondos" component={FondosMain} durationInFrames={sec(FD_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="FondosC" component={FondosC} durationInFrames={sec(FD_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Actigob" component={ActigobMain} durationInFrames={sec(AG_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ActigobC" component={ActigobC} durationInFrames={sec(AG_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Actimed" component={ActimedMain} durationInFrames={sec(AM_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ActimedC" component={ActimedC} durationInFrames={sec(AM_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Vac" component={VacMain} durationInFrames={sec(VC_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="VacC" component={VacC} durationInFrames={sec(VC_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Compara" component={ComparaMain} durationInFrames={sec(CP_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ComparaC" component={ComparaC} durationInFrames={sec(CP_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Vac2" component={Vac2Main} durationInFrames={sec(V2_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="Vac2C" component={Vac2C} durationInFrames={sec(V2_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Acticob" component={ActicobMain} durationInFrames={sec(AC_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ActicobC" component={ActicobC} durationInFrames={sec(AC_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Protege" component={ProtegeMain} durationInFrames={sec(PR_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ProtegeC" component={ProtegeC} durationInFrames={sec(PR_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Actdual" component={ActdualMain} durationInFrames={sec(AD_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ActdualC" component={ActdualC} durationInFrames={sec(AD_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Activar" component={ActivarMain} durationInFrames={sec(AV_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ActivarC" component={ActivarC} durationInFrames={sec(AV_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Maya" component={MayaMain} durationInFrames={sec(MY_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="MayaC" component={MayaC} durationInFrames={sec(MY_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Acticre" component={ActicreMain} durationInFrames={sec(AR_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ActicreC" component={ActicreC} durationInFrames={sec(AR_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Actied" component={ActiedMain} durationInFrames={sec(AE_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ActiedC" component={ActiedC} durationInFrames={sec(AE_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Pasact" component={PasactMain} durationInFrames={sec(PA_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="PasactC" component={PasactC} durationInFrames={sec(PA_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Sp500C" component={Sp500C} durationInFrames={sec(SP_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="BancaC" component={BancaC} durationInFrames={sec(bancaData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="InteresC" component={InteresC} durationInFrames={sec(interesData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="NarradorC" component={NarradorC} durationInFrames={sec(narrData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
  </>
);
