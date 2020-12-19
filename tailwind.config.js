
const allColors = require('tailwindcss/colors')

const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')
const em = (px, base) => `${round(px / base)}em`

module.exports = {
  purge: [
    "./src/static/css/tailwind.css",
    "./src/**/*.html",
    "./src/**/*.njk",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        trueGray: allColors.trueGray,
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "max-width": "70ch",
            "code::before": {
              content: '""',
              "padding-left": "0.25rem"
            },
            "code::after": {
              content: '""',
              "padding-right": "0.25rem"
            },
            "pre code::before": {
              "padding-left": "unset"
            },
            "pre code::after": {
              "padding-right": "unset"
            },
            code: {
              backgroundColor: theme("colors.gray.100"),
              color: theme("colors.red.600"),
              fontWeight: "400",
              "border-radius": "0.25rem"
            },
            pre: {
              backgroundColor: theme("colors.gray.100"),
              color: theme("colors.gray.900"),
              marginTop: em(20, 16),
              marginBottom: em(20, 16),
            },
          },
        },
        sm: {
          css: {
            pre: {
              marginTop: em(16, 14),
              marginBottom: em(16, 14),
            },
          },
        },
        lg: {
          css: {
            pre: {
              marginTop: em(24, 18),
              marginBottom: em(24, 18),
            },
          },
        },
        xl: {
          css: {
            pre: {
              marginTop: em(24, 20),
              marginBottom: em(24, 20),
            },
          },
        },
        "2xl": {
          css: {
            pre: {
              marginTop: em(32, 24),
              marginBottom: em(32, 24),
            },
          },
        },
        dark: {
          css: {
            color: theme("colors.trueGray.200"),
            h1: {
              color: theme("colors.trueGray.100"),
            },
            h2: {
              color: theme("colors.trueGray.100"),
            },
            h3: {
              color: theme("colors.trueGray.100"),
            },
            h4: {
              color: theme("colors.trueGray.100"),
            },
            h5: {
              color: theme("colors.trueGray.100"),
            },
            h6: {
              color: theme("colors.trueGray.100"),
            },
            blockquote: {
              color: theme("colors.trueGray.100"),
            },
            strong: {
              color: theme("colors.trueGray.100"),
            },
            code: {
              backgroundColor: theme("colors.trueGray.800"),
            },
            pre: {
              backgroundColor: theme("colors.trueGray.800"),
              color: theme("colors.trueGray.100"),
            },
          },
        },
      }),
      maxWidth: {
        prose: '70ch',
      },
    },
  },
  variants: {
    extend: {
      typography: ["dark"],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
