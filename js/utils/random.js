// Random utility functions for probability-based outcomes

const Random = {
    // Get a random number between min and max (inclusive)
    between(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Get a random float between min and max
    floatBetween(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Returns true based on probability (0-100)
    chance(probability) {
        return Math.random() * 100 < probability;
    },

    // Pick a random item from an array
    pick(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    // Weighted random selection
    // items: [{value: any, weight: number}, ...]
    weighted(items) {
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const item of items) {
            random -= item.weight;
            if (random <= 0) {
                return item.value;
            }
        }
        return items[items.length - 1].value;
    },

    // Generate a variance around a base value
    // e.g., variance(100, 20) returns 80-120
    variance(base, percent) {
        const range = base * (percent / 100);
        return base + Random.floatBetween(-range, range);
    },

    // Simulate a risk-based outcome
    // Returns multiplier for investment
    riskOutcome(riskLevel) {
        const outcomes = {
            low: [
                { value: 1.1, weight: 40 },   // Small profit
                { value: 1.0, weight: 35 },   // Break even
                { value: 0.95, weight: 20 },  // Small loss
                { value: 0.8, weight: 5 }     // Medium loss
            ],
            medium: [
                { value: 1.3, weight: 25 },   // Good profit
                { value: 1.1, weight: 25 },   // Small profit
                { value: 1.0, weight: 20 },   // Break even
                { value: 0.85, weight: 20 },  // Medium loss
                { value: 0.6, weight: 10 }    // Large loss
            ],
            high: [
                { value: 2.0, weight: 10 },   // Great profit
                { value: 1.5, weight: 15 },   // Good profit
                { value: 1.0, weight: 20 },   // Break even
                { value: 0.7, weight: 25 },   // Medium loss
                { value: 0.3, weight: 20 },   // Large loss
                { value: 0, weight: 10 }      // Total loss
            ]
        };
        
        return Random.weighted(outcomes[riskLevel] || outcomes.medium);
    },

    // Generate random name for leaderboard
    generateName() {
        const prefixes = ['Crypto', 'Money', 'Pro', 'Elite', 'Swift', 'Alpha', 'Mega', 'Ultra'];
        const suffixes = ['Trader', 'Master', 'King', 'Boss', 'Shark', 'Wolf', 'Guru', 'Hustler'];
        const numbers = ['', '99', '2024', 'X', '007', ''];
        
        return Random.pick(prefixes) + Random.pick(suffixes) + Random.pick(numbers);
    }
};

// Make available globally
window.Random = Random;
