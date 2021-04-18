class ProgressMarker extends DrawEntity {
    constructor(x, y, label, length, textAbove, color, targetWidth) {
        super();
        this.x = x;
        this.y = y;
        this.length = length;
        this.label = label;
        this.textAbove = textAbove;
        this.color = color;
        this.targetWidth = targetWidth;
    }

    updateMetrics(x, y, length, label, textAbove) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.label = label;
        this.textAbove = textAbove;
    }

    update(delta) {
        push();

        stroke(color(this.color.red, this.color.green, this.color.blue, 180));

        strokeWeight(1);
        line(this.x+1, this.y, this.x+this.length*this.targetWidth-1, this.y);

        strokeWeight(0);
        fill(color(this.color.red, this.color.green, this.color.blue, 180));
        textSize(9);

        let offset = 9;
        if(this.textAbove) {
            offset = -2;
        }

        text(this.label, 
            this.x+2, 
            this.y+offset
        );

        pop();
    }
}