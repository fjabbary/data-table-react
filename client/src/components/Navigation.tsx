import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import { NavContainer } from '../styled';

function Navigation() {
  return (
    <NavContainer>
      <Stack direction="horizontal" gap={3}>
        <Button variant="primary">Task Management</Button>
        <Button variant="secondary">User Management</Button>
      </Stack>
    </NavContainer>
  )
}

export default Navigation