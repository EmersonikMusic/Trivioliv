// Unsure
const progressElement = document.getElementById("progress");

// Declaring question and answer display
const questionDisplay = document.querySelector(".question-container");
const answerDisplay = document.querySelector(".answer-container");

// Declaring game setting variables
var number_of_questions = 10;
var time_per_question = 5;
var time_per_answer = 5;
var game_started = false;
var menu_hidden = false;
var current_question_category = null;
let pauseFlag = false;

// Declaring banned category/difficulty/era lists
var category_list = [];
var difficulty_list = [];
var era_list = [];

// Declaring variables for ALL/NONE buttons
var all_none_categories = true;
var all_none_difficulties = true;
var all_none_eras = true;
var categoryButtons = document.querySelectorAll(".category");
var difficultyButtons = document.querySelectorAll(".difficulty");
var eraButtons = document.querySelectorAll(".era");

// Declaring of mapping of category, difficulty, and era numbers to their respective names
var category_number_identities = {
  1: "Art",
  2: "Economy",
  3: "Food & Drink",
  4: "Games",
  5: "Geography",
  6: "History",
  7: "Human Body",
  8: "Language",
  9: "Literature",
  10: "Math",
  11: "Miscellaneous",
  12: "Movies",
  13: "Music",
  14: "Nature",
  15: "Philosophy",
  16: "Politics",
  17: "Pop Culture",
  18: "Science",
  19: "Sports",
  20: "Technology",
  21: "Television",
  22: "Performing Arts",
  23: "Theology",
  24: "Video Games",
  33: "Law",
};

// Does nothing right now
var loginwalled_categories = {
  3: "Food & Drink",
  4: "Games",
  11: "Miscellaneous",
  15: "Philosophy",
  16: "Politics",
  17: "Pop Culture",
  22: "Performing Arts",
  23: "Theology",
  24: "Video Games",
  33: "Law",
};

var difficulty_number_identities = {
  5: "Genius",
  4: "Hard",
  3: "Average",
  2: "Easy",
  1: "Casual",
};

var era_number_identities = {
  1: "Pre-1500",
  2: "1500-1800",
  3: "1800-1900",
  4: "1900-1950",
  5: "1950s",
  6: "1960s",
  7: "1970s",
  8: "1980s",
  9: "1990s",
  10: "2000s",
  11: "2010s",
  12: "2020s",
};

// Mapping of category names to their associated colors
var category_colors = {
  Art: "linear-gradient(345deg, rgba(165,50,27,1) 0%, rgba(221,126,107,1) 100%)",

  Economy:
    "linear-gradient(345deg, rgba(17,68,16,1) 0%, rgba(89,140,88,1) 100%)",

  "Food & Drink":
    "linear-gradient(345deg, rgba(127,43,11,1) 0%, rgba(242,133,0,1) 100%)",

  Games: "linear-gradient(345deg, rgba(103,38,24,1) 0%, rgba(204,85,0,1) 100%)",

  Geography:
    "linear-gradient(345deg, rgba(61,38,19,1) 0%, rgba(154,123,79,1) 100%)",

  History:
    "linear-gradient(345deg, rgba(241,194,50,1) 0%, rgba(241,154,50,1) 100%)",

  "Human Body":
    "linear-gradient(345deg, rgba(106,77,20,1) 0%, rgba(180,130,32,1) 100%)",

  Language:
    "linear-gradient(345deg, rgba(28,60,133,1) 0%, rgba(102,147,245,1) 100%)",

  Law: "linear-gradient(345deg, rgba(189,76,51,1) 0%, rgba(111,62,51,1) 100%)",

  Literature:
    "linear-gradient(345deg, rgba(202,128,39,1) 0%, rgba(217,157,41,1) 100%)",

  Math: "linear-gradient(345deg, rgba(63,61,54,1) 0%, rgba(101,99,92,1) 100%)",

  Miscellaneous:
    "linear-gradient(345deg, rgba(13,109,122,1) 0%, rgba(18,168,152,1) 100%)",

  Movies: "linear-gradient(345deg, rgba(184,34,34,1) 0%, rgba(102,0,0,1) 100%)",

  Music: "linear-gradient(345deg, rgba(9,110,62,1) 0%, rgba(29,185,84,1) 100%)",

  Nature: "linear-gradient(345deg, rgba(8,83,27,1) 0%, rgba(4,57,39,1) 100%)",

  Philosophy:
    "linear-gradient(345deg, rgba(89,61,128,1) 0%, rgba(151,95,172,1) 100%)",

  Politics:
    "linear-gradient(345deg, rgba(84,30,140,1) 0%, rgba(53,28,117,1) 100%)",

  "Pop Culture":
    "linear-gradient(345deg, rgba(233,85,148,1) 0%, rgba(255,143,171,1) 100%)",

  Science:
    "linear-gradient(345deg, rgba(6,85,83,1) 0%, rgba(11,103,56,1) 100%)",

  Sports:
    "linear-gradient(345deg, rgba(44,66,121,1) 0%, rgba(19,30,58,1) 100%)",

  Technology:
    "linear-gradient(345deg, rgba(22,134,161,1) 0%, rgba(31,89,103,1) 100%)",

  Television:
    "linear-gradient(345deg, rgba(45,44,41,1) 0%, rgba(87,81,78,1) 100%)",

  "Performing Arts":
    "linear-gradient(345deg, rgba(183,75,0,1) 0%, rgba(183,0,0,1) 100%)",

  Theology:
    "linear-gradient(345deg, rgba(64,14,66,1) 0%, rgba(60,19,33,1) 100%)",

  "Video Games":
    "linear-gradient(345deg, rgba(153,0,255,1) 0%, rgba(60,13,128,1) 100%)",
};

