const searchElm = document.querySelector(".search");
const ulElm = document.querySelector(".tweet-collection");
const msgElm = document.querySelector(".msg");
const tweetInputElm = document.querySelector(".tweet-input");
const tweetBtnElm = document.querySelector(".tweet-btn");
const updateBtnElm = document.querySelector(".update-btn");

if (!localStorage.getItem("tweetIdTrackerLocal")) {
    localStorage.setItem("tweetIdTrackerLocal", JSON.stringify(0)); //it will add the id provider in local storage
}
let tweetIdTracker = JSON.parse(localStorage.getItem("tweetIdTrackerLocal")); //it will provide sort of unique id for the products

const time = new Date(); //handles time
const shownTime = time.toLocaleTimeString("En", {hour : "numeric", minute : "numeric"}); //it shows only hours and minutes
const hiddenTime = time.toLocaleDateString("En", {day: 'numeric', month: 'long', year: 'numeric', hour : "numeric", minute : "numeric", second : "numeric"}); //it shows time and date both

let tweetList = []; //it will store the tweet with its unique id
let passTargetParentId = ""; //it will pass the li id from editTweetFromList() to updateTweetToList() process

//it will show a message when there is no tweet or no tweet to show when searching
function msg(message) {
    msgElm.textContent = message;
}

//it will show the message to add tweet when there is no tweet
function noTweet() {
    if (ulElm.children.length <= 1) {
        msg("No Tweet Yet");
    }
}
noTweet();

//it will save the tweetList array to local storage
const addTweetToLocalStorage = () => {
    localStorage.setItem("tweetListArray", JSON.stringify(tweetList));
};

//it will get the data from local storage and add tweetList array and populate UI
const getDataFromLocalStorage = () => {
    if (!localStorage.getItem("tweetListArray") || JSON.parse(localStorage.getItem("tweetListArray")).length <= 0) {
        noTweet();
    } else {
        msg("");
        tweetList = JSON.parse(localStorage.getItem("tweetListArray"));

        tweetList.forEach((tweet, index) => {
            const serial = index + 1;

            const liElm = document.createElement("li");
            liElm.classList.add("list-group-item", "tweet");
            liElm.id = `tweet-${tweet.id}`;
            liElm.innerHTML = `<span>${serial}. </span><span>${tweet.tweet}</span><i class="fas fa-trash-alt float-end m-1 delete-btn"></i><i class="fas fa-pencil-alt float-end m-1 edit-btn"></i><i class="float-end me-2"><abbr title="${hiddenTime}" style="font-size: 8pt;">${shownTime}</abbr></i>`;
            ulElm.insertAdjacentElement("beforeend", liElm);
        });
    }
};

//it will add the tweet in the array as an object
const addTweetToArray = () => {
    tweetList.push({id : tweetIdTracker, tweet : tweetInputElm.value});
    addTweetToLocalStorage();
};

//it will add the tweet in the ul list to show on the UI
const addTweetToList = () => {
    if (tweetInputElm.value === '') {
        alert("Please enter valid input");
    } else {
        msg("");
        addTweetToArray();

        const serial = tweetList.length;

        const liElm = document.createElement("li");
        liElm.classList.add("list-group-item", "tweet");
        liElm.id = `tweet-${tweetIdTracker}`;
        liElm.innerHTML = `<span>${serial}. </span><span>${tweetInputElm.value}</span><i class="fas fa-trash-alt float-end m-1 delete-btn"></i><i class="fas fa-pencil-alt float-end m-1 edit-btn"></i><i class="float-end me-2"><abbr title="${hiddenTime}" style="font-size: 8pt;">${shownTime}</abbr></i>`;
        ulElm.insertAdjacentElement("beforeend", liElm);
        
        tweetInputElm.value = "";
        tweetIdTracker++; //updating the id after inserting every product
        localStorage.setItem("tweetIdTrackerLocal", JSON.stringify(tweetIdTracker));
    }
};

//it will delete tweet from the UI as well as from the array when click on the trash icon
const deleteTweetFromList = e => {
    if (e.target.classList.contains("delete-btn")) {
        const targetParent = e.target.parentElement;
        targetParent.remove();

        const deleteIndex = tweetList.findIndex(tweet => tweet.id === parseInt(targetParent.id.split("-")[1], 10));
        tweetList.splice(deleteIndex, 1);

        noTweet();
        addTweetToLocalStorage();
        location.reload();
    }
};

//it will take the tweet and populate the tweet input form, enable update button and disable search form when click on the pen icon
const editTweetFromList = e => {
    if (e.target.classList.contains("edit-btn")) {
        tweetBtnElm.style.display = "none";
        updateBtnElm.style.display = "block";
        searchElm.setAttribute("disabled", "disabled");
        const targetParent = e.target.parentElement;
        tweetInputElm.value = targetParent.firstElementChild.nextElementSibling.textContent;

        passTargetParentId = targetParent.id;
    }
};

//it will update the tweet object in the array
const updateTweetToArray = () => {
    const updateIndex = tweetList.findIndex(tweet => tweet.id === parseInt(passTargetParentId.split("-")[1], 10));
    
    tweetList[updateIndex].tweet = tweetInputElm.value;

    passTargetParentId = "";
    addTweetToLocalStorage();
};

//it will update the tweet in the ul list to show on the UI
const updateTweetToList = () => {
    if (tweetInputElm.value === '') {
        alert("Please enter valid value");
    } else {
        msg("");
        const targetParent = document.querySelector(`#${passTargetParentId}`);
        targetParent.firstElementChild.nextElementSibling.textContent = tweetInputElm.value;

        tweetBtnElm.style.display = "block";
        updateBtnElm.style.display = "none";
        searchElm.removeAttribute("disabled");

        updateTweetToArray();
        tweetInputElm.value = "";
    }
};

//it will show the specific tweet with the text typed on the search form in their tweet
const findTweetFromList = e => {
    const text = e.target.value.toLowerCase();
    let foundProductNo = 0;

    [...document.querySelectorAll(".tweet")].forEach(item => {
        if (item.firstElementChild.nextElementSibling.textContent.toLowerCase().indexOf(text) === -1) {
            item.style.display = "none";
        } else {
            item.style.display = "block";
            foundProductNo++;
        }
    })
    if (foundProductNo <= 0) {
        msg("No Tweet Found");
    } else {
        msg("");
    }
};

//an IIFE for all the event listeners
(() => {
    tweetBtnElm.addEventListener("click", addTweetToList);
    ulElm.addEventListener("click", editTweetFromList);
    updateBtnElm.addEventListener("click", updateTweetToList);
    ulElm.addEventListener("click", deleteTweetFromList);
    searchElm.addEventListener("keyup", findTweetFromList);
    document.addEventListener("DOMContentLoaded", getDataFromLocalStorage);
})();




