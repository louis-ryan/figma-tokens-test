/** @type { import('@storybook/react').Preview } */
import '../src/design-tokens.css';
import '../src/App.css';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    designToken: {
      defaultTab: 'Colors',
    },
  },
};

export default preview;
