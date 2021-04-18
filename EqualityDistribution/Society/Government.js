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
        this.capital -= 20000;
    }

    monthlyAction() {
        this.spendPeoplePot();
        this.emergencyPeopleAid();
    }

    emergencyPeopleAid() {
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