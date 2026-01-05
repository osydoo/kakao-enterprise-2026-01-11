import type { Preview } from '@storybook/nextjs-vite';
import '../app/globals.css';
import { ModalStack } from '../src/components/modal';
import { Geist, Geist_Mono } from 'next/font/google';
import React from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    (Story) =>
      React.createElement(
        'div',
        { className: `${geistSans.variable} ${geistMono.variable} antialiased` },
        React.createElement(Story),
        React.createElement(ModalStack),
      ),
  ],
};

export default preview;
