import type { Preset } from 'unocss'
import type { Theme } from 'unocss/preset-mini'
import { cleanText, isObject, isString } from '@jiakun-zhao/utils'
import { variantMatcher } from '@unocss/rule-utils'
import { name } from '../package.json'

interface Color {
  dark: string
  light: string
}

interface ThemeColor extends Partial<Color> {
  DEFAULT?: string

  [key: string]: ThemeColor | string | undefined
}

function parseThemeColor(obj: Theme | ThemeColor, colors = new Map<string, Color>()) {
  Object.values(obj).forEach((value) => {
    if (!isObject(value))
      return
    const { DEFAULT, dark, light } = value as ThemeColor
    if (isString(DEFAULT) && isString(dark) && isString(light)) {
      const name = cleanText(DEFAULT, ' ').match(/var\((--.+?)\)/)?.[1]
      name && colors.set(name, { dark, light })
    }
    parseThemeColor(value, colors)
  })
  return colors
}

function parseCss(input: Map<string, Color>) {
  let light = ''
  let dark = ''
  Array.from(input).forEach(([key, value]) => {
    light += `${key}:${value.light};`
    dark += `${key}:${value.dark};`
  })
  return { dark, light }
}

export default function (): Preset<Theme> {
  const lightPrefix = 'html:not(.dark)'
  const darkPrefix = 'html:is(.dark)'
  const darkPrefixInMedia = 'html:not(.light)'
  return {
    name,
    enforce: 'post',
    layers: {
      [name]: 1000,
    },
    preflights: [{
      layer: name,
      getCSS(context) {
        const colors = parseThemeColor(context.theme)
        const { light, dark } = parseCss(colors)
        return [
          `${lightPrefix}{${light}}`,
          `${darkPrefix}{${dark}}`,
          `@media (prefers-color-scheme:dark){`,
          `${darkPrefixInMedia}{${dark}}`,
          `}`,
        ].join('\n')
      },
    }],
    configResolved(config) {
      config.variants = [
        ...config.variants.filter(({ name }) => name && !name.includes('dark') && !name.includes('light')),
        variantMatcher('light', [
          input => ({ prefix: `${lightPrefix} $$ ${input.prefix}` }),
        ]),
        variantMatcher('dark', [
          input => ({ prefix: `${darkPrefix} $$ ${input.prefix}` }),
          input => ({
            prefix: `${darkPrefixInMedia} $$ ${input.prefix}`,
            parent: `${input.parent ? ` $$ ${input.parent}` : ''}@media (prefers-color-scheme:dark)`,
          }),
        ]),
      ]
    },
  }
}
