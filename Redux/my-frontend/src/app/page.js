"use client";

import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";

export default function Home() {
  const themeMode = useSelector((state) => state.appthemeData.Apptheme) || "light";
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
