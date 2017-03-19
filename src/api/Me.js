import Base from './Base';

class Me extends Base {
  get() {
    return this._get('me', { fields: ':default' });
  }

  login(user, password) {
    this.isLoading = true;
    const url = `${this.baseUrl}me`;

    const headers = new Headers();
    headers.append('Authorization', `Basic ${user}:${password}`);

    const options = {
        method: 'GET',
        headers
    };

    return fetch(url, options)
        .then((result) => {
            if (result.status >= 400) {
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
