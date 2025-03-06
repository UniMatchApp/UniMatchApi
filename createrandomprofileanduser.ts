import axios from 'axios';
import { fa, faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';

const API_BASE_URL_PROFILE = 'http://localhost:3000/api/v1/users'; 
const API_BASE_URL_MATCH = 'http://localhost:3000/api/v1/matching';
const API_BASE_URL_MESSAGES = 'http://localhost:3000/api/v1/messages';

interface CreateNewMessageDTO {
    content: string;
    senderId: string;
    recipientId: string;
    attachment?: File;
}

interface UserResponse {
    value: {
        user: {
            id: string;
            email: string;
            username: string;
        };
        token: string;
    };
}

interface PotentialMathcesResponse {
    value: string[]; // El arreglo de UUIDs está dentro de "value"
}

interface CreateNewProfileDTO {
    userId: string;
    name: string;
    age: number;
    aboutMe: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    gender: string;
    sexualOrientation: string;
    relationshipType: string;
    birthday: Date;
    attachment: any;
}

const emails: String[] = [];

function saveEmailsToFile() {
    const emailsJson = { emails: emails };  // Crear un objeto con los correos
    const filePath = 'C:/Users/migue/Desktop/UniMatchApi/dist/emails.json'  // La ruta donde guardar el archivo

    fs.writeFileSync(filePath, JSON.stringify(emailsJson, null, 2), 'utf8');
    console.log('Correos electrónicos guardados en emails.json');
}

function getRandomImageFromUploads(): string {
    const uploadsDirectory = path.resolve('C:/Users/migue/Desktop/UniMatchApi/dist/apps/RestApi/uploads/');
    const files = fs.readdirSync(uploadsDirectory);
    const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|gif)$/));
    const randomIndex = Math.floor(Math.random() * imageFiles.length);
    return path.join(uploadsDirectory, imageFiles[randomIndex]);
}

function generateULPGCEmail(): string {
    const username = faker.internet.userName().toLowerCase().replace(/[^a-z0-9]/g, ''); 
    emails.push(`${username}@alu.ulpgc.es`);
    return `${username}@alu.ulpgc.es`;
}

createRandomUserAndProfile() 
async function createRandomUserAndProfile() {
    try {

        const randomUser = {
            email: generateULPGCEmail(), 
            password: "Password24?",
        };

        const userResponse = await axios.post<UserResponse>(`${API_BASE_URL_PROFILE}`, randomUser);
        const user = userResponse.data.value.user;

        const imagePath = getRandomImageFromUploads()
        const imageFileStream = fs.createReadStream(imagePath); 

        const randomProfile: CreateNewProfileDTO = {
            userId: user.id,
            name: faker.name.firstName(),
            age: faker.number.int({ min: 19, max: 45 }),
            aboutMe: faker.lorem.sentence(),
            gender: faker.helpers.arrayElement(['MALE', 'FEMALE', 'OTHER']),
            sexualOrientation: faker.helpers.arrayElement(["HETEROSEXUAL", "HOMOSEXUAL", "BISEXUAL", "ASEXUAL", "OTHER"]),
            relationshipType: faker.helpers.arrayElement(["FRIENDSHIP", "CASUAL", "LONG_TERM", "OPEN", "OTHER"]),
            birthday: faker.date.past({ years: faker.number.int({ min: 18, max: 30 }) }),
            attachment: imageFileStream,
        };

        const form = new FormData();
        form.append('userId', randomProfile.userId);
        form.append('name', randomProfile.name);
        form.append('age', randomProfile.age);
        form.append('aboutMe', randomProfile.aboutMe);
        form.append('gender', randomProfile.gender);
        form.append('sexualOrientation', randomProfile.sexualOrientation);
        form.append('relationshipType', randomProfile.relationshipType);
        form.append('birthday', randomProfile.birthday.toISOString());
        form.append('thumbnail', imageFileStream, { filename: 'images.jpg', contentType: 'image/jpg' });

        const profileResponse = await axios.post(`${API_BASE_URL_PROFILE}/profile`, form, {
            headers: {
                'Authorization': `Bearer ${userResponse.data.value.token}`,
            }
        });


        const newGenderPriority = faker.helpers.arrayElement(['MALE', 'FEMALE', 'OTHER'])
        const newAgeRange = [faker.number.int({ min: 19, max: 30 }), faker.number.int({ min: 31, max: 45 })];
        const newMaxDistance = faker.number.int({ min: 0, max: 100 });

        const location = [
            {latitude: 28.0782, longitude: -15.4501}, 
            {latitude: 28.01, longitude: -15.41}, 
            {latitude: 28.04, longitude: -15.42}, 
            {latitude: 28.11, longitude: -15.53}
        ];

        const randomLocation = location[Math.floor(Math.random() * location.length)];

        const locationDto = { 
            latitude: randomLocation.latitude, 
            longitude: randomLocation.longitude 
        };

        const genderPriorityDto = { newContent: newGenderPriority };
        const ageRangeDto = {
            userId: userResponse.data.value.user.id,  
            min: newAgeRange[0],                      
            max: newAgeRange[1],                    
        };
        const maxDistanceDto = { newContent: newMaxDistance };

        const randomValue = Math.random();

        await axios.put(`${API_BASE_URL_PROFILE}/location`, locationDto, {
            headers: {
                'Authorization': `Bearer ${userResponse.data.value.token}`,
            }
        });


        for (let j = 0; j < 7; j++) {
            if(Math.random() <= 0.50) {
                const imagePath = getRandomImageFromUploads()
                const imageFileStream = fs.createReadStream(imagePath); 
                const form = new FormData();
                form.append('thumbnail', imageFileStream, { filename: 'images.jpg', contentType: 'image/jpg' });
                await axios.post(`${API_BASE_URL_PROFILE}/photo`, form, {
                    headers: {
                        'Authorization': `Bearer ${userResponse.data.value.token}`,
                    }
                });
            }
        }

        if (randomValue <= 0.67) {
            await axios.put(`${API_BASE_URL_PROFILE}/gender-priority`, genderPriorityDto, {
                headers: {
                    'Authorization': `Bearer ${userResponse.data.value.token}`,
                }
            });
        }

        await axios.put(`${API_BASE_URL_PROFILE}/age-range`, ageRangeDto, {
            headers: {
                'Authorization': `Bearer ${userResponse.data.value.token}`,
            }
        });

        await axios.put(`${API_BASE_URL_PROFILE}/max-distance`, maxDistanceDto, {
            headers: {
                'Authorization': `Bearer ${userResponse.data.value.token}`,
            }
        });

    } catch (error) {
        console.error('Error al crear usuario y perfil:', error);
    
    }
}