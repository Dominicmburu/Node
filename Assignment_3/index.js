const EventEmitter = require('events'); // For emitting events
const LogEvents = require('./LogEvents'); // Importing the LogEvents function

// Create a new event emitter instance
const emitter = new EventEmitter();

// Create an event listener for 'log' event
emitter.on('log', (message) => LogEvents(message));

// Emit 'log' event after 2 seconds (2000ms) with a message
setTimeout(() => {
  emitter.emit('log', 'New log event emitted');
}, 2000);
