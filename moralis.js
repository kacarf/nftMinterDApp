import Moralis from 'moralis';

async function uploadToIPFS() {
  await Moralis.start({
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImFjYzBmNGEyLTY5OTAtNDZjMi1iOTBlLTdjNGQyMjFjMDBjMSIsIm9yZ0lkIjoiMzc0NDU2IiwidXNlcklkIjoiMzg0ODE2IiwidHlwZUlkIjoiMTZkZjFlZGItZDZhYy00NWU1LWIyNWMtY2I2YjU2NmNhNjU0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDYzNTU1OTgsImV4cCI6NDg2MjExNTU5OH0.glA-a8AwYxjGdllqwli2J4YaJ4L6ZtJQaHohjdf9z70',
  });
}
uploadToIPFS();