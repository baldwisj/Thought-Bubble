const { Thoughts, Users } = require('../models');


module.exports = {
    //The folling gets all thoughts
    async getAllThoughts(req, res) {
        try {
            const thoughts = await Thoughts.find().select("-__v");
            res.json(thoughts);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    //The following gets a single thought with a provided id
    async getThoughtById(req, res) {
        try {
            const thought = await Thoughts.findOne({
                _id: req.params.thoughtId,
            }).select("-__v");

            if (!thought) {
                return res.status(404).json({ message: "This id is not associated with any user" });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //The following creates a thought
    async createThought(req, res) {
        try {
            const thought = await Thoughts.create(req.body);

            const user = await Users.updateOne(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: "This id is not associated with any user" });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //This updates a thought
    async updateThought(req, res) {
        try {
            const thought = await Thoughts.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { new: true }
            );
            if (!thought) {
                return res
                    .status(404)
                    .json({ message: "This id is not associated with any thought" });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //This deletes a thought
    async deleteThought(req, res) {
        try {
            const thought = await Thoughts.findOneAndDelete({ _id: req.params.thoughtId });
            if (!thought) {
                return res.status(400).json({ message: "This id is not associated with any thought" })
            }


            res.json({ message: 'thought has been deleted' })
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    //This adds a reaction
    async createReaction(req, res) {
        try {
            const thought = await Thoughts.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
            );

            if (!thought) {
                return res
                    .status(404)
                    .json({ message: "This id is not associated with any thought" });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    //This deletes a reaction
    async deleteReaction(req, res) {
        try {
            const thought = await Thoughts.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { _id: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(400).json({ message: "This id is not associated with any thought" })
            }
            res.json(thought);

        } catch (err) {
            res.status(500).json(err)
        }
    },
}