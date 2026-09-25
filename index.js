require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const Person = require("./models/person");

const app = express();

let persons = [];

app.use(express.json());

app.use(morgan("combined"));

app.use(cors());

app.use(express.static("dist"));

// const password = process.argv[2];
// const url = `mongodb+srv://fullstack:${password}@cluster0.cq7yvhx.mongodb.net/phonebook?appName=Cluster0`;
// mongoose.set("strictQuery", false);
// mongoose.connect(url, { family: 4 });
// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// });
// const Person = mongoose.model("Person", personSchema);
// personSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

// let persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  const number = persons.length;
  const time = new Date().toString();
  console.log(time);
  response.send(
    `<div>Phonebook has info for ${number} people</div><div>${time}</div>`,
  );
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
      response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      console.log(error.message)
      response.status(400).end();
    });
  // const id = request.params.id;
  // const person = persons.find((person) => person.id === id);

  // console.log(person);

  // if (person) {
  //   response.json(person);
  // } else {
  //   response.status(404).end();
  // }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

// const generateId = () => {
//   const maxId =
//     persons.length > 0 ? Math.max(...persons.map((p) => Number(p.id))) : 0;
//   return String(maxId + 1);
// };

// const generateId = () => String(Math.floor(Math.random() * 1000000));

const isDuplicateName = (name) => {
  const names = persons.map((p) => p.name);
  return names.includes(name);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  console.log(request.body);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number is missing",
    });
  }

  if (isDuplicateName(body.name)) {
    return response.status(400).json({
      error: "The name already exists in the phonebook",
    });
  }

  const person = new Person({
    // id: generateId(),
    name: body.name,
    number: body.number,
  });

  console.log(person);

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
  // persons = persons.concat(person);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