// Declaring variables for the base URL for fetching questions
var baseUrl = "https://triviolivia.herokuapp.com/api/questions";
var moddedUrl = "";
var queryParams = [];
let globalData;

// Default message in bar
document.getElementById("demo").innerHTML =
  'Press <span id="start-game" style="cursor: pointer; display: inline;" onclick="dontFetchDataIfAllDeselected()"><b>START</b></span> to play.';

// Async JS that kind of scares me, honestly
async function fetchData(moddedUrl) {
  const response = await fetch(moddedUrl);
  const data = await response.json();
  globalData = data.slice(); // Create a copy of the array
  shuffleArray(globalData); // Shuffle the copy
  console.log(globalData);
}

// Function to not fetch JSON data if any of cat/dif/era are all deselected
function dontFetchDataIfAllDeselected() {
  console.log(category_list);
  if (category_list.length > 24) {
    document.getElementById("demo").innerHTML =
      "Cannot start game. You must select at least one category.";
  } else if (difficulty_list.length > 4) {
    document.getElementById("demo").innerHTML =
      "Cannot start game. You must select at least one difficulty.";
  } else if (era_list.length > 11) {
    document.getElementById("demo").innerHTML =
      "Cannot start game. You must select at least one era.";
  } else {
    changeButtonText();
    fetchQuestionsAndStartGame();
    const hideAllMenus = () => {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
        checkbox.nextElementSibling.classList.remove("active");
      });
    };
    hideAllMenus();
  }
}

// Function to fetch JSON data asynchronously
function fetchQuestionsAndStartGame() {
  if (game_started == true) {
    console.log("Button pressed.");
    console.log("pauseFlag: " + pauseFlag);
    console.log("isPaused: " + isPaused);
  } else {
    game_started = true;
    globalData = [];
    if (category_list.length > 0) {
      queryParams.push("category=" + category_list.join(","));
    }
    if (difficulty_list.length > 0) {
      queryParams.push("difficulty=" + difficulty_list.join(","));
    }
    if (era_list.length > 0) {
      queryParams.push("era=" + era_list.join(","));
    }
    const urlWithParams =
      baseUrl +
      "?questions=" +
      number_of_questions +
      "&" +
      queryParams.join("&");
    moddedUrl = urlWithParams;
    menu_hidden = true;
    mainGameFunction();
  }
}

// Function to shuffle returned array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

// Future function of reset functionality
function confirm_reset() {
  document.getElementById("demo").innerHTML =
    "Are you sure you want to reset the game?";
  //Yes/No?
  //Reset function call
}

