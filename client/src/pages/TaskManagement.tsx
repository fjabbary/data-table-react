import { useState, useEffect, useRef, Fragment, useCallback } from 'react';
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
import { Form } from 'react-bootstrap';

function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>(localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks') || '') : initialMockTasks);
  const [users, setUsers] = useState<User[]>([])
  const [showTooltip, setShowTooltip] = useState(false);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task>({} as Task);
  const [editField, setEditField] = useState<String>('')

  const target = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks])

  const initialHeaders = tasks.length > 0 ? Object.keys(tasks[0]).filter(key => key !== 'progress' && key !== 'description' && key !== 'priority' && key !== 'storyPoints' && key !== 'createdAt') as (keyof Task)[] : [];

  const [headers, _] = useState(() => {
    return initialHeaders.map(header => {
      if (header === 'documentationLink') {
        return { display: 'Documentation', key: 'documentationLink' };
      }
      else if (header === 'dueDate') {
        return { display: 'Due Date', key: 'dueDate' };
      } else if (header === 'updatedAt') {
        return { display: 'Updated At', key: 'updatedAt' };
      }
      return { display: header.charAt(0).toUpperCase() + header.slice(1), key: header };
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

  // Sorts the tasks by the selected header
  const handleSortById = (header: keyof Task) => {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (header === 'id') {
        return a.id - b.id;
      } else if (header === 'title') {
        return a.title.localeCompare(b.title);
      } else if (header === 'status') {
        return a.status.localeCompare(b.status);
      } else if (header === 'dueDate') {
        return new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
      } else if (header === 'updatedAt') {
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      return 0;
    });
    setTasks(sortedTasks);
    toast.info(`Sorted by ${header.charAt(0).toUpperCase() + header.slice(1)}`);
  }

  const editTask = useCallback((taskId: number, field: String) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    setEditTaskId(taskId);
    setEditField(field);
    setSelectedTask(taskToEdit || ({} as Task));
  }, [tasks, setEditTaskId, setEditField, setSelectedTask]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedTask(prevTask => ({ ...prevTask, [name]: value }));
  }, [setSelectedTask]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === editTaskId) {
          const updatedTask = name === 'title' ? { ...task, title: selectedTask.title, updatedAt: new Date().toISOString() } : { ...task, description: selectedTask.description, updatedAt: new Date().toISOString() }
          toast.success(`Task with ID ${task.id} updated`);
          return updatedTask;
        }
        return task;
      })
    );
    setEditTaskId(null);
  }, [setTasks, editTaskId, selectedTask, toast]);

  const handleStatusChange = useCallback((eventKey: any, TaskId: Number) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === TaskId) {
          const updatedTask = { ...task, status: eventKey, updatedAt: new Date().toISOString() };
          toast.success(`Task with ID ${task.id} updated to ${eventKey}`);
          return updatedTask;
        }
        return task;
      })
    );
    setTimeout(() => { setEditTaskId(null) }, 300);
    setEditField('');
  }, [setTasks, toast, setEditTaskId, setEditField]);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, taskId: number) => {
    const { value } = e.target;
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, dueDate: value, updatedAt: new Date().toISOString() };
          toast.success(`Task with ID ${task.id} updated`);
          return updatedTask;
        }
        return task;
      })
    );
    setEditTaskId(null);
    setEditField('');
  }, [setTasks, toast, setEditTaskId, setEditField]);

  return (
    <Fragment>
      <Table bordered hover>
        <thead>
          <tr>
            {headers.map(({ display, key }) => (
              <th key={key} style={{ whiteSpace: 'nowrap' }} onClick={() => handleSortById(key as keyof Task)}>{display} <small style={{ fontSize: '12px' }}> ↕️</small></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>
                {(editTaskId === task.id && editField === 'title') ? <Form.Control type="text" placeholder="Enter task title" value={selectedTask.title} name="title" onChange={handleChange} onBlur={handleBlur} /> : <p className='m-0' onClick={() => editTask(task.id, 'title')}>{task.title}</p>}

                {(editTaskId === task.id && editField === 'description') ? <Form.Control type="text" placeholder="Enter task title" value={selectedTask.description} name="description" onChange={handleChange} onBlur={handleBlur} /> : <small className='text-muted' onClick={() => editTask(task.id, 'description')}>{task.description}</small>}
              </td>

              <td onClick={() => editTask(task.id, 'status')}>
                {
                  (editTaskId === task.id && editField === 'status')
                    ?
                    <DropdownButton title="Status" size="sm" variant="light" onSelect={(e) => handleStatusChange(e, task.id)}>
                      <Dropdown.Item as="button" eventKey="To Do">To Do</Dropdown.Item>
                      <Dropdown.Item as="button" eventKey="In Progress">In Progress</Dropdown.Item>
                      <Dropdown.Item as="button" eventKey="Done">Done</Dropdown.Item>
                      <Dropdown.Item as="button" eventKey="Blocked">Blocked</Dropdown.Item>
                    </DropdownButton>

                    : <Badge
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
                }
              </td>

              <td style={{ whiteSpace: 'nowrap' }} onClick={() => editTask(task.id, 'due-date')}>
                {editTaskId === task.id && editField === 'due-date' ? 
                
                  <input type="date" onChange={(e) => handleDateChange(e, task.id)} value={task.dueDate || ''}/>

                : <small> {task.dueDate ? formatDate(task.dueDate) : 'N/A'}</small>}
                
                </td>

              <td>
                {[DropdownButton].map((DropdownType, idx) => (
                  <DropdownType
                    as={ButtonGroup}
                    key={idx}
                    id={`dropdown-button-drop-${idx}`}
                    size="sm"
                    variant="light"
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
                        <div key={assignee.id} className='d-flex align-items-center justify-content-between p-1 my-3' style={{ borderRight: '3px solid green', boxShadow: '0 0 5px rgba(0,0,0,0.5)' }}>
                          <div className='m-1 d-flex' style={{ fontWeight: 'normal', color: 'black' }}> <UserImg src={assignee.imgURL ? assignee.imgURL : 'https://www.shutterstock.com/image-vector/grey-person-icon-business-vector-260nw-2178945117.jpg'} alt={assignee.name} /> <span style={{ whiteSpace: 'nowrap' }}>{assignee.name}</span></div>
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
    </Fragment>
  )
}

export default TaskManagement