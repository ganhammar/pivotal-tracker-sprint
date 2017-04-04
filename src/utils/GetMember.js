import TrackerStore from './../stores/TrackerStore';

export default function (memberId) {
  return TrackerStore.members.find((member) => {
    if (member.id === memberId) {
      return member;
    }
  });
}
