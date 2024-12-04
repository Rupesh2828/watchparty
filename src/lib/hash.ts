import bcrypt from "bcrypt";

export const hashPassword = async(password: string) => {
    //add return below
     return await bcrypt.hash(password, 10)
}

//for verify password

export const verifyPassword = async(password:string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword)
}