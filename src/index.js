let addToy = false;

//NodeVariables:
toyList = () => document.querySelector("#toy-list")
toyNameInput = () => document.querySelector("#name-input").value
toyImgInput = () => document.querySelector("#img-input").value
newToySubmit = () => document.querySelector(".add-toy-form")


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
  displayAllToys()
  newToySubmit().addEventListener("submit", (event) => {
    event.preventDefault()
    createNewToy()
  })
});


const createNewToy = () => {
  const newToy = {"name":toyNameInput(), "image":toyImgInput(), "likes":0}
  debugger
  fetch("http://localhost:3000/toys", {
    method:"POST",
    headers:{
      "Accept":"application/json",
      "Content-Type":"application/json"
    },
    body:JSON.stringify(newToy)
  })
  .then(response => response.json())
  .then(data => displayToy(data))
  .catch(error => console.log(error.message))
}


//display toys
const displayAllToys = () => {
  toyList().innerHTML = ""
  fetch("http://localhost:3000/toys")
  .then(response => response.json())
  .then(data => data.forEach(toy=>displayToy(toy)))
  //
}

const displayToy = (toy) => {
  const li = document.createElement("li")
  const img = document.createElement("img")
  const h2 = document.createElement("h2")
  const p = document.createElement("p")
  const btn = document.createElement("button")

  li.classList.add("card")
  h2.innerText = toy.name
  img.setAttribute(`src`, toy.image)
  img.classList.add("toy-avatar")
  p.innerText = `${toy.likes} likes`
  btn.innerText = "Like"
  p.setAttribute("id", toy.id)
  btn.addEventListener("click", (event)=>{
    updateLikes(toy)
  })

  li.appendChild(img)
  li.appendChild(h2)
  li.appendChild(p)
  li.appendChild(btn)
  toyList().appendChild(li)
}

//updates the whole page, not sure how to change that.
const updateLikes = (toy) => {
 toy.likes = toy.likes + 1
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers:{
      "Accept":"application/json",
      "Content-Type":"application/json"
    },
    body:JSON.stringify({"likes":toy.likes})
  })
  .then(response=>response.json())
  .then(data => {
    document.getElementById(data.id).innerText = data.likes + " likes"
  })
}