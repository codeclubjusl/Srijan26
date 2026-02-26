"use client";

import gsap from "gsap";
import React, { useEffect, useRef } from "react";

interface WavyGradientProps {
  /** Bottom Color (Deep Blue) - Default: "#2115D1" */
  color1?: string;
  /** Middle Color (Cyan/Teal) - Default: "#6B64CA" */
  color2?: string;
  /** Top Color (White) - Default: "#E9E8FD" */
  color3?: string;
  /** Speed of the animation - Default: 1.3 */
  speed?: number;
  /** Direction in degrees - Default: 15 */
  direction?: number;
  /** Wave Frequency - Default: 7.0 */
  waveFrequency?: number;
  /** Wave Amplitude - Default: 1.7 */
  waveAmplitude?: number;
  /** Noise Intensity - Default: 3 */
  noiseIntensity?: number;
  /** * Vertical position of the wave center (0.0 to 1.0).
   * 0.5 is center, 0.0 is bottom, 1.0 is top.
   * Default: 0.5
   */
  waveHeight?: number;
  /** Overall brightness multiplier - Default: 1.0 */
  brightness?: number;

  className?: string;
}

const WavyGradient: React.FC<WavyGradientProps> = ({
  // COLOR CONTROLS
  color1 = "#2115D1",
  color2 = "#6B64CA",
  color3 = "#E9E8FD",

  // MOTION CONTROLS
  speed = 1.3,
  direction = 15,

  // WAVE CONTROLS
  waveFrequency = 7.0,
  waveAmplitude = 1.7,
  noiseIntensity = 3,
  waveHeight = 0.5,

  // LIGHTING CONTROLS
  brightness = 1.0, // New default

  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hexToRgb = (hex: string): [number, number, number] => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return [r, g, b];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "default",
      preserveDrawingBuffer: false,
    });

    if (!gl) return;

    // --- RESIZE HANDLER ---
    const resize = () => {
      if (typeof window === "undefined") return;
      const realDpr = window.devicePixelRatio || 1;
      const dpr = Math.min(realDpr, 2.0) * 0.6;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // --- VERTEX SHADER ---
    const vertexShaderSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5; 
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // --- FRAGMENT SHADER ---
    const fragmentShaderSource = `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
      #else
        precision mediump float;
      #endif

      varying vec2 vUv;
      
      uniform float iTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      
      uniform float uAngle;
      uniform float uWaveFreq;
      uniform float uWaveAmp;
      uniform float uNoiseStr;
      uniform float uWaveHeight; 
      uniform float uBrightness; // New Uniform

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      vec2 rotate(vec2 uv, float rotation, vec2 mid) {
          return vec2(
            cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
            cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
          );
      }

      void main() {
        vec2 uv = rotate(vUv, uAngle, vec2(0.5));

        float n = noise(uv * 5.0 + iTime * 0.5);

        // Splitting up the wave calculations to mimic original behavior
        float wave =
          sin(uv.x * (uWaveFreq * 0.4) + iTime * 2.6) * 0.045 * uWaveAmp +
          sin(uv.x * uWaveFreq - iTime * 2.0) * 0.030 * uWaveAmp +
          sin(uv.x * (uWaveFreq * 1.8) + iTime * 3.2 + uv.y * 3.0) * 0.020 * uWaveAmp;

        float gradient = uv.y + wave + (n * 0.08 * uNoiseStr) - (uWaveHeight - 0.5);

        gradient = clamp(gradient, 0.0, 1.0);
        gradient = smoothstep(0.0, 1.0, gradient); 
        
        vec3 c1 = mix(uColor1, uColor2, smoothstep(0.0, 0.5, gradient));
        vec3 finalColor = mix(c1, uColor3, smoothstep(0.5, 1.0, gradient));

        // Apply brightness multiplier
        finalColor *= uBrightness;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (type: number, src: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const program = gl.createProgram();
    if (!program) return;

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vs || !fs) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const locs = {
      time: gl.getUniformLocation(program, "iTime"),
      color1: gl.getUniformLocation(program, "uColor1"),
      color2: gl.getUniformLocation(program, "uColor2"),
      color3: gl.getUniformLocation(program, "uColor3"),
      angle: gl.getUniformLocation(program, "uAngle"),
      freq: gl.getUniformLocation(program, "uWaveFreq"),
      amp: gl.getUniformLocation(program, "uWaveAmp"),
      noise: gl.getUniformLocation(program, "uNoiseStr"),
      height: gl.getUniformLocation(program, "uWaveHeight"),
      brightness: gl.getUniformLocation(program, "uBrightness"), // New Location
    };

    let rafId: number;
    let isRendering = false;
    let startTime = performance.now();

    const render = (now: number) => {
      if (!isRendering) return;

      const elapsed = (now - startTime) * 0.001 * speed;

      gl.uniform1f(locs.time, elapsed);
      gl.uniform3fv(locs.color1, hexToRgb(color1));
      gl.uniform3fv(locs.color2, hexToRgb(color2));
      gl.uniform3fv(locs.color3, hexToRgb(color3));
      gl.uniform1f(locs.angle, (direction * Math.PI) / 180);
      gl.uniform1f(locs.freq, waveFrequency);
      gl.uniform1f(locs.amp, waveAmplitude);
      gl.uniform1f(locs.noise, noiseIntensity);
      gl.uniform1f(locs.height, waveHeight);
      gl.uniform1f(locs.brightness, brightness); // Pass brightness prop to shader

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!isRendering) {
          isRendering = true;
          rafId = requestAnimationFrame(render);
        }
      } else {
        isRendering = false;
        cancelAnimationFrame(rafId);
      }
    });
    observer.observe(canvas);

    return () => {
      isRendering = false;
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("resize", resize);

      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, [
    color1,
    color2,
    color3,
    speed,
    direction,
    waveFrequency,
    waveAmplitude,
    noiseIntensity,
    waveHeight,
    brightness, // Added dependency
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={` ${className} fixed bottom-0 left-0 right-0 w-full h-[120vh] -z-10`}
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
};

export default WavyGradient;
