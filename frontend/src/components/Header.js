import logo from '../images/logo.png';
import { Link } from 'react-router-dom';
import closeIcon from '../images/Close_icon.svg';

export default function Header({
  emailTitle,
  toPath,
  linkTitle,
  onClick,
  openNav,
  isNavExpand,
}) {
  return (
    <header className="header">
      <img id="image-logo" alt="logo" className="header__logo" src={logo} />
      <ul className="header__menu">
        {emailTitle ? (
          <>
            <li className="header__list">
              <h1 className="header__email">{emailTitle}</h1>
            </li>
            <li className="header__list">
              <Link
                to={toPath}
                className="header__link header__link_type_logout"
                onClick={onClick}
              >
                {linkTitle}
              </Link>
            </li>
            <li className="header__list">
              <button className="header__hamburger" onClick={openNav}>
                {isNavExpand ? (
                  <img className="header__close_icon" src={closeIcon} />
                ) : (
                  <>
                    <div className="header__hamburger-line"></div>
                    <div className="header__hamburger-line"></div>
                    <div className="header__hamburger-line"></div>
                  </>
                )}
              </button>
            </li>
          </>
        ) : (
          <li className="header__list">
            <Link to={toPath} className="header__link">
              {linkTitle}
            </Link>
          </li>
        )}
      </ul>
    </header>
  );
}
