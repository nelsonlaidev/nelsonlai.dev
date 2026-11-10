import { cn } from 'cn'

type ArtworkProps = {
  large: boolean
}

const innerOutline = 'absolute top-1/2 left-1/2 border border-[#bcd4bd55]'
const outerOutline = 'absolute top-1/2 left-1/2 border border-[#bcd4bd28]'
const shape =
  'absolute top-1/2 left-1/2 transition-transform duration-800 ease-linear group-hover/artwork:transform-[translate(-50%,-55%)_rotate(8deg)] group-focus-visible/artwork:transform-[translate(-50%,-55%)_rotate(8deg)] motion-reduce:transition-none'

export function PearlArtwork(props: ArtworkProps) {
  const { large } = props

  return (
    <>
      <span
        className={cn(
          innerOutline,
          'transform-[translate(-50%,-50%)_rotate(-30deg)_scaleY(0.4)] rounded-full',
          large ? 'size-50 md:size-75' : 'size-43.75',
        )}
      />
      <span
        className={cn(
          outerOutline,
          'transform-[translate(-50%,-50%)_rotate(45deg)_scaleY(0.5)] rounded-full',
          large ? 'size-60 md:size-87.5' : 'size-50',
        )}
      />
      <span
        className={cn(
          shape,
          'transform-[translate(-50%,-50%)] rounded-full shadow-[16px_20px_35px_#001d3160,inset_-6px_-3px_15px_#092e3e] [background:radial-gradient(circle_at_32%_25%,#e0e8c8,#7eafa4_30%,#235663_65%,#0a2e3b)]',
          large ? 'size-28.75 md:size-42.5' : 'size-25',
        )}
      />
    </>
  )
}

export function CubeArtwork(props: ArtworkProps) {
  const { large } = props

  return (
    <>
      <span
        className={cn(
          innerOutline,
          'transform-[translate(-50%,-50%)_rotate(-25deg)] rounded-[10%]',
          large ? 'size-42.5 md:size-60' : 'size-37.5',
        )}
      />
      <span
        className={cn(
          outerOutline,
          'transform-[translate(-50%,-50%)_rotate(-25deg)] rounded-[10%]',
          large ? 'size-53.75 md:size-77.5' : 'size-47.5',
        )}
      />
      <span
        className={cn(
          shape,
          'transform-[translate(-50%,-50%)_rotate(-25deg)] rounded-[18%] shadow-[12px_12px_0_#255061,22px_23px_25px_#00132255] [background:linear-gradient(140deg,#8bb6ad,#356978_50%,#082c46)]',
          large ? 'size-28.75 md:size-42.5' : 'size-25',
        )}
      />
    </>
  )
}

export function CoralArtwork(props: ArtworkProps) {
  const { large } = props

  return (
    <span
      className={cn(
        shape,
        'transform-[translate(-50%,-50%)] rounded-full shadow-[inset_12px_12px_25px_#c5d3b45e,inset_-18px_-12px_30px_#062f4b] [background:repeating-conic-gradient(from_10deg,#a9b9aa_0deg,#477e7f_4deg,#184a59_9deg,#91b1a3_13deg)]',
        large ? 'size-28.75 md:size-42.5' : 'size-30',
      )}
    />
  )
}

export function TerminalArtwork(props: ArtworkProps) {
  const { large } = props

  return (
    <>
      <span
        className={cn(
          innerOutline,
          'transform-[translate(-50%,-50%)_rotate(-8deg)] rounded-[25px] opacity-50',
          large ? 'h-55 w-70' : 'h-35 w-43.75',
        )}
      />
      <span
        className={cn(
          outerOutline,
          'transform-[translate(-50%,-50%)_rotate(-8deg)] rounded-[25px] opacity-30',
          large ? 'h-70 w-85' : 'h-42.5 w-51.25',
        )}
      />
      <span
        className={cn(
          shape,
          'transform-[translate(-50%,-50%)_rotate(-8deg)] rounded-[9px] border border-[#8cae9f75] shadow-[12px_20px_30px_#00182770,inset_0_0_15px_#83b7a110] [background:linear-gradient(145deg,#274e53,#092a36)] before:absolute before:size-3 before:transform-[rotate(45deg)] before:border-t-2 before:border-r-2 before:border-t-[#b1d7b4] before:border-r-[#b1d7b4] before:content-[""] after:absolute after:h-0.5 after:bg-[#79a69a] after:shadow-[0_10px_0_#79a69a25] after:content-[""]',
          large
            ? 'h-37.5 w-52.5 before:top-14.75 before:left-13.75 after:top-19.5 after:left-20.5 after:w-9.5'
            : 'h-25 w-33.75 before:top-8.5 before:left-7 after:top-13.25 after:left-13.75 after:w-5.75',
        )}
      />
    </>
  )
}

