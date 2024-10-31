// jest.setup.js
global.indexedDB = {
    open: jest.fn(() => ({
      onsuccess: jest.fn(),
      onerror: jest.fn(),
      result: {
        createObjectStore: jest.fn(),
        transaction: jest.fn(),
      },
    })),
  };
  