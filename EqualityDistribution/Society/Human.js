class Human extends GridWandererEntity{
    constructor(gridCanvas, success, capital, government) {
        super(gridCanvas.width, gridCanvas.height, new Vector2(gridCanvas.width/2, gridCanvas.height/2));
        this.success = success;
        this.capital = capital;
        this.government = government;
    }

    calculateColorForCapital() {
        let noCaptialColor = color(217,114,91);
        let maxCaptialColor = color(91,217,141);

        if(this.capital == HUMAN_MAX_CAPITAL) {
            return color(0, 107, 25);
        } else if(this.capital == 0){
            return color(105, 1, 34);
        } else {
            return lerpColor(noCaptialColor, maxCaptialColor, this.capital/HUMAN_MAX_CAPITAL);
        }
    }

    update(delta) {
        super.update(delta, this.capital/HUMAN_MAX_CAPITAL);
    }

    dailyAction() {
        super.dailyAction();

        this.withdraw(MINIMUM_WAGE*this.success*0.033 + this.capital*Math.random()*0.02);
    }

    monthlyAction() {
        super.monthlyAction();

        if(this.success > 0.2) {
            this.deposit(MINIMUM_WAGE + HUMAN_MAX_CAPITAL*this.success*0.5);
        }
    }

    deposit(amount) {
        this.capital += this.government.deductTaxes(amount);

        if(this.capital > HUMAN_MAX_CAPITAL) {
            this.government.depositPeoplePot(this.capital - HUMAN_MAX_CAPITAL);
            this.capital = HUMAN_MAX_CAPITAL;
        }
    }

    withdraw(amount) {
        this.capital -= amount;

        if(this.capital < 0) {
            this.capital = 0;
            //maybe add debt later
        }
    }
}