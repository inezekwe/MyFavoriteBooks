

$(document).ready(function () {
    var bookBody = document.getElementById('bookBody');
var submitButton = document.getElementById('submitButton');
var titleSelection = document.getElementById('titleSelection');
var authorSelection = document.getElementById('authorSelection');

var cards = document.getElementById("cards");


/// Search for items
submitButton.addEventListener('click', function () {
    var bookSelection = document.getElementById('bookSelection').value;
    if (bookSelection == "") {
        alert("Please add a book name to search");
    }
    else {
        bookSearch(bookSelection);
    }
});

//Search by title
//titleSelection.addEventListener('search', titleSearch(titleSelection.value));

authorSelection.addEventListener('search', function (event) {
    console.log(event);
});

//submit search value with return key
bookSelection.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("submitButton").click();
    }
});
})




//-------------------FUNCTION------------------------//

function bookSearch(searchString) {

    cards.innerHTML = '';
    $.get(`http://openlibrary.org/search.json?q=${searchString}`, function (data1) {
        console.log(data1);
        for (var j = 0; j < data1.docs.length; j++) {
            var author = data1.docs[j].author_name;
            var title = data1.docs[j].title;
            var publish_date = data1.docs[j].first_publish_year;
            var isbn = data1.docs[j].isbn[0];

            var card = `<div class= "col-sm-3 mb-4">
            <div class="card h-100 bg-dark text-white" >
            <img src="http://covers.openlibrary.org/b/isbn/${isbn}-M.jpg" class="card-img-top" alt="${title} cover">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${author}</h6>
              <p class="card-text">${publish_date}</p>
            </div>
          </div>
          </div>
                                `

            cards.innerHTML += card;
        }

    })

}

function titleSearch(searchString) {
    if (bookSelection == "") {
        alert("Please add a book name to search");
    }

    cards.innerHTML = '';
    $.get(`http://openlibrary.org/search.json?title=${searchString}`, function (data1) {
        console.log(data1);
        for (var j = 0; j < data1.docs.length; j++) {
            var author = data1.docs[j].author_name;
            var title = data1.docs[j].title;
            var publish_date = data1.docs[j].first_publish_year;
            var isbn = data1.docs[j].isbn[0];

            var card = `<div class= "col-sm-3 mb-4">
            <div class="card h-100 bg-dark text-white" >
            <img src="http://covers.openlibrary.org/b/isbn/${isbn}-M.jpg" class="card-img-top" alt="${title} cover">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${author}</h6>
              <p class="card-text">${publish_date}</p>
            </div>
          </div>
          </div>
                                `

            cards.innerHTML += card;
        }

    })

}

function authorSearch(searchString) {

    cards.innerHTML = '';
    $.get(`http://openlibrary.org/search.json?author=${searchString}`, function (data1) {
        console.log(data1);
        for (var j = 0; j < data1.docs.length; j++) {
            var author = data1.docs[j].author_name;
            var title = data1.docs[j].title;
            var publish_date = data1.docs[j].first_publish_year;
            var isbn = data1.docs[j].isbn[0];

            var card = `<div class= "col-sm-3 mb-4">
            <div class="card h-100 bg-dark text-white" >
            <img src="http://covers.openlibrary.org/b/isbn/${isbn}-M.jpg" class="card-img-top" alt="${title} cover">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${author}</h6>
              <p class="card-text">${publish_date}</p>
            </div>
          </div>
          </div>
                                `

            cards.innerHTML += card;
        }

    })

}