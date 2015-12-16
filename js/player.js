/** Обект Игрок **/
var PlayerClass = function(){
    this.position = {
        x: 0,
        y: 0
    };
    
    this.spriteProperties = {
        imgUrl: 'img/player/plane-f-15-2.png',
        position: {
            x: 0, 
            y: 0
        },
        size: {
            width: 75,
            height: 56
        },
        speed: 16,
        frames: [0,1],
        direct: 'vertical'
    }; 
    
    /**
     * Описание обекта Пуля/Ракета
     */
    this.rocketObject = {
        imgUrl: 'img/rocket2.png',
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
    this.life  = 1;
    this.speed = 240;
    this.bulletSpeed = 500;
    this.lastFire = Date.now();
    
    this.bullets = [];
    this.bonus = null;
    
    /**
     * Создание спрайта пули/ракеты
     * @returns {Sprite}
     */
    this.createBulletSprite = function() {
        return new Sprite(this.rocketObject.imgUrl, [this.rocketObject.position.x, this.rocketObject.position.y], [10, 20 ]);
    };
    
    /**
     * Выстрел игрока 
     */
    this.fire = function(){
        var x = this.position.x + this.sprite.size[0] / 2 - 10;
        var y = this.position.y - 5;
        
        this.bullets.push({ 
                position: {x: x, y:y},
                dir: 'up',
                sprite: this.createBulletSprite() 
            });
           
        if(this.bonus && this.bonus.fireBullets > 1) {
            
            if(this.bonus.fireBullets == 3) {
                bullets.push({ position: [x-15, y+10],
                   dir: 'up',
                   sprite: this.createBulletSprite() 
                });
               
                bullets.push({ position: [x+15, y+10],
                   dir: 'up',
                   sprite: this.createBulletSprite()
                });
            }
            
            if(this.bonus.fireBullets == 5) {
                bullets.push({ position: [x-15, y+10],
                   dir: 'up',
                   sprite: this.createBulletSprite() 
                });
                bullets.push({ position: [x-30, y+10],
                   dir: 'up',
                   sprite: this.createBulletSprite()
                });
                bullets.push({ position: [x+15, y+10],
                   dir: 'up',
                   sprite: this.createBulletSprite()
                });
               
                bullets.push({ position: [x+30, y+10],
                   dir: 'up',
                   sprite: this.createBulletSprite()
                });
            }
        }
    };
    
    /** 
     * Создаем спрайт игрока, прорисовка
     */
    this.sprite = new Sprite(
            this.spriteProperties.imgUrl, 
            [this.spriteProperties.position.x, this.spriteProperties.position.y],
            [this.spriteProperties.size.width, this.spriteProperties.size.height],
            this.spriteProperties.speed,
            this.spriteProperties.frames,
            this.spriteProperties.direct
        );
   
    
    return this;
};


