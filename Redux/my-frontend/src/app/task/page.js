"use client";

import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { IoSearchOutline } from "react-icons/io5";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import axios from "axios";
import Task from "../../Forms/Task";
import { useSelector } from "react-redux";
import { Alert } from "@mui/material"
import { ToastContainer, toast } from 'react-toastify';

const BASEURL = "http://127.0.0.1:8000/";

const Page = () => {
  const themeMode = useSelector((state) => state.appthemeData.Apptheme) || "light";
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); 
  const [alertSeverity, setAlertSeverity] = useState(""); 

  const getTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASEURL}task/tasks/`);
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to fetch tasks!");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000); 
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    const filtered = tasks.filter((task) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        task.name?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.priority?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredTasks(filtered);
  }, [tasks, searchQuery]);

  const handleCreate = () => {
    setCurrentTask(null);
    setModalMode("create");
    setIsModalVisible(true);
  };

  const handleView = (task) => {
    setCurrentTask(task);
    setModalMode("view");
    setIsModalVisible(true);
  };

  const handleEdit = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    setCurrentTask(taskToEdit);
    setModalMode("edit");
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASEURL}task/tasks/${deleteTaskId}/`);
      setAlertSeverity("success");
      setAlertMessage("Task deleted successfully.");
      setTasks(tasks.filter((task) => task.id !== deleteTaskId));
      setIsDeleteModalVisible(false);
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage("Unable To Delete Task.");
      setTimeout(() => {
        setAlertMessage("");
      }, 3000);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeleteTaskId(null);
  };

  const handelTaskCreated = () => {
    getTasks();
  };

  return (
    <Layout>
      <Typography variant="h6" gutterBottom>
        Task Management
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={1}>
        <TextField
          placeholder="Search"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IoSearchOutline />
              </InputAdornment>
            ),
          }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            ".MuiOutlinedInput-root": {
              height: "30px", 
              width:"250px"
            }
          }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          sx={{ height:"30px", backgroundColor: themeMode === "dark" ? "#595959" : "#1677ff"
          }}
        >
          Create
        </Button>
      </Box>
      {alertMessage && (
        <Alert severity={alertSeverity}>
          {alertMessage}
        </Alert>
      )}
      {loading ? (
        <Box sx={{display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height:"60vh"}}>
        <CircularProgress />
          </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow                 
              sx={{
                  "& .MuiTableCell-root": {
                    textAlign: "center",
                  },
                }}>
                <TableCell ><strong>Task Name</strong></TableCell>
                <TableCell ><strong>Description</strong></TableCell>
                <TableCell ><strong>Priority</strong></TableCell>
                <TableCell ><strong>Status</strong></TableCell>
                <TableCell ><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}
                sx={{
                  "& .MuiTableCell-root": {
                    padding: "4px",
                    textAlign: "center",
                  },
                }}
          >
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleView(task)}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleEdit(task.id)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteTaskId(task.id);
                        setIsDeleteModalVisible(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={isDeleteModalVisible}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
              position: 'absolute',
              top: "33px", 
              width:"400px",
          },
      }}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        maxWidth="md"
        fullWidth
      >
        <Task
          taskData={currentTask}
          isViewMode={modalMode === "view"}
          isUpdateMode={modalMode === "edit"}
          closeModal={() => setIsModalVisible(false)}
          onTaskCreated={handelTaskCreated}
        />
      </Dialog>
      <ToastContainer style={{ marginBottom:"50px"}}/>
    </Layout>
  );
};

export default Page;
