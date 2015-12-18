var enemyBulletClass = function(){
    this.position = {
        x: 0,
        y: 0
    };
        
    /**
     * Описание обекта Пуля/Ракета
     */
    this.rocketObject = {
        imgUrl: 'img/rocket1.png',
        position: {
            x: 0, 
            y: 0
        },
        size: {
            width: 10,
            height: 20
        }
    }; 

    this.damage = 1;
    this.speed = 300;
    
    this.bullets = [];

    
    /**
     * Создание спрайта пули/ракеты
     * @returns {Sprite}
     */
    this.createBulletSprite = function() {
        return new Sprite(this.rocketObject.imgUrl, [0, 0], [10, 20]);
    };
    
    
    this.updateBulets = function(dt) {
        // Update all the bullets
        for(var i=0; i< this.bullets.length; i++) {
            var bullet = this.bullets[i];
            switch(bullet.dir) {
                case 'up': bullet.position.y -= bullet.speed * dt; break;
                case 'down': bullet.position.y += bullet.speed * dt; break;
                default:
                    bullet.position.x += bullet.speed * dt;
            }

            // Remove the bullet if it goes offscreen
            if(bullet.position.y < 0 || bullet.position.y > canvas.height ||
               bullet.position.x > canvas.width) {
                this.bullets.splice(i, 1);
                i--;
            }
        }
    };
    
    return this;
};


