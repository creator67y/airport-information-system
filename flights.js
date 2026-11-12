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
        flightNumber: "FV-6312",
        airline: "Россия",
        destination: "Тюмень",
        scheduledTime: "05:45",
        actualTime: "05:50",
        checkinDesks: "10-12",
        gate: "A01",
        status: "По расписанию",
        delayReason: ""
    },
    {
        flightNumber: "SU-1120",
        airline: "Аэрофлот",
        destination: "Сочи",
        scheduledTime: "07:15",
        actualTime: "07:15",
        checkinDesks: "21-24",
        gate: "A03",
        status: "Регистрация",
        delayReason: ""
    },
    {
        flightNumber: "S7-2048",
        airline: "S7 Airlines",
        destination: "Санкт-Петербург",
        scheduledTime: "08:30",
        actualTime: "08:30",
        checkinDesks: "12-14",
        gate: "B12",
        status: "По расписанию",
        delayReason: ""
    },
    {
        flightNumber: "DP-684",
        airline: "Победа",
        destination: "Казань",
        scheduledTime: "10:00",
        actualTime: "11:00",
        checkinDesks: "05-08",
        gate: "A07",
        status: "Задержан",
        delayReason: "Неблагоприятные погодные условия в аэропорту назначения"
    },
    {
        flightNumber: "U6-174",
        airline: "Уральские авиалинии",
        destination: "Екатеринбург",
        scheduledTime: "11:45",
        actualTime: "11:45",
        checkinDesks: "15-18",
        gate: "B04",
        status: "По расписанию",
        delayReason: ""
    },
    {
        flightNumber: "SU-1276",
        airline: "Аэрофлот",
        destination: "Новосибирск",
        scheduledTime: "13:20",
        actualTime: "13:20",
        checkinDesks: "25-28",
        gate: "A04",
        status: "По расписанию",
        delayReason: ""
    },
    {
        flightNumber: "A4-5020",
        airline: "Азимут",
        destination: "Минеральные Воды",
        scheduledTime: "15:00",
        actualTime: "15:00",
        checkinDesks: "01-04",
        gate: "C02",
        status: "По расписанию",
        delayReason: ""
    },
    {
        flightNumber: "5N-519",
        airline: "Smartavia",
        destination: "Калининград",
        scheduledTime: "17:30",
        actualTime: "17:30",
        checkinDesks: "09-11",
        gate: "B08",
        status: "По расписанию",
        delayReason: ""
    },
    {
        flightNumber: "UT-379",
        airline: "Utair",
        destination: "Самара",
        scheduledTime: "19:00",
        actualTime: "19:00",
        checkinDesks: "19-20",
        gate: "B06",
        status: "По расписанию",
        delayReason: ""
    },
    {
        flightNumber: "N4-245",
        airline: "Nordwind Airlines",
        destination: "Красноярск",
        scheduledTime: "21:15",
        actualTime: "21:15",
        checkinDesks: "31-34",
        gate: "C08",
        status: "По расписанию",
        delayReason: ""
    },
    {
        flightNumber: "DP-412",
        airline: "Победа",
        destination: "Уфа",
        scheduledTime: "23:10",
        actualTime: "23:50",
        checkinDesks: "06-08",
        gate: "B10",
        status: "Задержан",
        delayReason: "Техническая подготовка воздушного судна"
    },
    {
        flightNumber: "WZ-448",
        airline: "Red Wings",
        destination: "Омск",
        scheduledTime: "01:20",
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
        flightNumber: "N4-218",
        airline: "Nordwind Airlines",
        origin: "Красноярск",
        scheduledTime: "05:30",
        actualTime: "05:30",
        status: "По расписанию",
        baggageBelt: "Лента №4",
        delayReason: ""
    },
    {
        flightNumber: "SU-1190",
        airline: "Аэрофлот",
        origin: "Тюмень",
        scheduledTime: "06:45",
        actualTime: "06:45",
        status: "По расписанию",
        baggageBelt: "Лента №3",
        delayReason: ""
    },
    {
        flightNumber: "SU-1420",
        airline: "Аэрофлот",
        origin: "Санкт-Петербург",
        scheduledTime: "08:20",
        actualTime: "08:20",
        status: "По расписанию",
        baggageBelt: "Лента №2",
        delayReason: ""
    },
    {
        flightNumber: "S7-2044",
        airline: "S7 Airlines",
        origin: "Сочи",
        scheduledTime: "09:40",
        actualTime: "10:20",
        status: "Задерживается",
        baggageBelt: "—",
        delayReason: "Позднее прибытие воздушного судна из предыдущего рейса"
    },
    {
        flightNumber: "DP-284",
        airline: "Победа",
        origin: "Казань",
        scheduledTime: "11:15",
        actualTime: "11:15",
        status: "По расписанию",
        baggageBelt: "Лента №1",
        delayReason: ""
    },
    {
        flightNumber: "U6-262",
        airline: "Уральские авиалинии",
        origin: "Екатеринбург",
        scheduledTime: "12:50",
        actualTime: "12:50",
        status: "По расписанию",
        baggageBelt: "—",
        delayReason: ""
    },
    {
        flightNumber: "S7-5012",
        airline: "S7 Airlines",
        origin: "Новосибирск",
        scheduledTime: "14:30",
        actualTime: "14:30",
        status: "По расписанию",
        baggageBelt: "—",
        delayReason: ""
    },
    {
        flightNumber: "SU-1701",
        airline: "Аэрофлот",
        origin: "Владивосток",
        scheduledTime: "16:15",
        actualTime: "16:55",
        status: "Задерживается",
        baggageBelt: "—",
        delayReason: "Встречный сильный эшелонный ветер по маршруту"
    },
    {
        flightNumber: "UT-380",
        airline: "Utair",
        origin: "Самара",
        scheduledTime: "18:30",
        actualTime: "18:30",
        status: "По расписанию",
        baggageBelt: "—",
        delayReason: ""
    },
    {
        flightNumber: "DP-438",
        airline: "Победа",
        origin: "Уфа",
        scheduledTime: "20:15",
        actualTime: "20:15",
        status: "По расписанию",
        baggageBelt: "—",
        delayReason: ""
    },
    {
        flightNumber: "A4-6014",
        airline: "Азимут",
        origin: "Минеральные Воды",
        scheduledTime: "22:10",
        actualTime: "22:50",
        status: "Задерживается",
        baggageBelt: "—",
        delayReason: "Поздний вылет из пункта отправления"
    },
    {
        flightNumber: "5N-512",
        airline: "Smartavia",
        origin: "Калининград",
        scheduledTime: "00:50",
        actualTime: "—",
        status: "Отменён",
        baggageBelt: "—",
        delayReason: "Сложные метеоусловия в аэропорту вылета"
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

// ======================================================
// 6. ФОРМИРОВАНИЕ ВРЕМЕННЫХ МЕТОК РЕЙСОВ
// ======================================================

const AIRPORT_TIME_ZONE = "Europe/Moscow";

// Получаем сегодняшнюю дату по московскому времени
function getMoscowTodayParts() {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: AIRPORT_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const result = {};

    parts.forEach(part => {
        result[part.type] = part.value;
    });

    return result;
}

// Преобразуем время рейса в полноценную дату и время
function createMoscowDateTime(
    time,
    offsetMinutes = 0,
    dayOffset = 0
) {
    if (!time || time === "—") return null;

    const [hours, minutes] = time.split(":").map(Number);

    const { year, month, day } = getMoscowTodayParts();

    // Учитываем дату рейса и смещение времени
    const date = new Date(Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day) + dayOffset,
        hours,
        minutes + offsetMinutes
    ));

    const pad = value => String(value).padStart(2, "0");

    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:00+03:00`;
}
// Определяем день ночного рейса относительно текущего времени
function getFlightDayOffset(time) {
    const flightHour = Number(time.split(":")[0]);

    const currentParts = getMoscowTodayParts();
    const now = new Date();

    const currentTime = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Moscow",
        hour: "2-digit",
        hourCycle: "h23"
    }).format(now);

    const currentHour = Number(currentTime);

    // Вечером рейсы после полуночи относятся к следующим суткам
    if (flightHour < 4 && currentHour >= 18) {
        return 1;
    }

    return 0;
}
// Добавляем временные параметры для вылетов
DEPARTURES_DATA.forEach(flight => {

    flight.initialStatus = flight.status;
    flight.isDelayed = flight.status === "Задержан";
    flight.isCancelled = flight.status === "Отменён";

    // День рейса относительно сегодняшней даты
    const dayOffset = Number.isInteger(flight.dayOffset)
    ? flight.dayOffset
    : getFlightDayOffset(flight.scheduledTime);
    // Плановое время вылета
    flight.scheduledAt = createMoscowDateTime(
        flight.scheduledTime, 0, dayOffset
    );

    // Ожидаемое время вылета
    const expectedDepartureTime =
        flight.isDelayed && flight.actualTime !== "—"
            ? flight.actualTime
            : flight.scheduledTime;

    flight.expectedDepartureAt = createMoscowDateTime(
        expectedDepartureTime, 0, dayOffset
    );

    // Открытие регистрации за 2 часа до ожидаемого вылета
    flight.checkinOpenAt = createMoscowDateTime(
        expectedDepartureTime, -120, dayOffset
    );

    // Закрытие регистрации за 40 минут
    flight.checkinCloseAt = createMoscowDateTime(
        expectedDepartureTime, -40, dayOffset
    );

    // Начало посадки за 30 минут
    flight.boardingStartAt = createMoscowDateTime(
        expectedDepartureTime, -30, dayOffset
    );

    flight.actualDepartureAt = null;
});

// Добавляем временные параметры для прилётов
ARRIVALS_DATA.forEach(flight => {

    flight.initialStatus = flight.status;
    flight.isDelayed = flight.status === "Задерживается";
    flight.isCancelled = flight.status === "Отменён";

    // День рейса относительно сегодняшней даты
    const dayOffset = Number.isInteger(flight.dayOffset)
    ? flight.dayOffset
    : getFlightDayOffset(flight.scheduledTime);

    // Плановое время прибытия
    flight.scheduledAt = createMoscowDateTime(
        flight.scheduledTime, 0, dayOffset
    );

    // Учитываем задержку при расчёте ожидаемого прибытия
    const expectedTime =
        flight.isDelayed && flight.actualTime !== "—"
            ? flight.actualTime
            : flight.scheduledTime;

    flight.expectedArrivalAt = createMoscowDateTime(
        expectedTime, 0, dayOffset
    );

    // Фактическое прибытие будет фиксироваться автоматикой
    flight.actualArrivalAt = null;
});