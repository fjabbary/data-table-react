import { useState } from 'react';
import { initialMockTasks } from '../data/data';
import Table from 'react-bootstrap/Table';
import type { Task } from '../data/type';
import Badge from 'react-bootstrap/Badge';

function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>(initialMockTasks)
  const headers = Object.keys(tasks[0]).filter(key => key !== 'progress' && key !== 'description' && key !== 'priority') as (keyof Task)[]
  console.log(headers);

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  return (
    <Table bordered hover>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header.charAt(0).toUpperCase() + header.slice(1)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tasks.map(task => (
          <tr key={task.id}>
            <td>{task.id}</td>
            <td>
              <p className='m-0'>{task.title}</p>
              <small className='text-muted'>{task.description}</small>
            </td>
            <td>
              <Badge
              bg={
                task.status === 'Done'
                  ? 'success'
                  : task.status === 'In Progress'
                  ? 'warning'
                  : task.status === 'Blocked'
                  ? 'danger'
                  : 'primary'
              }
              >{task.status}</Badge>
            </td>
            <td style={{ whiteSpace: 'nowrap' }}>{task.dueDate ? formatDate(task.dueDate) : 'N/A'}</td>
            <td>
              
            </td>




          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default TaskManagement