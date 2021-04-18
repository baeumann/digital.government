class ThresholdProgressBar extends DrawEntity {
    constructor(progressBar, minimumMarking, maximumMarking, fixedLabel, connected) {
        super();
        this.progressBar = progressBar;
        this.minimumMarking = minimumMarking;
        this.maximumMarking = maximumMarking;
        this.fixedLabel = fixedLabel;
        this.connected = connected;
        this.minimumPercentage = 0;
        this.maximumPercentage = 0;
    }

    updateMetrics(percentage, label, minimumHeightPercentage, maximumHeightPercentage) {
        this.progressBar.updateMetrics(percentage, label);

        this.minimumPercentage = minimumHeightPercentage;
        this.maximumPercentage = maximumHeightPercentage;

        let minimumAbove = this.minimumMarking.textAbove;
        let maximumAbove = this.maximumMarking.textAbove;

        if(!this.fixedLabel && maximumHeightPercentage - minimumHeightPercentage <=0.21) {
            minimumAbove = false;
            maximumAbove = true;
        }

        this.minimumMarking.updateMetrics(
            this.progressBar.rectangle.x, 
            this.progressBar.rectangle.y + (1-minimumHeightPercentage)*this.progressBar.rectangle.height,
            this.minimumMarking.length, 
            this.minimumMarking.label, 
            minimumAbove
        );

        this.maximumMarking.updateMetrics(
            this.progressBar.rectangle.x, 
            this.progressBar.rectangle.y + (1-maximumHeightPercentage)*this.progressBar.rectangle.height,
            this.maximumMarking.length, 
            this.maximumMarking.label, 
            maximumAbove
        );
    }

    update(delta) {
        this.progressBar.update(delta);

        if(this.connected) {
            push();
            fill(255,255,255,90);
            noStroke();
            let maximumY = this.maximumMarking.y;
            let minimumY = this.minimumMarking.y;
            let width = this.progressBar.rectangle.width * this.maximumMarking.length;
            let markerDistance = maximumY - minimumY;

            rect(this.progressBar.rectangle.x, minimumY, width, markerDistance);

            textSize(9);
            text("∆ " + Math.round((this.maximumPercentage - this.minimumPercentage)*100)+ "%", 
                    this.progressBar.rectangle.x + width + 2,
                    minimumY + markerDistance/2 +2);
            pop();
        }
        //do decoration
        this.minimumMarking.update(delta);
        this.maximumMarking.update(delta);
    }
}