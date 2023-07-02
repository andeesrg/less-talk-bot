// Checks city on proper format "city"(only letters)
export const cityRegex = /^[A-Z|a-z|А-Я|а-я]{3,}$/gm;
// Checks time on proper format "7:00, 9:05"(hours going without leading 0) and extracts time that's been input by user
export const timeRegex = /^([0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9])$/gm;
// Extracts minutes from time that's been input by user
export const extractMinsRegex = /([0-9]|[1-5][0-9])$/gm;
// Checks task title on everything's been input
export const taskTitleRegex = /^(?=[\S\s]{5,50})[\S\s]*$/;
// Checks task ID on proper format "1,2...11"(IDs going without leading 0)
export const taskIdRegex = /^[1-9]+[0-9]*?$/gm;
