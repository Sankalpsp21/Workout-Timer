var workoutExercises = []


let beep = new Audio('beep.wav')
let longBeep = new Audio('longBeep.wav')
let endWorkout = 0


//Functions to start a workout----------------------------------------------
async function getWorkoutInfo(title){

    var workoutURL = '/workouts/' + title

    var response = await fetch(workoutURL)

    var workout = await response.json()

    return workout
}

async function workoutClicked(event){
    endWorkout = 0
    var workoutElement = event.currentTarget

    var title = workoutElement.getElementsByClassName("workout-title")[0].innerHTML

    var workoutInfo = await getWorkoutInfo(title)

    showWorkoutModal()

    //Getting access to the elements that will let us set the text in the modal
    var doWorkoutTitle = document.querySelector("#do-workout-modal h3")
    var exerciseName = document.querySelector("#do-workout-modal #exercise-name")
    var timeRemaining = document.querySelector("#do-workout-modal #time-remaining")

    doWorkoutTitle.innerHTML = title

    //Starting the timer, looping through all exercises in the workout
    for(var i = 0; i < workoutInfo.exercises.length; i++){

        exerciseName.innerHTML = workoutInfo.exercises[i].title
        var duration = workoutInfo.exercises[i].duration

        while (duration > 0 && endWorkout == 0){
            var minutes = Math.floor(duration / 60)
            var seconds = duration % 60
            timeRemaining.innerHTML = minutes + "m " + seconds + "s"

            if(duration <= 3){
                beep.play()
            }

            //Wait 1 second
            await new Promise(r => setTimeout(r, 1000));

            duration--

            if(duration == 0){
                longBeep.play()
            }
        }
    }
    closeWorkoutModal()
    //End of for loop and timer
}

function insertNewTimer(workoutElement){
    workoutElement.addEventListener('click', workoutClicked)
}

function showWorkoutModal(){
    var doModal = document.getElementById("do-workout-modal")
    var modalBackdrop = document.getElementById("modal-backdrop")
    modalBackdrop.classList.remove('hidden')
    doModal.classList.remove('hidden')
}

function closeWorkoutModal(){
    var doModal = document.getElementById("do-workout-modal")
    var modalBackdrop = document.getElementById("modal-backdrop")
    modalBackdrop.classList.add('hidden')
    doModal.classList.add('hidden')
}

//Functions to add a workout----------------------------------------------
function addWorkoutButtonClicked(){
    var addModal = document.getElementById("add-workout-modal")
    var modalBackdrop = document.getElementById("modal-backdrop")

    addModal.classList.remove('hidden')
    modalBackdrop.classList.remove('hidden')
}

function closeModal(){

    var workoutTitleInput = document.getElementById("workout-text-input")
    workoutTitleInput.value = ""

    var exerciseTitleInput = document.getElementById("exercise-text-input")
    exerciseTitleInput.value = ""

    var exerciseDuration = document.getElementById("exercise-duration-input")
    exerciseDuration.value = ""

    var modalBackdrop = document.getElementById("modal-backdrop")
    var addWorkoutModal = document.getElementById("add-workout-modal")
    var doWorkoutModal = document.getElementById("do-workout-modal")
    var saveExitModal = document.getElementById("exit-save-modal")


    modalBackdrop.classList.add('hidden')
    addWorkoutModal.classList.add('hidden')
    doWorkoutModal.classList.add('hidden')
    saveExitModal.classList.add('hidden')
    endWorkout = 1

    workoutExercises = []
}

function addExerciseButtonClicked(){
    var exerciseTitle = document.getElementById("exercise-text-input")
    var duration = document.getElementById("exercise-duration-input")

    workoutExercises.push({
        "title": exerciseTitle.value,
        "duration": duration.value
    })
    
    exerciseTitle.value = ""
    duration.value = ""
}

function getTotalDuration(){
    //Calculating the total duration of the workout
    var totalSeconds = 0
    for(var i = 0; i < workoutExercises.length; i++){
        totalSeconds += parseInt(workoutExercises[i].duration)
    }

    var minutes = Math.floor(totalSeconds / 60)
    var seconds = totalSeconds % 60
    var totalTime = minutes + "m " + seconds + "s"

    return totalTime
}

