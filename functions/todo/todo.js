const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb');
q = faunadb.query;
require("dotenv").config();

const typeDefs = gql`
  type Query {
    todos: [Todo!]

  }
  type Todo {
    id: ID!
    task: String!
    status: Boolean!
  }
  type Mutation {
    addTodo(task: String!):Todo
    delTodo(id: ID!):Todo
    
  }
  
`;
const client = new faunadb.Client({secret:process.env.faunadb_secret})



const resolvers = {
  Query: {
    todos: async (root, args, context) => {
      //return 'Hello, world!'
      try {
        
        const result = await client.query(
          
          q.Map(
            q.Paginate(q.Match(q.Index('task'))),
            q.Lambda((x) => q.Get(x))
          )        
          
      )
      
           
      return result.data.map((d) => {
        return {
          id: d.ref.id,
          status: d.data.status,
          task: d.data.task
        }
      })
    
      } catch (err) {
       console.log(err)
      }
      
    },
  },
  Mutation: {
    addTodo: async (_, { task }) => {
 try{
   
   const result = await client.query(
     
     q.Create(q.Collection('todos'),{
       data:{
         task:task,
         status:false,
         
       }
     },
     )
     
 )
 
     return result.ref.data  
 } catch (err) {
  console.log(err) 
 }
},

  delTodo: async (_, { id }) => {
    try {
      const result = await client.query(
        q.Delete(q.Ref(q.Collection('todos'),
        id
        ))
      );
      console.log(result)
      return result.data;
    } catch (error) {
      return error;
    }
  },

    },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
