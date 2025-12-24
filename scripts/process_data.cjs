// Script to process Cricsheet IPL data and generate players.js
const fs = require('fs');
const path = require('path');

const IPL_DATA_DIR = './ipl_data';
const OUTPUT_FILE = '../src/data/players.js';

// Team name normalization
const TEAM_ALIASES = {
    'Chennai Super Kings': 'csk',
    'Mumbai Indians': 'mi',
    'Royal Challengers Bangalore': 'rcb',
    'Royal Challengers Bengaluru': 'rcb',
    'Kolkata Knight Riders': 'kkr',
    'Delhi Capitals': 'dc',
    'Delhi Daredevils': 'dc',
    'Rajasthan Royals': 'rr',
    'Sunrisers Hyderabad': 'srh',
    'Punjab Kings': 'pbks',
    'Kings XI Punjab': 'pbks',
    'Gujarat Titans': 'gt',
    'Lucknow Super Giants': 'lsg',
    'Deccan Chargers': 'dc-old',
    'Rising Pune Supergiant': 'rps',
    'Rising Pune Supergiants': 'rps',
    'Gujarat Lions': 'gl',
    'Kochi Tuskers Kerala': 'ktk',
    'Pune Warriors': 'pw'
};

// Known overseas players by name patterns
const OVERSEAS_PATTERNS = {
    australia: ['Warner', 'Maxwell', 'Smith', 'Marsh', 'Starc', 'Cummins', 'Hazlewood', 'Lyon', 'Head', 'Labuschagne', 'Finch', 'Stoinis', 'Zampa', 'Short', 'Henriques', 'Ponting', 'Hussey', 'Watson', 'Lee', 'Johnson', 'Hodge', 'Bailey', 'Faulkner', 'Richardson', 'Behrendorff', 'Abbott', 'Fraser-McGurk', 'Green', 'Inglis', 'Philippe', 'Carey', 'McDermott'],
    england: ['Salt', 'Brook', 'Buttler', 'Bairstow', 'Root', 'Stokes', 'Moeen', 'Livingstone', 'Curran', 'Woakes', 'Archer', 'Rashid', 'Morgan', 'Malan', 'Roy', 'Hales', 'Plunkett', 'Jordan', 'Wood', 'Topley', 'Mills', 'Duckett', 'Crawley'],
    southafrica: ['de Villiers', 'du Plessis', 'de Kock', 'Rabada', 'Nortje', 'Ngidi', 'Morris', 'Miller', 'Markram', 'Klaasen', 'Bavuma', 'Pretorius', 'Steyn', 'Morkel', 'Tahir', 'Amla', 'Duminy', 'Botha', 'Rossouw', 'Stubbs', 'Jansen', 'Brevis'],
    westindies: ['Pollard', 'Bravo', 'Russell', 'Narine', 'Gayle', 'Hetmyer', 'Holder', 'Pooran', 'Lewis', 'Thomas', 'Cottrell', 'Powell', 'Hope', 'Joseph', 'Chase', 'Shepherd', 'Hosein'],
    newzealand: ['Williamson', 'Boult', 'Santner', 'Southee', 'Ferguson', 'Conway', 'Mitchell', 'Neesham', 'Taylor', 'McCullum', 'Guptill', 'Elliott', 'Milne', 'Munro', 'Phillips', 'Chapman', 'Jamieson', 'Henry'],
    srilanka: ['Malinga', 'Mathews', 'Perera', 'Mendis', 'Hasaranga', 'Theekshana', 'Rajapaksa', 'Jayawardene', 'Sangakkara', 'Dilshan'],
    bangladesh: ['Shakib', 'Mustafizur', 'Tamim', 'Mushfiqur'],
    afghanistan: ['Rashid', 'Nabi', 'Mujeeb', 'Omarzai', 'Zadran', 'Farooqi'],
    zimbabwe: ['Raza', 'Muzarabani', 'Ervine']
};

