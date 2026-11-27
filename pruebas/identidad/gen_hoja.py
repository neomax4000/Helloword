# Genera la hoja de personajes (SVG) — propuesta de identidad
OL='#2B1B10'
def pig(view):
    s=[]
    a=s.append
    a('<ellipse cx="0" cy="162" rx="125" ry="13" fill="#000" opacity=".18"/>')
    def leg(x,dark=False):
        a(f'<rect x="{x}" y="85" width="46" height="70" rx="17" fill="{"#C98A12" if dark else "#E0A21E"}"/>')
    def slot(cx,w=84):
        a(f'<path d="M{cx-w/2} -124 Q{cx} -140 {cx+w/2} -124" fill="none" stroke="#6B3E06" stroke-width="14"/>')
    def coin(cx):
        a(f'<circle cx="{cx}" cy="-148" r="31" fill="#FFD54A"/><circle cx="{cx}" cy="-148" r="21" fill="none" stroke="#C98A12" stroke-width="4"/>')
        a(f'<text x="{cx}" y="-137" text-anchor="middle" font-family="Poppins,Arial" font-weight="900" font-size="30" fill="#B97D0E" stroke="none">$</text>')
    def medal(x,y,r=40):
        a(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#FFD54A"/><circle cx="{x}" cy="{y}" r="{r-11}" fill="none" stroke="#C98A12" stroke-width="4"/>')
        a(f'<text x="{x}" y="{y+r*.32}" text-anchor="middle" font-family="Poppins,Arial" font-weight="900" font-size="{r*1.0}" fill="#B97D0E" stroke="none">$</text>')
    def eye(x,y,r=20):
        a(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff"/><circle cx="{x+r*.2}" cy="{y+r*.15}" r="{r*.48}" fill="{OL}" stroke="none"/><circle cx="{x+r*.05}" cy="{y-r*.1}" r="{r*.17}" fill="#fff" stroke="none"/>')
    def shine(x,y):
        a(f'<path d="M{x} {y} q22 -22 55 -20" fill="none" stroke="#fff" stroke-width="13" opacity=".65"/><circle cx="{x+82}" cy="{y-18}" r="7" fill="#fff" stroke="none" opacity=".65"/>')
    def tail(x,y,flip=1):
        a(f'<path d="M{x} {y} q{45*flip} -10 {38*flip} -52 q{-12*flip} -26 {-36*flip} -6" fill="none" stroke-width="12"/><path d="M{x} {y} q{45*flip} -10 {38*flip} -52 q{-12*flip} -26 {-36*flip} -6" fill="none" stroke="#F2B72E" stroke-width="5"/>')
    def ear(d,inner):
        a(f'<path d="{d}" fill="url(#gold)"/><path d="{inner}" fill="#D9961F" stroke="none"/>')
    if view=='front':
        leg(-82);leg(36)
        ear("M-114 -70 Q-160 -138 -122 -174 Q-72 -176 -36 -114 Z","M-104 -94 Q-134 -138 -116 -158 Q-88 -156 -64 -120 Z")
        ear("M114 -70 Q160 -138 122 -174 Q72 -176 36 -114 Z","M104 -94 Q134 -138 116 -158 Q88 -156 64 -120 Z")
        coin(0)
        a('<ellipse cx="0" cy="0" rx="152" ry="132" fill="url(#gold)"/>')
        slot(0); shine(-105,-70)
        a('<circle cx="-102" cy="30" r="19" fill="#FF9E7A" opacity=".55" stroke="none"/><circle cx="102" cy="30" r="19" fill="#FF9E7A" opacity=".55" stroke="none"/>')
        eye(-58,-28);eye(58,-28)
        a('<ellipse cx="0" cy="38" rx="56" ry="40" fill="#F2B72E"/><ellipse cx="-19" cy="38" rx="8" ry="15" fill="'+OL+'" stroke="none"/><ellipse cx="19" cy="38" rx="8" ry="15" fill="'+OL+'" stroke="none"/>')
        a('<path d="M-28 92 Q0 108 28 92" fill="none"/>')
    elif view=='tq':
        leg(-30,True);leg(78,True);leg(-78);leg(28)
        ear("M58 -98 Q104 -170 140 -150 Q152 -108 126 -84 Z","M72 -104 Q104 -150 130 -138 Q136 -114 118 -100 Z")
        tail(158,-10)
        coin(20)
        a('<ellipse cx="14" cy="0" rx="152" ry="132" fill="url(#gold)"/>')
        ear("M-76 -92 Q-134 -150 -96 -186 Q-44 -178 -16 -124 Z","M-68 -112 Q-108 -150 -92 -168 Q-62 -164 -42 -128 Z")
        slot(20); shine(-70,-72)
        medal(86,24,38)
        a('<circle cx="-80" cy="30" r="17" fill="#FF9E7A" opacity=".55" stroke="none"/>')
        eye(-96,-36,15); eye(-30,-34,20)
        a('<ellipse cx="-105" cy="38" rx="44" ry="38" fill="#F2B72E"/><ellipse cx="-120" cy="38" rx="8" ry="14" fill="'+OL+'" stroke="none"/><ellipse cx="-92" cy="38" rx="8" ry="14" fill="'+OL+'" stroke="none"/>')
        a('<path d="M-128 88 Q-105 102 -82 88" fill="none"/>')
    elif view=='side':
        leg(60,True);leg(-70,True);leg(95);leg(-38)
        tail(170,-15)
        ear("M-40 -106 Q-36 -182 14 -190 Q52 -160 52 -104 Z","M-24 -112 Q-20 -164 14 -172 Q34 -150 36 -112 Z")
        coin(30)
        a('<rect x="-198" y="2" width="96" height="58" rx="26" fill="#F2B72E"/>')
        a('<ellipse cx="-190" cy="31" rx="12" ry="24" fill="#E0A21E"/><ellipse cx="-191" cy="23" rx="4" ry="7" fill="'+OL+'" stroke="none"/><ellipse cx="-191" cy="40" rx="4" ry="7" fill="'+OL+'" stroke="none"/>')
        a('<ellipse cx="18" cy="0" rx="158" ry="128" fill="url(#gold)"/>')
        slot(30); shine(-50,-72)
        medal(60,18,44)
        a('<circle cx="-74" cy="42" r="17" fill="#FF9E7A" opacity=".55" stroke="none"/>')
        eye(-92,-30)
        a('<path d="M-128 64 Q-108 78 -88 62" fill="none"/>')
    elif view=='back':
        leg(-82);leg(36)
        ear("M-114 -70 Q-160 -138 -122 -174 Q-72 -176 -36 -114 Z","M-104 -94 Q-134 -138 -116 -158 Q-88 -156 -64 -120 Z")
        ear("M114 -70 Q160 -138 122 -174 Q72 -176 36 -114 Z","M104 -94 Q134 -138 116 -158 Q88 -156 64 -120 Z")
        coin(0)
        a('<ellipse cx="0" cy="0" rx="152" ry="132" fill="url(#gold2)"/>')
        slot(0); shine(-110,-30)
        tail(0,24,1)
        a('<circle cx="-78" cy="70" r="22" fill="#E0A21E"/><circle cx="-78" cy="70" r="11" fill="none" stroke="#B97D0E" stroke-width="4"/>')
    return ''.join(s)

def man(view):
    s=[];a=s.append
    SK='#E3A56F';SKD='#C9854F';HR='#3A2214';HRL='#6B4228'
    SU='#1F2A44';SUD='#131B30';SUL='#2E3C5F';TI='#8DB531';TR='#19223A';SH='#14141C'
    a('<ellipse cx="0" cy="8" rx="120" ry="12" fill="#000" opacity=".18"/>')
    def shoes(x1,x2):
        a(f'<path d="M{x1} -4 Q{x1} -38 {x1+30} -38 L{x1+78} -38 Q{x1+100} -38 {x1+100} -14 Q{x1+100} 2 {x1+80} 2 L{x1+10} 2 Q{x1} 2 {x1} -4Z" fill="{SH}"/>')
        a(f'<path d="M{x2} -4 Q{x2} -38 {x2+30} -38 L{x2+78} -38 Q{x2+100} -38 {x2+100} -14 Q{x2+100} 2 {x2+80} 2 L{x2+10} 2 Q{x2} 2 {x2} -4Z" fill="{SH}"/>')
        a(f'<path d="M{x1+16} -28 q26 -8 50 0" stroke="#5A5A6A" stroke-width="5" fill="none"/><path d="M{x2+16} -28 q26 -8 50 0" stroke="#5A5A6A" stroke-width="5" fill="none"/>')
    def cuff(x,y):
        a(f'<rect x="{x-17}" y="{y-8}" width="34" height="16" rx="5" fill="#fff"/>')
    def hair_front(dx=0):
        a(f'<path d="M{-88+dx} -450 Q{-104+dx} -566 {-4+dx} -578 Q{86+dx} -584 {94+dx} -492 L{90+dx} -448 Q{74+dx} -498 {34+dx} -510 Q{-8+dx} -494 {-56+dx} -506 Q{-78+dx} -494 {-88+dx} -450Z" fill="{HR}"/>')
        a(f'<path d="M{-52+dx} -548 Q{-6+dx} -574 {52+dx} -552" stroke="{HRL}" stroke-width="8" fill="none"/>')
        a(f'<path d="M{-26+dx} -540 Q{-8+dx} -552 {20+dx} -546" stroke="{HRL}" stroke-width="5" fill="none"/>')
        a(f'<path d="M{-22+dx} -574 Q{-12+dx} -540 {-34+dx} -508" stroke="#1C0F08" stroke-width="5" fill="none"/>')
    if view=='front':
        a(f'<rect x="-92" y="-128" width="70" height="100" rx="14" fill="{TR}"/><rect x="22" y="-128" width="70" height="100" rx="14" fill="{TR}"/>')
        a(f'<path d="M-57 -120 L-57 -34 M57 -120 L57 -34" stroke="{SUL}" stroke-width="4" fill="none"/>')
        shoes(-112,16)
        a(f'<path d="M-100 -330 L-150 -170 L-100 -150 L-70 -250" fill="{SU}"/>'); cuff(-124,-158); a(f'<circle cx="-130" cy="-136" r="26" fill="{SK}"/>')
        a(f'<path d="M100 -330 L150 -170 L100 -150 L70 -250" fill="{SU}"/>'); cuff(124,-158); a(f'<circle cx="130" cy="-136" r="26" fill="{SK}"/>')
        a(f'<rect x="-100" y="-350" width="200" height="240" rx="34" fill="{SU}"/>')
        a(f'<path d="M-36 -350 L0 -246 L36 -350 Z" fill="#fff"/>')
        a(f'<rect x="-11" y="-348" width="22" height="22" rx="6" fill="{TI}"/><path d="M-9 -330 L9 -330 L6 -266 L0 -254 L-6 -266 Z" fill="{TI}"/>')
        a(f'<path d="M-38 -352 L-90 -292 L-54 -262 L-2 -248 L-34 -300 Z" fill="{SUD}"/><path d="M38 -352 L90 -292 L54 -262 L2 -248 L34 -300 Z" fill="{SUD}"/>')
        a(f'<path d="M0 -248 L0 -112" stroke="{SUD}" stroke-width="6" fill="none"/><circle cx="-10" cy="-210" r="6" fill="#0B0F1C" stroke="none"/><circle cx="-10" cy="-160" r="6" fill="#0B0F1C" stroke="none"/>')
        a(f'<path d="M-82 -176 L-30 -176" stroke="{SUD}" stroke-width="7" fill="none"/><path d="M30 -176 L82 -176" stroke="{SUD}" stroke-width="7" fill="none"/>')
        a(f'<path d="M-82 -296 L-52 -294 L-58 -276 L-80 -278 Z" fill="#fff" stroke-width="5"/>')
        a(f'<path d="M-78 -330 L-76 -190 M78 -330 L76 -190" stroke="{SUL}" stroke-width="4" fill="none"/>')
        a(f'<rect x="-30" y="-382" width="60" height="40" rx="10" fill="{SKD}"/>')
        a(f'<path d="M-36 -352 L0 -332 L36 -352" fill="none" stroke-width="6"/>')
        a(f'<rect x="-80" y="-520" width="160" height="150" rx="34" fill="{SK}"/>')
        a(f'<rect x="-90" y="-482" width="14" height="42" rx="6" fill="{HR}"/><rect x="76" y="-482" width="14" height="42" rx="6" fill="{HR}"/>')
        hair_front()
        a(f'<path d="M-52 -466 q18 -12 36 -2" fill="none" stroke="{HR}" stroke-width="8"/><path d="M16 -468 q18 -10 36 2" fill="none" stroke="{HR}" stroke-width="8"/>')
        a(f'<circle cx="-30" cy="-440" r="15" fill="#fff"/><circle cx="-26" cy="-438" r="7" fill="{OL}" stroke="none"/><path d="M18 -440 q16 -14 34 0" fill="none"/>')
        a(f'<path d="M-35 -405 Q0 -380 40 -405 Q0 -392 -35 -405Z" fill="#fff"/>')
    elif view=='tq':
        a(f'<rect x="-70" y="-128" width="62" height="100" rx="14" fill="{TR}"/><rect x="14" y="-128" width="62" height="100" rx="14" fill="{TR}"/>')
        shoes(-104,8)
        a(f'<rect x="-82" y="-350" width="172" height="240" rx="34" fill="{SU}"/>')
        a(f'<path d="M-44 -350 L-24 -250 L6 -350 Z" fill="#fff"/>')
        a(f'<rect x="-30" y="-348" width="20" height="20" rx="6" fill="{TI}"/><path d="M-28 -330 L-12 -330 L-14 -268 L-20 -256 L-26 -268 Z" fill="{TI}"/>')
        a(f'<path d="M-46 -352 L-84 -292 L-52 -264 L-24 -250 L-44 -300 Z" fill="{SUD}"/><path d="M8 -352 L50 -292 L18 -264 L-22 -248 L-2 -300 Z" fill="{SUD}"/>')
        a(f'<path d="M-24 -248 L-20 -112" stroke="{SUD}" stroke-width="6" fill="none"/><circle cx="-34" cy="-206" r="6" fill="#0B0F1C" stroke="none"/><circle cx="-34" cy="-158" r="6" fill="#0B0F1C" stroke="none"/>')
        a(f'<path d="M62 -330 L98 -170 L58 -150 L40 -250" fill="{SU}"/>'); cuff(80,-158); a(f'<circle cx="86" cy="-136" r="26" fill="{SK}"/>')
        a(f'<path d="M-72 -330 L-100 -170 L-64 -156 L-42 -250" fill="{SU}"/>'); cuff(-82,-160); a(f'<circle cx="-88" cy="-138" r="24" fill="{SK}"/>')
        a(f'<rect x="-22" y="-382" width="56" height="40" rx="10" fill="{SKD}"/>')
        a(f'<path d="M-44 -352 L-20 -334 L6 -352" fill="none" stroke-width="6"/>')
        a(f'<path d="M64 -444 q22 -4 20 20 q-2 20 -22 14Z" fill="{SKD}"/>')
        a(f'<rect x="-72" y="-520" width="150" height="150" rx="34" fill="{SK}"/>')
        a(f'<rect x="64" y="-486" width="14" height="40" rx="6" fill="{HR}"/>')
        a(f'<path d="M-76 -452 Q-84 -556 -4 -574 Q70 -582 88 -500 L84 -440 Q70 -494 30 -506 Q-14 -496 -50 -506 Q-70 -492 -76 -452Z" fill="{HR}"/>')
        a(f'<path d="M-44 -548 Q4 -572 58 -548" stroke="{HRL}" stroke-width="8" fill="none"/>')
        a(f'<path d="M-20 -572 Q-12 -540 -34 -510" stroke="#1C0F08" stroke-width="5" fill="none"/>')
        a(f'<path d="M-62 -466 q16 -12 34 -2" fill="none" stroke="{HR}" stroke-width="8"/><path d="M-2 -468 q16 -10 32 2" fill="none" stroke="{HR}" stroke-width="8"/>')
        a(f'<circle cx="-42" cy="-440" r="14" fill="#fff"/><circle cx="-47" cy="-438" r="7" fill="{OL}" stroke="none"/><path d="M-4 -440 q14 -12 30 0" fill="none"/>')
        a(f'<path d="M-62 -405 Q-30 -378 4 -405 Q-30 -392 -62 -405Z" fill="#fff"/>')
    elif view=='side':
        a(f'<rect x="-22" y="-128" width="58" height="100" rx="14" fill="#10172B"/><rect x="-40" y="-128" width="60" height="100" rx="14" fill="{TR}"/>')
        a(f'<path d="M-112 -4 Q-112 -34 -84 -36 L-50 -38 Q-10 -38 24 -16 Q30 2 10 2 L-100 2 Q-112 2 -112 -4Z" fill="{SH}"/><path d="M-96 -22 q22 -10 44 -4" stroke="#5A5A6A" stroke-width="5" fill="none"/>')
        a(f'<rect x="-58" y="-350" width="116" height="240" rx="36" fill="{SU}"/>')
        a(f'<path d="M-56 -344 L-52 -262 L-36 -280 L-30 -344 Z" fill="{SUD}"/>')
        a(f'<path d="M-40 -350 L-30 -330 L-16 -350" fill="#fff" stroke-width="5"/>')
        a(f'<path d="M-30 -330 Q-26 -250 -20 -172 L18 -172 Q26 -250 20 -330 Z" fill="{SU}"/>')
        cuff(0,-168); a(f'<circle cx="0" cy="-140" r="24" fill="{SK}"/>')
        a(f'<path d="M-24 -178 L22 -178" stroke="{SUD}" stroke-width="6" fill="none"/>')
        a(f'<path d="M-10 -388 L34 -388 L34 -340 L-10 -340 Z" fill="{SKD}"/>')
        a(f'<path d="M-34 -366 L22 -366 L34 -346 L-30 -346 Z" fill="#fff" stroke-width="5"/>')
        # cabeza de perfil (mira a la izquierda)
        a(f'<path d="M10 -524 C56 -524 68 -490 68 -450 C68 -410 56 -378 24 -370 L-26 -370 Q-52 -372 -56 -388 L-58 -394 Q-68 -398 -62 -406 L-66 -412 L-84 -416 Q-88 -428 -72 -442 Q-66 -454 -64 -472 Q-62 -512 10 -524Z" fill="{SK}"/>')
        a(f'<path d="M-62 -476 Q-68 -538 6 -546 Q76 -548 72 -452 Q72 -424 62 -404 L48 -432 Q44 -476 10 -484 Q-28 -482 -62 -476Z" fill="{HR}"/>')
        a(f'<path d="M-36 -526 Q6 -546 50 -526" stroke="{HRL}" stroke-width="7" fill="none"/>')
        a(f'<path d="M-60 -480 Q-48 -500 -20 -506" stroke="#1C0F08" stroke-width="5" fill="none"/>')
        a(f'<path d="M26 -450 q24 -4 24 20 q-2 20 -24 16 q-8 -18 0 -36Z" fill="{SKD}"/><path d="M33 -440 q10 4 7 16" fill="none" stroke-width="4"/>')
        a(f'<circle cx="-46" cy="-444" r="12" fill="#fff"/><circle cx="-50" cy="-442" r="6" fill="{OL}" stroke="none"/>')
        a(f'<path d="M-64 -464 q14 -10 28 -2" fill="none" stroke="{HR}" stroke-width="7"/>')
        a(f'<path d="M-58 -392 Q-48 -384 -38 -392" fill="none" stroke-width="5"/>')
    else:
        a(f'<rect x="-92" y="-128" width="70" height="100" rx="14" fill="{TR}"/><rect x="22" y="-128" width="70" height="100" rx="14" fill="{TR}"/>')
        shoes(-112,16)
        a(f'<path d="M-100 -330 L-146 -170 L-104 -150 L-70 -250" fill="{SU}"/>'); cuff(-124,-158); a(f'<circle cx="-128" cy="-136" r="26" fill="{SK}"/>')
        a(f'<path d="M100 -330 L146 -170 L104 -150 L70 -250" fill="{SU}"/>'); cuff(124,-158); a(f'<circle cx="128" cy="-136" r="26" fill="{SK}"/>')
        a(f'<rect x="-100" y="-350" width="200" height="240" rx="34" fill="{SU}"/>')
        a(f'<path d="M0 -350 L0 -112" stroke="{SUD}" stroke-width="7" fill="none"/><path d="M-10 -170 L-10 -112 M10 -170 L10 -112" stroke="{SUD}" stroke-width="5" fill="none"/>')
        a(f'<path d="M-78 -330 L-76 -190 M78 -330 L76 -190" stroke="{SUL}" stroke-width="4" fill="none"/>')
        a(f'<path d="M-36 -350 Q0 -325 36 -350" fill="#fff"/><path d="M-62 -350 Q0 -300 62 -350" fill="none" stroke="{SUD}" stroke-width="9"/>')
        a(f'<rect x="-30" y="-382" width="60" height="40" rx="10" fill="{SKD}"/>')
        a(f'<circle cx="-80" cy="-440" r="20" fill="{SKD}"/><circle cx="80" cy="-440" r="20" fill="{SKD}"/>')
        a(f'<rect x="-80" y="-520" width="160" height="150" rx="34" fill="{HR}"/>')
        a(f'<path d="M-56 -496 Q-6 -520 54 -498" stroke="{HRL}" stroke-width="8" fill="none"/><path d="M-50 -500 Q0 -470 50 -500" stroke="#1C0F08" stroke-width="6" fill="none"/><path d="M-30 -520 Q-10 -500 -20 -474 M30 -520 Q10 -500 20 -474" stroke="{HRL}" stroke-width="5" fill="none"/>')
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
for y,lab in [(585,'SUELO'),(1190,'SUELO')]:
    out.append(f'<line x1="60" y1="{y+10}" x2="1900" y2="{y+10}" stroke="#2B1B10" stroke-opacity=".35" stroke-width="3" stroke-dasharray="14 10"/>')
out.append('<line x1="60" y1="420" x2="1900" y2="420" stroke="#C0392B" stroke-opacity=".5" stroke-width="2" stroke-dasharray="6 8"/><text x="1840" y="412" font-size="20" fill="#C0392B" font-family="Poppins,Arial">ojos</text>')
out.append('<line x1="60" y1="790" x2="1900" y2="790" stroke="#C0392B" stroke-opacity=".5" stroke-width="2" stroke-dasharray="6 8"/><text x="1840" y="782" font-size="20" fill="#C0392B" font-family="Poppins,Arial">ojos</text>')
out.append('<text x="80" y="205" font-family="Poppins,Arial" font-weight="800" font-size="34" fill="#2B1B10">1 · PUERQUITO ALCANCÍA DORADO (mascota y logo)</text>')
out.append('<text x="80" y="690" font-family="Poppins,Arial" font-weight="800" font-size="34" fill="#2B1B10">2 · EL ANFITRIÓN (el que explica)</text>')
for c,v,n in zip(cols,views,names):
    out.append(f'<g transform="translate({c},{410}) scale(1.0)" stroke="#2B1B10" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">{pig(v)}</g>')
    out.append(f'<text x="{c}" y="640" text-anchor="middle" font-family="Poppins,Arial" font-weight="700" font-size="26" fill="#7A4A08">{n}</text>')
    out.append(f'<g transform="translate({c},{1180}) scale(.72)" stroke="#2B1B10" stroke-width="9" stroke-linejoin="round" stroke-linecap="round">{man(v)}</g>')
    out.append(f'<text x="{c}" y="1235" text-anchor="middle" font-family="Poppins,Arial" font-weight="700" font-size="26" fill="#7A4A08">{n}</text>')
# paleta
pal=[('#F4BC33','Oro'),('#C98A12','Oro sombra'),('#1F2A44','Traje oscuro'),('#8DB531','Corbata'),('#3C2415','Pelo'),('#E3A56F','Piel'),('#2B1B10','Trazo')]
out.append('<text x="80" y="1290" font-family="Poppins,Arial" font-weight="800" font-size="26" fill="#2B1B10">PALETA</text>')
for i,(c,n) in enumerate(pal):
    x=80+i*118
    out.append(f'<rect x="{x}" y="1305" width="100" height="64" rx="14" fill="{c}" stroke="#2B1B10" stroke-width="4"/><text x="{x+50}" y="1398" text-anchor="middle" font-family="Poppins,Arial" font-weight="600" font-size="17" fill="#2B1B10">{n}</text>')
out.append('<g><rect x="940" y="1280" width="940" height="170" rx="24" fill="#2B1B10"/><text x="976" y="1328" font-family="Poppins,Arial" font-weight="800" font-size="28" fill="#FFC928">CÓMO SE PRODUCE</text><text x="976" y="1372" font-family="Poppins,Arial" font-weight="600" font-size="25" fill="#fff">Diseño de personajes, guiones y revisión: Claude</text><text x="976" y="1410" font-family="Poppins,Arial" font-weight="600" font-size="25" fill="#fff">Animación y render de escenas: Haiku, con esta hoja como regla</text></g>')
out.append('</svg>')
open('hoja-personajes.svg','w').write('\n'.join(out))
