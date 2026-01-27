import 'vitest-canvas-mock';
import { vi, beforeEach, afterEach } from 'vitest';

// Clear all timers after each test to prevent timer leaks
afterEach(() => {
  // Clear any pending timers that might cause "document is not defined" errors
  // This helps with async operations from libraries like lottie_canvas
  const timerId = setTimeout(() => {}, 0) as unknown as number;
  for (let i = 1; i <= timerId; i++) {
    clearTimeout(i);
  }
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock WebGLRenderer since JSDOM doesn't support WebGL
vi.mock('three', async () => {
  const actual = await vi.importActual('three');
  return {
    ...actual,
    WebGLRenderer: vi.fn().mockImplementation(() => ({
      setSize: vi.fn(),
      setPixelRatio: vi.fn(),
      setAnimationLoop: vi.fn(),
      render: vi.fn(),
      domElement: document.createElement('canvas'),
      getContext: vi.fn(),
      dispose: vi.fn(),
      shadowMap: {},
      debug: {
        checkShaderErrors: true,
      },
    })),
  };
});
