/* ==========================================================================
   Локальный демонстрационный источник данных: flights.js
   Информационная система аэропорта «Северный»
   ========================================================================== */

// ==========================================================================
// 1. БАЗОВЫЙ АЭРОПОРТ И ГЕОГРАФИЧЕСКИЕ КООРДИНАТЫ ГОРОДОВ
// ==========================================================================
const BASE_AIRPORT = {
    name: "Северный",
    city: "Москва (Базовый хаб)",
    lat: 55.7558,
    lon: 37.6173
};

// Координаты городов (для расчета расстояний и построения карты полета)
const CITIES_COORDINATES = {
    "Москва": { lat: 55.7558, lon: 37.6173 },
    "Санкт-Петербург": { lat: 59.9343, lon: 30.3351 },
    "Сочи": { lat: 43.5855, lon: 39.7231 },
    "Казань": { lat: 55.7963, lon: 49.1088 },
    "Екатеринбург": { lat: 56.8389, lon: 60.6057 },
    "Новосибирск": { lat: 55.0084, lon: 82.9357 },
    "Владивосток": { lat: 43.1198, lon: 131.8869 },
    "Калининград": { lat: 54.7104, lon: 20.4522 },
    "Самара": { lat: 53.1959, lon: 50.1002 },
    "Уфа": { lat: 54.7388, lon: 55.9721 },
    "Минеральные Воды": { lat: 44.2104, lon: 43.1352 },
    "Красноярск": { lat: 56.0153, lon: 92.8932 },
    "Тюмень": { lat: 57.1530, lon: 65.5343 },
    "Омск": { lat: 54.9885, lon: 73.3242 }
};

// ==========================================================================
// 2. ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ О ВЫЛЕТАЮЩИХ РЕЙСАХ
// ==========================================================================
let DEPARTURES_DATA = [
    {
        flightNumber: "SU-1120",
        airline: "Аэрофлот",
        destination: "Сочи",
        scheduledTime: "14:15",
        actualTime: "14:15",
        checkinDesks: "21-24",
        gate: "A03",
        status: "Регистрация",
        delayReason: ""
    },
    {
        flightNumber: "S7-2048",
        airline: "S7 Airlines",
        destination: "Санкт-Петербург",
        scheduledTime: "14:30",
        actualTime: "14:30",
        checkinDesks: "12-14",
        gate: "B12",
        status: "Посадка",
        delayReason: ""
    },
    {
        flightNumber: "DP-684",
        airline: "Победа",
        destination: "Казань",
        scheduledTime: "14:45",
        actualTime: "15:45",
        checkinDesks: "05-08",
        gate: "A07",
        status: "Задержан",
        delayReason: "Неблагоприятные погодные условия в аэропорту назначения"
    },
    {
        flightNumber: "U6-174",
        airline: "Уральские авиалинии",
        destination: "Екатеринбург",
        scheduledTime: "15:00",
        actualTime: "15:00",
        checkinDesks: "15-18",
        gate: "B04",
        status: "По расписанию",
        delayReason: ""
    },
    {
        flightNumber: "SU-1276",
        airline: "Аэрофлот",
        destination: "Новосибирск",
        scheduledTime: "15:15",
        actualTime: "15:15",
        checkinDesks: "25-28",
        gate: "A04",
        status: "Регистрация",
        delayReason: ""
    },
    {
        flightNumber: "A4-5020",
        airline: "Азимут",
        destination: "Минеральные Воды",
        scheduledTime: "15:30",
        actualTime: "15:30",
        checkinDesks: "01-04",
        gate: "C02",
        status: "По расписанию",
        delayReason: ""
    },
    {
        flightNumber: "5N-519",
        airline: "Smartavia",
        destination: "Калининград",
        scheduledTime: "15:40",
        actualTime: "15:40",
        checkinDesks: "09-11",
        gate: "B08",
        status: "Регистрация завершена",
        delayReason: ""
    },
    {
        flightNumber: "UT-379",
        airline: "Utair",
        destination: "Самара",
        scheduledTime: "16:00",
        actualTime: "16:00",
        checkinDesks: "19-20",
        gate: "B06",
        status: "По расписанию",
        delayReason: ""
    },
    {
        flightNumber: "N4-245",
        airline: "Nordwind Airlines",
        destination: "Красноярск",
        scheduledTime: "16:20",
        actualTime: "16:20",
        checkinDesks: "31-34",
        gate: "C08",
        status: "По расписанию",
        delayReason: ""
    },
    {
        flightNumber: "FV-6312",
        airline: "Россия",
        destination: "Тюмень",
        scheduledTime: "13:40",
        actualTime: "13:45",
        checkinDesks: "10-12",
        gate: "A01",
        status: "Вылетел",
        delayReason: ""
    },
    {
        flightNumber: "DP-412",
        airline: "Победа",
        destination: "Уфа",
        scheduledTime: "16:50",
        actualTime: "17:30",
        checkinDesks: "06-08",
        gate: "B10",
        status: "Задержан",
        delayReason: "Техническая подготовка воздушного судна"
    },
    {
        flightNumber: "WZ-448",
        airline: "Red Wings",
        destination: "Омск",
        scheduledTime: "17:15",
        actualTime: "—",
        checkinDesks: "—",
        gate: "—",
        status: "Отменён",
        delayReason: "Коммерческое решение авиакомпании"
    }
];

