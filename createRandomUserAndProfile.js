"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var faker_1 = require("@faker-js/faker");
var fs = require("fs");
var path = require("path");
var form_data_1 = require("form-data");
var API_BASE_URL_PROFILE = 'http://localhost:3000/api/v1/users';
var API_BASE_URL_MATCH = 'http://localhost:3000/api/v1/matching';
var API_BASE_URL_MESSAGES = 'http://localhost:3000/api/v1/messages';
var emails = [];
function saveEmailsToFile() {
    var emailsJson = { emails: emails }; // Crear un objeto con los correos
    var filePath = 'C:/Users/migue/Desktop/UniMatchApi/dist/emails.json'; // La ruta donde guardar el archivo
    fs.writeFileSync(filePath, JSON.stringify(emailsJson, null, 2), 'utf8');
    console.log('Correos electrónicos guardados en emails.json');
}
function getRandomImageFromUploads() {
    var uploadsDirectory = path.resolve('C:/Users/migue/Desktop/UniMatchApi/dist/apps/RestApi/uploads/');
    var files = fs.readdirSync(uploadsDirectory);
    var imageFiles = files.filter(function (file) { return file.match(/\.(jpg|jpeg|png|gif)$/); });
    var randomIndex = Math.floor(Math.random() * imageFiles.length);
    return path.join(uploadsDirectory, imageFiles[randomIndex]);
}
function generateULPGCEmail() {
    var username = faker_1.faker.internet.userName().toLowerCase().replace(/[^a-z0-9]/g, '');
    emails.push("".concat(username, "@alu.ulpgc.es"));
    return "".concat(username, "@alu.ulpgc.es");
}
createRandomUserAndProfile();
function createRandomUserAndProfile() {
    return __awaiter(this, void 0, void 0, function () {
        var randomUser, userResponse, user, imagePath, imageFileStream, randomProfile, form, profileResponse, newGenderPriority, newAgeRange, newMaxDistance, location_1, randomLocation, locationDto, genderPriorityDto, ageRangeDto, maxDistanceDto, randomValue, j, imagePath_1, imageFileStream_1, form_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 12, , 13]);
                    randomUser = {
                        email: generateULPGCEmail(),
                        password: "Password24?",
                    };
                    return [4 /*yield*/, axios_1.default.post("".concat(API_BASE_URL_PROFILE), randomUser)];
                case 1:
                    userResponse = _a.sent();
                    user = userResponse.data.value.user;
                    imagePath = getRandomImageFromUploads();
                    imageFileStream = fs.createReadStream(imagePath);
                    randomProfile = {
                        userId: user.id,
                        name: faker_1.faker.name.firstName(),
                        age: faker_1.faker.number.int({ min: 19, max: 45 }),
                        aboutMe: faker_1.faker.lorem.sentence(),
                        gender: faker_1.faker.helpers.arrayElement(['MALE', 'FEMALE', 'OTHER']),
                        sexualOrientation: faker_1.faker.helpers.arrayElement(["HETEROSEXUAL", "HOMOSEXUAL", "BISEXUAL", "ASEXUAL", "OTHER"]),
                        relationshipType: faker_1.faker.helpers.arrayElement(["FRIENDSHIP", "CASUAL", "LONG_TERM", "OPEN", "OTHER"]),
                        birthday: faker_1.faker.date.past({ years: faker_1.faker.number.int({ min: 18, max: 30 }) }),
                        attachment: imageFileStream,
                    };
                    form = new form_data_1.default();
                    form.append('userId', randomProfile.userId);
                    form.append('name', randomProfile.name);
                    form.append('age', randomProfile.age);
                    form.append('aboutMe', randomProfile.aboutMe);
                    form.append('gender', randomProfile.gender);
                    form.append('sexualOrientation', randomProfile.sexualOrientation);
                    form.append('relationshipType', randomProfile.relationshipType);
                    form.append('birthday', randomProfile.birthday.toISOString());
                    form.append('thumbnail', imageFileStream, { filename: 'images.jpg', contentType: 'image/jpg' });
                    return [4 /*yield*/, axios_1.default.post("".concat(API_BASE_URL_PROFILE, "/profile"), form, {
                            headers: {
                                'Authorization': "Bearer ".concat(userResponse.data.value.token),
                            }
                        })];
                case 2:
                    profileResponse = _a.sent();
                    newGenderPriority = faker_1.faker.helpers.arrayElement(['MALE', 'FEMALE', 'OTHER']);
                    newAgeRange = [faker_1.faker.number.int({ min: 19, max: 30 }), faker_1.faker.number.int({ min: 31, max: 45 })];
                    newMaxDistance = faker_1.faker.number.int({ min: 0, max: 100 });
                    location_1 = [
                        { latitude: 28.0782, longitude: -15.4501 },
                        { latitude: 28.01, longitude: -15.41 },
                        { latitude: 28.04, longitude: -15.42 },
                        { latitude: 28.11, longitude: -15.53 }
                    ];
                    randomLocation = location_1[Math.floor(Math.random() * location_1.length)];
                    locationDto = {
                        latitude: randomLocation.latitude,
                        longitude: randomLocation.longitude
                    };
                    genderPriorityDto = { newContent: newGenderPriority };
                    ageRangeDto = {
                        userId: userResponse.data.value.user.id,
                        min: newAgeRange[0],
                        max: newAgeRange[1],
                    };
                    maxDistanceDto = { newContent: newMaxDistance };
                    randomValue = Math.random();
                    return [4 /*yield*/, axios_1.default.put("".concat(API_BASE_URL_PROFILE, "/location"), locationDto, {
                            headers: {
                                'Authorization': "Bearer ".concat(userResponse.data.value.token),
                            }
                        })];
                case 3:
                    _a.sent();
                    j = 0;
                    _a.label = 4;
                case 4:
                    if (!(j < 7)) return [3 /*break*/, 7];
                    if (!(Math.random() <= 0.50)) return [3 /*break*/, 6];
                    imagePath_1 = getRandomImageFromUploads();
                    imageFileStream_1 = fs.createReadStream(imagePath_1);
                    form_1 = new form_data_1.default();
                    form_1.append('thumbnail', imageFileStream_1, { filename: 'images.jpg', contentType: 'image/jpg' });
                    return [4 /*yield*/, axios_1.default.post("".concat(API_BASE_URL_PROFILE, "/photo"), form_1, {
                            headers: {
                                'Authorization': "Bearer ".concat(userResponse.data.value.token),
                            }
                        })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    j++;
                    return [3 /*break*/, 4];
                case 7:
                    if (!(randomValue <= 0.67)) return [3 /*break*/, 9];
                    return [4 /*yield*/, axios_1.default.put("".concat(API_BASE_URL_PROFILE, "/gender-priority"), genderPriorityDto, {
                            headers: {
                                'Authorization': "Bearer ".concat(userResponse.data.value.token),
                            }
                        })];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: return [4 /*yield*/, axios_1.default.put("".concat(API_BASE_URL_PROFILE, "/age-range"), ageRangeDto, {
                        headers: {
                            'Authorization': "Bearer ".concat(userResponse.data.value.token),
                        }
                    })];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, axios_1.default.put("".concat(API_BASE_URL_PROFILE, "/max-distance"), maxDistanceDto, {
                            headers: {
                                'Authorization': "Bearer ".concat(userResponse.data.value.token),
                            }
                        })];
                case 11:
                    _a.sent();
                    return [3 /*break*/, 13];
                case 12:
                    error_1 = _a.sent();
                    console.error('Error al crear usuario y perfil:', error_1);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
// async function likeUser() {
//     try {
//         const emailsFilePath = 'C:/Users/migue/Desktop/UniMatchApi/dist/emails.json';  
//         const fileContent = fs.readFileSync(emailsFilePath, 'utf8'); 
//         const emailsJson = JSON.parse(fileContent);  
//         const emails = emailsJson.emails;  
//         for(let i = 0; i < emails.length; i++) {
//             const email = emails[i];
//             const loginForm = {
//                 email,
//                 password: "Password24?",
//             };
//             const loginResponse = await axios.post<UserResponse>(`${API_BASE_URL_PROFILE}/auth/login`, loginForm);
//             const userId = loginResponse.data.value.user.id;
//             const token = loginResponse.data.value.token;
//             const limit = 15;
//             const potentialMatchesResponse = await axios.get<PotentialMathcesResponse>(`${API_BASE_URL_MATCH}/potential-matches/${limit}`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 }
//             });
//             console.log(`Matches potenciales para ${userId}:`, potentialMatchesResponse.data.value);
//             for(let j = 0; j < potentialMatchesResponse.data.value.length; j++) {
//                 const otherUserId = potentialMatchesResponse.data.value[j];
//                 console.log(`Like entre ${userId} y ${otherUserId}`);
//                 const form = {
//                     userId : otherUserId,
//                 };
//                 if(Math.random() <= 0.70) {
//                     const response = await axios.post(`${API_BASE_URL_MATCH}/like/${otherUserId}`, form, {
//                         headers: {
//                             'Authorization': `Bearer ${token}`,
//                         }
//                     });
//                 }
//                 // else {
//                 //     const response = await axios.post(`${API_BASE_URL_MATCH}/dislike/${otherUserId}`, form, {
//                 //         headers: {
//                 //             'Authorization': `Bearer ${token}`,
//                 //         }
//                 //     });
//                 // }
//             }
//         }
//     } catch (error) {
//         console.error('Error al hacer la solicitud de like:', error);
//     }
// }
// async function createMessages() {
//     const emailsFilePath = 'C:/Users/migue/Desktop/UniMatchApi/dist/emails.json';  
//     const fileContent = fs.readFileSync(emailsFilePath, 'utf8'); 
//     const emailsJson = JSON.parse(fileContent);  
//     const emails = emailsJson.emails;  
//     console.log('Correos electrónicos cargados:', emails);
//     try {
//         for(let i = 0; i < emails.length; i++) {
//             const email = emails[i];
//             const loginForm = {
//                 email,
//                 password: "Password24?",
//             };
//             const loginResponse = await axios.post<UserResponse>(`${API_BASE_URL_PROFILE}/auth/login`, loginForm);
//             const userId = loginResponse.data.value.user.id;
//             const token = loginResponse.data.value.token;
//             const limit = 10;
//             const mutualMatchesResponse = await axios.get<PotentialMathcesResponse>(`${API_BASE_URL_MATCH}/mutual-likes`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 }
//             });
//             console.log(`Matches mutuos para ${userId}:`, mutualMatchesResponse.data.value);
//             for(let j = 0; j < mutualMatchesResponse.data.value.length; j++) {
//                 const otherUserId = mutualMatchesResponse.data.value[j];
//                 console.log(`Mensaje entre ${userId} y ${otherUserId}`);
//                 const message: CreateNewMessageDTO = {
//                     content: faker.lorem.sentence(),
//                     senderId: userId,
//                     recipientId: otherUserId,
//                 };
//                 const response = await axios.post(`${API_BASE_URL_MESSAGES}`, message, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                     }
//                 });
//             }
//         }
//     } catch (error) {
//         console.error('Error al enviar mensaje:', error);
//     }
// }
// async function createData() {
//     for (let i = 0; i < 60; i++) {
//         await createRandomUserAndProfile();
//     }
//     saveEmailsToFile();
//     console.log("Usuarios creados correctamente: ", emails); 
//     await likeUser();
//     console.log("Usuarios han hecho like correctamente");
//     createMessages();
// }
// createData();
