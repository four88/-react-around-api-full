export default function PopupWithForm(props) {
  return (
    <div
      className={`popup ${props.name} ${props.isOpen ? 'popup_type_opened' : ''
        }`}
    >
      <div className="popup__container">
        <button
          type="button"
          className="popup__button-closed"
          onClick={props.onClose}
        ></button>
        <form
          className="popup__form"
          name={props.name}
          onSubmit={props.onSubmit}
        >
          <fieldset className="popup__set">
            <h2 className="popup__title">{props.title}</h2>
            {props.children}
            <button
              type="submit"
              className="popup__button popup__button_save"
            >
              {props.buttonText}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
