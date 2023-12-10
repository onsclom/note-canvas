import { prepareCanvas, ctx } from "./canvas";
import { createApp, drawApp, updateApp } from "./app";
import { resetInput } from "./input";

const app = createApp();

requestAnimationFrame(function frameLoop() {
  updateApp(app);

  prepareCanvas();
  drawApp(app, ctx);

  resetInput();
  requestAnimationFrame(frameLoop);
});
