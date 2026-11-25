import type { ProjectSummary } from './types'

import { cn } from 'cn'

import {
  CoralArtwork,
  CubeArtwork,
  JournalArtwork,
  PagesArtwork,
  PearlArtwork,
  TerminalArtwork,
  ToolsArtwork,
} from './artworks'

const artworks = {
  pearl: PearlArtwork,
  cube: CubeArtwork,
  coral: CoralArtwork,
  terminal: TerminalArtwork,
  pages: PagesArtwork,
  tools: ToolsArtwork,
  journal: JournalArtwork,
} satisfies Record<ProjectSummary['artwork'], React.ComponentType>

type ProjectArtProps = {
  project: Pick<ProjectSummary, 'artwork'>
  className?: string
}

export function ProjectArt(props: ProjectArtProps) {
  const { project, className } = props
  const Artwork = artworks[project.artwork]

  return (
    <div
      aria-hidden='true'
      className={cn(
        '@container-size relative overflow-hidden border border-border/60 [background:radial-gradient(ellipse_at_50%_100%,#408c8e35,transparent_70%),#c0e0d505] after:pointer-events-none after:absolute after:inset-0 after:[background:linear-gradient(125deg,#d3edce10,transparent_60%)]',
        className,
      )}
    >
      <div className='absolute top-1/2 left-1/2 size-72.5 -translate-1/2 scale-[calc(100cqmin/18.125rem)]'>
        <Artwork />
      </div>
    </div>
  )
}
