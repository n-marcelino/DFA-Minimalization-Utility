//is the next states of the current state in the same equivalence class as the next states of stateAfterCurrentState?
//check if currentState.nextStates[0] and stateAfterCurrentState[0] are in the same subarray of equivalenceClass[]


//looping through the previous partition's equivalence classes
for (let i = 0; i < previousPartition.equivalenceClass.length; i++) {

    //loop through all the states within the current equivalence class
    for (let j = 0; j < previousPartition.equivalenceClass.length; j++) {
        const comparisonState = equivalenceClass[j];

        if (currentState.state == comparisonState.state) continue; //don't compare with urself

        console.log("Comparing nextStates of " + currentState.state + " and " + comparisonState.state)

        //compare first input symbol pair result
        // if (currentState.nextStates[0] === previousPartition.equivalenceClass[previousEquivalenceClass].state) FoundInSamePlaceCounter++;
        // if (comparisonState.nextStates[0] === previousPartition.equivalenceClass[previousEquivalenceClass].state) FoundInSamePlaceCounter++;

        // //compare second input symbol pair result
        // if (currentState.nextStates[1] === previousPartition.equivalenceClass[previousEquivalenceClass].state) FoundInSamePlaceCounter++;
        // if (comparisonState.nextStates[1] === previousPartition.equivalenceClass[previousEquivalenceClass].state) FoundInSamePlaceCounter++;

        // if (FoundInSamePlaceCounter == 4) {
        //     console.log("found " + currentState.nextStates[nextStateCount] + " and " + compareToThis + " in " + "equivalenceClass[" + i + "]")
        //     belongToSameClass = true;
        // }
    }
}

if (belongToSameClass) {
    console.log("Adding " + currentState.state + " to new partition's equivalentClass[" + i + "]")
    currentPartition.addToEquivalenceClass(currentState, i);
} else {
    console.log("Adding " + currentState.state + " to new partition's equivalentClass[" + (currentPartition.length + 1) + "]")
    currentPartition.addToEquivalenceClass(currentState, (currentPartition.length + 1));
}

console.log("This is the current partition:")
console.log(currentPartition)