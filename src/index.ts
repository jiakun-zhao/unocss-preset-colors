import type { Preset } from 'unocss'
import type { Theme } from 'unocss/preset-mini'
import type { Options } from './types'
import { parseCssColor } from '@unocss/rule-utils'
import setWithPropertyPath from 'lodash.set'
import { kebabCase } from 'scule'
import { name } from '../package.json'

export default function (options: Options = {}): Preset<Theme> {
  const { mode = {}, ...colors } = options
  const theme: Record<string, Record<string, any>> = { colors: {} }
  let lCss = ''
  let dCss = ''

  Object.entries(colors).forEach(([type, values]) => {
    !theme[type] && (theme[type] = {})
    Object.entries(values).forEach(([name, { light: l, dark: d }]) => {
      const lParsedColor = parseCssColor(l)
      const dParsedColor = parseCssColor(d)
      if (!lParsedColor || !dParsedColor)
        return
      const { type: lType, components: lComp } = lParsedColor
      const { type: dType, components: dComp } = dParsedColor
      if (lType !== dType)
        return
      const kebabCaseType = kebabCase(type)
      const n = type === 'colors' ? `--${name}` : `--${kebabCaseType}-${name}`
      setWithPropertyPath(theme[type], name.split('-').filter(Boolean).join('.'), `${lType}(var(${n}))`)
      if (type !== 'colors')
        setWithPropertyPath(theme.colors, `${kebabCaseType}-shared-${name}`.split('-').filter(Boolean).join('.'), `${lType}(var(${n}))`)
      lCss += `${n}:${lComp.join(' ')};`
      dCss += `${n}:${dComp.join(' ')};`
    })
  })

  const media = '@media (prefers-color-scheme:dark)'
  let css = ''

  if (mode === 'media') {
    css = `:root{${lCss}}${media}{:root{${dCss}}}`
  } else {
    const _mode = mode === 'mixin' ? {} : mode
    const { tag = 'html', mixin = true, dark: dotDark = '.dark', light: dotLight = '.light' } = _mode
    if (mixin) {
      css = `${tag},${tag}${dotLight}{${lCss}}${tag}${dotDark}{${dCss}}${media}{${tag}:not(:is(${dotLight},${dotDark})){${dCss}}}`
    } else {
      css = `${tag}${dotLight}{${lCss}}${tag}${dotDark}{${dCss}}`
    }
  }

  return {
    name,
    enforce: 'pre',
    layer: name,
    preflights: [{ getCSS: () => css }],
    theme,
  }
}
