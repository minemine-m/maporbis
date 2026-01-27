import 'vitest-canvas-mock';
import { vi } from 'vitest';

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
