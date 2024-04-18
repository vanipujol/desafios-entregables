import {GetUserDTO} from "../dao/dto/userDto.js";
export class UsersRepository{
    constructor(dao) {
        this.dao = dao;
    }

    async getAll(){
        return await this.dao.getAllUsers();
    }

    async create(user){
        return await this.dao.saveUser(user);
    }

    async get(user){
        const {email} = user;

        const userInfo = await this.dao.getUser({email});

        return new GetUserDTO(userInfo);
    }

    async updateUser(id, user){
        return await this.dao.updateUser();
    }
}