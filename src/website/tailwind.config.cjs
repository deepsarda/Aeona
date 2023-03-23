/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: ["./views/**/*.ejs"]
  },
  theme: {
    extend: {}
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
  
  daisyui: {
    styled: true,
    themes: ["night"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark"
  }
};
