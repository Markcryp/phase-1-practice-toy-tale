let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const addToyForm = document.querySelector('.add-toy-form');
  const toysUrl = 'http://localhost:3000/toys';

  // Fetch and display toys
  fetch(toysUrl)
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => createToyCard(toy));
    })
    .catch(error => console.error('Error fetching toys:', error));

  // Function to create and add toy card to the DOM
  const createToyCard = (toy) => {
    const card = document.createElement('div');
    card.className = 'card';

    const h2 = document.createElement('h2');
    h2.textContent = toy.name;

    const img = document.createElement('img');
    img.src = toy.image;
    img.className = 'toy-avatar';

    const p = document.createElement('p');
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement('button');
    button.className = 'like-btn';
    button.id = toy.id;
    button.textContent = 'Like ❤️';
    button.addEventListener('click', () => {
      updateLikes(toy, p);
    });

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(button);

    toyCollection.appendChild(card);
  };

  // Add a new toy
  addToyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0
    };

    fetch(toysUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(toy => {
        createToyCard(toy);
        addToyForm.reset();
      })
      .catch(error => console.error('Error adding toy:', error));
  });

  // Update likes
  const updateLikes = (toy, p) => {
    const newLikes = toy.likes + 1;

    fetch(`${toysUrl}/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes;
        p.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error('Error updating likes:', error));
  };
});

