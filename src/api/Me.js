import Base from './Base';

class Me extends Base {
  get() {
    return this._get('me', { fields: ':default' });
  }

  login(username, password) {
    this.isLoading = true;
    const url = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/api/login'
      : '/api/login';

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = {
        method: 'POST',
        body: JSON.stringify({
          username,
          password
        }),
        headers
    };

    return fetch(url, options)
        .then((result) => {
            if (result.status != 200) {
                throw new Error('Bad response from API');
            }

            return result.json();
        })
        .then((data) => {
            this.isLoading = false;
            return data;
        });
  }
}

const me = new Me();

export default me;
