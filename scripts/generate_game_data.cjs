// Script to generate expanded datasets for Tenaball and Who Are You
const fs = require('fs');
const path = require('path');

const IPL_DATA_DIR = './ipl_data';

// Team name normalization
const TEAM_ALIASES = {
    'Chennai Super Kings': 'CSK',
    'Mumbai Indians': 'MI',
    'Royal Challengers Bangalore': 'RCB',
    'Royal Challengers Bengaluru': 'RCB',
    'Kolkata Knight Riders': 'KKR',
    'Delhi Capitals': 'DC',
    'Delhi Daredevils': 'DC',
    'Rajasthan Royals': 'RR',
    'Sunrisers Hyderabad': 'SRH',
    'Punjab Kings': 'PBKS',
    'Kings XI Punjab': 'PBKS',
    'Gujarat Titans': 'GT',
    'Lucknow Super Giants': 'LSG'
};

const TEAM_FULL_NAMES = {
    'CSK': 'Chennai Super Kings',
    'MI': 'Mumbai Indians',
    'RCB': 'Royal Challengers Bengaluru',
    'KKR': 'Kolkata Knight Riders',
    'DC': 'Delhi Capitals',
    'RR': 'Rajasthan Royals',
    'SRH': 'Sunrisers Hyderabad',
    'PBKS': 'Punjab Kings',
    'GT': 'Gujarat Titans',
    'LSG': 'Lucknow Super Giants'
};

// Player stats storage
const playerStats = new Map();

// Process all matches
function processMatches() {
    const files = fs.readdirSync(IPL_DATA_DIR).filter(f => f.endsWith('.json'));
    console.log(`Processing ${files.length} matches...`);

    files.forEach((file) => {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(IPL_DATA_DIR, file), 'utf-8'));
            processMatch(data);
        } catch (err) {
            // Skip invalid files
        }
    });
}

function processMatch(data) {
    const { info, innings } = data;
    if (!info || !innings) return;

    // Get team mapping
    const teams = {};
    Object.entries(info.players || {}).forEach(([teamName, players]) => {
        const teamCode = TEAM_ALIASES[teamName];
        if (teamCode) {
            players.forEach(name => {
                if (!playerStats.has(name)) {
                    playerStats.set(name, {
                        name,
                        teams: new Set(),
                        runs: 0,
                        balls: 0,
                        wickets: 0,
                        catches: 0,
                        sixes: 0,
                        fours: 0,
                        matches: 0
                    });
                }
                playerStats.get(name).teams.add(teamCode);
            });
        }
    });

    // Process innings for stats
    innings.forEach(inning => {
        const battingTeam = TEAM_ALIASES[inning.team];

        (inning.overs || []).forEach(over => {
            (over.deliveries || []).forEach(delivery => {
                const batter = delivery.batter;
                const bowler = delivery.bowler;
                const runs = delivery.runs?.batter || 0;

                // Batting stats
                if (playerStats.has(batter)) {
                    const stats = playerStats.get(batter);
                    stats.runs += runs;
                    stats.balls += 1;
                    if (runs === 6) stats.sixes += 1;
                    if (runs === 4) stats.fours += 1;
                }

                // Bowling stats
                if (delivery.wickets && playerStats.has(bowler)) {
                    delivery.wickets.forEach(wicket => {
                        if (['bowled', 'caught', 'lbw', 'stumped', 'caught and bowled', 'hit wicket'].includes(wicket.kind)) {
                            playerStats.get(bowler).wickets += 1;
                        }
                        // Catches
                        if (wicket.kind === 'caught' && wicket.fielders) {
                            wicket.fielders.forEach(f => {
                                const fielderName = f.name;
                                if (playerStats.has(fielderName)) {
                                    playerStats.get(fielderName).catches += 1;
                                }
                            });
                        }
                    });
                }
            });
        });
    });

    // Mark matches played
    Object.values(info.players || {}).flat().forEach(name => {
        if (playerStats.has(name)) {
            playerStats.get(name).matches += 1;
        }
    });
}

