const { Thought, User } = require('../models');

module.exports = {
  // GET all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET single thought by ID
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) return res.status(404).json({ message: 'Thought not found' });
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST create a thought and push to user's thoughts
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      await User.findByIdAndUpdate(
        req.body.userId,
        { $push: { thoughts: thought._id } },
        { new: true }
      );
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // PUT update thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        req.body,
        { new: true, runValidators: true }
      );
      if (!thought) return res.status(404).json({ message: 'Thought not found' });
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
      if (!thought) return res.status(404).json({ message: 'Thought not found' });

      // Remove from user's thoughts
      await User.findOneAndUpdate(
        { thoughts: thought._id },
        { $pull: { thoughts: thought._id } },
        { new: true }
      );

      res.json({ message: 'Thought deleted' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST add reaction
  async addReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $push: { reactions: req.body } },
        { new: true, runValidators: true }
      );
      if (!thought) return res.status(404).json({ message: 'Thought not found' });
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE reaction
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      if (!thought) return res.status(404).json({ message: 'Thought not found' });
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
// This code defines the thoughtController for handling requests related to thoughts in a social media application.
// It includes methods for getting all thoughts, getting a single thought by ID, creating a thought, updating a thought, deleting a thought, adding a reaction, and removing a reaction.