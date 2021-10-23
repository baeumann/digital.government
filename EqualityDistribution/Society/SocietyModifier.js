const HUMAN_MAX_CAPITAL = 10000;
const MINIMUM_WAGE = 1000;
const GOVERMENT_MAX_CAPITAL = 1000000;
const TAX_RATE = 0.05;
const EMERGENCY_AID_THRESHOLD = 1;

const MONTHLY_TICK_THRESHOLD = 30;

const PEOPLE_AMOUNT = 1000;

const TELEMETRY_TEXT_POSITION_X = 500;
const TELEMETRY_TEXT_POSITION_Y = 80;

const TICK_INTERVAL = 100;

const QMM_COLOR = new SimpleColor(224, 162, 36);
const QOD_COLOR = new SimpleColor(100, 62, 214);
const TQE_COLOR = new SimpleColor(50, 168, 82);

const DEFAULT_DATA_COLOR = new SimpleColor(32,162,173);
const BACKGROUND_COLOR = new SimpleColor(28,30,38);

class SocietyModifier {

    constructor() {
        this.currentHumanCapitalLimit = HUMAN_MAX_CAPITAL;

        this.capitalLevels = new Array(
            HUMAN_MAX_CAPITAL,
            HUMAN_MAX_CAPITAL * 0.9,
            HUMAN_MAX_CAPITAL * 0.6,
            HUMAN_MAX_CAPITAL * 0.1
        );

        this.currentCapitalLevel = 0;
    }

    sequeezeCapitalLimit() {
        this.currentCapitalLevel++;
        if(this.currentCapitalLevel >= this.capitalLevels.length) {
            this.currentCapitalLevel = this.capitalLevels.length -1;
        }
    }

    resetCapitalLimit() {
        this.currentCapitalLevel = 0;
    }

    getCapitalLimit() {
        return this.capitalLevels[this.currentCapitalLevel];
    }
}