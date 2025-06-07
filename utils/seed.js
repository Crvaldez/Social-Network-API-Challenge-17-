const connection = require('../config/connection');
const { User, Thought } = require('../models');

// Sample data
const users = [
  {
    username: 'john_doe',
    email: 'john@example.com',
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
  },
];

const thoughts = [
  {
    thoughtText: 'I love this platform!',
    username: 'john_doe',
  },
  {
    thoughtText: 'Networking is the key to success.',
    username: 'jane_smith',
  },
];

connection.once('open', async () => {
  console.log(' Connected to MongoDB. Seeding data...');

  // Delete existing
  await User.deleteMany({});
  await Thought.deleteMany({});

  // Insert users
  const createdUsers = await User.insertMany(users);

  // Match thoughts to users by username
  const thoughtData = thoughts.map((thought) => {
    const user = createdUsers.find((u) => u.username === thought.username);
    return { ...thought, userId: user._id };
  });

  // Create thoughts and update users
  for (const item of thoughtData) {
    const thought = await Thought.create(item);
    await User.findByIdAndUpdate(item.userId, {
      $push: { thoughts: thought._id },
    });
  }

  console.log(' Seed data inserted!');
  process.exit(0);
});
// Catch any errors