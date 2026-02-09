import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
    VueI18n({
      runtimeOnly: false,
      compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__dirname, './src/locales/**')],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8500,
    strictPort: true,
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - split Vue ecosystem from others
          if (id.includes('node_modules')) {
            // Core Vue ecosystem
            if (id.includes('vue/') && !id.includes('vue-')) {
              return 'vendor-vue-core'
            }
            if (id.includes('vue-router')) {
              return 'vendor-vue-router'
            }
            if (id.includes('pinia')) {
              return 'vendor-vue-pinia'
            }
            // Vue ecosystem utilities
            if (id.includes('vue-') || id.includes('@vue')) {
              return 'vendor-vue-utils'
            }

            // UI libraries
            if (id.includes('reka-ui')) {
              return 'vendor-reka'
            }
            if (id.includes('headlessui') || id.includes('class-variance') ||
                id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-ui-utils'
            }
            if (id.includes('lucide')) {
              return 'vendor-icons'
            }

            // Form libraries
            if (id.includes('vee-validate')) {
              return 'vendor-vee-validate'
            }
            if (id.includes('zod')) {
              return 'vendor-zod'
            }

            // Data libraries
            if (id.includes('@tanstack')) {
              return 'vendor-tanstack'
            }

            // Utility libraries
            if (id.includes('@vueuse')) {
              return 'vendor-vueuse'
            }
            if (id.includes('@internationalized') || id.includes('vue-sonner') || id.includes('vue-i18n')) {
              return 'vendor-utils'
            }

            return 'vendor-other'
          }

          // Feature chunks based on file paths
          if (id.includes('src/views/admin/')) {
            return 'admin-features'
          }
          if (id.includes('src/views/auth/')) {
            return 'auth-features'
          }
          if (id.includes('src/views/home/')) {
            if (id.includes('bento') || id.includes('sections')) {
              return 'home-sections'
            }
            return 'home-features'
          }
          if (id.includes('src/views/quiz/')) {
            return 'quiz-features'
          }

          // API chunks
          if (id.includes('src/api/')) {
            return 'api-features'
          }

          // Component chunks - split large custom components
          if (id.includes('src/components/custom/')) {
            if (id.includes('tables') || id.includes('filters')) {
              return 'table-components'
            }
            if (id.includes('forms') || id.includes('combobox')) {
              return 'form-components'
            }
            return 'custom-components'
          }
          if (id.includes('src/components/ui/')) {
            return 'ui-components'
          }

          // Composables
          if (id.includes('src/composables/')) {
            return 'composables'
          }

          // Stores
          if (id.includes('src/stores/')) {
            return 'stores'
          }

          return undefined
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            // Create specific chunks for large feature areas
            if (facadeModuleId.includes('/views/admin/')) {
              return 'admin/[name]-[hash].js'
            }
            if (facadeModuleId.includes('/views/auth/')) {
              return 'auth/[name]-[hash].js'
            }
            if (facadeModuleId.includes('/views/home/')) {
              return 'home/[name]-[hash].js'
            }
            if (facadeModuleId.includes('/views/quiz/')) {
              return 'quiz/[name]-[hash].js'
            }
          }
          return 'chunks/[name]-[hash].js'
        },
      },
    },
  },
})
