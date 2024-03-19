function addState() {
    //reset check state if its checked
    let checkButton = document.getElementById("checkButton");
    if (checkButton.classList.contains("disabled")) {
        checkPassToggle();
    }

    // Get the table element in which you want to add row
    let input_table = document.getElementById("input");

    // Find the button row
    let buttonRow = document.getElementById("buttonRow");
    let insertBefore = buttonRow.rowIndex;

    let inputrow = input_table.insertRow(insertBefore);

    // // Create table cells
    let c1 = inputrow.insertCell(0);
    let c2 = inputrow.insertCell(1);
    let c3 = inputrow.insertCell(2);

    // Add IDs to each new state
    //naming convention: {input|result}_{state}
    c1.id = "input_q" + (insertBefore - 2); // Unique ID for result cell 1

    // set the default state names
    c1.innerText = "Q" + (insertBefore - 2);

    //Add IDs to the transitions
    //naming convention: {input|result}_{state}_t{input symbol}
    c2.id = c1.id + "_t0";
    c3.id = c1.id + "_t1";
}

function resetTable() {
    //reset check state if its checked
    let checkButton = document.getElementById("checkButton");
    if (checkButton.classList.contains("disabled")) {
        checkPassToggle();
    }


    // Get the table elements
    let input_table = document.getElementById("input");

    // Find the button row
    let buttonRow = document.getElementById("buttonRow");

    // Determine the number of rows to keep
    let headerRow = 2; // Keep the first two rows


    // Delete rows in the input table
    for (let i = buttonRow.rowIndex - 1; i >= headerRow; i--) {
        input_table.deleteRow(i);
    }

    resetResultTable();

    // Set the content of corresponding input symbol cells to result table
    //DON'T DELETE, THIS CHANGES THE INPUT SYMBOLS ON THE RESULT TABLE 
    let inputCells = document.querySelectorAll('[id^="input_i"]');
    // Revert input cells back to default values
    inputCells.forEach(inputCell => {
        inputCell.innerText = inputCell.id.endsWith("_i0") ? "0" : "1";
    });
    inputCells.forEach(inputCell => {
        let inputId = inputCell.id;
        let resultId = inputId.replace("input_", "result_");
        let resultCell = document.getElementById(resultId);

        // Only update the result cell if the input cell has been edited
        if (inputCell.innerText.trim() !== resultCell.innerText.trim()) {
            resultCell.innerText = inputCell.innerText;
        }
    });
}

function resetResultTable() {

    // Determine the number of rows to keep
    let headerRow = 2; // Keep the first two rows
    let result_table = document.getElementById("result");

    // Delete rows in the result table
    for (let i = result_table.rows.length - 1; i >= headerRow; i--) {
        result_table.deleteRow(i);
    }
}

function editState() {
    resetResultTable()

    //reset check state if its checked
    let checkButton = document.getElementById("checkButton");
    if (checkButton.classList.contains("disabled")) {
        checkPassToggle();
    }

    let button = document.getElementById("editButton");

    // Get the text node containing the button's text
    let textNode = button.querySelector("span");

    // Toggle button class from btn-warning to btn-success
    button.classList.replace("btn-warning", "btn-success");

    // Check if the button text is "Edit" or "Confirm"
    if (textNode.textContent.trim() === "Edit") {
        // If it's "Edit", change it to "Confirm" and make cells editable
        textNode.textContent = "Confirm";
        let cells = document.querySelectorAll('[id^="input_"]:not([id$="_t1"]):not([id$="_t0"])');
        cells.forEach(cell => {
            cell.contentEditable = true;
            cell.classList.add("table-warning");
        });
    } else {
        // If it's "Confirm", call saveState() to save the edits
        saveEditState();
    }
}

