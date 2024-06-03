const buttons = document.querySelectorAll('.planetButton');

selectedPlanet = "first guild";

function storeButtonValue(event) {
  buttonValue = event.target.value;
  localStorage.setItem('selectedPlanet', buttonValue);
  window.location.href = "/fetch data page/index.html"
}

buttons.forEach(button => {
  button.addEventListener('click', storeButtonValue);
});