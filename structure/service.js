/**
 * servis za rad sa json-om
 */
class JSONService {

    // metoda za ucitavanje json podataka
    getData(caller, url, parameters, successFunction, errorFunction) {
        try{
            let request = new XMLHttpRequest();
            request.onload = function () {
                successFunction(caller, JSON.parse(request.responseText));
            };
            request.onerror = function () {
                errorFunction(caller, JSON.parse(request.responseText));
            };
            request.open("get", url, true);
            request.setRequestHeader('Access-Control-Allow-Origin', "");
            request.setRequestHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            request.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
            if (parameters != null)
                request.send(parameters);
            else
                request.send();
        }catch (err) {

        }
    }

    // metoda za upisivanje i menjanje podataka u json
    postData(caller, url, parameters, successFunction, errorFunction){
        try{
            let request = new XMLHttpRequest();
            request.onload = function () {
                successFunction(caller, JSON.parse(request.responseText));
            };
            request.onerror = function () {
                errorFunction(caller, JSON.parse(request.responseText));
            };
            request.open("post", url, true);
            request.setRequestHeader('Access-Control-Allow-Origin', "");
            request.setRequestHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            request.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

            request.setRequestHeader("Accept", "application/json");
            request.setRequestHeader("Content-Type", "application/json");
            request.send(parameters);
        }catch (err) {

        }
    }
}

// kontent svih servisa
const serviceClasses = {
    JSONService
}

/**
 * fabrika za kreiranje potrebnih servisa
 */
class ServiceFactory {
    // naziv klase potreban za kreiranje kao i njeni ulazni parametri
    constructor(className, parameters) {
        return new serviceClasses[className](parameters);
    }
}