function workoutAcceptButtonClicked(){

    //Getting the title and duration of the workout
    var workoutTitle = document.getElementById("workout-text-input").value
    var totalTime = getTotalDuration()

    fetch("/workouts", {
        method: "POST",
        body: JSON.stringify({
            title: workoutTitle,
            totalDuration: totalTime,
            exercises: workoutExercises
            }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function(res){
        if (res.status === 200){
            
            var context = {
                title: workoutTitle,
                totalDuration: totalTime,
              }
            
            var workoutsElement = document.getElementById("workouts")
            var newHTML = Handlebars.templates.workoutTemplate(context)
            workoutsElement.insertAdjacentHTML("beforeend", newHTML)

            insertNewTimer(workoutsElement.lastElementChild)
        }
    })

    workoutExercises = []

    closeModal()
}

//Function to get a random quote----------------------------------------------
function getQuote(){
    fetch("/quote", {
        method: "GET"
    }).then(function(res){
        if (res.status === 200){
            return res.json()
        }
    }).then(function(data){
        var quote = document.getElementById("quote-text")
        quote.innerHTML = data.quote

        var author = document.getElementById("quote-author")
        author.innerHTML = "- " + data.author
    })
}

//Functions to remove a workout----------------------------------------------
function removeWorkout(event){

    if (confirm("Are you sure you want to remove this workout? This cannot be undone")){
            
        //Getting the title of the workout to be removed
        var workout = event.target.closest(".workout")
        var workoutTitle = workout.getElementsByClassName("workout-title")[0].innerHTML

        fetch("/workouts", {
            method: "DELETE",
            body: JSON.stringify({
                title: workoutTitle
                }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(res){
            if (res.status === 200){
                workout.remove()
            }
        })
    }

    //Removing the event listener to the common ancestor of the remove buttons
    var commonAncestor = document.getElementById("workouts")
    commonAncestor.removeEventListener('click', removeWorkout)

    var workoutTimers = document.getElementsByClassName("workout")
    Array.from(workoutTimers).forEach(element => {
        insertNewTimer(element)
    })

    var buttons = document.getElementsByClassName("remove-button")
    Array.from(buttons).forEach(function(button){
        button.classList.add('hidden')
    })
}

function removeWorkoutButtonClicked(){
    
    //Showing the remove buttons
    var buttons = document.getElementsByClassName("remove-button")
    Array.from(buttons).forEach(function(button){
        button.classList.remove('hidden')
    })

    //Removing the event listeners from the workouts to prevent them from being clicked
    var workouts = document.getElementsByClassName("workout")
    Array.from(workouts).forEach(function(workout){
        workout.removeEventListener('click', workoutClicked)
    })

    //Adding the event listener to the common ancestor of the remove buttons
    var commonAncestor = document.getElementById("workouts")
    commonAncestor.addEventListener('click', removeWorkout)
}

/*
 * Wait until the DOM content is loaded, and then hook up all UI interactions.
 */
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    //Add Workout button clicked
    var addWorkoutButton = document.getElementById("add-workout-button")
    addWorkoutButton.addEventListener('click', addWorkoutButtonClicked)

    //Remove Workout button clicked
    var removeWorkoutButton = document.getElementById("remove-workout-button")
    removeWorkoutButton.addEventListener('click', removeWorkoutButtonClicked)

    //Microservice to SEND A REQUEST TO GET A NEW MOTIVATIONAL QUOTE--------------------------
    getQuote()

    //Closing Add Workout Modal (X button and Cancel button)
    var modalCancel = document.getElementsByClassName("modal-hide-button")
    Array.from(modalCancel).forEach(element => {
        element.addEventListener('click', closeModal)
    });

    //Clicking add exercise button
    var addExerciseButton = document.getElementById("add-exercise")
    addExerciseButton.addEventListener('click', addExerciseButtonClicked)

    //Creating new workout
    var workoutAcceptButton = document.getElementById("workout-accept")
    workoutAcceptButton.addEventListener('click', workoutAcceptButtonClicked)

    //Clicking a workout timer
    var workoutTimers = document.getElementsByClassName("workout")
    Array.from(workoutTimers).forEach(element => {
        insertNewTimer(element)
    })

})