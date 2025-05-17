import { useState, useEffect } from 'react';
import { initialMockTasks } from '../data/data';
import Table from 'react-bootstrap/Table';
import type { Task, User } from '../data/type';
import Badge from 'react-bootstrap/Badge';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Stack from 'react-bootstrap/Stack';
import { UserImg } from '../styled';
import { toast } from 'react-toastify';

function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>(initialMockTasks)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  console.log('tasks==>');
  console.log(tasks);
  console.log('users==>');
  console.log(users);

  const initialHeaders = tasks.length > 0 ? Object.keys(tasks[0]).filter(key => key !== 'progress' && key !== 'description' && key !== 'priority' && key !== 'storyPoints' && key !== 'createdAt') as (keyof Task)[] : [];

  const [headers, _] = useState(() => {
    return initialHeaders.map(header => {
      if (header === 'documentationLink') {
        return 'Documentation';
      }
      else if (header === 'dueDate') {
        return 'Due Date'
      } else if (header === 'updatedAt') {
        return 'Updated At';
      }
      return header;
    });
  });

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  const handleUserClick = () => {
    alert('selected')
  }

  return (
    <Table bordered hover>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} style={{ whiteSpace: 'nowrap' }}>{header.charAt(0).toUpperCase() + header.slice(1)}</th>
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
                style={{ fontWeight: 'normal' }}
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
            <td style={{ whiteSpace: 'nowrap' }}><small> {task.dueDate ? formatDate(task.dueDate) : 'N/A'}</small></td>
            <td>
              {[DropdownButton].map((DropdownType, idx) => (
                <DropdownType
                  as={ButtonGroup}
                  key={idx}
                  id={`dropdown-button-drop-${idx}`}
                  size="sm"
                  variant="light"
                  title={selectedUsers.length > 0 ? users[0].name : 'Assignee'}
                >
                  {
                    users.map(user => (
                      <Stack direction="horizontal" gap={3} key={user.id}>
                        <Dropdown.Item eventKey={user.id} onClick={() => handleUserClick()}>
                          <UserImg src={user.imgURL ? user.imgURL : 'https://www.shutterstock.com/image-vector/grey-person-icon-business-vector-260nw-2178945117.jpg'} alt={user.name} />
                          <span>{user.name}</span>
                        </Dropdown.Item>
                      </Stack>
                    ))
                  }
                </DropdownType>
              ))}
            </td>
            <td>
              {task.tags.map(tag => (<Badge bg="light" className='m-1' style={{ fontWeight: 'normal', color: 'black' }}>{tag}</Badge>))}
            </td>
            <td><small>{formatDate(task.updatedAt)}</small></td>
            <td> 📂 <a target='_blank' style={{ textDecoration: 'none' }} href={task.documentationLink}>{task.documentationLink.substring(task.documentationLink.lastIndexOf('/') + 1)}</a> </td>

          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default TaskManagement