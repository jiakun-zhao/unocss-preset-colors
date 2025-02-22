import type { Theme } from 'unocss/preset-mini'
import { createGenerator, presetWind3 } from 'unocss'
import { expect, it } from 'vitest'
import presetColors from './index'

it('should work', async () => {
  const uno = await createGenerator<Theme>({
    presets: [
      presetWind3({ preflight: false }),
      presetColors({
        colors: { accent: { dark: 'rgb(1,2,3,.1)', light: 'rgb(1,2,3,.12)' } },
        borderColor: { foo: { dark: '#111', light: '#ddd' } },
        backgroundColor: { 'path-to-value': { dark: '#111', light: '#ddd' } },
      }),
    ],
  })

  expect(uno.config.theme.backgroundColor).toMatchInlineSnapshot(`
    {
      "path": {
        "to": {
          "value": "rgb(var(--background-color-path-to-value))",
        },
      },
    }
  `)

  expect((await uno.generate('bg-path-to-val')).css).toMatchInlineSnapshot(`
    "/* layer: preflights */
    html,html.light{--accent:1 2 3;--border-color-foo:221 221 221;--background-color-path-to-value:221 221 221;}html.dark{--accent:1 2 3;--border-color-foo:17 17 17;--background-color-path-to-value:17 17 17;}@media (prefers-color-scheme:dark){html:not(:is(.light,.dark)){--accent:1 2 3;--border-color-foo:17 17 17;--background-color-path-to-value:17 17 17;}}"
  `)

  expect((await uno.generate('text-accent text-foo')).css).toMatchInlineSnapshot(`
    "/* layer: preflights */
    html,html.light{--accent:1 2 3;--border-color-foo:221 221 221;--background-color-path-to-value:221 221 221;}html.dark{--accent:1 2 3;--border-color-foo:17 17 17;--background-color-path-to-value:17 17 17;}@media (prefers-color-scheme:dark){html:not(:is(.light,.dark)){--accent:1 2 3;--border-color-foo:17 17 17;--background-color-path-to-value:17 17 17;}}
    /* layer: default */
    .text-accent{--un-text-opacity:1;color:rgb(var(--accent) / var(--un-text-opacity));}"
  `)

  expect((await uno.generate('text-accent b-foo')).css).toMatchInlineSnapshot(`
    "/* layer: preflights */
    html,html.light{--accent:1 2 3;--border-color-foo:221 221 221;--background-color-path-to-value:221 221 221;}html.dark{--accent:1 2 3;--border-color-foo:17 17 17;--background-color-path-to-value:17 17 17;}@media (prefers-color-scheme:dark){html:not(:is(.light,.dark)){--accent:1 2 3;--border-color-foo:17 17 17;--background-color-path-to-value:17 17 17;}}
    /* layer: default */
    .b-foo{--un-border-opacity:1;border-color:rgb(var(--border-color-foo) / var(--un-border-opacity));}
    .text-accent{--un-text-opacity:1;color:rgb(var(--accent) / var(--un-text-opacity));}"
  `)
})
