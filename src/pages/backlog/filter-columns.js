export class FilterColumnsValueConverter {
  toView(array, config) {
    if (Array.isArray(array) === false) {
      return array;
    }

    var value = config.value;
    if (Array.isArray(value) === false) {
      value = [value];
    }

    return array.slice(0).filter(item => {
      if (config.basedOn === "state") {
        for (var i = 0; i < value.length; i++) {
          if (item.current_state === value[i]) {
            return true;
          }
        }
      } else {
        for (var i = 0; i < value.length; i++) {
          for (var y = 0; y < item.labels.length; y++) {
            if (item.labels[y].name === value[i]) {
              return true;
            }
          }
        }
      }

      return false;
    });
  }
}
