import { presetAttributify, UnoGenerator } from 'unocss'
import { describe, expect, it } from 'vitest'
import presetColors from './index'

describe('test', () => {
  it('should work', async () => {
    const code = `
      <div class="text-primary"></div>
      <div text="primary"></div>
      `
    // <div class="text-primary:10"></div>
    // <div class="text-primary/10"></div>
    const uno = new UnoGenerator({
      presets: [
        presetAttributify(),
        presetColors({
          'text-primary': { property: 'color', light: '#000', dark: '#f2f2f2' },
        }),
      ],
    })
    const result = await uno.generate(code)
    expect(result.css)
      .toMatchInlineSnapshot(`
        "/* layer: default */
        .dark .text-primary,
        .dark [text~="primary"]{color:rgb(242 242 242 / 1);}
        .light .text-primary,
        .light [text~="primary"],
        .text-primary,
        [text~="primary"]{color:rgb(0 0 0 / 1);}
        @media (prefers-color-scheme: dark){
        .text-primary:not(.light):not(.dark),
        [text~="primary"]:not(.light):not(.dark){color:rgb(242 242 242 / 1);}
        }"
      `)
  })
})
