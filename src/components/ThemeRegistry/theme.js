import { Roboto } from 'next/font/google'
import { extendTheme } from '@mui/material-next/styles'

// export const roboto = Roboto({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
//   fallback: ['Helvetica', 'Arial', 'sans-serif'],
// })

// Create a theme instance.
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        headerColor: {
          main: '#0b113a',
        },
        darkBlue: {
          main: '#0b113a',
        },
        primary: {
          main: '#f04e24',
        },
        secondary: {
          main: '#0057ac',
        },
        orange: {
          main: '#f04e24',
        },
        error: {
          main: '#ac0e00',
        },
        background: {
          default: 'rgb(246, 245, 244)'
        }
      }
      // typography: {
      //   fontFamily: roboto.style.fontFamily,
      // },
    }
  }
})

export default theme
