// cspell:ignore autodocs
import '@fontsource-variable/geist/wght.css'
import '@fontsource-variable/geist-mono/wght.css'
import '@fontsource-variable/noto-sans-tc/wght.css'
import '@fontsource-variable/noto-sans-sc/wght.css'
import '../stories/preview.css'

import { UIProvider } from '@repo/ui/components/ui-provider'
import addonDocs from '@storybook/addon-docs'
import { Stories, Title } from '@storybook/addon-docs/blocks'
import { definePreview } from '@storybook/react-vite'
import { themes } from 'storybook/theming'

import { translations } from '../stories/translations'

export default definePreview({
  addons: [addonDocs()],
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <UIProvider translations={translations}>
        <Story />
      </UIProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: ['Foundations', 'Components'],
        method: 'alphabetical',
      },
    },
    docs: {
      theme: themes.dark,
      story: { inline: false, height: '400px' },
      page: () => (
        <>
          <Title />
          <Stories />
        </>
      ),
      source: { type: 'code' },
    },
  },
})
