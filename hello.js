function User(name) {
    if (!(this instanceof User)) {
        return new User(name)
    }
    this.name = name
}


const user1 = new User('User1')
const user2 = User('User2')

console.log(user1)
console.log(user2)