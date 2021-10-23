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

        if(this.capital == this.government.society.modifier.getCapitalLimit()) {
            return color(0, 107, 25);
        } else if(this.capital == 0){
            return color(105, 1, 34);
        } else {
            return lerpColor(noCaptialColor, maxCaptialColor, this.capital/this.government.society.modifier.getCapitalLimit());
        }
    }

    update(delta) {
        super.update(delta, this.capital/this.government.society.modifier.getCapitalLimit());
    }

    dailyAction() {
        super.dailyAction();

        this.withdraw(MINIMUM_WAGE*this.success*0.033 + this.capital*Math.random()*0.08);
    }

    monthlyAction() {
        super.monthlyAction();

        if(this.success > 0.2) {
            //basic deposit on possible maximum (needs to retain stable)
            this.deposit(MINIMUM_WAGE + HUMAN_MAX_CAPITAL*this.success*0.2);
        } 
        //below 0.2 earns no money besides the pot money (unemployed)
    }

    deposit(amount) {
        this.capital += this.government.deductTaxes(amount);

        //limit money directly on deposit
        this.limitCheck();
    }

    limitCheck() {
        let capitalLimit = this.government.society.modifier.getCapitalLimit();

        if(this.capital > capitalLimit) {
            this.government.depositPeoplePot(this.capital - capitalLimit);
            this.capital = capitalLimit;
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