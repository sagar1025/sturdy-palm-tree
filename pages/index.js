import HomePage from './homepage'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const App = ()  => {
  return (
    <Container>
        <Navbar bg="dark" variant="dark" className='mb-4'>
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
        </Container>
      </Navbar>
      <HomePage />
    </Container>
  )
}
export default App;