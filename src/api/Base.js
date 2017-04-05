import { observable } from 'mobx';
import queryString from 'query-string';

import stateStore from './../stores/StateStore';

export default class Base {
    @observable isLoading = false;
    baseUrl;

    constructor({ baseUrl = 'https://www.pivotaltracker.com/services/v5/' } = {}) {
        this.baseUrl = baseUrl;
    }

    _get(endpoint, params = {}) {
        return this._request({
            endpoint,
            method: 'GET',
            params
        });
    }

    _put(endpoint, body, params = {}) {
        return this._request({
            endpoint,
            method: 'PUT',
            params,
            body
        });
    }

    _post(endpoint, body, params = {}) {
        return this._request({
            endpoint,
            method: 'POST',
            params,
            body
        });
    }

    _delete(endpoint, params = {}) {
        return this._request({
            endpoint,
            method: 'DELETE',
            params
        });
    }

    _request({ endpoint, method, params = {}, body = {} }) {
        this.isLoading = true;
        const stringifiedParams = Object.keys(params).length !== 0 &&
          params.constructor === Object
            ? `?${queryString.stringify(params)}`
            : '';
        const url = `${this.baseUrl}${endpoint}${stringifiedParams}`;

        const token = stateStore.apiToken;
        const headers = new Headers();
        headers.append('X-TrackerToken', token);
        headers.append('Content-Type', 'application/json');

        const options = {
            method,
            headers
        };

        if (['get', 'head'].indexOf(method.toLowerCase()) === -1) {
            options.body = JSON.stringify(body);
        }

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
