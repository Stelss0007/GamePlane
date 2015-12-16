var mainPlane = document.getElementById('angar-plane');
var planeName = document.getElementById('planeName');
var planeDescription = document.getElementById('planeDescription');
var planeUl = document.getElementById('player-planes-ul-list');
var planeUlList = planeUl.children;

var audioClick = new Audio('sound/click.mp3');
var plainNumberClobal = 0;

var selectPlain = function(plainNumber) {
    audioClick.play();
    plainNumberClobal = plainNumber;
    mainPlane.src = playerList[plainNumber].frontImg;
    planeName.innerHTML = playerList[plainNumber].name;
    planeDescription.innerHTML = playerList[plainNumber].description;
    
    for(var i=0; i < planeUlList.length; i++) {
        planeUlList[i].classList.remove('selected');
    }
    planeUlList[plainNumber].classList.add('selected');
};

var savePlain = function() {
    localStorage.setItem("currentPlayerPlainNumber", plainNumberClobal);
    window.location = 'index.html';
};

if(localStorage.getItem("currentPlayerPlainNumber")) {
    selectPlain(localStorage.getItem("currentPlayerPlainNumber"));
} else {
    selectPlain(0);
}