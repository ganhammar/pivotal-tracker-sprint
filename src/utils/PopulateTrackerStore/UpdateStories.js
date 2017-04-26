import TrackerStore from './../../stores/TrackerStore';

export default function updateStories(updates) {
  let current = TrackerStore.stories;
  let i;
  let found;

  updates.forEach((update) => {
    found = false;

    for (i = 0; i < current.length; i++) {
      if (update.id === current[i].id) {
        found = true;

        current[i] = update;
      }
    }

    if (found === false) {
      current.push(update);
    }
  });

  for (i = 0; i < current.length; i++) {
    const story = updates.find((update) => {
      if (update.id === current[i].id) {
        return true;
      }
    });

    if (!story) {
      current.splice(i, 1);
    }
  }

  TrackerStore.stories = current;
}
