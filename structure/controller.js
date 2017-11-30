/**
 * zaduzen za ucitavanje podataka, kao i prosledjivanje istih kontrolerima
 */
class Dispatcher {
    constructor(mainDiv) {
        const jsonService = new ServiceFactory('JSONService');
        const carController = new CarController(mainDiv, jsonService);
    }
}


/**
 * zaduzen za iscrtavanje galerije automobila kao i dodeljivanje funkcionalnosti
 */
class CarController {
    // deklarisanje potrebnih vrednosti i poziv funkcija za iscrtavanje kontrola
    constructor(mainDiv, jsonService) {

    }
}