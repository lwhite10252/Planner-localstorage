//global variables
var lastCell = null;

//our object for daily planner data :)
var scheduleData = {
    days: [],
    weeks: [],
    dailyPlans: []
}

scheduleData.days[0] = "Sunday";
scheduleData.days[1] = "Monday";
scheduleData.days[2] = "Tuesday";
scheduleData.days[3] = "Wednesday";
scheduleData.days[4] = "Thursday";
scheduleData.days[5] = "Friday";
scheduleData.days[6] = "Saturday";

scheduleData.weeks[0] = "Week 1";
scheduleData.weeks[1] = "Week 2";
scheduleData.weeks[2] = "Week 3";
scheduleData.weeks[3] = "Week 4";

//create an array to store the plans for each day of the week
for (var i = 0; i < scheduleData.weeks.length; i++) {
    scheduleData.dailyPlans[i] = [];
    for (var j = 0; j < scheduleData.days.length; j++) {
        scheduleData.dailyPlans[i][j] = localStorage.getItem("scheduleData");
    }
}

//whenever a user clicks a cell, this changes the colour of it
function selectCell(ref) {
    // extract the row and column of the cell into rcArray
    var rcArray = ref.id.split("_");

    //if lastCell is not equal null, it means the user has selected a 
    //cell previously, so change background colour back to normal
    if (lastCell != null)
        lastCell.style.backgroundColor = "#ffffff";

    //change the currently-selected cell's colour
    ref.style.backgroundColor = "#f6ffe2";

    //save the current reference to the global var lastCell
    lastCell = ref;

    //set the value of the textbox to whatever the user writes in
    document.getElementById("txtRows").value = ref.innerHTML;

    //set focus on the text box and select all the characters
    document.getElementById("txtRows").focus();
    document.getElementById("txtRows").select();
}

//automatically build the dynamic table hen the page loads
//call the refreshTable function to map data values from the array to the table
function initTable() {
    //attached to the Save button
    //gets user input and assigns it to an element in the table
    document.getElementById("btnSave").addEventListener("click", function () {
        //if the user hasn't selected a cell, do nothing
        if (lastCell === null)
            return;

        //retieve a reference to the cell the user has selected
        //split to get row and column
        //rcArray[0] contains the row
        //rcArray[1] contains the column
        var rcArray = lastCell.id.split("_");

        //if user selects first column, do nothing
        if (rcArray[1] === "0") {
            return;
        }
        else {
            //the user selected a "planner" cell
            //determine the row and column within the dailyPlans array
            var r = rcArray[0] - 1;
            var c = rcArray[1] - 1;

            //copy the value the user typed into the array
            scheduleData.dailyPlans[r][c] = document.getElementById("txtRows").value;

            //update the HTML table
            refreshTable();
        }

        localStorage.setItem("scheduleData", JSON.stringify(scheduleData));
    });

    //function initializes all dailyPlans elements to be blank
    document.getElementById("btnClear").addEventListener("click", function () {
        for (var i = 0; i < scheduleData.weeks.length; i++) {
            for (var j = 0; j < scheduleData.days.length; j++)
                scheduleData.dailyPlans[i][j] = "";
        }

        refreshTable();

        //if the user has selected a cell, reset the background colour
        if (lastCell != null)
            lastCell.style.backgroundColor = "#ffffff";
    });

    var jsonPlans = localStorage.getItem("scheduleData");

    if (jsonPlans !== null)
        scheduleData = JSON.parse(jsonPlans);

    document.getElementById("container").innerHTML = buildTable(scheduleData.weeks.length, scheduleData.days.length);
    refreshTable();
}

//retrieve values from each element in array and assign to a cell
function refreshTable() {
    for (var r = 0; r < scheduleData.dailyPlans.length; r++) {
        var id = "";
        for (var c = 0; c < scheduleData.dailyPlans[r].length ; c++) {
            //construct the id value row and column with the "_" delimiter
            //Example: r = 0 and c = 0 --> "1_1"
            id = (r + 1) + "_" + (c + 1);

            document.getElementById(id).innerHTML = scheduleData.dailyPlans[r][c];
        }
    }
}

//build the dynamic table
function buildTable(rows, columns) {
    //create the initial table opening tag declaration
    var divHTML = '<table border="1">';
    //open a new row with the <tr> tag for the headers
    divHTML += '<tr>'
    //define the 0,0 cell as a header because it stays blank
    divHTML += '<th></th>';

    //now construct the headers using the days array; each entry has an
    //opening <th> tag and a closing </th> tag around it
    for (var i = 0; i < scheduleData.days.length; i++)
        divHTML += "<th>" + scheduleData.days[i] + "</th>";

    //do a row of planner input for each week
    for (var r = 0; r < rows; r++) {
        //opening row tag
        divHTML += "<tr>";
        //make a temp string to ensure that the HTML is syntactically correct
        //this will be the HTML which represents a cell in the table
        var temp = '<td id="' + (r + 1) + '_0" onclick="selectCell(this);" class="nameStyle">' + scheduleData.weeks[r] + "</td>";

        //add the temp variable containing the name cell HTML to the main string variable
        divHTML += temp;

        //now do all the dailyPlans for the week
        for (var c = 0; c < columns; c++) {
            divHTML += '<td id="' + (r + 1) + '_' + (c + 1) + '" onclick="selectCell(this);" class="cellStyle"></td>'
        }
        //row closing tag
        divHTML += "</tr>";
    }

    //table ending tag 
    divHTML += "</table>";
    return divHTML;
}

//document.getElementById wrapper
function $gel(id) {
    return document.getElementById(id);
}