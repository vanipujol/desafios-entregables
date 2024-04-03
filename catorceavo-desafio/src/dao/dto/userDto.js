export class GetUserDTO{
    constructor(user) {
        this.full_name = `${user.first_name} ${user.last_name}`;
        this.email = `${user.email}`;
        this.age = `${user.age}`;
        this.role = `${user.role}`;
        this.cart = `${user.cart._id}`;
    }
}