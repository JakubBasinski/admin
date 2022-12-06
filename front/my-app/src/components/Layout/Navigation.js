import { Navbar, Nav, Container,  } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './Navigation.module.css';
import { useContext } from 'react';
import adminPdf from '../../assets/Admin.pdf'
import infoLogo from '../../assets/info.png'

const Navigation = () => {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const logoutHandler = () => {
    authCtx.logout();
  };
  return (
    <Navbar expand="xxl" className={classes.navbar} variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Project_Admin
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Nav>
          <a href={adminPdf} target="_blank">
            <img
              src={infoLogo}
              alt=""
              className={classes.info}
            />
          </a>
            {isLoggedIn && (
              <Nav.Link as={Link} to="/panel">
                Admin panel
              </Nav.Link>
            )}
            {isLoggedIn && (
              <Nav.Link  onClick={logoutHandler}>
                Logout
              </Nav.Link>
            )}
            {!isLoggedIn && (
              <Nav.Link as={Link} to="/auth">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
