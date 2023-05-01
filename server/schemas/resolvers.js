const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

// Define the resolvers object, which maps to the Query and Mutation types in the schema
const resolvers = {
    Query: {
        // Define a resolver for the "me" query, which returns the current user's information
        me: async (parent, args, context) => {
            if (context.user) {
                // If the user is logged in, retrieve the user's data from the database and return it
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                return userData;
            }
            // If the user is not logged in, throw an AuthenticationError
            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: {
        // Define a resolver for the "addUser" mutation, which creates a new user in the database
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        // Define a resolver for the "login" mutation, which logs in a user with an email and password
        login: async (parent, { email, password }) => {
            const user = await User.findOne( { email });
            if (!user) {
                // If no user is found with the given email, throw an AuthenticationError
                throw new AuthenticationError('Incorrect credentials')
            }
            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw) {
                // If the password is incorrect, throw an AuthenticationError
                throw new AuthenticationError('Incorrect credentials')
            }
            const token = signToken(user);
            return { token, user };
        },
        // Define a resolver for the "saveBook" mutation, which adds a book to the current user's list of saved books
        saveBook: async (parent, { book }, context) => {
            if (context.user) {
                // If the user is logged in, add the book to the user's savedBooks array and return the updated user
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: {savedBooks: book} },
                    { new: true }
                )
                return updatedUser;
            }
            // If the user is not logged in, throw an AuthenticationError
            throw new AuthenticationError('You need to be logged in!')
        },
        // Define a resolver for the "removeBook" mutation, which removes a book from the current user's list of saved books
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                // If the user is logged in, remove the book with the given ID from the user's savedBooks array and return the updated user
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                )
                return updatedUser;
            }
        }
    }
};

module.exports = resolvers;
