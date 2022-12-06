import { Card, Container } from 'react-bootstrap';
import classes from './StartingPage.module.css';

const StartingPage = () => {
  return (
    <Container className="mt-5 d-flex justify-content-center h-50">
      <Card className={classes.card}>
        <Card.Body className="d-flex justify-content-center">
          <h2> Login or Signup to get access to the panel</h2>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StartingPage;
