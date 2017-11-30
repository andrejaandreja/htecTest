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
        this.readyCars = [];
        this.raceNumb = 0;
        this.added = [];
        jsonService.getData(this, "json/data.json", null, this.prepareCarDivs);

        // postavljanje poruke za ispisivanje obavestenja
        this.textMsg = document.getElementById('msg');
    }

    // metoda za kreiranje divova omotaca, kao i za poziv ostalih funkcija za iscrtavanje automobila, polja pretrage i kanvasa
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


            // dodeljivanje event-a za pripremanje automobila za trku
            divFirst.onclick = function(){
                let id = caller.added.filter(function (x){ return x == data[i]["id"]; });

                // provera da li je automobil vec dodat i da li je postavljeno vise od tri automobila
                if(caller.raceNumb < 3 && id.length == 0) {
                    caller.readyCars.push(data[i]);
                    caller.readyCars[caller.raceNumb]["x"] = 80;

                    // kreiranje slike
                    let image = new Image();
                    image.src = data[i]["image"];

                    // poziv metode za iscrtavanje automobila
                    caller.draw(caller, caller.raceNumb, image);

                    caller.added.push(data[i]["id"]);
                    caller.raceNumb += 1;
                } else {
                    caller.textMsg.innerHTML = caller.raceNumb >= 3 ? "The race is ready to start!" : "Already added!";

                    // poziv funkcije za ispis poruke
                    caller.showMessage();
                }
            }
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
        const controlsDiv = document.createElement("div");
        const input = document.createElement("input");
        const button = document.createElement("button");
        const label = document.createElement("label");

        // dodeljivanje atributa
        containerDiv.className = "container";
        rowDiv.className = "row";
        canvasDiv.className = "canvas-wrapper";
        raceDiv.className = "race-div";
        controlsDiv.className = "col-md-6 pull-right";
        button.className = "btn btn-primary col-md-4 pull-right";
        button.innerHTML = "Start";
        input.className = "animation-speed col-md-7";
        input.placeholder = "Brzina animacije";
        label.className = "animation-speed-err col-md-12";

        // povezivanje kontrola
        mainDiv.appendChild(containerDiv);
        containerDiv.appendChild(rowDiv);
        rowDiv.appendChild(canvasDiv);
        canvasDiv.appendChild(raceDiv);
        rowDiv.appendChild(controlsDiv);
        controlsDiv.appendChild(input);
        controlsDiv.appendChild(button);
        controlsDiv.appendChild(label);

        let validation = true;
        // regex za brojeve
        var reg = /^\d+$/;
        // postavljanje validacije input polju
        input.onkeyup = function() {
            if(!reg.test(input.value) && input.value != "" || input.value == 0){
                label.innerHTML = "Animation speed can contains only numbers!";
                validation = false;
                input.value = "";
            }else{
                validation = true;
                label.innerHTML = "";
            }
        }

        // postavljanje funkcije dugmetu "Start"
        button.onclick = function() {
            if(input.value == "" || validation == false) {
                caller.textMsg.innerHTML = "Animation speed input is required!";
                caller.showMessage();
            } else if(caller.readyCars.length < 3){
                caller.textMsg.innerHTML = "Please prepare cars for race!";
                caller.showMessage();
            }
            else{
                caller.speedAnimation = input.value;
                caller.startRace(caller, input.value);
            }
        }

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
        this.renderTrafficLight(caller, context);
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

    // metoda za iscrtavanje semafora
    renderTrafficLight(caller, context){
        let center = caller.canvasHeight - caller.canvasHeightBefore;
        const trafficLight = [{color: "red", position: -25}, {color: "green", position: 10}];
        caller.trafficLights = caller.data["traffic_lights"];

        // postavljanje svih semafora
        for (let i = 0; i < caller.data["traffic_lights"].length; i++) {
            let position = +caller.data["traffic_lights"][i]["position"]/caller.onePix;

            //crtanje semafora
            context.beginPath();
            context.moveTo(position - 20, center - 50);
            context.lineTo(position + 20, center - 50);
            context.moveTo(position - 20, center + 50);
            context.lineTo(position + 20, center + 50);
            context.moveTo(position - 20, center - 50);
            context.lineTo(position - 20, center + 50);
            context.moveTo(position + 20, center - 50);
            context.lineTo(position + 20, center + 50);
            context.stroke();

            // iscrtavanje kruga
            context.beginPath();
            context.arc(position, center - 25, 15, 0, 2*Math.PI);
            context.fillStyle = "red";
            context.fill();
            context.stroke();

            context.beginPath();
            context.arc(position, center + 10, 15, 0, 2*Math.PI);
            context.stroke();

            // iscrtavanje isprekidane linije
            context.beginPath();
            context.setLineDash([5]);
            context.moveTo(position, caller.canvasHeightBefore);
            context.lineTo(position, center - 50);
            context.stroke();
            context.setLineDash([0]);

            let light = 1;
            setInterval( function() {
                let secondLight = trafficLight.length - 1 - light;

                // postavljanje pocetnog stanja semafora
                caller.data["traffic_lights"][i]["state"] = false;
                if(light == 1){
                    // ukoliko je light 1 onda se postavlja zeleno svetlo
                    caller.data["traffic_lights"][i]["state"] = true;
                }

                // postavljanje bele boje suprotnom
                context.beginPath();
                context.arc(position, center + trafficLight[secondLight].position, 15, 0, 2*Math.PI);
                context.fillStyle = "white";
                context.fill();
                context.stroke();

                // postavljanje crvene/zelene boje suprotnom
                context.beginPath();
                context.arc(position, center + trafficLight[light].position, 15, 0, 2*Math.PI);
                context.fillStyle = trafficLight[light].color;
                context.fill();
                context.stroke();

                // light promenljiva postaje druga vrednost semafora
                light = secondLight;
            }, caller.data["traffic_lights"][i]["duration"]);
        }
    }

    // metoda za iscrtavanje automobila u okviru kanvasa
    draw(caller, i, image) {
        let x = caller.readyCars[i]["x"]
        const imageY = (4 * i + 1) * (caller.canvasHeight - caller.canvasHeightAfter - caller.canvasHeightBefore) / 12 + caller.canvasHeightBefore;

        // brisanje samo u slucaju kada nisu ispunjeni sledeci uslovi
        let part = caller.parts.filter(function(y) { return y/caller.onePix == x-80})[0];
        if(part != undefined){
            caller.context.beginPath();
            caller.context.moveTo(part/caller.onePix, caller.canvasHeightBefore);
            caller.context.lineTo(part/caller.onePix, caller.lineHeight + caller.canvasHeightBefore);
            caller.context.stroke();
        }

        // ponovno iscrtavanje linija semafora, jer su prethodno obrisani pomeranjem automobila
        let lights = caller.data["traffic_lights"].filter(function(y) { return y["position"]/caller.onePix == x-80})[0];
        if(lights != undefined){
            let position = lights["position"]/caller.onePix;
            let center = caller.canvasHeight - caller.canvasHeightBefore;

            // iscrtavanje isprekidane linije
            caller.context.beginPath();
            caller.context.setLineDash([5]);
            caller.context.moveTo(position, caller.canvasHeightBefore);
            caller.context.lineTo(position, center - 50);
            caller.context.stroke();
            caller.context.setLineDash([0]);
        }

        // ponovno iscrtavanje linija znaka, jer su prethodno obrisani pomeranjem automobila
        let signs = caller.data["speed_limits"].filter(function(y) { return y["position"]/caller.onePix == x-80})[0];
        if(signs != undefined){
            let position = signs["position"]/caller.onePix;
            let center = caller.canvasHeight - caller.canvasHeightBefore;

            // iscrtavanje isprekidane linije
            caller.context.beginPath();
            caller.context.setLineDash([5]);
            caller.context.moveTo(position, caller.canvasHeightBefore);
            caller.context.lineTo(position, center - 50);
            caller.context.stroke();
            caller.context.setLineDash([0]);
        }

        let imageWidth = 75;
        let imageHeight = 70;

        caller.context.setTransform(1, 0, 0, 1, 0, 0);
        if(x > 1){
            caller.context.clearRect(x-1, imageY, 1, imageHeight);
            caller.context.save();
        }
        // pomeranje
        caller.context.translate(x, 0);
        caller.context.scale(-1,1);

        // iscrtavanje slike
        caller.context.drawImage(image, 0, imageY, imageWidth, imageHeight);
        caller.context.restore();

        // proverava da li su dosli do kraja
        if(x == caller.canvasWidth - 1) {
            let sticky = new Image();
            let stickyWidth = 92;
            let stickyHeight = 84;
            let stickyPosition = imageY - 14;
            let stickyY = caller.canvasWidth - 95;

            // ukoliko jesu, proverava ko je zavrsio trku i u zavisnosti od dodeljene pozicije se zna da li dobija zlatnu, srebrnu ili bronzanu
            let numb = caller.readyCars.filter(function (y) {
                return y["position"] == undefined;
            }).length;
            if (numb == 3) {
                caller.readyCars[i]["position"] = 1;
                sticky.src = "images/gold-medal.jpg";
                sticky.onload = function() {
                    caller.context.drawImage(sticky, stickyY, stickyPosition, stickyWidth, stickyHeight);
                };
            } else if (numb == 2) {
                caller.readyCars[i]["position"] = 2;
                sticky.src = "images/silver-medal.jpg";
                sticky.onload = function() {
                    caller.context.drawImage(sticky, stickyY, stickyPosition, stickyWidth, stickyHeight);
                };
            } else if (numb == 1) {
                caller.readyCars[i]["position"] = 3;
                sticky.src = "images/bronze-medal.jpg";
                sticky.onload = function() {
                    caller.context.drawImage(sticky, stickyY, stickyPosition, stickyWidth, stickyHeight);
                };
            }
        }



    }

    startRace(caller, speedAnimation) {
        caller.intervals = [];

        // prolazimo kroz niz dodatih automobila i postavljamo im funkcije za ponovno iscrtavanje i pomeranje
        for (let i = 0; i< caller.readyCars.length; i++){
            let speed = caller.readyCars[i]["speed"] * speedAnimation;
            /**
             * uzimamo distancu i delimo njom duzinu puta, kako bi izracunali koliko kilometara predstavlja 1px
             * a zatim delimo sa brzinom kojom se krece vozilo kako bi dobili vrednost u satima, a zatim mnozimo
             * sa 60 (minuta) i 60 (sekundi), kao i 1000 (ms), cime smo dobili vrednost u milisekundama
             * Math.round funkcija iskoriscena kako bi se zaokruzile vrednosti
             */
            let intervalRace = Math.round(caller.onePix/speed * 3600 * 1000);

            // kreiranje slike
            let image = new Image();
            image.src = caller.readyCars[i]["image"];

            // poziv metode setInterval koja izvrsava funkciju na svakih n (interval) milisekundi
            image.onload = function() {
                caller.intervals[i] = setInterval(function () {
                    caller.race(caller, i, image, speedAnimation, intervalRace);
                }, intervalRace);
            }
        }
    }

    // metoda koju pozivaju automobili tokom kretanja kroz kanvas
    race(caller, i, image, speedAnimation, intervalRace, intervalSL) {
        // povecavanje x koordinate za 1px
        caller.readyCars[i]["x"] += 1;

        // ponovno iscrtavanje automobila sa novom koordinatom
        if(caller.readyCars[i]["x"] < caller.canvasWidth) {
            caller.draw(caller, i, image);

            // uzimanje znaka na koji je vozilo naislo
            let speedLimit = caller.data["speed_limits"].filter(function(x){return x.position == caller.readyCars[i]["x"] * caller.onePix});

            // uzimanje semafora na koji je vozilo naislo
            let trafficLight = caller.data["traffic_lights"].filter(function(x){return x.position == caller.readyCars[i]["x"] * caller.onePix});

            // provera da li se na trenutnoj poziciji nalazi znak
            if(speedLimit.length > 0){
                // ukoliko se na toj poziciji nalazi znak, zaustavlja kretanje automobila sa trenutnom brzinom
                clearInterval(caller.intervals[i]);

                // izracunavanje brzine i intervala
                let speed = speedLimit[0]["speed"] * speedAnimation;
                intervalSL = Math.round(caller.onePix/speed * 3600 * 1000);
                // i ogranicava brzinu vozila u zavisnosti od znaka
                caller.intervals[i] = setInterval(function() {
                    caller.race(caller, i, image, speedAnimation, intervalRace, intervalSL);
                }, intervalSL);
            }

            // provera da li se na trenutnoj poziciji nalazi semafor caller.data["traffic_lights"][i]["state"]
            if (trafficLight.length > 0 && !trafficLight[0]["state"]){
                clearInterval(caller.intervals[i]);

                // proverava da li da prosledi interval od trke ili interval koji je nastao nakon znaka
                if(intervalSL == undefined){

                    // ukoliko se na toj poziciji nalazi semafor, zaustavlja vozilo i zadaje mu funkciju da izvrsava proveru na svakih 500 ms
                    let trafficInterval = setTimeout(function() {
                        caller.raceLight(caller, i, image, trafficLight, speedAnimation, intervalRace)
                    },500);
                }else{

                    // ukoliko se na toj poziciji nalazi semafor, zaustavlja vozilo i zadaje mu funkciju da izvrsava proveru na svakih 500 ms
                    let trafficInterval = setTimeout(function() {
                        caller.raceLight(caller, i, image, trafficLight, speedAnimation, intervalSL)
                    },500);
                }
            }

        }
    }

    raceLight(caller, i, image, trafficLight, speedAnimation, intervalLight){
        if(trafficLight[0]["state"]){
            caller.intervals[i] = setInterval(function() {
                caller.race(caller, i, image, speedAnimation, intervalLight);
            }, intervalLight);
        }else{
            setTimeout(function() {
                caller.raceLight(caller, i, image, trafficLight, speedAnimation, intervalLight)
            },500);
        }
    }

    showMessage(){
        // jquery metoda za prikaz poruke
        $('.modal-for-details')
            .slideDown('slow')
            .delay(1500)
            .slideUp('slow');
    }

}