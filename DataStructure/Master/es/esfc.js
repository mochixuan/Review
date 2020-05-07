// ES常用的方法集合
console.log(this)

let person = {};
let name;
Object.defineProperty(person, 'name', {
    get: function () {
        console.log('getter', name);
        return name;
    },
    set: function(data) {
        name = data;
        console.log('setter', name);
    }
})