// Function for indicator light toggle
function toggleIndicator(button) {
  if (button.classList.contains("active")) {
    button.classList.remove("active");
    button.classList.add("inactive");
    console.log(button);
  } else {
    button.classList.remove("inactive");
    button.classList.add("active");
    console.log(button);
  }
}

//Function to hide or show menu sections
const checkboxes = document.querySelectorAll(".toggle");

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      checkboxes.forEach((otherCheckbox) => {
        if (otherCheckbox !== this) {
          otherCheckbox.checked = false;
          otherCheckbox.nextElementSibling.classList.remove("active");
        }
      });
    }
    this.nextElementSibling.classList.toggle("active", this.checked);
  });
});

//Functions to toggle categories, difficulties, and eras
function toggle_categories(clicked_id) {
  // Find the button index for visual update (buttons are zero-indexed, IDs are 1-indexed)
  const buttonIndex = parseInt(clicked_id) - 1;
  const button = categoryButtons[buttonIndex];
  
  if (!category_list.includes(clicked_id)) {
    // Not in list (currently enabled) -> disable it
    document.getElementById("demo").innerHTML =
      "You have disabled the " +
      category_number_identities[clicked_id] +
      " category.";
    category_list.push(clicked_id);
    
    // Update visual state
    if (button) {
      button.classList.remove("active");
      button.classList.add("inactive");
    }
    
    console.log("Category disabled:", clicked_id);
    console.log("Updated category list:", category_list);
  } else {
    // In list (currently disabled) -> enable it
    document.getElementById("demo").innerHTML =
      "You have enabled the " +
      category_number_identities[clicked_id] +
      " category.";
    category_list.splice(category_list.indexOf(clicked_id), 1);
    
    // Update visual state
    if (button) {
      button.classList.remove("inactive");
      button.classList.add("active");
    }
    
    console.log("Category enabled:", clicked_id);
    console.log("Updated category list:", category_list);
  }
}

function toggle_difficulties(clicked_id) {
  // Find the button index for visual update (buttons are zero-indexed, IDs are 1-indexed)
  const buttonIndex = parseInt(clicked_id) - 1;
  const button = difficultyButtons[buttonIndex];
  
  if (!difficulty_list.includes(clicked_id)) {
    // Not in list (currently enabled) -> disable it
    document.getElementById("demo").innerHTML =
      "You have disabled the " +
      difficulty_number_identities[clicked_id] +
      " difficulty.";
    difficulty_list.push(clicked_id);
    
    // Update visual state
    if (button) {
      button.classList.remove("active");
      button.classList.add("inactive");
    }
    
    console.log("Difficulty disabled:", clicked_id);
    console.log("Updated difficulty list:", difficulty_list);
  } else {
    // In list (currently disabled) -> enable it
    document.getElementById("demo").innerHTML =
      "You have enabled the " +
      difficulty_number_identities[clicked_id] +
      " difficulty.";
    difficulty_list.splice(difficulty_list.indexOf(clicked_id), 1);
    
    // Update visual state
    if (button) {
      button.classList.remove("inactive");
      button.classList.add("active");
    }
    
    console.log("Difficulty enabled:", clicked_id);
    console.log("Updated difficulty list:", difficulty_list);
  }
}

function toggle_eras(clicked_id) {
  // Find the button index for visual update (buttons are zero-indexed, IDs are 1-indexed)
  const buttonIndex = parseInt(clicked_id) - 1;
  const button = eraButtons[buttonIndex];
  
  if (!era_list.includes(clicked_id)) {
    // Not in list (currently enabled) -> disable it
    document.getElementById("demo").innerHTML =
      "You have disabled the " + era_number_identities[clicked_id] + " era.";
    era_list.push(clicked_id);
    
    // Update visual state
    if (button) {
      button.classList.remove("active");
      button.classList.add("inactive");
    }
    
    console.log("Era disabled:", clicked_id);
    console.log("Updated era list:", era_list);
  } else {
    // In list (currently disabled) -> enable it
    document.getElementById("demo").innerHTML =
      "You have enabled the " + era_number_identities[clicked_id] + " era.";
    era_list.splice(era_list.indexOf(clicked_id), 1);
    
    // Update visual state
    if (button) {
      button.classList.remove("inactive");
      button.classList.add("active");
    }
    
    console.log("Era enabled:", clicked_id);
    console.log("Updated era list:", era_list);
  }
}

