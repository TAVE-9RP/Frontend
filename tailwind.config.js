export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      colors: {
        mainColor: {
          blue050: '#E2F1FF',
          blue100: '#B9DBFF',
          blue200: '#8AC6FF',
          blue300: '#58AFFF',
          blue400: '#2E9DFF',
          blue500: '#008CFF',
          blue600: '#007EF4',
          blue700: '#106CE1',
          blue800: '#145ACD',
          blue900: '#193AAF',
        },
        subColor: {
          orange050: '#FFF9E5',
          orange100: '#FFEEBC',
          orange200: '#FFEB94',
          orange300: '#FFDC6C',
          orange400: '#FFD154',
          orange500: '#FFCA4A',
          orange600: '#FFBC46',
          orange700: '#FFAB41',
          orange800: '#FF9B3F',
          orange900: '#FF803B',
        },
        greyColor: {
          grey50: '#FDFDFD',
          grey100: '#F7F8F9',
          grey200: '#E9EBEE',
          grey300: '#C5C8CE',
          grey400: '#A0A2AA',
          grey500: '#777981',
          grey600: '#63656C',
          grey700: '#44454D',
          grey800: '#22242B',
          grey900: '#131517',
        },
        errorColor: {
          red010: '#FF2935',
          red020: '#C2000B',
        },
        semanticColor: {
          green100: '#DDF8EF',
          green500: '#0CA678',
        },
      },
    },
  },
  plugins: [],
};
