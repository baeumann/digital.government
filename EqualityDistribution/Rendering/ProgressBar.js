class ProgressBar extends DrawEntity{
    constructor(locationAndSize, percentage, simpleColor, label, vertical, flip) {
        super();
        this.rectangle = locationAndSize;
        this.percentage = percentage;
        this.color = simpleColor;
        this.label = label;
        this.vertical = vertical;
        this.flip = flip;
    }

    updateMetrics(percentage, label) {
        this.percentage = percentage;
        this.label = label;

    }

    update(delta) {
        //smooth transition maybe

        push();
        strokeWeight(0);

        fill(90,90,90);
        let borderSize = 1;
        rect(this.rectangle.x-borderSize, this.rectangle.y-borderSize, this.rectangle.width+borderSize*2, this.rectangle.height+borderSize*2);
        //background
        fill(70, 70, 70);
        rect(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height);


        //foreground
        fill(this.color.red, this.color.green, this.color.blue);
        if(this.vertical) {
            let yOffset = 0;
            let targetHeight = this.rectangle.height*this.percentage;
            if(this.flip) {
                yOffset = this.rectangle.height-targetHeight;
            }

            rect(this.rectangle.x, this.rectangle.y+yOffset, this.rectangle.width, targetHeight);
        } else {
            let xOffset = 0;
            let targetWidth = this.rectangle.width*this.percentage;
            if(this.flip) {
                xOffset = this.rectangle.width-targetWidth;
            }

            rect(this.rectangle.x+xOffset, this.rectangle.y, targetWidth, this.rectangle.height);
        }

        fill(90,90,90);
        textSize(16);
        textAlign(CENTER);
        textStyle(BOLD);

        text(this.label, this.rectangle.x+this.rectangle.width/2, this.rectangle.y+ this.rectangle.height + 20);

        fill(255);
        textSize(12);
        text(Math.round(this.percentage*100) + "%", this.rectangle.x+this.rectangle.width/2, this.rectangle.y+ this.rectangle.height/2+5);

        pop();

    }

}