function saveEditState() {
    // Get the button element
    let button = document.getElementById("editButton");

    // Get all editable cells
    let cells = document.querySelectorAll('[contenteditable="true"]');
    let uniqueTexts = new Set();
    let duplicateFound = false;

    // Iterate over each cell and make sure all is unique
    cells.forEach(cell => {
        let text = cell.innerText.replace(/\s+/g, ''); // Remove all whitespace characters
        cell.innerText = text;
        if (!uniqueTexts.has(text)) {
            uniqueTexts.add(text);
        } else {
            duplicateFound = true;
        }
    });

    // Add alert if duplicate names are found
    if (duplicateFound) {
        // Create toast container div
        displayAlert("Duplicate state names are not allowed.");
    } else {
        // Get the text node containing the button's text
        let textNode = button.querySelector("span");

        // Toggle button class from btn-success to btn-warning
        button.classList.replace("btn-success", "btn-warning");

        // Set the text content of the text node back to "Edit"
        textNode.textContent = "Edit";

        // Iterate over each cell and make its content non-editable
        cells.forEach(cell => {
            cell.contentEditable = false;
            cell.classList.remove("table-warning")
        });
    }

    // Set the content of corresponding input symbol cells to result table
    let inputCells = document.querySelectorAll('[id^="input_i"]');
    inputCells.forEach(inputCell => {
        let inputId = inputCell.id;
        let resultId = inputId.replace("input_", "result_");
        let resultCell = document.getElementById(resultId);

        // Only update the result cell if the input cell has been edited
        if (inputCell.innerText.trim() !== resultCell.innerText.trim()) {
            resultCell.innerText = inputCell.innerText;
        }
    });

    // THIS CODE CHANGES THE NAMES OF THE EXISTING NEXT STATES TO MATCH
    let states = document.querySelectorAll('[id^="input_q"]:not([id$="_t1"]):not([id$="_t0"])');
    states.forEach(state => {
        // Extract the shortened state ID
        let shortenedStateId = state.id.match(/input_q([^_]+)/)[0];

        // Find the corresponding next states based on the shortened state ID
        let nextState0 = document.getElementById(shortenedStateId + '_t0');
        let nextState1 = document.getElementById(shortenedStateId + '_t1');

        // Change the innerText of the next states to match the state's innerText
        if (nextState0.innerText != "") {
            nextState0.innerText = state.innerText;
        }
        if (nextState1.innerText != "") {
            nextState1.innerText = state.innerText;
        }
    });


}

function displayAlert(errorMessage) {
    // Create alert div
    let alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade', 'show', 'position-fixed', 'bottom-0', 'end-0', 'me-3'); // Added 'me-3' for margin

    // It's over Anakin, I have the high z-index!
    alertDiv.style.zIndex = '9999';

    // Calculate the total height of existing alerts
    let existingAlerts = document.querySelectorAll('.alert');
    let totalHeight = 0;
    existingAlerts.forEach(alert => {
        totalHeight += alert.offsetHeight + 10; // Add 10 pixels for margin between alerts
    });

    // Set the bottom margin of the new alert based on the total height of existing alerts
    alertDiv.style.marginBottom = totalHeight + 'px';

    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
            <path
                d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
            <path
                d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
        </svg>
        <strong>Warning:</strong> ${errorMessage}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Append alert div to the document body
    document.body.appendChild(alertDiv);

    // Automatically dismiss the alert after a certain duration (e.g., 5 seconds)
    setTimeout(function () {
        alertDiv.remove();
    }, 5000);
}


