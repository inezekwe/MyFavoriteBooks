document.addEventListener("DOMContentLoaded", function(){
  var bookShelf = document.getElementById('bookShelf');
  var diaryEntry = document.getElementById('diaryEntry');

  getSavedBooks();

  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

//Loads all saved books on to dashboard
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

//Builds cards that show the cover image and diary entry
function buildCard(data) {
  let gridElement = document.createElement('div');
  gridElement.className = 'col s12';

  let cardElement = document.createElement('div');
  cardElement.className = 'card grey darken-3';

  let cardImg = document.createElement('div');
  cardImg.className = 'card-image waves-effect waves-block waves-light';
  cardImg.innerHTML = `<img class="activator" src="https://covers.openlibrary.org/b/isbn/${data}-M.jpg">`;

  
  let cardReveal = document.createElement('div');
  cardReveal.className = 'card-reveal grey darken-3 white-text';
  cardReveal.innerHTML = `<span class="card-title white-text">Make an Entry<i class="material-icons right">close</i></span>
  <form action="/users/add_comment" method="POST" target="_parent"><textarea class="entries white" name="comment"></textarea>
  <input class="isbnID" type="hidden" name="isbn" value=${data}>
  <button class="btn waves-effect waves-light deep-orange darken-4" type="submit" name="action">Edit Entry
  <i class="material-icons right">send</i></form>`;

  //Button removes book
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

  //Button lets you view diary entry 
  let commentBtn = document.createElement('a');
  commentBtn.className = 'waves-effect waves-light deep-orange darken-4 btn modal-trigger';
  commentBtn.setAttribute('href', '#modal1');
  commentBtn.innerHTML = 'View Diary Entry';
  commentBtn.addEventListener('click', function(response) {
    fetch('/users/comments/' + data, {method: 'GET'})
      .then((response) => {
        if (response.status == 200) {
          response.json().then(function (data) {
            console.log(data[0].comments);
            diaryEntry.innerHTML = data[0].comments;
          })
      }
      })
      .catch(function (error) {
        console.log('Looks like there was a problem. Status Code: ' +
        response.status);
      })
  })

  cardReveal.appendChild(commentBtn);
  cardReveal.appendChild(removeBtn);
  cardElement.appendChild(cardImg);
  cardElement.appendChild(cardReveal);
  gridElement.appendChild(cardElement);

  return gridElement;

}


