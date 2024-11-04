import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

socket.on('error', (error) => {
  console.error('WebSocket error:', error);
});

socket.on('questionCreated', (data) => {
  console.log('\nQuestion Created:');
  console.log(JSON.stringify(data));
});

socket.on('questionUpdated', (data) => {
  console.log('\nQuestion Updated:');
  console.log(JSON.stringify(data));
});

socket.on('questionDeleted', (data) => {
  console.log('\nQuestion Deleted:');
  console.log(JSON.stringify(data));
});

socket.on('questionVoted', (data) => {
  console.log('\nQuestion Voted:');
  console.log(JSON.stringify(data));
});

socket.on('questionAnswered', (data) => {
  console.log('\nQuestion Answered:');
  console.log(JSON.stringify(data));
});

socket.on('answerCreated', (data) => {
  console.log('\nAnswer Created:');
  console.log(JSON.stringify(data));
});

socket.on('answerUpdated', (data) => {
  console.log('\nAnswer Updated:');
  console.log(JSON.stringify(data));
});

socket.on('answerDeleted', (data) => {
  console.log('\nAnswer Deleted:');
  console.log(JSON.stringify(data));
});

socket.on('answerVoted', (data) => {
  console.log('\nAnswer Voted:');
  console.log(JSON.stringify(data));
});

console.log('WebSocket test client started - waiting for events...');
