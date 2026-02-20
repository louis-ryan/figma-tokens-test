/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['storybook-design-token'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
