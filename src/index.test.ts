import type { Theme } from 'unocss/preset-mini'
import { createGenerator, presetWind3 } from 'unocss'
import { expect, it } from 'vitest'
import presetColors from './index'

it('should work', async () => {
  const uno = await createGenerator<Theme>({
    presets: [
      presetWind3({ preflight: false }),
      presetColors(),
    ],
    theme: {
      textColor: {
        primary: {
          DEFAULT: 'var(--hello)',
          dark: '#111',
          light: '#ddd',
          primary: {
            DEFAULT: 'var(--hello)',
            dark: '#111',
            light: '#ddd',
          },
        },
      },
    },
  })

  expect((await uno.generate('text-primary light:text-red dark:hover:text-blue dark:group-not-hover:bg-yellow')).css).toMatchInlineSnapshot(`
    "/* layer: default */
    html:is(.dark) .group:not(:hover) .dark\\:group-not-hover\\:bg-yellow{--un-bg-opacity:1;background-color:rgb(250 204 21 / var(--un-bg-opacity));}
    .text-primary{color:var(--hello);}
    html:not(.dark) .light\\:text-red{--un-text-opacity:1;color:rgb(248 113 113 / var(--un-text-opacity));}
    html:is(.dark) .dark\\:hover\\:text-blue:hover{--un-text-opacity:1;color:rgb(96 165 250 / var(--un-text-opacity));}
    @media (prefers-color-scheme:dark){
    html:not(.light) .group:not(:hover) .dark\\:group-not-hover\\:bg-yellow{--un-bg-opacity:1;background-color:rgb(250 204 21 / var(--un-bg-opacity));}
    html:not(.light) .dark\\:hover\\:text-blue:hover{--un-text-opacity:1;color:rgb(96 165 250 / var(--un-text-opacity));}
    }
    /* layer: unocss-preset-colors */
    html:not(.dark){--hello:#ddd;}
    html:is(.dark){--hello:#111;}
    @media (prefers-color-scheme:dark){
    html:not(.light){--hello:#111;}
    }"
  `)
})
