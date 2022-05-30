module.exports = {
  content: ["./dashboard/**/*.{html,ejs}"],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#E96D7B",

          secondary: "#88DCDD",

          accent: "#88DCDD",

          neutral: "#f9a8d4",

          "base-100": "#f0d6e8",

          info: "#53C0F3",

          success: "#71EAD2",

          warning: "#F3CC30",

          error: "#E24056",
        },
      },
    ],
  },
  theme: {
    extend: {
      animation: {
        "bounce-slow": "bounce 3s infinite;",
        sparkles: "brightness 4s infinite",
        avatar: "4s ease 0s infinite normal none running pulse_green",
      },
      backdropFilter: {
        none: "none",
        blur: "blur(20px)",
      },
      keyframes: {
        brightness: {
          "0%": { filter: "brightness(100%)" },
          "25%": { filter: "brightness(150%)" },
          "50%": { filter: "brightness(120%)" },
          "75%": { filter: "brightness(60%)" },
          "100%": { filter: "brightness(100%)" },
        },
        pulse_green: {
          "0%": {
            transform: "scale(0.95)",
            "box-shadow": "rgba(0, 0, 0, 0.17) 0px 0px 40px;",
          },
          "70%": {
            transform: "scale(1.05)",
            "box-shadow": "rgba(0, 0, 0, 0.17) 0px 0px 60px",
          },
          "100%": {
            transform: "scale(0.95)",
            "box-shadow": "rgba(0, 0, 0, 0.17) 0px 0px 40px;",
          },
        },
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
    require("tailwindcss-animatecss")({
      settings: {},
      variants: ["responsive", "hover", "reduced-motion"],
    }),
  ],
};
