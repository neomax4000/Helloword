import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import timing from '../public/timing.json';
import replicaTiming from '../public/replica/timing.json';
import {Replica} from './replica';
import {Narrador} from './narrador';
import {Interes} from './interes';
import {Inflacion} from './inflacion';
import inflacionData from '../public/inflacion/words.json';
import {Ipab} from './ipab';
import {Buro} from './buro';
import buroData from '../public/buro/words.json';
import {Tasa} from './tasa';
import {CatEdu} from './catedu';
import {Afore as AforeVid} from './afore';
import aforeData from '../public/afore/words.json';
import tasaData from '../public/tasa/words.json';
import catEduData from '../public/catedu/words.json';
import {Cat} from './cat';
import {Glosario} from './glosario';
import {Liquidez} from './liquidez';
import {Diversificar} from './diversificar';
import {Value} from './value';
import {Bucle} from './bucle';
import bucleData from '../public/bucle/words.json';
import valueData from '../public/value/words.json';
import divData from '../public/diversificar/words.json';
import {Cetes} from './cetes';
import cetesData from '../public/cetes/words.json';
import catData from '../public/cat/words.json';
import liqData from '../public/liquidez/words.json';
import ipabData from '../public/ipab/words.json';
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
import {Actiren, AR2_TOTAL} from './actiren';
import {Acti500, A5_TOTAL} from './acti500';
import {Actieur, AU_TOTAL} from './actieur';
import {Actiai, AU_TOTAL as AI_TOTAL} from './actiai';
import {Actirvt, AU_TOTAL as RVT_TOTAL} from './actirvt';
import {Jpmrvus, AU_TOTAL as JPM_TOTAL} from './jpmrvus';
import {Nomina, AU_TOTAL as NOM_TOTAL} from './nomina';
import {Pasact, PA_TOTAL} from './pasact';
import {VacAd, VA_TOTAL} from './vacad';
import {Protege, PR_TOTAL} from './protege';
import {Actdual, AD_TOTAL} from './actdual';
import {Orion, OR_TOTAL} from './orion';
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

const InflacionMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['400', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Inflacion />;
};

const GlosarioMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Glosario />;
};

const LiquidezMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Liquidez />;
};

const DiversificarMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Diversificar />;
};

const ValueMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Value />;
};

const CetesMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Cetes />;
};

const CatMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['400', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Cat />;
};

const IpabMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['400', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Ipab />;
};

const BuroMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['400', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Buro />;
};

const TasaMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['400', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Tasa />;
};

const AforeMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['400', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <AforeVid />;
};
const CatEduMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['400', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <CatEdu />;
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
const OrionMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Orion />;
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
const ActirenMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Actiren />;
};
const Acti500Main: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Acti500 />;
};
const ActieurMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Actieur />;
};
const ActiaiMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Actiai />;
};
const ActirvtMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Actirvt />;
};
const JpmrvusMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Jpmrvus />;
};
const NominaMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '500', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Nomina />;
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
const VacAdMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['300', '400', '600', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <VacAd />;
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
  Orion: {tag: 'SERIE DEUDA EN PESOS · 3', light: 'Fondo', bold: 'ORION', sub: '¿Y si las tasas bajan?', icon: 'chart'},
  Activar: {tag: 'RENTA VARIABLE LOCAL · 1', light: 'Fondo', bold: 'ACTIVAR', sub: 'La bolsa mexicana en un solo fondo', icon: 'chart'},
  Maya: {tag: 'RENTA VARIABLE LOCAL · 2', light: '¿Seguir al índice', bold: 'o superarlo?', sub: 'ACTIVAR y MAYA, frente a frente', icon: 'chart'},
  Acticre: {tag: 'RENTA VARIABLE LOCAL · 3', light: 'Fondo', bold: 'ACTICRE', sub: '¿Habías escuchado de la inversión en valor?', icon: 'chart'},
  Actied: {tag: 'RENTA VARIABLE LOCAL · 4', light: 'Fondo', bold: 'ACTIED', sub: '¿Crees que el nearshoring va a cambiar a México?', icon: 'path'},
  Actiren: {tag: 'SERIE DEUDA EN PESOS · 1', light: 'Fondo', bold: 'ACTIREN', sub: '¿Dinero que vas a necesitar pronto?', icon: 'coins'},
  Acti500: {tag: 'DATO ACTINVER', light: 'Fondo', bold: 'ACTI500', sub: 'Las 500 empresas más grandes de EE.UU.', icon: 'chart'},
  Actieur: {tag: 'DATO ACTINVER', light: 'Fondo', bold: 'ACTIEUR', sub: '¿Solo piensas en el dólar?', icon: 'coins'},
  Actiai: {tag: 'DATO ACTINVER', light: 'Fondo', bold: 'ACTIAI', sub: '¿Y si inviertes en la IA?', icon: 'chart'},
  Actirvt: {tag: 'DATO ACTINVER', light: 'Fondo', bold: 'ACTIRVT', sub: '¿Bolsa con protección de capital?', icon: 'shield'},
  Nomina: {tag: 'TUTORIAL APP', light: 'Trae tu nómina', bold: 'a Actinver', sub: 'Gratis y desde tu app', icon: 'phone'},
  Jpmrvus: {tag: 'DATO ACTINVER', light: 'Fondo', bold: 'JPMRVUS', sub: 'Value o growth: no tienes que elegir', icon: 'chart'},
  Pasact: {tag: 'FINANZAS FÁCILES', light: 'Fondo pasivo', bold: 'vs fondo activo', sub: 'Piloto automático o piloto manual', icon: 'chart'},
  VacAd: {tag: 'ACTINVER · ZURICH', light: 'Vida Ahorro', bold: 'Creciente', sub: 'Seguro de vida con ahorro', icon: 'coins'},
  Inflacion: {tag: 'FINANZAS FÁCILES', light: '¿Tu dinero en el', bold: 'colchón pierde valor?', sub: 'Qué es la inflación, explicado fácil', icon: 'coins', logo: false, pal: {bg1: '#0E1024', bg2: '#2A2F5A', acc: '#FFC857', tagText: '#1B1F3B'}},
  Ipab: {tag: 'FINANZAS FÁCILES', light: '¿El IPAB de verdad', bold: 'protege tu dinero?', sub: 'Qué cubre y qué no, explicado fácil', icon: 'shield', logo: false, pal: {bg1: '#0E1024', bg2: '#2A2F5A', acc: '#FFC857', tagText: '#1B1F3B'}},
  Buro: {tag: 'FINANZAS FÁCILES', light: '¿El Buró de Crédito es una', bold: 'lista negra?', sub: 'Qué es y cómo revisar el tuyo', icon: 'shield', logo: false, pal: {bg1: '#0E1024', bg2: '#2A2F5A', acc: '#FFC857', tagText: '#1B1F3B'}},
  Afore: {tag: 'FINANZAS FÁCILES', light: 'Tu Afore maneja', bold: 'dinero que es tuyo', sub: 'Qué es y quién la maneja, explicado fácil', icon: 'shield', logo: false, pal: {bg1: '#0E1024', bg2: '#2A2F5A', acc: '#FFC857', tagText: '#1B1F3B'}},
  CatEdu: {tag: 'FINANZAS FÁCILES', light: 'Misma tasa,', bold: 'distinto costo', sub: 'El CAT, explicado fácil', icon: 'coins', logo: false, pal: {bg1: '#0E1024', bg2: '#2A2F5A', acc: '#FFC857', tagText: '#1B1F3B'}},
  Tasa: {tag: 'FINANZAS FÁCILES', light: '¿Qué es la', bold: 'tasa de interés?', sub: 'El precio del dinero, explicado fácil', icon: 'coins', logo: false, pal: {bg1: '#0E1024', bg2: '#2A2F5A', acc: '#FFC857', tagText: '#1B1F3B'}},
  Cat: {tag: 'GLOSARIO FINANCIERO', light: 'Tu crédito cuesta', bold: 'más que su tasa', sub: 'El CAT, explicado en 20 segundos', icon: 'coins', logo: false, pal: {bg1: '#0E1024', bg2: '#2A2F5A', acc: '#FFC857', tagText: '#1B1F3B'}},
  Glosario: {tag: 'GLOSARIO FINANCIERO', light: 'Tu crédito cuesta', bold: 'más que su tasa', sub: 'El CAT, explicado en 20 segundos', icon: 'coins', logo: false, theme: 'light'},
  Diversificar: {tag: 'GLOSARIO FINANCIERO', light: 'No todo en', bold: 'un solo lugar', sub: 'Diversificar, explicado en 20 segundos', icon: 'coins', logo: false, theme: 'light'},
  Liquidez: {tag: 'GLOSARIO FINANCIERO', light: 'Tu dinero atrapado', bold: 'no te salva', sub: 'La liquidez, explicada en 20 segundos', icon: 'coins', logo: false, theme: 'light'},
  Bucle: {tag: 'GLOSARIO FINANCIERO', light: 'Tu dinero guardado', bold: 'pierde valor', sub: 'Inflación en bucle', icon: 'coins', logo: false, theme: 'light'},
  Value: {tag: 'GLOSARIO FINANCIERO', light: 'Barato no siempre', bold: 'es buen negocio', sub: 'Value, explicado en 20 segundos', icon: 'coins', logo: false, theme: 'light'},
  Cetes: {tag: 'GLOSARIO FINANCIERO', light: '¿Puedes prestarle dinero', bold: 'al gobierno?', sub: 'Los Cetes, explicados en 20 segundos', icon: 'coins', logo: false, theme: 'light'},
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
const OrionC = cv(COVERS.Orion, OrionMain);
const ActivarC = cv(COVERS.Activar, ActivarMain);
const MayaC = cv(COVERS.Maya, MayaMain);
const ActicreC = cv(COVERS.Acticre, ActicreMain);
const ActiedC = cv(COVERS.Actied, ActiedMain);
const ActirenC = cv(COVERS.Actiren, ActirenMain);
const Acti500C = cv(COVERS.Acti500, Acti500Main);
const ActieurC = cv(COVERS.Actieur, ActieurMain);
const ActiaiC = cv(COVERS.Actiai, ActiaiMain);
const ActirvtC = cv(COVERS.Actirvt, ActirvtMain);
const JpmrvusC = cv(COVERS.Jpmrvus, JpmrvusMain);
const NominaC = cv(COVERS.Nomina, NominaMain);
const PasactC = cv(COVERS.Pasact, PasactMain);
const VacAdC = cv(COVERS.VacAd, VacAdMain);
const InflacionC = cv(COVERS.Inflacion, InflacionMain);
const IpabC = cv(COVERS.Ipab, IpabMain);
const BuroC = cv(COVERS.Buro, BuroMain);
const TasaC = cv(COVERS.Tasa, TasaMain);
const AforeC = cv(COVERS.Afore, AforeMain);
const CatEduC = cv(COVERS.CatEdu, CatEduMain);
const CatC = cv(COVERS.Cat, CatMain);
const GlosarioC = cv(COVERS.Glosario, GlosarioMain);
const LiquidezC = cv(COVERS.Liquidez, LiquidezMain);
const DiversificarC = cv(COVERS.Diversificar, DiversificarMain);
const BucleMain: React.FC = () => {
  const [handle] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all(['400', '700'].map((w) => (document as any).fonts.load(`${w} 40px Poppins`)))
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);
  return <Bucle />;
};
const BucleC = cv(COVERS.Bucle, BucleMain);
const ValueC = cv(COVERS.Value, ValueMain);
const CetesC = cv(COVERS.Cetes, CetesMain);
const Sp500C = cv(COVERS.Sp500, Sp500Main), BancaC = cv(COVERS.Banca, BancaMain), InteresC = cv(COVERS.Interes, InteresMain), NarradorC = cv(COVERS.Narrador, NarradorMain);

