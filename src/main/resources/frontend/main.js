
document.getElementById("signUpBtn").addEventListener('click', function (evt) {
    signUp();
});


function addListenerOnNavBarBtns() {
    const navElem = document.getElementById("navId");

    Array.from(navElem.children).forEach((el) => {
        el.addEventListener('click', function (evt) {
            toggleShowables(evt.target);
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


function signUp() {
    var settings = {
      "url": "http://localhost:8080/signup",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "id": document.getElementById("signup-id").value,
        "name": document.getElementById("signup-name").value,
        "email": document.getElementById("signup-email").value,
        "password": document.getElementById("signup-password").value,
        "userType": document.getElementById("signUp-user-type").value
      }),
    };

    $.ajax(settings).done(function (response) {
       document.getElementById('introParagraph').innerHTML = response;
    });
    //todo handle errors
// .fail(function (jqXHR, textStatus, errorThrown) {
//         document.getElementById('introParagraph').innerHTML = errorThrown;
//         console.error("Error: " + textStatus, errorThrown);
//     })

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