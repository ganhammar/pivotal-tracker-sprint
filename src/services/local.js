export class Local {
  g (key) {
    if (localStorage.getItem(key)) {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (err) {
        this.d(key);
        return false;
      }
    }
  }

  s (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  d (key) {
    if (Array.isArray(key)) {
      key.forEach(i => this.d(i));
    }
    localStorage.removeItem(key);
  }
}
