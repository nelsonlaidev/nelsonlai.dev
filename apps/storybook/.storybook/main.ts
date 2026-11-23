import { defineMain } from '@storybook/react-vite/node'

export default defineMain({
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: '.storybook/vite.config.ts',
      },
    },
  },
  stories: ['../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs'],
  staticDirs: ['../stories/public'],
  typescript: { reactDocgen: false },
  features: {
    controls: false,
    actions: false,
    interactions: false,
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },
  core: { disableTelemetry: true },
})
