import { addons } from 'storybook/manager-api'
import { themes } from 'storybook/theming'

addons.setConfig({ theme: { ...themes.dark, brandTitle: 'Seafold UI', brandUrl: './' }, showPanel: false })
