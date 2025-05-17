import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { NavContainer } from '../styled';
import {Link, useLocation} from 'react-router-dom'

function Navigation() {
  const location = useLocation();
  return (
    <NavContainer>
      <Stack direction="horizontal" gap={3}>
        <Link to="/tasks"><Button variant={location.pathname === '/tasks' ? 'primary' : 'light'}>Task Management</Button></Link>
        <Link to="/users"><Button variant={location.pathname === '/users' ? 'primary' : 'light'}>User Management</Button></Link>
      </Stack>
    </NavContainer>
  )
}

export default Navigation