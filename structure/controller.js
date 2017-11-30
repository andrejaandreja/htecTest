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

        // poziv funkcija za iscrtavanje automobila, polja pretrage i kanvasa
        caller.renderCars(caller, carsDiv, data["cars"]);
        caller.renderCarsSearch(caller, carsSearchDiv, carsDiv);
        caller.prepareCanvasDivs(caller, caller.mainDiv, data);
    }

    // metoda za iscrtavanje galerija automobila
    renderCars(caller, carsDiv, data, searchKey) {
        // brisanje sadrzaja controller div-a
        carsDiv.innerHTML = "";

        // provera da li postoji tekst pretrage, i ukoliko postoji primenjuje ga i filtrira prikaz automobila
        if (searchKey != undefined) {
            data = data.filter(function (x) {

                //stavlja mala slova, kako bi poredio sve
                return x.name.toLocaleLowerCase().includes(searchKey.toLocaleLowerCase());
            });
        }

        /**
         * helperDiv povezuje redove
         * kreira se red, koji sadrzi tri kolone, a nakon toga se opet kreira novi red
         * zato sto je upotrebljeno bootstrap-ovo postavljanje divova (red col-12, colona col-4)
         */
        const divHelper = document.createElement("div");
        let divRow = document.createElement("div");

        // broj koji odredjuje kada se kreira novi red
        let colNumber = 1;

        // broj do kog ce se postavljati donji deo bordera, ide po svim kolonoma, do poslednjeg reda
        let borderBottom = (data.length % 3 - 1)*3;

        // kreiranje i pozicioniranje automobila
        for (let i = 0; i < data.length; i++) {

            // kreiranje dece
            let divFirst = document.createElement("div");
            let divSecond = document.createElement("div");
            let divThird = document.createElement("div");
            let divImg = document.createElement('div');
            let divBackCaption = document.createElement('div');
            let img = document.createElement("img");
            let a = document.createElement("a");
            let title = document.createElement("h3");
            let textDescription = document.createElement("p");
            let textSpeed = document.createElement("p");

            // kreiranje divovi za prikaz zadnje strane prilikom mouseHover-a preko slika
            let divFlipContainer = document.createElement('div');
            let divFlipper = document.createElement('div');
            let divFront = document.createElement('div');
            let divBack = document.createElement('div');

            // postavljanje atributa
            divRow.className = "row-fluid col-md-12 inside-border";
            divFirst.className = "col-md-4";
            divSecond.className = "thumbnail thumbnail-custom";
            divThird.className = "caption";
            divFlipContainer.className = "flip-container";
            divFlipper.className = "flipper";
            divFront.className = "front";
            divBack.className = "back";
            divBackCaption.className = "back-caption";
            img.src = data[i]["image"];
            title.className = "title";
            //postavljanje bordera
            if (colNumber % 3 != 0) {
                divFirst.className += " border-right";
            }
            if(colNumber <= borderBottom){
                divFirst.className += " border-bottom";
            }
            // postavljanje vrednosti
            title.innerHTML = data[i]["name"];
            textDescription.innerHTML = data[i]["description"];
            textSpeed.innerHTML = "Speed: " +  data[i]["speed"];

            // povezivanje kontrola
            carsDiv.appendChild(divHelper);
            divHelper.appendChild(divRow);
            divRow.appendChild(divFirst);
            divFirst.appendChild(divSecond);
            divSecond.appendChild(divFlipContainer);
            divThird.appendChild(title);
            divImg.appendChild(a);
            a.appendChild(img);

            divFlipContainer.appendChild(divFlipper);
            divFlipper.appendChild(divImg);
            divFlipper.appendChild(divFront);
            divFlipper.appendChild(divBack);
            divFront.appendChild(divThird);
            divBack.appendChild(divBackCaption);

            divBackCaption.appendChild(textDescription);
            divBackCaption.appendChild(textSpeed);

            // provera da li je red popunjen, ukoliko jeste kreira se novi
            if (colNumber % 3 == 0) {
                divRow = document.createElement("div");
            }
            colNumber++;
        }
    }

    // metoda za iscrtavanje polja pretrage
    renderCarsSearch(caller, carsSearchDiv, carsDiv) {
        // kreiranje kontrola
        const input = document.createElement('input');

        // postavljanje atributa
        input.className = "form-control";
        input.setAttribute('placeholder', 'Search');

        // pamcenje vrednosti this, jer se u funkciji dom elementa this referencira na dom objekat
        const controller = this;

        // dodeljivanje funkcije inputu za ponovno isrtavanje automobila na osnovu unetih podataka
        input.onkeyup = function () {

            // poziv fukcije za ponovno isrctavanje i prosledjivanje parametara ukljucujuci i vrednost input polja
            controller.renderCars(caller, carsDiv, controller.data["cars"], this.value);
        }

        // povezivanje kontrola
        carsSearchDiv.appendChild(input);
    }

    // metoda za iscrtavanje okvira canvas divova ostalih child komponenata
    prepareCanvasDivs(caller, mainDiv, data){
        // kreiranje divova
        const containerDiv = document.createElement("div");
        const rowDiv = document.createElement("div");
        const canvasDiv = document.createElement("div");
        const raceDiv = document.createElement("div");

        // dodeljivanje atributa
        containerDiv.className = "container";
        rowDiv.className = "row";
        canvasDiv.className = "canvas-wrapper";
        raceDiv.className = "race-div";

        // povezivanje kontrola
        mainDiv.appendChild(containerDiv);
        containerDiv.appendChild(rowDiv);
        rowDiv.appendChild(canvasDiv);
        canvasDiv.appendChild(raceDiv);

        this.renderCanvasDiv(caller, raceDiv, data);
    }

    // metoda za iscrtavanje kanvasa
    renderCanvasDiv(caller, raceDiv, data) {
        const distance = data["distance"];

        // kreiranje kanvasa
        const canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        caller.canvas = canvas;
        caller.context = context;

        // postsavljanje atributa
        const canvasHeight = 600;
        const canvasWidth = 1000;
        canvas.setAttribute('width', canvasWidth);
        canvas.setAttribute('height', canvasHeight);
        canvas.className = "canvas";

        // dodeljivanje vrednosti pre i posle kanvasa, za header deo sa vrednostima na skali, kao i footer deo za znakove i semafor
        const canvasHeightBefore = 100;
        const canvasHeightAfter = 200;

        // vezivanje vrednosti za objekat, kako bi bile pozvane u drugoj metodi
        caller.canvasHeight = canvasHeight;
        caller.canvasWidth = canvasWidth;
        caller.canvasHeightBefore = canvasHeightBefore;
        caller.canvasHeightAfter = canvasHeightAfter;

        // dodavanje kanvasa u raceDiv
        raceDiv.appendChild(canvas);
        caller.partNumb = 10;
        const part = canvasWidth / caller.partNumb;
        caller.lineHeight = 300;
        let numb = 0;
        caller.parts = [];

        // deljenje kanvasa po kolonama
        for (let i = 0; i <= canvasWidth; i+= part){
            let distancePart = distance * i / canvasWidth;

            // pamcenje pozicija delova, kako bi se kasnije izbeglo njihovo brisanje
            caller.parts.push(distancePart);

            context.beginPath();
            context.moveTo(i, canvasHeightBefore);
            context.lineTo(i, caller.lineHeight + canvasHeightBefore);
            context.stroke();

            // iscrtavanje teksta
            context.font = "20px Georgia";
            if(numb > 0 && numb < caller.partNumb) {
                context.fillText(distancePart, i - 7, 75);
            }
            numb += 1;
        }

        // deljenje kanvasa po redovima
        for (let i = 0; i <= caller.lineHeight; i+=part){
            context.beginPath();
            context.moveTo(0, caller.lineHeight-i + canvasHeightBefore);
            context.lineTo(canvasWidth, caller.lineHeight-i + canvasHeightBefore);
            context.stroke();
        }


        // postavljanje vrednosti jednog piksela
        caller.onePix = +caller.data["distance"] / caller.canvasWidth;

        // poziv funckija za iscrtavanje znakova i semafora
        this.renderTrafficSign(caller, context);

    }


    // metoda za iscrtavanje znakova
    renderTrafficSign(caller, context){
        let center = caller.canvasHeight - caller.canvasHeightBefore;
        // postavljanje svih znakova
        for (let i = 0; i < caller.data["speed_limits"].length; i++){
            let position = +caller.data["speed_limits"][i]["position"]/caller.onePix;

            // iscrtavanje kruga
            context.beginPath();
            context.arc(position, center, 50, 0, 2*Math.PI);
            context.arc(position, center, 40, 0, 2*Math.PI);
            context.stroke();

            // iscrtavanje teksta
            context.font = "60px Georgia";
            context.fillText(caller.data["speed_limits"][i]["speed"], position - 35, center + 20);

            // iscrtavanje isprekidane linije
            context.beginPath();
            context.setLineDash([5]);
            context.moveTo(position, caller.canvasHeightBefore);
            context.lineTo(position, center - 50);
            context.stroke();
            context.setLineDash([0]);
        }
    }


}