const fs = require('fs');

// Configuration (modify these values)
const FILE_PATH = './books/dune1.txt'; // Path to the text file to search
const SEARCH_PATTERN = 'Caladan'; // Word or phrase to search for

// Naive Search Algorithm
function naiveSearch(text, pattern) {
    const occurrences = [];
    const textLength = text.length;
    const patternLength = pattern.length;
    
    // Edge cases
    if (patternLength > textLength) return [];
    if (patternLength === 0) return [];
    
    // Brute force search
    for (let i = 0; i <= textLength - patternLength; i++) {
        let match = true;
        
        for (let j = 0; j < patternLength; j++) {
            if (text[i + j] !== pattern[j]) {
                match = false;
                break;
            }
        }
        
        if (match) {
            occurrences.push(i);
        }
    }
    
    return occurrences;
}

// Rabin-Karp Search Algorithm
function rabinKarpSearch(text, pattern) {
    const occurrences = [];
    const textLength = text.length;
    const patternLength = pattern.length;
    
    // Edge cases
    if (patternLength > textLength) return [];
    if (patternLength === 0) return [];
    
    // Prime number for hash calculation
    const prime = 101;
    
    // Function to calculate hash value
    function hash(str, end) {
        let hashValue = 0;
        for (let i = 0; i < end; i++) {
            hashValue += str.charCodeAt(i) * Math.pow(prime, i);
        }
        return hashValue;
    }
    
    // Calculate hash for pattern and initial window
    const patternHash = hash(pattern, patternLength);
    let textHash = hash(text, patternLength);
    
    // Search
    for (let i = 0; i <= textLength - patternLength; i++) {
        // Check if hash values match
        if (patternHash === textHash) {
            // Verify character by character
            let match = true;
            for (let j = 0; j < patternLength; j++) {
                if (text[i + j] !== pattern[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                occurrences.push(i);
            }
        }
        
        // Calculate hash for next window
        if (i < textLength - patternLength) {
            // Remove leading digit, add trailing digit
            textHash = textHash - text.charCodeAt(i);
            textHash = textHash / prime;
            textHash += text.charCodeAt(i + patternLength) * Math.pow(prime, patternLength - 1);
        }
    }
    
    return occurrences;
}

// Function to run benchmarks
function runBenchmark() {
    try {
        // Read the file
        console.log(`Reading file: ${FILE_PATH}`);
        const text = fs.readFileSync(FILE_PATH, 'utf8');
        console.log(`File loaded: ${text.length} characters`);
        console.log(`Searching for pattern: "${SEARCH_PATTERN}"`);
        console.log('----------------------------------------');
        
        // Run Naive Search
        console.log('Running Naive Search...');
        const naiveStartTime = performance.now();
        const naiveResults = naiveSearch(text, SEARCH_PATTERN);
        const naiveEndTime = performance.now();
        const naiveTime = naiveEndTime - naiveStartTime;
        
        // Run Rabin-Karp Search
        console.log('Running Rabin-Karp Search...');
        const rkStartTime = performance.now();
        const rkResults = rabinKarpSearch(text, SEARCH_PATTERN);
        const rkEndTime = performance.now();
        const rkTime = rkEndTime - rkStartTime;
        
        // Display results
        console.log('----------------------------------------');
        console.log('RESULTS:');
        console.log('----------------------------------------');
        console.log('Naive Search:');
        console.log(`- Occurrences found: ${naiveResults.length}`);
        console.log(`- Execution time: ${naiveTime.toFixed(4)} ms`);
        console.log('----------------------------------------');
        console.log('Rabin-Karp Search:');
        console.log(`- Occurrences found: ${rkResults.length}`);
        console.log(`- Execution time: ${rkTime.toFixed(4)} ms`);
        console.log('----------------------------------------');
        console.log(`Performance difference: ${Math.abs(((naiveTime / rkTime) - 1) * 100).toFixed(2)}% ${naiveTime > rkTime ? 'faster with Rabin-Karp' : 'faster with Naive Search'}`);
        
        // Verify results match
        const resultsMatch = naiveResults.length === rkResults.length && 
                            JSON.stringify(naiveResults) === JSON.stringify(rkResults);
        console.log(`Results consistency check: ${resultsMatch ? 'PASSED' : 'FAILED'}`);
        
        if (!resultsMatch) {
            console.log('WARNING: The algorithms produced different results!');
        }
        
    } catch (error) {
        console.error('Error during benchmark:', error.message);
        if (error.code === 'ENOENT') {
            console.error(`File "${FILE_PATH}" not found. Please create this file or change the FILE_PATH variable.`);
        }
    }
}

// Run the benchmark
runBenchmark();