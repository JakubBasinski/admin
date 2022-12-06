import { useState, useRef, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import classes from './AuthForm.module.css';
import AuthContext from '../../store/auth-context';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  let url = process.env.REACT_APP_URL
  const navigate = useNavigate();
  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const authCtx = useContext(AuthContext);
 
  const [isLogin, setIsLogin] = useState(true);
  const [singInMessage, setSignInMessage] = useState(null);

  const signInMessage = (message) => {
    setSignInMessage(message);
  };

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    let enteredName;

    if (!isLogin) {
      enteredName = nameInputRef.current.value;
    }
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    let isSignInSuccessfull;

    if (isLogin) {
      url = `${url}/login`;
    } else {
      url = `${url}/signup`;
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        name: enteredName,
        email: enteredEmail,
        password: enteredPassword,
        
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (res.status === 409 || res.status === 500) {
          isSignInSuccessfull = false;
          return res.json();
        } else if (res.status === 200) {
          isSignInSuccessfull = true;
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'Authentication error';
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        signInMessage(data.message);
        if (isSignInSuccessfull) {
          switchAuthModeHandler();
        }
        if (data.token) {
          authCtx.login(data.token);
          navigate('/panel');
        }
    
      })
      .catch((err) => {
        console.log(err.message);
      });

    if (isLogin) {
      emailInputRef.current.value = '';
      passwordInputRef.current.value = '';
    } else {
      nameInputRef.current.value = '';
      emailInputRef.current.value = '';
      passwordInputRef.current.value = '';
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Form onSubmit={submitHandler} className={classes.form}>
        <Form.Group className={classes.message}>{singInMessage}</Form.Group>
        <Form.Group className={classes.group}>
          <Form.Label className={classes.header}>
            {' '}
            {isLogin ? 'Login' : 'Sign up'}
          </Form.Label>
        </Form.Group>
        {!isLogin && (
          <Form.Group className={classes.group} controlId="formBasicEmail">
            <Form.Label className={classes.label}> Name</Form.Label>
            <Form.Control
              className={classes.conrol}
              ref={nameInputRef}
              type="text"
              required
            />
          </Form.Group>
        )}

        <Form.Group className={classes.group} controlId="formBasicEmail">
          <Form.Label className={classes.label}> Email</Form.Label>
          <Form.Control
            className={classes.conrol}
            ref={emailInputRef}
            type="email"
            required
          />
        </Form.Group>

        <Form.Group className={classes.group} controlId="formBasicPassword">
          <Form.Label className={classes.label}> Password</Form.Label>
          <Form.Control
            className={classes.conrol}
            ref={passwordInputRef}
            type="password"
            required
          />
        </Form.Group>

        <Form.Group className={classes.group}>
          <Button className={classes.button} variant="primary" type="submit">
            {isLogin ? 'Login' : 'Sign up'}
          </Button>

          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default AuthForm;
