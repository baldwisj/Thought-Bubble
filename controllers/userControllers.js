const { Users, Thoughts } = require('../models');

module.exports = {
    //The following retreives users
    async getAllUsers(req, res) {
        try {
            const user = await Users.find()
                .populate("thoughts")
                .populate("friends")
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //The following retreives one user by id
    async getUserById(req, res) {
        try {
            const user = await Users.findOne({ _id: req.params.userId })
                .populate("thoughts")
                .populate("friends")
            if (!user) {
                return res.status(404).json({ message: "A user does not exist with that id" });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //This creates a user
    async createUser(req, res) {
        try {
            const user = await Users.create(req.body);
            res.json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    //This updates a user
    async updateUser(req, res) {
        try {
            const user = await Users.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );


            if (!user) {
                return res.status(404).json({ message: "A user does not exist with that id" });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },


    //This deletes a user
    async deleteUser(req, res) {
        try {
            const user = await Users.findOneAndDelete({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: "A user does not exist with that id" });
            }

            await Thoughts.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: "User and thoughts deleted" });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //This adds a friend to the users friend list
    async addFriend(req, res) {
        try {
            const user = await Users.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.body.friendId } },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res.status(404).json({ message: "A user does not exist with this id" });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //This removes a friend for the users friend list
    async removeFriend(req, res) {
        try {
            const user = await Users.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res.status(404).json({ message: "A user does not exist with that id" });
            }
            res.json({ message: "Bye bye! Friend removed from friend list" });

        } catch (err) {
            res.status(500).json(err);
        }
    },
}