// ==========================================================================
// 3. ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ О ПРИБЫВАЮЩИХ РЕЙСАХ
// ==========================================================================
let ARRIVALS_DATA = [
    {
        flightNumber: "SU-1420",
        airline: "Аэрофлот",
        origin: "Санкт-Петербург",
        scheduledTime: "13:20",
        actualTime: "13:20",
        status: "Выдача багажа",
        baggageBelt: "Лента №2",
        delayReason: ""
    },
    {
        flightNumber: "S7-2044",
        airline: "S7 Airlines",
        origin: "Сочи",
        scheduledTime: "13:35",
        actualTime: "14:15",
        status: "Задерживается",
        baggageBelt: "—",
        delayReason: "Позднее прибытие воздушного судна из предыдущего рейса"
    },
    {
        flightNumber: "DP-284",
        airline: "Победа",
        origin: "Казань",
        scheduledTime: "13:50",
        actualTime: "13:50",
        status: "Приземлился",
        baggageBelt: "Лента №1",
        delayReason: ""
    },
    {
        flightNumber: "U6-262",
        airline: "Уральские авиалинии",
        origin: "Екатеринбург",
        scheduledTime: "14:05",
        actualTime: "14:05",
        status: "По расписанию",
        baggageBelt: "—",
        delayReason: ""
    },
    {
        flightNumber: "S7-5012",
        airline: "S7 Airlines",
        origin: "Новосибирск",
        scheduledTime: "14:15",
        actualTime: "14:15",
        status: "По расписанию",
        baggageBelt: "—",
        delayReason: ""
    },
    {
        flightNumber: "SU-1701",
        airline: "Аэрофлот",
        origin: "Владивосток",
        scheduledTime: "14:30",
        actualTime: "15:10",
        status: "Задерживается",
        baggageBelt: "—",
        delayReason: "Встречный сильный эшелонный ветер по маршруту"
    },
    {
        flightNumber: "5N-512",
        airline: "Smartavia",
        origin: "Калининград",
        scheduledTime: "14:45",
        actualTime: "—",
        status: "Отменён",
        baggageBelt: "—",
        delayReason: "Сложные метеоусловия в аэропорту вылета"
    },
    {
        flightNumber: "UT-380",
        airline: "Utair",
        origin: "Самара",
        scheduledTime: "15:00",
        actualTime: "15:00",
        status: "По расписанию",
        baggageBelt: "—",
        delayReason: ""
    },
    {
        flightNumber: "DP-438",
        airline: "Победа",
        origin: "Уфа",
        scheduledTime: "15:20",
        actualTime: "15:20",
        status: "По расписанию",
        baggageBelt: "—",
        delayReason: ""
    },
    {
        flightNumber: "A4-6014",
        airline: "Азимут",
        origin: "Минеральные Воды",
        scheduledTime: "15:40",
        actualTime: "16:20",
        status: "Задерживается",
        baggageBelt: "—",
        delayReason: "Поздний вылет из пункта отправления"
    },
    {
        flightNumber: "N4-218",
        airline: "Nordwind Airlines",
        origin: "Красноярск",
        scheduledTime: "12:50",
        actualTime: "12:45",
        status: "Завершён",
        baggageBelt: "Лента №4",
        delayReason: ""
    },
    {
        flightNumber: "SU-1190",
        airline: "Аэрофлот",
        origin: "Тюмень",
        scheduledTime: "13:10",
        actualTime: "13:10",
        status: "Выдача багажа",
        baggageBelt: "Лента №3",
        delayReason: ""
    }
];

// ==========================================================================
// 4. ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ О СОБЫТИЯХ АЭРОПОРТА
// ==========================================================================
let EVENTS_DATA = [
    {
        id: 1,
        time: "13:25:00",
        flightNumber: "SU-1190",
        type: "Выдача багажа",
        text: "Для рейса SU-1190 началась выдача багажа на ленте №3"
    },
    {
        id: 2,
        time: "13:20:00",
        flightNumber: "SU-1420",
        type: "Прибытие",
        text: "Рейс SU-1420 из Санкт-Петербурга прибыл по расписанию. Высадка пассажиров."
    },
    {
        id: 3,
        time: "13:15:00",
        flightNumber: "S7-2048",
        type: "Посадка",
        text: "Началась посадка на рейс S7-2048 в Санкт-Петербург, выход B12"
    },
    {
        id: 4,
        time: "13:05:00",
        flightNumber: "DP-684",
        type: "Задержка",
        text: "Рейс DP-684 в Казань задержан до 15:45. Причина: неблагоприятные погодные условия"
    },
    {
        id: 5,
        time: "13:00:00",
        flightNumber: "SU-1120",
        type: "Регистрация",
        text: "Началась регистрация на рейс SU-1120 в Сочи, стойки 21-24"
    },
    {
        id: 6,
        time: "12:50:00",
        flightNumber: "S7-2048",
        type: "Смена выхода",
        text: "Выход на посадку рейса S7-2048 изменен с B05 на B12"
    }
];

// ==========================================================================
// 5. ЦЕПОЧКИ ЖИЗНЕННЫХ ЦИКЛОВ СОСТОЯНИЙ РЕЙСОВ
// ==========================================================================
const DEPARTURE_STATE_CHAIN = [
    "По расписанию",
    "Регистрация",
    "Регистрация завершена",
    "Посадка",
    "Вылетел"
];

const ARRIVAL_STATE_CHAIN = [
    "По расписанию",
    "Приземлился",
    "Выдача багажа",
    "Завершён"
];