// Generate Tenaball questions
function generateTenaballQuestions() {
    const questions = [];
    const allPlayers = Array.from(playerStats.values());

    // Top 10 run scorers overall
    const topRunScorers = [...allPlayers]
        .sort((a, b) => b.runs - a.runs)
        .slice(0, 10)
        .map((p, i) => ({ rank: i + 1, name: p.name, stat: `${p.runs} runs` }));

    questions.push({
        id: 1,
        question: "Top 10 Run Scorers in IPL History",
        category: "ipl",
        answers: topRunScorers
    });

    // Top 10 wicket takers overall
    const topWicketTakers = [...allPlayers]
        .sort((a, b) => b.wickets - a.wickets)
        .slice(0, 10)
        .map((p, i) => ({ rank: i + 1, name: p.name, stat: `${p.wickets} wickets` }));

    questions.push({
        id: 2,
        question: "Top 10 Wicket Takers in IPL History",
        category: "ipl",
        answers: topWicketTakers
    });

    // Top 10 six hitters
    const topSixHitters = [...allPlayers]
        .sort((a, b) => b.sixes - a.sixes)
        .slice(0, 10)
        .map((p, i) => ({ rank: i + 1, name: p.name, stat: `${p.sixes} sixes` }));

    questions.push({
        id: 3,
        question: "Top 10 Six Hitters in IPL History",
        category: "power",
        answers: topSixHitters
    });

    // Top 10 per team (runs)
    const mainTeams = ['CSK', 'MI', 'RCB', 'KKR', 'DC', 'RR', 'SRH', 'PBKS'];
    let questionId = 4;

    mainTeams.forEach(team => {
        const teamPlayers = allPlayers.filter(p => p.teams.has(team));
        const topTeamScorers = [...teamPlayers]
            .sort((a, b) => b.runs - a.runs)
            .slice(0, 10);

        if (topTeamScorers.length >= 10) {
            questions.push({
                id: questionId++,
                question: `Top 10 Run Scorers for ${TEAM_FULL_NAMES[team]}`,
                category: team.toLowerCase(),
                answers: topTeamScorers.map((p, i) => ({ rank: i + 1, name: p.name, stat: `${p.runs} runs` }))
            });
        }
    });

    // Top 10 per team (wickets)
    mainTeams.forEach(team => {
        const teamPlayers = allPlayers.filter(p => p.teams.has(team));
        const topTeamBowlers = [...teamPlayers]
            .sort((a, b) => b.wickets - a.wickets)
            .slice(0, 10);

        if (topTeamBowlers.length >= 10 && topTeamBowlers[9].wickets > 0) {
            questions.push({
                id: questionId++,
                question: `Top 10 Wicket Takers for ${TEAM_FULL_NAMES[team]}`,
                category: team.toLowerCase(),
                answers: topTeamBowlers.map((p, i) => ({ rank: i + 1, name: p.name, stat: `${p.wickets} wickets` }))
            });
        }
    });

    return questions;
}