//Functions to change number of questions, time per question, and time per answer
function change_number_of_questions(clicked_id) {
  number_of_questions = parseInt(clicked_id);
  document.getElementById("demo").innerHTML =
    "Game set to " + number_of_questions + " questions.";
}

function change_time_per_question(clicked_id) {
  time_per_question = clicked_id;
  document.getElementById("demo").innerHTML =
    "Questions will display for " + time_per_question + " seconds.";
  console.log(time_per_question);
}

function change_time_per_answer(clicked_id) {
  time_per_answer = clicked_id;
  document.getElementById("demo").innerHTML =
    "Answers will display for " + time_per_answer + " seconds.";
  console.log(time_per_answer);
}

//Question class declaration
let Question = class {
  constructor(number, category, difficulty, question, answer) {
    this.number = number;
    this.category = category;
    this.difficulty = difficulty;
    this.question = question;
    this.answer = answer;
  }
};

// Arrow functions to show question and answer
const showQuestion = (displayed_question) => {
  const div = document.getElementById("question-container");
  // div.style.opacity = 1;

  // Clear the existing question and answer only when a new question is shown
  questionDisplay.innerHTML = "";
  answerDisplay.innerHTML = "";

  // Create and display the new question
  const messageElement = document.createElement("p");
  messageElement.textContent = displayed_question;
  questionDisplay.append(messageElement);
};

const showAnswer = (displayed_answer) => {
  const div = document.getElementById("question-container");
  // div.style.opacity = 0.7;

  // Clear the previous answer only (not the question)
  answerDisplay.innerHTML = "";

  // Create and display the new answer
  const messageElement = document.createElement("p");
  messageElement.textContent = displayed_answer;
  answerDisplay.append(messageElement);
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));




// Loading animation display function
function displayLoadingAnimation() {
  const container = document.getElementById('question-container');
  
  // Remove any existing loader to prevent duplicates
  const existingLoader = container.querySelector('.loader');
  if (existingLoader) {
      existingLoader.remove();
  }

  // Create loader div
  const loader = document.createElement('div');
  loader.classList.add('loader');

  // Create three dots
  for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      loader.appendChild(dot);
  }

  // Append loader to container
  container.appendChild(loader);
}



