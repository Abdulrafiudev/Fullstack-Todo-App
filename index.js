import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'world',
  password: 'Pythondev',
  port: 5433
})

db.connect()

/*let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];*/

app.get("/", async (req, res) => {

  let response = await db.query('SELECT * FROM items')
  let items = response.rows
  console.log(items)
  res.render("index.ejs", {list_title: "Today",list_items: items,});
});

app.post("/add", async (req, res) => {
  let item = req.body.newItem;
  try{
    await db.query('INSERT INTO items (title) VALUES ($1)', [item])
    res.redirect("/");
  }
   
  catch(error){
    console.error(`Failed to delete todo`, error.stack)
  }
});

app.post("/edit", async (req, res) => {
  let new_todo = req.body.updatedItemTitle
  let id = req.body.updatedItemId
  try{
    await db.query('UPDATE items SET title = $1 WHERE items.id = $2', [new_todo, id])
    res.redirect(`/`)
  }
 
  catch(error){
    console.error(`Failed to delete todo`, error.stack)
  }
});

app.post("/delete", async (req, res) => {
  let id = req.body.deleteItemId
  try{
    await db.query('DELETE FROM items WHERE items.id = $1', [id])
  res.redirect(`/`)
  }
  catch(error){
    console.error(`Failed to delete todo`, error.stack)
  } 
  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
