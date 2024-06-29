"use client";

import React, { useEffect, useState } from "react";
import { Task } from "@/types/task";
import styled from "@emotion/styled";

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const headers = { "Content-Type": "application/json" };

  const validateTask = (title: string, description: string) => {
    if (!title || !description || !title.trim() || !description.trim()) {
      throw new Error("'title' and 'description' is required field");
    }
    return true;
  };

  const handleError = (errorType: string, error: any) => {
    if (error instanceof Error) setError(errorType + ": " + error.message);
    else setError(errorType + ": " + error);
  };

  const callApi = (method: string, body: string | null, headers?: any) => {
    return fetch("/api/tasks", { method, headers, body }).then((res) => res.json());
  };

  const handleAddTask = async () => {
    try {
      validateTask(title, description);
      const newTask = await callApi("POST", JSON.stringify({ title, description }), headers);
      setTasks([...tasks, newTask]);
      setTitle("");
      setDescription("");
    } catch (error) {
      handleError("Error adding task", error);
    }
  };

  const handleEditTask = (id: string) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setEditingTaskId(id);
    }
  };

  const handleUpdateTask = async () => {
    try {
      validateTask(title, description);
      await callApi("PUT", JSON.stringify({ id: editingTaskId, title, description }), headers);
      const copyTasks = [...tasks];
      const index = copyTasks.findIndex((task) => task.id === editingTaskId);
      copyTasks[index] = { ...copyTasks[index], title, description };

      setTasks(copyTasks);
      setTitle("");
      setDescription("");
      setEditingTaskId(null);
    } catch (error) {
      handleError("Error updating task", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      if (!id) throw new Error("'ID' is required");
      await callApi("DELETE", JSON.stringify({ taskId: id }), headers);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      handleError("Error deleting task", error);
    }
  };

  useEffect(() => {
    callApi("GET", null)
      .then((data) => setTasks(data))
      .catch((error) => handleError("Error fetching tasks:", error));
  }, []);

  return (
    <Container>
      <InputWrapper>
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </InputWrapper>
      <InputWrapper>
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </InputWrapper>

      {error && (
        <ErrorHolder>
          {error} <CloseError onClick={() => setError("")}>x</CloseError>
        </ErrorHolder>
      )}
      {editingTaskId ? (
        <Button onClick={handleUpdateTask}>Update Task</Button>
      ) : (
        <Button onClick={handleAddTask}>Add Task</Button>
      )}

      <TaskList>
        {tasks.map((task) => (
          <TaskItem key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>

            <ButtonsWrapper>
              <Button onClick={() => handleEditTask(task.id)}>Edit</Button>
              <Button onClick={() => handleDeleteTask(task.id)}>Delete</Button>
            </ButtonsWrapper>
          </TaskItem>
        ))}
      </TaskList>
    </Container>
  );
};

export default TaskManager;

const Container = styled.div`
  max-width: 500px;
  margin: auto;
`;

const InputWrapper = styled.div`
  position: relative;
  max-width: 500px;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 15px;
  border: 2px solid #ccc;
  border-radius: 25px;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  color: #333;

  &::placeholder {
    color: #aaa;
    transition: all 0.3s ease;
  }

  &:focus {
    border-color: #007bff;
    box-shadow: 0 6px 8px rgba(0, 123, 255, 0.2);
    background-color: #eaf4ff;

    &::placeholder {
      color: #007bff;
      opacity: 0.8;
    }
  }
`;
const ErrorHolder = styled.p`
  margin-top: 10px;
  color: red;
`;
const CloseError = styled.span`
  display: inline-block;
  color: initial;
  font-size: 20px;
  cursor: pointer;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: right;
`;
const Button = styled.button`
  margin: 10px 8px;
  display: inline-block;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  border: 2px solid #007bff;
  color: #007bff;
  background-color: transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;

  &:hover,
  &:focus {
    background-color: #007bff;
    color: #fff;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const TaskList = styled.ul`
  list-style: none;
  margin: 0;
`;

const TaskItem = styled.li`
  text-align: initial;
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 4px;
`;
