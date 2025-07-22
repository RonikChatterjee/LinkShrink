import bcrypt from 'bcrypt'

async function hashPassword(password){
    const hash = await bcrypt.hash(password, 12)
    return hash
}

async function comparePassword(password, hashPassword){
    const match = await bcrypt.compare(password, hashPassword)
    return match
}

export { hashPassword, comparePassword }
