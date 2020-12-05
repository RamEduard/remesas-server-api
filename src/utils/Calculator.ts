export class Calculator {

    /**
     * Calc spread
     * 
     * @param {number} buy 
     * @param {number} sell 
     * @param {number} avg 
     */
    spread(buy: number, sell: number, avg: number): number {
        return (avg - (avg/buy*sell)) / avg
    }
}

export default new Calculator()