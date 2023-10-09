import axios from "axios";

// Random Messages
export const setRandomMessages = async (value: boolean) => {
    return axios.post('/api/constructs/set/randommessages', { value }).then(res => res.data);
}
export const getRandomMessages = async () => {
    return axios.get('/api/constructs/randommessages').then(res => res.data);
}

// Random Thoughts
export const setRandomThoughts = async (value: boolean) => {
    return axios.post('/api/constructs/set/randomthoughts', { value }).then(res => res.data);
}
export const getRandomThoughts = async () => {
    return axios.get('/api/constructs/randomthoughts').then(res => res.data);
}

// Random Actions
export const setRandomActions = async (value: boolean) => {
    return axios.post('/api/constructs/set/randomactions', { value }).then(res => res.data);
}
export const getRandomActions = async () => {
    return axios.get('/api/constructs/randomactions').then(res => res.data);
}

// Thought Interval
export const setThoughtInterval = async (value: number) => {
    return axios.post('/api/constructs/set/thoughtinterval', { value }).then(res => res.data);
}
export const getThoughtInterval = async () => {
    return axios.get('/api/constructs/thoughtinterval').then(res => res.data);
}

// Action Interval
export const setActionInterval = async (value: number) => {
    return axios.post('/api/constructs/set/actioninterval', { value }).then(res => res.data);
}
export const getActionInterval = async () => {
    return axios.get('/api/constructs/actioninterval').then(res => res.data);
}

// Message Interval
export const setMessageInterval = async (value: number) => {
    return axios.post('/api/constructs/set/messageinterval', { value }).then(res => res.data);
}
export const getMessageInterval = async () => {
    return axios.get('/api/constructs/messageinterval').then(res => res.data);
}

// Show Discord User Info
export const setShowDiscordUserInfo = async (value: boolean) => {
    return axios.post('/api/constructs/set/showdiscorduserinfo', { value }).then(res => res.data);
}
export const getShowDiscordUserInfo = async () => {
    return axios.get('/api/constructs/showdiscorduserinfo').then(res => res.data);
}