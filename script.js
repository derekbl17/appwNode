const form = document.getElementById("tree-form");
const table = document.getElementById("myTable");
const createButton = document.getElementById("create");
const updateButton = document.getElementById("updateSave");
const nameInput = document.getElementById("create-name");
const heightInput = document.getElementById("create-height");
const typeInput = document.getElementById("create-type");
//@ POST /trees
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const plantData = {
    name: document.getElementById("create-name").value,
    height: document.getElementById("create-height").value,
    type: document.getElementById("create-type").value,
  };
  fetch("http://localhost:3000/trees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plantData),
  })
    .then((res) => res.json())
    .then(() => form.reset());
});

//@ GET /trees

function fetchTrees() {
  fetch("http://localhost:3000/trees")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("tableBody");
      tableBody.innerHTML = "";
      if (data.length === 0) {
        document.getElementById(
          "messages"
        ).innerHTML = `<h2>No data found</h2>`;
        table.style.display = "none";
      } else {
        data.forEach((el, index) => {
          let row = document.createElement("tr");
          row.id = `row-${el.id}`;
          row.innerHTML = `
          <td>${index + 1}</td>
          <td>${el.name}</td>
          <td>${el.height}</td>
          <td>${el.type}</td>
          <td>
          <button class="edit" data-id="${el.id}">EDIT</button>
          <button class="delete" data-id="${el.id}">DELETE</button>
          </td>`;
          tableBody.appendChild(row);
        });
      }
    });
}

//@ DELETE /trees/:id
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    const treeID = e.target.getAttribute("data-id");
    console.log(treeID);
    fetch("http://localhost:3000/trees/" + treeID, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        fetchTrees();
        window.location.href = "/index.html";
        // updateButton.style.display = "none";
        // createButton.style.display = "inline-block";
      });
  }
});

//@ GET /trees/:id
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    const treeID = e.target.getAttribute("data-id");
    console.log(treeID);
    window.history.pushState(null, "", `/?treeID=${treeID}`);
    fetch("http://localhost:3000/trees/" + treeID)
      .then((res) => res.json())
      .then((data) => {
        nameInput.value = data.name;
        heightInput.value = data.height;
        typeInput.value = data.type;
        createButton.style.display = "none";
        updateButton.style.display = "inline-block";
        updateButton.setAttribute("data-id", treeID);

        const deletebtn = document.querySelectorAll(".delete");
        console.log(deletebtn);
        deletebtn.forEach((el) => el.setAttribute("disabled", true));
      });
  }
});

// @PUT
updateButton.addEventListener("click", (e) => {
  const treeID = e.target.getAttribute("data-id");
  const updatedData = {
    name: nameInput.value,
    height: heightInput.value,
    type: typeInput.value,
  };
  console.log(updatedData);
  fetch(`http://localhost:3000/trees/${treeID}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(updatedData),
  })
    .then((res) => res.json())
    .then(() => {
      updateButton.style.display = "none";
      createButton.style.display = "inline-block";
      form.reset();
      window.location.href = "/index.html";
    });
});

fetchTrees();
