class Plot extends DrawEntity {
    constructor(locationAndSize, xLabel, yLabel, maximumEntries) {
        super();
        this.rectangle = locationAndSize;
        this.xLabel = xLabel;
        this.yLabel = yLabel;
        this.maximumEntries = maximumEntries;
        this.entries = new Array(this.maximumEntries);
        this.currentEntryIndex = 0;
        this.entryMaximum = 0;
    }

    add(entry) {
        if(this.currentEntryIndex == this.entries.length-1) {
            //shift backwards (FIFO)
            for(var i = 1; i < this.entries.length; i++) {
                this.entries[i-1] = this.entries[i];
            }

        } else {
            this.currentEntryIndex++;
        }

        this.entries[this.currentEntryIndex] = entry;

        this.setEntryMaximum();
    }

    setEntryMaximum() {
        this.entryMaximum = 0;

        for(var i = 0; i < this.entries.length; i++) {
             if(this.entryMaximum < this.entries[i]) {
                 this.entryMaximum = this.entries[i];
             }
        }

    }

    calculatePlotX(index) {
        if(index >= this.entries.length || index < 0) {
            return this.rectangle.x;
        }
        return this.rectangle.x + index/this.entries.length * this.rectangle.width;
    }

    calculatePlotY(index) {
        if(index >= this.entries.length || index < 0) {
            return this.rectangle.y;
        }
        let percentageOfMaximum = 0;

        if(this.entryMaximum != 0) {
            percentageOfMaximum = this.entries[index]/this.entryMaximum;
        }

        return this.rectangle.y + (this.rectangle.height - percentageOfMaximum * this.rectangle.height);
    }

    update(delta) {
        push();

        let axisColor = color(90,90,90);
        fill(axisColor);
        textSize(9);
        smooth();

        //draw entries
        let maximumPlotValue = this.entryMaximum;
        text(
            maximumPlotValue, 
            this.rectangle.x-textWidth(maximumPlotValue)/2, 
            this.rectangle.y-5
        );

        let plotColor = color(32,162,173);
        noFill();
        stroke(plotColor);
        strokeWeight(1.8);
        beginShape();

        for(var i = 0; i <= this.currentEntryIndex; i++) {
            vertex(this.calculatePlotX(i), this.calculatePlotY(i));
        }
        
        endShape();
        strokeWeight(0);
        fill(plotColor);
        //draw endpoint of plot, using the last coordinates of entries

        let currentEndX = this.calculatePlotX(this.currentEntryIndex);
        let currentEndY = this.calculatePlotY(this.currentEntryIndex);
        ellipse(currentEndX, currentEndY, 5);

        fill(axisColor);
        text(
            this.entries[this.currentEntryIndex], 
            currentEndX - textWidth(this.entries[this.currentEntryIndex])/2, 
            currentEndY - 5
        );


        stroke(axisColor);

        //x-axis
        strokeWeight(2);
        line(
            this.rectangle.x, 
            this.rectangle.y+this.rectangle.height, 
            this.rectangle.x+this.rectangle.width, 
            this.rectangle.y+this.rectangle.height
        );
        strokeWeight(0);
        text(this.xLabel, 
            this.rectangle.x+this.rectangle.width - textWidth(this.xLabel), 
            this.rectangle.y+this.rectangle.height + 10
        );

        //y-axis
        strokeWeight(2);
        line(
            this.rectangle.x, 
            this.rectangle.y, 
            this.rectangle.x, 
            this.rectangle.y+this.rectangle.height
        );
        strokeWeight(0);

        //translate to text target location and rotate by 90 degrees to draw text at that location rotated
        translate(this.rectangle.x-5, this.rectangle.y+5);
        rotate(radians(90));

        text(this.yLabel, 
            -1, 
            5
        );
        pop();
    }
}