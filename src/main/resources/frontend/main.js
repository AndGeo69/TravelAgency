function showForm(formId) {
    document.getElementById('tripTable').style.display = 'none';
    document.getElementById('signin-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';

    document.getElementById(formId + '-form').style.display = 'block';
    document.getElementById('introHeader').innerHTML = document.getElementById(formId).innerHTML;
    document.getElementById('introParagraph').style.display = 'none';
}

function showContent(contentId) {
    document.getElementById('tripTable').style.display = 'table';
    document.getElementById('signin-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';

    document.getElementById('introParagraph').style.display = 'block';
    document.getElementById('introHeader').innerHTML = "Welcome to our Travel Agency";
    document.getElementById('introParagraph').innerHTML = "Plan your next adventure with us!";
}


<!-- remove when server is functional-->
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

function updateTable(json) {
    result = jQuery.parseJSON(json);
    var table = document.getElementById("tripTable");

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