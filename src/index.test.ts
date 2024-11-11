import type { Options } from './index'
import { UnoGenerator } from 'unocss'
import { expect, it } from 'vitest'
import presetColors from './index'

async function generate(options: Options) {
  const uno = new UnoGenerator({
    presets: [
      presetColors(options),
    ],
  })
  const code = `
  <div class="text-primary"></div>
  <div class="text-primary:10"></div>
  <div class="bg-primary/10"></div>
  <div class="b-primary/10"></div>

  <div class="unknown-primary"></div>
  <div class="unknown-secondly"></div>
  `
  return (await uno.generate(code)).css
}

it('with property', async () => {
  const css = await generate({
    colors: {
      'text-primary': { property: 'custom-property', light: '#000', dark: '#fff' },
    },
  })
  expect(css).toMatchInlineSnapshot(`
    "/* layer: preflights */
    html,html.light{--text-primary:0 0 0}html.dark{--text-primary:255 255 255}@media (prefers-color-scheme: dark){html:not(:is(.light,.dark)){--text-primary:255 255 255}}
    /* layer: default */
    .text-primary{custom-property:rgb(var(--text-primary) / 1);}
    .text-primary\\:10{custom-property:rgb(var(--text-primary) / 0.1);}"
  `)
})

it('without property', async () => {
  const css = await generate({
    colors: {
      'unknown-primary': { property: 'color', light: '#000', dark: '#fff' },
      'unknown-secondly': { light: '#000', dark: '#fff' }, // need property
    },
  })
  expect(css).toMatchInlineSnapshot(`
    "/* layer: preflights */
    html,html.light{--unknown-primary:0 0 0}html.dark{--unknown-primary:255 255 255}@media (prefers-color-scheme: dark){html:not(:is(.light,.dark)){--unknown-primary:255 255 255}}
    /* layer: default */
    .unknown-primary{color:rgb(var(--unknown-primary) / 1);}"
  `)
})

it('media', async () => {
  const css = await generate({
    mode: 'media',
    colors: {
      'text-primary': { light: '#000', dark: '#fff' },
    },
  })
  expect(css).toMatchInlineSnapshot(`
    "/* layer: preflights */
    :root{--text-primary:0 0 0}@media (prefers-color-scheme: dark){:root{--text-primary:255 255 255}}
    /* layer: default */
    .text-primary{color:rgb(var(--text-primary) / 1);}
    .text-primary\\:10{color:rgb(var(--text-primary) / 0.1);}"
  `)
})

it('tag & custom selector', async () => {
  const css = await generate({
    mode: { tag: 'body', dark: '.theme-dark', light: '.theme-light' },
    colors: {
      'text-primary': { light: '#000', dark: '#fff' },
    },
  })
  expect(css).toMatchInlineSnapshot(`
    "/* layer: preflights */
    body,body.theme-light{--text-primary:0 0 0}body.theme-dark{--text-primary:255 255 255}@media (prefers-color-scheme: dark){body:not(:is(.theme-light,.theme-dark)){--text-primary:255 255 255}}
    /* layer: default */
    .text-primary{color:rgb(var(--text-primary) / 1);}
    .text-primary\\:10{color:rgb(var(--text-primary) / 0.1);}"
  `)
})
