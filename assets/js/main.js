class AA {
    constructor(name) {
        this.message = `Hello ${name}`;
    }

    show() {
        console.log(this.message);
    }
}

const aa = new AA("Bilal");

aa.show();