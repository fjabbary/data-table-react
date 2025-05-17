import Button from "react-bootstrap/Button"
import { HomeContainer } from "../styled"
import { Link } from "react-router-dom"

function HomePage() {
  return (
    <HomeContainer>
      <h1>Frontend Technical Assessment: <br/> Interactive Data Grid Component</h1>
      <Link to="/tasks"><Button variant="success">Tasks & Users</Button></Link>
    </HomeContainer>
  )
}

export default HomePage