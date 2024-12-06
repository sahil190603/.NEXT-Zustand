"use client";

import Layout from "../components/Layout";
import { Typography } from "@mui/material";
// import useAppThemeStore from "@/Zustad/Store";

export default function Home() {
  // const themeMode = useAppThemeStore((state) => state.appthemeData.theme); 
  return (
    <Layout>
      <>
      <Typography variant="h6" gutterBottom>
        Dashboard
      </Typography>
      </>
    </Layout>
  );
}
