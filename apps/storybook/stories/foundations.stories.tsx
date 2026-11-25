// cspell:language en-US,es,pt-br
import { Button } from '@repo/ui/components/button'
import { Spinner } from '@repo/ui/components/spinner'
import { UIProvider, useUITranslation } from '@repo/ui/components/ui-provider'

import preview from '../.storybook/preview'
import { translations } from './translations'

const meta = preview.meta({
  title: 'Foundations/Overview',
  parameters: {
    docs: {
      story: { inline: true },
    },
  },
})

const colorTokens = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'section-label',
  'link',
  'skeleton',
  'accent',
  'accent-foreground',
  'destructive',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
  'sidebar-skeleton',
]

function Colors() {
  return (
    <div className='grid gap-4 sm:grid-cols-3 lg:grid-cols-5'>
      {colorTokens.map((token) => (
        <div key={token} className='overflow-hidden rounded-lg border'>
          <div className='h-20 border-b' style={{ backgroundColor: `var(--${token})` }} />
          <div className='space-y-1 p-3'>
            <p className='text-sm font-medium'>{token}</p>
            <code className='text-xs text-muted-foreground'>{`var(--${token})`}</code>
          </div>
        </div>
      ))}
    </div>
  )
}

export const Palette = meta.story({
  render: () => <Colors />,
})

export const Typography = meta.story({
  render: () => (
    <div className='max-w-2xl space-y-6'>
      <h1 className='text-4xl font-medium tracking-tight'>Geist · Seafold UI</h1>
      <h2 className='text-2xl font-medium'>A clear hierarchy for shared components</h2>
      <p>Body text uses the actual font-sans token. Muted text remains legible against the dark ocean background.</p>
      <p className='text-sm text-muted-foreground'>Small labels and supporting descriptions.</p>
      <p className='font-mono'>Geist Mono: const count = 123_456</p>
      <p lang='zh-TW'>繁體中文：清楚呈現元件、狀態與互動。</p>
      <p lang='zh-CN'>简体中文：查看组件、状态与交互。</p>
      <p lang='ja'>日本語：コンポーネントの表示と操作を確認します。</p>
      <p lang='pt-BR'>Português: uma descrição longa para verificar a quebra de linha.</p>
      <p lang='es'>Español: instrucciones claras para los componentes.</p>
    </div>
  ),
})

export const Geometry = meta.story({
  render: () => (
    <div className='space-y-8'>
      <p className='max-w-xl text-sm text-muted-foreground'>
        Radii and surfaces use live CSS tokens. The package currently has rounded primitives; this page does not impose
        a new geometry system.
      </p>
      <div className='flex flex-wrap gap-5'>
        {(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const).map((radius) => (
          <div
            key={radius}
            className='flex size-24 items-center justify-center border bg-card text-sm'
            style={{ borderRadius: `var(--radius-${radius})` }}
          >
            {radius}
          </div>
        ))}
      </div>
      <div className='grid grid-cols-[--spacing(36)_1fr] gap-3 rounded-lg border p-6'>
        <span>Spacing</span>
        <span>4px scale through Tailwind utilities</span>
      </div>
    </div>
  ),
})

function ProviderStatus() {
  const label = useUITranslation('loading')

  return (
    <div className='space-y-3'>
      <Spinner />
      <p>Loading translation: {label}</p>
    </div>
  )
}

export const ProviderAndLabels = meta.story({
  render: () => (
    <div className='grid max-w-3xl gap-8 sm:grid-cols-2'>
      <div>
        <h2 className='mb-4 font-medium'>Default preview provider</h2>
        <ProviderStatus />
      </div>
      <UIProvider translations={{ ...translations, loading: '正在載入，請稍候', close: '關閉' }}>
        <div>
          <h2 className='mb-4 font-medium'>Nested translated provider</h2>
          <ProviderStatus />
          <Spinner aria-label='Explicit operation label' />
        </div>
      </UIProvider>
      <p className='text-sm text-muted-foreground sm:col-span-2'>
        UIProvider supplies default accessibility labels. Explicit labels take precedence. Storybook is not a production
        CSP audit.
      </p>
    </div>
  ),
})

export const AccessibilityAndMotion = meta.story({
  render: () => (
    <div className='max-w-xl space-y-5'>
      <h2 className='text-xl font-medium'>Verify with keyboard and touch</h2>
      <p>
        Tab to controls to inspect visible focus. Use arrows within tabs, menus, selects, segments, and trees. Open an
        overlay, close it with Escape, and confirm focus returns to its trigger.
      </p>
      <div className='flex flex-wrap items-center gap-4'>
        <Button>Focus me</Button>
        <Button disabled>Disabled</Button>
        <Spinner aria-label='Animated example' />
      </div>
      <p>
        Use the viewport toolbar for narrow screens. The preview respects the system reduced-motion preference. The
        package retains its own motion rules; preview-wide reduced-motion styles also stop library transitions, matching
        the website policy.
      </p>
      <p>
        Only supported states are shown. A failed image remains the real failed-image presentation; a table or tree
        empty message is explicitly supplied by its caller.
      </p>
    </div>
  ),
})
