const express = require("express")
const server = express()

// get the database
const db = require("./database/db")

// config public past
server.use(express.static("public"))

server.use(express.urlencoded({extended:true}))

// using template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})


// config roots of my aplication
// init page
// req: requisition
//res: answer

server.get("/", (req, res) => {
    return res.render("index.html", { title: "Um titulo" })
})

server.get("/create-point", (req, res) => {

    // console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    const query = `
        INSERT INTO places (
            image,
            name,
            address, 
            address2,
            state,
            city,
            items 
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
       req.body.image,
       req.body.name,
       req.body.address,
       req.body.address2,
       req.body.state,
       req.body.city,
       req.body.items

    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro")
        } 

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved:true})
    }
    
     db.run(query, values, afterInsertData)
})

server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        return res.render("search-results.html", {total:0})
    }


    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        
        if (err) {
            return console.log(err)
        }

        const total = rows.length

        //Show the html page with date the database
        return res.render("search-results.html", { places:rows,total:total} )
    })

})

//turn on of server
server.listen(3000)
