// Blob JS

const blob = document.getElementById("blob");

window.onpointermove = event => { 
  const { clientX, clientY } = event;
  
  blob.animate({
    left: `${clientX}px`,
    top: `${clientY}px`
  }, { duration: 3000, fill: "forwards" });
}


function htmlNum(number) {
    if (number < 10) {
        return "0" + number;
    } else {
        return number;
    }
}

class Time {
    constructor(id, turn, minutes, seconds, milliseconds) {
        this.id = id;
        this.turn = turn;
        this.minutes = minutes;
        this.seconds = seconds;
        this.milliseconds = milliseconds;
    }

    decreaseTime() {
        this.milliseconds--;

        if (this.milliseconds < 0) {
            this.milliseconds = 99;
            this.seconds--;

            if (this.seconds < 0) {
                this.seconds = 59;
                this.minutes--;

                if (this.minutes < 0) {
                    return false;
                }
            }
        }

        return true;
    }

    setTime(minutes, seconds, miliseconds) {
        if (seconds >= 60) {
            seconds -= 60;
            minutes++;
        }
        
        this.minutes = minutes;
        this.seconds = seconds;
        this.milliseconds = miliseconds;
        document.getElementById("player" + this.id + "-minutes").innerHTML = htmlNum(this.minutes);
        document.getElementById("player" + this.id + "-seconds").innerHTML = htmlNum(this.seconds);
        document.getElementById("player" + this.id + "-miliseconds").innerHTML = htmlNum(this.milliseconds);
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.decreaseTime()) {
                document.getElementById("player" + this.id + "-minutes").innerHTML = htmlNum(this.minutes);
                document.getElementById("player" + this.id + "-seconds").innerHTML = htmlNum(this.seconds);
                document.getElementById("player" + this.id + "-miliseconds").innerHTML = htmlNum(this.milliseconds);
            } else {
                clearInterval(this.timerInterval);
                document.getElementById("player" + this.id + "-minutes").innerHTML = "00";
                document.getElementById("player" + this.id + "-seconds").innerHTML = "00";
                document.getElementById("player" + this.id + "-miliseconds").innerHTML = "00";
                this.turn = false;
                if (sound) {
                    let mySound = new Audio('alarm-ringing.mp3');
                    mySound.play();
                }
                alert("Player " + this.id + " ran out of time!");
                player1.setTime(setTimeMinutes, setTimeSeconds, 0);
                player2.setTime(setTimeMinutes, setTimeSeconds, 0);
                document.getElementById("play").checked = false;
                play = false;
            }
        }, 0.35);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
        this.turn = false;
    }
}

// Settings
let increment = parseInt(document.getElementById("increment").value);
let setTimeMinutes = parseInt(document.getElementById("custom-time").value.substring(0, document.getElementById("custom-time").value.indexOf(":")));
let setTimeSeconds = parseInt(document.getElementById("custom-time").value.substring(document.getElementById("custom-time").value.indexOf(":") + 1, document.getElementById("custom-time").value.length));

console.log(setTimeMinutes + ":" + setTimeSeconds);

// Players
let player1 = new Time(1, true, setTimeMinutes, setTimeSeconds, 0);
let player2 = new Time(2, false, setTimeMinutes, setTimeSeconds, 0);
player1.setTime(setTimeMinutes, setTimeSeconds, 0);
player2.setTime(setTimeMinutes, setTimeSeconds, 0);

// Other variables
let turn = 1;
let play = false;
document.getElementById("play").checked = false;
let sound = document.getElementById("sound-slider").checked;

// Increment listener
document.getElementById("increment").addEventListener("change", function() {
  increment = document.getElementById("increment").value;
  console.log(increment);
});

// Time listener
document.getElementById("custom-time").addEventListener("change", () => {
    let data = document.getElementById("custom-time").value;

    let minutesPart = parseInt(data.substring(0, data.indexOf(":")));
    let secondsPart = parseInt(data.substring(data.indexOf(":") + 1, data.length));

    if (!isNaN(minutesPart) && !isNaN(secondsPart)) {
        setTimeMinutes = minutesPart;
        setTimeSeconds = secondsPart;
    } else {
        alert("Invalid time format. Use MM:SS");
    }

    player1.setTime(setTimeMinutes, setTimeSeconds, 0);
    player2.setTime(setTimeMinutes, setTimeSeconds, 0);
    
    play = false;
    document.getElementById("play").checked = false;
    player1.stopTimer();
    player2.stopTimer();
});

// Switch listener
document.getElementById("switch").addEventListener("click", () => {
    // Playing sound
    if (play && sound) {
        let mySound = new Audio('switch-sound.mp3');
        mySound.play();
    }
    
    // Adding increment
    if (play) {
        if (turn === 1) {
            player1.setTime(player1.minutes, player1.seconds + parseInt(increment), player1.milliseconds);
        } else {
            player2.setTime(player2.minutes, player2.seconds + parseInt(increment), player2.milliseconds);
        }
    } else {
        if (turn === 1) {
            player1.setTime(player1.minutes, player1.seconds, player1.milliseconds);
        } else {
            player2.setTime(player2.minutes, player2.seconds, player2.milliseconds);
        }
    }
    
    turn = turn == 1 ? 2 : 1; // Changing turn

    // Adjusting CSS
    if (turn == 1) {
        document.getElementById("player1").classList.add("selected-timer");
        document.getElementById("player2").classList.remove("selected-timer");
        if (play) {
            player2.stopTimer();
            player1.startTimer();
        }
    } else {
        document.getElementById("player2").classList.add("selected-timer");
        document.getElementById("player1").classList.remove("selected-timer");
        if (play) {
            player1.stopTimer();
            player2.startTimer();
        }
    }
});

// Play listener
document.getElementById("play").addEventListener("click", () => {
    if (play === false) {
        play = true;
        if (turn == 1) {
            player1.startTimer();
        } else {
            player2.startTimer();
        }
    } else if (play === true) {
        play = false;
        player1.stopTimer();
        player2.stopTimer();
    }
});

// Sound Listener
document.getElementById("sound-slider").addEventListener("click", () => {
    sound = document.getElementById("sound-slider").checked;
});