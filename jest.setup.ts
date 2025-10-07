import '@testing-library/jest-dom';
jest.mock('next/font/google', () => ({
    Plus_Jakarta_Sans: () => ({
      style: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
      className: 'plus-jakarta-mock',
      variable: '--font-plus-jakarta',
    }),
  }));