import { useEffect, useState, useContext } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function EditProfilePopup(props) {
  const currentUser = useContext(CurrentUserContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // After loading the current user from the API
  // their data will be used in managed components.
  useEffect(() => {
    setName(currentUser.name || '');
    setDescription(currentUser.about || '');
  }, [currentUser, props.isOpen]);

  const handleNameChange = (evt) => {
    setName(evt.target.value);
  };

  const handleDescriptionChange = (evt) => {
    setDescription(evt.target.value);
  };

  const handleSubmit = (evt) => {
    // Prevent the browser from navigation to the form address
    evt.preventDefault();

    // Pass the values of the managed components to the external handler
    props.onUpdateUser({
      name,
      about: description,
    });
  };

  return (
    <PopupWithForm
      name="edit"
      isOpen={props.isOpen}
      title="Edit Profile"
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText="Submit"
    >
      <label className="popup__label">
        <input
          type="text"
          name="inputName"
          id="owner-name"
          value={name}
          className="popup__input_type_first popup__input"
          placeholder="Your name"
          minLength="2"
          maxLength="40"
          onChange={handleNameChange}
          required
        />
        <p className="popup__error" id="card-title-error"></p>
      </label>
      <label className="popup__label">
        <input
          type="text"
          name="inputCareer"
          value={description}
          className=" popup__input_type_second popup__input"
          id="owner-career"
          placeholder="Your Career"
          minLength="2"
          maxLength="200"
          onChange={handleDescriptionChange}
          required
        />
        <p className="popup__error" id="card-link-error"></p>
      </label>
    </PopupWithForm>
  );
}
