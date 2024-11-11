import type { CSSColorValue } from '@unocss/rule-utils'
import type { Preset } from 'unocss'
import { isUndefined, notUndefined } from '@antfu/utils'
import { parseCssColor as parse } from '@unocss/rule-utils'
import { name } from '../package.json'

type Property = 'background-color' | 'border-color' | 'caret-color' | 'color' | 'column-rule-color' | 'outline-color' | 'text-decoration-color'

interface Color {
  property?: Property | (string & {})
  light: string
  dark: string
}

export interface Options {
  mode?: 'media' | { tag?: string, dark: string, light: string }
  colors: Record<string, Color>
}

export default function (options: Options): Preset {
  const { mode = { dark: '.dark', light: '.light' }, colors } = options

  const value = Object.entries(colors)
    .map(([key, value]) => {
      const dark = parse(value.dark)
      const light = parse(value.light)
      let property = value.property

      if (isUndefined(light))
        return undefined

      if (isUndefined(dark))
        return undefined

      if (isUndefined(property)) {
        const start = (...args: string[]) => args.some(it => key.startsWith(it))
        if (start('text'))
          property = 'color'
        else if (start('bg'))
          property = 'background-color'
        else if (start('border', 'b'))
          property = 'border-color'
        else
          return undefined
      }

      return { key, property, dark, light }
    })
    .filter(notUndefined)

  const media = '@media (prefers-color-scheme: dark)'
  const createRegExp = (key: string) => new RegExp(`^${key}(?:[:|/](\\d+))?$`)

  return {
    name,
    preflights: [{
      getCSS() {
        const toVar = (it: CSSColorValue) => it.components.join(' ')
        const darkVars = value.map(it => `--${it.key}:${toVar(it.dark)}`).join(';')
        const lightVars = value.map(it => `--${it.key}:${toVar(it.light)}`).join(';')
        if (mode === 'media') {
          return `:root{${lightVars}}${media}{:root{${darkVars}}}`
        }
        const { tag = 'html', light, dark } = mode
        return `${tag},${tag}${light}{${lightVars}}${tag}${dark}{${darkVars}}${media}{${tag}:not(:is(${light},${dark})){${darkVars}}}`
      },
    }],
    rules: value.map(({ key, property }) => [
      createRegExp(key),
      ([, opacity]) => ({ [property]: `rgb(var(--${key}) / ${+(opacity ?? '100') / 100})` }),
      { autocomplete: key },
    ]),
  }
}
