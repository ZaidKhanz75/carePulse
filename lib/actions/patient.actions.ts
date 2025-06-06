'use server';

import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { BUCKET_ID, DATABASE_ID, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, databases, storage,users } from "../appwrite.config";
import { InputFile } from "node-appwrite/file";

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(
            ID.unique(),       // Unique User ID
            user.email,        // Email Address
            user.phone,
            undefined,  // Default Password (Appwrite requires a password)
            user.name,         // User's Name
        );

        console.log({newUser});
        return parseStringify(newUser);
    } 
    catch (error: any) {
        if (error && error?.code === 409) {  // 409 = User already exists
            const existingUsers = await users.list([
                Query.equal("email", user.email) // ✅ Queries must be inside an array
              ]);       
            return existingUsers?.users?.[0];
        }
    }
};


export  const getUser = async (userId:string) =>{
    try {
        const user = await users.get(userId);
        return parseStringify(user);
    }
    catch (error) {
        console.log(error);
        }
}

export  const getPatient = async (userId:string) =>{
    try {
        const patients = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal('userId',userId)]
        );
        return parseStringify(patients.documents[0]);
    }
    catch (error) {
        console.log(error);
        }
}


export const registerPatient = async({identificationDocument, ...patient}:RegisterUserParams)=>{
    try {
        let file;

        if(identificationDocument){
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string,
            )

            file = await storage.createFile(BUCKET_ID!,ID.unique(), inputFile)
        }

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`, 
                ...patient
            }
        )
        return parseStringify(newPatient);
    } catch (error) {
        console.log(error)
    }
}