export function PagesArtwork(props: ArtworkProps) {
  const { large } = props

  return (
    <span
      className={cn(
        shape,
        'transform-[translate(-50%,-50%)_rotate(12deg)] rounded-[3px] shadow-[-12px_8px_0_#426e70,-22px_16px_0_#214c5b,5px_25px_35px_#00192d70] [background:linear-gradient(135deg,#bed0b6,#668f87)] after:absolute after:h-px after:bg-[#2f606070] after:shadow-[0_12px_0_#2f606070,0_24px_0_#2f606070,0_36px_0_#2f606070,0_48px_0_#2f606035] after:content-[""]',
        large
          ? 'h-46.25 w-36.25 after:top-12.5 after:left-8 after:w-20'
          : 'h-32 w-25 after:top-9 after:left-5.75 after:w-12.5',
      )}
    />
  )
}

export function ToolsArtwork(props: ArtworkProps) {
  const { large } = props

  return (
    <>
      <span
        className={cn(
          innerOutline,
          'transform-[translate(-50%,-50%)_rotate(45deg)] rounded-[30px]',
          large ? 'size-50 md:size-75' : 'size-40',
        )}
      />
      <span
        className={cn(
          outerOutline,
          'transform-[translate(-50%,-50%)_rotate(45deg)] rounded-[38px] opacity-40',
          large ? 'size-60 md:size-87.5' : 'size-50',
        )}
      />
      <span
        className={cn(
          shape,
          'transform-[translate(-50%,-50%)_rotate(45deg)] rounded-[22px] shadow-[10px_10px_30px_#001b3260] [background:linear-gradient(150deg,#b3c6ab,#5b9690_40%,#1f4b5d)] after:absolute after:rounded-full after:border after:border-[#c3ddbf90] after:shadow-[inset_4px_4px_12px_#123b4a80] after:content-[""]',
          large ? 'size-40 after:inset-10' : 'size-27.5 after:inset-7',
        )}
      />
    </>
  )
}

export function JournalArtwork(props: ArtworkProps) {
  const { large } = props

  return (
    <>
      <span
        className={cn(
          innerOutline,
          'transform-[translate(-50%,-50%)_rotate(-30deg)_scaleY(0.4)] rounded-full opacity-35',
          large ? 'size-50 md:size-75' : 'size-43.75',
        )}
      />
      <span
        className={cn(
          outerOutline,
          'transform-[translate(-50%,-50%)_rotate(45deg)_scaleY(0.5)] rounded-full opacity-35',
          large ? 'size-60 md:size-87.5' : 'size-50',
        )}
      />
      <span
        className={cn(
          shape,
          'transform-[translate(-50%,-50%)_rotate(-12deg)] rounded-[50%_50%_8%_8%/8%_8%_12%_12%] shadow-[5px_20px_30px_#001b3260] [background:linear-gradient(90deg,#728e82,#b6c4a5_45%,#547b76_50%,#c0cbae_55%,#829d8a)] after:absolute after:h-px after:bg-[#365d5550] after:content-[""]',
          large
            ? 'h-40 w-50 after:top-11.25 after:left-5 after:w-15 after:shadow-[0_16px_0_#365d5550,0_32px_0_#365d5550,100px_0_0_#365d5550,100px_16px_0_#365d5550,100px_32px_0_#365d5550]'
            : 'h-25 w-31.25 after:top-7 after:left-3 after:w-9.5 after:shadow-[0_10px_0_#365d5550,0_20px_0_#365d5550,64px_0_0_#365d5550,64px_10px_0_#365d5550,64px_20px_0_#365d5550]',
        )}
      />
    </>
  )
}