// Known award winners and special achievements
const SPECIAL_PLAYERS = {
    // Orange Cap winners (top run scorers)
    orangecap: [
        'V Kohli', 'DA Warner', 'SK Raina', 'S Dhawan', 'KL Rahul', 'JC Buttler', 'F du Plessis',
        'SE Marsh', 'CH Gayle', 'ML Hayden', 'RV Uthappa', 'MEK Hussey', 'KS Williamson',
        'SE Marsh', 'RG Sharma', 'MS Dhoni', 'JP Duminy', 'AB de Villiers', 'SV Samson', 'Shubman Gill'
    ],
    // Purple Cap winners (top wicket takers)
    purplecap: [
        'SP Narine', 'B Kumar', 'DJ Bravo', 'HH Pandya', 'YS Chahal', 'K Rabada', 'T Natarajan',
        'Rashid Khan', 'PP Chawla', 'A Mishra', 'JJ Bumrah', 'SL Malinga', 'RP Singh', 'R Ashwin',
        'Harshal Patel', 'Mohammed Shami', 'M Pathirana', 'Arshdeep Singh'
    ],
    // IPL winners (played for winning team in final)
    iplwinner: [
        'MS Dhoni', 'V Kohli', 'RG Sharma', 'JJ Bumrah', 'KA Pollard', 'RA Jadeja', 'SK Raina',
        'DJ Bravo', 'DL Chahar', 'SR Watson', 'F du Plessis', 'SP Narine', 'AD Russell', 'G Gambhir',
        'YK Pathan', 'AB de Villiers', 'SL Malinga', 'AT Rayudu', 'Shubman Gill', 'HH Pandya', 'Rashid Khan'
    ],
    // Known captains
    captain: [
        'MS Dhoni', 'V Kohli', 'RG Sharma', 'KL Rahul', 'RR Pant', 'SV Samson', 'SS Iyer',
        'DA Warner', 'KS Williamson', 'F du Plessis', 'Shubman Gill', 'HH Pandya', 'G Gambhir',
        'AM Rahane', 'SP Goswami', 'KD Karthik', 'M Kaif', 'R Dravid', 'SK Warne'
    ],
    // Primary batters
    batter: [
        'V Kohli', 'RG Sharma', 'S Dhawan', 'DA Warner', 'F du Plessis', 'SK Raina', 'AB de Villiers',
        'CH Gayle', 'KL Rahul', 'Shubman Gill', 'SV Samson', 'RR Pant', 'JC Buttler', 'AM Rahane',
        'MK Pandey', 'RV Uthappa', 'AT Rayudu', 'SS Iyer', 'D Padikkal', 'YBK Jaiswal', 'SA Yadav'
    ],
    // Primary bowlers
    bowler: [
        'JJ Bumrah', 'SL Malinga', 'B Kumar', 'Rashid Khan', 'YS Chahal', 'K Rabada', 'T Boult',
        'R Ashwin', 'SP Narine', 'PP Chawla', 'A Mishra', 'Mohammed Shami', 'Arshdeep Singh',
        'Mohammed Siraj', 'A Nortje', 'JR Hazlewood', 'Harshal Patel', 'Kuldeep Yadav'
    ],
    // All rounders
    allrounder: [
        'RA Jadeja', 'HH Pandya', 'AD Russell', 'DJ Bravo', 'BA Stokes', 'MM Ali', 'SR Watson',
        'GJ Maxwell', 'MP Stoinis', 'Shakib Al Hasan', 'JP Faulkner', 'JC Archer', 'A Patel',
        'Washington Sundar', 'V Shankar', 'R Tewatia', 'S Dube'
    ],
    // Wicket keepers
    wicketkeeper: [
        'MS Dhoni', 'RR Pant', 'SV Samson', 'KL Rahul', 'Q de Kock', 'JC Buttler', 'KD Karthik',
        'W Saha', 'RV Uthappa', 'PP Shaw', 'N Rana', 'Ishan Kishan', 'JP Inglis', 'PD Salt'
    ],
    // MVP winners
    mvp: [
        'V Kohli', 'AB de Villiers', 'AD Russell', 'CH Gayle', 'DA Warner', 'JC Buttler',
        'SP Narine', 'KL Rahul', 'Shubman Gill', 'JJ Bumrah'
    ]
};

// Process all match files
function processMatches() {
    const files = fs.readdirSync(IPL_DATA_DIR).filter(f => f.endsWith('.json'));
    const playerMap = new Map();

    console.log(`Processing ${files.length} matches...`);

    files.forEach((file) => {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(IPL_DATA_DIR, file), 'utf-8'));
            const { info } = data;

            if (!info || !info.players || !info.registry) return;

            const matchYear = info.dates?.[0]?.split('-')[0] || 'unknown';
            const winner = info.outcome?.winner;

            Object.entries(info.players).forEach(([teamName, playerNames]) => {
                const teamTag = TEAM_ALIASES[teamName] || teamName.toLowerCase().replace(/\s+/g, '-');
                const isWinnerTeam = teamName === winner;

                playerNames.forEach(name => {
                    const playerId = info.registry.people?.[name];
                    if (!playerId) return;

                    if (!playerMap.has(playerId)) {
                        playerMap.set(playerId, {
                            id: playerId,
                            name: name,
                            teams: new Set(),
                            years: new Set(),
                            matches: 0,
                            wins: 0
                        });
                    }

                    const player = playerMap.get(playerId);
                    player.teams.add(teamTag);
                    player.years.add(matchYear);
                    player.matches++;
                    if (isWinnerTeam) player.wins++;

                    if (name.length > player.name.length) {
                        player.name = name;
                    }
                });
            });

        } catch (err) {
            console.error(`Error processing ${file}:`, err.message);
        }
    });

    return playerMap;
}

// Detect nationality from name
function detectNationality(name) {
    for (const [country, patterns] of Object.entries(OVERSEAS_PATTERNS)) {
        for (const pattern of patterns) {
            if (name.includes(pattern)) {
                return country;
            }
        }
    }
    return 'india'; // Default to India if not matched
}

