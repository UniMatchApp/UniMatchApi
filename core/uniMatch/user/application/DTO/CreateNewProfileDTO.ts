export interface CreateNewProfileDTO {
    userId: string;                      // ID del usuario
    name: string;                        // Nombre del perfil
    age: number;                         // Edad del perfil
    aboutMe: string;                     // Descripción breve del usuario
    location?: {
        latitude: number;
        longitude: number;
    };                                   // Ubicación del perfil
    gender: string;                      // Género del perfil
    sexualOrientation: string;           // Orientación sexual del perfil
    relationshipType: string;            // Tipo de relación que busca
    birthday: Date;                      // Fecha de nacimiento
    attachment: File;                    // Imagen preferida del perfil (File en vez de URL)
}
