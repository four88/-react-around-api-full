import { Link } from 'react-router-dom';

export default function NavMenu({ email, onClickLogout }) {
  return (
    <nav className="nav">
      <ul className="nav__menu">
        <li className="nav__list">
          <h1 className="nav__email">{email}</h1>
        </li>
        <li className="nav__list">
          <Link className="nav__link" to="/signin" onClick={onClickLogout}>
            Log out
          </Link>
        </li>
      </ul>
    </nav>
  );
}
