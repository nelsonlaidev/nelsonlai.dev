import { cn } from 'cn'

import { m } from '@/paraglide/messages'

import { projectSpecimen } from './presentation'

type ProjectArtProps = {
  slug: string
  large?: boolean
}

export function ProjectArt(props: ProjectArtProps) {
  const { slug, large = false } = props
  const { art, number } = projectSpecimen(slug)
  const hasRoundOrbit = ['pearl', 'coral', 'pages', 'journal'].includes(art)
  const usesSharedOrbitSize = hasRoundOrbit || art === 'tools'

  return (
    <div
      aria-hidden='true'
      className={cn(
        'relative overflow-hidden border border-[#b2d7ca20] after:pointer-events-none after:absolute after:inset-0 after:content-[""] after:[background:linear-gradient(125deg,#d3edce10,transparent_60%)] min-[701px]:max-[1001px]:h-67.5 min-[1001px]:max-[1101px]:h-57.5',
        !large &&
          'h-72.5 [background:radial-gradient(ellipse_at_50%_100%,#408c8e35,transparent_70%),#c0e0d505] max-[701px]:h-71.25',
        large &&
          'h-110 [background:radial-gradient(ellipse_at_50%_100%,#408c8e45,transparent_75%),#c0e0d505] max-[701px]:h-77.5',
      )}
    >
      <span
        className={cn(
          'absolute top-1/2 left-1/2 border border-[#bcd4bd55]',
          hasRoundOrbit && 'transform-[translate(-50%,-50%)_rotate(-30deg)_scaleY(0.4)] rounded-full',
          hasRoundOrbit && !large && 'size-43.75',
          usesSharedOrbitSize && large && 'size-75',
          usesSharedOrbitSize && large && 'max-[701px]:size-50',
          art === 'blue' && 'transform-[translate(-50%,-50%)_rotate(-25deg)] rounded-[10%]',
          art === 'blue' && !large && 'size-37.5',
          art === 'blue' && large && 'size-60 max-[701px]:size-42.5',
          (art === 'coral' || art === 'pages') && 'hidden',
          art === 'terminal' && !large && 'h-35 w-43.75',
          art === 'terminal' && 'transform-[translate(-50%,-50%)_rotate(-8deg)] rounded-[25px] opacity-[0.5]',
          art === 'terminal' && large && 'h-55 w-70',
          art === 'tools' && 'transform-[translate(-50%,-50%)_rotate(45deg)] rounded-[30px]',
          art === 'tools' && !large && 'size-40',
          art === 'journal' && 'opacity-[0.35]',
        )}
      />
      <span
        className={cn(
          'absolute top-1/2 left-1/2 border border-[#bcd4bd28]',
          hasRoundOrbit && 'transform-[translate(-50%,-50%)_rotate(45deg)_scaleY(0.5)] rounded-full',
          usesSharedOrbitSize && !large && 'size-50',
          usesSharedOrbitSize && large && 'size-87.5',
          usesSharedOrbitSize && large && 'max-[701px]:size-60',
          art === 'blue' && 'transform-[translate(-50%,-50%)_rotate(-25deg)] rounded-[10%]',
          art === 'blue' && !large && 'size-47.5',
          art === 'blue' && large && 'size-77.5 max-[701px]:size-53.75',
          (art === 'coral' || art === 'pages') && 'hidden',
          art === 'terminal' && !large && 'h-42.5 w-51.25',
          art === 'terminal' && 'transform-[translate(-50%,-50%)_rotate(-8deg)] rounded-[25px] opacity-[0.3]',
          art === 'terminal' && large && 'h-70 w-85',
          art === 'tools' && 'transform-[translate(-50%,-50%)_rotate(45deg)] rounded-[38px] opacity-[0.4]',
          art === 'journal' && 'opacity-[0.35]',
        )}
      />
      <span
        className={cn(
          'absolute top-1/2 left-1/2 transition-transform duration-800 ease-linear group-hover/artwork:transform-[translate(-50%,-55%)_rotate(8deg)] group-focus-visible/artwork:transform-[translate(-50%,-55%)_rotate(8deg)] motion-reduce:transition-none',
          (art === 'pearl' || art === 'coral') && 'transform-[translate(-50%,-50%)] rounded-full',
          art === 'pearl' &&
            'shadow-[16px_20px_35px_#001d3160,inset_-6px_-3px_15px_#092e3e] [background:radial-gradient(circle_at_32%_25%,#e0e8c8,#7eafa4_30%,#235663_65%,#0a2e3b)]',
          (art === 'pearl' || art === 'blue') && !large && 'size-25',
          (art === 'pearl' || art === 'blue' || art === 'coral') && large && 'size-42.5',
          large && ['pearl', 'blue', 'coral'].includes(art) && 'max-[701px]:size-28.75',
          art === 'blue' &&
            'transform-[translate(-50%,-50%)_rotate(-25deg)] rounded-[18%] shadow-[12px_12px_0_#255061,22px_23px_25px_#00132255] [background:linear-gradient(140deg,#8bb6ad,#356978_50%,#082c46)]',
          art === 'coral' &&
            'shadow-[inset_12px_12px_25px_#c5d3b45e,inset_-18px_-12px_30px_#062f4b] [background:repeating-conic-gradient(from_10deg,#a9b9aa_0deg,#477e7f_4deg,#184a59_9deg,#91b1a3_13deg)]',
          art === 'coral' && !large && 'size-30',
          art === 'terminal' &&
            !large &&
            'w-33.75 before:top-8.5 before:left-7 after:top-13.25 after:left-13.75 after:w-5.75',
          (art === 'terminal' || art === 'journal') && !large && 'h-25',
          art === 'terminal' &&
            'transform-[translate(-50%,-50%)_rotate(-8deg)] rounded-[9px] border border-[#8cae9f75] shadow-[12px_20px_30px_#00182770,inset_0_0_15px_#83b7a110] [background:linear-gradient(145deg,#274e53,#092a36)] before:absolute before:size-3 before:transform-[rotate(45deg)] before:border-t-2 before:border-r-2 before:border-t-[#b1d7b4] before:border-r-[#b1d7b4] before:content-[""] after:h-0.5 after:bg-[#79a69a] after:shadow-[0_10px_0_#79a69a25]',
          (art === 'terminal' || art === 'pages' || art === 'tools' || art === 'journal') &&
            'after:absolute after:content-[""]',
          art === 'terminal' &&
            large &&
            'h-37.5 w-52.5 before:top-14.75 before:left-13.75 after:top-19.5 after:left-20.5',
          ((art === 'terminal' && large) || (art === 'journal' && !large)) && 'after:w-9.5',
          art === 'pages' && !large && 'h-32 w-25 after:top-9 after:left-5.75 after:w-12.5',
          art === 'pages' &&
            'transform-[translate(-50%,-50%)_rotate(12deg)] rounded-[3px] shadow-[-12px_8px_0_#426e70,-22px_16px_0_#214c5b,5px_25px_35px_#00192d70] [background:linear-gradient(135deg,#bed0b6,#668f87)] after:bg-[#2f606070] after:shadow-[0_12px_0_#2f606070,0_24px_0_#2f606070,0_36px_0_#2f606070,0_48px_0_#2f606035]',
          (art === 'pages' || art === 'journal') && 'after:h-px',
          art === 'pages' && large && 'h-46.25 w-36.25 after:top-12.5 after:left-8 after:w-20',
          art === 'tools' &&
            'transform-[translate(-50%,-50%)_rotate(45deg)] rounded-[22px] shadow-[10px_10px_30px_#001b3260] [background:linear-gradient(150deg,#b3c6ab,#5b9690_40%,#1f4b5d)] after:rounded-full after:border after:border-[#c3ddbf90] after:shadow-[inset_4px_4px_12px_#123b4a80]',
          art === 'tools' && !large && 'size-27.5 after:inset-7',
          art === 'tools' && large && 'size-40 after:inset-10',
          art === 'journal' &&
            !large &&
            'w-31.25 after:top-7 after:left-3 after:shadow-[0_10px_0_#365d5550,0_20px_0_#365d5550,64px_0_0_#365d5550,64px_10px_0_#365d5550,64px_20px_0_#365d5550]',
          art === 'journal' &&
            'transform-[translate(-50%,-50%)_rotate(-12deg)] rounded-[50%_50%_8%_8%/8%_8%_12%_12%] shadow-[5px_20px_30px_#001b3260] [background:linear-gradient(90deg,#728e82,#b6c4a5_45%,#547b76_50%,#c0cbae_55%,#829d8a)] after:bg-[#365d5550]',
          art === 'journal' &&
            large &&
            'h-40 w-50 after:top-11.25 after:left-5 after:w-15 after:shadow-[0_16px_0_#365d5550,0_32px_0_#365d5550,100px_0_0_#365d5550,100px_16px_0_#365d5550,100px_32px_0_#365d5550]',
        )}
      />
      <span className='absolute top-4.5 left-4.75 text-xs text-[#94bab3]'>{String(number).padStart(2, '0')}</span>
      <span className='absolute bottom-4.75 left-4.75 text-xs text-[#88aaa5]'>{m.projects_independent()}</span>
      {large && (
        <span className='absolute right-5.75 bottom-5 hidden text-xs text-[#7caaa4] min-[701px]:block'>
          {m.projects_art_coordinate()}
        </span>
      )}
    </div>
  )
}