const mainGameFunction = async () => {
  document.getElementById("demo").innerHTML = "Fetching questions...";

  questionDisplay.innerHTML = "";
  answerDisplay.innerHTML = "";

  // displayLoadingAnimation()
  displayLoader();

  try {
    const fetchPromise = fetchData(moddedUrl);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 20000)
    );

    await Promise.race([fetchPromise, timeoutPromise]);

    document.getElementById("demo").innerHTML = "Questions fetched!";
    await delay(1000);
  } catch (error) {
    document.getElementById("demo").innerHTML =
      "Could not fetch questions due to settings or connection problems. Please try again or change settings.";
    return; // Stop execution if fetch fails
  }

  document.getElementById("demo").innerHTML = "Game starts in 3.";
  await delay(1000);
  document.getElementById("demo").innerHTML = "Game starts in 2..";
  await delay(1000);
  document.getElementById("demo").innerHTML = "Game starts in 1...";
  await delay(1000);
  document.getElementById("demo").innerHTML = "Go!";
  await delay(1000);

  for (let i = 0; i < number_of_questions; i++) {
    if (!pauseFlag) {
      progressBar.style.animationPlayState = "running";
      progressBar.style.animation = `depleteProgress ${time_per_question}s linear infinite`;
      isPaused = false;
    } else {
      progressBar.style.animationPlayState = "paused";
      progressBar.style.animation = "none";
      progressBar.offsetHeight; // Trigger reflow
      progressBar.style.animation = `depleteProgress ${time_per_answer}s linear infinite`;
    }

    while (!pauseFlag) {
      await delay(100);
    }

    document.body.style.background =
      category_colors[globalData[i].category_name];

    const character = document.getElementById("character");
    character.innerHTML =
      contentDict[globalData[i].category_name.toLowerCase()];

      const character2 = document.getElementById("character2");
character2.innerHTML = contentDict[globalData[i].category_name.toLowerCase()];
character2.style.display = "block";

// Ensure SVG maintains its original dimensions
const svg = character2.querySelector("svg");
if (svg) {
  // Preserve original aspect ratio without scaling to fit container
  svg.setAttribute("preserveAspectRatio", "xMidYMid");
  
  // Remove any width/height styles that might cause stretching
  svg.style.width = "auto";
  svg.style.height = "auto";
  
  // Ensure the SVG is visible but not stretched
  svg.style.maxWidth = "100%";
}

    let questionTimeRemaining = time_per_question * 10;
    let answerTimeRemaining = time_per_answer * 10;

    showQuestion(globalData[i].text);

    while (questionTimeRemaining > 0) {
      if (!pauseFlag) {
        await delay(100);
        continue;
      }
      await delay(100);
      questionTimeRemaining--;
      let question_seconds = Math.floor(questionTimeRemaining / 10);
      let question_tenths = questionTimeRemaining % 10;
      document.getElementById("demo").innerHTML = `Q${i + 1} - ${globalData[
        i
      ].category_name.toUpperCase()} - ${globalData[
        i
      ].difficulty_name.toUpperCase()} - Mark Mazurek - ${question_seconds}.${question_tenths}s`;
    }

    showAnswer(globalData[i].answer);

    while (answerTimeRemaining > 0) {
      if (!pauseFlag) {
        await delay(100);
        continue;
      }
      await delay(100);
      answerTimeRemaining--;
      let answer_seconds = Math.floor(answerTimeRemaining / 10);
      let answer_tenths = answerTimeRemaining % 10;
      document.getElementById("demo").innerHTML = `Q${i + 1} - ${globalData[
        i
      ].category_name.toUpperCase()} - ${globalData[
        i
      ].difficulty_name.toUpperCase()} - Mark Mazurek - ${answer_seconds}.${answer_tenths}s`;
    }

    showAnswer("");
  }

  game_started = false;
  pauseFlag = false;
  showQuestion("Thanks for playing!");
  progressBar.style.animationPlayState = "paused";
  document.getElementById("start-pause").textContent = "START";
  document.getElementById("demo").innerHTML =
    'Press <span id="start-game" style="cursor: pointer; display: inline;" onclick="dontFetchDataIfAllDeselected()">START</span> to play again. Copyright &copy; 2025. Contact us at <a href="mailto:example@email.com">mark.mazurek@triviolivia.com</a>';
};

// Function to pause the game
function pauseGame() {
  pauseFlag = true;
}

// Function to resume the game
function resumeGame() {
  pauseFlag = false;
  mainGameFunction(); // Resume execution
}

//Functions to disable and enable category, difficulty, era
function disable_category(clicked_id) {
  if (!category_list.includes(clicked_id)) {
    category_list.push(clicked_id);
    console.log(category_list);
  } else {
    console.log(category_list);
  }
}

function enable_category(clicked_id) {
  if (!category_list.includes(clicked_id)) {
    console.log(category_list);
  } else {
    category_list.splice(category_list.indexOf(clicked_id), 1);
    console.log(category_list);
  }
}

function disable_difficulty(clicked_id) {
  if (!difficulty_list.includes(clicked_id)) {
    difficulty_list.push(clicked_id);
    console.log(difficulty_list);
  } else {
    console.log(difficulty_list);
  }
}

function enable_difficulty(clicked_id) {
  if (!difficulty_list.includes(clicked_id)) {
    console.log(difficulty_list);
  } else {
    difficulty_list.splice(difficulty_list.indexOf(clicked_id), 1);
    console.log(difficulty_list);
  }
}

function disable_era(clicked_id) {
  if (!era_list.includes(clicked_id)) {
    era_list.push(clicked_id);
    console.log(era_list);
  } else {
    console.log(era_list);
  }
}

function enable_era(clicked_id) {
  if (!era_list.includes(clicked_id)) {
    console.log(era_list);
  } else {
    era_list.splice(era_list.indexOf(clicked_id), 1);
    console.log(era_list);
  }
}

