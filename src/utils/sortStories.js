export function sortStoriesIntoColumns(stories, columns, filter) {
  const sortedColumns = {};

  stories.forEach((story) => {
    if (filter && story.name.toLowerCase().indexOf(filter.toLowerCase()) === -1) {
      return;
    }

    const columnName = getColumnForStory(story, columns);

    if (columnName) {
      sortedColumns[columnName] = sortedColumns[columnName] || [];
      sortedColumns[columnName].push(story);
    }
  });

  let result = [];
  columns.forEach((column) => {
    if (column.isVisible !== false) {
      result[column.name] = sortedColumns[column.name] || [];
    }
  });
  return result;
}

export function getColumnForStory(story, columns) {
  let column = columns.find((column) => {
    if (column.isVisible !== false && storyHasOneLabel(story, column.config.labels)) {
      return true;
    }
  });

  if (column) {
    return column.name;
  }

  column = columns.find((column) => {
    if (column.isVisible !== false && column.config.states &&
        column.config.states.length > 0) {
      if (column.config.states.indexOf(story.current_state) !== -1) {
        return true;
      }
    }
  });

  if (column) {
    return column.name;
  }

  return false;
}

export function storyHasOneLabel(story, labels) {
  if (!labels || labels.length === 0) {
    return false;
  }

  return labels.some((labelName) => {
    let found = story.labels.some((label) => {
      if (label.name === labelName) {
        return true;
      }
    });

    if (found) {
      return true;
    }
  });
}
