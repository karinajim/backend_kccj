import bcript from 'bcryptjs';
<<<<<<< HEAD
import bcrypt from 'bcryptjs/umd/types';


class Utils {
    prisma: any;
=======


class Utils {
>>>>>>> ec34b322d6b3300016a9e40849714e5762e63fd4


    public async hashPassword(password: string): Promise<string> {
        const salt = await bcript.genSaltSync(10);
        return await bcript.hashSync(password, salt);
    }


    public async checkPassword(password: string, encryptedPassword: string): Promise<boolean> {
        return await bcript.compareSync(password, encryptedPassword);
    }

<<<<<<< HEAD
=======

>>>>>>> ec34b322d6b3300016a9e40849714e5762e63fd4
}


export const utils = new Utils();