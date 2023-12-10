import { getCanvasRect } from "./canvas";
import { keysHeld, keysJustPressed, pointer } from "./input";

const GRID_WIDTH = 5;
const GRID_HEIGHT = GRID_WIDTH * 2;
const CHAR_WIDTH = 100;
const CHAR_HEIGHT = 200;

type App = ReturnType<typeof createApp>;

const selectPressed = () => pointer.justPressed || keysJustPressed.has(" ");

type CharLines = [number, number, number, number][];

export const createApp = () => ({
  editRect: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  highlightedGridDot: null as null | { x: number; y: number },
  selectedGridDot: null as null | { x: number; y: number },

  // lines: [] as CharLines,
  chars: (JSON.parse(localStorage["chars"]) ??
    [...Array(10)].map(() => [])) as CharLines[],
  curChar: 0,
});

export function updateApp(app: App) {
  const { width: canvasWidth, height: canvasHeight } = getCanvasRect();
  app.editRect.x = canvasWidth / 2 - CHAR_WIDTH / 2;
  app.editRect.y = canvasHeight / 2 - CHAR_HEIGHT / 2;
  app.editRect.width = CHAR_WIDTH;
  app.editRect.height = CHAR_HEIGHT;

  const relativePos = {
    x: pointer.pos.x - app.editRect.x,
    y: pointer.pos.y - app.editRect.y,
  };
  const pointerInEdit = pointInRect(pointer.pos, app.editRect);

  app.highlightedGridDot = pointerInEdit
    ? {
        x: Math.floor(relativePos.x / (CHAR_WIDTH / GRID_WIDTH)),
        y: Math.floor(relativePos.y / (CHAR_HEIGHT / GRID_HEIGHT)),
      }
    : null;

  if (app.selectedGridDot && app.highlightedGridDot && selectPressed()) {
    app.chars[app.curChar].push([
      app.selectedGridDot.x,
      app.selectedGridDot.y,
      app.highlightedGridDot.x,
      app.highlightedGridDot.y,
    ]);
    app.selectedGridDot = app.highlightedGridDot;
  } else if (app.highlightedGridDot && selectPressed()) {
    app.selectedGridDot = app.highlightedGridDot;
  } else if (keysJustPressed.has("Escape")) app.selectedGridDot = null;

  if (keysJustPressed.has("c")) app.chars[app.curChar] = [];
  if (keysJustPressed.has("l")) app.curChar++;
  if (keysJustPressed.has("h")) app.curChar--;
  app.curChar = Math.max(0, Math.min(app.curChar, app.chars.length - 1));

  const GRID_SPACING = app.editRect.width / GRID_WIDTH;
  if (keysHeld.has("e")) {
    const curCharLines = app.chars[app.curChar];
    for (let i = curCharLines.length - 1; i >= 0; i--) {
      const line = curCharLines[i];
      const distanceToLine = distanceToLineSegment(
        relativePos.x,
        relativePos.y,
        line[0] * GRID_SPACING + GRID_SPACING / 2,
        line[1] * GRID_SPACING + GRID_SPACING / 2,
        line[2] * GRID_SPACING + GRID_SPACING / 2,
        line[3] * GRID_SPACING + GRID_SPACING / 2
      );

      if (distanceToLine <= 2) {
        curCharLines.splice(i, 1);
      }
    }
  }

  if (keysJustPressed.has("s")) {
    localStorage.setItem("chars", JSON.stringify(app.chars));
  }

  if (keysJustPressed.has("x")) app.chars.splice(app.curChar, 1);
  if (keysJustPressed.has("a")) app.chars.splice(app.curChar, 0, []);
}

function distanceToLineSegment(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;
  if (len_sq !== 0) param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

export function drawApp(app: App, ctx: CanvasRenderingContext2D) {
  const canvasRect = getCanvasRect();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvasRect.width, canvasRect.height);
  ctx.lineWidth = 2;

  const SPACE_BETWEEN_GRID = app.editRect.width / GRID_WIDTH;
  const GRID_DOT_RADIUS = 2;
  const calcOffset = (n: number) =>
    n * SPACE_BETWEEN_GRID + SPACE_BETWEEN_GRID / 2;
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const isHighlighted =
        app.highlightedGridDot && pointsMatch(app.highlightedGridDot, { x, y });
      ctx.fillStyle = isHighlighted ? "black" : "#ccc";
      fillCircle(
        ctx,
        app.editRect.x + calcOffset(x),
        app.editRect.y + calcOffset(y),
        GRID_DOT_RADIUS
      );
    }
  }

  ctx.strokeStyle = "black";
  if (app.selectedGridDot && app.highlightedGridDot) {
    ctx.beginPath();
    ctx.moveTo(
      app.editRect.x + calcOffset(app.selectedGridDot.x),
      app.editRect.y + calcOffset(app.selectedGridDot.y)
    );
    ctx.lineTo(
      app.editRect.x + calcOffset(app.highlightedGridDot!.x),
      app.editRect.y + calcOffset(app.highlightedGridDot!.y)
    );
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  for (let i = 0; i < app.chars.length; i++) {
    const tx =
      app.editRect.x +
      app.editRect.width * i -
      app.curChar * app.editRect.width;
    for (const line of app.chars[i]) {
      ctx.beginPath();
      ctx.moveTo(
        calcOffset(line[0]) + tx,
        app.editRect.y + calcOffset(line[1])
      );
      ctx.lineTo(
        calcOffset(line[2]) + tx,
        app.editRect.y + calcOffset(line[3])
      );
      ctx.stroke();
    }
  }
}

function fillCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function pointInRect(
  p: { x: number; y: number },
  r: { x: number; y: number; width: number; height: number }
) {
  return (
    p.x >= r.x && p.x <= r.x + r.width && p.y >= r.y && p.y <= r.y + r.height
  );
}

function pointsMatch(a: { x: number; y: number }, b: { x: number; y: number }) {
  return a.x === b.x && a.y === b.y;
}
