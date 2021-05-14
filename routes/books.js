var express = require('express');
var router = express.Router();
const fs = require("fs");

/* GET users listing. */
router.get('/', function(req, res, next) {
  fs.readFile("books.json", function(err, data) {
    if(err) {
      console.log(err);
    }

    let books = JSON.parse(data);
    
    let printBooks = `<section><h2>Böcker i biblioteket</h2><ul>`;

    for(book in books) {
      printBooks += `<li><a href="/books/book/${books[book].title}">${books[book].title}</a>  -  ${ (books[book].rented) ? "Utlånad" : "Finns att låna" }</li>`;
    }
    
    printBooks += `</ul><a href="/books/add">Klicka här för att lägga till en ny bok i biblioteket</a></section>`;

    res.send(printBooks);
  })
});

router.get("/book/:title", function(req, res) {
  let showBookTitle = req.params.title;
  console.log("Visa bok", showBookTitle);

  fs.readFile("books.json", function(err, data) {
    if(err) {
      console.log(err);
    }

    let books = JSON.parse(data);
    
    let showBook = books.find( ({title}) => title == showBookTitle);
    console.log("showbook", showBook);

    let printInfo = `<h3>${showBook.title}</h3>
                    <p>Författare: ${showBook.author}</p>
                    <p>Antal sidor: ${showBook.pages}</p>
                    <p>${ (showBook.rented) ? "Utlånad" : "<a href='/books/rent/" + req.params.title + "'><button>Finns att låna</button></a>" }</p>`;

    res.send(printInfo);

  })
})


router.get("/rent/:title", function(req, res) {
  let rentTitle = req.params.title;

  fs.readFile("books.json", function(err, data) {
    if(err) {
      console.log(err);
    }

    let books = JSON.parse(data);

    let findBook = books.find( ({title}) => title == rentTitle);
    console.log("findbook", findBook);
    
    findBook.rented = true;

    //books.push(findBook);
    
    fs.writeFile("books.json", JSON.stringify(books, null, 2), function() {
      if(err) {
        console.log(err);
      }

      res.redirect("/books")
      
    })

    

  })




  

  
  
  
})


router.get("/add", function(req, res) {
  let addForm = `<section><h2>Lägg till en ny bok</h2>
                <form action="/books/add" method="post">
                Namn på boken: <input type="text" name="title"><br>
                Författare: <input type="text" name="author"><br>
                Antal sidor: <input type="text" name="pages"><br>
                <button type="submit">Spara</button>
                `
                res.send(addForm);
});


router.post("/add", function(req, res) {
  console.log(req.body);
  
  let newBook = {title: req.body.title, author: req.body.author, pages: req.body.pages, rented: false}

  fs.readFile("books.json", function(err, data) {
    if(err) {
      console.log(err);
    }

    let books = JSON.parse(data);
    books.push(newBook);

    fs.writeFile("books.json", JSON.stringify(books, null, 2), function() {
      if(err) {
        console.log(err);
      }

      
      res.redirect("/books")
    })
  })
})








module.exports = router;