export const Root: React.FC = () => (
  <>
    <Composition id="Bienvenida" component={Main} durationInFrames={sec(timing.total)} fps={FPS} width={W} height={H} />
    <Composition id="Replica" component={ReplicaMain} durationInFrames={sec(replicaTiming.total)} fps={FPS} width={W} height={H} />
    <Composition id="Sp500" component={Sp500Main} durationInFrames={sec(SP_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="Banca" component={BancaMain} durationInFrames={sec(bancaData.total)} fps={FPS} width={W} height={H} />
    <Composition id="Ipab" component={IpabMain} durationInFrames={sec(ipabData.total)} fps={FPS} width={W} height={H} />
    <Composition id="Afore" component={AforeMain} durationInFrames={sec(aforeData.total)} fps={FPS} width={W} height={H} />
    <Composition id="CatEdu" component={CatEduMain} durationInFrames={sec(catEduData.total)} fps={FPS} width={W} height={H} />
    <Composition id="Tasa" component={TasaMain} durationInFrames={sec(tasaData.total)} fps={FPS} width={W} height={H} />
    <Composition id="Buro" component={BuroMain} durationInFrames={sec(buroData.total)} fps={FPS} width={W} height={H} />
    <Composition id="Cat" component={CatMain} durationInFrames={sec(catData.total)} fps={FPS} width={W} height={H} />
    <Composition id="Cetes" component={CetesMain} durationInFrames={sec(cetesData.total)} fps={FPS} width={W} height={H} />
    <Composition id="Liquidez" component={LiquidezMain} durationInFrames={sec(liqData.total)} fps={FPS} width={W} height={H} />
    <Composition id="Bucle" component={BucleMain} durationInFrames={sec(bucleData.total)} fps={FPS} width={W} height={H} />
    <Composition id="Value" component={ValueMain} durationInFrames={sec(valueData.total)} fps={FPS} width={W} height={H} />
    <Composition id="Diversificar" component={DiversificarMain} durationInFrames={sec(divData.total)} fps={FPS} width={W} height={H} />
    <Composition id="Glosario" component={GlosarioMain} durationInFrames={sec(catData.total)} fps={FPS} width={W} height={H} />
    <Composition id="Inflacion" component={InflacionMain} durationInFrames={sec(inflacionData.total)} fps={FPS} width={W} height={H} />
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
    <Composition id="Orion" component={OrionMain} durationInFrames={sec(OR_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="OrionC" component={OrionC} durationInFrames={sec(OR_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Activar" component={ActivarMain} durationInFrames={sec(AV_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ActivarC" component={ActivarC} durationInFrames={sec(AV_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Maya" component={MayaMain} durationInFrames={sec(MY_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="MayaC" component={MayaC} durationInFrames={sec(MY_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Acticre" component={ActicreMain} durationInFrames={sec(AR_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ActicreC" component={ActicreC} durationInFrames={sec(AR_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Actied" component={ActiedMain} durationInFrames={sec(AE_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ActiedC" component={ActiedC} durationInFrames={sec(AE_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Actiren" component={ActirenMain} durationInFrames={sec(AR2_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ActirenC" component={ActirenC} durationInFrames={sec(AR2_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Acti500" component={Acti500Main} durationInFrames={sec(A5_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="Acti500C" component={Acti500C} durationInFrames={sec(A5_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Actieur" component={ActieurMain} durationInFrames={sec(AU_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ActieurC" component={ActieurC} durationInFrames={sec(AU_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Actiai" component={ActiaiMain} durationInFrames={sec(AI_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ActiaiC" component={ActiaiC} durationInFrames={sec(AI_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Actirvt" component={ActirvtMain} durationInFrames={sec(RVT_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="ActirvtC" component={ActirvtC} durationInFrames={sec(RVT_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Nomina" component={NominaMain} durationInFrames={sec(NOM_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="NominaC" component={NominaC} durationInFrames={sec(NOM_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Jpmrvus" component={JpmrvusMain} durationInFrames={sec(JPM_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="JpmrvusC" component={JpmrvusC} durationInFrames={sec(JPM_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Pasact" component={PasactMain} durationInFrames={sec(PA_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="PasactC" component={PasactC} durationInFrames={sec(PA_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="VacAd" component={VacAdMain} durationInFrames={sec(VA_TOTAL)} fps={FPS} width={W} height={H} />
    <Composition id="VacAdC" component={VacAdC} durationInFrames={sec(VA_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Sp500C" component={Sp500C} durationInFrames={sec(SP_TOTAL) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="BancaC" component={BancaC} durationInFrames={sec(bancaData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="InflacionC" component={InflacionC} durationInFrames={sec(inflacionData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="IpabC" component={IpabC} durationInFrames={sec(ipabData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="AforeC" component={AforeC} durationInFrames={sec(aforeData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="CatEduC" component={CatEduC} durationInFrames={sec(catEduData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="TasaC" component={TasaC} durationInFrames={sec(tasaData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="BuroC" component={BuroC} durationInFrames={sec(buroData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="CatC" component={CatC} durationInFrames={sec(catData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="CetesC" component={CetesC} durationInFrames={sec(cetesData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="LiquidezC" component={LiquidezC} durationInFrames={sec(liqData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="BucleC" component={BucleC} durationInFrames={sec(bucleData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="ValueC" component={ValueC} durationInFrames={sec(valueData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="DiversificarC" component={DiversificarC} durationInFrames={sec(divData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="GlosarioC" component={GlosarioC} durationInFrames={sec(catData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="InteresC" component={InteresC} durationInFrames={sec(interesData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="NarradorC" component={NarradorC} durationInFrames={sec(narrData.total) + COVER_FRAMES} fps={FPS} width={W} height={H} />
  </>
);
