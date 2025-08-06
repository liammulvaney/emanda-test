# Full Stack Engineering Challenge

## Scenario

You’ve joined a growing software company that’s building a lightweight task management tool. The application already supports creating and displaying tasks, and the backend supports nested (self-referencing) tasks through a parent-child relationship.

Your job is to extend the application’s functionality to enable users to **create subtasks via the UI**, and extend the backend API to retrieve subtasks on demand.

This task is designed to assess your ability to work with a real-world React + NestJS codebase, understand context quickly, and deliver clean, functional improvements.

---

## Tech Stack

This application is built with:

- **Frontend**: React (with TypeScript + Context API)
- **Backend**: NestJS (with TypeORM and SQLite)
- **Database**: SQLite (in-memory)
- **Containerisation**: Docker + Docker Compose
- **Build Tools**: Vite (frontend), Nest CLI (backend)

---

## What’s Included

- `frontend/` — React app that renders and creates top-level tasks.
- `backend/` — NestJS API that supports nested tasks via a self-referencing entity.
- `docker-compose.yml` — launches both services together.
- `nginx.conf` — proxies API calls from frontend to backend.
- `README.md` — this file.

---

## What Works Now

- You can **add top-level tasks** from the UI.
- Tasks (and their nested subtasks) are displayed recursively.
- Tasks are saved via the backend into an in-memory SQLite database.
- API routes:
  - `GET /api/tasks` — fetch all tasks with nested subtasks
  - `POST /api/tasks` — create a task (optionally with `parentId`)

---

## Your Challenge

To update both frontend and backend to do the following:

### Frontend

- Add UI controls to allow users to create subtasks under any existing task.
- Wire these to the backend using the existing `createTask(title, parentId)` API call.
- Ensure newly created subtasks appear nested under their parent task.

### Backend

- Add a new route to the NestJS backend:
  - `GET /api/tasks/:id/subtasks`
- This should return all tasks where the `parentId` matches the given `id`.
- Implement the corresponding service method in `TasksService`.

You may use TypeORM relations to perform the query. Keep the structure clean and RESTful.

---

## 🧪 Getting Started

### 1. Build the project

```bash
docker-compose up --build
```
for versions > 1.29.2:

```bash
docker compose up --build
```

This starts:
- React frontend on [http://localhost:8080](http://localhost:8080)
- NestJS backend on [http://localhost:3000](http://localhost:3000) (proxied via NGINX)

### 2. Add tasks via UI and verify that tasks render correctly.

---

## Submission

This task is intentionally designed to be focused and time-efficient. We expect that it should take no more than 2 to 4 hours, including time to record a brief walkthrough and reflect on improvements.

When you're done, please submit:

- A link to your Git repo.
- A short description of what you implemented and why (this can be as simple as updating this very README).
- A short video walkthrough describing your solution, key decision points, and the code structure.
- A brief roadmap outlining what you would improve or expand on with more time.

---

## Questions?

Feel free to clarify anything by reaching out to the team.


## Description of Implementation

So, based on the questions, I implemented both the endpoint in the backend and the front end changes to accomodate the infinite task generator. If you open ```tasks.service.ts``` in the backend project, you'll notice that there is logic commented out. I'd like it if you consider those functions as part of my submission, as they do work. However, I had an issue with the front end (as I generated a button to hide tasks as a small improvement). So, to resolve that issue I reworked the logic using TypeORM query builder. Why? I wanted to generate a count field which calculates how many subtasks the queried task has. I consider this the best approach because, the column is calculated, whilst the data is being retrieved and not after the data is fetched. Based on this new column, the UI is also cleaner. 

In the front end I reused the task item component to render subtasks in a recursive manner. I've added an api call which retrieves the subtasks, which is ```getSubtasksByParentId(parentId: number)```. This communicates with the requested endpoint `GET /api/tasks/:id/subtasks`. The show hide subtasks button calls the backend to retrieve the sub task data, based on its own id. I also reworked logic from the TaskContext.tsx by rewriting lines like fetchTasks().then(setTasks) to:

```script
const tasks = await fetchTasks()
setTasks(tasks)
```
Although longer, previous line, had issues when rendering the tasks after they were created. So sometimes, generated tasks disappeared. 
Also, I took the liberty of implementing a validator inside a function I rewrote: 

```script
  const handleAddTask = async (title: string) => {
    if (!title.trim()) {
      showErrMessage('You are attempting to create a task without a title.');
      return;
    }
    showErrMessage('');
    await addTask(title); // before, we had these two lines
    setTitle('');
  }
```

This function stops users from generating empty task titles. 

The subtasks are handled with these hooks: 

```{ tasks, addTask, getSubtasksByParentId } = useTasks(),
   [localSubtasks, setLocalSubtasks] = useState<Task[]>([]);
```

when subtasks are retrieved by the ```getSubtasksByParentId```, the react component state is updated with setLocalSubtasks. The localSubtasks are then used to map the subtasks on the UI in the following lines of code:

```script
{showSubtasks && (
  <div>
    {localSubtasks.map((s) => (
      <TaskItem key={s.id} task={s} />
    ))}
  </div>
)}
```

Thank you for taking the time to read this.