//Functions for ALL/NONE buttons - FIXED VERSION
function allNoneCategoriesButton() {
  if (all_none_categories == true) {
    // Currently showing "ALL", so disable all categories
    category_list = []; // Clear existing list
    
    // Get all category IDs from identities object
    Object.keys(category_number_identities).forEach(id => {
      category_list.push(id);
    });
    
    // Update visual state of buttons
    for (let i = 0; i < categoryButtons.length; i++) {
      categoryButtons[i].classList.remove("active");
      categoryButtons[i].classList.add("inactive");
    }
    
    all_none_categories = false;
    document.getElementById("demo").innerHTML =
      "You must select at least one category before starting the game.";
  } else {
    // Currently showing "NONE", so enable all categories
    category_list = []; // Clear the list to enable all
    
    // Update visual state of buttons
    for (let i = 0; i < categoryButtons.length; i++) {
      categoryButtons[i].classList.remove("inactive");
      categoryButtons[i].classList.add("active");
    }
    
    all_none_categories = true;
    document.getElementById("demo").innerHTML =
      "You have enabled all categories.";
  }
  console.log("Category list after ALL/NONE toggle:", category_list);
}

function allNoneDifficultiesButton() {
  if (all_none_difficulties == true) {
    // Currently showing "ALL", so disable all difficulties
    difficulty_list = []; // Clear existing list
    
    // Get all difficulty IDs from identities object
    Object.keys(difficulty_number_identities).forEach(id => {
      difficulty_list.push(id);
    });
    
    // Update visual state of buttons
    for (let i = 0; i < difficultyButtons.length; i++) {
      difficultyButtons[i].classList.remove("active");
      difficultyButtons[i].classList.add("inactive");
    }
    
    all_none_difficulties = false;
    document.getElementById("demo").innerHTML =
      "You must select at least one difficulty before starting the game.";
  } else {
    // Currently showing "NONE", so enable all difficulties
    difficulty_list = []; // Clear the list to enable all
    
    // Update visual state of buttons
    for (let i = 0; i < difficultyButtons.length; i++) {
      difficultyButtons[i].classList.remove("inactive");
      difficultyButtons[i].classList.add("active");
    }
    
    all_none_difficulties = true;
    document.getElementById("demo").innerHTML =
      "You have enabled all difficulties.";
  }
  console.log("Difficulty list after ALL/NONE toggle:", difficulty_list);
}

function allNoneErasButton() {
  if (all_none_eras == true) {
    // Currently showing "ALL", so disable all eras
    era_list = []; // Clear existing list
    
    // Get all era IDs from identities object
    Object.keys(era_number_identities).forEach(id => {
      era_list.push(id);
    });
    
    // Update visual state of buttons
    for (let i = 0; i < eraButtons.length; i++) {
      eraButtons[i].classList.remove("active");
      eraButtons[i].classList.add("inactive");
    }
    
    all_none_eras = false;
    document.getElementById("demo").innerHTML =
      "You must select at least one era before starting the game.";
  } else {
    // Currently showing "NONE", so enable all eras
    era_list = []; // Fixed: Changed from category_list to era_list
    
    // Update visual state of buttons
    for (let i = 0; i < eraButtons.length; i++) {
      eraButtons[i].classList.remove("inactive");
      eraButtons[i].classList.add("active");
    }
    
    all_none_eras = true;
    document.getElementById("demo").innerHTML =
      "You have enabled all eras.";
  }
  console.log("Era list after ALL/NONE toggle:", era_list);
}

// Slider functions
const questionSlider = document.getElementById("questionSlider");
const perQuestionSlider = document.getElementById("perQuestionSlider");
const perAnswerSlider = document.getElementById("perAnswerSlider");

questionSlider.addEventListener("input", function () {
  updateLabel("questionLabel", this.value, " QUESTIONS");
  change_number_of_questions(this.value);
});

perQuestionSlider.addEventListener("input", function () {
  updateLabel("perQuestionLabel", this.value, "s / QUESTION");
  change_time_per_question(this.value);
});

perAnswerSlider.addEventListener("input", function () {
  updateLabel("perAnswerLabel", this.value, "s / ANSWER");
  change_time_per_answer(this.value);
});

