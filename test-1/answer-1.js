/**
 * Created with JetBrains PhpStorm.
 * User: dmitrij
 * Date: 02.09.12
 * Time: 3:06
 * answer on 1
 */
/**
 * Создает экземпляр Машины
 * @this {Car}
 * @param {string} manufacturer Производитель
 * @param {string} model Модель
 * @param {number} year Год производство
 */
function Car(manufacturer, model, year) {
    this.manufacturer = manufacturer;
    this.model = model;
    this.year = year ? year : (new Date()).getFullYear();
}
/**
 * Возвращает информацию о машине
 * @this {Car}
 * @return {string} Информация о машине
 */
Car.prototype.getInfo = function () {
    return Array.prototype.join.call([this.manufacturer, this.model, this.year], ' ');
};
/**
 * Возвращает более детальную информацию о машине
 * @this {Car}
 * @return {string} Детальная информация о машине
 */
Car.prototype.getDetailedInfo = function () {
    return Array.prototype.join.call(['Производитель:', this.manufacturer, 'Модель:', this.model, 'Год:', this.year], ' ');
};
/**
 * Приведение к примитиву
 * @see {Car.getInfo}
 * @this {Car}
 * @return {string}
 */
Car.prototype.toString = function () {
    return this.getInfo();
};
/**
 * Возвращает страну-производитель данного автомобиля
 * @this {Car}
 * @return {string}
 */
Car.prototype.getCountry = function () {
    switch (this.manufacturer.toLowerCase()) {
        case 'bmw':
        case 'audi':
            return 'Germany';

        case 'toyota':
            return 'Japan';
    }
};




/**
 * Создает экземпляр Автосалона
 * @this {CarDealer}
 * @param {string} name Название автосалона
 */
function CarDealer(name) {

    this.name = name;

    this.cars = {};
}
/**
 * Добавление автомобиля в автосалон
 * @this {CarDealer}
 * @param {Car} car
 * @throws {TypeError}
 */
CarDealer.prototype.addCar = function (car) {

    if (false === (car instanceof Car)) {
        throw new TypeError("Error: Unable to add car.");
    }

    this.cars[car.getInfo()] = {
        car: car,
        price: null
    };
};
/**
 * Добавление автомобиля в автосалон. Метод может иметь множество параметров
 * @this {CarDealer}
 * @params {Car}
 * @return {CarDealer}
 */
CarDealer.prototype.add = function () {

    var cars, cIndex;

    cars = Array.prototype.slice.call(arguments);

    for (cIndex = 0; cIndex < cars.length; cIndex++) {
        this.addCar(cars[cIndex]);
    }

    return this;
};


/**
 * Установить цену на машину
 * @this {CarDealer}
 * @param {string} car идентификатор машины
 * @param {string} price стоимость
 * @return {CarDealer}
 * @throws {TypeError}
 */
CarDealer.prototype.setPrice = function (car, price) {

    if (undefined === this.cars[car]) {
        throw new Error("Car not found.");
    }

    this.cars[car].price = new Price(price);

    return this;
};
/**
 * Выводит список автомобилей по возможным заданным фильтрам
 * @this {CarDealer}
 * @params {Function[]} arguments
 */
CarDealer.prototype.list = function () {

    var cIndex,
        filters, fIndex, fStatus = true,
        filteredCars = [];

    filters = Array.prototype.slice.call(arguments);

    for (cIndex in this.cars) {
        if (0 < filters.length) {

            fStatus = true;

            for (fIndex = 0; fIndex < filters.length; fIndex++) {
                if (Object.prototype.toString.call(filters[fIndex]) === "[object Function]") {
                    if (false === filters[fIndex](this.cars[cIndex])) {
                        fStatus = false;
                        break;
                    }
                }
            }
        }

        if (true === fStatus) {
            Array.prototype.push.call(filteredCars, this.cars[cIndex].car);
        }
    }

    console.log(Array.prototype.join.call(filteredCars, ", "));
};
/**
 * Выводит список автомобилей по заданной стране
 * @this {CarDealer}
 * @param {string} countryName название страны
 */
CarDealer.prototype.listByCountry = function (countryName) {
    this.list(
        /**
         * Проверяет текущий автомобиль на принадлежность к заданной стране
         * @param {Object} carInfo
         * @param {Car} carInfo.car
         * @return {boolean}
         */
        function (carInfo) {
        if (carInfo.car.getCountry() === countryName) {
            return true;
        }
        return false;
    });
};
/**
 * Выводит информацию о машинах, имеющих цену в рублях
 * @this {CarDealer}
 * @param currencyName
 */
CarDealer.prototype.listByCurrency = function (currencyName) {
    this.list(
        /**
         * Проверяет валюту цены автомобиля на заданную
         * @param {Object} carInfo
         * @param {Car} carInfo.car
         * @param {Price} carInfo.price
         * @return {boolean}
         */
        function (carInfo) {
        if (carInfo.price.getCurrency() === currencyName) {
            return true;
        }
        return false;
    });
};

/**
 * Создает цену по строке значения
 * @this {Price}
 * @param {string} value текстовое обозначение цены вместе с валютой
 * @constructor
 */
function Price (value) {
    /**
     * Текстовое обозначение цены
     * @type {string}
     */
    this.rawValue = value ? value : "";
    /**
     * Значение цены
     * @type {number}
     */
    this.value    = null;
    /**
     * Значение валюты
     * @type {string}
     */
    this.currency = null;

    this.setPrice();
}
/**
 * Получение возможных валют
 * @this {Price}
 * @return {Array} массив валют
 * @private
 */
Price.prototype._getCurrencies = function () {
    return ["€", "¥", "Р"];
};
/**
 * Назначение цены по строке значения
 * @this {Price}
 * @param {string} value текстовое обозначение цены вместе с валютой
 * @throws {TypeError}
 */
Price.prototype.setPrice = function (value) {

    var reg, matches;

    this.rawValue = value ? value : this.rawValue;

    reg     = new RegExp("^(" + Array.prototype.join.call(this._getCurrencies(), "|") + ")([0-9]*)$", "g");

    matches = this.rawValue.split(reg);

    if (4 !== matches.length) {
        throw new TypeError("Price is incorrect");
    }

    this.currency = matches[1];

    this.value    = matches[2];

    if (isNaN(this.value) || Number(this.value) === NaN) {
        throw new Error("Price is not a number");
    }
};
/**
 * Возвращает цену
 * @this {Price}
 * @return {number} значение цены
 */
Price.prototype.getValue = function () {
    return this.value;
};
/**
 * Возвращает валюту
 * @this {Price}
 * @return {string} Валюта
 */
Price.prototype.getCurrency = function () {
    return this.currency;
};