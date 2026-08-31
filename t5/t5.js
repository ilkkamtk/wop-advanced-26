const apiURL = 'https://media1.edu.metropolia.fi/restaurant/api/v1';

const menuDialog = document.querySelector('#menu');

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

let restaurants = [];

const distance = (restaurantLocation, myLocation) => {
  return Math.sqrt(
    (restaurantLocation[0] - myLocation[0]) ** 2 +
      (restaurantLocation[1] - myLocation[1]) ** 2
  );
};

async function getRestaurants() {
  try {
    // eslint-disable-next-line no-undef
    restaurants = await fetchData(apiURL + '/restaurants');
    navigator.geolocation.getCurrentPosition(success, error, options);
  } catch (error) {
    console.error(error.message);
  }
}

function renderRestaurants() {
  const target = document.querySelector('table');

  for (const restaurant of restaurants) {
    const {name, address, company, city, phone, _id} = restaurant;
    const tr = document.createElement('tr');

    const nameTd = document.createElement('td');
    nameTd.innerText = name;

    const addressTd = document.createElement('td');
    addressTd.innerText = address;

    const companyTd = document.createElement('td');
    companyTd.innerText = company;

    const cityTd = document.createElement('td');
    cityTd.innerText = city;

    tr.append(nameTd, addressTd, companyTd, cityTd);

    // klikkieventti, näytä ravintolan tiedot dialogissa
    tr.addEventListener('click', async () => {
      for (const rivi of document.querySelectorAll('tr')) {
        rivi.classList.remove('highlight');
      }

      tr.classList.add('highlight');

      // let puhelin = '';
      // // jos ei ole puhelinnumeroo
      // if (restaurant.phone === '-') {
      //   puhelin = 'Ei puhelinta';
      // } else {
      //   puhelin = restaurant.phone;
      // }

      menuDialog.innerHTML = '';
      let modalHTMl = `
      <div>
      <h3>${name}</h3>
      <p>${phone === '-' ? 'Ei puhelinta' : phone}</p>
      </div>
      `;
      // hae päivän menu ***
      // eslint-disable-next-line no-undef
      const dailyMenu = await fetchData(
        `${apiURL}/restaurants/daily/${_id}/fi`
      );
      console.log(dailyMenu.courses);
      modalHTMl += `
       <table>
        <tr>
          <th>Course</th>
          <th>Price</th>
          <th>Diets</th>
        </tr>
       `;
      for (const course of dailyMenu.courses) {
        const {name, price, diets} = course;
        modalHTMl += `
          <tr>
            <td>${name}</td>
            <td>${price ?? 'Ei hintaa'}</td>
            <td>${diets}</td>
          </tr>
        `;
      }
      modalHTMl += '</table>';

      console.log(modalHTMl);
      // *******************
      menuDialog.insertAdjacentHTML('beforeend', modalHTMl);
      menuDialog.showModal();
    });

    target.append(tr);
  }
}

// A function that is called when location information is retrieved
function success(pos) {
  const crd = pos.coords;

  // Printing location information to the console
  console.log(crd);

  restaurants.sort(function (a, b) {
    const etaisyysA = distance(a.location.coordinates, [
      crd.longitude,
      crd.latitude,
    ]);

    const etaisyysB = distance(b.location.coordinates, [
      crd.longitude,
      crd.latitude,
    ]);

    return etaisyysA - etaisyysB;
  });
  renderRestaurants();
}

// Function to be called if an error occurs while retrieving location information
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  renderRestaurants();
}

getRestaurants();
