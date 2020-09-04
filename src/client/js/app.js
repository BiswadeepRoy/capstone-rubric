import 'regenerator-runtime/runtime'
const fetch = require('node-fetch');

let date;
let differenceInDays;
let tripend;
let tripduration;

let dateNow = new Date();
let dateValue = new Date(dateNow);
const initialDateValue = dateValue.toISOString().slice(0, 10); //generating initial value of start date input
dateValue.setDate(dateValue.getDate() + 16);
const finalDateValue = dateValue.toISOString().slice(0, 10); //generating final value of start date input

//Function to initialize DOM elements.
function init() {
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById('date').min = initialDateValue;
        document.getElementById('date').max = finalDateValue;
        const results = document.getElementById('weatherDetails');
        const image = document.getElementById('imageurl');
        if (localStorage.getItem("max_temp") != null && localStorage.getItem("min_temp") != null && localStorage.getItem("image_url") != null) {
            let country = localStorage.getItem("country");
            let city = localStorage.getItem("city");
            let max_temp = localStorage.getItem("max_temp");
            let min_temp = localStorage.getItem("min_temp");
            let image_url = localStorage.getItem("image_url");
            let description = localStorage.getItem("description");
            let tripduration = localStorage.getItem("tripduration");
            let startdate = localStorage.getItem("startdate");
            let enddate = localStorage.getItem("enddate");
            let enteredDate = new Date(startdate);
            let currentDate = new Date();

            // To calculate the time difference of two dates 
            let differenceInTime = enteredDate.getTime() - currentDate.getTime();

            // To calculate the no. of days between two dates 
            differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

            resultsSetter(results, image, country, description, city, max_temp, min_temp, image_url, differenceInDays, startdate, enddate, tripduration);

        }
    });
}

//Function to update the return date dynamically
function setEndDate(event) {
    let enddate = document.getElementById("dateend");
    let givendate = document.getElementById("date").value;
    enddate.disabled = false;
    enddate.min = givendate;
    enddate.value = givendate;
}

//Function to handleInput and generate the results.
function handleInput(event) {

    // Taking the user inputs
    date = document.getElementById('date').value;
    tripend = document.getElementById("dateend").value;

    let city = document.getElementById('city').value;

    // Starting loaders
    document.getElementById('imageurl').style = `background-image: url("https://flevix.com/wp-content/uploads/2020/01/Preloader.gif");`;
    document.getElementById('weatherDetails').style = `background-image: url("https://flevix.com/wp-content/uploads/2020/01/Preloader.gif");`;
    document.getElementById('weatherDetails').textContent = ``;

    let enteredDate = new Date(date);
    let currentDate = new Date();

    // To calculate the time difference of two dates 
    let differenceInTime = enteredDate.getTime() - currentDate.getTime();

    // To calculate the no. of days between two dates 
    differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    if (tripend === date) {
        tripduration = 1;
    } else {
        currentDate = new Date(date);
        enteredDate = new Date(tripend);

        differenceInTime = enteredDate.getTime() - currentDate.getTime();

        // To calculate the no. of days between two dates 
        tripduration = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    }


    postDetails(city, differenceInDays).then(function() {
        getDetailsAndUpdateUI();
    });

}

//Async function to send details of user to server.
const postDetails = async(cityName = '', daysValue) => {
    const response = await fetch('http://localhost:8080/postdetails', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            city: cityName,
            days: daysValue
        })
    });

    try {
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.log('Post request error', error);
    }
}

//Async function to fetch location and weather details of user from server
const getDetailsAndUpdateUI = async() => {
    let responseData = {};
    const response = await fetch('http://localhost:8080/getdetails');
    const results = document.getElementById('weatherDetails');
    const image = document.getElementById('imageurl');
    const errors = document.getElementById('errorresponse');
    try {
        responseData = await response.json();
        if (typeof(responseData.body.error_message) == 'undefined') {
            results.style = `background-image: none`;
            resultsSetter(results, image, responseData.body.country, responseData.body.description, responseData.body.city, responseData.body.max_temp, responseData.body.min_temp, responseData.body.image_url, differenceInDays, date, tripend, tripduration);
            errors.textContent = ``;
            errors.style.backgroundColor = `#f0e6ff`;
            localStorage.setItem("country", responseData.body.country);
            localStorage.setItem("city", responseData.body.city);
            localStorage.setItem("description", responseData.body.description);
            localStorage.setItem("max_temp", responseData.body.max_temp);
            localStorage.setItem("min_temp", responseData.body.min_temp);
            localStorage.setItem("image_url", responseData.body.image_url);
            localStorage.setItem("tripduration", tripduration);
            localStorage.setItem("startdate", date);
            localStorage.setItem("enddate", tripend);

        } else {

            console.log("error is " + responseData.body.error_message);
            throw responseData.body.error_message;
        }
    } catch (error) {
        results.style = `background-image: none`;
        results.textContent = ``;
        image.style = `background-image: none`;
        errors.innerHTML = `&#x26A0 Please check your data. We are not able to fetch any details from the server.`;
        errors.style.backgroundColor = `tomato`;
        errors.style.color = `white`;
        console.log(initialDateValue + " " + finalDateValue);
    } finally {
        return responseData;
    }
}


//Function to update the UI
function resultsSetter(results, image, country = '', description = '', city = '', max_temp = '', min_temp = '', url = '', days, date, tripend, tripduration) {
    results.style = `background-image: none`;
    results.innerHTML = `<h1>Your trip to ${city}, ${country} is due in
            ${days} day(s) on ${date} to ${tripend} for ${tripduration} day(s)</h1>
            <h3>Weather conditions on ${date}</h3>
            Max temp: ${max_temp}<br>
            Min temp: ${min_temp}
            <br>${description}`;
    image.style.backgroundImage = `url(${url})`;
}

export { handleInput }
export { init }
export { setEndDate }
export { postDetails }
export { getDetailsAndUpdateUI }