function updateLabel(labelId, value, unit) {
  document.getElementById(labelId).textContent = value + unit;
}

//Function to change START GAME text
function changeButtonText() {
  var button = document.getElementById("start-pause");
  if (pauseFlag === false) {
    button.textContent = "PAUSE";
    progressBar.style.animationPlayState = "running";
    pauseFlag = true;
  } else if (pauseFlag === true && game_started === true) {
    button.textContent = "RESUME";
    progressBar.style.animationPlayState = "paused";
    pauseFlag = false;
    console.log("Game paused.");
    document.getElementById("demo").innerHTML =
      'GAME PAUSED. Press <span id="start-game" style="cursor: pointer; display: inline;" onclick="dontFetchDataIfAllDeselected()">RESUME GAME</span> to continue.';
  } else {
    button.textContent = "START";
    pauseFlag = false;
  }
}


//Function SUGGESTED by CLAUDE to change both START GAME text
// function changeButtonText() {
//   var button = document.getElementById("start-pause");
//   var button2 = document.getElementById("start-pause2");
  
//   if (pauseFlag === false) {
//     button.textContent = "PAUSE GAME";
//     button2.textContent = "PAUSE GAME";
//     progressBar.style.animationPlayState = "running";
//     pauseFlag = true;
//   } else if (pauseFlag === true && game_started === true) {
//     button.textContent = "RESUME GAME";
//     button2.textContent = "RESUME GAME";
//     progressBar.style.animationPlayState = "paused";
//     pauseFlag = false;
//     console.log("Game paused.");
//     document.getElementById("demo").innerHTML =
//       'GAME PAUSED. Press <span id="start-game" style="cursor: pointer; display: inline;" onclick="dontFetchDataIfAllDeselected()">RESUME GAME</span> to continue.';
//   } else {
//     button.textContent = "START GAME";
//     button2.textContent = "START GAME";
//     pauseFlag = false;
//   }
// }

// New function to disable banned categories
function disableBannedCategories() {}

//Dynamic question and answer timer bar attempt
let progressBar = document.getElementById("progress");
let startButton = document.getElementById("startButton");
let pauseButton = document.getElementById("pauseButton");
let isPaused = true;

startButton.addEventListener("click", function () {
  if (isPaused) {
    //   progressBar.style.animationPlayState = "paused";
    progressBar.style.animation =
      "depleteProgress " + time_per_question + "s linear infinite";
    isPaused = false;
  } else {
    //   progressBar.style.animationPlayState = "running";
    progressBar.style.animation = "none";
    progressBar.offsetHeight; // Trigger reflow to reset animation
    progressBar.style.animation =
      "depleteProgress " + time_per_answer + "s linear infinite";
  }
});

pauseButton.addEventListener("click", function () {
  if (!isPaused) {
    progressBar.style.animationPlayState = "running";
    isPaused = false;
  } else {
    progressBar.style.animationPlayState = "paused";
    isPaused = true;
  }
});

progressBar.addEventListener("animationiteration", function () {
  if (!isPaused) {
    progressBar.style.animation =
      "replenishProgress " +
      time_per_answer +
      "s linear forwards, shrinkProgress " +
      time_per_question +
      "s linear forwards";
  }
});

// Makes pressing space bar start/pause the game
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    // Checks if the spacebar is pressed
    event.preventDefault(); // Prevents the page from scrolling when pressing space
    document.getElementById("start-game").click(); // Simulates a button click
  }
});

// Refetch questions button function
function refetchAndRestart() {
  console.log("Refetching questions with currently selected game settings...");

  game_started = false;
  menu_hidden = false;
  current_question_category = null;
  pauseFlag = false;
  globalData = [];

  baseUrl = "https://triviolivia.herokuapp.com/api/questions";
  moddedUrl = "";
  queryParams = [];
  globalData = [];

  dontFetchDataIfAllDeselected();

  console.log("Refetch request completed");
}

