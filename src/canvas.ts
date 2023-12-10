export const canvas = document.createElement("canvas");

export const ctx = canvas.getContext("2d")!;
if (!ctx) throw new Error("no context");
document.body.appendChild(canvas);
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";

export function prepareCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.reset();
  ctx.scale(devicePixelRatio, devicePixelRatio);
}

export function getCanvasRect() {
  return canvas.getBoundingClientRect();
}
