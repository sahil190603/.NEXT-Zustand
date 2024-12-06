import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  message,
  Form,
  Input,
  DatePicker,
  Select,
  Tooltip,
  Button,
} from "antd";
import axios from "axios";
import dayjs from "dayjs"; 
import { toast } from 'react-toastify';

const Task = ({
  taskData,
  isViewMode = false,
  isUpdateMode = false,
  closeModal,
  onTaskCreated,
}) => {
  const [form] = Form.useForm();

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedAssign, setSelectedAssign] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [UserApproveleave, setUserApproveleave] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/project/projects-exclude-complete/`
        );
        setProjects(response.data);
      } catch (error) {
        message.error("Failed to fetch projects. Please try again.");
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/authapp/Users/"
        );
        setEmployees(response.data);
      } catch (error) {
        message.error("Failed to fetch employees. Please try again.");
      }
    };
    loadEmployees();
  }, []);

  useEffect(() => {
    if (taskData) {
      form.setFieldsValue({
        name: taskData.name,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        percentage_completed: taskData.percentage_completed,
        start_time: taskData.start_time ? dayjs(taskData.start_time) : null,
        end_time: taskData.end_time ? dayjs(taskData.end_time) : null,
        project: taskData.project,
        assigned_to: taskData.assigned_to,
      });
      setSelectedAssign(taskData.assigned_to ?? null);
      setTimeTaken(taskData.time_taken);
    } else {
      form.resetFields();
    }
  }, [taskData, form]);

  const fetchApprovedLeaveOfUser = async () => {
    if (selectedAssign !== null && selectedAssign !== undefined) {
      const response = await axios.get(
        `http://localhost:8000/LeaveManagement/approved_leave_requests_by_user/?userId=${selectedAssign}`
      );
      setUserApproveleave(response.data);
    }
  };

  useEffect(() => {
    fetchApprovedLeaveOfUser();
  }, [selectedAssign]);

  const disableDates = (current) => {
    if (current.isBefore(dayjs().startOf("day"))) {
      return true;
    }

    if (!UserApproveleave || UserApproveleave.length === 0) {
      return false;
    }
    const disabledDates = [];
    UserApproveleave.forEach((request) => {
      const start = dayjs(request.start_date);
      const end = dayjs(request.end_date);
      let date = start.clone();

      while (date.isSameOrBefore(end)) {
        disabledDates.push(date.format("YYYY-MM-DD"));
        date = date.add(1, "day");
      }
    });

    return disabledDates.includes(current.format("YYYY-MM-DD"));
  };

  const handleSubmit = async (values) => {
    const formattedValues = {
        ...values,
        created_by: 1,
    };

    const updatePayload = {
        ...formattedValues,
        start_time: values.start_time ? values.start_time.toISOString() : null,
        end_time: values.end_time ? values.end_time.toISOString() : null,
        assigned_to: selectedAssign,
    };

    try {
        if (isUpdateMode && taskData?.id) {
            await axios.put(
                `http://localhost:8000/task/tasks/${taskData.id}/`,
                updatePayload
            );
            toast.success("Task updated successfully");
        } else {
           await axios.post("http://localhost:8000/task/tasks/", formattedValues);
           toast.success("Task created successfully");
        }
        form.resetFields();
        closeModal();
        if (onTaskCreated) onTaskCreated();
    } catch (error) {
      toast.error(
            error.response?.data?.detail || "Operation failed. Please try again."
        );
    }
};

  return (
    <Row justify="center" align="middle">
      <Col xs={24} sm={20} md={24} lg={24}>
        <Card className="scroll-xy-container" style={{ border: "none" }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              name: "",
              description: "",
              priority: "",
              status: "",
              percentage_completed: "",
              start_time: "",
              end_time: "",
              project: null,
            }}
          >
            <h2 className="text-center">
              {isViewMode
                ? "View Task Details"
                : isUpdateMode
                ? "Update Task"
                : "Task Creation Form"}
            </h2>

            <Form.Item
              label="Task Name"
              name="name"
              rules={[{ required: true, message: "Please enter the task name" }]}
            >
              <Input placeholder="Task Name" disabled={isViewMode} />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input.TextArea
                placeholder="Task Description"
                disabled={isViewMode}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Priority" name="priority">
                  <Select
                    placeholder="Select Priority"
                    disabled={isViewMode}
                    allowClear
                    dropdownStyle={{ zIndex: 1400 }}
                  >
                    <Select.Option value="High">High</Select.Option>
                    <Select.Option value="Urgent">Urgent</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Status" name="status">
                  <Select
                    placeholder="Select Status"
                    disabled={isViewMode}
                    allowClear
                    dropdownStyle={{ zIndex: 1400 }}
                  >
                    <Select.Option value="NotStarted">
                      Not Started
                    </Select.Option>
                    <Select.Option value="InProgress">
                      In Progress
                    </Select.Option>
                    <Select.Option value="Completed">Completed</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Project" name="project">
                  <Select
                    placeholder="Select Project"
                    disabled={isViewMode}
                    allowClear
                    dropdownStyle={{ zIndex: 1400 }}
                  >
                    {projects.map((project) => (
                      <Select.Option key={project.id} value={project.id}>
                        {project.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Assigned To" name="assigned_to">
                  <Select
                    placeholder="Assigned To"
                    value={selectedAssign}
                    onChange={(value) => setSelectedAssign(value)}
                    disabled={isViewMode}
                    dropdownStyle={{ zIndex: 1400 }}
                  >
                    {employees.map((employee) => (
                      <Select.Option key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {isViewMode || isUpdateMode ? (
              <Row gutter={16}>
                <Col span={12}>
                  <Tooltip
                    title={
                      !selectedAssign
                        ? "Please select an assigned user first."
                        : ""
                    }
                  >
                    <Form.Item
                      label="Start Date"
                      name="start_time"
                      rules={[
                        {
                          required: true,
                          message: "Please select the start date",
                        },
                      ]}
                    >
                      <DatePicker
                        format="YYYY-MM-DD"
                        disabledDate={disableDates}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        disabled={isViewMode}
                        dropdownStyle={{ zIndex: 1400 }}
                      />
                    </Form.Item>
                  </Tooltip>
                </Col>
                <Col span={12}>
                  <Tooltip
                    title={
                      !selectedAssign
                        ? "Please select an assigned user first."
                        : ""
                    }
                  >
                    <Form.Item
                      label="End Date"
                      name="end_time"
                      rules={[
                        {
                          required: true,
                          message: "Please select the end date",
                        },
                      ]}
                    >
                      <DatePicker
                        format="YYYY-MM-DD"
                        disabledDate={disableDates}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        disabled={isViewMode}
                        dropdownStyle={{ zIndex: 1400 }}
                      />
                    </Form.Item>
                  </Tooltip>
                </Col>
              </Row>
            ) : null}

            {!isViewMode && (
              <Form.Item style={{ marginTop: "25px", textAlign: "right" }}>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{ width: "100%" }}
                >
                  {isUpdateMode ? "Update Task" : "Create Task"}
                </Button>
              </Form.Item>
            )}
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Task;
