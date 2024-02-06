const messageSocket = require('./socketMessages');
const userSocket = require('./socketUserActif');

module.exports = (io) => {
  messageSocket(io);
  userSocket(io);
};