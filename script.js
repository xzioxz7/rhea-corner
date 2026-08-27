 /* =========================================
   RHEA'S CORNER
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   SECTION SYSTEM
========================================= */

const sections = Array.from(
    document.querySelectorAll(".page-section")
);

let currentSection = 1;

const progressBar =
    document.getElementById("progressBar");

const sectionCounter =
    document.getElementById("sectionCounter");


function showSection(number) {

    if (number < 1 || number > sections.length) {
        return;
    }

    sections.forEach(section => {
        section.classList.remove("active");
    });

    const target =
        document.getElementById(`section${number}`);

    if (!target) {
        return;
    }

    target.classList.add("active");

    currentSection = number;

    sectionCounter.textContent =
        `${number} / ${sections.length}`;

    progressBar.style.width =
        `${(number / sections.length) * 100}%`;

    target.scrollTop = 0;

    handleSectionMusic(number);

    if (number === 9) {
        animateStats();
    }

    if (number === 8) {
        checkCatMaster();
    }
}


/* =========================================
   CONTINUE BUTTONS
========================================= */

document
    .querySelectorAll(".continue-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            const next =
                Number(button.dataset.next);

            showSection(next);

        });

    });


/* =========================================
   ENTER BUTTON
========================================= */

const enterBtn =
    document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {

    startMainMusic();

    showSection(2);

});


/* =========================================
   DOOR GAME
========================================= */

const magicDoor =
    document.getElementById("magicDoor");

const smashText =
    document.getElementById("smashText");

const doorCounter =
    document.getElementById("doorCounter");

const doorReveal =
    document.getElementById("doorReveal");

let doorHits = 0;

const requiredHits = 6;


function hitDoor() {

    if (doorHits >= requiredHits) {
        return;
    }

    doorHits++;

    magicDoor.classList.remove("hit");

    /*
        Force browser reflow so the animation
        can restart every time.
    */
    void magicDoor.offsetWidth;

    magicDoor.classList.add("hit");

    smashText.classList.remove("show");

    void smashText.offsetWidth;

    smashText.textContent =
        doorHits >= requiredHits
            ? "FINAL SMASH! 💥"
            : "SMASH! 💥";

    smashText.classList.add("show");

    doorCounter.textContent =
        `${doorHits} / ${requiredHits}`;

    if (doorHits === 1) {
        magicDoor.classList.add("crack-1");
    }

    if (doorHits === 3) {
        magicDoor.classList.add("crack-2");
    }

    if (doorHits >= 5) {
        magicDoor.classList.add("crack-3");
    }

    if (doorHits >= requiredHits) {
        breakDoor();
    }
}


function breakDoor() {

    magicDoor.disabled = true;

    setTimeout(() => {

        magicDoor.classList.add("broken");

        setTimeout(() => {

            doorReveal.classList.add("show");

        }, 650);

    }, 250);
}


magicDoor.addEventListener("click", hitDoor);


/* =========================================
   INTEREST CARDS
========================================= */

document
    .querySelectorAll(".interest-card")
    .forEach(card => {

        const button =
            card.querySelector(".expand-interest");

        button.addEventListener("click", event => {

            event.stopPropagation();

            card.classList.toggle("expanded");

            button.textContent =
                card.classList.contains("expanded")
                    ? "CLOSE"
                    : "READ MORE";

        });

    });


/* =========================================
   FUNNY MOMENT RANDOMIZER
========================================= */

const momentBtn =
    document.getElementById("momentBtn");

const momentResult =
    document.getElementById("momentResult");


const funnyMoments = [

    "Rhea has once again been detected being a Global Carmilla. 💀",

    "69–67 Carmilla user has entered the battlefield. Everyone run.",

    "Rhea picked Xavier and suddenly every kill became her personal property. ⚡",

    "Gold lane protection required. Daddy security department has been notified. 🛡️",

    "Minecraft mobs have officially added Rhea to their hit list. ⛏️",

    "Scientists have confirmed that Rhea should probably just play Ludo. 🎲"

];


momentBtn.addEventListener("click", () => {

    const randomIndex =
        Math.floor(
            Math.random() * funnyMoments.length
        );

    momentResult.textContent =
        funnyMoments[randomIndex];

});


