"""Calcula las estaciones de «Deconstruyendo los fondos» (guion 1) a partir de words.json y las deja en
kit/app/public/deconstruyendo-fondos/estaciones.json, además de los efectos (sfx) del guion.
Cada bloque 6–28 es una estación: problema (letrero rosa) → solución (insignia con el símbolo) → nombre (sello) → medalla en el tablero.
Correr después de voz/alinear:  python3 estaciones_fondos.py"""
import json, re, unicodedata
from comun import guion, public
vid = 'deconstruyendo-fondos'
d = json.load(open(public(vid) / 'words.json'))
W, B = d['words'], d['blocks']
nz = lambda s: re.sub(r'[^a-zñ0-9]', '', unicodedata.normalize('NFC', s.lower()).translate(str.maketrans('áéíóú', 'aeiou')))
# (bloque, término hablado, problema [líneas], nombre [líneas], símbolo)
E = [
 (6, 'títulos', ['CADA UNO', 'PUSO DISTINTO'], ['TÍTULOS'], 'pie'),
 (7, 'fondo de inversión', ['SIN PERMISO'], ['FONDO DE', 'INVERSIÓN'], 'jar'),
 (8, 'sociedad operadora', ['NO PUEDE', 'COMPRAR'], ['SOCIEDAD', 'OPERADORA'], 'gear'),
 (9, 'política de inversión', ['SIN ACUERDO'], ['POLÍTICA DE', 'INVERSIÓN'], 'balanza'),
 (10, 'custodio', ['SIN DÓNDE', 'GUARDARLO'], ['CUSTODIO'], 'caja'),
 (11, 'registro de títulos', ['NO SE SABE', 'DE QUIÉN ES'], ['REGISTRO', 'DE TÍTULOS'], 'lista'),
 (12, 'comité de inversión', ['USA EL DINERO', 'EN OTRA COSA'], ['COMITÉ DE', 'INVERSIÓN'], 'ojo'),
 (13, 'área de cumplimiento', ['SE SALE DE', 'LOS LÍMITES'], ['ÁREA DE', 'CUMPLIMIENTO'], 'escudo'),
 (14, 'precio del título', ['EL DINERO', 'CRECE'], ['PRECIO DEL', 'TÍTULO'], 'etiqueta'),
 (15, 'valuación', ['EL PRECIO', 'CAMBIA'], ['VALUACIÓN'], 'calculadora'),
 (16, 'proveedor de precios', ['SIN PRECIO', 'CLARO'], ['PROVEEDOR', 'DE PRECIOS'], 'lupa'),
 (17, 'casa de bolsa', ['SIN DÓNDE', 'COMPRAR'], ['CASA DE', 'BOLSA'], 'tienda'),
 (18, 'suscripción', ['DINERO A', 'TÍTULOS'], ['SUSCRIPCIÓN'], 'flechaEntra'),
 (19, 'reembolso', ['QUIERE', 'SALIR'], ['REEMBOLSO'], 'flechaSale'),
 (20, 'activos líquidos', ['FALTA', 'EFECTIVO'], ['ACTIVOS', 'LÍQUIDOS'], 'gota'),
 (21, 'hora de corte', ['LLEGA', 'TARDE'], ['HORA DE', 'CORTE'], 'reloj'),
 (22, 'plazo de liquidación', ['EL PAGO', 'NO ES HOY'], ['PLAZO DE', 'LIQUIDACIÓN'], 'calendario'),
 (23, 'comisión de administración', ['ADMINISTRAR', 'CUESTA'], ['COMISIÓN DE', 'ADMINISTRACIÓN'], 'porcentaje'),
 (24, 'reinversión', ['GENERA', 'INTERESES'], ['REINVERSIÓN'], 'ciclo'),
 (25, 'retención de impuestos', ['CADA GANANCIA', 'PAGA IMPUESTO'], ['RETENCIÓN DE', 'IMPUESTOS'], 'edificio'),
 (26, 'constancia fiscal', ['HAY QUE', 'COMPROBARLO'], ['CONSTANCIA', 'FISCAL'], 'recibo'),
 (27, 'prospecto', ['HAY QUE', 'CONOCERLO'], ['PROSPECTO'], 'libro'),
 (28, 'regulador', ['TODO DEBE', 'CUMPLIRSE'], ['REGULADOR'], 'bandera'),
]
st, sfx = [], []
for k, term, prob, nom, gl in E:
    ws = [w for w in W if w['b'] == k]
    toks = [nz(x) for x in term.split()]
    idx = None
    for i in range(len(ws) - len(toks) + 1):
        if [nz(w['w']) for w in ws[i:i + len(toks)]] == toks:
            idx = i  # última aparición
    assert idx is not None, term
    name_i = ws[idx]['i']
    solve = next((ws[i + 1]['s'] for i, w in enumerate(ws[:-1]) if w['w'].endswith('.')), ws[idx]['s'])
    bs = B[k]['s']
    appear = min(bs + 1.5, solve - 0.9)
    st.append({'k': k, 'prob': prob, 'nom': nom, 'glyph': gl, 'ws': round(bs - 0.35, 3), 'appear': round(appear, 3), 'solve': round(solve, 3),
               'nameI': name_i, 'name': ws[idx]['s'], 'dock': round(ws[idx]['s'] + 0.45, 3), 'end': B[k]['e']})
    A = B[k]['s'] - 0.1
    sfx += [{'tipo': 'pop', 'bloque': k, 'dt': round(appear - A, 3), 'db': -12},
            {'tipo': 'stamp', 'palabra': name_i, 'dt': -0.05, 'db': -12},
            {'tipo': 'ding', 'palabra': name_i, 'dt': 0.45, 'db': -16}]
# cierre: palabras de la lista (índice en words.json) → medalla
cl = [w for w in W if w['b'] == 29]
orden = [('inversionistas', 0), ('títulos', 2), ('sociedad', 4), ('política', 5), ('custodio', 6), ('comité', 8), ('cumplimiento', 9),
         ('valuación', 11), ('liquidez', 16), ('comisiones', 19), ('impuestos', 21), ('prospecto', 23), ('regulador', 24)]
lit, j = [], 0
for tok, med in orden:
    while nz(cl[j]['w']) != nz(tok):
        j += 1
    lit.append({'medal': med, 't': cl[j]['s']})
    j += 1
fin = next(w for w in cl if nz(w['w']) == 'todo')
fondo = [w for w in cl if nz(w['w']) == 'fondo'][-1]
out = {'estaciones': st, 'cierre': {'lit': lit, 'todo': fin['s'], 'fondoI': fondo['i'], 'fondo': fondo['s']}}
json.dump(out, open(public(vid) / 'estaciones.json', 'w'), ensure_ascii=False, indent=1)
G = guion(vid)
G['sfx'] = [{'tipo': 'stamp', 'palabra': 15, 'dt': -0.04, 'db': -12}, {'tipo': 'impact', 'palabra': 26, 'dt': 0.18, 'db': -12},
            {'tipo': 'stamp', 'palabra': 49, 'dt': -0.05, 'db': -12}] + sfx + [{'tipo': 'stamp', 'palabra': fondo['i'], 'dt': -0.05, 'db': -10}]
G['bloques'][0]['c'] = None
for b in G['bloques']:
    b.pop('c', None)
json.dump(G, open('guiones/deconstruyendo-fondos.json', 'w'), ensure_ascii=False, indent=1)
print(len(st), 'estaciones;', [(s['k'], s['appear'], s['solve'], s['name']) for s in st[:3]])
