class Society extends DrawEntity {


    constructor(gridCanvas) {
        super();
        this.modifier = new SocietyModifier();

        this.firstRun = true;
        this.monthlyProgress = 0;
        this.startTime = performance.now();
        this.numberFormatter = new Intl.NumberFormat('en-US');

        this.monthlyProgressBar;
        this.totalQualityOfEconomyProgressBar;
        this.qualityOfPersonCaptialSpreadProgressBar;
        this.qualityOfDistributionProgressBar;

        this.totalQualityOfEconomyPlot;

        this.government = new Government(GOVERMENT_MAX_CAPITAL, 0, 0, this);
        this.people = new Array();
        this.corporations = new Array();

        this.totalCaptial = 0;
        this.totalPeopleCaptial = 0;

        this.optimalMoneyPerPerson = 0;
        this.averageMoneyPerPerson = 0;
        this.minimumPersonCaptial = HUMAN_MAX_CAPITAL;
        this.maxiumumPersonCaptial = 0;
        this.qualityOfPersonCaptialSpread = 0;
        this.qualityOfDistribution = 0;
        this.totalQualityOfEconomy = 0;

        this.gridCanvas = gridCanvas;


        this.createPeople();
        this.createProgressBars();
        this.createPlots();
    }

    createPlots() {
        this.totalQualityOfEconomyPlot = new Plot(
            new Rectangle(TELEMETRY_TEXT_POSITION_X+250, TELEMETRY_TEXT_POSITION_Y+300, 300, 80),
            "Time",
            "TQE (%)",
            700
        );
    }

    createProgressBars() {
        

        this.monthlyProgressBar = new ProgressBar(
            new Rectangle(TELEMETRY_TEXT_POSITION_X-50, TELEMETRY_TEXT_POSITION_Y-20, 30, 400), 
            0.0, 
            DEFAULT_DATA_COLOR, 
            "Day 0", 
            true,
            true);

        this.totalQualityOfEconomyProgressBar = new ThresholdProgressBar(
            new ProgressBar(
                new Rectangle(TELEMETRY_TEXT_POSITION_X+20, TELEMETRY_TEXT_POSITION_Y+300, 200, 80),
                0.0,
                TQE_COLOR,
                "Total quality of economy",
                true,
                true),
                new ProgressMarker(0, 0, "BAD", 1, false, new SimpleColor(255,255,255), 200),
                new ProgressMarker(0, 0, "GOOD", 1, true, new SimpleColor(255,255,255), 200),
                true,
                false
        );

        this.qualityOfPersonCaptialSpreadProgressBar = new ThresholdProgressBar(
            new ProgressBar(
                new Rectangle(TELEMETRY_TEXT_POSITION_X+20, TELEMETRY_TEXT_POSITION_Y+180, 200, 80),
                0.0,
                QMM_COLOR,
                "Quality of min/max spread",
                true,
                true),
                new ProgressMarker(0, 0, "MINIMUM", 0.3, true, new SimpleColor(255,255,255), 200),
                new ProgressMarker(0, 0, "MAXIMUM", 0.3, false, new SimpleColor(255,255,255), 200),
                false,
                true
        );

        this.qualityOfDistributionProgressBar = new ThresholdProgressBar(
            new ProgressBar(
                new Rectangle(TELEMETRY_TEXT_POSITION_X+20, TELEMETRY_TEXT_POSITION_Y+60, 200, 80),
                0.0,
                QOD_COLOR,
                "Quality of capital distribution",
                true,
                true),
                new ProgressMarker(0, 0, "AVERAGE", 0.3, false, new SimpleColor(255,255,255), 200),
                new ProgressMarker(0, 0, "OPTIMAL", 0.3, true, new SimpleColor(255,255,255), 200),
                false,
                true
        );
        
    }

    createPeople() {

        for (var i = 0; i < PEOPLE_AMOUNT; i ++ ){

            var success = Math.random();
            var startCapital = HUMAN_MAX_CAPITAL*success;
            this.totalCaptial += startCapital;

            this.people.push(new Human(this.gridCanvas, success, startCapital, this.government));
        }

        console.log("People Created > " + this.people.length);
    }

    surplusCut() {
        this.people.forEach(person => person.limitCheck());
    }

    update(delta) {
        //tick
        if(this.firstRun || performance.now() - this.startTime >= TICK_INTERVAL) {
            this.firstRun = false;
            this.startTime = performance.now();

            this.monthlyProgress++;

            if(this.monthlyProgress >= MONTHLY_TICK_THRESHOLD) {
                this.monthlyAction();
                this.monthlyProgress = 0;
            }

            this.dailyAction();
        } 

        this.updatePeople(delta);

        this.calculateMetrics();
        this.drawMetrics(delta);
    }



    monthlyAction() {
        for(var i = 0; i < this.people.length; i++) {
            let currentPerson = this.people[i];
            currentPerson.monthlyAction();
        }

        this.government.monthlyAction();
    }

    dailyAction() {
        for(var i = 0; i < this.people.length; i++) {
            let currentPerson = this.people[i];
            currentPerson.dailyAction();
        }

        this.government.dailyAction();

        //insert plot data (tick based only)
        //this.totalQualityOfEconomyPlot.add(Math.round(this.totalQualityOfEconomy*100));
    }