/* =========================================
   MUSIC SYSTEM
========================================= */

const mainAudio =
    new Audio("music/main-theme.mp3");

const zestyAudio =
    new Audio("music/zesty-theme.mp3");

const finalAudio =
    new Audio("music/final-theme.mp3");


mainAudio.loop = true;
zestyAudio.loop = true;
finalAudio.loop = true;

mainAudio.volume = 0;
zestyAudio.volume = 0;
finalAudio.volume = 0;

let musicStarted = false;
let musicMuted = false;

const MUSIC_VOLUME = 0.42;

const musicBtn =
    document.getElementById("musicBtn");


function fadeAudio(audio, targetVolume, duration = 700) {

    const startVolume = audio.volume;

    const difference =
        targetVolume - startVolume;

    const startTime =
        performance.now();


    function animate(time) {

        const elapsed =
            time - startTime;

        const progress =
            Math.min(elapsed / duration, 1);

        audio.volume =
            startVolume +
            difference * progress;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}


function fadeInAudio(audio) {

    if (audio.paused) {

        audio.play().catch(() => {
            console.log("Audio waiting for user interaction.");
        });

    }

    const target =
        musicMuted ? 0 : MUSIC_VOLUME;

    fadeAudio(audio, target, 900);
}


function fadeOutAudio(audio) {

    fadeAudio(audio, 0, 700);

}


function startMainMusic() {

    if (musicStarted) {
        return;
    }

    musicStarted = true;

    mainAudio.currentTime = 0;

    mainAudio.play().catch(() => {
        console.log("Music playback blocked.");
    });

    fadeInAudio(mainAudio);

}


function handleSectionMusic(sectionNumber) {

    if (!musicStarted) {
        return;
    }

    /*
        Sections 1–5:
        Main theme
    */

    if (
        sectionNumber >= 1 &&
        sectionNumber <= 5
    ) {

        fadeOutAudio(zestyAudio);
        fadeOutAudio(finalAudio);

        fadeInAudio(mainAudio);

        return;
    }


    /*
        Section 6:
        Zesty theme
    */

    if (sectionNumber === 6) {

        fadeOutAudio(mainAudio);
        fadeOutAudio(finalAudio);

        fadeInAudio(zestyAudio);

        return;
    }


    /*
        Sections 7–9:
        Main theme
    */

    if (
        sectionNumber >= 7 &&
        sectionNumber <= 9
    ) {

        fadeOutAudio(zestyAudio);
        fadeOutAudio(finalAudio);

        fadeInAudio(mainAudio);

        return;
    }


    /*
        Sections 10–12:
        Final theme
    */

    if (sectionNumber >= 10) {

        fadeOutAudio(mainAudio);
        fadeOutAudio(zestyAudio);

        fadeInAudio(finalAudio);

        /*
            Final message slightly quieter.
        */

        if (sectionNumber === 11) {
            fadeAudio(
                finalAudio,
                musicMuted ? 0 : 0.27,
                600
            );
        }

    }

}


/* =========================================
   MUSIC BUTTON
========================================= */

musicBtn.addEventListener("click", () => {

    musicMuted = !musicMuted;

    musicBtn.textContent =
        musicMuted ? "🔇" : "🔊";

    const target =
        musicMuted
            ? 0
            : (
                currentSection === 6
                    ? MUSIC_VOLUME
                    : currentSection >= 10
                        ? 0.34
                        : MUSIC_VOLUME
            );

    if (currentSection === 6) {

        fadeAudio(
            zestyAudio,
            target,
            400
        );

    } else if (currentSection >= 10) {

        fadeAudio(
            finalAudio,
            target,
            400
        );

    } else {

        fadeAudio(
            mainAudio,
            target,
            400
        );

    }

});


/* =========================================
   CAT GAME 1
   CATCH THE CAT
========================================= */

const catchCat =
    document.getElementById("catchCat");

const catchArena =
    document.getElementById("catchArena");

const catchScoreDisplay =
    document.getElementById("catchScore");

const resetCatch =
    document.getElementById("resetCatch");

let catchScore = 0;


function moveCatchCat() {

    const arenaWidth =
        catchArena.clientWidth;

    const arenaHeight =
        catchArena.clientHeight;

    const catSize =
        catchCat.offsetWidth;

    const maxX =
        Math.max(0, arenaWidth - catSize);

    const maxY =
        Math.max(0, arenaHeight - catSize);

    const x =
        Math.random() * maxX;

    const y =
        Math.random() * maxY;

    catchCat.style.left =
        `${x}px`;

    catchCat.style.top =
        `${y}px`;

}


catchCat.addEventListener("click", () => {

    catchScore++;

    catchScoreDisplay.textContent =
        catchScore;

    moveCatchCat();

    checkCatMaster();

});


resetCatch.addEventListener("click", () => {

    catchScore = 0;

    catchScoreDisplay.textContent = "0";

    moveCatchCat();

});


/* =========================================
   CAT GAME 2
   TAP THE CAT
========================================= */

const tapCat =
    document.getElementById("tapCat");

const tapArena =
    document.getElementById("tapArena");

const tapScoreDisplay =
    document.getElementById("tapScore");

const resetTap =
    document.getElementById("resetTap");

let tapScore = 0;


function moveTapCat() {

    const arenaWidth =
        tapArena.clientWidth;

    const arenaHeight =
        tapArena.clientHeight;

    const catSize =
        tapCat.offsetWidth;

    const maxX =
        Math.max(0, arenaWidth - catSize);

    const maxY =
        Math.max(0, arenaHeight - catSize);

    tapCat.style.left =
        `${Math.random() * maxX}px`;

    tapCat.style.top =
        `${Math.random() * maxY}px`;

}


tapCat.addEventListener("click", () => {

    tapScore++;

    tapScoreDisplay.textContent =
        tapScore;

    moveTapCat();

    checkCatMaster();

});


resetTap.addEventListener("click", () => {

    tapScore = 0;

    tapScoreDisplay.textContent = "0";

    moveTapCat();

});


/* =========================================
   CAT GAME 3
   MEMORY
========================================= */

const memoryGrid =
    document.getElementById("memoryGrid");

const memoryScoreDisplay =
    document.getElementById("memoryScore");

const resetMemory =
    document.getElementById("resetMemory");


const memoryImages = [

    "cat-happy.jpeg",
    "cat-mischievous.jpeg",
    "cat-sleepy.jpeg",
    "cat-hungry.jpeg",
    "cat-excited.jpeg"

];


let memoryCards = [];
let firstCard = null;
let secondCard = null;
let memoryLocked = false;
let memoryScore = 0;


function shuffle(array) {

    return array.sort(
        () => Math.random() - 0.5
    );

}


function createMemoryGame() {

    memoryGrid.innerHTML = "";

    memoryCards = [];

    firstCard = null;
    secondCard = null;

    memoryLocked = false;

    memoryScore = 0;

    memoryScoreDisplay.textContent =
        "0";


    const doubled =
        shuffle(
            [...memoryImages, ...memoryImages]
        );


    doubled.forEach((image, index) => {

        const button =
            document.createElement("button");

        button.className =
            "memory-card";

        button.dataset.image =
            image;

        button.dataset.index =
            index;


        const img =
            document.createElement("img");

        img.src =
            `images/${image}`;

        img.alt =
            "Cat memory card";


        button.appendChild(img);

        button.addEventListener(
            "click",
            () => flipMemoryCard(button)
        );


        memoryGrid.appendChild(button);

        memoryCards.push(button);

    });

}


function flipMemoryCard(card) {

    if (memoryLocked) {
        return;
    }

    if (card.classList.contains("flipped")) {
        return;
    }

    if (card.classList.contains("matched")) {
        return;
    }


    card.classList.add("flipped");


    if (!firstCard) {

        firstCard = card;

        return;

    }


    secondCard = card;

    memoryLocked = true;


    if (
        firstCard.dataset.image ===
        secondCard.dataset.image
    ) {

        firstCard.classList.add("matched");

        secondCard.classList.add("matched");

        memoryScore++;

        memoryScoreDisplay.textContent =
            memoryScore;

        firstCard = null;
        secondCard = null;

        memoryLocked = false;

        checkCatMaster();

    } else {

        setTimeout(() => {

            firstCard.classList.remove("flipped");

            secondCard.classList.remove("flipped");

            firstCard = null;
            secondCard = null;

            memoryLocked = false;

        }, 700);

    }

}


resetMemory.addEventListener(
    "click",
    createMemoryGame
);


/* =========================================
   CAT GAME 4
   FEED CAT
========================================= */

const foodBtn =
    document.getElementById("foodBtn");

const feedMessage =
    document.getElementById("feedMessage");

const hungryCat =
    document.getElementById("hungryCat");

const resetFeed =
    document.getElementById("resetFeed");

let feedScore = 0;


foodBtn.addEventListener("click", () => {

    feedScore++;

    foodBtn.style.transform =
        "translate(-120px, 20px) scale(0.6)";

    setTimeout(() => {

        foodBtn.style.transform =
            "translate(0, 0) scale(1)";

    }, 350);


    if (feedScore < 3) {

        feedMessage.textContent =
            `Nom nom... ${feedScore}/3 🍗`;

    } else {

        feedMessage.textContent =
            "CAT FED SUCCESSFULLY! 😺❤️";

        hungryCat.style.transform =
            "translate(-50%, -50%) scale(1.12)";

        checkCatMaster();

    }

});


resetFeed.addEventListener("click", () => {

    feedScore = 0;

    feedMessage.textContent =
        "The cat is hungry...";

    hungryCat.style.transform =
        "translate(-50%, -50%) scale(1)";

});


/* =========================================
   CAT GAME 5
   CAT REACTION
========================================= */

const reactionMessage =
    document.getElementById("reactionMessage");

const resetReaction =
    document.getElementById("resetReaction");


let reactionCompleted = false;


document
    .querySelectorAll(".reaction-options button")
    .forEach(button => {

        button.addEventListener("click", () => {

            const selected =
                button.dataset.reaction;


            /*
                For this question:
                Someone gives Rhea a huge meal.

                Correct reaction:
                excited.
            */

            if (selected === "excited") {

                reactionMessage.textContent =
                    "CORRECT! Food detected. CAT MODE ACTIVATED. 😺";

                reactionCompleted = true;

                checkCatMaster();

            } else {

                reactionMessage.textContent =
                    "Wrong cat reaction. Try again. 💀";

            }

        });

    });


resetReaction.addEventListener("click", () => {

    reactionCompleted = false;

    reactionMessage.textContent =
        "Choose wisely.";

});


/* =========================================
   CAT MASTER
========================================= */

const catMaster =
    document.getElementById("catMaster");


function checkCatMaster() {

    /*
        We don't force the user to complete
        everything perfectly.

        Enough progress unlocks the achievement.
    */

    const enoughProgress =
        catchScore >= 3 &&
        tapScore >= 3 &&
        memoryScore >= 5 &&
        feedScore >= 3 &&
        reactionCompleted;


    if (enoughProgress) {

        catMaster.classList.remove("hidden");

    }

}


/* =========================================
   STATS ANIMATION
========================================= */

let statsAnimated = false;


function animateStats() {

    if (statsAnimated) {
        return;
    }

    statsAnimated = true;


    const stats =
        document.querySelectorAll(".stat");


    stats.forEach(stat => {

        const fill =
            stat.querySelector(".stat-fill");

        const number =
            stat.querySelector(
                ".stat-heading strong"
            );


        if (!fill || !number) {
            return;
        }


        const target =
            Number(number.dataset.value);


        let current = 0;


        const duration = 1300;

        const start =
            performance.now();


        function animate(time) {

            const progress =
                Math.min(
                    (time - start) / duration,
                    1
                );


            current =
                Math.floor(
                    target * progress
                );


            number.textContent =
                `${current}%`;


            fill.style.width =
                `${current}%`;


            if (progress < 1) {

                requestAnimationFrame(animate);

            } else {

                number.textContent =
                    `${target}%`;

                fill.style.width =
                    `${target}%`;

            }

        }


        requestAnimationFrame(animate);

    });

}


/* =========================================
   PARTICLES
========================================= */

const particleContainer =
    document.getElementById("particles");


function createParticles() {

    for (let i = 0; i < 45; i++) {

        const particle =
            document.createElement("div");

        particle.className =
            "particle";


        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.animationDuration =
            `${6 + Math.random() * 10}s`;

        particle.style.animationDelay =
            `${Math.random() * 8}s`;

        particle.style.opacity =
            `${0.2 + Math.random() * 0.6}`;

        const size =
            2 + Math.random() * 3;

        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;


        particleContainer.appendChild(
            particle
        );

    }

}


createParticles();


/* =========================================
   RESTART SYSTEM
========================================= */

const restartBtn =
    document.getElementById("restartBtn");


restartBtn.addEventListener("click", restartExperience);


function restartExperience() {

    /*
        Reset section.
    */

    currentSection = 1;

    sections.forEach(section => {
        section.classList.remove("active");
    });

    document
        .getElementById("section1")
        .classList.add("active");


    sectionCounter.textContent =
        "1 / 12";

    progressBar.style.width =
        "8.33%";


    /*
        Reset door.
    */

    doorHits = 0;

    magicDoor.disabled = false;

    magicDoor.className =
        "magic-door";

    doorCounter.textContent =
        "0 / 6";

    doorReveal.classList.remove("show");


    /*
        Reset cat games.
    */

    catchScore = 0;

    catchScoreDisplay.textContent =
        "0";

    tapScore = 0;

    tapScoreDisplay.textContent =
        "0";

    feedScore = 0;

    feedMessage.textContent =
        "The cat is hungry...";

    reactionCompleted = false;

    reactionMessage.textContent =
        "Choose wisely.";

    catMaster.classList.add("hidden");


    createMemoryGame();


    /*
        Reset stats.
    */

    statsAnimated = false;

    document
        .querySelectorAll(".stat-fill")
        .forEach(fill => {
            fill.style.width = "0%";
        });

    document
        .querySelectorAll(
            ".stat-heading strong[data-value]"
        )
        .forEach(number => {

            number.textContent =
                "0%";

        });


    /*
        Reset Zesty.
    */

    document
        .getElementById("zestyWarning")
        .classList.remove("hidden");

    document
        .getElementById("zestyContent")
        .classList.add("hidden");


    /*
        Reset music.

        Stop all tracks and prepare main theme.
    */

    mainAudio.pause();
    zestyAudio.pause();
    finalAudio.pause();

    mainAudio.currentTime = 0;
    zestyAudio.currentTime = 0;
    finalAudio.currentTime = 0;

    mainAudio.volume = 0;
    zestyAudio.volume = 0;
    finalAudio.volume = 0;

    musicStarted = false;

    musicMuted = false;

    musicBtn.textContent =
        "🔊";


    /*
        Return to the top.
    */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   ZESTY ENTER
========================================= */

const zestyEnter =
    document.getElementById("zestyEnter");

const zestyWarning =
    document.getElementById("zestyWarning");

const zestyContent =
    document.getElementById("zestyContent");


zestyEnter.addEventListener("click", () => {

    zestyWarning.classList.add("hidden");

    zestyContent.classList.remove("hidden");

    /*
        Make sure zesty music starts immediately
        after a direct user click.
    */

    if (musicStarted) {

        fadeOutAudio(mainAudio);

        if (zestyAudio.paused) {

            zestyAudio.play().catch(() => {});

        }

        fadeInAudio(zestyAudio);

    }

});


/* =========================================
   INITIALIZATION
========================================= */

createMemoryGame();

moveCatchCat();

moveTapCat();


/*
    Make sure only Section 1 starts visible.
*/

sections.forEach((section, index) => {

    if (index === 0) {

        section.classList.add("active");

    } else {

        section.classList.remove("active");

    }

});


/*
    Keyboard navigation.

    ArrowRight / PageDown:
    next section

    ArrowLeft / PageUp:
    previous section
*/

document.addEventListener("keydown", event => {

    if (
        event.key === "ArrowRight" ||
        event.key === "PageDown"
    ) {

        if (currentSection < sections.length) {

            showSection(
                currentSection + 1
            );

        }

    }


    if (
        event.key === "ArrowLeft" ||
        event.key === "PageUp"
    ) {

        if (currentSection > 1) {

            showSection(
                currentSection - 1
            );

        }

    }

});


/* =========================================
   TOUCH / RESIZE SAFETY
========================================= */

window.addEventListener("resize", () => {

    if (currentSection === 8) {

        moveCatchCat();

        moveTapCat();

    }

});