function setState() {
    resetResultTable()

    //reset check state if its checked
    let checkButton = document.getElementById("checkButton");
    if (checkButton.classList.contains("disabled")) {
        checkPassToggle();
    }

    let editButton = document.getElementById("editButton");
    editButton.classList.add("disabled");

    let button = document.getElementById("setStateButton");

    // Get the text node containing the button's text
    let textNode = button.querySelector("span");

    // Toggle button class from btn-info to btn-success
    button.classList.replace("btn-info", "btn-success");

    // Check if the button text is "Set" or "Confirm"
    if (textNode.textContent.trim() === "State") {
        // If it's "Set", change it to "Confirm" and make cells editable
        textNode.textContent = "Confirm";

        let cells = document.querySelectorAll('[id^="input_q"]:not([id$="_t1"]):not([id$="_t0"])');
        cells.forEach(cell => {
            // Create buttons for toggling initial/final states
            let initialButton = document.createElement('button');
            initialButton.classList.add('btn', 'btn-sm', 'btn-outline-primary', 'toggle-state');
            initialButton.textContent = "Initial";

            let neitherButton = document.createElement('button');
            neitherButton.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'toggle-state');
            neitherButton.textContent = "Neither";

            let finalButton = document.createElement('button');
            finalButton.classList.add('btn', 'btn-sm', 'btn-outline-success', 'toggle-state');
            finalButton.textContent = "Final";

            //whitespace 
            let whitespace = document.createTextNode(" ");
            // Append buttons to the cell
            cell.appendChild(whitespace);
            cell.appendChild(initialButton);
            cell.appendChild(neitherButton);
            cell.appendChild(finalButton);
        });

        // Add event listeners to the toggle buttons
        document.querySelectorAll('.toggle-state').forEach(button => {
            button.addEventListener('click', toggleState);
        });
    } else {
        // If it's "Confirm", call saveSetState() to save the edits
        saveSetState();
    }
}

function toggleState(event) {
    let cell = event.target.parentElement;

    // Update button classes based on current state
    cell.querySelectorAll('.toggle-state').forEach(button => {
        if (button === event.target) {
            button.classList.remove("btn-outline-secondary");
            button.classList.add("btn-outline-primary", "btn-outline-success");
        } else {
            button.classList.remove("btn-outline-primary", "btn-outline-success");
            button.classList.add("btn-outline-secondary");
        }
    });
    // Handle setting the state based on the clicked button
    if (event.target.textContent.trim() === "Initial") {
        let isFinal = cell.classList.contains("text-success");

        let initialCells = document.querySelectorAll('[id^="input_q"].text-primary:not([id$="_t1"]):not([id$="_t0"]), [id^="input_q"].text-warning:not([id$="_t1"]):not([id$="_t0"])');
        initialCells.forEach(initialCell => {
            if (initialCell !== cell) {
                // If another cell has an initial state, remove it
                initialCell.id = initialCell.id.replace("_init", "");
                initialCell.classList.remove("text-primary");

                if (initialCell.id.includes("_final")) {
                    initialCell.classList.add("text-success");
                    initialCell.classList.remove("text-warning");
                }
            }
        });

        if (isFinal) {
            // If the cell is already marked as final state, set it as both initial and final
            cell.id = cell.id.replace("_final", "") + "_init_final";
            cell.classList.replace("text-success", "text-warning");
        } else if (cell.classList.contains("text-warning")) {
            //if both initial and final state, onclick again, remove init
            cell.id = cell.id.replace("_init", "")
            cell.classList.replace("text-warning", "text-success");
        } else if (cell.classList.contains("text-primary")) {
            //if its alr an initial state, remove initial state
            cell.id = cell.id.replace("_init", "");
            cell.classList.remove("text-primary");
        } else {
            //if it is neither
            cell.id = cell.id + "_init";
            cell.classList.add("text-primary")
        }
    } else if (event.target.textContent.trim() === "Final") {
        let isInitial = cell.classList.contains("text-primary");
        if (isInitial) {
            // If the cell is already marked as initial state, set it as both initial and final
            cell.id = cell.id.replace("_init", "") + "_init_final";
            cell.classList.replace("text-primary", "text-warning");
        } else if (cell.classList.contains("text-warning")) {
            //if already an initial and final state, onclick again remove final
            cell.id = cell.id.replace("_final", "")
            cell.classList.replace("text-warning", "text-primary");
        } else if (cell.classList.contains("text-success")) {
            //if its alr an initial state, remove final state
            cell.id = cell.id.replace("_final", "");
            cell.classList.remove("text-success");
        } else {
            //if it is neither
            cell.id = cell.id + "_final";
            cell.classList.add("text-success")
        }
    } else {
        cell.id = cell.id.replace("_init", "").replace("_final", "").replace("_init_final", "");
        cell.classList.remove("text-primary", "text-success", "text-warning");
    }
}

