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
        this.mainDiv = mainDiv;
        jsonService.getData(this, "json/data.json", null, this.prepareCarDivs);
    }

    prepareCarDivs(caller, data){
        caller.data = data;
        // kreiranje divova
        const containerDiv = document.createElement("div");
        const rowDiv = document.createElement("div");
        const carsSearchDiv = document.createElement("div");
        const carsDiv = document.createElement("div");

        // dodeljivanje atributa
        containerDiv.className = "container";
        rowDiv.className = "row";
        carsSearchDiv.className = "search-control";

        // povezivanje kontrola
        caller.mainDiv.appendChild(containerDiv);
        containerDiv.appendChild(rowDiv);
        rowDiv.appendChild(carsSearchDiv);
        rowDiv.appendChild(carsDiv);
    }
}