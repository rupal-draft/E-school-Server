import express from "express";
export const app = express();

const port = 3000;

app.listen(port, ()=>{
    console.log(`⚙️   Server is running at port : ${port}`);  
  })

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })