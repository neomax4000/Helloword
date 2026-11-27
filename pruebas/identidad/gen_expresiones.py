# Hoja de expresiones y poses (usa pig() y man() de gen_hoja.py)
src=open('gen_hoja.py').read().split('cols=[260')[0]
ns={}; exec(src,ns); pig=ns['pig']; man=ns['man']
OL='#2B1B10'; SU='#1F2A44'; SK='#E3A56F'
def arm(pts,finger=None):
    d='M'+' L'.join(f'{x} {y}' for x,y in pts)
    hx,hy=pts[-1]; px,py=pts[-2]
    cx,cy=px+(hx-px)*.78,py+(hy-py)*.78
    o=f'<path d="{d}" fill="none" stroke="{OL}" stroke-width="58" stroke-linejoin="round" stroke-linecap="round"/><path d="{d}" fill="none" stroke="{SU}" stroke-width="42" stroke-linejoin="round" stroke-linecap="round"/>'
    o+=f'<path d="M{cx} {cy} L{hx} {hy}" stroke="#fff" stroke-width="40" stroke-linecap="butt" fill="none"/>'
    if finger: o+=f'<path d="M{hx} {hy} L{finger[0]} {finger[1]}" stroke="{OL}" stroke-width="24" stroke-linecap="round" fill="none"/><path d="M{hx} {hy} L{finger[0]} {finger[1]}" stroke="{SK}" stroke-width="12" stroke-linecap="round" fill="none"/>'
    o+=f'<circle cx="{hx}" cy="{hy}" r="26" fill="{SK}"/>'
    return o
def pose(kind):
    base=man('front',arms=False,expr='guino' if kind=='senala' else 'alegre')
    if kind=='senala':
        a=arm([(-100,-320),(-132,-240),(-128,-150)])+arm([(100,-320),(176,-300),(246,-392)],finger=(272,-432))
    elif kind=='moneda':
        a=arm([(-100,-320),(-132,-240),(-128,-150)])+arm([(100,-320),(178,-250),(168,-318)])
        a+=f'<circle cx="168" cy="-376" r="40" fill="#FFD54A"/><circle cx="168" cy="-376" r="28" fill="none" stroke="#C98A12" stroke-width="5"/><text x="168" y="-362" text-anchor="middle" font-family="Poppins,Arial" font-weight="900" font-size="42" fill="#B97D0E" stroke="none">$</text>'
    else:
        a=arm([(-100,-320),(-182,-262),(-226,-296)])+arm([(100,-320),(182,-262),(226,-296)])
    return base+a
W,H=1960,1900
o=[f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4D6"/><stop offset="1" stop-color="#F8D98B"/></linearGradient>
<linearGradient id="gold" x1=".1" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="#FFE98C"/><stop offset=".5" stop-color="#F4BC33"/><stop offset="1" stop-color="#C98A12"/></linearGradient>
<linearGradient id="gold2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F8CF55"/><stop offset="1" stop-color="#B97D0E"/></linearGradient></defs>
<rect width="{W}" height="{H}" fill="url(#bg)"/><g stroke="#2B1B10" stroke-opacity=".12" stroke-width="2">''']
for x in range(0,W,40): o.append(f'<line x1="{x}" y1="0" x2="{x}" y2="{H}"/>')
for y in range(0,H,40): o.append(f'<line x1="0" y1="{y}" x2="{W}" y2="{y}"/>')
o.append('</g>')
T=lambda x,y,t,sz,fill,w=800,anc='start':f'<text x="{x}" y="{y}" text-anchor="{anc}" font-family="Poppins,Arial,sans-serif" font-weight="{w}" font-size="{sz}" fill="{fill}">{t}</text>'
o.append(T(80,95,'EXPRESIONES Y POSES',64,'#2B1B10',900))
o.append(T(80,140,'Elenco propio · se usan como piezas fijas en todas las escenas · boceto de dirección',28,'#7A4A08',600))
# fila A: bustos anfitrion
o.append(T(80,215,'1 · EL ANFITRIÓN · expresiones',34,'#2B1B10'))
ex=[('guino','GUIÑO'),('alegre','ALEGRE'),('sorpresa','SORPRESA'),('duda','DUDA'),('preocupado','PREOCUPADO')]
for i,(e,n) in enumerate(ex):
    cx=210+i*385
    o.append(f'<svg x="{cx-170}" y="240" width="340" height="340" viewBox="-150 -600 300 300"><g stroke="#2B1B10" stroke-width="9" stroke-linejoin="round" stroke-linecap="round">{man("front",arms=False,expr=e)}</g></svg>')
    o.append(T(cx,610,n,26,'#7A4A08',700,'middle'))
# fila B: puerquito
o.append(T(80,700,'2 · PUERQUITO · expresiones',34,'#2B1B10'))
pe=[('alegre','ALEGRE'),('guino','GUIÑO'),('sorpresa','SORPRESA'),('duda','DUDA'),('dormido','DORMIDO (cierre «Mándaselo…»)')]
for i,(e,n) in enumerate(pe):
    cx=210+i*385
    o.append(f'<g transform="translate({cx},905) scale(.78)" stroke="#2B1B10" stroke-width="8" stroke-linejoin="round" stroke-linecap="round">{pig("front",e)}</g>')
    if e=='dormido':
        o.append(T(cx+90,770,'Z',46,'#6B4FA0',900)+T(cx+130,735,'z',36,'#6B4FA0',900)+T(cx+160,708,'z',28,'#6B4FA0',900))
    o.append(T(cx,1070,n,24 if len(n)>12 else 26,'#7A4A08',700,'middle'))
# fila C: poses
o.append(T(80,1150,'3 · EL ANFITRIÓN · poses',34,'#2B1B10'))
for i,(k,n) in enumerate([('senala','SEÑALA'),('moneda','MUESTRA UNA MONEDA'),('abre','EXPLICA (palmas abiertas)')]):
    cx=300+i*480
    o.append(f'<g transform="translate({cx},1760) scale(.88)" stroke="#2B1B10" stroke-width="9" stroke-linejoin="round" stroke-linecap="round">{pose(k)}</g>')
    o.append(T(cx,1830,n,26,'#7A4A08',700,'middle'))
# escena ejemplo
o.append('<rect x="1560" y="1190" width="340" height="2" fill="none"/>')
o.append(f'<g transform="translate(1815,1760) scale(.62)" stroke="#2B1B10" stroke-width="10" stroke-linejoin="round" stroke-linecap="round">{man("tq")}</g>')
o.append(f'<g transform="translate(1600,1663) scale(.6)" stroke="#2B1B10" stroke-width="10" stroke-linejoin="round" stroke-linecap="round">{pig("tq")}</g>')
o.append(T(1700,1830,'DÚO EN ESCENA (3/4)',26,'#7A4A08',700,'middle'))
o.append('</svg>')
open('hoja-expresiones.svg','w').write('\n'.join(o))