// Generate Who Are You players
function generateWhoAreYouPlayers() {
    const allPlayers = Array.from(playerStats.values());

    // Get top 60 players by total impact (runs + wickets*25)
    const topPlayers = [...allPlayers]
        .filter(p => p.matches >= 20) // At least 20 matches
        .sort((a, b) => (b.runs + b.wickets * 25) - (a.runs + a.wickets * 25))
        .slice(0, 60);

    // Known player details
    const playerDetails = {
        'V Kohli': { nationality: 'India', age: 36, jerseyNumber: 18, role: 'Batter' },
        'MS Dhoni': { nationality: 'India', age: 43, jerseyNumber: 7, role: 'Wicket-Keeper' },
        'RG Sharma': { nationality: 'India', age: 37, jerseyNumber: 45, role: 'Batter' },
        'JJ Bumrah': { nationality: 'India', age: 31, jerseyNumber: 93, role: 'Bowler' },
        'RA Jadeja': { nationality: 'India', age: 36, jerseyNumber: 8, role: 'All-Rounder' },
        'S Dhawan': { nationality: 'India', age: 38, jerseyNumber: 25, role: 'Batter' },
        'KL Rahul': { nationality: 'India', age: 32, jerseyNumber: 1, role: 'Wicket-Keeper' },
        'HH Pandya': { nationality: 'India', age: 31, jerseyNumber: 33, role: 'All-Rounder' },
        'Shubman Gill': { nationality: 'India', age: 25, jerseyNumber: 77, role: 'Batter' },
        'RR Pant': { nationality: 'India', age: 27, jerseyNumber: 17, role: 'Wicket-Keeper' },
        'YS Chahal': { nationality: 'India', age: 34, jerseyNumber: 3, role: 'Bowler' },
        'R Ashwin': { nationality: 'India', age: 38, jerseyNumber: 99, role: 'Bowler' },
        'DA Warner': { nationality: 'Australia', age: 38, jerseyNumber: 31, role: 'Batter' },
        'AB de Villiers': { nationality: 'South Africa', age: 40, jerseyNumber: 17, role: 'Batter' },
        'KA Pollard': { nationality: 'West Indies', age: 37, jerseyNumber: 55, role: 'All-Rounder' },
        'SP Narine': { nationality: 'West Indies', age: 36, jerseyNumber: 74, role: 'All-Rounder' },
        'AD Russell': { nationality: 'West Indies', age: 36, jerseyNumber: 12, role: 'All-Rounder' },
        'DJ Bravo': { nationality: 'West Indies', age: 41, jerseyNumber: 47, role: 'All-Rounder' },
        'SL Malinga': { nationality: 'Sri Lanka', age: 41, jerseyNumber: 99, role: 'Bowler' },
        'Rashid Khan': { nationality: 'Afghanistan', age: 26, jerseyNumber: 19, role: 'Bowler' },
        'SK Raina': { nationality: 'India', age: 37, jerseyNumber: 3, role: 'Batter' },
        'CH Gayle': { nationality: 'West Indies', age: 45, jerseyNumber: 175, role: 'Batter' },
        'F du Plessis': { nationality: 'South Africa', age: 40, jerseyNumber: 21, role: 'Batter' },
        'GJ Maxwell': { nationality: 'Australia', age: 36, jerseyNumber: 32, role: 'All-Rounder' },
        'JC Buttler': { nationality: 'England', age: 34, jerseyNumber: 63, role: 'Wicket-Keeper' },
        'B Kumar': { nationality: 'India', age: 34, jerseyNumber: 15, role: 'Bowler' },
        'SV Samson': { nationality: 'India', age: 30, jerseyNumber: 9, role: 'Wicket-Keeper' },
        'KD Karthik': { nationality: 'India', age: 39, jerseyNumber: 21, role: 'Wicket-Keeper' },
        'SA Yadav': { nationality: 'India', age: 34, jerseyNumber: 63, role: 'Batter' },
        'AT Rayudu': { nationality: 'India', age: 39, jerseyNumber: 3, role: 'Batter' },
        'PP Chawla': { nationality: 'India', age: 35, jerseyNumber: 18, role: 'Bowler' },
        'A Mishra': { nationality: 'India', age: 41, jerseyNumber: 11, role: 'Bowler' },
        'Mohammed Shami': { nationality: 'India', age: 34, jerseyNumber: 11, role: 'Bowler' },
        'T Boult': { nationality: 'New Zealand', age: 35, jerseyNumber: 18, role: 'Bowler' },
        'PA Patel': { nationality: 'India', age: 39, jerseyNumber: 5, role: 'Wicket-Keeper' },
        'RV Uthappa': { nationality: 'India', age: 38, jerseyNumber: 61, role: 'Wicket-Keeper' },
        'AM Rahane': { nationality: 'India', age: 36, jerseyNumber: 20, role: 'Batter' },
        'SS Iyer': { nationality: 'India', age: 30, jerseyNumber: 41, role: 'Batter' },
        'MK Pandey': { nationality: 'India', age: 35, jerseyNumber: 44, role: 'Batter' },
        'Mohammed Siraj': { nationality: 'India', age: 30, jerseyNumber: 73, role: 'Bowler' },
        'Arshdeep Singh': { nationality: 'India', age: 25, jerseyNumber: 2, role: 'Bowler' },
        'K Rabada': { nationality: 'South Africa', age: 29, jerseyNumber: 25, role: 'Bowler' },
        'Q de Kock': { nationality: 'South Africa', age: 31, jerseyNumber: 12, role: 'Wicket-Keeper' },
        'Ishan Kishan': { nationality: 'India', age: 26, jerseyNumber: 32, role: 'Wicket-Keeper' },
    };

    return topPlayers.map((p, i) => {
        const details = playerDetails[p.name] || {
            nationality: 'India',
            age: 25 + Math.floor(Math.random() * 15),
            jerseyNumber: Math.floor(Math.random() * 99) + 1,
            role: p.wickets > p.runs / 30 ? 'Bowler' : 'Batter'
        };

        const primaryTeam = Array.from(p.teams)[0] || 'MI';

        return {
            id: i + 1,
            name: p.name,
            nationality: details.nationality,
            league: 'IPL',
            team: primaryTeam,
            role: details.role,
            age: details.age,
            jerseyNumber: details.jerseyNumber,
            image: '🏏'
        };
    });
}

