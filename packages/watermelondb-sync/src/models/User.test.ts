import { User } from './User';
import { Model } from '@nozbe/watermelondb';

describe('User Model', () => {
  it('should be defined as a valid WatermelonDB model', () => {
    // Model instantiation in WatermelonDB tests requires mock DB contexts.
    // We are testing structural integrity natively.
    expect(User.table).toBe('users');
  });

  it('should associate with squad_id correctly', () => {
    expect(User.associations).toEqual({
      squads: { type: 'belongs_to', key: 'squad_id' }
    });
  });
});