function saveSetState() {
    let button = document.getElementById("setStateButton");

    // Get the text node containing the button's text
    let textNode = button.querySelector("span");

    // Revert button class from btn-success to btn-info
    button.classList.replace("btn-success", "btn-info");

    // Change button text back to "Set"
    textNode.textContent = "State";

    // Remove the button groups added during setState
    let cells = document.querySelectorAll('[id^="input_q"]:not([id$="_t1"]):not([id$="_t0"])');
    cells.forEach(cell => {
        let buttons = cell.querySelectorAll('.toggle-state');
        buttons.forEach(button => {
            button.remove();
        });

        // Remove whitespace node
        let whitespace = cell.firstChild;
        if (whitespace && whitespace.nodeType === Node.TEXT_NODE && whitespace.nodeValue.trim() === "") {
            whitespace.remove();
        }
    });

    let editButton = document.getElementById("editButton");
    editButton.classList.remove("disabled");
}

function setTransitionState() {
    resetResultTable()

    //reset check state if its checked
    let checkButton = document.getElementById("checkButton");
    if (checkButton.classList.contains("disabled")) {
        checkPassToggle();
    }

    let editButton = document.getElementById("editButton");
    editButton.classList.add("disabled");

    let button = document.getElementById("setTransitionButton");

    // Get the text node containing the button's text
    let textNode = button.querySelector("span");

    // Toggle button class from btn-info to btn-success
    button.classList.replace("btn-info", "btn-success");


    if (textNode.textContent.trim() === "Transition") {
        // If it's "Set", change it to "Confirm" and make cells editable
        textNode.textContent = "Confirm ";

        let cells = document.querySelectorAll('[id^="input_q"][id$="_t1"],[id^="input_q"][id$="_t0"]');
        cells.forEach(cell => {
            cell.contentEditable = true;
            cell.classList.add("table-warning");
        });
    } else {
        saveTransitionState();
    }
}

function saveTransitionState() {
    let cells = document.querySelectorAll('[id^="input_q"][id$="_t1"],[id^="input_q"][id$="_t0"]');
    let states = document.querySelectorAll('[id^="input_q"]:not([id$="_t1"]):not([id$="_t0"])');

    let allNamesValid = true;

    cells.forEach(cell => {
        // Skip cell if it has empty inner text
        if (cell.innerText.trim() === '') return;

        let isValidName = false;

        states.forEach(state => {
            if (cell.innerText.trim() === state.innerText.trim()) {
                isValidName = true;
            }
        });


        if (!isValidName) {
            allNamesValid = false;
            return; // exit forEach loop early if a cell name is invalid
        }
    });

    if (allNamesValid) {
        // Execute the following code only if all names are valid
        cells.forEach(cell => {
            cell.contentEditable = false;
            cell.classList.remove("table-warning");
        });

        let button = document.getElementById("setTransitionButton");

        // Get the text node containing the button's text
        let textNode = button.querySelector("span");

        // Toggle button class from btn-info to btn-success
        button.classList.replace("btn-success", "btn-info");

        // Change button text back to "Set"
        textNode.textContent = "Transition ";

        let editButton = document.getElementById("editButton");
        editButton.classList.remove("disabled");

    } else {
        displayAlert("The state you entered does not exist.")
    }
}

