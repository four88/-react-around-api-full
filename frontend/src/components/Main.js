import Card from './Card';
import React, { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main(props) {
  // subscribing to CurrentUserContext
  const currentUser = useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile">
        <div className="profile__img-wrap" onClick={props.onEditAvatarClick}>
          <div className="profile__img-edit"></div>
          <img
            src={currentUser.avatar}
            id="image-profile"
            alt="profile img"
            className="profile__img"
          />
        </div>
        <div className="profile__info">
          <div className="profile__info-wrap">
            <h1 className="profile__info-name">{currentUser.name}</h1>
            <button
              className="profile__button-edit"
              type="button"
              onClick={props.onEditProfileClick}
            ></button>
            <p className="profile__info-career">{currentUser.about}</p>
          </div>
          <button
            className="profile__button profile__button-add"
            type="button"
            onClick={props.onAddPlaceClick}
          ></button>
        </div>
      </section>

      <section className="elements">
        {props.cardInfo.map((card) => {
          return (
            <Card
              key={card._id}
              card={card}
              onClick={props.onCardClick}
              onOpenDeleteClick={props.onOpenDeleteClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />
          );
        })}
      </section>
    </main>
  );
}
export default Main;
