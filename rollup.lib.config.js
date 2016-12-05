import { resolve } from 'path'

import alias from 'rollup-plugin-alias'
import buble from 'rollup-plugin-buble'

export default {
  entry: 'src/index.js',
  dest: 'lib/index.js',
  format: 'cjs',
  external: [
    'incremental-dom'
  ],
  plugins: [
    buble({
      transforms: { dangerousForOf: true }
    })
  ]
}
