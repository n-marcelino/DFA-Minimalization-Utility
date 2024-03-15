let result_table = document.getElementById("result");

//find the tbody in result table (otherwise it's gonna insert rows into thead)
let result_tbody = result_table.querySelector("tbody");

let resultrow = result_tbody.insertRow(-1);

// Create table cells for resultrow
let r1 = resultrow.insertCell(0);
let r2 = resultrow.insertCell(1);
let r3 = resultrow.insertCell(2);

r1.id = "result_q" + (result_table.rows.length - 3); // Unique ID for result cell 1

r1.innerText = "Q" + (result_table.rows.length - 3);


r2.id = r1.id + "_t1";
r3.id = r1.id + "_t0";