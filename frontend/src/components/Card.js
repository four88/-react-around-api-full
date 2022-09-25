import { useContext } from "react";
import HeartIcon from "../images/icon.svg";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import ActiveHeartIcon from "../images/active_button.svg";

export default function Card(props) {
  // subscribing the CurrentUserContext
  const currentUser = useContext(CurrentUserContext);

  const handleClick = () => {
    props.onClick(props.card);
  };

  const handleLikeClick = () => {
    props.onCardLike(props.card);
  };

  const handleDeleteClick = () => {
    props.onCardDelete(props.card);
  };

  // Checking if the current user is the owner of the current card
  const isOwn = props.card.owner === currentUser._id;

  // Creating a variable which you'll then set in 'className' for the delete button
  const cardDeleteButtonClassName = `
${isOwn ? "element__delete-active" : "element__delete"}`;

  // Check if the card was liked by the current user
  const isLiked = props.card.likes.some((like) => like === currentUser._id);

  return (
    <div className="element">
      <button
        className={cardDeleteButtonClassName}
        onClick={handleDeleteClick}
        disabled={isOwn ? false : true}
      ></button>
      <img
        src={props.card.link}
        alt=" "
        className="element__pic"
        onClick={handleClick}
      />
      <div className="element__name">
        <h2 className="element__title">{props.card.name}</h2>
        <button className="element__icon" type="button">
          <img
            src={isLiked ? ActiveHeartIcon : HeartIcon}
            id="image-icon-heart"
            alt="element icon heart"
            className="element__icon-img"
            onClick={handleLikeClick}
          />
          <p className="element__like-counter">{props.card.likes.length}</p>
        </button>
      </div>
    </div>
  );
}
