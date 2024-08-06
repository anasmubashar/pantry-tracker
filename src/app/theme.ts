"use client";
import { Sora } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const sora = Sora({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: sora.style.fontFamily,
  },
  // palette: {
  //     primary: {
  //     main: '#1976d2',
  //     light: '#4791db',
  //     dark: '#115293',

  //     gray: '#f5f5f5',
  //     },
  //     secondary: {
  //     main: '#dc004e',
  //     },
  // },
});

export default theme;
