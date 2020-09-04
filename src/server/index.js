//Importing different libraries
const express = require('express');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
dotenv.config();
const cors = require('cors');
const bodyParser = require('body-parser');

//Empty JS object to contain the data
projectData = {
    city: 'pune',
    days: 5
};

//Setting up express server
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));


//Listening to port number
const port = 8080;
app.listen(port, function() {
    console.log('App is listening on localhost:' + port);
})

//Post call
app.post('/postdetails', handlePostDetails);

// Callback function to complete POST '/postdata'
function handlePostDetails(req, res) {
    projectData = req.body;
    console.log("The request is received" + JSON.stringify(projectData));
    res.send({
        message: "Data successfully recieved"
    });
}

//Get call
app.get('/getdetails', generateAPICallData);

// Callback function to complete GET '/getdata'
function generateAPICallData(req, res) {
    console.log(projectData);
    getCountry(projectData.city).then(function(country) {
        let days = projectData.days;
        return getWeather(projectData.city, country, projectData.days);
    }).then(function(returnvalue) {
        return getImage(returnvalue);
    }).then(function(finalvalue) {
        return {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: finalvalue
        };
    }).then(function(response) {
        console.log("The return value is " + JSON.stringify(response));
        res.send(JSON.stringify(response));
    });

}

//Async function to get country
const getCountry = async(city) => {
    const response = await fetch(`http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${process.env.geonamesUSER_NAME}`);
    try {
        const responseData = await response.json();
        const countryID = responseData.geonames[0].countryName;
        return countryID;

    } catch (error) {
        console.log(error);
        return {
            error_message: JSON.stringify(error)
        };
    }
}

//Async function to get weather
const getWeather = async(city = '', country = '', days) => {
    const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city},${country}&key=${process.env.weatherbitAPI_KEY}&units=M&days=${days}`);
    try {
        const responseData = await response.json();
        const requestedData = responseData.data[responseData.data.length - 1];
        let date = new Date();
        date.setDate(date.getDate() + days);
        return {
            max_temp: requestedData.max_temp,
            min_temp: requestedData.min_temp,
            description: requestedData.weather.description,
            city: city,
            country: country,
            date: date
        };

    } catch (error) {
        console.log(error);
        return {
            error_message: JSON.stringify(error)
        };
    }
}

//Async function to get image
const getImage = async(requestedData = {}) => {
    const response = await fetch(`https://pixabay.com/api/?key=${process.env.pixabayAPI_KEY}&q=${requestedData.city}&image_type=photo`);
    try {
        if (requestedData.error_message != null) {
            throw requestedData.error_message;
        }
        const responseData = await response.json();
        const imageURL = responseData.hits[0].webformatURL;
        return {
            max_temp: requestedData.max_temp,
            min_temp: requestedData.min_temp,
            description: requestedData.description,
            image_url: imageURL,
            city: requestedData.city,
            country: requestedData.country,
            date: requestedData.date,
        };

    } catch (error) {
        console.log(error);
        return {
            error_message: JSON.stringify(error)
        };
    }
}