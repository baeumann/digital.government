class Government extends SocietyEntity {
    constructor(capital, peoplePot, corporationPot, society) {
        super();
        this.capital = capital;
        this.peoplePot = peoplePot;
        this.corporationPot = corporationPot;
        this.peoplePotSpent = 0;
        this.society = society;
    }

    depositPeoplePot(amount) {
        this.peoplePot += amount;
    }

    deductTaxes(amount) {
        let taxes = amount*TAX_RATE;
        let taxDeducted = amount - taxes;

        this.capital += taxes;

        return taxDeducted;
    }

    dailyAction() {
        //general cost per person
        this.capital -= 1*this.society.people.length;
    }

    monthlyAction() {
        this.spendActions();
        this.checkQualityOfEconomy();
    }

    checkQualityOfEconomy() {
        if(this.society.totalQualityOfEconomy < 0.6) {
            this.society.modifier.sequeezeCapitalLimit();

            //re-supply money
            this.society.surplusCut();
            this.spendActions();
        } else {
            this.society.modifier.resetCapitalLimit();
        }
    }

    spendActions() {
        this.spendPeoplePot();
        this.emergencySpend();
    }

    emergencySpend() {
        let amountOfEligiblePeople = 0;

        for(var i = 0; i < this.society.people.length; i++) {
            let currentPerson = this.society.people[i];

            if(currentPerson.capital < this.society.optimalMoneyPerPerson * EMERGENCY_AID_THRESHOLD) {
                amountOfEligiblePeople++;
            }
        }

        let peoplePotBeforeSpending = this.peoplePot;
        let amountToSpendPerPerson = this.peoplePot / amountOfEligiblePeople;

        for(var i = 0; i < this.society.people.length; i++) {
            let currentPerson = this.society.people[i];

            if(currentPerson.capital <= this.society.optimalMoneyPerPerson * EMERGENCY_AID_THRESHOLD) {
                this.peoplePot -= amountToSpendPerPerson;

                currentPerson.deposit(amountToSpendPerPerson);
            }

        }
        
        this.peoplePotSpent += peoplePotBeforeSpending - this.peoplePot;

        if(this.peoplePot <= 0) {
            this.peoplePot = 0;
        }
    }

    spendPeoplePot() {
        let peoplePotBeforeSpending = this.peoplePot;
        let amountToSpendPerPerson = this.peoplePot / this.society.people.length;

        for(var i = 0; i < this.society.people.length; i++) {
            let currentPerson = this.society.people[i];

            this.peoplePot -= amountToSpendPerPerson;

            currentPerson.deposit(amountToSpendPerPerson);
        }

        /*
        let amountOfEligiblePeople = 0;

        for(var i = 0; i < this.society.people.length; i++) {
            let currentPerson = this.society.people[i];


            
            if(currentPerson.capital < this.society.optimalMoneyPerPerson * POT_SHARE_THRESHOLD) {
                amountOfEligiblePeople++;
            }
        }
        let peoplePotBeforeSpending = this.peoplePot;
        let amountToSpendPerPerson = this.peoplePot / amountOfEligiblePeople;

        for(var i = 0; i < this.society.people.length; i++) {
            let currentPerson = this.society.people[i];

            if(currentPerson.capital <= this.society.optimalMoneyPerPerson * POT_SHARE_THRESHOLD) {
                this.peoplePot -= amountToSpendPerPerson;

                currentPerson.deposit(amountToSpendPerPerson);
            }

        }
        */
        this.peoplePotSpent = peoplePotBeforeSpending - this.peoplePot;

        if(this.peoplePot <= 0) {
            this.peoplePot = 0;
        }

    }
    
}