import "fake-indexeddb/auto";

import { afterEach, vi } from 'vitest';


afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });