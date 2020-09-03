let date;
let differenceInDays;

function handleInput(event) {

    // Taking the user inputs
    date = document.getElementById('date').value;
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

    console.log(" " + city + " " + differenceInDays + " " + date);

    postDetails(city, differenceInDays).then(function() {
        getDetailsAndUpdateUI();
    });

}

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

const getDetailsAndUpdateUI = async() => {
    const response = await fetch('http://localhost:8080/getdetails');
    const results = document.getElementById('weatherDetails');
    const image = document.getElementById('imageurl');
    const errors = document.getElementById('errorresponse');
    try {
        const responseData = await response.json();
        if (typeof(responseData.body.error_message) == 'undefined') {
            results.style = `background-image: none`;
            results.innerHTML = `<h1>Your trip to ${responseData.body.city}, ${responseData.body.country} is due in
            ${differenceInDays} day(s) on ${date}</h1>
            <h3>Weather conditions on ${date}</h3>
            Max temp: ${responseData.body.max_temp}<br>
            Min temp: ${responseData.body.min_temp}
            <br>${responseData.body.description}`;
            image.style.backgroundImage = `url(${responseData.body.image_url})`;
            errors.textContent = ``;
            errors.style.backgroundColor = `#e6eeff`;
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
    }
}

export { handleInput }