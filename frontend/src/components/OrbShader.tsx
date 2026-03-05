import { useEffect, useRef } from "react";

const vertexSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentSource = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;

#define PI 3.14159265359

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  float t = uTime;

  float dist = length(uv);
  float angle = atan(uv.y, uv.x);

  // Colors
  vec3 purple1 = vec3(0.545, 0.361, 0.965);
  vec3 purple2 = vec3(0.655, 0.545, 0.980);
  vec3 purple3 = vec3(0.753, 0.522, 0.988);
  vec3 fuchsia = vec3(0.85, 0.35, 0.85);
  vec3 white = vec3(1.0, 0.95, 1.0);

  // Clean circular ring — no wobble
  float ringR = 0.30;
  float ringDist = abs(dist - ringR);
  float ring = exp(-ringDist * ringDist * 800.0) * 0.5;
  float ringGlow = exp(-ringDist * ringDist * 80.0) * 0.35;
  float ringBloom = exp(-ringDist * ringDist * 15.0) * 0.15;

  // Clean inner ring
  float innerRingR = 0.22;
  float innerDist = abs(dist - innerRingR);
  float innerRing = exp(-innerDist * innerDist * 2000.0) * 0.15;
  float innerGlow = exp(-innerDist * innerDist * 200.0) * 0.08;

  // Color variation along the ring
  float wave1 = sin(angle * 3.0 + t * 1.2) * 0.5 + 0.5;
  float wave2 = sin(angle * 5.0 - t * 0.9) * 0.5 + 0.5;
  float wave3 = cos(angle * 2.0 + t * 0.6) * 0.5 + 0.5;

  vec3 ringColor = mix(purple1, purple3, wave1);
  ringColor = mix(ringColor, fuchsia, wave2 * 0.25);
  ringColor = mix(ringColor, purple2, wave3 * 0.3);

  // Bright traveling highlights
  float spotSpeed = t * 0.7;
  float spot1 = exp(-pow(mod(angle - spotSpeed, PI * 2.0) - PI, 2.0) * 3.0) * 0.4;
  float spot2 = exp(-pow(mod(angle + spotSpeed * 0.6, PI * 2.0) - PI, 2.0) * 5.0) * 0.2;
  float spots = (spot1 + spot2) * smoothstep(0.45, 0.28, ringDist + 0.1);

  // Center subtle fill glow
  float centerGlow = exp(-dist * dist * 12.0) * 0.04;

  // Compose
  vec3 color = vec3(0.0);
  color += ringColor * (ring + ringGlow);
  color += purple2 * ringBloom;
  color += purple3 * (innerRing + innerGlow);
  color += white * spots * 0.5;
  color += ringColor * spots * 0.3;
  color += purple1 * centerGlow;

  float alpha = ring + ringGlow + ringBloom * 0.6 + innerRing + innerGlow + spots * 0.4 + centerGlow;
  alpha = clamp(alpha, 0.0, 1.0);

  gl_FragColor = vec4(color, alpha);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

export default function OrbShader({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false })!;
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let frameId: number;
    const startTime = performance.now();

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      gl.viewport(0, 0, canvas!.width, canvas!.height);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    function render() {
      const time = (performance.now() - startTime) / 1000;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uResolution, canvas!.width, canvas!.height);
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameId = requestAnimationFrame(render);
    }
    render();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
