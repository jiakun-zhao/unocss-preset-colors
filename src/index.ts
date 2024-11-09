import type { CSSColorValue } from '@unocss/rule-utils'
import type { Preset } from 'unocss'
import { notUndefined } from '@antfu/utils'
import { colorToString, parseCssColor as parse } from '@unocss/rule-utils'
import { name } from '../package.json'

type Property = 'background-color' | 'background' | 'border' | 'border-bottom-color' | 'border-color' | 'border-left-color' | 'border-right-color' | 'border-top-color' | 'box-shadow' | 'caret-color' | 'color' | 'column-rule' | 'column-rule-color' | 'filter' | 'opacity' | 'outline-color' | 'outline' | 'text-decoration' | 'text-decoration-color' | 'text-shadow'

export interface Color {
  property: Property | (string & {})
  light: string
  dark: string
}

interface Format {
  key: string
  property: Property | (string & {})
  light: CSSColorValue
  dark: CSSColorValue
}

function format(item: [string, Color]): Partial<Format> {
  const [key, { property, dark, light }] = item
  return { key, property, dark: parse(dark), light: parse(light) }
}

function verify(color: Partial<Format>): color is Format {
  return notUndefined(color.light) && notUndefined(color.dark)
}

export default function (colors: Record<string, Color>): Preset {
  return {
    name,
    rules: Object.entries(colors)
      .map(format)
      .filter(verify)
      .map(({ key, property, dark, light }) => {
        return [
          new RegExp(`^${key}(?:[:|/](\\d+))?$`),
          ([,_opacity], { symbols }) => {
            const opacity = +(_opacity ?? '100') / 100
            const lightColor = colorToString(light, opacity)
            const darkColor = colorToString(dark, opacity)
            return [
              {
                [symbols.selector]: selector => `.dark ${selector}`,
                [property]: darkColor,
              },
              {
                [symbols.parent]: '@media (prefers-color-scheme: dark)',
                [symbols.selector]: selector => `${selector}:not(.light):not(.dark)`,
                [property]: darkColor,
              },
              {
                [symbols.selector]: selector => `.light ${selector}`,
                [property]: lightColor,
              },
              {
                [property]: lightColor,
              },
            ]
          },
        ]
      }),
  }
}
