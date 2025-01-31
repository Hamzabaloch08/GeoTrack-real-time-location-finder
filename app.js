const allowLocationButton = document.querySelector('.tracker-button');
const infoBox = document.querySelector('.info-box');
const locationInfo = document.querySelector('#location-info');
const loader = document.querySelector('#loader'); // Loader element
const closeBtn = document.querySelector('#closeBtn');

// Function to get user's position
const getPosition = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by this browser."));
        } else {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        }
    });
};

// When the button is clicked
allowLocationButton.addEventListener('click', () => {
  allowLocationButton.style.display = 'none'; // Hide the button
  infoBox.style.display = 'block'; // Show the info box
  loader.style.display = 'block'; // Show the loader

  getPosition().then(async (response) => {
    const { coords } = response;
    const { latitude, longitude } = coords;
    let key = '577631871473506132023x46911'
    const location = await fetch(
      `https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=${key}`
    );
    const locationJSON = await location.json();

    // Hide loader after data is fetched
    loader.style.display = 'none'; 

    // Display location information
    locationInfo.innerHTML = `
      <p><strong>Country:</strong> ${locationJSON.country || 'N/A'}</p>
      <p><strong>City:</strong> ${locationJSON.city || 'N/A'}</p>
      <p><strong>Region:</strong> ${locationJSON.region || 'N/A'}</p>
      <p><strong>Street 1:</strong> ${locationJSON.intersection?.street1 || 'N/A'}</p>
      <p><strong>Street 2:</strong> ${locationJSON.intersection?.street2 || 'N/A'}</p>
      <p><strong>Addresst:</strong> ${locationJSON.standard?.addresst || 'N/A'}</p>
      <p><strong>Postal Code:</strong> ${locationJSON.postal || 'N/A'}</p>
      <p><strong>Timezone:</strong> ${locationJSON.timezone || 'N/A'}</p>
    `;
  }).catch((error) => {
    console.log('Geolocation error: ', error);
    loader.style.display = 'none'; // Hide loader in case of error
    locationInfo.innerHTML = `<p>Error: Unable to retrieve location. ${error.message}</p>`;
    allowLocationButton.style.display = 'block'; // Show button again if there's an error
  });
});

// Close the info box and show the button again
closeBtn.addEventListener('click', () => {
  infoBox.style.display = 'none'; // Hide the info box
  allowLocationButton.style.display = 'block'; // Show the button again
});
