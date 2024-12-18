const form = document.getElementById("tree-form");

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
    .then((data) => {});
}
fetchTrees();
