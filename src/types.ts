import type { DarkModeSelectors, Theme } from 'unocss/preset-mini'

interface Selectors extends DarkModeSelectors {
  tag?: string
  mixin?: boolean
}

export type ColorKeys = 'colors' | `${string}Color`

export type Options =
  & { mode?: 'media' | 'mixin' | Selectors, shared?: boolean }
  & { [K in keyof Theme as K extends ColorKeys ? K : never]: Record<string, { dark: string, light: string }> }
