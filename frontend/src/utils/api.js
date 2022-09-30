class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.statusText}`);
  }

  getUserAvatar(token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${token}`
      },
    }).then((res) => this._checkResponse(res));
  }

  // fetch cards from the server
  getInitialCards(token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${token}`
      },
    }).then((res) => this._checkResponse(res));
  }

  // edit and update the profile info
  updateUserInfo(name, about, token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => this._checkResponse(res));
  }

  // add new card to server
  addNewCard(name, link, token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        link,
      }),
    }).then((res) => this._checkResponse(res));
  }

  //update profile picture
  updateAvatar(avatar, token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${token}`
      },
      method: "PATCH",
      body: JSON.stringify({ avatar }),
    }).then((res) => this._checkResponse(res));
  }

  //Delete card from server
  deleteCard(cardId, token) {
    return fetch(this._baseUrl + "/cards/" + cardId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${token}`
      },
    }).then((res) => this._checkResponse(res));
  }

  // Add and Remove Likes
  changeLikeCardStatus(cardId, isLiked, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${token}`
      },
      method: isLiked ? "DELETE" : "PUT",
    }).then((res) => this._checkResponse(res));
  }
}

const api = new Api({
  baseUrl: "https://api.around-pharanyu.students.nomoredomainssbs.ru",
});

export default api;
