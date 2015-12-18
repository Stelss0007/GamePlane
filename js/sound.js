var soundClass = function(){
    var audioBuh = new Audio('sound/buh.ogg');
    var audioBuhSmall = new Audio('sound/buh-small.mp3');
    var audioShot = new Audio('sound/shot.ogg');
    var audioBonuse = new Audio('sound/bonuse.mp3');
    var audioBg1 = new Audio('sound/bg1.mp3');
    audioBg1.loop = true;
    
    this.background = function(){
        return audioBg1;
    };
    
    this.buh = function() {
        return audioBuh;
    };

    this.buhSmall = function() {
        return audioBuhSmall;
    };

    this.shot = function() {
        return audioShot;
    };

    this.bonuse = function() {
        return audioBonuse;
    };
    
    return this;
};


