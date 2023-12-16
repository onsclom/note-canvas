import {
  createFontEditor,
  drawChar,
  drawFontEditor,
  updateFontEditor,
} from "./font-editor";

import { keysJustPressed } from "./input";

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
    ctx.lineCap = "round";
    ctx.lineWidth = 1;

    const fontKey = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const text = "the quick brown fox jumps over the lazy dog";

    ctx.translate(10, 10);

    const fontSize = 14;
    for (const [i, char] of text.split("").entries()) {
      const charIndex = fontKey.indexOf(char.toUpperCase());
      if (charIndex === -1) continue;
      const charLines = app.fontEditor.chars[charIndex];
      drawChar(ctx, charLines, i * fontSize, 0, fontSize);
    }

    const text2 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (const [i, char] of text2.split("").entries()) {
      const charIndex = fontKey.indexOf(char.toUpperCase());
      if (charIndex === -1) continue;
      const charLines = app.fontEditor.chars[charIndex];
      drawChar(ctx, charLines, i * fontSize, fontSize * 4, fontSize);
    }
  }
}
