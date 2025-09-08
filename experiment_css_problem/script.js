const ul = document.getElementById("hello-list");

const li = document.createElement("li");
li.textContent = "Hello World";

Array.from({ length: 24 }).map((_, index) =>
  ul.appendChild(li.cloneNode(true))
);
