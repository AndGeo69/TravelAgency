
document.getElementById("signUpBtn").addEventListener('click', async function (evt) {
    evt.preventDefault();
    await signUp();
});

document.getElementById("signInBtn").addEventListener('click', async function (evt) {
    evt.preventDefault();
    await signIn();
});

document.getElementById("redirectSignUpBtn").addEventListener('click', function (evt) {
    toggleShowables(document.getElementById("signup"));
    updateParagraph(document.getElementById("signup"));
    closeResponseContainer();
});

document.getElementById("addTripBtn").addEventListener('click', async function (evt) {
    evt.preventDefault();
    await addTrip();
});

document.getElementById("trips-table").addEventListener('click', async function (evt) {
    evt.preventDefault();
    await getAvailableTripsAndLoadTable();
});

document.getElementById("my-trips-table").addEventListener('click', async function (evt) {
    evt.preventDefault();
    await getMyTrips();
});


function addListenerOnNavBarBtns() {
    const navElem = document.getElementById("navId");

    Array.from(navElem.children).forEach((el) => {
        el.addEventListener('click', function (evt) {
            toggleShowables(evt.target);
            updateParagraph(evt.target);
            closeResponseContainer();
        });
    });
}

addListenerOnNavBarBtns();
toggleElementById("trip-register");

function toggleShowables(trg) {
    var elems = document.querySelectorAll(".showable");
    elems.forEach(element => {
        element.style.display = 'none';
    });
    var styling = "block";
    if (trg.id.includes("table")) {
        styling = "table"
    }
    document.getElementById(trg.id + '-form').style.display = styling;
}

function updateParagraph(source) {
    document.getElementById("introParagraph").innerText = source.innerText;
}

function addRequiredOnAllInputs() {
    const inputFields = document.querySelectorAll('input');

    inputFields.forEach((input) => {
        input.setAttribute('required', true);
    });
}

// addRequiredOnAllInputs(); //TODO uncomment to enable required fields

// <!-- remove when server is functional-->
var tripTestData = JSON.stringify([
    {
        "startLocation": "Paris",
        "endLocation": "Paris",
        "startDate": "2023-12-10",
        "endDate": "2023-12-15",
        "agency": "Adventure Tours",
        "slotsLeft": "15",
        "schedule": "Explore the city of love"
    },
    {
        "startLocation": "Tokyo",
        "endLocation": "Tokyo",
        "startDate": "2023-11-20",
        "endDate": "2023-11-25",
        "agency": "Discover Japan",
        "slotsLeft": "15",
        "schedule": "Visit historical landmarks"
    },
    {
        "startLocation": "New York",
        "endLocation": "New York",
        "startDate": "2023-10-05",
        "endDate": "2023-10-10",
        "agency": "Big Apple Adventures",
        "slotsLeft": "15",
        "schedule": "Experience the city that never sleeps"
    },
    {
    "startLocation": "Thessaloniki",
    "endLocation": "Thessaloniki",
    "startDate": "2023-10-05",
    "endDate": "2023-10-10",
    "agency": "Saloniki tours",
    "slotsLeft": "15",
    "schedule": "Experience the city that never sleeps"
    }
]);



async function makePostApiCall(data, endpoint) {
    toggleSpinner();
    var response;
    try {
        response = await $.ajax({
            url: "http://localhost:8080/" + endpoint,
            contentType: "application/json",
            type: "POST",
            data: data,
        });
    } catch (err) {
        displayResponseMessage(err);
    } finally {
        toggleSpinner();
        return response;
    }
}

function handleApiResponse(response) {
    var msg;
    if (response != null) {
        if (response.responseText != null) {
            msg = handleJsonResponse(response);
        } else {
            return response;
        }
        displayResponseMessage(msg);
    } else {
        displayResponseMessage("Erron occured or null reponse from api call.");
    }
}

function handleAuthResponse(response) {
    var msg;
    if (response != null) {
        if (response.responseText != null) {
            msg = handleJsonResponse(response);
        } else {
            msg = "Welcome " + response.type + " " + response.name;
            loggedInUser = response;
            handleLoggedInUser();
        }
        displayResponseMessage(msg);
    } else {
        displayResponseMessage("All fields are required.");
    }
}

