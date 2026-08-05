import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import obfuscator from 'vite-plugin-javascript-obfuscator'

const legalBanner = `/*!
 * © 2026 RiskINTEGRA Internal Audit™ - Zenith Pension Custodian Limited.
 * CONFIDENTIAL & PROPRIETARY INSTITUTIONAL SOFTWARE.
 * 
 * NOTICE: This software and its underlying continuous auditing models, risk-based
 * scoring algorithms, and PENCOM/CBN compliance ledgers are protected under the
 * Nigerian Copyright Act and international trade secret conventions.
 */`;

// https://vite.dev/config/
export default defineConfig({
  base: '/audit-portal/',
  plugins: [
    react(),
    obfuscator({
      include: ['src/**/*.js', 'src/**/*.jsx'],
      exclude: [/node_modules/],
      apply: 'build',
      options: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.6,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.3,
        debugProtection: true,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        selfDefending: true,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.75,
      }
    })
  ],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: process.env.VITE_AWS_API_URL || 'https://uhzosq0g0i.execute-api.eu-west-1.amazonaws.com/prod',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  build: {
    sourcemap: false, // Prevent source reconstruction via DevTools
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace', 'console.table'],
        passes: 2,
      },
      mangle: {
        toplevel: false,
        safari10: true,
      },
      format: {
        comments: false,
        preamble: legalBanner,
      },
    },
    chunkSizeWarningLimit: 1200,
  },
})
