"use client";

import { useEffect, useRef, useState } from "react";
import { durations, easings } from "@/design/tokens";
import { easeFrom } from "@/lib/ease";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Brushed aluminium, shaded in WebGL: a Kajiya-Kay anisotropic highlight across horizontal
 * brush grooves, a two-strip studio environment, and a noise-thresholded dissolve between
 * finishes (400 ms, --ease-in-out), the same move the Finish lab will use.
 *
 * Raw WebGL1, no three.js: ~3 kB. Renders only while visible and only when something changes
 * (pointer, dissolve, idle drift). Reduced motion: no drift, instant finish swap.
 * No WebGL: a CSS stand-in with the same colour.
 */

export type Finish = {
  id: string;
  name: string;
  note: string;
  hex: string;
  /** 0 = mirror-like brushed, 1 = fully matte */
  rough: number;
  /** 0 = dielectric (paint), 1 = bare or anodized metal */
  metal: number;
};

export const FINISHES: Finish[] = [
  { id: "mill", name: "Mill", note: "die lines · 6063-T6", hex: "#B7BCC1", rough: 0.42, metal: 1 },
  { id: "anod-silver", name: "Anodized silver", note: "E6/EV1 · 20 µm", hex: "#C6CACE", rough: 0.68, metal: 0.92 },
  { id: "anod-black", name: "Anodized black", note: "E6/C-35 · 20 µm", hex: "#2B2D31", rough: 0.62, metal: 0.92 },
  { id: "ral-9016", name: "Powder RAL 9016", note: "30 GU · ≥ 60 µm", hex: "#EDEEE8", rough: 0.96, metal: 0.04 },
  { id: "ral-7016", name: "Powder RAL 7016", note: "30 GU · ≥ 60 µm", hex: "#383E42", rough: 0.94, metal: 0.04 },
  { id: "pvdf-bronze", name: "PVDF bronze", note: "3-coat · ~40 µm · mica", hex: "#5E4B3C", rough: 0.8, metal: 0.4 },
];

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_seed;
uniform vec2 u_light;
uniform vec3 u_colA; uniform float u_roughA; uniform float u_metalA;
uniform vec3 u_colB; uniform float u_roughB; uniform float u_metalB;
uniform float u_mix;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
// grooves run along x: slow in x, very fast in y
float brush(vec2 uv) {
  float n = 0.0, a = 0.5;
  vec2 p = vec2(uv.x * 2.5, uv.y * u_res.y * 0.9);
  for (int i = 0; i < 4; i++) { n += a * noise(p); p *= vec2(2.07, 1.93); a *= 0.5; }
  return n;
}
// isotropic orange peel for powder and PVDF: no direction
float peel(vec2 uv) {
  vec2 p = uv * u_res * 0.16;
  return 0.6 * noise(p) + 0.4 * noise(p * 2.3 + 7.1);
}
vec3 shade(vec3 base, float rough, float metal, vec2 uv) {
  float aniso = step(0.5, metal); // metals only: die-line grooves and an anisotropic highlight
  float b = brush(uv);
  float o = peel(uv);
  vec3 L = normalize(vec3(u_light - uv, 0.55));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  vec2 pn = mix(vec2(o - 0.5, peel(uv + 0.37) - 0.5) * 0.16, vec2(0.0, (b - 0.5) * 0.35 * (1.0 - rough * 0.5)), aniso);
  vec3 N = normalize(vec3(pn, 1.0));
  vec3 T = normalize(vec3(1.0, (b - 0.5) * 0.12, 0.0));
  float TdH = dot(T, H);
  float kk = pow(sqrt(max(0.0, 1.0 - TdH * TdH)), mix(260.0, 14.0, rough));
  float bp = pow(max(dot(N, H), 0.0), mix(160.0, 6.0, rough));
  float fall = exp(-pow((uv.y - u_light.y) * 1.4, 2.0));
  float spec = mix(bp * 0.35, kk * (0.35 + 0.65 * fall), aniso) * mix(0.25, 1.0, metal) * (1.0 - rough * 0.55);
  float diff = max(dot(N, L), 0.0);
  float env = 0.5 + 0.5 * smoothstep(0.2, 0.0, abs(uv.y - 0.3)) + 0.3 * smoothstep(0.12, 0.0, abs(uv.y - 0.8));
  vec3 metalCol = base * (0.32 + 0.6 * env) + spec * mix(vec3(1.0), base, 0.3);
  vec3 paintCol = base * (0.62 + 0.38 * diff) + spec * 0.5;
  vec3 col = mix(paintCol, metalCol, aniso);
  col *= mix(0.97 + 0.06 * o, 0.9 + 0.2 * b * (0.35 + 0.65 * (1.0 - rough * 0.6)), aniso);
  return col;
}
void main() {
  vec2 uv = v_uv;
  vec3 a = shade(u_colA, u_roughA, u_metalA, uv);
  vec3 c = shade(u_colB, u_roughB, u_metalB, uv);
  // dissolve along the grain, not a plain crossfade
  float d = noise(uv * vec2(9.0, 70.0) + u_seed);
  float m = smoothstep(d - 0.1, d + 0.1, u_mix * 1.2 - 0.1);
  vec3 col = mix(c, a, m);
  col = pow(max(col, 0.0), vec3(1.0 / 2.2));
  col += (hash(gl_FragCoord.xy + u_seed) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

const toLinear = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.pow(v / 255, 2.2)) as [number, number, number];
};

