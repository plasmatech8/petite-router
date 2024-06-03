import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/petite-router.js',
    output: [
      // ES Module
      {
        file: 'dist/petite-router.es.js',
        format: 'es',
        name: 'PetiteRouter',
        plugins: [terser()],
        sourcemap: true
      },
      // Universal Module Definition
      {
        file: 'dist/petite-router.umd.js',
        format: 'umd',
        name: 'PetiteRouter',
        plugins: [terser()],
        sourcemap: true
      },
      // Add ES Module to example code
      {
        file: 'example/petite-router.es.js',
        format: 'es',
        name: 'PetiteRouter',
        plugins: [terser()],
        sourcemap: true
      }
    ],
    plugins: []
  },
  {
    input: 'src/iife-script.js',
    output: [
      //  Immediately Invoked Function Expression
      {
        file: 'dist/petite-router.iife.js',
        format: 'iife',
        name: 'PetiteRouter',
        plugins: [terser()],
        sourcemap: true
      },
      // Add IIFE to example code
      {
        file: 'example/petite-router.iife.js',
        format: 'iife',
        name: 'PetiteRouter',
        plugins: [terser()],
        sourcemap: true
      }
    ]
  }
];