function check() {
    // Count the number of states
    let states = getAllStates()
    let numStates = states.length;

    // Check for empty cells with IDs ending in either "_t0" or "_t1"
    let emptyCells = document.querySelectorAll('[id^="input_q"][id$="_t0"]:empty, [id^="input_q"][id$="_t1"]:empty');
    let numEmptyCells = emptyCells.length;

    // Count the number of states with IDs that include "_init" or "_final"
    let statesWithInit = document.querySelectorAll('[id^="input_q"][id*="_init"]:not([id$="_t1"]):not([id$="_t0"])');
    let statesWithFinal = document.querySelectorAll('[id^="input_q"][id*="_final"]:not([id$="_t1"]):not([id$="_t0"])');
    let numStatesWithInit = statesWithInit.length;
    let numStatesWithFinal = statesWithFinal.length;

    //console log for debugging purposes
    console.log("Number of states:", numStates);
    console.log("Number of empty cells ending in '_t0' or '_t1':", numEmptyCells);
    console.log("Number of states with '_init':", numStatesWithInit);
    console.log("Number of states with '_final':", numStatesWithFinal);

    // Flags to track whether alerts were displayed
    let alertDisplayed = false;

    //display alert for ux
    if (numStates == 0) {
        displayAlert("Please add a state to proceed.");
        alertDisplayed = true;
    }
    if (numEmptyCells > 0) {
        displayAlert("Please set your transitions.");
        alertDisplayed = true;
    }
    if (numStatesWithInit == 0) {
        displayAlert("Please set an initial state.");
        alertDisplayed = true;
    }
    if (numStatesWithFinal == 0) {
        displayAlert("Please set a final state.");
        alertDisplayed = true;
    }

    // Proceed if no alerts were displayed
    if (!alertDisplayed) {
        //enable minimize button
        let miniButton = document.getElementById("miniButton")
        checkPassToggle()
    }
}

function checkPassToggle() {
    //THIS TOGGLES THE CHECK AND MINIMIZE BUTTON!

    // Get the two buttons that toggle when check is passed
    let miniButton = document.getElementById("miniButton");
    let checkButton = document.getElementById("checkButton");

    // Toggle the classes and text based on the current state
    if (miniButton.classList.contains("disabled")) {
        // If miniButton is disabled, enable it and change checkButton to "Checked!"
        checkButton.classList.add("disabled");
        checkButton.classList.replace("btn-primary", "btn-success")

        // Get the text node containing the button's text
        let textNode = checkButton.querySelector("span");
        textNode.textContent = "Checked!";


        miniButton.classList.remove("disabled");

    } else {
        // If miniButton is enabled, disable it and change checkButton back to original state
        checkButton.classList.remove("disabled");
        checkButton.classList.replace("btn-success", "btn-primary");

        // Get the text node containing the button's text
        let textNode = checkButton.querySelector("span");
        textNode.textContent = "Check";

        miniButton.classList.add("disabled");
    }
}