const inOut = easeFrom(easings.inOut);

export function BrushedMetal({ finish, className = "" }: { finish: Finish; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef({ from: finish, to: finish, t0: 0, light: [0.62, 0.42], target: [0.62, 0.42], dirty: true });
  const api = useRef<{ kick: () => void } | null>(null);
  const [fallback, setFallback] = useState(false);
  const reducedPref = useReducedMotion();

  // finish change -> start a dissolve
  useEffect(() => {
    const s = state.current;
    if (s.to.id === finish.id) return;
    s.from = s.to;
    s.to = finish;
    s.t0 = performance.now();
    s.dirty = true;
    api.current?.kick();
  }, [finish]);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const gl = el.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power", preserveDrawingBuffer: false });
    if (!gl) {
      setFallback(true);
      return;
    }
    const reduced = reducedPref;
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? "shader");
      return sh;
    };
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
    } catch {
      setFallback(true);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const U = {
      res: u("u_res"), seed: u("u_seed"), light: u("u_light"), mix: u("u_mix"),
      colA: u("u_colA"), roughA: u("u_roughA"), metalA: u("u_metalA"),
      colB: u("u_colB"), roughB: u("u_roughB"), metalB: u("u_metalB"),
    };
    gl.uniform1f(U.seed, 3.7);

    let raf = 0;
    let visible = false;
    let running = false;
    let pointerActive = false;
    let lastInput = performance.now();
    const IDLE_MS = 6000; // the light drifts for a moment, then settles: no endless render loop
    const s = state.current;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(el.clientWidth * dpr));
      const h = Math.max(1, Math.round(el.clientHeight * dpr));
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(U.res, w, h);
      s.dirty = true;
    };

    const frame = (now: number) => {
      running = false;
      if (!visible) return;
      // idle drift of the light, unless reduced motion
      if (!reduced && !pointerActive) {
        const t = now / 1000;
        s.target = [0.5 + Math.sin(t * 0.35) * 0.32, 0.45 + Math.cos(t * 0.23) * 0.18];
      }
      const k = reduced ? 1 : 0.12;
      const lx = s.light[0]! + (s.target[0]! - s.light[0]!) * k;
      const ly = s.light[1]! + (s.target[1]! - s.light[1]!) * k;
      const moved = Math.abs(lx - s.light[0]!) + Math.abs(ly - s.light[1]!) > 1e-4;
      s.light = [lx, ly];
      const p = reduced ? 1 : Math.min(1, (now - s.t0) / durations.dissolve);
      const m = inOut(p);
      if (moved || s.dirty || p < 1) {
        const a = toLinear(s.to.hex);
        const b = toLinear(s.from.hex);
        gl.uniform2f(U.light, lx, ly);
        gl.uniform1f(U.mix, m);
        gl.uniform3f(U.colA, a[0], a[1], a[2]);
        gl.uniform1f(U.roughA, s.to.rough);
        gl.uniform1f(U.metalA, s.to.metal);
        gl.uniform3f(U.colB, b[0], b[1], b[2]);
        gl.uniform1f(U.roughB, s.from.rough);
        gl.uniform1f(U.metalB, s.from.metal);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        s.dirty = false;
      }
      if (p >= 1) s.from = s.to;
      const idle = !pointerActive && now - lastInput > IDLE_MS;
      if ((!reduced && !idle) || moved || p < 1) schedule();
    };
    const schedule = () => {
      if (running || !visible) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    api.current = { kick: schedule };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointerActive = true;
      lastInput = performance.now();
      s.target = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
      schedule();
    };
    const onLeave = () => {
      pointerActive = false;
      lastInput = performance.now();
      schedule();
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      if (visible) {
        s.dirty = true;
        lastInput = performance.now();
        schedule();
      }
    });
    io.observe(el);
    const ro = new ResizeObserver(() => {
      resize();
      schedule();
    });
    ro.observe(el);
    resize();

    const lost = (e: Event) => {
      e.preventDefault();
      setFallback(true);
    };
    el.addEventListener("webglcontextlost", lost);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("webglcontextlost", lost);
      api.current = null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reducedPref]);

  if (fallback) {
    return <div className={`brushed ${className}`} data-matte={finish.rough > 0.8 || undefined} style={{ ["--finish" as string]: finish.hex }} aria-hidden="true" />;
  }
  return <canvas ref={canvas} className={`block h-full w-full ${className}`} aria-hidden="true" />;
}
