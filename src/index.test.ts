import { presetAttributify, UnoGenerator } from 'unocss'
import { describe, expect, it } from 'vitest'
import presetColors from './index'

describe('test', () => {
  it('should work', async () => {
    const code = `
      <div class="text-primary"></div>
      <div text="primary"></div>
      <div class="bg-primary/10"></div>
      <div class="b-primary/10"></div>
    `
    // <div class="text-primary:10"></div>
    // <div class="bg-primary/10"></div>
    const uno = new UnoGenerator({
      presets: [
        presetAttributify(),
        presetColors({
          // mode: 'media',
          colors: {
            'text-primary': { property: 'color', light: '#000', dark: '#f2f2f2' },
            'bg-primary': { light: '#fff', dark: '#111' },
            'b-primary': { light: '#fff', dark: '#111' },
          },
        }),
      ],
    })
    const result = await uno.generate(code)
    expect(result.css)
      .toMatchInlineSnapshot(`
        "/* layer: preflights */
        html,html.light{--text-primary:0 0 0;--bg-primary:255 255 255;--b-primary:255 255 255}html.dark{--text-primary:242 242 242;--bg-primary:17 17 17;--b-primary:17 17 17}@media (prefers-color-scheme: dark){html:not(:is(.light,.dark)){--text-primary:242 242 242;--bg-primary:17 17 17;--b-primary:17 17 17}}
        /* layer: default */
        .text-primary,
        [text~="primary"]{color:rgb(var(--text-primary) / 1);}
        .bg-primary\\/10{background-color:rgb(var(--bg-primary) / 0.1);}
        .b-primary\\/10{border-color:rgb(var(--b-primary) / 0.1);}"
      `)
  })
})
