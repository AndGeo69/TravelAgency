
document.getElementById("signUpBtn").addEventListener('click', async function (evt) {
    evt.preventDefault();
    await signUp();
});

document.getElementById("signInBtn").addEventListener('click', async function (evt) {
    evt.preventDefault();
    await signIn();
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

function toggleShowables(trg) {
    var elems = document.querySelectorAll(".showable");
    elems.forEach(element => {
        element.style.display = 'none';
    });
    var styling = "block";
    if (trg.id == "trips-table") {
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
        "location": "Paris",
        "startDate": "2023-12-10",
        "endDate": "2023-12-15",
        "agency": "Adventure Tours",
        "schedule": "Explore the city of love"
    },
    {
        "location": "Tokyo",
        "startDate": "2023-11-20",
        "endDate": "2023-11-25",
        "agency": "Discover Japan",
        "schedule": "Visit historical landmarks"
    },
    {
        "location": "New York",
        "startDate": "2023-10-05",
        "endDate": "2023-10-10",
        "agency": "Big Apple Adventures",
        "schedule": "Experience the city that never sleeps"
    },
    {
    "location": "Thessaloniki",
    "startDate": "2023-10-05",
    "endDate": "2023-10-10",
    "agency": "Saloniki tours",
    "schedule": "Experience the city that never sleeps"
    }
]);

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
    toggleSpinner();
    try {
        const response = await $.ajax({
            url: "http://localhost:8080/signup",
            contentType: "application/json",
            type: "POST",
            data: data,
        });

    } catch (err) {
        handleRegisterResponse(err);
        clearFormFields("signup-form");
    } finally {
        toggleSpinner();
    }
}

async function signInAsync(data) {
    toggleSpinner();
    try {
        const response = await $.ajax({
            url: "http://localhost:8080/signin",
            contentType: "application/json",
            type: "POST",
            data: data,
        });

    } catch (err) {
        handleLoginResponse(err);
        clearFormFields("signin-form");
    } finally {
        toggleSpinner();
    }
}

async function signIn() {

    let data = JSON.stringify({
        "id": document.getElementById("signin-id").value,
        "password": document.getElementById("signin-password").value,
        "userType": getSelectedUserType()
      });

    await signInAsync(data);
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
            if (element.type !== 'button' && element.type !== 'submit' && element.type !== 'reset') {
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

function handleRegisterResponse(response) {
    var msg;
    if (response != null) {
        if (response.responseText != null) {
            msg = handleJsonResponse(response);
        } else {
            msg = "Successfully register, please sign in !";
        }
        displayResponseMessage(msg);
    } else {
        displayResponseMessage("Erron occured, please try again later.");
    }
}

function handleLoginResponse(response) {
    var msg;
    if (response != null) {
        if (response.responseText != null) {
            msg = handleJsonResponse(response);
        } else {
            msg = "Welcome " + response.type + " " + response.name;
        }
        displayResponseMessage(msg);
    } else {
        displayResponseMessage("Erron occured, please try again later.");
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

function updateTable(json) {
    result = jQuery.parseJSON(json);
    var table = document.getElementById("trips-table-form");

    var rowCount = table.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }

    for(var k in result) {
        var trip = result[k];

        loc = trip.location;
        startDate = trip.startDate;
        endDate = trip.endDate;
        agency = trip.agency;
        schedule = trip.schedule;

        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        cell1.innerHTML = loc;
        cell2.innerHTML = startDate;
        cell3.innerHTML = endDate;
        cell4.innerHTML = agency;
        cell5.innerHTML = schedule;
    }
}

updateTable(tripTestData);



function toggleSpinner() {
    var spinner = document.getElementById("spinner");
    if (spinner.style.display == 'none') {
        spinner.style.display = 'block';
    } else {
        spinner.style.display = 'none';
    }
}