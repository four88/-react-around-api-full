import failedIcon from '../images/falied_icon.png';
import sucessIcon from '../images/success_icon.png';

export default function InfoTooltip({ isOpen, isSuccess, onClose }) {
  return (
    <div className={`info popup ${isOpen ? 'popup_type_opened' : ''}`}>
      <div className="info__container">
        <button
          type="button"
          className="info__button-closed popup__button-closed"
          onClick={onClose}
        ></button>
        <img
          src={isSuccess ? sucessIcon : failedIcon}
          alt={isSuccess ? 'success' : 'failed'}
          className="info__img"
        />
        <h1 className="info__title">
          {isSuccess
            ? 'Sucess! You have now been registered'
            : 'Opps, something went wrong! Please try again.'}
        </h1>
      </div>
    </div>
  );
}
