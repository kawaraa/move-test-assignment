let tasks = [
  { id: "1", title: "First Task", description: "This is the first task" },
  { id: "2", title: "Second Task", description: "This is the second task" },
];

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(req: Request, res: Response) {
  return Response.json(tasks, { status: 201 });
}
export async function POST(req: Request, res: Response) {
  const { title, description } = await req.json();
  const newTask = {
    id: crypto.randomUUID(),
    title,
    description,
  };

  tasks.push(newTask);
  return Response.json(newTask, { status: 201 });
}
export async function PUT(req: Request, res: Response) {
  const { id, title, description } = await req.json();
  const index = tasks.findIndex((task) => task.id === id);
  tasks[index] = { ...tasks[index], title, description };
  return Response.json({ message: "Task updated successfully" }, { status: 200 });
}
export async function DELETE(req: Request, res: Response) {
  const { taskId } = await req.json();
  tasks = tasks.filter((task) => task.id !== taskId);
  return Response.json({ message: "Task deleted successfully" }, { status: 200 });
}
