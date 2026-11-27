# Genera la hoja de personajes (SVG) — propuesta de identidad
OL='#2B1B10'
def pig(view):
    s=[]
    a=s.append
    a('<ellipse cx="0" cy="162" rx="125" ry="13" fill="#000" opacity=".18"/>')
    def leg(x,dark=False):
        a(f'<rect x="{x}" y="85" width="46" height="70" rx="17" fill="{"#C98A12" if dark else "#E0A21E"}"/>')
    def slot(cx,w=84):
        a(f'<path d="M{cx-w/2} -124 Q{cx} -138 {cx+w/2} -124" fill="none" stroke="#7A4A08" stroke-width="13"/>')
    def eye(x,y,r=20):
        a(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff"/><circle cx="{x+r*.2}" cy="{y+r*.15}" r="{r*.48}" fill="{OL}" stroke="none"/><circle cx="{x+r*.05}" cy="{y-r*.1}" r="{r*.17}" fill="#fff" stroke="none"/>')
    def shine(x,y):
        a(f'<path d="M{x} {y} q22 -22 55 -20" fill="none" stroke="#fff" stroke-width="13" opacity=".65"/><circle cx="{x+82}" cy="{y-18}" r="7" fill="#fff" stroke="none" opacity=".65"/>')
    def tail(x,y,flip=1):
        a(f'<path d="M{x} {y} q{45*flip} -10 {38*flip} -52 q{-12*flip} -26 {-36*flip} -6" fill="none" stroke-width="12"/><path d="M{x} {y} q{45*flip} -10 {38*flip} -52 q{-12*flip} -26 {-36*flip} -6" fill="none" stroke="#F2B72E" stroke-width="5"/>')
    if view=='front':
        leg(-82);leg(36)
        a('<path d="M-105 -75 L-142 -172 L-40 -118 Z" fill="url(#gold)"/><path d="M-100 -95 L-122 -148 L-72 -118 Z" fill="#C98A12" stroke="none"/>')
        a('<path d="M105 -75 L142 -172 L40 -118 Z" fill="url(#gold)"/><path d="M100 -95 L122 -148 L72 -118 Z" fill="#C98A12" stroke="none"/>')
        a('<ellipse cx="0" cy="0" rx="152" ry="132" fill="url(#gold)"/>')
        slot(0); shine(-105,-70)
        a('<circle cx="-102" cy="30" r="19" fill="#FF9E7A" opacity=".55" stroke="none"/><circle cx="102" cy="30" r="19" fill="#FF9E7A" opacity=".55" stroke="none"/>')
        eye(-58,-28);eye(58,-28)
        a('<ellipse cx="0" cy="38" rx="56" ry="40" fill="#F2B72E"/><ellipse cx="-19" cy="38" rx="8" ry="15" fill="'+OL+'" stroke="none"/><ellipse cx="19" cy="38" rx="8" ry="15" fill="'+OL+'" stroke="none"/>')
        a('<path d="M-28 92 Q0 108 28 92" fill="none"/>')
    elif view=='tq':
        leg(-30,True);leg(78,True);leg(-78);leg(28)
        a('<path d="M60 -95 L120 -175 L125 -90 Z" fill="url(#gold)"/>')
        tail(158,-10)
        a('<ellipse cx="14" cy="0" rx="152" ry="132" fill="url(#gold)"/>')
        a('<path d="M-70 -95 L-128 -178 L-20 -125 Z" fill="url(#gold)"/><path d="M-66 -110 L-110 -158 L-48 -125 Z" fill="#C98A12" stroke="none"/>')
        slot(20); shine(-70,-72)
        a('<circle cx="-80" cy="38" r="18" fill="#FF9E7A" opacity=".55" stroke="none"/>')
        eye(-92,-36,15); eye(-28,-34,20)
        a('<ellipse cx="-105" cy="38" rx="44" ry="38" fill="#F2B72E"/><ellipse cx="-120" cy="38" rx="8" ry="14" fill="'+OL+'" stroke="none"/><ellipse cx="-92" cy="38" rx="8" ry="14" fill="'+OL+'" stroke="none"/>')
        a('<path d="M-125 88 Q-95 104 -62 86" fill="none"/>')
    elif view=='side':
        leg(60,True);leg(-70,True);leg(95);leg(-38)
        tail(170,-15)
        a('<path d="M-30 -112 L10 -185 L52 -108 Z" fill="url(#gold)"/>')
        a('<ellipse cx="18" cy="0" rx="158" ry="128" fill="url(#gold)"/>')
        a('<ellipse cx="-140" cy="28" rx="42" ry="35" fill="#F2B72E"/><ellipse cx="-152" cy="26" rx="7" ry="14" fill="'+OL+'" stroke="none"/>')
        slot(24); shine(-60,-72)
        a('<circle cx="-70" cy="40" r="17" fill="#FF9E7A" opacity=".55" stroke="none"/>')
        eye(-84,-30)
        a('<path d="M-140 76 Q-112 90 -80 74" fill="none"/>')
    elif view=='back':
        leg(-82);leg(36)
        a('<path d="M-105 -75 L-142 -172 L-40 -118 Z" fill="url(#gold)"/><path d="M105 -75 L142 -172 L40 -118 Z" fill="url(#gold)"/>')
        a('<ellipse cx="0" cy="0" rx="152" ry="132" fill="url(#gold2)"/>')
        slot(0); shine(-110,-30)
        tail(0,40,1)
        a('<path d="M-60 88 Q0 110 60 88" fill="none" stroke="#C98A12" stroke-width="6"/>')
    return ''.join(s)

def man(view):
    s=[];a=s.append
    SK='#E3A56F';SKD='#C9854F';HR='#3C2415';SU='#2F6FE0';SUD='#2B5CC0';TI='#8DB531';TR='#25356B'
    a('<ellipse cx="0" cy="8" rx="120" ry="12" fill="#000" opacity=".18"/>')
    def shoes(x1,x2,dx=0):
        a(f'<rect x="{x1}" y="-34" width="96" height="36" rx="16" fill="#fff"/><rect x="{x2}" y="-34" width="96" height="36" rx="16" fill="#fff"/>')
    if view=='front':
        a(f'<rect x="-92" y="-128" width="70" height="100" rx="14" fill="{TR}"/><rect x="22" y="-128" width="70" height="100" rx="14" fill="{TR}"/>')
        shoes(-112,16)
        a(f'<path d="M-100 -330 L-150 -170 L-100 -150 L-70 -250" fill="{SU}"/><circle cx="-128" cy="-148" r="26" fill="{SK}"/>')
        a(f'<path d="M100 -330 L150 -170 L100 -150 L70 -250" fill="{SU}"/><circle cx="128" cy="-148" r="26" fill="{SK}"/>')
        a(f'<rect x="-100" y="-350" width="200" height="240" rx="34" fill="{SU}"/>')
        a(f'<path d="M-36 -350 L0 -220 L36 -350 Z" fill="#fff"/><path d="M-12 -335 L12 -335 L20 -230 L0 -196 L-20 -230 Z" fill="{TI}"/>')
        a(f'<path d="M-36 -350 L-72 -280 L-4 -300 Z" fill="{SUD}"/><path d="M36 -350 L72 -280 L4 -300 Z" fill="{SUD}"/>')
        a(f'<circle cx="-62" cy="-130" r="6" fill="{OL}" stroke="none"/><circle cx="62" cy="-130" r="6" fill="{OL}" stroke="none"/>')
        a(f'<rect x="-30" y="-382" width="60" height="40" rx="10" fill="{SKD}"/>')
        a(f'<rect x="-80" y="-520" width="160" height="150" rx="34" fill="{SK}"/>')
        a(f'<path d="M-90 -460 Q-92 -560 0 -560 Q92 -560 90 -460 Q55 -505 0 -500 Q-55 -505 -90 -460Z" fill="{HR}"/>')
        a(f'<circle cx="-30" cy="-440" r="15" fill="#fff"/><circle cx="-26" cy="-438" r="7" fill="{OL}" stroke="none"/><path d="M18 -440 q16 -14 34 0" fill="none"/>')
        a(f'<path d="M-35 -405 Q0 -380 40 -405 Q0 -392 -35 -405Z" fill="#fff"/>')
    elif view=='tq':
        a(f'<rect x="-70" y="-128" width="62" height="100" rx="14" fill="{TR}"/><rect x="14" y="-128" width="62" height="100" rx="14" fill="{TR}"/>')
        shoes(-104,8)
        a(f'<rect x="-82" y="-350" width="172" height="240" rx="34" fill="{SU}"/>')
        a(f'<path d="M-52 -350 L-26 -220 L8 -350 Z" fill="#fff"/><path d="M-36 -335 L-14 -335 L-8 -230 L-26 -200 L-42 -230 Z" fill="{TI}"/>')
        a(f'<path d="M-52 -350 L-70 -300 L-26 -305 Z" fill="{SUD}" stroke="none"/>')
        a(f'<path d="M62 -330 L98 -170 L58 -150 L40 -250" fill="{SU}"/><circle cx="80" cy="-146" r="26" fill="{SK}"/>')
        a(f'<path d="M-72 -330 L-100 -170 L-64 -156 L-42 -250" fill="{SU}"/><circle cx="-84" cy="-148" r="24" fill="{SK}"/>')
        a(f'<rect x="-22" y="-382" width="56" height="40" rx="10" fill="{SKD}"/>')
        a(f'<circle cx="72" cy="-452" r="20" fill="{SKD}"/>')
        a(f'<rect x="-72" y="-520" width="150" height="150" rx="34" fill="{SK}"/>')
        a(f'<path d="M-82 -455 Q-84 -562 6 -562 Q92 -562 90 -440 Q62 -500 10 -500 Q-40 -505 -82 -455Z" fill="{HR}"/>')
        a(f'<circle cx="-42" cy="-440" r="14" fill="#fff"/><circle cx="-47" cy="-438" r="7" fill="{OL}" stroke="none"/><path d="M-4 -440 q14 -12 30 0" fill="none"/>')
        a(f'<path d="M-62 -405 Q-30 -378 4 -405 Q-30 -392 -62 -405Z" fill="#fff"/>')
        a(f'<path d="M-78 -450 q-18 12 0 30" fill="{SK}"/>')
    elif view=='side':
        a(f'<rect x="-28" y="-128" width="62" height="100" rx="14" fill="{TR}"/><rect x="-44" y="-128" width="60" height="100" rx="14" fill="#1E2A58"/>')
        a(f'<rect x="-86" y="-34" width="120" height="36" rx="16" fill="#fff"/>')
        a(f'<rect x="-64" y="-350" width="128" height="240" rx="34" fill="{SU}"/>')
        a(f'<path d="M-62 -335 L-30 -335 L-24 -230 L-46 -200 L-62 -230 Z" fill="{TI}"/><path d="M-64 -350 L-40 -300 L-64 -300 Z" fill="{SUD}"/>')
        a(f'<path d="M-24 -330 L-4 -170 L30 -168 L34 -300" fill="{SU}"/><circle cx="14" cy="-148" r="24" fill="{SK}"/>')
        a(f'<rect x="-22" y="-382" width="52" height="40" rx="10" fill="{SKD}"/>')
        a(f'<path d="M-72 -440 L-96 -428 L-72 -414 Z" fill="{SK}"/>')
        a(f'<rect x="-72" y="-520" width="134" height="150" rx="34" fill="{SK}"/>')
        a(f'<path d="M-62 -450 Q-70 -562 10 -562 Q70 -560 66 -440 Q60 -500 20 -496 Q-20 -490 -62 -450Z" fill="{HR}"/>')
        a(f'<circle cx="30" cy="-440" r="19" fill="{SKD}"/>')
        a(f'<circle cx="-42" cy="-442" r="13" fill="#fff"/><circle cx="-46" cy="-440" r="6" fill="{OL}" stroke="none"/>')
        a(f'<path d="M-64 -402 Q-46 -386 -26 -402" fill="none"/>')
    else:
        a(f'<rect x="-92" y="-128" width="70" height="100" rx="14" fill="{TR}"/><rect x="22" y="-128" width="70" height="100" rx="14" fill="{TR}"/>')
        shoes(-112,16)
        a(f'<path d="M-100 -330 L-146 -170 L-104 -150 L-70 -250" fill="{SU}"/><circle cx="-124" cy="-148" r="26" fill="{SK}"/>')
        a(f'<path d="M100 -330 L146 -170 L104 -150 L70 -250" fill="{SU}"/><circle cx="124" cy="-148" r="26" fill="{SK}"/>')
        a(f'<rect x="-100" y="-350" width="200" height="240" rx="34" fill="{SU}"/>')
        a(f'<path d="M0 -350 L0 -110" stroke="{SUD}" stroke-width="7" fill="none"/><path d="M-8 -150 L-8 -110 M8 -150 L8 -110" stroke-width="6" fill="none"/>')
        a(f'<path d="M-36 -350 Q0 -325 36 -350" fill="#fff"/><path d="M-60 -350 Q0 -300 60 -350" fill="none" stroke="{SUD}" stroke-width="8"/>')
        a(f'<rect x="-30" y="-382" width="60" height="40" rx="10" fill="{SKD}"/>')
        a(f'<circle cx="-80" cy="-440" r="20" fill="{SKD}"/><circle cx="80" cy="-440" r="20" fill="{SKD}"/>')
        a(f'<rect x="-80" y="-520" width="160" height="150" rx="34" fill="{HR}"/>')
        a(f'<path d="M-40 -500 Q0 -470 40 -500" stroke="#5A3820" stroke-width="8" fill="none"/>')
    return ''.join(s)

cols=[260,700,1140,1580]
names=['FRENTE','3/4','PERFIL','ATRÁS']
views=['front','tq','side','back']
out=[]
out.append('''<svg xmlns="http://www.w3.org/2000/svg" width="1960" height="1500" viewBox="0 0 1960 1500">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4D6"/><stop offset="1" stop-color="#F8D98B"/></linearGradient>
<linearGradient id="gold" x1=".1" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="#FFE98C"/><stop offset=".5" stop-color="#F4BC33"/><stop offset="1" stop-color="#C98A12"/></linearGradient>
<linearGradient id="gold2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F8CF55"/><stop offset="1" stop-color="#B97D0E"/></linearGradient>
</defs>
<rect width="1960" height="1500" fill="url(#bg)"/>
<g stroke="#2B1B10" stroke-opacity=".12" stroke-width="2">''')
for x in range(0,1960,40): out.append(f'<line x1="{x}" y1="0" x2="{x}" y2="1500"/>')
for y in range(0,1500,40): out.append(f'<line x1="0" y1="{y}" x2="1960" y2="{y}"/>')
out.append('</g>')
out.append('<text x="80" y="95" font-family="Poppins,Arial,sans-serif" font-weight="900" font-size="64" fill="#2B1B10">HOJA DE PERSONAJES</text>')
out.append('<text x="80" y="140" font-family="Poppins,Arial,sans-serif" font-weight="600" font-size="28" fill="#7A4A08">Elenco propio · vistas de frente, 3/4, perfil y atrás · nombres provisionales</text>')
# guias
for y,lab in [(570,'SUELO'),(1190,'SUELO')]:
    out.append(f'<line x1="60" y1="{y+10}" x2="1900" y2="{y+10}" stroke="#2B1B10" stroke-opacity=".35" stroke-width="3" stroke-dasharray="14 10"/>')
out.append('<line x1="60" y1="420" x2="1900" y2="420" stroke="#C0392B" stroke-opacity=".5" stroke-width="2" stroke-dasharray="6 8"/><text x="1840" y="412" font-size="20" fill="#C0392B" font-family="Poppins,Arial">ojos</text>')
out.append('<line x1="60" y1="790" x2="1900" y2="790" stroke="#C0392B" stroke-opacity=".5" stroke-width="2" stroke-dasharray="6 8"/><text x="1840" y="782" font-size="20" fill="#C0392B" font-family="Poppins,Arial">ojos</text>')
out.append('<text x="80" y="205" font-family="Poppins,Arial" font-weight="800" font-size="34" fill="#2B1B10">1 · PUERQUITO ALCANCÍA DORADO (mascota y logo)</text>')
out.append('<text x="80" y="690" font-family="Poppins,Arial" font-weight="800" font-size="34" fill="#2B1B10">2 · EL ANFITRIÓN (el que explica)</text>')
for c,v,n in zip(cols,views,names):
    out.append(f'<g transform="translate({c},{395}) scale(1.0)" stroke="#2B1B10" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">{pig(v)}</g>')
    out.append(f'<text x="{c}" y="632" text-anchor="middle" font-family="Poppins,Arial" font-weight="700" font-size="26" fill="#7A4A08">{n}</text>')
    out.append(f'<g transform="translate({c},{1180}) scale(.72)" stroke="#2B1B10" stroke-width="9" stroke-linejoin="round" stroke-linecap="round">{man(v)}</g>')
    out.append(f'<text x="{c}" y="1235" text-anchor="middle" font-family="Poppins,Arial" font-weight="700" font-size="26" fill="#7A4A08">{n}</text>')
# paleta
pal=[('#F4BC33','Oro'),('#C98A12','Oro sombra'),('#2F6FE0','Traje'),('#8DB531','Corbata'),('#3C2415','Pelo'),('#E3A56F','Piel'),('#2B1B10','Trazo')]
out.append('<text x="80" y="1290" font-family="Poppins,Arial" font-weight="800" font-size="26" fill="#2B1B10">PALETA</text>')
for i,(c,n) in enumerate(pal):
    x=80+i*118
    out.append(f'<rect x="{x}" y="1305" width="100" height="64" rx="14" fill="{c}" stroke="#2B1B10" stroke-width="4"/><text x="{x+50}" y="1398" text-anchor="middle" font-family="Poppins,Arial" font-weight="600" font-size="17" fill="#2B1B10">{n}</text>')
out.append('<g><rect x="940" y="1280" width="940" height="170" rx="24" fill="#2B1B10"/><text x="976" y="1328" font-family="Poppins,Arial" font-weight="800" font-size="28" fill="#FFC928">CÓMO SE PRODUCE</text><text x="976" y="1372" font-family="Poppins,Arial" font-weight="600" font-size="25" fill="#fff">Diseño de personajes, guiones y revisión: Claude</text><text x="976" y="1410" font-family="Poppins,Arial" font-weight="600" font-size="25" fill="#fff">Animación y render de escenas: Haiku, con esta hoja como regla</text></g>')
out.append('</svg>')
open('hoja-personajes.svg','w').write('\n'.join(out))
