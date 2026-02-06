import type { Metadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'

import { type Locale, useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import AlertDialogDemo from '@/components/design/alert-dialog.demo'
import AspectRatioDemo from '@/components/design/aspect-ratio.demo'
import AvatarDemo from '@/components/design/avatar.demo'
import BadgeDemo from '@/components/design/badge.demo'
import ButtonDemo from '@/components/design/button.demo'
import CardDemo from '@/components/design/card.demo'
import CodeBlockDemo from '@/components/design/code-block.demo'
import CommandDemo from '@/components/design/command.demo'
import DialogDemo from '@/components/design/dialog.demo'
import DrawerDemo from '@/components/design/drawer.demo'
import DropdownMenuDemo from '@/components/design/dropdown-menu.demo'
import FieldDemo from '@/components/design/field.demo'
import InputDemo from '@/components/design/input.demo'
import InputGroupDemo from '@/components/design/input-group.demo'
import KbdDemo from '@/components/design/kbd.demo'
import LabelDemo from '@/components/design/label.demo'
import MarqueeDemo from '@/components/design/marquee.demo'
import PopoverDemo from '@/components/design/popover.demo'
import ScrollAreaDemo from '@/components/design/scroll-area.demo'
import SegmentGroupDemo from '@/components/design/segment-group.demo'
import SelectDemo from '@/components/design/select.demo'
import SeparatorDemo from '@/components/design/separator.demo'
import SheetDemo from '@/components/design/sheet.demo'
import SidebarDemo from '@/components/design/sidebar.demo'
import SkeletonDemo from '@/components/design/skeleton.demo'
import SonnerDemo from '@/components/design/sonner.demo'
import SpinnerDemo from '@/components/design/spinner.demo'
import SwitchDemo from '@/components/design/switch.demo'
import TableDemo from '@/components/design/table.demo'
import TabsDemo from '@/components/design/tabs.demo'
import TextareaDemo from '@/components/design/textarea.demo'
import TooltipDemo from '@/components/design/tooltip.demo'
import TreeViewDemo from '@/components/design/tree-view.demo'
import JsonLd from '@/components/json-ld'
import PageHeader from '@/components/page-header'
import { MY_NAME } from '@/lib/constants'
import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(props: PageProps<'/[locale]/design'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const t = await getTranslations({ locale: locale as Locale })
  const title = t('common.labels.design')
  const description = t('design.description')

  return createMetadata({
    pathname: '/design',
    title,
    description,
    locale,
  })
}

function Page(props: PageProps<'/[locale]/design'>) {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const t = useTranslations()
  const title = t('common.labels.design')
  const description = t('design.description')
  const url = getLocalizedPath({ locale, pathname: '/design' })

  const jsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: MY_NAME,
      url: getBaseUrl(),
    },
    inLanguage: locale,
  }

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageHeader title={title} description={description} />

      <div className='space-y-12'>
        <AlertDialogDemo />
        <AspectRatioDemo />
        <AvatarDemo />
        <BadgeDemo />
        <ButtonDemo />
        <CardDemo />
        <CodeBlockDemo />
        <CommandDemo />
        <DialogDemo />
        <DrawerDemo />
        <DropdownMenuDemo />
        <FieldDemo />
        <InputGroupDemo />
        <InputDemo />
        <KbdDemo />
        <LabelDemo />
        <MarqueeDemo />
        <PopoverDemo />
        <ScrollAreaDemo />
        <SegmentGroupDemo />
        <SelectDemo />
        <SeparatorDemo />
        <SheetDemo />
        <SidebarDemo />
        <SkeletonDemo />
        <SonnerDemo />
        <SpinnerDemo />
        <SwitchDemo />
        <TableDemo />
        <TabsDemo />
        <TextareaDemo />
        <TooltipDemo />
        <TreeViewDemo />
      </div>
    </>
  )
}

export default Page
