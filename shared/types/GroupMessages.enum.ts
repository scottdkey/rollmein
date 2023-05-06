export enum GroupWSMessageTypes {
  PlayerAdded = "addPlayer",
  RemovePlayer = 'removePlayer',
  PlayerUpdated = 'playerUpdated',
  AddMember = "addMember",
  RemoveMember = 'removeMember',
  GroupUpdated = 'groupUpdated',
  JoinGroup = 'joinGroup',
  MemberUpdated = 'memberUpdated',
  RollStarted = 'rollStarted',
  RollEnded = 'rollEnded',
  Open = 'open',
  TooManyLocked = 'tooManyLocked',
  CountUpdated = 'countUpdated'
}