const express = require("express");

const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

// construccion del schema
const schema = buildSchema(`
      type Cliente{
        id: Int,
        nombre: String, 
        telefono: String
      }

      type Query{
        clientes: [Cliente],
        cliente (id:Int): Cliente
      }

      type Mutation{
        addClient(nombre:String, telefono:String): Cliente
      }
`);

let clientes = [];
let counter = 1;

// definir los metodos
const root = {
    clientes: () => {
        return clientes;
    },

    cliente: (data) => {
        for (let i = 0; i < clientes.length; i++) {
            if (clientes[i].id == data.id) return clientes[i];
        }
        return null;
    },

    addClient: (data) => {
        let newClient = {
            id: counter,
            nombre: data.nombre,
            telefono: data.telefono,
        };

        clientes.push(newClient);
        counter++;
        return newClient;
    },
};

const app = express();
const PORT = 5000;

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
);

app.listen(PORT, () => {
    console.log(`Server run - Port ${PORT}`);
});