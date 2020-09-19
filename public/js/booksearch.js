

$(document).ready(function () {
    var bookBody = document.getElementById('bookBody');
    var submitButton = document.getElementById('submitButton');

    var bookSelection = document.getElementById('bookSelection');
    var titleSelection = document.getElementById('titleSelection');
    var authorSelection = document.getElementById('authorSelection');

    var cards = document.getElementById("cards");


    /// Search for items
    submitButton.addEventListener('click', function () {
        if(bookSelection.value == "" && titleSelection.value == "" && authorSelection.value == "") {
            alert("Type in a search query");
        }
        else {
            bookSearch;
            titleSearch;
            authorSearch;
        }
    });

    //General book search
    bookSelection.addEventListener('search', bookSearch)

    //Search by title
    titleSelection.addEventListener('search', titleSearch);

    //Search by author
    authorSelection.addEventListener('search', authorSearch);

    
})




//-------------------FUNCTION------------------------//

function bookSearch(event) {

    event.preventDefault();

    if (bookSelection.value == "") {
        alert("Please type in a book query");
    }
    else {
        cards.innerHTML = '';
        $.get(`http://openlibrary.org/search.json?q=${bookSelection.value}`)
            .then( function (data1) {
            console.log(data1);
            for (var j = 0; j < data1.docs.length; j++) {
                let bookCard = buildCard(data1.docs[j]);

                cards.appendChild(bookCard);
            }

            })
            
        
    }


}

function titleSearch(event) {
    event.preventDefault();

    if (titleSelection.value == "") {
        alert("Please type in a book title");
    }
    else {
    cards.innerHTML = '';
    $.get(`http://openlibrary.org/search.json?title=${titleSearch.value}`)
        .then( function (data1) {
        console.log(data1);
        for (var j = 0; j < data1.docs.length; j++) {
            let bookCard = buildCard(data1.docs[j]);

            cards.appendChild(bookCard);
        }

        })
        
    }

}

function authorSearch(event) {
    event.preventDefault();
    
    if(authorSelection.value == '') {
        alert('Please type in an author');
        
    }
    else {
    cards.innerHTML = '';
    $.get(`http://openlibrary.org/search.json?author=${authorSelection.value}`)
        .then(function (data1) {
        console.log(data1);
        for (var j = 0; j < data1.docs.length; j++) {
            let bookCard = buildCard(data1.docs[j]);

            cards.appendChild(bookCard);
        }
         $(document).ready()
        })

        
    }

}

function buildCard(data) {

    var bookElement = document.createElement('div');
     bookElement.className = "col-3 mb-4";

    var cardElement = document.createElement('div');
    cardElement.className = "card h-100 bg-dark text-white";

    var cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    var coverImg = `<img class="card-img-top" src="http://covers.openlibrary.org/b/isbn/${data.isbn[0]}-M.jpg" alt="${data.title} cover">`;
                                
                                
    var bodyHTML =  `<h5 class="card-title">${data.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${data.author_name}</h6>
                    <p class="card-text">${data.first_publish_year}</p>`;
    
    var button = document.createElement('button');
    button.className = "btn btn-warning";
    button.id = data.isbn[0];
    button.innerHTML = "Save Book";

    button.addEventListener("click", function() {

        $.post('/users/save_book', {"isbn": this.id})
            .then(function(response) {
                alert(response);
            })
            .catch(function(error) {
                alert(error);
            })
    });

    
                
    /*Insert string literal into card-body
    add anchor to bottom of card body*/
    cardBody.insertAdjacentHTML('beforeend', coverImg);
    cardBody.insertAdjacentHTML('beforeend', bodyHTML);
    cardBody.appendChild(button);
    
               
    /*Image is inserted into card element
    card body is appended to card element*/
    cardElement.appendChild(cardBody);
               
    //Card element is appended to div
    bookElement.appendChild(cardElement);
                

    return bookElement;
}

function fixCoverImage(url) {
    let imgs = document.getElementsByTagName('img');
    console.log(imgs);
    console.log(imgs.length);

    for(var i = 0; i < imgs.length; i++) {
        if(imgs[i].naturalWidth != 1) {
            console.log('ok');
        }
    }
}



