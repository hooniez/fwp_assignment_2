const { buildSchema } = require("graphql");
const db = require("../database");

const graphql = {};

const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

const moment = require("moment");

const resolverMap = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom type",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getItem();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),
};

// GraphQL.
// Construct a schema, using GraphQL schema language
graphql.schema = buildSchema(`
  scalar Date

  type User {
    id: Int,
    email: String,
    firstName: String,
    lastName: String,
    isBlocked: Boolean,
    posts: [Post]
  }

  type Post {
    id: Int,
    isDeletedByAdmin: Boolean,
    text: String
  }

  type React {
    reaction: Int
  }

  type Login {
    userId: Int,
    dateLoggedIn: Date
  }

  type Follow {
    userId: Int,
    followedId: Int
  }

  type Visit {
    id: Int,
    userId: Int,
    visitedId: Int,
    dateVisited: Date
  }

  # Queries (read-only operations).
  type Query {
    all_users: [User],
    all_posts: [Post],
    all_reactions(postId: Int): [React],
    all_recent_logins: [Login],
    all_follow_metrics(userId: Int): [Follow],
    all_profile_visits(userId: Int): [Visit],
  }

  # Mutations (modify data in the underlying data-source, i.e., the database).
  type Mutation {
    block_user(id: Int): Boolean
    delete_post(id: Int): Boolean
  }

`);

// The root provides a resolver function for each API endpoint.
graphql.root = {
  // Queries.
  all_users: async () => {
    return await db.user.findAll({
      where: {
        isDeleted: false,
      },
      include: { model: db.post, as: "posts" },
    });
  },

  block_user: async (args) => {
    console.log(args.id);
    const user = await db.user.findByPk(args.id);

    if (user === null) return false;

    // If user is already blocked, unblock user
    user.isBlocked = !user.isBlocked;

    await user.save();

    return true;
  },

  all_posts: async () => {
    return await db.post.findAll({
      where: {
        isDeleted: false,
      },
    });
  },

  delete_post: async (args) => {
    console.log(args.id);
    const post = await db.post.findByPk(args.id);

    if (post === null) return false;

    // If post is already deleted, unDelete post
    post.isDeletedByAdmin = !post.isDeletedByAdmin;

    await post.save();

    return true;
  },

  all_reactions: async (args) => {
    console.log(args);
    return await db.react.findAll({
      where: {
        postId: args.postId,
      },
    });
  },

  all_recent_logins: async (args) => {
    return await db.login.findAll({
      where: {
        dateLoggedIn: {
          [db.Op.gte]: moment().subtract(7, "days").toDate(),
        },
      },
    });
  },

  all_follow_metrics: async (args) => {
    return await db.follow.findAll({
      where: {
        [db.Op.or]: [
          {
            userId: args.userId,
          },
          {
            followedId: args.userId,
          },
        ],
      },
    });
  },

  all_profile_visits: async (args) => {
    return await db.visit.findAll({
      where: {
        visitedId: args.userId,
      },
    });
  },
};

module.exports = graphql;

// # The input type can be used for incoming data.
//   input UserInput {
//     id: Int,
//     email: String,
//     firstName: String,
//     lastName: String,
//   }

//   # Queries (read-only operations).
//   type Query {
//     all_users: [User],
//     user(email: String): User,
//     user_exists(email: String): Boolean
//   }

//   # Mutations (modify data in the underlying data-source, i.e., the database).
//   type Mutation {
//     create_user(input: UserInput): User,
//     update_user(input: UserInput): User,
//     delete_user(email: String): Boolean
//   }

/******************************************************* resolvers */

//   user: async (args) => {
//     return await db.user.findByPk(args.id);
//   },
//   user_exists: async (args) => {
//     const count = await db.user.count({ where: { email: args.email } });

//     return count === 1;
//   },

//   // Mutations.
//   create_user: async (args) => {
//     const user = await db.user.create(args.input);

//     return user;
//   },
//   update_user: async (args) => {
//     const user = await db.user.findByPk(args.input.id);

//     // Update owner fields.
//     user.firstName = args.input.firstName;
//     user.lastName = args.input.lastName;

//     await user.save();

//     return user;
//   },
//   delete_user: async (args) => {
//     const user = await db.user.findByPk(args.id);

//     if(user === null)
//       return false;

//     // First remove all pets owned by the owner.
//     await db.pet.destroy({ where: { email: owner.email } });
//     await owner.destroy();

//     return true;
//   }

// Below are some sample queries that can be used to test GraphQL in GraphiQL.
// Access the GraphiQL web-interface when the server is running here: http://localhost:4000/graphql
/*

{
  all_owners {
    email,
    first_name,
    last_name,
    pets {
      pet_id,
    	name
    }
  }
}

{
  owner(email: "matthew@rmit.edu.au") {
    email,
    first_name,
    last_name
  }
}

{
  owner_exists(email: "matthew@rmit.edu.au")
}

mutation {
  create_owner(input: {
    email: "newuser@rmit.edu.au",
    first_name: "New",
    last_name: "User"
  }) {
    email,
    first_name,
    last_name
  }
}

mutation {
  update_owner(input: {
    email: "matthew@rmit.edu.au",
    first_name: "Matthew",
    last_name: "Bolger"
  }) {
    email,
    first_name,
    last_name
  }
}

mutation {
  delete_owner(email: "newuser@rmit.edu.au")
}

*/