
class GridWandererEntity extends SocietyEntity {
    constructor(width, height, startPosition) {
        super();
        this.width = width;
        this.height = height;
        this.startPosition = startPosition;
        this.currentLocation = startPosition;
        this.maximumSpeed = 15;
        this.speed = 4;
        this.angle = 0;
        this.trail = new Array();


        this.randomizeAngle();
    }

    update(delta, capitalQuality) {
        super.update(delta);
        this.appendTrail();


        let direction = new Vector2(Math.cos(this.angle), Math.sin(this.angle));
        direction.multiply(this.speed*delta*0.01);

        this.currentLocation.add(direction);


        let capitalQualityState = capitalQuality < 0.45;

        //this.driftAngle(capitalQualityState);

        if(!capitalQualityState) {
            if(this.currentLocation.x < 0) {
                this.currentLocation.x = 1;
                this.shiftAngle(capitalQualityState);
            }
    
            if(this.currentLocation.x > this.width) {
                this.currentLocation.x = this.width-1;
                this.shiftAngle(capitalQualityState);
            }
    
            if(this.currentLocation.y < 0) {
                this.currentLocation.y = 1;
                this.shiftAngle(capitalQualityState);
            }
    
            if(this.currentLocation.y > this.height) {
                this.currentLocation.y = this.height-1;
                this.shiftAngle(capitalQualityState);
            }
        } else {
            this.driftAngle(capitalQualityState);
            if(this.currentLocation.x < this.width*0.1) {
                this.currentLocation.x = this.width*0.1;
                this.shiftAngle(capitalQualityState);
            }
    
            if(this.currentLocation.x > this.width*0.9) {
                this.currentLocation.x = this.width*0.9;
                this.shiftAngle(capitalQualityState);
            }
    
            if(this.currentLocation.y < this.height*0.1) {
                this.currentLocation.y = this.height*0.1;
                this.shiftAngle(capitalQualityState);
            }
    
            if(this.currentLocation.y > this.height*0.9) {
                this.currentLocation.y = this.height*0.9;
                this.shiftAngle(capitalQualityState);
            }
        }


        this.speed = this.maximumSpeed*capitalQuality;
    }

    appendTrail() {
        if(this.trail.length > 0 && this.currentLocation.distance(this.trail[this.trail.length-1]) > 2 || this.trail.length == 0) {
            this.trail.push(new Vector2(this.currentLocation.x, this.currentLocation.y));

            if(this.trail.length > 2) {
                this.trail.shift();
            }
        }
    }

    interpolatedTrail() {
        var interpolated = new Array();

        //entity to trail segment
        
        if(this.trail.length > 0) {
            var segmentTrail = this.currentLocation.interpolate(this.trail[this.trail.length-1]);

            for(var j = 0; j < segmentTrail.length; j++) {
                interpolated.push(segmentTrail[j]);
            }
        }

        //rest segments
        
        for(var i = this.trail.length-1; i > 0; i--) {

            var segmentTrail = this.trail[i].interpolate(this.trail[i-1]);
            for(var j = 0; j < segmentTrail.length; j++) {
                interpolated.push(segmentTrail[j]);
            }
        }

        return interpolated;
    }

    randomizeAngle() {
        this.angle = 360*Math.random();
    }

    shiftAngle(state) {
        if(state) {
            this.angle = (this.angle-5) % 360;
        } else {
            this.angle = (this.angle+5) % 360;
        }
    }

    driftAngle(state) {
        if(state) {
            this.angle = (this.angle-0.01) % 360;
        } else {
            this.angle = (this.angle+0.01) % 360;
        }

    }

    dailyAction() {
    }

    currentPosition() {
        return this.currentLocation;
    }
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(otherVector) {
        this.x += otherVector.x;
        this.y += otherVector.y;

        return this;
    }

    multiply(value) {
        this.x *= value;
        this.y *= value;

        return this;
    }

    xAsInt() {
        return Math.trunc(this.x);
    }

    yAsInt() {
        return Math.trunc(this.y);
    }

    distance(otherVector) {
        return Math.sqrt(Math.pow(otherVector.x - this.x,2) + Math.pow(otherVector.y - this.y,2));
    }

    interpolate(otherVector) {
        let interpolated = new Array();

        if(otherVector != undefined) {
            let distance = this.distance(otherVector);

            let increment = 1 / distance;

            for(var i = 0; i <= 1; i+=increment) {
                let calculatedX = Math.trunc(this.xAsInt() + i*(otherVector.xAsInt() - this.xAsInt()));
                let calculatedY = Math.trunc(this.yAsInt() + i*(otherVector.yAsInt() - this.yAsInt()));

                let alreadyContained = false;
                for(var j = 0; j < interpolated.length; j++) {
                    if(interpolated[j].xAsInt() == calculatedX && interpolated[j].yAsInt() == calculatedY) {
                        alreadyContained = true;
                        break;
                    }
                }

                if(!alreadyContained && 
                    !(calculatedX == otherVector.xAsInt() && calculatedY == otherVector.yAsInt()) && 
                    !(calculatedX == this.xAsInt() && calculatedY == this.yAsInt())) {
                    interpolated.push(new Vector2(calculatedX, calculatedY));
                }

            }
        }

        interpolated.unshift(new Vector2(this.x, this.y));
        //interpolated.push(new Vector2(otherVector.x, otherVector.y));

        return interpolated;
    }


}