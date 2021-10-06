function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


export function UserMap(){
    let data = []

    this.getUser = (user) => {
        return data.find(user_item => user_item.id === user.id)
    }

    this.create = (user, now) => {
        const getUser = this.getUser(user.id)
        if (!getUser) {
            data.push({...{...user, color:getRandomColor() }, lastUpdate: now })
        }
    }

    this.removeUser = (user) => {
        data = data.filter(user_item => user_item.id !== user.id)
    }

    this.getData = ()=>{
        return data
    }

}
