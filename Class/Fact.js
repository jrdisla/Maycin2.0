export default class Fact {
    constructor(name,lastName,city, muni,addr,tienda,cedula, type,size,cant,logo,info,color,tiendaF,money){
        this.user = {
            "name": name,
            "lastName": lastName,
            "city": city,
            "muni": muni,
            "addr":addr,
            "tienda": tienda,
            "cedula": cedula
        };
        this.order = [{
            "type": type,
            "size": size,
            "cant": cant,
            "logo": logo,
            "info": info,
            "color": color,
            "tienda": tiendaF,
            "money": money
        }]
    }
}
