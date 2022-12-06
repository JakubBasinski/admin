import { Table, Form, Container, Button } from 'react-bootstrap';
import { TrashFill, Unlock } from 'react-bootstrap-icons';
import { useEffect, useState, useCallback, useRef, useContext } from 'react';
import User from './User';
import classes from './Panel.module.css';
import AuthContext from '../../store/auth-context';

const Panel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const allChekbox = useRef();
  const authCtx = useContext(AuthContext);
  let url = process.env.REACT_APP_URL

  const fetchUsersHandler = useCallback(async () => {
    try {
      const response = await fetch(`${url}/panel`, {});
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const blockHandler = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${url}/panel/block`, {
        method: 'POST',
        body: JSON.stringify({
          selectedUsers,
        }),
        headers: { 'Content-Type': 'application/json', Authorization: token },
      });
      if (!response.ok) {
        throw new Error('Something went wrong');
      } else {
        const data = await response.json();
        if (data.isBlockingHimself === true) {
          authCtx.logout();
        }
      }
      fetchUsersHandler();
    } catch (err) {
      console.log(err);
    }
    allChekbox.current.checked = false;

    setSelectedUsers([]);
  };

  const unblockHandler = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${url}/panel/unblock`, {
        method: 'POST',
        body: JSON.stringify({
          selectedUsers,
        }),
        headers: { 'Content-Type': 'application/json', Authorization: token },
      });
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
    } catch (err) {
      console.log(err);
    }
    fetchUsersHandler();
    setSelectedUsers([]);
    allChekbox.current.checked = false;
  };

  const deleteHandler = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${url}/panel/delete`, {
        method: 'POST',
        body: JSON.stringify({
          selectedUsers,
        }),
        headers: { 'Content-Type': 'application/json', Authorization: token },
      });
      if (!response.ok) {
        throw new Error('Something went wrong');
      } else {
        const data = await response.json();
        if (data.isBlockingHimself === true) {
          authCtx.logout();
        }
      }
    } catch (err) {
      console.log(err);
    }
    fetchUsersHandler();
    setSelectedUsers([]);
    allChekbox.current.checked = false;
  };

  useEffect(() => {
    fetchUsersHandler();
  }, [fetchUsersHandler]);

  const handleChange = (e) => {
    const { id, checked } = e.target;
    let tempUser;
    if (id === 'allSelect') {
      tempUser = users.map((user) => {
        return { ...user, isChecked: checked };
      });
      setUsers(tempUser);
    } else {
      tempUser = users.map((user) =>
        id === user._id ? { ...user, isChecked: checked } : user
      );
      setUsers(tempUser);
    }
    let usersAreSelected = tempUser.filter((user) => user.isChecked === true);
    setSelectedUsers(usersAreSelected);
  };

  return (
    <Container className="mt-5 d-flex flex-column align-items-center justify-content-center">
      <div className={classes.toolbar} aria-label="Toolbar with button groups">
        <Button onClick={blockHandler} className="px-4" variant="danger">
          Block
        </Button>{' '}
        <Unlock
          onClick={unblockHandler}
          className={classes.icon}
          color="#E4DCCF"
          size={30}
        />
        <TrashFill
          onClick={deleteHandler}
          className={classes.icon}
          color="#E4DCCF"
          size={25}
        />
      </div>
      <Table className="table-responsive" bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check
                ref={allChekbox}
                type="switch"
                id="allSelect"
                onChange={handleChange}
              />
            </th>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Last activity</th>
            <th>Registration date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <input
                  type="checkbox"
                  checked={user?.isChecked || false}
                  id={user._id}
                  onChange={handleChange}
                />
              </td>
              <User
                id={user._id}
                name={user.name}
                email={user.email}
                lastActivity={
                  user.lastLogin.slice(0, 10) +
                  ' ' +
                  user.lastLogin.slice(11, 19)
                }
                registrationTime={user.createdAt.slice(0, 10)}
                status={user.status}
              ></User>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Panel;
