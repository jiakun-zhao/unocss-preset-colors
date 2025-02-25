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
        primary: { DEFAULT: 'var(--text-primary)', dark: '#fff', light: '#000' },
      },
    },
  })

  expect((await uno.generate('text-primary')).css).toMatchInlineSnapshot(`
    "/* layer: unocss-preset-colors */
    html:not(.dark){--text-primary:#000;}
    html:is(.dark){--text-primary:#fff;}
    @media (prefers-color-scheme:dark){
    html:not(.light){--text-primary:#fff;}
    }
    /* layer: default */
    .text-primary{color:var(--text-primary);}"
  `)

  expect((await uno.generate('text-red light:text-yellow dark:text-blue')).css).toMatchInlineSnapshot(`
    "/* layer: unocss-preset-colors */
    html:not(.dark){--text-primary:#000;}
    html:is(.dark){--text-primary:#fff;}
    @media (prefers-color-scheme:dark){
    html:not(.light){--text-primary:#fff;}
    }
    /* layer: default */
    .text-red{--un-text-opacity:1;color:rgb(248 113 113 / var(--un-text-opacity));}
    html:is(.dark) .dark\\:text-blue{--un-text-opacity:1;color:rgb(96 165 250 / var(--un-text-opacity));}
    html:not(.dark) .light\\:text-yellow{--un-text-opacity:1;color:rgb(250 204 21 / var(--un-text-opacity));}
    @media (prefers-color-scheme:dark){
    html:not(.light) .dark\\:text-blue{--un-text-opacity:1;color:rgb(96 165 250 / var(--un-text-opacity));}
    }"
  `)
})
