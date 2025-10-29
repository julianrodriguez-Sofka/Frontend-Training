export default {
  get: vi.fn(() => Promise.resolve({ data: { balance: 1000, userId: 1 } })),
  post: vi.fn(() => Promise.resolve({ data: { newBalance: 800 } })),
};
