const state = document.querySelector("#state");
const city = document.querySelector("#city");
const localGovernment = document.querySelector("#localGovernment");

const updateCity = () => {
  city.innerHTML = "";

  if (state.value && nigeriaData[state.value]) {
    nigeriaData[state.value].cities.forEach((cityName) => {
      const optionElement = document.createElement("option");
      optionElement.value = cityName;
      optionElement.textContent = cityName;
      if (cityName === form.city) optionElement.selected = true;
      city.appendChild(optionElement);
      city.disabled = false;
    });
  }
};

const updateLocalGovernment = () => {
  localGovernment.innerHTML = "";

  if (state.value && nigeriaData[state.value]) {
    nigeriaData[state.value].lgas.forEach((localGovernmentName) => {
      const optionElement = document.createElement("option");
      optionElement.value = localGovernmentName;
      optionElement.textContent = localGovernmentName;
      if (localGovernmentName === form.localGovernment)
        optionElement.selected = true;
      localGovernment.appendChild(optionElement);
      localGovernment.disabled = false;
    });
  }
};

// Populate the states dropdown
for (const stateName in nigeriaData) {
  const stateOption = document.createElement("option");
  stateOption.value = stateName;
  stateOption.text = stateName;
  if (stateName === form.state) stateOption.selected = true;
  state.add(stateOption);
  if (form !== "") {
    updateCity();
    updateLocalGovernment();
  }
}

// Attach event listener for the state dropdown AFTER populating the states
state.addEventListener("change", updateCity);
state.addEventListener("change", updateLocalGovernment);