    combinedPeopleCapital(threshold) {
        let combinedMoney = 0;

        for(var i = 0; i < this.people.length; i++) {
            let currentPerson = this.people[i];

            if(currentPerson.capital >= threshold) {
                combinedMoney += threshold;
            } else {
                combinedMoney += currentPerson.capital;
            }

        }

        return combinedMoney;
    }

    updatePeople(delta) {
        this.clearGridCanvas();


        for(var i = 0; i < this.people.length; i++) {
            let currentPerson = this.people[i];
            //let currentX = i % gridCanvas.width;
            //let currentY = Math.trunc(i / gridCanvas.height);
            let currentPosition = currentPerson.currentPosition();
            let currentColor = currentPerson.calculateColorForCapital();

            //trail
            /*
            let currentTrail = currentPerson.interpolatedTrail();
            for(var j = 0; j < currentTrail.length; j++) {
                let intensity = 1 - (j / currentTrail.length);
                let currentTrailPosition = currentTrail[j];
                let trailTransitionColor = lerpColor(color(255), currentColor, intensity);

                if(intensity < 0.3) {
                    intensity = 0.3;
                }
                //let trailTransitionColor = currentColor;

                gridCanvas.set(currentTrailPosition.x, currentTrailPosition.y, trailTransitionColor);
            }

            //entity
            
            let fadedColor = color(currentColor._getRed(), currentColor._getGreen(), currentColor._getBlue());
            fadedColor.setAlpha(200);


            gridCanvas.set(currentPosition.x, currentPosition.y-1, fadedColor);
            gridCanvas.set(currentPosition.x-1, currentPosition.y, fadedColor);
            gridCanvas.set(currentPosition.x+1, currentPosition.y, fadedColor);
            gridCanvas.set(currentPosition.x, currentPosition.y+1, fadedColor);
            */

            gridCanvas.set(currentPosition.x, currentPosition.y, currentColor);

            currentPerson.update(delta);
        }

        gridCanvas.updatePixels();

        image(gridCanvas, 40, 60, 400, 400);
    }

    clearGridCanvas() {
        for (let i = 0; i < gridCanvas.width; i++) {
          for (let j = 0; j < gridCanvas.height; j++) {
              gridCanvas.set(i, j, color(255,255,255));
          }
        }
    }

    calculateMetrics() {
        this.totalCaptial = 0;
        this.totalPeopleCaptial = 0;
        this.minimumPersonCaptial = HUMAN_MAX_CAPITAL;
        this.maxiumumPersonCaptial = 0;

        for(var i = 0; i < this.people.length; i++) {
            let currentPerson = this.people[i];

            if(currentPerson.capital < this.minimumPersonCaptial) {
                this.minimumPersonCaptial = currentPerson.capital;
            }

            if(currentPerson.capital > this.maxiumumPersonCaptial) {
                this.maxiumumPersonCaptial = currentPerson.capital;
            }

            this.totalCaptial += currentPerson.capital;
        }

        this.optimalMoneyPerPerson = this.totalCaptial / this.people.length;
        this.qualityOfPersonCaptialSpread = this.minimumPersonCaptial / this.maxiumumPersonCaptial;

        let combinedMoney = this.combinedPeopleCapital(this.optimalMoneyPerPerson);

        this.averageMoneyPerPerson = Math.round(combinedMoney / this.people.length);
        this.qualityOfDistribution = this.averageMoneyPerPerson / this.optimalMoneyPerPerson;
        this.totalQualityOfEconomy = (this.qualityOfDistribution + this.qualityOfPersonCaptialSpread + this.qualityOfPersonCaptialSpread + this.qualityOfPersonCaptialSpread) / 4;

        this.totalPeopleCaptial = this.totalCaptial;

        //add remaining capital to total
        this.totalCaptial += this.government.peoplePot;
        this.totalCaptial += this.government.capital;
        //add business pot
    }

