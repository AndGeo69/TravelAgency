
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

document.getElementById("close-icon").addEventListener('click', async function (evt) {
    closeResponseContainer()
});

document.getElementById("searchTripBtn").addEventListener('click', async function (evt) {
    evt.preventDefault();
    await searchTrip();
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

document.getElementById("start-date").addEventListener('change', function () {
    // Set the minimum date for end-date to be the selected start date
    document.getElementById("end-date").min = this.value;

    // Clear the end date value if it's less than the start date
    if (document.getElementById("end-date").value < this.value) {
        document.getElementById("end-date").value = "";
    }
});
document.getElementById("start-date").min = new Date().toISOString().split("T")[0];


addListenerOnNavBarBtns();
toggleElementById("trip-register");
toggleElementById("my-trips-table");

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

addRequiredOnAllInputs(); //TODO uncomment to enable required fields


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
    
        msg = handleJsonResponse(err);
        displayResponseMessage(msg);
        response = err;
    } 
    finally {
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
        displayResponseMessage("Error occured or null reponse from api call.");
    }
}

async function handleAuthResponse(response) {
    var msg;
    if (response != null) {
        if (response.responseText != null) {
            msg = handleJsonResponse(response);
        } else {
            msg = "Welcome " + response.type + " " + response.name;
            loggedInUser = response;
            handleLoggedInUser();
            await getAvailableTripsAndLoadTable();
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
    var jsonresponse = handleJsonResponse(response);
    var authresponse = handleAuthResponse(response);
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


function isAgency() {
    if (loggedInUser == null) {
        return false;
    }
    return loggedInUser.type.toLowerCase() == "agency";
}

function handleLoggedInUser() {
    if (loggedInUser != null) {
        if (isAgency()) {
            toggleElementById("trip-register");
        }
        toggleElementById("signin");
        toggleElementById("signup");   
        toggleElementById("my-trips-table");   
         
        toggleShowables(document.getElementById("trips-table"))
    }
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
    displayResponseMessage(message, false);
}

function displayConfirmationMessage(message) {
    displayResponseMessage(message, true);
}

function displayResponseMessage(message, isConfirmation) {
    if (message == null) {
        return;
    }
    const responseContainer = document.getElementById('response-container');
    const responseMessage = document.getElementById('response-message');

    // Set the message text
    responseMessage.textContent = message;

    // Show the container
    responseContainer.style.display = 'block';

    const confirmBtn = document.getElementById("confirmationBtn");
    if (isConfirmation) {
        confirmBtn.style.display = "inline-block";
    } else {
        confirmBtn.style.display = "none";
    }
}

function updateText(text) {
    document.getElementById('introParagraph').innerHTML = text;
}

function closeResponseContainer() {
    document.getElementById('response-container').style.display = 'none';
}

function updateTableWithJsonObject(tripList, tableId, isMyTrips) {
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

        if (!isMyTrips && !isAgency()) {
            row.id = 'tripRow_' + trip.tripId; // Assuming tripId is a unique identifier

            row.setAttribute('class', 'available-trips-rows');
            row.setAttribute('id', trip.tripId);
            
            // Add click listener to each row
            row.addEventListener('click', function (evt) {
                if (validateSignedIn()) {
                    showConfirmationDialog(trip);
                }
            });
        }

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

    if (!isMyTrips && !isAgency()) {
        document.querySelectorAll('.available-trips-rows').forEach((row) => {
            row.addEventListener('click', function(evt) {
                removeConfirmBtnEventListeners();
    
                document.getElementById("confirmationBtn")
                .addEventListener('click', async function (evt) {
                    console.log("before book trip");
                    bookTrip(row.id);
                    console.log("after book trip");
                    availableTripsAsync();
                    console.log("after avail trip async");
                });
            });
        })
    }
}

async function availableTripsAsync() {
    console.log("inside avail");
    await getAvailableTripsAndLoadTable();
}
function removeConfirmBtnEventListeners() {
    var confirmationBtn = document.getElementById("confirmationBtn");
    var newConfirmationBtn = confirmationBtn.cloneNode(true);
    confirmationBtn.parentNode.replaceChild(newConfirmationBtn, confirmationBtn);
}


// document.getElementById("confirmationBtn").addEventListener('click', async function (evt) {
//     bookTrip(trip);
//     getAvailableTripsAndLoadTable();
// });

function showConfirmationDialog(trip) {
    displayConfirmationMessage("Book trip of Agency: " +
     trip.agencyName + " from:  " + trip.startLocation + " to: " + trip.endLocation + " ?");
}

function validateSignedIn() {
    if (loggedInUser == null) {
        toggleShowables(document.getElementById("signin"))
        return false;
    } else {
        return true;
    }
}

async function bookTrip(tripId) { // TO be tested
    let data = JSON.stringify({
        "tripId": tripId,
        "userId": loggedInUser.id
    });


    await bookTripAsync(data);
}

async function bookTripAsync(tripJson) {
    var response = await makePostApiCall(tripJson, "trip/book");
    var tripResource = handleApiResponse(response);
    if (tripResource != null) {
        displayResponseMessage("Successfully booked trip " + tripResource.tripId);
    } else {
        displayResponseMessage("Trip is unavailable"); 
    }
}

// updateTable(tripTestData, "trips-table-form");
getAvailableTripsAndLoadTable();

//another way to make rest calls, using js's fetch
async function getAvailableTrips() {
    toggleSpinner();
    try {
        const response = await fetch('http://localhost:8080/trip/getAvailableTrips');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        toggleSpinner();
        return jsonResponse;
    } catch (error) {
        console.error('Error fetching available trips:', error);
        toggleSpinner();
        return null; // Handle error appropriately in your application
    }
    
}

async function getAvailableTripsAndLoadTable() {
    removeConfirmBtnEventListeners();
    getAvailableTrips().then(response => {
        if (response) {
            updateTableWithJsonObject(response, "trips-table-form", false);
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
    {
        "id":loggedInUser.id,
        "userType": loggedInUser.type
    }
        
    );


    await getMyTripsAsync(data);
}

async function getMyTripsAsync(tripJson) {
    var response = await makePostApiCall(tripJson, "trip/getBookedTrips");
    var tripResource = handleApiResponse(response);
    updateTableWithJsonObject(response, "my-trips-table-form", true);
}

async function searchTrip() { 
     let data = JSON.stringify({
        "availableCapacity": document.getElementById("search-tripMaxCapacity").value,
        "startDate": document.getElementById("search-start-date").value,
        "endDate": document.getElementById("search-end-date").value,
        "startLocation": document.getElementById("search-startLocation").value,
        "endLocation": document.getElementById("search-endLocation").value,
    });

    await searchTripAsync(data);
}

async function searchTripAsync(tripJson) {
    var response = await makePostApiCall(tripJson, "trip/search");
    if (response.length == 0) {
        displayResponseMessage("No trips found for such criteria");
    } else {
        if (isElemDisplayed("response-container")) {
            toggleElementById("response-container");
        }
        toggleShowables(document.getElementById("trips-table"));
        updateTableWithJsonObject(response, "trips-table-form", false);
    }
}
