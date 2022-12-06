import { Fragment } from 'react';

const User = (props) => {

  return (
    <Fragment>
      <td>{props.id}</td>
      <td>{props.name}</td>
      <td>{props.email}</td>
      <td>{props.lastActivity}</td>
      <td>{props.registrationTime}</td>
      <td>{props.status}</td>
    </Fragment>
  );
};

export default User;
