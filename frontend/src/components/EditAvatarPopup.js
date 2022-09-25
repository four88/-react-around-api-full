import { useRef, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

export default function EditAvatarPopup(props) {
  const avatarRef = useRef('');

  const handleSubmit = (evt) => {
    evt.preventDefault();
    props.onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  };

  useEffect(() => {
    if (props.isOpen) {
      avatarRef.current.value = '';
    }
  }, [props.isOpen]);

  return (
    <PopupWithForm
      name="avatar"
      isOpen={props.isOpen}
      title="Change Profile Picture"
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText="Submit"
    >
      <label className="popup__label">
        <input
          type="url"
          name="avatar"
          className=" popup__input_type_second popup__input"
          id="avatar-link"
          placeholder="Your link URL"
          required
          ref={avatarRef}
        />
        <p className="popup__error" id="card-link-error"></p>
      </label>
    </PopupWithForm>
  );
}