// Check if player has special achievement
function hasAchievement(name, category) {
    return SPECIAL_PLAYERS[category]?.some(p => name.includes(p) || p.includes(name.split(' ').pop()));
}

// Generate tags based on player data
function generateTags(player) {
    const tags = ['ipl'];

    // Add team tags
    player.teams.forEach(team => {
        if (!['dc-old', 'rps', 'gl', 'ktk', 'pw'].includes(team)) {
            tags.push(team);
        }
    });

    // Nationality
    const nationality = detectNationality(player.name);
    tags.push(nationality);
    if (nationality !== 'india') {
        tags.push('overseas');
    }

    // Year-based tags
    const years = Array.from(player.years).map(Number).filter(y => !isNaN(y)).sort();
    if (years.length > 0) {
        const latestYear = Math.max(...years);
        if (latestYear >= 2023) tags.push('recent');
        if (latestYear >= 2020 && latestYear <= 2024) tags.push('2020s');
        if (years.some(y => y >= 2015 && y <= 2019)) tags.push('2010s');
        if (years.some(y => y >= 2008 && y <= 2014)) tags.push('og');
    }

    // Experience tags
    if (player.matches >= 100) tags.push('veteran');
    if (player.matches >= 50) tags.push('experienced');
    if (player.matches < 20) tags.push('newcomer');
    if (player.teams.size >= 4) tags.push('journeyman');
    if (player.teams.size === 1) tags.push('loyal');

    // Special achievements
    if (hasAchievement(player.name, 'orangecap')) tags.push('orangecap');
    if (hasAchievement(player.name, 'purplecap')) tags.push('purplecap');
    if (hasAchievement(player.name, 'iplwinner')) tags.push('iplwinner');
    if (hasAchievement(player.name, 'captain')) tags.push('captain');
    if (hasAchievement(player.name, 'mvp')) tags.push('mvp');

    // Playing role
    if (hasAchievement(player.name, 'batter')) tags.push('batter');
    if (hasAchievement(player.name, 'bowler')) tags.push('bowler');
    if (hasAchievement(player.name, 'allrounder')) tags.push('allrounder');
    if (hasAchievement(player.name, 'wicketkeeper')) tags.push('wicketkeeper');

    return [...new Set(tags)]; // Remove duplicates
}

// Main execution
const playerMap = processMatches();

const minMatches = 5;
const players = Array.from(playerMap.values())
    .filter(p => p.matches >= minMatches)
    .map(p => ({
        id: p.id,
        name: p.name,
        teams: Array.from(p.teams),
        matches: p.matches,
        years: Array.from(p.years).sort(),
        tags: generateTags(p),
        image_url: `https://img1.hscicdn.com/image/upload/f_auto,t_h_100/lsci/db/PICTURES/CMS/316500/316503.png`
    }))
    .sort((a, b) => b.matches - a.matches);

console.log(`\nGenerated ${players.length} players with ${minMatches}+ matches`);

// Extract available tags for category selection
const tagCounts = {};
players.forEach(p => p.tags.forEach(t => {
    tagCounts[t] = (tagCounts[t] || 0) + 1;
}));

const categoryGroups = {
    teams: ['csk', 'mi', 'rcb', 'kkr', 'dc', 'rr', 'srh', 'pbks', 'gt', 'lsg'].filter(t => tagCounts[t]),
    nationality: ['india', 'overseas', 'australia', 'england', 'southafrica', 'westindies', 'newzealand'].filter(t => tagCounts[t]),
    awards: ['orangecap', 'purplecap', 'mvp', 'iplwinner', 'captain'].filter(t => tagCounts[t]),
    role: ['batter', 'bowler', 'allrounder', 'wicketkeeper'].filter(t => tagCounts[t]),
    era: ['og', '2010s', '2020s', 'recent'].filter(t => tagCounts[t]),
    experience: ['veteran', 'experienced', 'newcomer', 'loyal', 'journeyman'].filter(t => tagCounts[t])
};

console.log('\nTag counts:');
Object.entries(categoryGroups).forEach(([cat, tags]) => {
    console.log(`  ${cat}: ${tags.map(t => `${t}(${tagCounts[t]})`).join(', ')}`);
});

// Write output
const output = `// Auto-generated from Cricsheet IPL data
// Total players: ${players.length}
// Generated: ${new Date().toISOString()}

export const players = ${JSON.stringify(players, null, 2)};

// Available category tags for grid selection
export const availableTags = ${JSON.stringify(categoryGroups, null, 2)};

// Helper to check if grid has solutions
export function validateGrid(rowTags, colTags) {
  for (const rowTag of rowTags) {
    for (const colTag of colTags) {
      const hasMatch = players.some(p => 
        p.tags.includes(rowTag) && p.tags.includes(colTag)
      );
      if (!hasMatch) {
        return { valid: false, missing: { row: rowTag, col: colTag } };
      }
    }
  }
  return { valid: true };
}
`;

fs.writeFileSync(OUTPUT_FILE, output);
console.log(`\nWritten to ${OUTPUT_FILE}`);
