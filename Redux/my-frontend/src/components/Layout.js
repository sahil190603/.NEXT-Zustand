"use client";

import React from "react";
import PropTypes from "prop-types";
import { usePathname, useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  IconButton,
  ThemeProvider,
  createTheme,
  Switch,
  FormControlLabel,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import { MdMenuOpen } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setApptheme } from "../Redux/feature/AppthemeSlice";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const NAVIGATION = [
  {
    key: "Dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    path: "/",
  },
  {
    key: "Task",
    title: "Task",
    icon: <FaTasks />,
    path: "/task",
  },
];

function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const themeMode =
    useSelector((state) => state.appthemeData.Apptheme) || "light";
  const [drawerOpen, setDrawerOpen] = React.useState(true);
  const drawerWidth = drawerOpen ? 190 : 60;

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    const newTheme = themeMode === "dark" ? "light" : "dark";
    dispatch(setApptheme(newTheme));
  };

  const getSelectedKey = () => {
    const selectedKey =
      NAVIGATION.find((nav) => nav.path === pathname)?.key || "";
    return selectedKey;
  };

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "#1976d2",
      },
      background: {
        default: themeMode === "dark" ? "#121212" : "#ffffff",
        paper: themeMode === "dark" ? "#1e1e1e" : "#f9f9f9",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: themeMode === "dark" ? "#333" : "#0958d9",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ marginRight: 2 }}
            >
              {drawerOpen ? <MdMenuOpen /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              Resume Analyzer
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={themeMode === "dark"}
                  onChange={toggleTheme}
                  color="default"
                />
              }
              label={
                themeMode === "dark" ? (
                  <DarkModeIcon style={{ marginTop: "7px" }} />
                ) : (
                  <LightModeIcon style={{ marginTop: "7px" }} />
                )
              }
            />
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            transition: "width 0.3s",
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              overflowX: "hidden",
              transition: "width 0.3s",
              backgroundColor: themeMode === "dark" ? "#1e1e1e" : "#e6f4ff",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {NAVIGATION.map((item) => {
                const isSelected = getSelectedKey() === item.key;
                return (
                  <ListItem
                    key={item.key}
                    selected={isSelected}
                    onClick={() => router.push(item.path)}
                    sx={{
                      justifyContent: drawerOpen ? "flex-start" : "center",
                      padding: drawerOpen ? "8px 16px" : "8px",
                      backgroundColor: isSelected
                        ? themeMode === "dark"
                          ? "#444"
                          : "#bae0ff"
                        : "transparent",
                      "&:hover": {
                        backgroundColor: isSelected
                          ? themeMode === "dark"
                            ? "#555"
                            : "#cce7ff"
                          : themeMode === "dark"
                          ? "#444"
                          : "#f0f0f0",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        marginRight: drawerOpen ? "16px" : "0",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {drawerOpen && <ListItemText primary={item.title} />}
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: "auto",
            backgroundColor: (theme) => theme.palette.background.default,
          }}
        >
          <Toolbar />
          <Box sx={{ flexGrow: 1, display: "block" }}>{children}</Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
