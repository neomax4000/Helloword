# Limpia las capturas de la grabación de Portabilidad de nómina: quita el botón flotante de accesibilidad
# y tapa datos personales (iniciales, nombre, cuenta, saldo, fecha de nacimiento). Uso: en la carpeta con full/s_<t>.png
import cv2, numpy as np
from PIL import Image, ImageFilter, ImageDraw
def quita_circulo(im, cx, cy, r=122, modo='inpaint'):
    m=np.zeros(im.shape[:2],np.uint8); cv2.circle(m,(cx,cy),r,255,-1)
    if modo=='vertical':
        out=im.copy().astype(np.float32); y0,y1=cy-r-4,min(im.shape[0]-1,cy+r+4)
        for x in range(max(0,cx-r-2),min(im.shape[1],cx+r+3)):
            col=np.where(m[:,x]>0)[0]
            if len(col)==0: continue
            a=out[y0,x].copy(); b=out[y1,x].copy()
            for y in col: w=(y-y0)/(y1-y0); out[y,x]=a*(1-w)+b*w
        return out.astype(np.uint8)
    if modo=='espejo':
        out=im.copy(); ys,xs=np.where(m>0); out[ys,xs]=im[ys,im.shape[1]-1-xs]; return out
    return cv2.inpaint(im,m,9,cv2.INPAINT_TELEA)
def tapa(pil, boxes):
    for (x0,y0,x1,y1) in boxes:
        reg=pil.crop((x0,y0,x1,y1)).resize((max(1,(x1-x0)//28),max(1,(y1-y0)//28))).resize((x1-x0,y1-y0),Image.NEAREST).filter(ImageFilter.GaussianBlur(14))
        mk=Image.new('L',(x1-x0,y1-y0),0); ImageDraw.Draw(mk).rounded_rectangle((0,0,x1-x0-1,y1-y0-1),radius=min(40,(y1-y0)//2),fill=255)
        pil.paste(reg,(x0,y0),mk)
    return pil
CFG={
 'home':('0.2','inpaint',(1088,1620),[(90,332,172,400),(680,325,945,405),(122,750,356,822),(122,1005,632,1110)]),
 'menu':('2.5','vertical',(1088,1620),[]),
 'porta':('5.0','espejo',(1088,1620),[]),
 'estatus':('11.8','vertical',(1087,1621),[]),
 'bancos':('15.0','vertical',(1087,1621),[]),
 'valida':('20.5','espejo',(1087,1621),[(260,1940,950,2045)]),
 'clabe':('25.0','vertical',(908,2505),[]),
}
TOP=140
for k,(t,modo,(cx,cy),boxes) in CFG.items():
    im=cv2.imread(f'full/s_{t}.png'); im=quita_circulo(im,cx,cy,modo=modo)
    pil=Image.fromarray(cv2.cvtColor(im,cv2.COLOR_BGR2RGB)); pil=tapa(pil,boxes)
    pil=pil.crop((0,TOP,pil.width,pil.height)); pil.save(f'clean/{k}.png'); print(k,pil.size)
