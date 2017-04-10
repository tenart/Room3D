$(function() {
    
    var ambient = new Howl({
        src: ['sound/silence.mp3'],
        autoplay: false,
        loop: true,
        volume: 0,
    });
    
    var walking = new Howl({
        src: ['sound/walking.mp3'],
        autoplay: true,
        loop: true,
        volume: 0,
        rate: 1.5
    });
    
    
    var ambientSFX = ambient.play();
    ambient.fade(0,0.2,3000,ambientSFX);

    var mute = false;
    
    var cursor = {
        x: 0,
        y: 0,
        down: false
    }
    
    var orbit = {
        x: 0,
        y: 0,
        xdir: "",
        ydir: "",
        hdeg: -20,
        vdeg: -10,
        hspeed: 0,
        vspeed: 0,
        sensitivity: 0.8,
        drag: 1,
        zoom: 0.6
    }
    
    var movement = {
        x : -200,
        z : -200,
        direction: "",
        keyDown: false,
        speed: 15
    }
    
    $(document).keypress(function(e) {
        if(e.key == "w" ) {
            movement.direction = "forward";
            movement.keyDown = true;
        } else if(e.key == "a" ) {
            movement.direction = "left";
            movement.keyDown = true;
        } else if(e.key == "s" ) {
            movement.direction = "back";
            movement.keyDown = true;
        } else if(e.key == "d" ) {
            movement.direction = "right";
            movement.keyDown = true;
        } else {
            e.preventDefault();
        }
        
    })
    
    $(document).keyup(function() {
        movement.keyDown = false;
    })
    
    $("#about").click(function() {
        $("#info").fadeToggle(100);
        $(this).toggleClass("active");
    })
    
    $("#audio").click(function() {
        if( ambient.volume() > 0 ) {
            ambient.volume(0);
            walking.volume(0);
            $(this).find("i").removeClass("fa-volume-off");
            $(this).find("i").addClass("fa-volume-up");
            mute = true;
        } else {
            ambient.volume(0.2);
            walking.volume(0.3);
            $(this).find("i").removeClass("fa-volume-up");
            $(this).find("i").addClass("fa-volume-off");
            mute = false;
        }
    })
    
    $("#center").click(function() {
        orbit.vdeg = -10;
        orbit.hdeg = -20;
        movement.z = -200;
        movement.x = -200;
        
    })
    
    $(document).mousewheel(function(e) {
        e.preventDefault();
        console.log(e.deltaY);
        var delta = (e.deltaY / 100);
        orbit.zoom += delta;
    })
    
    $(document).bind('touchstart mousedown', function(e) {
        e.preventDefault();
        cursor.down = true;
    })

    $(document).bind('touchend mouseup', function(e) {
        e.preventDefault();
        cursor.down = false;
    })
    
    $('body').bind('touchmove mousemove', function(e) {
        e.preventDefault();
        var relX = e.pageX;
        var relY = e.pageY;

        if( cursor.down ) {
            
            if( relX > orbit.x ) {
                orbit.xdir = "+";
            } else if( relX < orbit.x ){
                orbit.xdir = "-";
            }

            if( relY > orbit.y ) {
                orbit.ydir = "-";
            } else if( relY < orbit.y ){
                orbit.ydir = "+";
            }

            orbit.hspeed = Math.abs(relX - orbit.x);
            orbit.vspeed = Math.abs(relY - orbit.y);
        }
        
        orbit.x = relX;
        orbit.y = relY;
    });
    
    // Game update
    setInterval(update, 33.33);

    function update() {    
        
        $("html, body").scrollTop(0);

        if( !cursor.down ) {
            orbit.hspeed -= orbit.drag;
            orbit.vspeed -= orbit.drag;
        }
        
        if( orbit.hspeed < 0 ) {
            orbit.hspeed = 0;
        }
        
        if( orbit.vspeed < 0 ) {
            orbit.vspeed = 0;
        }

        if( true ) {
            if( orbit.xdir == "+" ) {
                orbit.hdeg += orbit.hspeed*orbit.sensitivity;
            } else if( orbit.xdir == "-" ) {
                orbit.hdeg -= orbit.hspeed*orbit.sensitivity;
            }

            if( orbit.ydir == "+" ) {
                orbit.vdeg += orbit.vspeed*orbit.sensitivity;
            } else if( orbit.ydir == "-" ) {
                orbit.vdeg -= orbit.vspeed*orbit.sensitivity;
            }
        }
        
        $(".center").each(function() {
            var height = $(this).outerHeight();
            var width = $(this).outerWidth();
            $(this).css("left", "calc(50% - " + width/2 + "px)");
            $(this).css("top", "calc(50% - " + height/2 + "px)");
        })
        
        if( movement.keyDown ) {
            if(movement.direction == "forward") {
                var newX = movement.x + movement.speed * Math.cos( (orbit.hdeg + 90) * 0.017453292519 );
                var newZ = movement.z + movement.speed * Math.sin( (orbit.hdeg + 90) * 0.017453292519 );
            }
            
            if(movement.direction == "left") {
                var newX = movement.x + movement.speed * Math.cos( (orbit.hdeg) * 0.017453292519 );
                var newZ = movement.z + movement.speed * Math.sin( (orbit.hdeg) * 0.017453292519 );
            }
            
            if(movement.direction == "right") {
                var newX = movement.x + movement.speed * Math.cos( (orbit.hdeg + 180) * 0.017453292519 );
                var newZ = movement.z + movement.speed * Math.sin( (orbit.hdeg + 180) * 0.017453292519 );
            }
            if(movement.direction == "back") {
                var newX = movement.x + movement.speed * Math.cos( (orbit.hdeg - 90) * 0.017453292519 );
                var newZ = movement.z + movement.speed * Math.sin( (orbit.hdeg - 90) * 0.017453292519 );
            }
            
            
            movement.z = newZ;
            movement.x = newX;
        }
        
        // Orbit clamps
        
        /*
        if( orbit.hdeg > 70) {
            orbit.hdeg = 70;
        } else if( orbit.hdeg < -70 ) {
            orbit.hdeg = -70;
        }
        */
        
        if( orbit.vdeg > 80) {
            orbit.vdeg = 80;
        } else if( orbit.vdeg < -80 ) {
            orbit.vdeg = -80;
        }
        
        if( orbit.zoom > 4) {
            orbit.zoom = 4;
        } else if( orbit.zoom < 0.3 ) {
            orbit.zoom = 0.3;
        }
        
        if( true ) {
            if( movement.z > 200) {
                movement.z = 200;
            } else if( movement.z < -200 ) {
                movement.z = -200;
            }

            if( movement.x > 200) {
                movement.x = 200;
            } else if( movement.x < -200 ) {
                movement.x = -200;
            }
        }
        
        if( movement.keyDown ) {
            if(!mute) {
                walking.volume(0.3);
            } 
        }
        
        if(! movement.keyDown ) {
            walking.volume(0);
        }
            
                
        //$("#wrap").css("transform", "scale(" + orbit.zoom + ") translateZ(700px)");
        
        $("#wrap").css("transform", "translateZ(600px) rotateX(" + orbit.vdeg + "deg) rotateY(" + orbit.hdeg + "deg)");
        $("#movement_wrap").css("transform", "translateZ(" + movement.z + "px) translateX(" + movement.x + "px)");
    }
    
})