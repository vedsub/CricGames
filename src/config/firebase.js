// Firebase configuration using environment variables
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, update, remove } from 'firebase/database';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Generate unique player ID
const getPlayerId = () => {
    let playerId = localStorage.getItem('cricgames_player_id');
    if (!playerId) {
        playerId = 'player_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('cricgames_player_id', playerId);
    }
    return playerId;
};

// Generate 6-character room code
const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Room functions
const createRoom = async (rowTags, colTags) => {
    const roomCode = generateRoomCode();
    const playerId = getPlayerId();

    const roomRef = ref(database, `rooms/${roomCode}`);
    await set(roomRef, {
        host: playerId,
        guest: null,
        status: 'waiting',
        turn: 'host',
        rowTags: rowTags || [],
        colTags: colTags || [],
        grid: [[null, null, null], [null, null, null], [null, null, null]],
        hostScore: 0,
        guestScore: 0,
        createdAt: Date.now()
    });

    return { roomCode, playerId, isHost: true };
};

const joinRoom = async (roomCode) => {
    const playerId = getPlayerId();
    const roomRef = ref(database, `rooms/${roomCode}`);

    const snapshot = await get(roomRef);
    if (!snapshot.exists()) {
        throw new Error('Room not found');
    }

    const roomData = snapshot.val();
    if (roomData.guest && roomData.guest !== playerId) {
        throw new Error('Room is full');
    }

    if (roomData.host === playerId) {
        return { roomCode, playerId, isHost: true };
    }

    await update(roomRef, {
        guest: playerId,
        status: 'selecting'
    });

    return { roomCode, playerId, isHost: false };
};

const subscribeToRoom = (roomCode, callback) => {
    const roomRef = ref(database, `rooms/${roomCode}`);
    return onValue(roomRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        }
    });
};

const updateRoom = async (roomCode, updates) => {
    const roomRef = ref(database, `rooms/${roomCode}`);
    await update(roomRef, updates);
};

const updateGrid = async (roomCode, grid, turn) => {
    const roomRef = ref(database, `rooms/${roomCode}`);
    await update(roomRef, { grid, turn });
};

const startGame = async (roomCode, rowTags, colTags) => {
    const roomRef = ref(database, `rooms/${roomCode}`);
    await update(roomRef, {
        rowTags,
        colTags,
        status: 'playing',
        turn: 'host'
    });
};

const leaveRoom = async (roomCode, isHost) => {
    const roomRef = ref(database, `rooms/${roomCode}`);
    if (isHost) {
        await remove(roomRef);
    } else {
        await update(roomRef, {
            guest: null,
            status: 'waiting'
        });
    }
};

export {
    database,
    getPlayerId,
    generateRoomCode,
    createRoom,
    joinRoom,
    subscribeToRoom,
    updateRoom,
    updateGrid,
    startGame,
    leaveRoom
};
