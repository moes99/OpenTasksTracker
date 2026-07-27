const btn = document.getElementById("addTaskBtn");
btn.addEventListener("click", () => {
  //change body background color to light blue
  document.body.style.backgroundColor == "lightblue"
    ? (document.body.style.backgroundColor = "white")
    : (document.body.style.backgroundColor = "lightblue");
});
