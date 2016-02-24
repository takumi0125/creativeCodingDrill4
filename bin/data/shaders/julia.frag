#version 120

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform float zoom;

const int ITERATION = 600;

#define PI 3.1415926535897932384626433832795

vec3 hsv(float h, float s, float v){
  vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
  return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

float map(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool clamp) {
  if(clamp == true) {
    if(value < inputMin) return outputMin;
    if(value > inputMax) return outputMax;
  }
  float p = (outputMax - outputMin) / (inputMax - inputMin);
  return ((value - inputMin) * p) + outputMin;
}

void main() {
  vec2 m = vec2((mouse.x / resolution.x) * 2 - 1, (mouse.y / resolution.y) * 2 - 1);
  vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y) / zoom;
  position.x += m.x;
  position.y -= m.y;
  vec2 z = position;
  int cnt = 0;

  for ( int i = 0; i < ITERATION; i ++ ) {
    cnt = i;
    if (length(z) > 2) break;
    z = vec2(pow(z.x, 2) - pow(z.y, 2), 2 * z.x * z.y) + vec2(-0.3 + map(sin(time / 30), -1, 1, 0, 0.1, true), map(sin(time / 40), -1, 1, 0.6, 0.7, true));
  }

  float s = float(cnt) / float(ITERATION);
  vec3 rgb = hsv(
    map(sin(time / 10) + s, -1, 2, 0, 1, true),
    map(sin(time / 50) + s, -1, 2, 0.5, 1, true),
    s * 10
  );
  gl_FragColor = vec4(rgb, 1.0);
}
