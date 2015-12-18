var BonuseClass = function(index){
    this.index = index;
    this.position = {
        x: 0,
        y: 0
    };
    
    this.spriteProperties = {
        imgUrl: 'img/bonuses.png',
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

    this.created = window.performance.now();
    this.speed = 70;
    
    this.getBonuseInfo = function(){
        return bonuses[this.index];
    };
    
    var bonuses = [
        { 
            name: 'Rocket X3',
            position: {x: 0, y: 0},
            sprite: new Sprite('img/bonuses.png', [0, 0], [70, 70]),
            fireBullets: 3,
            time: 30000,
            created: null,
        },
        { 
            name: 'Rocket X5',
            position: {x: 0, y: 0},
            sprite: new Sprite('img/bonuses.png', [0, 70], [70, 70]),
            fireBullets: 5,
            time: 20000,
            created: null
        },
        { 
            name: 'AuoFire',
            position: {x: 0, y: 0},
            sprite: new Sprite('img/bonuses.png', [0, 140], [70, 70]),
            fireBullets: 1,
            fireAuto: true,
            time: 10000,
            created: null
        },
        { 
            name: 'Guard',
            position: {x: 0, y: 0},
            sprite: new Sprite('img/bonuses.png', [0, 210], [70, 70]),
            fireBullets: 1,
            time: 20000,
            created: null,
            life: 1,
            guard: true
        },
        { 
            name: 'Life +1',
            position: {x: 0, y: 0},
            sprite: new Sprite('img/bonuses.png', [0, 280], [70, 70]),
            fireBullets: 1,
            time: 0,
            created: null,
            life: 1
        },
    ];
        
    /** 
     * Создаем спрайт игрока, прорисовка
     */
    this.sprite = bonuses[index].sprite;
   
    
    return this;
};


