import {PrismaClient} from '@prisma/client'
export * from '@prisma/client'

const prisma = new PrismaClient()


export async function get_users() {
    return await prisma.user.findMany();
    
    // return [
    //     { id: 1, name: 'Alice' },
    //     { id: 2, name: 'Bob' },
    //     { id: 3, name: 'Charlie' }
    // ]
}
