import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'sangsanLight',
    themes: {
      sangsanLight: {
        dark: false,
        colors: {
          background: '#F7F6F2',
          surface: '#FFFFFF',
          primary: '#D97706',
          secondary: '#0F172A',
          accent: '#F59E0B',
          info: '#0284C7',
          success: '#059669',
          warning: '#D97706',
          error: '#E11D48',
        },
      },
    },
  },
})
