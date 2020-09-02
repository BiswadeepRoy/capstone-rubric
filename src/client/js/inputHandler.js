function handleInput(event) {

    // Taking the user inputs
    let date = document.getElementById('date').value;
    let city = document.getElementById('city').value;

    let enteredDate = new Date(date);
    let currentDate = new Date();

    // To calculate the time difference of two dates 
    var differenceInTime = enteredDate.getTime() - currentDate.getTime();

    // To calculate the no. of days between two dates 
    var differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    console.log(" " + city + " " + differenceInDays + " " + date);

}

export { handleInput }