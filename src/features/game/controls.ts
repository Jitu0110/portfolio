// Shared mutable input state — written by keyboard listeners in Car and
// touch buttons in GameUI, read by the physics loop every frame.
export const keys: Record<string, boolean> = {};
