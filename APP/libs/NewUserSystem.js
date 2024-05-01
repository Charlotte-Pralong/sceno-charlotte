class UsersSystem {
  constructor() {
    this.list = [];
  }

  add(user) {
    this.list.push(user);
  }

  clear() {
    this.list.forEach((user) => user.destroy());
    this.list = [];
  }

  verifyNewId(obj) {
    let output = null;
    Object.keys(obj).forEach((id) => {
      //   find the first id that is not in the list and return it
      if (!this.list.find((user) => user.id === id)) {
        output = id;
        return;
      }
    });
    return output;
  }

  removeUser(path) {
    const id = path.split("/").pop();
    const removedIndex = this.list.findIndex((user) => user.id === id);
    if (removedIndex === -1) return;
    const removedUser = this.list[removedIndex];
    removedUser.destroy();
    this.list.splice(removedIndex, 1);
  }

  // followGyro(data) {
  //   let user = this.list.find((user) => user.id === data.id);
  //   if (!user) {
  //     user = this.list[0];
  //   }
  //   user.pos.y += data.y;
  // }
}

export default new UsersSystem();
