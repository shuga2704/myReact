import typescript from '@rollup/plugin-typescript';
// import dts from 'rollup-plugin-dts';

// import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import typescript from 'rollup-plugin-typescript';

// const config = [
//     {
//         input: 'dist/index.js',
//         output: {
//             file: 'lockstep-api.js',
//             format: 'cjs',
//             sourcemap: true,
//         },
//         external: ['axios', 'os', 'url'],
//         plugins: [typescript()],
//     },
//     {
//         input: 'dist/index.d.ts',
//         output: {
//             file: 'lockstep-api.d.ts',
//             format: 'es',
//         },
//         plugins: [dts()],
//     },
// ];
//
// export default config;

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/index.es.js',
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        // resolve(),
        // commonjs(),
        typescript(),
    ],
};
