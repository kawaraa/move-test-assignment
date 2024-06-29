import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import TaskManager from "@/components/TaskManager";
let tasks = [
  { id: "1", title: "First Task", description: "This is the first task" },
  { id: "2", title: "Second Task", description: "This is the second task" },
];

describe("TaskManager", () => {
  test("renders the TaskManager component", async () => {
    fetch.mockResponseOnce(JSON.stringify(tasks));

    render(<TaskManager />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
      expect(screen.getByText("Add Task")).toBeInTheDocument();
    });
  });

  test("adds a new task", async () => {
    fetch.mockResponses(
      [JSON.stringify([]), { status: 200 }],
      [JSON.stringify({ id: "1", title: "New Task", description: "New Description" }), { status: 200 }]
    );

    render(<TaskManager />);

    fireEvent.change(screen.getByPlaceholderText("Title"), { target: { value: "New Task" } });
    fireEvent.change(screen.getByPlaceholderText("Description"), { target: { value: "New Description" } });
    fireEvent.click(screen.getByText("Add Task"));

    await waitFor(() => {
      expect(screen.getByText("New Task")).toBeInTheDocument();
      expect(screen.getByText("New Description")).toBeInTheDocument();
    });
  });

  test("edits a task", async () => {
    fetch.mockResponses(
      [JSON.stringify([{ id: "1", title: "Task 1", description: "Description 1" }]), { status: 200 }],
      [
        JSON.stringify({ id: "1", title: "Updated Task", description: "Updated Description" }),
        { status: 200 },
      ]
    );

    render(<TaskManager />);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByPlaceholderText("Title"), { target: { value: "Updated Task" } });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Updated Description" },
    });
    fireEvent.click(screen.getByText("Update Task"));

    await waitFor(() => {
      expect(screen.getByText("Updated Task")).toBeInTheDocument();
      expect(screen.getByText("Updated Description")).toBeInTheDocument();
    });
  });

  test("deletes a task", async () => {
    fetch.mockResponses(
      [JSON.stringify([{ id: "1", title: "Task 1", description: "Description 1" }]), { status: 200 }],
      [JSON.stringify({}), { status: 200 }]
    );

    render(<TaskManager />);

    await waitFor(() => {
      expect(screen.getByText("Task 1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    });
  });

  test("shows error when adding a task without title or description", async () => {
    render(<TaskManager />);

    fireEvent.click(screen.getByText("Add Task"));

    await waitFor(() => {
      expect(
        screen.getByText("Error adding task: 'title' and 'description' is required field")
      ).toBeInTheDocument();
    });
  });
});
