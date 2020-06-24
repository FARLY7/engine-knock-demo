/* =========================================================== */
/* ========================= COG OBJECT ====================== */
function Cog() {

    /* Properties of Cog wheel */
    var x = 100, y = 450, width = 137.33, height = 142.33;
    var cX = x + (width / 2);     var cY = y + (height * (53.33/142.33));      
    /* Coordinates of connecting rod joint */
    var jointX = x + width/2;   var jointY = y + height/9;
    /* Cog wheel image */
    var g = c.image("Images/Cog.png", x, y, width, height);

    /* Rotation of Cog = rotation of connecting joint */ 
    this.rotate = function(degrees) {

        g.transform("r" + degrees + "," + cX + "," + cY);

        /* Calculate new Joint position */
        var new_point = rotate_point(x + width/2, y + height/9, cX, cY, degrees);

        /* Calculate movement in y direction for piston */
        var moveby = new_point.y - jointY;      
        
        /* Update new coordinates */
        jointX = new_point.x;
        jointY = new_point.y;

        /* Move the piston */
        piston.move(moveby);
    };

    this.joint = function() {
        return { x : jointX, y : jointY };
    };     
}

/* =========================================================== */
/* ======================= PISTON OBJECT ===================== */
function Piston() {

    /* Properties of Piston object */
    var x = 110, y = 215, width = 116, height = 108.66;
    /* Coordinates of connecting rod joint */
    var jointX = x + width/2;   var jointY = y + height/1.57;
    /* Image of piston */
    var g = c.image("Images/Piston.png", x, y, width, height);

    this.move = function(val) {
        /* Update position of piston */
        y += val; jointY += val;
        g.transform("t0," + (-(215 - y)));
        /* Finally, move the rod */
        rod.move(val);
    };
    /* Getter for joint values */
    this.joint = function() {
        return { x : jointX, y : jointY };
    };
    /* 'Play' the knock animation */
    this.knock = function() {
        g.animate({x: 113}, 10, "elastic", function() {
            g.animate({x: 107}, 10, "elastic", function() {
                g.animate({x: 110}, 500, "elastic");
            });
        });
    };
}

/* =========================================================== */
/* ======================== ROD OBJECT ======================= */
function Rod() {
    /* Properties of Rod object */
    var x = 118, y = 283, width = 101.33, height = 232;
    /* Image of rod */
    var g = c.image("Images/Rod.png", x, y, width, height);

    this.move = function(val) {
        /* Calculate the angle between the piston and cog connecting joints */
        var angle = getAngle(piston.joint().x, piston.joint().y, cog.joint().x, cog.joint().y);
        /* Rotate the rod to the same degrees */
        g.transform("r" + (angle-90) + "," + piston.joint().x + "," + piston.joint().y);
        /* Move the rod in the y direction of the piston */
        y += val;
        g.transform("...t0," + (-(283-y)));    
    };
}

/* =========================================================== */
/* ==================== LEFT VALVE OBJECT ==================== */
function LValve() { 
    /* Closed position */
    var cX = 73, cY = 106;
    /* Open position */
    var oX = 78, oY = 111;
    /* Properties of Left Valve object */
    var width = 76.788, height = 76.302;
    /* Image of Left Valve */
    var g = c.image("Images/LeftValve.png", cX, cY, width, height);

    this.open = function() {
        /* Move valve to open position */
        g.transform("t" + (oX - cX) + "," + (oY - cY));
    };

    this.close = function() {
        /* Reset transformation */
        g.transform("");
    };
}

/* =========================================================== */
/* ==================== RIGHT VALVE OBJECT =================== */
function RValve() { 
    /* Closed position */
    var cX = 187, cY = 107;
    /* Open position */
    var oX = 182, oY = 112;
    /* Properties of Right Valve object */
    var width = 76.788, height = 76.302;
    /* Image of Right Valve */
    var g = c.image("Images/RightValve.png", cX, cY, width, height);

    this.open = function() {
        /* Move valve to open position */
        g.transform("t" + (oX - cX) + "," + (oY - cY));
    };
    this.close = function() {
        /* Reset transformation */
        g.transform("");
    };
}
/* =========================================================== */
/* =========================================================== */
