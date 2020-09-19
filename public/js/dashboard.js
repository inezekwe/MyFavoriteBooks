document.addEventListener("DOMContentLoaded", function(){
  var bookShelf = document.getElementById('bookShelf');

  getSavedBooks();
});


function getSavedBooks () {
    fetch('/users/save_book', {method: 'GET'})
        .then(function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                response.status);
                return;
            }


            response.json().then(function (data) {
                console.log(data);
                for(let i = 0; i < data.length; i++) {
                    let bookCard = buildCard(data[i].isbn);

                    bookShelf.appendChild(bookCard);
                }
            })
        })
        .catch(function (error) {
            console.log(error)
        }) 
}

function buildCard(data) {
  let gridElement = document.createElement('div');
  gridElement.className = 'col s12';

  let cardElement = document.createElement('div');
  cardElement.className = 'card large grey darken-3';

  let cardImg = document.createElement('div');
  cardImg.className = 'card-image waves-effect waves-block waves-light';
  cardImg.innerHTML = `<img class="activator" src="http://covers.openlibrary.org/b/isbn/${data}-L.jpg">`;

  
  let cardReveal = document.createElement('div');
  cardReveal.className = 'card-reveal grey darken-3 white-text';
  cardReveal.innerHTML = `<span class="card-title white-text">Make an Entry<i class="material-icons right">close</i></span>
  <form action="/users/add_comment" method="POST"><textarea class="entries white" name="comment" rows="150"></textarea>
  <input class="isbnID" type="hidden" name="isbn" value=${data}>
  <button class="btn waves-effect waves-light deep-orange darken-4" type="submit" name="action">Save Entry
  <i class="material-icons right">send</i></form>`;


  let removeBtn = document.createElement('a');
  removeBtn.className = 'waves-effect waves-light deep-orange darken-4 btn';
  removeBtn.innerHTML = 'Remove Book';
  removeBtn.id = data;
  removeBtn.addEventListener('click', function(response) {
    fetch('/users/remove_book/' + this.id, {method: 'DELETE'})
      .then((response) => {
        if (response.status == 200) {
          alert("Book has been removed");
          location.reload();
      }
      })
      .catch(function (error) {
        console.log('Looks like there was a problem. Status Code: ' +
        response.status);
      })
  })

  cardReveal.appendChild(removeBtn);
  cardElement.appendChild(cardImg);
  cardElement.appendChild(cardReveal);
  gridElement.appendChild(cardElement);

  return gridElement;

}


function getComments(id) {
    fetch('/users/comments/' + id, {method: 'GET'})
      .then(function(response) {
          if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
              response.status);
              return;
          }


          response.json().then(function (data) {
            console.log(data[0].comments);
            return data[0].comments;
          })
      })
      .catch(function (error) {
          console.log(error)
      })
    
}
