// hero: cursor-driven fluid sim reveals the circuit layer under the photo
(function () {
  const VS = `#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;
uniform vec2 uTexel;
out vec2 vUv, vL, vR, vT, vB;
void main(){
  vUv = aPos*.5+.5;
  vL = vUv - vec2(uTexel.x,0.); vR = vUv + vec2(uTexel.x,0.);
  vT = vUv + vec2(0.,uTexel.y); vB = vUv - vec2(0.,uTexel.y);
  gl_Position = vec4(aPos,0.,1.);
}`;

  const H = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv, vL, vR, vT, vB; out vec4 o;
`;

  const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+10.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
  return 105.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

  const FS = {
    splat: H + `
uniform sampler2D uTarget; uniform vec2 uScale, uP0, uP1; uniform vec3 uColor; uniform float uRadius, uCap;
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-9),0.,1.); return length(pa-ba*h); }
void main(){
  float d = seg(vUv*uScale, uP0*uScale, uP1*uScale);
  vec3 s = exp(-d*d/uRadius)*uColor;
  vec3 b = texture(uTarget,vUv).xyz;
  o = vec4(clamp(b+s, vec3(-uCap), vec3(uCap)), 1.);
}`,
    advect: H + `
uniform sampler2D uVel, uSrc; uniform vec2 uSimTexel; uniform float uDt, uDiss;
void main(){
  vec2 c = vUv - uDt*texture(uVel,vUv).xy*uSimTexel;
  o = texture(uSrc,c)/(1.+uDiss*uDt);
}`,
    div: H + `
uniform sampler2D uVel;
void main(){
  float L=texture(uVel,vL).x, R=texture(uVel,vR).x, T=texture(uVel,vT).y, B=texture(uVel,vB).y;
  vec2 C=texture(uVel,vUv).xy;
  if(vL.x<0.)L=-C.x; if(vR.x>1.)R=-C.x; if(vT.y>1.)T=-C.y; if(vB.y<0.)B=-C.y;
  o=vec4(.5*(R-L+T-B),0.,0.,1.);
}`,
    curl: H + `
uniform sampler2D uVel;
void main(){
  float L=texture(uVel,vL).y, R=texture(uVel,vR).y, T=texture(uVel,vT).x, B=texture(uVel,vB).x;
  o=vec4(.5*(R-L-T+B),0.,0.,1.);
}`,
    vort: H + `
uniform sampler2D uVel, uCurl; uniform float uCurlAmt, uDt;
void main(){
  float L=texture(uCurl,vL).x, R=texture(uCurl,vR).x, T=texture(uCurl,vT).x, B=texture(uCurl,vB).x, C=texture(uCurl,vUv).x;
  vec2 f=.5*vec2(abs(T)-abs(B), abs(R)-abs(L));
  f/=length(f)+1e-4; f*=uCurlAmt*C; f.y*=-1.;
  vec2 v=texture(uVel,vUv).xy+f*uDt;
  o=vec4(clamp(v,-1000.,1000.),0.,1.);
}`,
    press: H + `
uniform sampler2D uP, uDiv;
void main(){
  float L=texture(uP,vL).x, R=texture(uP,vR).x, T=texture(uP,vT).x, B=texture(uP,vB).x;
  o=vec4((L+R+T+B-texture(uDiv,vUv).x)*.25,0.,0.,1.);
}`,
    grad: H + `
uniform sampler2D uP, uVel;
void main(){
  float L=texture(uP,vL).x, R=texture(uP,vR).x, T=texture(uP,vT).x, B=texture(uP,vB).x;
  o=vec4(texture(uVel,vUv).xy-vec2(R-L,T-B),0.,1.);
}`,
    mul: H + `
uniform sampler2D uT; uniform float uV;
void main(){ o=uV*texture(uT,vUv); }`,
    blur: H + `
