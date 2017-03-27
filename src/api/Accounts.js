import Base from './Base';

class Accounts extends Base {
    getById(id) {
        return this.get(`accounts/${id}`);
    }
}

const accounts = new Accounts();

export default accounts;
