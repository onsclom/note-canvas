export const pointer = {
  pos: { x: 0, y: 0 },
  held: false,
  justPressed: false,
};

document.addEventListener("pointermove", (e) => {
  pointer.pos.x = e.clientX;
  pointer.pos.y = e.clientY;
});

document.addEventListener("pointerdown", (e) => {
  pointer.held = true;
  pointer.justPressed = true;
});

document.addEventListener("pointerup", (e) => {
  pointer.held = false;
});

export const keysHeld = new Set<string>();
export const keysJustPressed = new Set<string>();

document.addEventListener("keydown", (e) => {
  keysHeld.add(e.key);
  keysJustPressed.add(e.key);
});

document.addEventListener("keyup", (e) => {
  keysHeld.delete(e.key);
});

export function resetInput() {
  pointer.justPressed = false;
  keysJustPressed.clear();
}