// Reset settings button
function resetSettings() {
  console.log("Resetting the game to its original settings...");

  all_none_categories = false;
  allNoneCategoriesButton();
  all_none_difficulties = false;
  allNoneDifficultiesButton();
  all_none_eras = false;
  allNoneErasButton();

  document.getElementById("demo").innerHTML =
    'You have enabled all categories, difficulties, and eras. Press <span id="refetch-and-restart" style="cursor: pointer; display: inline;" onclick="refetchAndRestart()">REFETCH AND RESTART</span> to play again.';

  game_started = false;
  menu_hidden = false;
  current_question_category = null;
  pauseFlag = false;
  category_list = [];
  difficulty_list = [];
  era_list = [];

  baseUrl = "https://triviolivia.herokuapp.com/api/questions";
  moddedUrl = "";
  queryParams = [];
  globalData = [];

  console.log("Game settings reset completed.");
}

// About Us stuff
function displayAboutUs() {
  pauseFlag = true;
  const card = document.getElementById("about-us-card");
  const overlay = document.getElementById("overlay");
  card.style.display = "block";
  overlay.style.display = "block";
}

function closeAboutUs() {
  pauseFlag = false;
  const card = document.getElementById("about-us-card");
  const overlay = document.getElementById("overlay");
  card.style.display = "none";
  overlay.style.display = "none";
}

// Fullscreen mode attempt
function toggleFullscreen() {
  let elem = document.documentElement;

  // Detect iOS devices (Safari or Chrome)
  let isiOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (!isiOS) {
    // Use the Fullscreen API for Android and Desktop
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      exitFullscreen();
    } else {
      enterFullscreen(elem);
    }
  } else {
    // For iPhone and iPad, simulate fullscreen using layout tricks
    simulateFullscreenOnMobile();
  }
}

function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    // Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    // Chrome, Safari, Edge, Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    // IE11
    element.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    // Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    // Chrome, Safari, Edge, Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    // IE11
    document.msExitFullscreen();
  }
}

function simulateFullscreenOnMobile() {
  // Hide Safari and Chrome UI on iOS by simulating fullscreen
  document.documentElement.style.height = "100%";
  document.documentElement.style.overflow = "hidden";
  document.body.style.height = "100%";
  document.body.style.overflow = "hidden";

  // Hide the address bar in Safari and Chrome (scroll trick)
  window.scrollTo(0, 1);

  // Optionally, show a prompt to add to home screen for a more app-like experience
  if (window.matchMedia("(display-mode: standalone)").matches) {
    // If the page is added to the home screen, we can assume it's "fullscreen"
    document.body.style.marginTop = "0px";
  }
}


// Display loader animation
function displayLoader() {
  // Get the question container
  const questionContainer = document.querySelector('.question-container');
  
  // Clear any previous content
  questionContainer.innerHTML = '';
  
  // Create the loader element
  const loader = document.createElement('div');
  loader.className = 'loader';
  
  // Create three dot elements
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    loader.appendChild(dot);
  }
  
  // Add the loader to the question container
  questionContainer.appendChild(loader);
}


// Fix for mobile viewport height issues
document.addEventListener('DOMContentLoaded', function() {
  // Function to handle resize and orientation changes
  function handleMobileLayout() {
      // Only apply on mobile
      if (window.innerWidth <= 767) {
          // Get the real viewport height
          let vh = window.innerHeight;
          
          // Set the height of game area to leave space for menu
          let gameArea = document.querySelector('.game-area');
          let mobileMenu = document.querySelector('.mobile-menu');
          
          // Calculate height based on viewport
          let menuHeight = vh * 0.25; // 25vh
          let gameHeight = vh - menuHeight - 20; // Subtract menu height and some padding
          
          // Apply heights
          if (gameArea && mobileMenu) {
              gameArea.style.height = gameHeight + 'px';
              mobileMenu.style.height = menuHeight + 'px';
          }
      }
  }
  
  // Initial call
  handleMobileLayout();
  
  // Add event listeners
  window.addEventListener('resize', handleMobileLayout);
  window.addEventListener('orientationchange', handleMobileLayout);
  
  // Fix for iOS Safari when address bar appears/disappears
  window.addEventListener('scroll', function() {
      // Throttle to avoid performance issues
      if (!this.ticking) {
          window.requestAnimationFrame(function() {
              handleMobileLayout();
              this.ticking = false;
          });
          this.ticking = true;
      }
  });
});