async function signUp() {
    let data = JSON.stringify({
        "id": document.getElementById("signup-id").value,
        "name": document.getElementById("signup-name").value,
        "email": document.getElementById("signup-email").value,
        "password": document.getElementById("signup-password").value,
        "userType": document.getElementById("signUp-user-type").value
    });

    await signUpAsync(data);
}

async function signUpAsync(data) {
    var response = await makePostApiCall(data, "signup");
    handleAuthResponse(response);
    clearFormFields("signup-form");
}

var loggedInUser;

async function signIn() {

    let data = JSON.stringify({
        "id": document.getElementById("signin-id").value,
        "password": document.getElementById("signin-password").value,
        "userType": getSelectedUserType()
      });

    await signInAsync(data);
}

async function signInAsync(data) {
    var response = await makePostApiCall(data, "signin");
    handleAuthResponse(response);
    clearFormFields("signin-form");
}

//TODO remove this, added for easier debugging
toggleElementById("trip-register");


function handleLoggedInUser() {
    if (loggedInUser != null) {
        if (loggedInUser.type.toLowerCase() == "agency") {
            // toggleElementById("trip-register");
            //TODO uncomment this, added for easier debugging
        }
        toggleElementById("signin");
        toggleElementById("signup");   
        toggleElementById("my-trips-table");   
         
        toggleShowables(document.getElementById("trips-table"))
        populateMyTripsTable(myTripsTestData);
    }
}

function populateMyTripsTable(dataToPopulateTable) {
    //TODO adjust test data to user / agency my trips accordingly
    updateTable(dataToPopulateTable, "my-trips-table-form");
}

function isElemDisplayed(elemId) {
    return document.getElementById(elemId).style.display != "none";
}

function getSelectedUserType() {
    // Get all radio buttons with the name "user-type"
    const userTypeRadios = document.getElementsByName('signin-user-type');

    // Loop through the radio buttons to find the selected one
    let selectedUserType;
    for (const radio of userTypeRadios) {
        if (radio.checked) {
            selectedUserType = radio.value;
            break;
        }
    }

    return selectedUserType;
}

function clearFormFields(formId) {
    const form = document.getElementById(formId);

    // Check if the form exists
    if (form) {
        // Get all input and select elements within the form
        const inputElements = form.querySelectorAll('input');

        // Iterate over each input element and reset its value
        inputElements.forEach((element) => {
            if (element.type !== 'radio' && element.type !== 'button' && element.type !== 'submit' && element.type !== 'reset') {
                // Clear the value for text fields, email fields, and select elements
                element.value = '';
            }
        });
    }
}

function handleJsonResponse(response) {
    var msg;
    if (response != null) {
        if (response.responseText != null && response.responseText != "") {
            responseMessageJson = jQuery.parseJSON(response.responseText);
            if (responseMessageJson.errors != null) {
                return responseMessageJson.errors.message;
            } else {
                return responseMessageJson.data;
            } 
        }
    }
}

function displayResponseMessage(message) {
    if (message == null) {
        return;
    }
    const responseContainer = document.getElementById('response-container');
    const responseMessage = document.getElementById('response-message');

    // Set the message text
    responseMessage.textContent = message;

    // Show the container
    responseContainer.style.display = 'block';
}

function updateText(text) {
    document.getElementById('introParagraph').innerHTML = text;
}

function closeResponseContainer() {
    document.getElementById('response-container').style.display = 'none';
}

function updateTable(json, tableId) {
    result = jQuery.parseJSON(json);
    var table = document.getElementById(tableId);

    var rowCount = table.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    for(var k in result) {
        var trip = result[k];

        startLoc = trip.startLocation;
        endLoc = trip.endLocation;
        startDate = trip.startDate;
        endDate = trip.endDate;
        agency = trip.agency;
        slotsLeft = trip.slotsLeft;
        schedule = trip.schedule;

        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);

        cell1.innerHTML = startLoc;
        cell2.innerHTML = endLoc;
        cell3.innerHTML = startDate;
        cell4.innerHTML = endDate;
        cell5.innerHTML = agency;
        cell6.innerHTML = slotsLeft;
        cell7.innerHTML = schedule;
    }
}