function mapToResultTable(partition) {
    // The structure of your mom's partition
    //
    // Partition {
    //     equivalenceClass {
    //         it's an array of equivalence classes,
    //         each equivalence class has a state

    //         state {
    //             name
    //             nextStates {
    //                 input 0
    //                 input 1
    //             }
    //             boolean initial
    //             boolean accepting
    //         }
    //     }
    // }


    let result_table = document.getElementById("result");

    //find the tbody in result table (otherwise it's gonna insert rows into thead)
    let result_tbody = result_table.querySelector("tbody");

    for (const equivalenceClass of partition.equivalenceClass) {
        let resultrow = result_tbody.insertRow(-1);

        // Create table cells for resultrow
        let c1 = resultrow.insertCell(0);
        let c2 = resultrow.insertCell(1);
        let c3 = resultrow.insertCell(2);

        //add id
        c1.id = "result_q" + (result_table.rows.length - 3);
        c2.id = c1.id + "_t1";
        c3.id = c1.id + "_t0";

        let concatenatedNames = [];
        let concatenatedNextStates0 = [];
        let concatenatedNextStates1 = [];

        // Iterate over states within the current equivalence class
        for (const state of equivalenceClass) {
            // Append the name of each state to the concatenatedNames string
            concatenatedNames.push(state.name);

            // Append the nextStates[0] and nextStates[1] to corresponding arrays
            concatenatedNextStates0.push(state.nextStates[0]); // Push to array
            concatenatedNextStates1.push(state.nextStates[1]); // Push to array

            //check state setting       
            if (state.initial && state.accepting) c1.classList.add("text-warning");
            if (state.initial && !state.accepting) c1.classList.add("text-primary");
            if (!state.initial && state.accepting) c1.classList.add("text-success");
        }

        c1.innerText = concatenatedNames.join(", ");
        c2.innerText = concatenatedNextStates0.join(", ");
        c3.innerText = concatenatedNextStates1.join(", ");
    }

    // Iterate through cells ending with "_t1" or "_t0"
    result_table.querySelectorAll('[id^="result_q"][id$="_t1"],[id^="result_q"][id$="_t0"]').forEach(cell => {

        // Iterate through cells in column c1 and check if any substring of the current cell is a substring of c1
        result_table.querySelectorAll('[id^="result_q"]:not([id$="_t1"]):not([id$="_t0"])').forEach(c => {

            // Split cell.innerText into substrings
            let substrings = cell.innerText.split(', ');

            // Iterate through substrings
            for (let substring of substrings) {
                // Check if the substring is a substring of c.innerText
                if (c.innerText.includes(substring)) {
                    // Replace cell.innerText with the substring
                    cell.innerText = c.innerText;
                    break; // Stop searching for substrings in c.innerText once a match is found
                }
            }
        });
    });

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      _______.  ______  __   _______ .__   __.   ______  _______     ________    ______   .__   __.  _______   //
//     /       | /      ||  | |   ____||  \ |  |  /      ||   ____|   |       /   /  __  \  |  \ |  | |   ____|  //
//    |   (----`|  ,----'|  | |  |__   |   \|  | |  ,----'|  |__      `---/  /   |  |  |  | |   \|  | |  |__     //
//     \   \    |  |     |  | |   __|  |  . `  | |  |     |   __|        /  /    |  |  |  | |  . `  | |   __|    //
// .----)   |   |  `----.|  | |  |____ |  |\   | |  `----.|  |____      /  /----.|  `--'  | |  |\   | |  |____   //
// |_______/     \______||__| |_______||__| \__|  \______||_______|    /________| \______/  |__| \__| |_______|  //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////                                                                                                

//SCIENCEY THEORY STUFF CODE RELATED TO ACTUALLY DOING THE THINGY GOES BELOW HERE! ABOVE IS THE UI




function minimize() {
    resetResultTable();
    
    console.log("------ MINIMIZE ------");
    const states = getAllStates();

    let k = 1; // Initialize partition counter
    const partitions = {}; // Object to store partitions

    const P0 = createInitialPartition(states);
    partitions[`P0`] = P0; // Add initial partition


    console.log("Current partitions:")
    console.log(partitions)

    while (true) {
        // Check if partitions[`P${k - 1}`] exists before proceeding
        if (!partitions[`P${k - 1}`]) {
            break; // Exit the loop if the previous partition does not exist
        }

        let previousPartition = partitions[`P${k - 1}`]
        let newPartition = createNewPartition(previousPartition);

        //check if the new partition is like, the same as the previous one. that means you're done partitioning! <3
        if (partitionsAreEqual(previousPartition, newPartition)) {
            console.log(partitions)
            break;
        }

        partitions[`P${k}`] = newPartition;
        k++;
    }

    //based on the last partition, we must now translate this into the other table
    const lastPartition = partitions[`P${k - 1}`];

    mapToResultTable(lastPartition)
}

class Partition {
    constructor() {
        this.equivalenceClass = [[]];
    }

    // Method to create a new equivalence class
    createNewEquivalenceClass() {
        this.equivalenceClass.push([]);
    }

    // Method to add states to the equivalence class
    addToEquivalenceClass(state, index) {
        if (!this.equivalenceClass[index]) {
            this.equivalenceClass[index] = [];
        }
        this.equivalenceClass[index].push(state);
    }

    // Method to remove states from the equivalence class
    removeFromEquivalenceClass(state, index) {
        if (this.equivalenceClass[index]) {
            const stateIndex = this.equivalenceClass[index].indexOf(state);
            if (stateIndex !== -1) {
                this.equivalenceClass[index].splice(stateIndex, 1);
            }
        }
    }

    // Method to check if a state belongs to any equivalence class
    isInEquivalenceClass(state) {
        for (const equivalenceClass of this.equivalenceClass) {
            if (equivalenceClass.includes(state)) {
                return true;
            }
        }
        return false;
    }

    // Method to check if two states are in the same equivalence class
    areStatesInSameEquivalenceClass(stateName1, stateName2) {
        for (const equivalenceClass of this.equivalenceClass) {
            const state1Found = equivalenceClass.some(state => state.name === stateName1);
            const state2Found = equivalenceClass.some(state => state.name === stateName2);
            if (state1Found && state2Found) {
                return true;
            }
        }
        return false;
    }

    // Method to clear the equivalence class
    clearEquivalenceClass() {
        this.equivalenceClass = [[]];
    }

    // Method to get the index of a state in the equivalence class
    getIndexInEquivalenceClass(state) {
        for (let i = 0; i < this.equivalenceClass.length; i++) {
            if (this.equivalenceClass[i].includes(state)) {
                return i;
            }
        }
        return -1; // State not found in any equivalence class
    }
}

function getAllStates() {
    const elements = document.querySelectorAll('[id^="input_q"]:not([id$="_t1"]):not([id$="_t0"])');

    const states = [];

    elements.forEach(element => {
        const stateId = element.id;
        const shortenedStateId = stateId.match(/input_q([^_]+)/)[0];

        const stateName = document.getElementById(stateId).innerText;

        const nextState1 = document.getElementById(shortenedStateId + '_t0').innerText;
        const nextState2 = document.getElementById(shortenedStateId + '_t1').innerText;

        let isItAFinalState = false;
        if (stateId.includes("_final")) isItAFinalState = true;

        let isItAnInitialState = false;
        if (stateId.includes("_init")) isItAnInitialState = true;

        states.push({
            name: stateName,
            nextStates: [nextState1, nextState2],
            initial: isItAnInitialState,
            accepting: isItAFinalState
        });
    });

    // console log for states
    console.log(states);

    return states;
}

function createInitialPartition(states) {
    // Create a new partition object
    const partition = new Partition();

    // Group states based on whether they are initial or accepting
    states.forEach(state => {
        if (!state.accepting) {
            partition.addToEquivalenceClass(state, 0); // Add to equivalence class 2 (non-initial, non-accepting states)
        } else {

            partition.addToEquivalenceClass(state, 1); // Add to equivalence class 1 (accepting states )
        }
    });

    console.log("Initial Partition:");
    console.log(partition)

    return partition;
}

function createNewPartition(previousPartition) {

    const newPartition = new Partition();
    let newPartitionsAdded = false;

    console.log("========NEW PARTITION========")

    for (let currentEquivalenceClass = 0; currentEquivalenceClass < previousPartition.equivalenceClass.length; currentEquivalenceClass++) {
        const equivalenceClass = previousPartition.equivalenceClass[currentEquivalenceClass]

        console.log("====EQUIVALENCE CLASS " + currentEquivalenceClass + " ====")
        console.log(equivalenceClass);
        for (let currentStateIndex = 0; currentStateIndex < equivalenceClass.length; currentStateIndex++) {

            const currentState = equivalenceClass[currentStateIndex]

            //adding the initial state of previous partition's EC into a new EC inside the new partition
            if (currentStateIndex == 0) {
                if (currentEquivalenceClass != 0) {
                    newPartition.createNewEquivalenceClass();
                }
                let newestEC = newPartition.equivalenceClass.length - 1;
                newPartition.addToEquivalenceClass(currentState, newestEC)
                console.log(newPartition)

                continue;
            }

            //first need to check if comparison state exists in any EC in the new partition

            for (let comparisonStateIndex = 0; comparisonStateIndex < currentStateIndex; comparisonStateIndex++) {
                const comparisonState = equivalenceClass[comparisonStateIndex]
                console.log("* Comparing the states: " + currentState.name + " and " + comparisonState.name)

                let belongsToSameClass = [false, false]; //assume false
                //check if the next states of the currentState is in the same EC as the next states of the comparison State (according to previous partition)
                for (let input = 0; input < 2; input++) {
                    let currentState_nextState = currentState.nextStates[input]; //string: needs to be compared to a state.name
                    let comparisonState_nextState = comparisonState.nextStates[input]; //string: needs to be compared to a state.name

                    let doesBelong = previousPartition.areStatesInSameEquivalenceClass(currentState_nextState, comparisonState_nextState)
                    if (!doesBelong) {
                        console.log("** Input [" + input + "]: " + currentState_nextState + " and " + comparisonState_nextState + " does not belong to the same EC in previous partition");
                    } else {
                        belongsToSameClass[input] = true;
                        console.log("** Input [" + input + "]: " + currentState_nextState + " and " + comparisonState_nextState + " belongs to the same EC in previous partition");
                    }
                }

                let index = 0;
                if (belongsToSameClass[0] && belongsToSameClass[1]) {
                    //then current state will be put in the same ec as the comparison state
                    console.log("*** The states: " + currentState.name + " and " + comparisonState.name + " are EQUIVALENT!! <3 ")
                    index = newPartition.getIndexInEquivalenceClass(comparisonState);
                    newPartition.addToEquivalenceClass(currentState, index)
                    console.log(newPartition)
                    break;
                } else {
                    console.log("*** The states: " + currentState.name + " and " + comparisonState.name + " are NOT EQUIVALENT!! </3 ")
                    if (comparisonStateIndex == currentStateIndex - 1) {
                        // if we've caught up to the currentStateIndex, create a new equivalence class
                        newPartition.createNewEquivalenceClass();
                        index = newPartition.equivalenceClass.length - 1
                        newPartition.addToEquivalenceClass(currentState, index)
                        break;
                    }
                    //if we haven't yet, then continue comparing it to the bottom rung?
                }
            }
        }
    }

    return newPartition;

}

// Check if the new partition has the exact same equivalence classes as the previous partition
function partitionsAreEqual(previousPartition, newPartition) {
    // Check if the number of equivalence classes is the same
    if (previousPartition.equivalenceClass.length !== newPartition.equivalenceClass.length) {
        return false;
    }

    // Sort equivalence classes in both partitions to compare them
    const sortedPreviousClasses = previousPartition.equivalenceClass.map(eqClass => [...eqClass].sort());
    const sortedNewClasses = newPartition.equivalenceClass.map(eqClass => [...eqClass].sort());

    // Compare each equivalence class
    for (let i = 0; i < sortedPreviousClasses.length; i++) {
        const previousClass = sortedPreviousClasses[i];
        const newClass = sortedNewClasses[i];

        // Check if the sets of states in the equivalence classes are the same
        if (!arraysAreEqual(previousClass, newClass)) {
            return false;
        }
    }

    // All equivalence classes are the same
    return true;
}

// Utility function to check if two arrays contain the same elements
function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

// Utility function to check if all elements in an array are the same
function areAllElementsSame(array) {
    for (let i = 1; i < array.length; i++) {
        if (array[i] !== array[0]) {
            return false;
        }
    }
    return true;
}
