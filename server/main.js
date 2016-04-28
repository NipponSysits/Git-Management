import { Meteor } from 'meteor/meteor';
import './account';

console.log('METEOR_CONFIG', process.env.METEOR_CONFIG);

Meteor.startup(() => {
  // code to run on server at startup
});