function updateTableWithJsonObject(tripList, tableId) {
    if (tripList == null) {
        return;
    }
    var table = document.getElementById(tableId);

    // Clear existing rows
    var rowCount = table.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    // Add new rows from the tripList
    tripList.forEach(trip => {
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);

        cell1.innerHTML = trip.startLocation;
        cell2.innerHTML = trip.endLocation;
        cell3.innerHTML = trip.startDate;
        cell4.innerHTML = trip.endDate;
        cell5.innerHTML = trip.agencyName;
        cell6.innerHTML = trip.availableCapacity;
        cell7.innerHTML = trip.schedule;
    });
}

// updateTable(tripTestData, "trips-table-form");
getAvailableTripsAndLoadTable();

//another way to make rest calls, using js's fetch
async function getAvailableTrips() {
    try {
        const response = await fetch('http://localhost:8080/trip/getAvailableTrips');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (error) {
        console.error('Error fetching available trips:', error);
        return null; // Handle error appropriately in your application
    }
}

function getAvailableTripsAndLoadTable() {
    getAvailableTrips().then(response => {
        if (response) {
            updateTableWithJsonObject(response, "trips-table-form");
            console.log('Available Trips:', response);
        } else {
            // Handle error
            console.log('Failed to fetch available trips.');
        }
    });
}


function toggleElementById(id) {
    var elem = document.getElementById(id);
    if (elem.style.display == 'none') {
        elem.style.display = 'inline-block';
    } else {
        elem.style.display = 'none';
    }
}

function toggleSpinner() {
    toggleElementById("spinner");
}

//TODO my trip test data - remove
var myTripsTestData = JSON.stringify([
    {
        "startLocation": "Paris",
        "endLocation": "Paris",
        "startDate": "2023-12-10",
        "endDate": "2023-12-15",
        "agency": "Adventure Tours",
        "slotsLeft": "15",
        "schedule": "Explore the city of love"
    },
    {
    "startLocation": "Thessaloniki",
    "startLocation": "Thessaloniki",
    "startDate": "2023-10-05",
    "endDate": "2023-10-10",
    "agency": "Saloniki tours",
    "slotsLeft": "15",
    "schedule": "Experience the city that never sleeps"
    }
]);


document.getElementById("travel-form").addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('Form submitted!');
});

document.getElementById("textAreaSchedule").addEventListener("keydown", (e) => {
    if(!((e.code > 95 && e.code < 106)
        || (e.code > 47 && e.code < 58) 
        || e.code == 8)) {
        return false;
    }
})

async function addTrip() { // TO be tested
    let data = JSON.stringify({
        "tripId": "",
        "availableCapacity": document.getElementById("tripMaxCapacity").value,
        "startDate": document.getElementById("start-date").value,
        "endDate": document.getElementById("end-date").value,
        "startLocation": document.getElementById("startLocation").value,
        "endLocation": document.getElementById("endLocation").value,
        "agencyId": loggedInUser.id,
        "schedule": document.getElementById("textAreaSchedule").value,
        
    });


    await addTripAsync(data);
}

async function addTripAsync(tripJson) {
    var response = await makePostApiCall(tripJson, "trip/addTrip");
    var tripResource = handleApiResponse(response);
    if (tripResource != null) {
        displayResponseMessage("Successfully added trip " + tripResource.tripId);
    }
    // clearFormFields("travel-form");
}

async function getMyTrips() { // TO be tested
    if (loggedInUser == null) {
        return;
    }
    let data = JSON.stringify(
        loggedInUser.id
    );


    await getMyTripsAsync(data);
}

async function getMyTripsAsync(tripJson) {
    var response = await makePostApiCall(tripJson, "trip/getBookedTrips");
    var tripResource = handleApiResponse(response);
    updateTableWithJsonObject(response, "my-trips-table-form");
    // clearFormFields("travel-form");
}
