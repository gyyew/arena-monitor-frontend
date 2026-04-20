/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#CE88FF',
          light: '#E8C6FF',
          bg: '#F5EBFF',
        },
        btn: {
          main: '#F3EC46',
          light: '#FBF8B3',
        },
        danger: '#F964C2',
        warning: '#38CEC4',
        success: '#67E0A3',
        link: '#B38DFF',
        text: {
          title: '#2A2438',
          main: '#443B58',
          secondary: '#8A80A0',
          light: '#B4A8CC',
        },
        bg: {
          page: '#FCFAFF',
          card: '#FFFFFF',
          hover: '#F1E8FF',
        },
        border: '#E2D5F5',
      },
      borderRadius: {
        'card': '18px',
        'btn': '24px',
        'input': '12px',
      },
      spacing: {
        '4.5': '18px',
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft Yahei"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(206, 136, 255, 0.12)',
        'btn': '0 4px 12px rgba(243, 236, 70, 0.35)',
        'glow': '0 0 20px rgba(206, 136, 255, 0.3)',
      },
    },
  },
  plugins: [],
}
