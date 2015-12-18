var mapClass = function(){
    //Облака
    var cloudsLayer1 = {
        position: {x: 0, y: -600},
        sprite: new Sprite('img/clouds_layer1.png', [0, 0], [600, 1200])
    };
    var cloudsLayer2 = {
        position: {x: 0, y: -300},
        sprite: new Sprite('img/clouds_layer2.png', [0, 0], [600, 1200])
    };
    var landLayer1 = {
        position: {x: 0, y: -900},
        sprite: new Sprite('img/land_layer_1.jpg', [0, 0], [600, 1569])
    };
    var landLayer2 = {
        position: {x: 0, y: -2469},
        sprite: new Sprite('img/land_layer_1.jpg', [0, 0], [600, 1569])
    };

    var cloudsLayer1Speed = 30;
    var cloudsLayer2Speed = 35;
    var landLayer1Speed = 27;
//    var landLayer1Speed = 95;
    
    this.render = function() {
        ctx.fillStyle = '#45839C';//terrainPattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        renderEntity(landLayer1);
        renderEntity(landLayer2);
        renderEntity(cloudsLayer1);
        renderEntity(cloudsLayer2);
    };
    
    this.update = function(dt) {
        //Update clouds
        cloudsLayer1.position.y += cloudsLayer1Speed * dt;
        if(cloudsLayer1.position.y > canvas.height) {
            cloudsLayer1.position.y = -1200;
        }
        cloudsLayer2.position.y += cloudsLayer2Speed * dt;
        if(cloudsLayer2.position.y > canvas.height) {
            cloudsLayer2.position.y = -1200;
        }
        
        ///////////////////////////////////////////////////////////////
        //Земля
        landLayer1.position.y += landLayer1Speed * dt;
        //if((landLayer1.position.y + canvas.height)  > canvas.height) {
        if((landLayer1.position.y)  > canvas.height) {
            landLayer1.position.y = -1 * (landLayer1.sprite.size[1] * 2  - canvas.height + 10);
            landLayer1.position.x = -1 * getRandomInt(0, 200);
        }
        landLayer2.position.y += landLayer1Speed * dt;
        //if((landLayer1.position.y + canvas.height)  > canvas.height) {
        if((landLayer2.position.y)  > canvas.height) {
            landLayer2.position.y = -1 * (landLayer2.sprite.size[1] * 2 - canvas.height + 10);
            landLayer2.position.x = -1 * getRandomInt(0, 200);
        }
    };
    
    return this;
};


