import { useState, useEffect, useRef } from 'react';
import { initialMockTasks } from '../data/data';
import Table from 'react-bootstrap/Table';
import type { Task, User } from '../data/type';
import Badge from 'react-bootstrap/Badge';
import { StyledTooltip } from '../styled';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Stack from 'react-bootstrap/Stack';
import { UserImg } from '../styled';
import { toast } from 'react-toastify';
import Overlay from 'react-bootstrap/Overlay';

function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>(initialMockTasks)
  const [users, setUsers] = useState<User[]>([])
  const [showAssignees, setShowAssignees] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const target = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  // console.log('tasks==>');
  // console.log(tasks);
  // console.log('users==>');
  // console.log(users);

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

  const handleAddAssignee = (task: Task, user: User) => {
    setTasks(prevTasks =>
      prevTasks.map(item => {
        if (item.id === task.id) {
          // Check if the user is already in the assignee array
          if (!item.assignee?.some(assignee => assignee.id === user.id)) {
            const updatedTask = { ...item, assignee: [...(item.assignee || []), user] };
            toast.success(`${user.name} added as assignee`);
            return updatedTask;
          } else {
            toast.info(`${user.name} is already assigned to this task.`);
            return item;
          }
        }
        return item;
      })
    );
  };

  const handleDeleteAssignee = (task: Task, user: User) => {
    setTasks(prevTasks =>
      prevTasks.map(item => {
        if (item.id === task.id) {
          const updatedTask = { ...item, assignee: item.assignee?.filter(assignee => assignee.id !== user.id) };
          toast.error(`${user.name} removed from assignee`);   
          return updatedTask;
        }
        return item;
      })
    );
  };
  
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
                  variant="info"
                  title="Users"
                >
                  {
                    users.map(user => (
                      <Stack direction="horizontal" gap={3} key={user.id}>
                        <Dropdown.Item eventKey={user.id} onClick={() => handleAddAssignee(task, user)}>
                          <UserImg src={user.imgURL ? user.imgURL : 'https://www.shutterstock.com/image-vector/grey-person-icon-business-vector-260nw-2178945117.jpg'} alt={user.name} />
                          <span>{user.name}</span>
                        </Dropdown.Item>
                      </Stack>
                    ))
                  }
                </DropdownType>
              ))}

              {task.assignee.length === 1 && <div style={{ whiteSpace: 'nowrap' }}><small>{task.assignee[0].name}</small></div>}
              {task.assignee.length > 1 && (
                <div>{task.assignee[0].name} <Badge style={{ cursor: 'pointer' }} ref={target} bg='success' onClick={() => setShowTooltip(!showTooltip)}>  +{task.assignee.length - 1} </Badge> </div>
              )}
              <Overlay target={target.current} show={showTooltip} placement="right" >
                {(props) => (

                  <StyledTooltip id="overlay-example" {...props}>
                    {task.assignee.slice(1,).map(assignee => (
                      <div key={assignee.id} className='d-flex align-items-center justify-content-between p-1 mb-2' style={{borderRight: '3px solid green', boxShadow: '0 0 5px rgba(0,0,0,0.5)'}}>
                        <div className='m-1' style={{ fontWeight: 'normal', color: 'black' }}> <UserImg src={assignee.imgURL ? assignee.imgURL : 'https://www.shutterstock.com/image-vector/grey-person-icon-business-vector-260nw-2178945117.jpg'} alt={assignee.name} /> {assignee.name}</div>
                        <span style={{ cursor: 'pointer' }} className='p-1 text-danger' onClick={() => handleDeleteAssignee(task, assignee)}>X</span>
                      </div>
                    ))}
                  </StyledTooltip>
                )}
              </Overlay>

            </td>
            <td>
              {task.tags.map((tag, index) => (<Badge key={index} bg="light" className='m-1' style={{ fontWeight: 'normal', color: 'black' }}>{tag}</Badge>))}
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