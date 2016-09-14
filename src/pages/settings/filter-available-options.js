export class FilterAvailableOptionsValueConverter {
  toView(array, config, except) {
    if (Array.isArray(array) === false) {
      return array;
    }

    array = array.slice(0);

    config.forEach(item => {
      if (item.basedOn !== "state") {
        return;
      }
      
      item.value.forEach(val => {
        if (val !== except && array.indexOf(val) !== -1) {
          array.splice(array.indexOf(val), 1);
        }
      });
    });

    return array;
  }
}
