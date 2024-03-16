function addState() {
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
    c2.id = c1.id + "_t1";
    c3.id = c1.id + "_t0";
}

function resetTable() {
    // Get the table elements
    let input_table = document.getElementById("input");
    let result_table = document.getElementById("result");

    // Find the button row
    let buttonRow = document.getElementById("buttonRow");

    // Determine the number of rows to keep
    let headerRow = 2; // Keep the first two rows


    // Delete rows in the input table
    for (let i = buttonRow.rowIndex - 1; i >= headerRow; i--) {
        input_table.deleteRow(i);
    }

    // // Delete rows in the result table
    // for (let i = result_table.rows.length - 1; i >= headerRow; i--) {
    //     result_table.deleteRow(i);
    // }

    // Optionally, you can reset any other elements to their default state here
}

function editState() {
    let button = document.getElementById("editButton");

    // Get the text node containing the button's text
    let textNode = button.firstChild;

    // Toggle button class from btn-warning to btn-success
    button.classList.replace("btn-warning", "btn-success");

    // Check if the button text is "Edit" or "Confirm"
    if (textNode.textContent.trim() === "Edit") {
        // If it's "Edit", change it to "Confirm" and make cells editable
        textNode.textContent = "Confirm ";
        let cells = document.querySelectorAll('[id^="input_"]:not([id$="_t1"]):not([id$="_t0"])');
        cells.forEach(cell => {
            cell.contentEditable = true;
            cell.classList.add("table-warning");
        });
    } else {
        // If it's "Confirm", call saveState() to save the edits
        saveEditState()
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
        if (!uniqueTexts.has(cell.innerText)) {
            uniqueTexts.add(cell.innerText);
        } else {
            duplicateFound = true;
        }

    });

    // Add alert if duplicate names are found
    if (duplicateFound) {
        // Create toast container div
        displayAlert();
    } else {
        // Get the text node containing the button's text
        let textNode = button.firstChild;

        // Toggle button class from btn-success to btn-warning
        button.classList.replace("btn-success", "btn-warning");

        // Set the text content of the text node back to "Edit"
        textNode.textContent = "Edit ";

        // Iterate over each cell and make its content non-editable
        cells.forEach(cell => {
            cell.contentEditable = false;
            cell.classList.remove("table-warning")
        });

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
    }
}

function displayAlert() {
    // Create alert div
    let alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade', 'show', 'position-fixed', 'bottom-0', 'end-0', 'me-3'); // Added 'me-3' for margin

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
        <strong>Warning:</strong> Duplicates are not allowed.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Append alert div to the document body
    document.body.appendChild(alertDiv);

    // Automatically dismiss the alert after a certain duration (e.g., 5 seconds)
    setTimeout(function() {
        alertDiv.remove();
    }, 5000);
}




function setState() {
    let button = document.getElementById("setStateButton");

    // Get the text node containing the button's text
    let textNode = button.firstChild;

    // Toggle button class from btn-info to btn-success
    button.classList.replace("btn-info", "btn-success");

    // Check if the button text is "Set" or "Confirm"
    if (textNode.textContent.trim() === "Set State") {
        // If it's "Set", change it to "Confirm" and make cells editable
        textNode.textContent = "Confirm ";

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
        // Check if any other cell already has an initial state
        let initialCells = document.querySelectorAll('[id^="input_q"].text-primary:not([id$="_t1"]):not([id$="_t0"])');
        initialCells.forEach(initialCell => {
            if (initialCell !== cell) {
                // If another cell has an initial state, remove it
                initialCell.id = initialCell.id.replace("_init", "");
                initialCell.classList.remove("text-primary");
            }
        });

        cell.id = cell.id.replace("_final", "") + "_init";
        cell.classList.remove("text-success");
        cell.classList.add("text-primary");
    } else if (event.target.textContent.trim() === "Final") {
        cell.id = cell.id.replace("_init", "") + "_final";
        cell.classList.remove("text-primary");
        cell.classList.add("text-success");
    } else {
        cell.id = cell.id.replace("_init", "").replace("_final", "");
        cell.classList.remove("text-primary", "text-success");
    }
}

function saveSetState() {
    let button = document.getElementById("setStateButton");

    // Get the text node containing the button's text
    let textNode = button.firstChild;

    // Revert button class from btn-success to btn-info
    button.classList.replace("btn-success", "btn-info");

    // Change button text back to "Set"
    textNode.textContent = "Set State ";

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
}

function setTransition() {
    //grab all cells that input_q*_t{1|0}
    let cells = document.querySelectorAll('[id^="input_q"]:not([id$="_t1"]):not([id$="_t0"])');

    cells.forEach(cell=>{
        cell.innerText = cell.id;
    });
}

