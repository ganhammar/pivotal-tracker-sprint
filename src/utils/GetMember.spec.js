import GetMember from './GetMember';
import TrackerStore from './../stores/TrackerStore';

describe('GetMember', () => {
  it ('returns a member', () => {
    const member = { id: 1, name: 'A Member' };
    const members = [member];

    TrackerStore.members = members;

    expect(GetMember(1)).toEqual(member);
  });

  it ('doesn\'t return a member', () => {
    expect(undefined).toEqual(undefined);
  });
});
