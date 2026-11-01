import { m } from '@/paraglide/messages'

export function Pinned() {
  return (
    <aside className='pt-5.5 max-[601px]:mb-10 max-[601px]:pt-0'>
      <span className='block text-xs leading-[normal] tracking-[0.02em] text-section-label'>
        {m.seabed_context_label()}
      </span>
      <h2 className='mt-6 text-[42px] leading-[1.12] font-[410] tracking-tighter max-[851px]:text-[32px] max-[601px]:text-4xl'>
        {m.seabed_context_title()}
        <br />
        <em className='font-serif font-normal tracking-[-0.04em] text-[#bed3c6]'>{m.seabed_context_emphasis()}</em>
      </h2>
      <p className='mt-6.25 max-w-82.5 text-base/[1.65] text-[#9ebcb0] max-[601px]:max-w-none'>
        {m.seabed_context_description()}
      </p>
    </aside>
  )
}
