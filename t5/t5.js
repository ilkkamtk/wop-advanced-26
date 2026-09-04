import {restaurantRow} from './components.js';
import {fetchData} from './t4.js';

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
    restaurants = await fetchData(apiURL + '/restaurants');
    navigator.geolocation.getCurrentPosition(success, error, options);
  } catch (error) {
    console.error(error.message);
  }
}

function renderRestaurants() {
  const target = document.querySelector('table');

  restaurants.forEach((restaurant) => {
    const tr = restaurantRow(restaurant);

    // klikkieventti, näytä ravintolan tiedot dialogissa
    tr.addEventListener('click', async () => {
      document.querySelectorAll('tr').forEach((rivi) => {
        rivi.classList.remove('highlight');
      });

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
      <p>${restaurant.phone === '-' ? 'Ei puhelinta' : restaurant.phone}</p>
      </div>
      `;
      // hae päivän menu ***
      const dailyMenu = await fetchData(
        `${apiURL}/restaurants/daily/${restaurant._id}/fi`
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
      dailyMenu.courses.forEach((course) => {
        console.log(course);
        const {name, price, diets} = course;
        modalHTMl += `
          <tr>
            <td>${name}</td>
            <td>${price ?? 'Ei hintaa'}</td>
            <td>${diets.map((diet) => {
              switch (diet) {
                case 'ILM':
                  return '&#9760;';
                case 'L':
                  return '&#128004;';
                default:
                  return diet;
              }
            })}</td>
          </tr>
        `;
      });

      modalHTMl += '</table>';

      console.log(modalHTMl);
      // *******************
      menuDialog.insertAdjacentHTML('beforeend', modalHTMl);
      menuDialog.showModal();
    });

    target.append(tr);
  });
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
