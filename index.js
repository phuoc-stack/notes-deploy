//create an Express application stored in the app variable
const express = require('express')
const app = express()
//Activate json-parser to take JSON data of a request , transform it into a JS object
//and then attach it to the body property of the request object before the route 
//handler is called. Without it, the body property is undefined
app.use(express.json())
const cors = require('cors')
app.use(express.static('dist'))
app.use(cors())

let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
  //define two routes to the application

  //define an event handler used to handle HTTP GET requests made to the 
  //application's /root
  app.get('/', (request, response) => {
    //the server respond to the HTTP request by sending the string that was 
    //passed to the send method
    //the status code of the response defaults to 200
    response.send('<h1>Hello World!</h1>')
  })
  //define and event handler that handles HTTP GET requests made to the notes 
  //path in the application
  //calling the method sends the notes array passed to it as a JSON formatted string
  app.get('/api/notes', (request, response) => {
    response.json(notes)
  })

  app.get('/api/notes/:id', (request, response) => {
    //the id parameter in the route of a request is accessed through the request object
    const id = request.params.id
    //the find method of arrays to find the note with an id that matches the parameter
    const note = notes.find(note => note.id === id)

    if (note){
        //the found note is then returned to the sender of the request
        response.json(note)
    } else {
        //the end method is used for responding to the request without sending any data
        response.status(404).end()
    }
  })

  ///update a note by ID
  app.put('/api/notes/:id', (request, response) => {
    //extract note id from the request parameters
    const id = request.params.id;
    //retrieve the updated note object from the request
    const updatedNote=request.body;

    //find the note by id and update its properties
    const index=notes.findIndex(note=>note.id===id);

    if(index!==-1){
      //if the note with given ID is found, update its properties by merging
      notes[index]={ ...notes[index], ...updatedNote };
      response.json(notes[index]);
    } else {
      response.status(404).json({error: 'Note not found'})
    }
  });
  

  app.delete('/api/notes/:id',(request,response)=>{
    const id=request.params.id
    //if deleting the resource is successful (the note exists and is removed), 
    //we respond to the request with status code 204 no content and return 
    //no data with the response
    //no consensus on what status code should be returned to a DELETE request if 
    //the resource does not exist. For simplicity, the application will response 
    //with 204 in both cases 
    notes=notes.filter(note=>note.id != id)
    response.status(204).end()
  })

  //logic for generating new id number
  const generatedId =()=>{
    const maxId=notes.length>0
    //map(n=>n.id) creates a new array that contains all the ids of the notes in number 
    //form. We transform the array into individual numbers by using "..." syntax)
    //before passing them to Math.max
    ? Math.max(...notes.map(n=>Number(n.id)))
    :0
    return String(maxId+1)
  }

    //the event handler function can access the data from the body property of 
    //the request object 
  app.post('/api/notes',(request,response)=>{
    //find the largest id number in the current list and assign it to the maxId variable
    const body=request.body
    //if the received data is missing a value for the content property, the server
    //will respond to the request with the status code 400 bad request
    //calling return is crucial because otherwise the code will execute to the very
    //end and the malformed note gets saved to the application
    if (!body.content){
        return response.status(400).json({
            error:'content missing'
        })
    }
    //if the content property has a value, the note will be based on received data.
    //if the important property is missing, we will default the value to false.
    const note ={
        content:body.content,
        important: Boolean(body.important) || false,
        id: generatedId(),
    }
 
    notes=notes.concat(note)
    response.json(note)
  })
//define the port number the server will listen on 
const PORT = process.env.PORT || 3001
//start the server and have it listen on the defined port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
