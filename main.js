const buttons = document.querySelectorAll('.planetButton');

selectedPlanet = "earth";

function storeButtonValue(event) {
  buttonValue = event.target.value;
  localStorage.setItem('selectedPlanet', buttonValue);
  window.location.href = "index (1).html"
}

buttons.forEach(button => {
  button.addEventListener('click', storeButtonValue);
});
