'use client'
import { Code, Link, Snippet } from '@nextui-org/react'
import { button as buttonStyles } from '@nextui-org/theme'

import { siteConfig } from '@/config/site'

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl justify-center text-center">
        <span>Make&nbsp;</span>
        <span>beautiful&nbsp;</span>
        <br />
        <span>websites regardless of your design experience.</span>
        <div>Beautiful, fast and modern React UI library.</div>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: 'primary',
            radius: 'full',
            variant: 'shadow',
          })}
          href={siteConfig.links.docs}
        >
          Documentation
        </Link>
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div>
    </section>
  )
}
