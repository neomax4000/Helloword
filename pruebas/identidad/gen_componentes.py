# Genera kit/app/src/piezas/elenco-data.ts a partir de gen_hoja.py y gen_expresiones.py
import json,re
ns={}
src=open('gen_hoja.py').read().split('cols=[260')[0]; exec(src,ns)
pig,man=ns['pig'],ns['man']
src2=open('gen_expresiones.py').read().split('W,H=1960,1900')[0]
ns2={'__name__':'x'}; exec(src2,ns2); pose=ns2['pose']
def wrap(s,w): return f'<g stroke="#2B1B10" stroke-width="{w}" stroke-linejoin="round" stroke-linecap="round">{s}</g>'
d={}
for e in ['guino','alegre','sorpresa','duda','preocupado']:
    d[f'anfitrion.front.{e}']=wrap(man('front',arms=False,expr=e),9)
for v in ['tq','side','back']:
    d[f'anfitrion.{v}.alegre']=wrap(man(v),9)
for k in ['senala','moneda','abre']:
    d[f'anfitrion.{k}']=wrap(pose(k),9)
for e in ['alegre','guino','sorpresa','duda','dormido']:
    d[f'puerquito.front.{e}']=wrap(pig('front',e),8)
for v in ['tq','side','back']:
    d[f'puerquito.{v}.alegre']=wrap(pig(v),8)
js=json.dumps(d,ensure_ascii=False,indent=0)
open('/home/claude/helloword/kit/app/src/piezas/elenco-data.ts','w').write(
"// GENERADO por pruebas/identidad/gen_componentes.py — no editar a mano.\n// Cada clave = personaje.vista.expresión (o personaje.pose). Valor = SVG interno (origen en los pies / centro del cuerpo).\nexport const ELENCO: Record<string, string> = "+js+";\n")
print(len(d),'piezas')
