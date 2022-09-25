import { Route, Redirect } from 'react-router-dom';

export default function ProtectedRoute({
  isLoggedIn,
  children,
  toPath,
  ...props
}) {
  return (
    <Route {...props}>{isLoggedIn ? children : <Redirect to={toPath} />}</Route>
  );
}