// Main execution
processMatches();

const tenaballQuestions = generateTenaballQuestions();
const whoAreYouPlayers = generateWhoAreYouPlayers();

console.log(`Generated ${tenaballQuestions.length} Tenaball questions`);
console.log(`Generated ${whoAreYouPlayers.length} Who Are You players`);

// Write Tenaball data
const tenaballOutput = `// Auto-generated Tenaball questions from Cricsheet IPL data
// Generated: ${new Date().toISOString()}

export const tenaballQuestions = ${JSON.stringify(tenaballQuestions, null, 2)};

export const getRandomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * tenaballQuestions.length);
  return tenaballQuestions[randomIndex];
};

export const matchPlayerName = (guess, answers) => {
  const normalizedGuess = guess.toLowerCase().trim();
  
  for (const answer of answers) {
    const normalizedName = answer.name.toLowerCase();
    const nameParts = normalizedName.split(' ');
    
    if (normalizedName === normalizedGuess) return answer;
    if (nameParts[nameParts.length - 1] === normalizedGuess) return answer;
    if (nameParts[0] === normalizedGuess && normalizedGuess.length > 4) return answer;
    if (normalizedName.includes(normalizedGuess) && normalizedGuess.length > 3) return answer;
  }
  return null;
};
`;

fs.writeFileSync('../src/data/tenaball.js', tenaballOutput);
console.log('Written tenaball.js');

// Write Who Are You data
const whoAreYouOutput = `// Auto-generated Who Are You players from Cricsheet IPL data
// Generated: ${new Date().toISOString()}

export const whoAreYouPlayers = ${JSON.stringify(whoAreYouPlayers, null, 2)};

export const getRandomMysteryPlayer = () => {
  const index = Math.floor(Math.random() * whoAreYouPlayers.length);
  return whoAreYouPlayers[index];
};

export const compareGuess = (guess, mystery) => {
  return {
    player: guess,
    nationality: { value: guess.nationality, match: guess.nationality === mystery.nationality },
    league: { value: guess.league, match: guess.league === mystery.league },
    team: { value: guess.team, match: guess.team === mystery.team },
    role: { value: guess.role, match: guess.role === mystery.role },
    age: {
      value: guess.age,
      match: guess.age === mystery.age,
      direction: guess.age > mystery.age ? 'down' : guess.age < mystery.age ? 'up' : null
    },
    jerseyNumber: {
      value: guess.jerseyNumber,
      match: guess.jerseyNumber === mystery.jerseyNumber,
      direction: guess.jerseyNumber > mystery.jerseyNumber ? 'down' : guess.jerseyNumber < mystery.jerseyNumber ? 'up' : null
    },
    isCorrect: guess.id === mystery.id
  };
};

export const searchPlayers = (query, excludeIds = []) => {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return [];
  
  return whoAreYouPlayers
    .filter(p => !excludeIds.includes(p.id))
    .filter(p => p.name.toLowerCase().includes(normalized))
    .slice(0, 5);
};
`;

fs.writeFileSync('../src/data/whoareyou.js', whoAreYouOutput);
console.log('Written whoareyou.js');
