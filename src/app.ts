import {
  createFontEditor,
  drawChar,
  drawFontEditor,
  updateFontEditor,
} from "./font-editor";

import { keysJustPressed } from "./input";

type App = ReturnType<typeof createApp>;

export const createApp = () => ({
  fontEditor: createFontEditor(),
  isEditing: true,
});

export function updateApp(app: App) {
  if (app.isEditing) updateFontEditor(app.fontEditor);

  if (keysJustPressed.has("t")) app.isEditing = !app.isEditing;
}

export function drawApp(app: App, ctx: CanvasRenderingContext2D) {
  if (app.isEditing) drawFontEditor(app.fontEditor, ctx);
  else {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = "#0f0";

    ctx.lineCap = "round";
    ctx.lineWidth = 1;

    const fontKey = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const text = "the quick brown fox jumps over the lazy dog";

    ctx.translate(10, 10);

    const fontWidth = 14;
    for (const [i, char] of text.split("").entries()) {
      const charIndex = fontKey.indexOf(char.toUpperCase());
      if (charIndex === -1) continue;
      const charLines = app.fontEditor.chars[charIndex];
      drawChar(ctx, charLines, i * fontWidth, 0, fontWidth);
    }

    const text2 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (const [i, char] of text2.split("").entries()) {
      const charIndex = fontKey.indexOf(char.toUpperCase());
      if (charIndex === -1) continue;
      const charLines = app.fontEditor.chars[charIndex];
      drawChar(ctx, charLines, i * fontWidth, fontWidth * 4, fontWidth);
    }
  }
}