uniform sampler2D uT; uniform vec2 uDir;
void main(){
  vec4 s=texture(uT,vUv)*.2270270270;
  s+=(texture(uT,vUv+uDir*1.3846153846)+texture(uT,vUv-uDir*1.3846153846))*.3162162162;
  s+=(texture(uT,vUv+uDir*3.2307692308)+texture(uT,vUv-uDir*3.2307692308))*.0702702703;
  o=s;
}`,
    display: H + NOISE + `
uniform sampler2D uDye, uPortrait, uBlur, uTrace, uPads;
uniform vec2 uRes, uDyeRes, uScale, uMouse, uPar;
uniform vec4 uRect;
uniform float uTime, uDpr, uHover, uBlobR, uReveal, uFade, uTh, uTile, uGrey, uFx;
uniform vec3 cBase, cDeep, cLight, cSolder;

vec4 cubic(float v){ vec4 n=vec4(1.,2.,3.,4.)-v; vec4 s=n*n*n; float x=s.x; float y=s.y-4.*s.x; float z=s.z-4.*s.y+6.*s.x; float w=6.-x-y-z; return vec4(x,y,z,w)*(1./6.); }
vec4 bicubic(sampler2D t, vec2 uv, vec2 res){
  uv = uv*res - .5; vec2 f = fract(uv); uv -= f;
  vec4 xc = cubic(f.x), yc = cubic(f.y);
  vec4 c = uv.xxyy + vec2(-.5, 1.5).xyxy;
  vec4 s = vec4(xc.xz + xc.yw, yc.xz + yc.yw);
  vec4 off = (c + vec4(xc.yw, yc.yw)/s)/res.xxyy;
  vec4 s0=texture(t,off.xz), s1=texture(t,off.yz), s2=texture(t,off.xw), s3=texture(t,off.yw);
  float sx = s.x/(s.x+s.y), sy = s.z/(s.z+s.w);
  return mix(mix(s3,s2,sx), mix(s1,s0,sx), sy);
}
float inside(vec2 p){ vec2 a = step(vec2(0.), p)*step(p, vec2(1.)); return a.x*a.y; }