    drawMetrics(delta) {
        fill(90,90,90);
        textSize(16);
        textAlign(LEFT);
        textStyle(BOLD);

        let formattedTotalCaptial = this.numberFormatter.format(Math.round(this.totalCaptial));
        let formattedOptimalMoneyPerPerson = this.numberFormatter.format(Math.round(this.optimalMoneyPerPerson));
        let formattedAverageMoneyPerPerson = this.numberFormatter.format(Math.round(this.averageMoneyPerPerson));
        let formattedMinimumCaptial = this.numberFormatter.format(Math.round(this.minimumPersonCaptial));
        let formattedMaximumCaptial = this.numberFormatter.format(Math.round(this.maxiumumPersonCaptial));
        let formattedPeoplePot = this.numberFormatter.format(Math.round(this.government.peoplePot));
        let formattedGovernmentCaptial = this.numberFormatter.format(Math.round(this.government.capital));
        let formattedPeopleCaptial = this.numberFormatter.format(Math.round(this.totalPeopleCaptial));
        let formattedPeoplePotSpentLastMonth = this.numberFormatter.format(Math.round(this.government.peoplePotSpent))

        this.drawDataInfo(
            TELEMETRY_TEXT_POSITION_X+350, 
            TELEMETRY_TEXT_POSITION_Y,
            18,
            DEFAULT_DATA_COLOR,
            formattedTotalCaptial,
            "Total capital",
            100
        );

        this.drawDataInfo(
            TELEMETRY_TEXT_POSITION_X+350, 
            TELEMETRY_TEXT_POSITION_Y+25,
            18,
            DEFAULT_DATA_COLOR,
            formattedPeopleCaptial,
            "Total people capital",
            100
        );

        this.drawDataInfo(
            TELEMETRY_TEXT_POSITION_X+20, 
            TELEMETRY_TEXT_POSITION_Y,
            18,
            DEFAULT_DATA_COLOR,
            formattedGovernmentCaptial,
            "Government capital",
            100
        );

        this.drawDataInfo(
            TELEMETRY_TEXT_POSITION_X+20,
            TELEMETRY_TEXT_POSITION_Y+25,
            18,
            DEFAULT_DATA_COLOR,
            formattedPeoplePot,
            "People pot",
            100
        );

        this.drawDataInfo(
            TELEMETRY_TEXT_POSITION_X+20,
            TELEMETRY_TEXT_POSITION_Y+42,
            18,
            DEFAULT_DATA_COLOR,
            formattedPeoplePotSpentLastMonth,
            "Distributed this month",
            100
        );

        this.drawDataInfo(
            this.qualityOfDistributionProgressBar.progressBar.rectangle.x + this.qualityOfDistributionProgressBar.progressBar.rectangle.width + 10,
            this.qualityOfDistributionProgressBar.progressBar.rectangle.y + 30,
            18,
            QOD_COLOR,
            formattedOptimalMoneyPerPerson ,
            "Optimal capital per person",
            70
        );
        
        this.drawDataInfo(
            this.qualityOfDistributionProgressBar.progressBar.rectangle.x + this.qualityOfDistributionProgressBar.progressBar.rectangle.width + 10,
            this.qualityOfDistributionProgressBar.progressBar.rectangle.y + 60,
            18,
            QOD_COLOR,
            formattedAverageMoneyPerPerson ,
            "Average capital per person",
            70
        );

        this.qualityOfDistributionProgressBar.updateMetrics(this.qualityOfDistribution, "Quality of captial distribution", this.averageMoneyPerPerson /HUMAN_MAX_CAPITAL, this.optimalMoneyPerPerson/HUMAN_MAX_CAPITAL);
        this.qualityOfDistributionProgressBar.update(delta);

        this.drawDataInfo(
            this.qualityOfPersonCaptialSpreadProgressBar.progressBar.rectangle.x + this.qualityOfPersonCaptialSpreadProgressBar.progressBar.rectangle.width + 10, 
            this.qualityOfPersonCaptialSpreadProgressBar.progressBar.rectangle.y+30,
            18,
            QMM_COLOR,
            formattedMinimumCaptial ,
            "Minimum capital of people",
            70
        );

        this.drawDataInfo(
            this.qualityOfPersonCaptialSpreadProgressBar.progressBar.rectangle.x + this.qualityOfPersonCaptialSpreadProgressBar.progressBar.rectangle.width + 10, 
            this.qualityOfPersonCaptialSpreadProgressBar.progressBar.rectangle.y+60,
            18,
            QMM_COLOR,
            formattedMaximumCaptial,
            "Maximum capital of people",
            70
        );

        this.qualityOfPersonCaptialSpreadProgressBar.updateMetrics(this.qualityOfPersonCaptialSpread, "Quality of min/max spread", this.minimumPersonCaptial /HUMAN_MAX_CAPITAL, this.maxiumumPersonCaptial /HUMAN_MAX_CAPITAL);
        this.qualityOfPersonCaptialSpreadProgressBar.update(delta);

        this.totalQualityOfEconomyProgressBar.updateMetrics(this.totalQualityOfEconomy, "Total quality of economy", 0.60, 0.60);
        this.totalQualityOfEconomyProgressBar.update(delta);

        this.monthlyProgressBar.updateMetrics(this.monthlyProgress/MONTHLY_TICK_THRESHOLD, "Day " + this.monthlyProgress);
        this.monthlyProgressBar.update(delta);

        //real time plotting
        this.totalQualityOfEconomyPlot.add(Math.round(this.totalQualityOfEconomy*100));
        this.totalQualityOfEconomyPlot.update(delta);
    }

    drawDataInfo(x, y, _textSize, color, value, label, initialOffset) {
        push();

        fill(color.red, color.green, color.blue);
        textSize(_textSize);
        text(value, 
            x, 
            y
        );

        let widthOfValueText = textWidth(value);
        let offset = initialOffset;

        if(widthOfValueText >= initialOffset-10) {
            offset = widthOfValueText+10;
        }

        fill(90,90,90);
        textSize(14);
        text(label, 
            x+offset, 
            y-1
        );

        pop();
    }

    //TODO
    //legend (gradient fill) for people cluster, 
}