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



while (true) {
    const currentPartition = new Partition(); // Create a new partition P_k
    let newPartitionsAdded = false;

    let previousPartition = partitions[`P${k - 1}`];

    // loop through equivalent classes of the previous partition
    console.log("============== LOOPING THROUGH EQUIVALENCE CLASSES IN P" + (k - 1) + " ==============");
    console.log(previousPartition);

    for (const equivalenceClass of previousPartition.equivalenceClass) {
        console.log("=== EQUIVALENCE CLASS ===");

        // equivalenceClass.forEach((state, index) => {
        //     console.log("Current State: " + state.state);

        //     for (let i = 0; i < equivalenceClass.length; i++) {
        //         if (i !== index) { // Skip comparing with itself

        //             let belongsToSameClass = false;
        //             const comparisonState = equivalenceClass[i];
        //             console.log("* comparing " + state.state + " to " + comparisonState.state);
        //             let equivalenceCount = 0;

        //             for (let i = 0; i < state.nextStates.length && i < comparisonState.nextStates.length; i++) {

        //                 const nextState = state.nextStates[i];
        //                 const comparisonNextState = comparisonState.nextStates[i];

        //                 if ()

        //                 for (const comparisonEC of previousPartition.equivalenceClass) {
        //                     comparisonEC.forEach(comparisonState => {
        //                         let FoundStateCount = 0;
        //                         // Check if nextState.state matches the state attribute of a child of comparisonEC
        //                         if (comparisonEC.some(child => child.state === nextState)) {
        //                             FoundStateCount++;
        //                         }
        //                         if (comparisonEC.some(child => child.state === comparisonNextState)) {
        //                             FoundStateCount++;
        //                         }

        //                         if (FoundStateCount == 2) {
        //                             console.log("** INPUT PAIR: " + nextState + " and " + comparisonNextState + " are in the same equivalence class.");
        //                             equivalenceCount++;

        //                             if (equivalenceCount == 2) belongsToSameClass = true;
        //                             return;
        //                         }
        //                     });
        //                 }
        //             }
        //             console.log(currentPartition)

        //             if (belongsToSameClass) {
        //                 //if the current state isn't part of any equivalence class in current partition
        //                 console.log("*** " + state.state + " and " + comparisonState.state + " are equivalent.");
        //                 // currentPartition.addToEquivalenceClass(state, index);
        //                 // currentPartition.addToEquivalenceClass(comparisonState, index);

        //             } else {
        //                 console.log("*** " + state.state + " and " + comparisonState.state + " are NOT equivalent.");
        //                 // currentPartition.addToEquivalenceClass(state, index);
        //                 // currentPartition.addToEquivalenceClass(comparisonState, index + 1);
        //             }
        //         }

        //     }
        // });
    }

    //check if the new partition has the exact same equivalence class as the previous partition!
    let areThePartitionsEqual = false;
    areThePartitionsEqual = partitionsAreEqual(previousPartition, currentPartition);
    if (areThePartitionsEqual) break;

    if (!newPartitionsAdded) {
        console.log("==============================")
        console.log("No new partitions were added! Successfully minimised.")
        break;
    } else {
        newPartitionsAdded = false;
        partitions[`P${k + 1}`] = currentPartition;
        k++;
    }
}