void main(){
  vec2 uv = vUv;
  vec2 p = uv*uScale;
  float t = uTime;

  vec2 wq = vec2(snoise(vec3(p*1.7, t*.16)), snoise(vec3(p*1.7+11.7, t*.16)));
  float dye = bicubic(uDye, uv + wq*.011, uDyeRes).r;
  vec2 dm = (uv - uMouse)*uScale;
  float ang = atan(dm.y, dm.x + 1e-6);
  float wob = snoise(vec3(cos(ang)*.85, sin(ang)*.85, t*.55))*.18 + snoise(vec3(p*2.6, t*.35))*.07;
  float rr = uBlobR*(1. + wob);
  float hb = uHover*exp(-dot(dm,dm)/(rr*rr + 1e-6));
  float F = dye + hb;
  float fw = max(fwidth(F), 1e-5);
  float m = smoothstep(uTh - fw*.9, uTh + fw*.9, F);
  float rim = (1. - smoothstep(.55*uDpr, 1.5*uDpr, abs(F - uTh)/fw)) * step(.002, F);

  vec2 fp = uv*uRes;
  vec2 tuv = fp/(uTile*uDpr) + uPar*1.5;
  float tr = texture(uTrace, tuv).a;
  float pd = texture(uPads, tuv).a;
  float ring = length((uv - vec2(.5,.42))*uScale);
  float rv = 1. - smoothstep(uReveal*1.9 - .35, uReveal*1.9, ring);
  vec3 col = mix(cBase, cLight, tr*.06*rv);
  col = mix(col, cSolder, pd*.22*rv);

  vec2 puv = (uv - uRect.xy - uPar)/uRect.zw;
  vec4 P = texture(uPortrait, clamp(puv, 0., 1.)) * inside(puv) * uFade;
  // the photo's shoulders fade through gray, tighten that up
  P *= mix(1., smoothstep(.0, .85, P.a), smoothstep(.45, .22, puv.y));
  P.rgb *= smoothstep(.0, .7, P.a);
  col = col*(1. - P.a) + P.rgb;

  // inside the blob
  vec3 alt = cDeep;
  float sw = fract(dot(p, vec2(.88, .47))*.9 - t*.32);
  float pulse = smoothstep(0., .05, sw)*(1. - smoothstep(.05, .32, sw));
  alt = mix(alt, mix(cDeep, cLight, .2), tr*.85);
  alt = mix(alt, cLight, tr*pulse*.7);
  alt = mix(alt, cSolder, pd*.6);

  // led matrix portrait
  float cell = 8.*uDpr;
  vec2 cc = (floor(fp/cell) + .5)*cell;
  vec2 pc = (cc/uRes - uRect.xy - uPar*2.2)/uRect.zw;
  vec4 Bc = texture(uBlur, clamp(pc, 0., 1.))*inside(pc);
  float lum = dot(Bc.rgb, vec3(.299,.587,.114))/max(Bc.a, .03);
  float on = smoothstep(.25, .7, Bc.a)*uFade;
  float lv = smoothstep(.06, .92, lum);
  float dd = length(fp - cc)/cell;
  float aa = 1.1/cell;
  float led = 1. - smoothstep(mix(.13, .46, lv) - aa, mix(.13, .46, lv) + aa, dd);
  alt = mix(alt, cDeep*.7, on*.92);
  alt = mix(alt, mix(cLight*.16, cLight, lv), led*on);
  alt += cLight*exp(-dd*dd*7.)*lv*on*.1;

  col = mix(col, alt, m*uFx);
  col = mix(col, cLight, rim*.9*uFx);
  float gy = dot(col, vec3(.299,.587,.114));
  col = mix(col, mix(vec3(.09,.12,.21), vec3(.74,.78,.86), gy), uGrey);
  o = vec4(col, 1.);
}`
  };

  function hexToRgb(h) {
    h = (h || '').trim().replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h || '000000', 16);
    return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
  }

  function create(canvas, opt) {
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
    if (!gl) return null;
    if (!gl.getExtension('EXT_color_buffer_float')) return null;

    const compile = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VS);
    const prog = (src) => {
      const p = gl.createProgram();
      gl.attachShader(p, vs); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, src));
      gl.bindAttribLocation(p, 0, 'aPos'); gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
      const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) { const name = gl.getActiveUniform(p, i).name; u[name] = gl.getUniformLocation(p, name); }
      return { p, u, use() { gl.useProgram(p); return this; } };
    };
    let P;
    try { P = {}; for (const k in FS) P[k] = prog(FS[k]); }
    catch (e) { console.warn('[hero] shader error', e); return null; }

    const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const blit = (target) => {
      if (target) { gl.viewport(0, 0, target.w, target.h); gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb); }
      else { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const fbo = (w, h) => {
      const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        tex, fb, w, h, texel: [1 / w, 1 / h],
        bind(i) { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, tex); return i; },
        free() { gl.deleteTexture(tex); gl.deleteFramebuffer(fb); }
      };
    };
    const dfbo = (w, h) => {
      let a = fbo(w, h), b = fbo(w, h);
      return { w, h, texel: a.texel, get read() { return a; }, get write() { return b; }, swap() { const t = a; a = b; b = t; }, free() { a.free(); b.free(); } };
    };
    {
      const t = fbo(4, 4);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      t.free(); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      if (!ok) return null;
    }

    const S = Object.assign({
      simRes: 128, dyeRes: 640,
      velDiss: 2.2, dyeDiss: 1.15, pressure: .8, iters: 18, curl: 4,
      dyeRadius: .0021, velRadius: .0035, force: .14,
      blobR: .085, threshold: .42
    }, opt.settings || {});

    const css = getComputedStyle(document.documentElement);
    const C = {
      base: hexToRgb(css.getPropertyValue('--bg')), deep: hexToRgb(css.getPropertyValue('--deep')),
      light: hexToRgb(css.getPropertyValue('--fg')), solder: hexToRgb(css.getPropertyValue('--solder'))
    };

    let W = 1, Hh = 1, dpr = 1, scale = [1, 1], sim = null, dye = null, divg = null, curl = null, pres = null;
    let portraitTex = null, blurTex = null, imgW = 3, imgH = 4, rect = [0, 0, 1, 1];
    let running = false, raf = 0, last = 0, time = 0, visible = true;
    const st = {
      tx: .5, ty: .55, mx: .5, my: .55, active: false, hover: 0, hoverT: 0, speed: 0,
      parX: 0, parY: 0, reveal: 0, fade: 0, grey: 0, fx: 1, demo: false, demoT0: 0, handoff: 0, fadeUntil: 0, inside: false, finger: false, lastTouch: -9,
      touch: matchMedia('(hover: none)').matches
    };

    const res = (r) => {
      let a = W / Hh; if (a < 1) a = 1 / a;
      const min = Math.round(r), max = Math.round(r * a);
      return W > Hh ? [max, min] : [min, max];
    };
    let simAspect = 0;
    function initSim() {
      [sim, dye, divg, curl, pres].forEach(x => x && x.free());
      const s = res(S.simRes), d = res(S.dyeRes);
      sim = dfbo(s[0], s[1]); dye = dfbo(d[0], d[1]);
      divg = fbo(s[0], s[1]); curl = fbo(s[0], s[1]); pres = dfbo(s[0], s[1]);
      simAspect = W / Hh;
    }

    function layout() {
      // on wide screens the photo runs off the bottom edge so the face reads bigger
      const ia = imgW / imgH, a = W / Hh, wide = a >= .85;
      let h = wide ? 1.2 : .8;
      let w = h * ia / a;
      if (w > 1.25) { w = 1.25; h = w * a / ia; }
      rect = [.5 - w / 2, wide ? -.1 * h : 0, w, h];
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const maxPx = 3.2e6;
      if (r.width * r.height * dpr * dpr > maxPx) dpr = Math.sqrt(maxPx / (r.width * r.height));
      const w = Math.max(2, Math.round(r.width * dpr)), h = Math.max(2, Math.round(r.height * dpr));
      if (w === W && h === Hh) return;
      W = canvas.width = w; Hh = canvas.height = h;
      const m = Math.min(W, Hh); scale = [W / m, Hh / m];
      if (!sim || Math.abs(W / Hh - simAspect) / simAspect > .12) initSim();
      layout();
    }

    function uploadImage(img) {
      imgW = img.naturalWidth; imgH = img.naturalHeight;
      portraitTex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, portraitTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
      if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 4);

      // half-res blurred copy for the led matrix
      const bw = Math.round(imgW / 2), bh = Math.round(imgH / 2);
      const bl = dfbo(bw, bh);
      P.mul.use(); gl.uniform2f(P.mul.u.uTexel, 1 / bw, 1 / bh);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, portraitTex);
      gl.uniform1i(P.mul.u.uT, 0); gl.uniform1f(P.mul.u.uV, 1);
      blit(bl.write); bl.swap();
      P.blur.use(); gl.uniform2f(P.blur.u.uTexel, 1 / bw, 1 / bh);
      [1, 1.5].forEach(k => {
        gl.uniform1i(P.blur.u.uT, bl.read.bind(0)); gl.uniform2f(P.blur.u.uDir, k / bw, 0); blit(bl.write); bl.swap();
        gl.uniform1i(P.blur.u.uT, bl.read.bind(0)); gl.uniform2f(P.blur.u.uDir, 0, k / bh); blit(bl.write); bl.swap();
      });
      blurTex = bl.read; bl.write.free();
      layout();
    }

    function splat(x0, y0, x1, y1, vx, vy, amount, rDye, rVel) {
      P.splat.use();
      gl.uniform2f(P.splat.u.uTexel, sim.texel[0], sim.texel[1]);
      gl.uniform2f(P.splat.u.uScale, scale[0], scale[1]);
      gl.uniform2f(P.splat.u.uP0, x0, y0); gl.uniform2f(P.splat.u.uP1, x1, y1);
      gl.uniform1i(P.splat.u.uTarget, sim.read.bind(0));
      gl.uniform3f(P.splat.u.uColor, vx, vy, 0); gl.uniform1f(P.splat.u.uRadius, rVel || S.velRadius);
      gl.uniform1f(P.splat.u.uCap, 4000);
      blit(sim.write); sim.swap();
      gl.uniform2f(P.splat.u.uTexel, dye.texel[0], dye.texel[1]);
      gl.uniform1i(P.splat.u.uTarget, dye.read.bind(0));
      gl.uniform3f(P.splat.u.uColor, amount, 0, 0); gl.uniform1f(P.splat.u.uRadius, rDye || S.dyeRadius);
      gl.uniform1f(P.splat.u.uCap, 1.15);
      blit(dye.write); dye.swap();
    }

    function step(dt) {
      const tx = sim.texel;
      P.curl.use(); gl.uniform2f(P.curl.u.uTexel, tx[0], tx[1]);
      gl.uniform1i(P.curl.u.uVel, sim.read.bind(0)); blit(curl);

      P.vort.use(); gl.uniform2f(P.vort.u.uTexel, tx[0], tx[1]);
      gl.uniform1i(P.vort.u.uVel, sim.read.bind(0)); gl.uniform1i(P.vort.u.uCurl, curl.bind(1));
      gl.uniform1f(P.vort.u.uCurlAmt, S.curl); gl.uniform1f(P.vort.u.uDt, dt);
      blit(sim.write); sim.swap();

      P.div.use(); gl.uniform2f(P.div.u.uTexel, tx[0], tx[1]);
      gl.uniform1i(P.div.u.uVel, sim.read.bind(0)); blit(divg);

      P.mul.use(); gl.uniform2f(P.mul.u.uTexel, tx[0], tx[1]);
      gl.uniform1i(P.mul.u.uT, pres.read.bind(0)); gl.uniform1f(P.mul.u.uV, S.pressure);
      blit(pres.write); pres.swap();

      P.press.use(); gl.uniform2f(P.press.u.uTexel, tx[0], tx[1]);
      gl.uniform1i(P.press.u.uDiv, divg.bind(0));
      for (let i = 0; i < S.iters; i++) { gl.uniform1i(P.press.u.uP, pres.read.bind(1)); blit(pres.write); pres.swap(); }

      P.grad.use(); gl.uniform2f(P.grad.u.uTexel, tx[0], tx[1]);
      gl.uniform1i(P.grad.u.uP, pres.read.bind(0)); gl.uniform1i(P.grad.u.uVel, sim.read.bind(1));
      blit(sim.write); sim.swap();

      P.advect.use(); gl.uniform2f(P.advect.u.uTexel, tx[0], tx[1]);
      gl.uniform2f(P.advect.u.uSimTexel, tx[0], tx[1]); gl.uniform1f(P.advect.u.uDt, dt);
      gl.uniform1i(P.advect.u.uVel, sim.read.bind(0)); gl.uniform1i(P.advect.u.uSrc, sim.read.bind(0));
      gl.uniform1f(P.advect.u.uDiss, S.velDiss); blit(sim.write); sim.swap();

      gl.uniform2f(P.advect.u.uTexel, dye.texel[0], dye.texel[1]);
      gl.uniform1i(P.advect.u.uVel, sim.read.bind(0)); gl.uniform1i(P.advect.u.uSrc, dye.read.bind(1));
      gl.uniform1f(P.advect.u.uDiss, time < st.fadeUntil ? 5 : S.dyeDiss); blit(dye.write); dye.swap();
    }

    function render() {
      const d = P.display.use(), u = d.u;
      gl.uniform2f(u.uTexel, 1 / W, 1 / Hh);
      gl.uniform1i(u.uDye, dye.read.bind(0));
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, portraitTex); gl.uniform1i(u.uPortrait, 1);
      gl.uniform1i(u.uBlur, blurTex.bind(2));
      gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, traceTex); gl.uniform1i(u.uTrace, 3);
      gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D, padTex); gl.uniform1i(u.uPads, 4);
      gl.uniform1f(u.uTile, opt.tile || 1024);
      gl.uniform2f(u.uRes, W, Hh); gl.uniform2f(u.uDyeRes, dye.w, dye.h); gl.uniform2f(u.uScale, scale[0], scale[1]);
      gl.uniform2f(u.uMouse, st.mx, st.my); gl.uniform2f(u.uPar, st.parX, st.parY);
      gl.uniform4f(u.uRect, rect[0], rect[1], rect[2], rect[3]);
      gl.uniform1f(u.uTime, time); gl.uniform1f(u.uDpr, dpr);
      gl.uniform1f(u.uHover, st.hover); gl.uniform1f(u.uBlobR, S.blobR * (1 + Math.min(st.speed * .22, .4)));
      gl.uniform1f(u.uReveal, st.reveal); gl.uniform1f(u.uGrey, st.grey); gl.uniform1f(u.uFx, st.fx); gl.uniform1f(u.uFade, st.fade); gl.uniform1f(u.uTh, S.threshold);
      gl.uniform3fv(u.cBase, C.base); gl.uniform3fv(u.cDeep, C.deep); gl.uniform3fv(u.cLight, C.light); gl.uniform3fv(u.cSolder, C.solder);
      blit(null);
    }

    const host = opt.host || canvas.parentElement;
    const toUv = (e) => {
      const r = canvas.getBoundingClientRect();
      return [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
    };
    host.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const [x, y] = toUv(e);
      st.tx = x; st.ty = y; st.inside = true;
      // first move ends the demo loop: let its trail fade, then pick up the cursor
      if (st.demo) { st.demo = false; st.handoff = time; st.fadeUntil = time + .9; st.hoverT = 0; return; }
      if (st.handoff) return;
      st.hoverT = 1;
      if (!st.active) { st.mx = x; st.my = y; st.active = true; }
    }, { passive: true });
    host.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') { st.hoverT = 0; st.active = false; st.inside = false; } });
    const fingerAt = (t) => {
      const r = canvas.getBoundingClientRect();
      return [(t.clientX - r.left) / r.width, 1 - (t.clientY - r.top) / r.height];
    };
    host.addEventListener('touchstart', (e) => {
      const [x, y] = fingerAt(e.touches[0]);
      if (st.demo) { st.demo = false; st.fadeUntil = time + .9; }
      st.tx = st.mx = x; st.ty = st.my = y;
      st.finger = true; st.active = true; st.hoverT = 1; st.lastTouch = time;
    }, { passive: true });
    host.addEventListener('touchmove', (e) => {
      const [x, y] = fingerAt(e.touches[0]);
      st.tx = x; st.ty = y; st.lastTouch = time;
    }, { passive: true });
    const lift = (e) => {
      if (e.touches.length) return;
      st.finger = false; st.active = false; st.hoverT = 0; st.lastTouch = time;
    };
    host.addEventListener('touchend', lift, { passive: true });
    host.addEventListener('touchcancel', lift, { passive: true });
    host.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'touch' || !sim) return;
      const [x, y] = toUv(e);
      for (let i = 0; i < 6; i++) {
        const a = i / 6 * Math.PI * 2, r = .04;
        splat(x, y, x + Math.cos(a) * r / scale[0], y + Math.sin(a) * r / scale[1], Math.cos(a) * 160, Math.sin(a) * 160, .9);
      }
    }, { passive: true });

    function frame(now) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - (last || now)) / 1000, 1 / 30) || 1 / 60;
      last = now; time += dt;
      if (!portraitTex) return;

      // circle the head until the mouse moves; on touch screens wander until a finger takes over
      let autoActive = false;
      if (st.demo) {
        const a = (time - st.demoT0) * 1.1 + Math.PI, r = rect[2] * .32;
        st.tx = .5 + Math.cos(a) * r;
        st.ty = rect[1] + rect[3] * .59 + Math.sin(a) * r * scale[0] / scale[1] * 1.1;
        autoActive = true;
        if (!st.wasAuto) { st.mx = st.tx; st.my = st.ty; }
      } else if (st.touch && visible && !st.finger && time - st.lastTouch > 2.5) {
        const tt = time * .42;
        st.tx = .5 + Math.sin(tt) * .2 + Math.sin(tt * 2.3) * .05;
        st.ty = rect[3] * .7 + Math.sin(tt * .77 + 1) * .13;
        autoActive = true; st.hoverT = .75;
        if (!st.wasAuto) { st.mx = st.tx; st.my = st.ty; }
      }
      st.wasAuto = autoActive;
      if (st.handoff && time - st.handoff > .35) {
        st.handoff = 0;
        if (st.inside) { st.mx = st.tx; st.my = st.ty; st.active = true; st.hoverT = 1; }
      }

      const kf = 1 - Math.pow(1 - (st.finger ? .45 : .2), dt * 60);
      const nx = st.mx + (st.tx - st.mx) * kf, ny = st.my + (st.ty - st.my) * kf;
      const dx = nx - st.mx, dy = ny - st.my;
      const sp = Math.hypot(dx * scale[0], dy * scale[1]) / dt;
      st.speed += (sp - st.speed) * .15;
      if ((st.active || autoActive) && (dx * dx + dy * dy) > 1e-9) {
        const amt = Math.min(1, .18 + sp * 1.1) * (autoActive && st.touch ? .75 : 1);
        splat(st.mx, st.my, nx, ny, dx / dt * sim.w * S.force, dy / dt * sim.h * S.force, amt * Math.min(1, dt * 60));
      }
      st.mx = nx; st.my = ny;
      st.hover += (st.hoverT - st.hover) * (1 - Math.pow(1 - .09, dt * 60));
      const px = (st.mx - .5) * .006, py = (st.my - .5) * .004;
      st.parX += (px - st.parX) * .05; st.parY += (py - st.parY) * .05;

      step(dt);
      render();
    }

    function start() { if (running) return; running = true; last = 0; raf = requestAnimationFrame(frame); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible && !document.hidden ? start() : stop(); }, { threshold: 0 });
    io.observe(canvas);
    document.addEventListener('visibilitychange', () => { document.hidden ? stop() : visible && start(); });
    window.addEventListener('resize', resize);

    const tileTex = (src) => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      if (src) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, src);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        const an = gl.getExtension('EXT_texture_filter_anisotropic');
        if (an) gl.texParameterf(gl.TEXTURE_2D, an.TEXTURE_MAX_ANISOTROPY_EXT, 4);
      } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      return tex;
    };
    const traceTex = tileTex(opt.traces), padTex = tileTex(opt.pads);

    resize();
    const ready = new Promise((resolve, reject) => {
      const img = new Image(); img.decoding = 'async';
      img.onload = () => { try { uploadImage(img); resolve(); } catch (e) { reject(e); } };
      img.onerror = reject; img.src = opt.portrait;
    });

    return {
      ready, start, stop,
      set(k, v) { st[k] = v; },
      get state() { return st; },
      get rect() { return rect; },
      intro(gsap) {
        const tw = { r: 0, f: 0 };
        const upd = () => { st.reveal = tw.r; st.fade = tw.f; };
        if (gsap) {
          gsap.to(tw, { f: 1, duration: 1.2, ease: 'power2.out', onUpdate: upd });
          gsap.to(tw, { r: 1, duration: 2.4, ease: 'power3.inOut', onUpdate: upd });
        } else { tw.r = tw.f = 1; upd(); }
        if (gsap && !st.touch) {
          setTimeout(() => {
            if (st.active || st.handoff) return;
            st.demo = true; st.demoT0 = time; st.hoverT = .9;
          }, 650);
        }
      }
    };
  }

  window.HeroGL = { create };
})();
