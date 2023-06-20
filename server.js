const express = require('express')
const fs = require('fs')
const multer = require('multer')

const app = express()
const port = 3000

app.use(express.static("public"))
app.use(express.static("uploads"))
app.use(express.json())

const upload = multer({ dest: 'uploads/'})

app.route("/").get((req,res) => {
    res.sendFile("./public/index.html")
})
.post(upload.single("picture") ,(req, res) => {

    fs.readFile("./data.txt", "utf-8", (err, data) => {
        if(err){
            throw err
        }
        let todos

        if(data.length === 0){
            todos = []
        }
        else{
            todos = JSON.parse(data)
        }

        const item = {
            id: Date.now(),
            text: req.body.task,
            complete: false,
            image: req.file.filename,
        }
        todos.push(item)

        fs.writeFile("./data.txt", JSON.stringify(todos), (err) => {
            res.end(JSON.stringify(item))
        })
    })    
})

app.get("/loadData", (req, res) => {

    fs.readFile("./data.txt", "utf-8", (err,data) =>{
        if(err){
            throw err
        }
        res.end(data)
    })
})

app.post("/editData", (req, res) => {

    const element =req.body
    
    fs.readFile("./data.txt", "utf-8", (err, data) => {
        if(err){
            throw err
        }
        let todos = JSON.parse(data)

        todos.map(item => {
            if(item.id == element.id){
                item.complete = element.complete
            }
        })
        
        fs.writeFile("./data.txt", JSON.stringify(todos), (err) =>{
            res.end()
        })
    })
})

app.post("/saveChange", (req, res) => {
    const element =req.body
    
    fs.readFile("./data.txt", "utf-8", (err, data) => {
        if(err){
            throw err
        }
        let todos = JSON.parse(data)

        todos.map(item => {
            if(item.id == element.id){
                item.text = element.text
            }
        })
        
        fs.writeFile("./data.txt", JSON.stringify(todos), (err) =>{
            res.end()
        })
    })
})

app.post("/delTodo", (req, res) =>{
    const element =req.body
    
    fs.readFile("./data.txt", "utf-8", (err, data) => {
        if(err){
            throw err
        }
        let todos = JSON.parse(data)

        todos = todos.filter(item => {
            return (item.id != element.id)
        })
        
        fs.writeFile("./data.txt", JSON.stringify(todos), (err) =>{
            res.end()
        })
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})