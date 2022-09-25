export default function ImagePopup(props) {
  return (
    <div className={`pic popup ${props.card ? 'popup_type_opened' : ''}`}>
      <div className="pic__container">
        <button
          type="button"
          className="pic__button-closed popup__button-closed"
          onClick={props.onClose}
        ></button>
        <img
          src={props.card ? props.card.link : ''}
          alt={props.card ? props.card.name : ''}
          className="pic__img"
        />
        <h2 className="pic__title">{props.card ? props.card.name : ''}</h2>
      </div>
    </div>
  );
}
