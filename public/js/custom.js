// const state = document.querySelector("#state");
// const city = document.querySelector("#city");
// const localGovernment = document.querySelector("#localGovernment");

// const updateCity = () => {
//   city.innerHTML = "";

//   if (state.value && nigeriaData[state.value]) {
//     nigeriaData[state.value].cities.forEach((cityName) => {
//       const optionElement = document.createElement("option");
//       optionElement.value = cityName;
//       optionElement.textContent = cityName;
//       if (cityName === form.city) optionElement.selected = true;
//       city.appendChild(optionElement);
//       city.disabled = false;
//     });
//   }
// };

// const updateLocalGovernment = () => {
//   localGovernment.innerHTML = "";

//   if (state.value && nigeriaData[state.value]) {
//     nigeriaData[state.value].lgas.forEach((localGovernmentName) => {
//       const optionElement = document.createElement("option");
//       optionElement.value = localGovernmentName;
//       optionElement.textContent = localGovernmentName;
//       if (localGovernmentName === form.localGovernment)
//         optionElement.selected = true;
//       localGovernment.appendChild(optionElement);
//       localGovernment.disabled = false;
//     });
//   }
// };

// Populate the states dropdown
// for (const stateName in nigeriaData) {
//   const stateOption = document.createElement("option");
//   stateOption.value = stateName;
//   stateOption.text = stateName;
//   if (stateName === form.state) stateOption.selected = true;
//   state.add(stateOption);
//   if (form !== "") {
//     updateCity();
//     updateLocalGovernment();
//   }
// }

// Attach event listener for the state dropdown AFTER populating the states
// state.addEventListener("change", updateCity);
// state.addEventListener("change", updateLocalGovernment);

const countrySelect = document.querySelector("#country");
const stateSelect = document.querySelector("#stateOfOrigin");

const updateStateSelect = () => {
  const allStates = states?.filter(
    (currentSate) => currentSate.countryCode === countrySelect.value
  );

  stateSelect.disabled = false;
  stateSelect.innerHTML = "";
  allStates.forEach((state) => {
    const option = document.createElement("option");
    option.value = state.name;
    option.text = state.name;
    if (form.stateOfOrigin === state.name || userState === state.name)
      option.selected = true;
    stateSelect.appendChild(option);
  });
};

if (form !== "" && states !== "") updateStateSelect();
if (userState !== "" && states !== "") updateStateSelect();
if (countrySelect) countrySelect.addEventListener("change", updateStateSelect);

// Helper function to format file size in human-readable format (e.g., KB, MB)
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Reusable helper function to display Bootstrap file size error modal
function showFileSizeError(message) {
  const msgEl = document.getElementById("fileSizeModalMessage");
  if (msgEl && message) {
    msgEl.textContent = message;
  }
  const modalEl = document.getElementById("fileSizeModal");
  if (modalEl) {
    modalEl.style.zIndex = "1070";
    if (window.bootstrap) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    } else if (typeof $ !== "undefined" && $.fn.modal) {
      $(modalEl).modal("show");
    } else {
      console.warn("fileSizeModal element or Bootstrap library not available.");
      return;
    }

    setTimeout(() => {
      const backdrops = document.querySelectorAll(".modal-backdrop");
      if (backdrops.length > 1) {
        backdrops[backdrops.length - 1].style.zIndex = "1065";
      }
    }, 50);
  }
}

// Global client-side file size validation to prevent 413 Request Entity Too Large and Multer limits
document.addEventListener("change", function(event) {
  if (event.target && event.target.type === "file") {
    const file = event.target.files[0];
    if (file && file.size > 2000000) { // 2MB limit
      const formattedSize = formatFileSize(file.size);
      showFileSizeError(`Selected file size (${formattedSize}) exceeds the 2MB limit. Please upload a smaller image.`);
      event.target.value = ""; // Clear file input
    }
  }
});
