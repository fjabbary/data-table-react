# Task Management Component README

This React component (`TaskManagement`) provides a user interface for viewing and managing a list of tasks. It fetches user data from an API, displays tasks in a sortable table, allows editing of task details (title, description, status, due date), and manages task assignees.

## Features

* **Task Display:** Presents tasks in a clear, bordered table with columns for ID, Title/Description, Status, Due Date, Assignees, Tags, Updated At, and Documentation Link.
* **Data Fetching:** Fetches user data from `http://localhost:3000/api/users`.
* **Local Storage:** Persists task data in the browser's local storage to maintain state across sessions.
* **Sorting:** Allows sorting of tasks by clicking on table headers (ID, Title, Status, Due Date, Updated At). An arrow icon indicates sort direction.
* **Inline Editing:** Enables inline editing of task title, description, status, and due date by clicking on the respective table cells.
    * **Title and Description:** Editable text input fields appear on click. Changes are saved on blur.
    * **Status:** A dropdown menu allows changing the task status (To Do, In Progress, Done, Blocked).
    * **Due Date:** A date picker input allows selecting a new due date.
* **Assignee Management:**
    * A "Users" dropdown allows adding assignees to a task.
    * For tasks with multiple assignees, a badge shows the number of additional assignees, and a tooltip displays the full list on hover.
    * A remove ("X") button next to each assignee in the tooltip allows removing them from the task.
* **Visual Feedback:** Uses `react-toastify` to display success and info messages for actions like adding/removing assignees and updating tasks.
* **Styling:** Utilizes React Bootstrap components for layout and basic styling, and a custom `StyledTooltip` for the assignee tooltip.

## Technologies Used

* React
* React Bootstrap (`react-bootstrap`)
* React Icons (`react-icons`) (for the sort arrows)
* React Toastify (`react-toastify`)
* Styled Components (`styled-components`) (for custom tooltip styling)

## Setup and Usage

1.  **Prerequisites:**
    * Node.js and npm (or yarn) installed on your development machine.
    * A backend server running at `http://localhost:3000/api/users` that serves user data in a JSON format (an array of user objects with `id`, `name`, and `imgURL` properties).

2.  **Installation:**
    * Navigate to your project directory in the terminal.
    * Install the required dependencies:
        ```bash
        npm install react react-bootstrap react-icons react-toastify styled-components
        # or
        yarn add react react-bootstrap react-icons react-toastify styled-components
        ```

3.  **Component Integration:**
    * Import the `TaskManagement` component into your desired parent component:
        ```javascript
        import TaskManagement from './path/to/TaskManagement';
        ```
    * Render the `TaskManagement` component within your parent component's JSX:
        ```javascript
        function App() {
          return (
            <div>
              {/* Other components */}
              <TaskManagement />
              {/* Other components */}
            </div>
          );
        }
        ```

4.  **Styling:**
    * Ensure you have the necessary CSS for React Bootstrap and `react-toastify` included in your project (usually in your main `index.js` or `App.js` file):
        ```javascript
        import 'bootstrap/dist/css/bootstrap.min.css';
        import 'react-toastify/dist/ReactToastify.css';
        ```
    * Make sure the `styled.js` file (where `StyledTooltip` is defined) is correctly implemented and located in the `./styled` directory.

## Component State

* `tasks`: An array of `Task` objects. Initialized with mock data or data from local storage. Updated with task modifications.
* `users`: An array of `User` objects fetched from the API.
* `showTooltip`: A boolean to control the visibility of the assignee tooltip.
* `editTaskId`: The ID of the task currently being edited (can be `null`).
* `selectedTask`: The `Task` object that is currently being edited.
* `editField`: A string indicating the specific field being edited ('title', 'description', 'status', 'due-date').

## Functions

* `formatDate(dateString)`: Formats a date string into a user-friendly short month, day, year format (e.g., "May 18, 2025").
* `handleAddAssignee(task, user)`: Adds a user as an assignee to a specific task. Prevents duplicate assignments.
* `handleDeleteAssignee(task, user)`: Removes a user from the assignees of a specific task.
* `handleSortById(header)`: Sorts the tasks array based on the clicked table header (ID, Title, Status, Due Date, Updated At).
* `editTask(taskId, field)`: Sets the `editTaskId` and `editField` to enable inline editing for a specific task and field.
* `handleChange(e)`: Updates the `selectedTask` state with changes from the input fields during editing.
* `handleBlur(e)`: Saves the changes made to the task title or description when the input field loses focus.
* `handleStatusChange(eventKey, TaskId)`: Updates the status of a specific task based on the selected value from the status dropdown.
* `handleDateChange(e, taskId)`: Updates the due date of a specific task based on the selected date from the date input.

## Notes

* The component relies on a backend API running at `http://localhost:3000/api/users` to provide user data. Ensure this API is accessible.
* Task data is persisted in the browser's local storage. This means that task updates will be saved across browser sessions for the same user on the same device.
* The sorting functionality is basic and performs a client-side sort on the currently loaded tasks. For large datasets, server-side sorting might be more efficient.
* The styling is primarily based on React Bootstrap's default styles. You can further customize the appearance by adding your own CSS or using Styled Components.