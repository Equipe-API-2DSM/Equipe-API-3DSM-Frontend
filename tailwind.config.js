/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary50: "#FFD501", // Amarelo principal
        primary98: "#FFF6CC",
        primary91: "#FFF6CF",
        primary20: "#675600",
        "complementary-20": "#001268", // Azul complementar
        error: "#F73131",
        bg98: "#F3F4FF", // Azul clarinho
        bg15: "#0E1420", // Azul escuro
        bg22: "#132431", // Azul médio
        bg100: "#FFF", // branco
        "hover-bg22": "#192F40",
        "on-primary": "#191919", // Em fundo da cor primária
        "on-light": "#191919", // Em fundos claros (branco, azul clarinho)
        "on-bg22": "#DADDE6", // Em fundo azul médio
        n90: "#E6E6E6",
        n70: "#B3B3B3",
        n40: "#666666",
        n20: "#343434",
      },
    },
  },
  plugins: [],
}
