/* eslint perfectionist/sort-objects: "error" */

import defineConfig from '@antfu/eslint-config'

export default defineConfig({
  stylistic: {
    overrides: {
      'no-console': 'warn',
      'style/brace-style': ['warn', '1tbs'],
      'ts/ban-ts-comment': 'off',
      'ts/no-unused-expressions': 'off',
      'unused-imports/no-unused-imports': 'warn',
    },
  },
})
