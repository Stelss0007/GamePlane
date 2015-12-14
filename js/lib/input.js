document.addEventListener("deviceready", onDeviceReady, false);
window.watchID = null;
window.lastDelta = {
    x:0,
    y:0
};

window.deltaX = 0;
window.deltaY = 0;

function onDeviceReady() {
    startWatch();
}

function startWatch() {
    // Update acceleration every 3 seconds
    var options = { frequency: 300 };
    window.watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
}

function onError() {
    alert('onError!');
}

function onSuccess(acceleration) {
    //alert('222');
    var delta = {
         x: acceleration.x * 10,
         y: acceleration.y *10
     };
//     window.deltaX = Math.abs(delta.x - window.lastDelta.x);
//     window.deltaY = Math.abs(delta.y - window.lastDelta.y);

     if(delta.x < 0) {
         input.setKeyFromAccelerator('RIGHT');
     }

     if(delta.x > 0) {
         input.setKeyFromAccelerator('LEFT');
     }

     if(delta.y < 0) {
          input.setKeyFromAccelerator('UP');
     }

     if(delta.y > 0) {
         input.setKeyFromAccelerator('DOWN'); 
     }
     
     window.lastDelta = delta;
}

(function() {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch(code) {
        case 32:
            key = 'SPACE'; break;
        case 37:
            key = 'LEFT'; break;
        case 38:
            key = 'UP'; break;
        case 39:
            key = 'RIGHT'; break;
        case 40:
            key = 'DOWN'; break;
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        },
        
        delta: function(){
            return {x: window.deltaX, y: window.deltaY}
        },
        
        setKeyFromAccelerator: function(key) {
             switch (key) {
                 case 'LEFT' : 
                      pressedKeys['RIGHT'] = false;
                     break;
                 case 'RIGHT' : 
                      pressedKeys['LEFT'] = false;
                     break;
                 case 'UP' : 
                      pressedKeys['DOWN'] = false;
                     break;
                 case 'DOWN' : 
                      pressedKeys['UP'] = false;
                     break;
             }
             pressedKeys[key] = true;
        }
    };

})();

