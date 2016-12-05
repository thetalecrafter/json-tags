import { resolve } from 'path'

import alias from 'rollup-plugin-alias'
import buble from 'rollup-plugin-buble'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'src/index.js',
  dest: 'dist/json-tags.min.js',
  format: 'iife',
  moduleName: 'createComponent',
  sourceMap: true,
  plugins: [
    alias({
      'incremental-dom': resolve(__dirname, 'node_modules/incremental-dom/index')
    }),
    buble({
      transforms: { dangerousForOf: true }
    }),
    replace({
      'process.env.NODE_ENV': '"production"'
    }),
    uglify()
  ]
}
