
// ==========================================================================
// РАЗДЕЛ 3: ССЫЛКИ НА ЭЛЕМЕНТЫ DOM
// ==========================================================================
// Часы и дата
const currentTimeEl = document.getElementById("currentTime");
const currentDateEl = document.getElementById("currentDate");

// Навигация
const navTabs = document.querySelectorAll(".nav-tab");
const tabContents = document.querySelectorAll(".tab-content");
const departuresCountBadge = document.getElementById("departuresCountBadge");
const arrivalsCountBadge = document.getElementById("arrivalsCountBadge");
const eventsCountBadge = document.getElementById("eventsCountBadge");

// Раздел «Вылеты»
const statDepTotal = document.getElementById("statDepTotal");
const statDepCheckin = document.getElementById("statDepCheckin");
const statDepBoarding = document.getElementById("statDepBoarding");
const statDepDelayed = document.getElementById("statDepDelayed");
const statDepDeparted = document.getElementById("statDepDeparted");
const statDepCancelled = document.getElementById("statDepCancelled");
const depSearchInput = document.getElementById("depSearchInput");
const depClearSearchBtn = document.getElementById("depClearSearchBtn");
const depStatusFilter = document.getElementById("depStatusFilter");
const depRefreshBtn = document.getElementById("depRefreshBtn");
const depLastUpdateTime = document.getElementById("depLastUpdateTime");
const depFlightsTable = document.getElementById("depFlightsTable");
const depFlightsTableBody = document.getElementById("depFlightsTableBody");
const depFlightsCardsContainer = document.getElementById("depFlightsCardsContainer");
const depNoResults = document.getElementById("depNoResults");

// Раздел «Прилёты»
const statArrTotal = document.getElementById("statArrTotal");
const statArrOnTime = document.getElementById("statArrOnTime");
const statArrLanded = document.getElementById("statArrLanded");
const statArrBaggage = document.getElementById("statArrBaggage");
const statArrDelayed = document.getElementById("statArrDelayed");
const statArrCancelled = document.getElementById("statArrCancelled");
const arrSearchInput = document.getElementById("arrSearchInput");
const arrClearSearchBtn = document.getElementById("arrClearSearchBtn");
const arrStatusFilter = document.getElementById("arrStatusFilter");
const arrRefreshBtn = document.getElementById("arrRefreshBtn");
const arrLastUpdateTime = document.getElementById("arrLastUpdateTime");
const arrFlightsTable = document.getElementById("arrFlightsTable");
const arrFlightsTableBody = document.getElementById("arrFlightsTableBody");
const arrFlightsCardsContainer = document.getElementById("arrFlightsCardsContainer");
const arrNoResults = document.getElementById("arrNoResults");

// Раздел «Найти рейс»
const globalSearchInput = document.getElementById("globalSearchInput");
const globalSearchBtn = document.getElementById("globalSearchBtn");
const searchResultsContainer = document.getElementById("searchResultsContainer");
const searchPlaceholder = document.getElementById("searchPlaceholder");
const quickTags = document.querySelectorAll(".quick-tag");
// Раздел «Карта полёта»
const flightMapSelect = document.getElementById("flightMapSelect");
const flightMapSummary = document.getElementById("flightMapSummary");
const flightMapCanvas = document.getElementById("flightMapCanvas");

// Раздел «Информация» (Лента)
const eventsTimeline = document.getElementById("eventsTimeline");
const eventCategoryFilter = document.getElementById("eventCategoryFilter");


// Всплывающее уведомление
const toastNotification = document.getElementById("toastNotification");

// ==========================================================================
// РАЗДЕЛ 4: ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================================================
function updateClock() {
    const now = new Date();

    // Получаем московское время
    const timeOptions = {
        timeZone: "Europe/Moscow",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
    };

    currentTimeEl.textContent = new Intl.DateTimeFormat(
        "ru-RU",
        timeOptions
    ).format(now);

    // Получаем московскую дату
    const dateOptions = {
        timeZone: "Europe/Moscow",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    const dateStr = new Intl.DateTimeFormat(
        "ru-RU",
        dateOptions
    ).format(now);

    currentDateEl.textContent =
        dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
}

function getCurrentTimeString() {
    return new Intl.DateTimeFormat("ru-RU", {
        timeZone: "Europe/Moscow",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
    }).format(new Date());
}
// Получение текущей даты по московскому времени
function getCurrentMoscowDateString() {
    return new Intl.DateTimeFormat("ru-RU", {
        timeZone: "Europe/Moscow",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(new Date());
}
// ======================================================
// СОХРАНЕНИЕ ДАННЫХ В LOCAL STORAGE
// ======================================================

// Получаем дату в московском часовом поясе
function getMoscowDateKey() {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Moscow",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());

    const values = {};

    parts.forEach(part => {
        values[part.type] = part.value;
    });

    return `${values.year}-${values.month}-${values.day}`;
}

// Отдельное хранилище для каждого дня
const AIRPORT_STORAGE_KEY =
    `airportNorthernData_${getMoscowDateKey()}`;


// Сохраняем данные аэропорта
function saveAirportData() {
    try {
        const airportData = {
            version: 1,
            serviceDate: getMoscowDateKey(),
            savedAt: new Date().toISOString(),

            departures: DEPARTURES_DATA,
            arrivals: ARRIVALS_DATA,
            events: EVENTS_DATA
        };

        localStorage.setItem(
            AIRPORT_STORAGE_KEY,
            JSON.stringify(airportData)
        );

    } catch (error) {
        console.error("Ошибка сохранения данных:", error);
    }
}


// Загружаем сохранённые данные
function loadAirportData() {
    try {
        const savedData = localStorage.getItem(
            AIRPORT_STORAGE_KEY
        );

        if (!savedData) {
            console.log("Сохранённых данных нет. Используются исходные данные.");
            return false;
        }

        const airportData = JSON.parse(savedData);

        // Проверяем структуру сохранённых данных
        if (
            airportData.version !== 1 ||
            airportData.serviceDate !== getMoscowDateKey() ||
            !Array.isArray(airportData.departures) ||
            !Array.isArray(airportData.arrivals) ||
            !Array.isArray(airportData.events)
        ) {
            console.warn("Сохранённые данные имеют неверный формат.");
            return false;
        }

        DEPARTURES_DATA = airportData.departures;
        ARRIVALS_DATA = airportData.arrivals;
        EVENTS_DATA = airportData.events;

        console.log("Данные аэропорта успешно загружены.");

        return true;

    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        return false;
    }
}

function escapeHtml(text) {
    if (typeof text !== "string") return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getStatusCssClass(status) {
    switch (status) {
        case "По расписанию": return "status-ontime";
        case "Регистрация": return "status-checkin";
        case "Регистрация завершена": return "status-checkin-done";
        case "Посадка": return "status-boarding";
        case "Задержан":
        case "Задерживается": return "status-delayed";
        case "Ожидает подтверждения": return "status-awaiting";
        case "Приземлился":
        case "Прибыл": return "status-arrived";
        case "Выдача багажа": return "status-baggage";
        case "Вылетел":
        case "Завершён": return "status-departed";
        case "Отменён": return "status-cancelled";
        default: return "status-ontime";
    }
}
// ======================================================
// ОТОБРАЖЕНИЕ ВРЕМЕНИ РЕЙСОВ
// ======================================================

// Время вылета: фактическое или ожидаемое
function getDepartureTimeDisplay(flight) {

    if (flight.status === "Отменён") return "—";

    // Если рейс уже вылетел, показываем фактическое время
    if (flight.actualDepartureAt || flight.status === "Вылетел") {
        return flight.actualTime || "—";
    }

    // Если рейс задерживается, показываем ожидаемое время
    if (flight.isDelayed && flight.actualTime !== "—") {
        return flight.actualTime;
    }

    // Для остальных рейсов показываем плановое время
    return flight.scheduledTime || "—";
}



// Время прибытия: фактическое или ожидаемое
function getArrivalTimeDisplay(flight) {

    if (flight.status === "Отменён") return "—";

    // Если самолёт прибыл, показываем фактическое время
    if (
        flight.actualArrivalAt ||
        ["Приземлился", "Выдача багажа", "Завершён"].includes(flight.status)
    ) {
        return flight.actualTime || "—";
    }

    // При задержке показываем ожидаемое время прибытия
    if (flight.isDelayed && flight.actualTime !== "—") {
        return flight.actualTime;
    }

    return "—";
}
/**
 * Расчет расстояния между координатами по формуле гаверсинусов (км)
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Радиус Земли в км
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

// ======================================================
// ПОСТРОЕНИЕ СХЕМЫ МАРШРУТА ПОЛЁТА
// ======================================================

function renderFlightMap() {
    const allFlights = [
        ...DEPARTURES_DATA.map(f => ({
            ...f,
            flightType: "departure"
        })),
        ...ARRIVALS_DATA.map(f => ({
            ...f,
            flightType: "arrival"
        }))
    ];

    // Заполняем список рейсов
    const previousValue = flightMapSelect.value;

    flightMapSelect.innerHTML = allFlights.map(flight => {
        const direction = flight.flightType === "departure"
            ? "Вылет"
            : "Прилёт";

        return `
            <option value="${flight.flightType}|${escapeHtml(flight.flightNumber)}">
                ${direction} — ${escapeHtml(flight.flightNumber)}
            </option>
        `;
    }).join("");

    // Сохраняем выбранный рейс при повторном обновлении
    let selectedFlight = allFlights.find(f =>
        `${f.flightType}|${f.flightNumber}` === previousValue
    );

    if (!selectedFlight) {
        selectedFlight = allFlights.find(f => !f.isCancelled) || allFlights[0];
    }

    if (!selectedFlight) {
        flightMapCanvas.innerHTML = "<p>Нет данных о рейсах</p>";
        return;
    }

    flightMapSelect.value =
        `${selectedFlight.flightType}|${selectedFlight.flightNumber}`;

    const flight = selectedFlight;
    const isDeparture = flight.flightType === "departure";

    const originName = isDeparture
        ? BASE_AIRPORT.city.split(" (")[0]
        : flight.origin;

    const destinationName = isDeparture
        ? flight.destination
        : BASE_AIRPORT.city.split(" (")[0];

    const originCoords = isDeparture
        ? BASE_AIRPORT
        : CITIES_COORDINATES[flight.origin];

    const destinationCoords = isDeparture
        ? CITIES_COORDINATES[flight.destination]
        : BASE_AIRPORT;

    if (!originCoords || !destinationCoords) {
        flightMapCanvas.innerHTML =
            "<p>Координаты маршрута не найдены</p>";
        return;
    }

    // Преобразование географических координат в координаты схемы
    function projectPoint(lat, lon) {
        return {
            x: 70 + ((lon - 20) / 112) * 860,
            y: 450 - ((lat - 40) / 21) * 360
        };
    }

    const start = projectPoint(originCoords.lat, originCoords.lon);
    const end = projectPoint(destinationCoords.lat, destinationCoords.lon);

    // Контрольная точка создаёт дугу маршрута
    const middleX = (start.x + end.x) / 2;
    const middleY = Math.max(65, (start.y + end.y) / 2 - 85);

    const routePath =
        `M ${start.x} ${start.y} Q ${middleX} ${middleY} ${end.x} ${end.y}`;

    // Положение условного самолёта в середине маршрута
    const planeX = 0.25 * start.x + 0.5 * middleX + 0.25 * end.x;
    const planeY = 0.25 * start.y + 0.5 * middleY + 0.25 * end.y;

    const distance = calculateDistanceKm(
        originCoords.lat,
        originCoords.lon,
        destinationCoords.lat,
        destinationCoords.lon
    );

    const statusClass = getStatusCssClass(flight.status);
    const isCancelled = flight.isCancelled || flight.status === "Отменён";

    // Информация о рейсе
    flightMapSummary.innerHTML = `
        <div class="route-summary-header">
            <div>
                <span class="route-summary-number">
                    ${escapeHtml(flight.flightNumber)}
                </span>
                <span class="route-summary-airline">
                    ${escapeHtml(flight.airline)}
                </span>
            </div>

            <span class="status-badge ${statusClass}">
                ${escapeHtml(flight.status)}
            </span>
        </div>

        <div class="route-summary-cities">
            <div>
                <span class="route-city-label">Откуда</span>
                <strong>${escapeHtml(originName)}</strong>
            </div>

            <span class="route-summary-arrow">→</span>

            <div>
                <span class="route-city-label">Куда</span>
                <strong>${escapeHtml(destinationName)}</strong>
            </div>
        </div>

        <div class="route-summary-details">
            <div>
                <span>Плановое время</span>
                <strong>${escapeHtml(flight.scheduledTime)}</strong>
            </div>

            <div>
                <span>Факт / ожидание</span>
                <strong>${escapeHtml(flight.actualTime)}</strong>
            </div>

            <div>
                <span>Расстояние</span>
                <strong>${distance.toLocaleString("ru-RU")} км</strong>
            </div>
        </div>

        ${flight.delayReason && !isCancelled ? `
            <div class="route-delay-note">
                Причина задержки: ${escapeHtml(flight.delayReason)}
            </div>
        ` : ""}
    `;

    // Рисуем схему маршрута
    flightMapCanvas.innerHTML = `
        <svg viewBox="0 0 1000 520"
             id="routeMapSvg"
             role="img"
             aria-label="Маршрут рейса ${escapeHtml(flight.flightNumber)}">

            <defs>
                <marker id="routeArrow"
                        markerWidth="10"
                        markerHeight="10"
                        refX="8"
                        refY="3"
                        orient="auto">
                    <path d="M0,0 L0,6 L9,3 Z" fill="#38bdf8"/>
                </marker>
            </defs>

            <!-- Координатная сетка -->
            ${Array.from({ length: 6 }, (_, i) => {
                const x = 70 + i * 172;
                return `<line x1="${x}" y1="45" x2="${x}" y2="450"
                    class="route-grid-line"/>`;
            }).join("")}

            ${Array.from({ length: 5 }, (_, i) => {
                const y = 70 + i * 90;
                return `<line x1="55" y1="${y}" x2="950" y2="${y}"
                    class="route-grid-line"/>`;
            }).join("")}

            <text x="75" y="35" class="route-map-caption">
                СХЕМА МАРШРУТА
            </text>

            <!-- Линия маршрута -->
            <path d="${routePath}"
                  class="route-map-line ${isCancelled ? "route-cancelled" : ""}"
                  marker-end="url(#routeArrow)"/>

            <!-- Точка отправления -->
            <circle cx="${start.x}" cy="${start.y}" r="10"
                    class="route-map-origin"/>

            <text x="${start.x}" y="${start.y + 28}"
                  class="route-map-city"
                  text-anchor="middle">
                ${escapeHtml(originName)}
            </text>

            <!-- Точка назначения -->
            <circle cx="${end.x}" cy="${end.y}" r="10"
                    class="route-map-destination"/>

            <text x="${end.x}" y="${end.y + 28}"
                  class="route-map-city"
                  text-anchor="middle">
                ${escapeHtml(destinationName)}
            </text>

            <!-- Условное положение самолёта -->
            <text x="${planeX}" y="${planeY}"
                  class="route-map-plane"
                  text-anchor="middle">✈</text>

        </svg>
    `;
}

/**
 * Показ всплывающего уведомления (Toast)
 */
function showToast(message) {
    toastNotification.textContent = message;
    toastNotification.style.display = "block";
    clearTimeout(toastNotification._timer);
    toastNotification._timer = setTimeout(() => {
        toastNotification.style.display = "none";
    }, 4500);
}

// ==========================================================================
// РАЗДЕЛ 5: РЕНДЕРИНГ ТАБЛО ВЫЛЕТОВ
// ==========================================================================
function renderDepartures() {
    const searchText = depSearchInput.value.trim().toLowerCase();
    const filterStatus = depStatusFilter.value;

    depClearSearchBtn.style.display = searchText ? "block" : "none";

    const filtered = DEPARTURES_DATA.filter((flight) => {
        const matchesSearch =
            searchText === "" ||
            flight.flightNumber.toLowerCase().includes(searchText) ||
            flight.destination.toLowerCase().includes(searchText);

    const matchesStatus =
        filterStatus === "Все" ||
        (
            filterStatus === "Задержан"
                ? flight.isDelayed &&
                !["Вылетел", "Отменён"].includes(flight.status)
                : flight.status === filterStatus
        );
        return matchesSearch && matchesStatus;
        });

    depFlightsTableBody.innerHTML = "";
    depFlightsCardsContainer.innerHTML = "";

    if (filtered.length === 0) {
        depFlightsTable.style.display = "none";
        depFlightsCardsContainer.style.display = "none";
        depNoResults.style.display = "flex";
    } else {
        depFlightsTable.style.display = "";
        depFlightsCardsContainer.style.display = "";
        depNoResults.style.display = "none";

        filtered.forEach((flight) => {
            const statusClass = getStatusCssClass(flight.status);

        const timeDisplay = getDepartureTimeDisplay(flight);

        const isDelayed =
            flight.isDelayed &&
            !["Вылетел", "Отменён"].includes(flight.status);
            // Строка таблицы
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="flight-number">${escapeHtml(flight.flightNumber)}</td>
                <td class="flight-airline">${escapeHtml(flight.airline)}</td>
                <td><div class="flight-city">${escapeHtml(flight.destination)}</div></td>
                <td class="flight-time">${escapeHtml(flight.scheduledTime)}</td>
                <td class="flight-fact-time ${isDelayed ? 'delayed' : 'ontime'}">${escapeHtml(timeDisplay)}</td>
                <td><span class="desk-badge">${escapeHtml(flight.checkinDesks)}</span></td>
                <td><span class="gate-badge">${escapeHtml(flight.gate)}</span></td>
                <td>
                    <div class="status-cell">
                        <span class="status-badge ${statusClass}">${escapeHtml(flight.status)}</span>
                        ${flight.delayReason ? `<div class="delay-reason-note">${escapeHtml(flight.delayReason)}</div>` : ''}
                    </div>
                </td>
            `;
            depFlightsTableBody.appendChild(row);

            // Карточка для смартфона
            const card = document.createElement("div");
            card.className = "flight-card";
            card.innerHTML = `
                <div class="card-top">
                    <div class="card-flight-header">
                        <span class="flight-number">${escapeHtml(flight.flightNumber)}</span>
                        <span class="flight-airline">${escapeHtml(flight.airline)}</span>
                    </div>
                    <span class="gate-badge">Выход ${escapeHtml(flight.gate)}</span>
                </div>
                <div class="card-route">
                    <span class="card-detail-label">Направление:</span>
                    <span class="card-city">${escapeHtml(flight.destination)}</span>
                </div>
                <div class="card-details-grid">
                    <div class="card-detail-item">
                        <span class="card-detail-label">План вылета:</span>
                        <span class="flight-time">${escapeHtml(flight.scheduledTime)}</span>
                    </div>
                    <div class="card-detail-item">
                        <span class="card-detail-label">Факт / Ожид.:</span>
                        <span class="flight-fact-time ${isDelayed ? 'delayed' : 'ontime'}">${escapeHtml(timeDisplay)}</span>
                    </div>
                    <div class="card-detail-item">
                        <span class="card-detail-label">Стойки регистрации:</span>
                        <span class="desk-badge">${escapeHtml(flight.checkinDesks)}</span>
                    </div>
                    <div class="card-detail-item">
                        <span class="card-detail-label">Выход:</span>
                        <span class="gate-badge">${escapeHtml(flight.gate)}</span>
                    </div>
                </div>
                <div class="card-bottom">
                    <span class="status-badge ${statusClass}">${escapeHtml(flight.status)}</span>
                    ${flight.delayReason ? `<div class="delay-reason-note">${escapeHtml(flight.delayReason)}</div>` : ''}
                </div>
            `;
            depFlightsCardsContainer.appendChild(card);
        });
    }

    // Обновление статистики вылетов
    statDepTotal.textContent = DEPARTURES_DATA.length;
    statDepCheckin.textContent = DEPARTURES_DATA.filter(
        f => ["Регистрация", "Регистрация завершена"].includes(f.status)).length;   
    statDepBoarding.textContent = DEPARTURES_DATA.filter(f => f.status === "Посадка").length;
    statDepDelayed.textContent = DEPARTURES_DATA.filter(
        f => f.isDelayed &&
        !["Вылетел", "Отменён"].includes(f.status)
    ).length;
    statDepDeparted.textContent = DEPARTURES_DATA.filter(f => f.status === "Вылетел").length;
    statDepCancelled.textContent = DEPARTURES_DATA.filter(f => f.status === "Отменён").length;
    departuresCountBadge.textContent = DEPARTURES_DATA.length;
}

// ==========================================================================
// РАЗДЕЛ 6: РЕНДЕРИНГ ТАБЛО ПРИЛЁТОВ
// ==========================================================================
function renderArrivals() {
    const searchText = arrSearchInput.value.trim().toLowerCase();
    const filterStatus = arrStatusFilter.value;

    arrClearSearchBtn.style.display = searchText ? "block" : "none";

    const filtered = ARRIVALS_DATA.filter((flight) => {
        const matchesSearch =
            searchText === "" ||
            flight.flightNumber.toLowerCase().includes(searchText) ||
            flight.origin.toLowerCase().includes(searchText);

        const matchesStatus =
            filterStatus === "Все" ||
            (
                filterStatus === "Задерживается"
                    ? flight.isDelayed &&
                    !["Приземлился", "Выдача багажа", "Завершён", "Отменён"].includes(flight.status)
                    : flight.status === filterStatus
            );
                return matchesSearch && matchesStatus;
            });

    arrFlightsTableBody.innerHTML = "";
    arrFlightsCardsContainer.innerHTML = "";

    if (filtered.length === 0) {
        arrFlightsTable.style.display = "none";
        arrFlightsCardsContainer.style.display = "none";
        arrNoResults.style.display = "flex";
    } else {
        arrFlightsTable.style.display = "";
        arrFlightsCardsContainer.style.display = "";
        arrNoResults.style.display = "none";

        filtered.forEach((flight) => {
            const statusClass = getStatusCssClass(flight.status);

            const timeDisplay = getArrivalTimeDisplay(flight);

            const isDelayed =
                flight.isDelayed &&
                !["Приземлился", "Выдача багажа", "Завершён", "Отменён"]
                    .includes(flight.status);
            // Строка таблицы
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="flight-number">${escapeHtml(flight.flightNumber)}</td>
                <td class="flight-airline">${escapeHtml(flight.airline)}</td>
                <td><div class="flight-city">${escapeHtml(flight.origin)}</div></td>
                <td class="flight-time">${escapeHtml(flight.scheduledTime)}</td>
                <td class="flight-fact-time ${isDelayed ? 'delayed' : 'ontime'}">${escapeHtml(timeDisplay)}</td>
                <td>
                    ${flight.baggageBelt && flight.baggageBelt !== "—" 
                        ? `<span class="baggage-badge">${escapeHtml(flight.baggageBelt)}</span>` 
                        : '<span style="color:#64748b;">—</span>'}
                </td>
                <td>
                    <div class="status-cell">
                        <span class="status-badge ${statusClass}">${escapeHtml(flight.status)}</span>
                        ${flight.delayReason ? `<div class="delay-reason-note">${escapeHtml(flight.delayReason)}</div>` : ''}
                    </div>
                </td>
            `;
            arrFlightsTableBody.appendChild(row);

            // Карточка для смартфона
            const card = document.createElement("div");
            card.className = "flight-card";
            card.innerHTML = `
                <div class="card-top">
                    <div class="card-flight-header">
                        <span class="flight-number">${escapeHtml(flight.flightNumber)}</span>
                        <span class="flight-airline">${escapeHtml(flight.airline)}</span>
                    </div>
                    ${flight.baggageBelt && flight.baggageBelt !== "—" 
                        ? `<span class="baggage-badge">${escapeHtml(flight.baggageBelt)}</span>` 
                        : ''}
                </div>
                <div class="card-route">
                    <span class="card-detail-label">Откуда:</span>
                    <span class="card-city">${escapeHtml(flight.origin)}</span>
                </div>
                <div class="card-details-grid">
                    <div class="card-detail-item">
                        <span class="card-detail-label">План прибытия:</span>
                        <span class="flight-time">${escapeHtml(flight.scheduledTime)}</span>
                    </div>
                    <div class="card-detail-item">
                        <span class="card-detail-label">Факт / Ожид.:</span>
                        <span class="flight-fact-time ${isDelayed ? 'delayed' : 'ontime'}">${escapeHtml(timeDisplay)}</span>
                    </div>
                    <div class="card-detail-item">
                        <span class="card-detail-label">Багажная лента:</span>
                        <span style="font-weight: 700; color:#2dd4bf;">${escapeHtml(flight.baggageBelt)}</span>
                    </div>
                    <div class="card-detail-item">
                        <span class="card-detail-label">Статус:</span>
                        <span style="font-weight: 600;">${escapeHtml(flight.status)}</span>
                    </div>
                </div>
                <div class="card-bottom">
                    <span class="status-badge ${statusClass}">${escapeHtml(flight.status)}</span>
                    ${flight.delayReason ? `<div class="delay-reason-note">${escapeHtml(flight.delayReason)}</div>` : ''}
                </div>
            `;
            arrFlightsCardsContainer.appendChild(card);
        });
    }

    // Обновление статистики прилётов
    statArrTotal.textContent = ARRIVALS_DATA.length;
    statArrOnTime.textContent = ARRIVALS_DATA.filter(f => f.status === "По расписанию").length;
    statArrLanded.textContent = ARRIVALS_DATA.filter(
        f => ["Приземлился", "Выдача багажа", "Завершён"].includes(f.status)
    ).length;
    statArrBaggage.textContent = ARRIVALS_DATA.filter(f => f.status === "Выдача багажа").length;
    statArrDelayed.textContent = ARRIVALS_DATA.filter(
        f => f.isDelayed &&
        !["Приземлился", "Выдача багажа", "Завершён", "Отменён"].includes(f.status)
    ).length;
    statArrCancelled.textContent = ARRIVALS_DATA.filter(f => f.status === "Отменён").length;
    arrivalsCountBadge.textContent = ARRIVALS_DATA.length;
}

// ==========================================================================
// РАЗДЕЛ 7: ПЕРСОНАЛЬНЫЙ ПОИСК РЕЙСА (ПОДРОБНЫЕ КАРТОЧКИ)
// ==========================================================================
function performGlobalSearch(query) {
    const q = (query || globalSearchInput.value).trim().toLowerCase();

    if (!q) {
        searchResultsContainer.innerHTML = "";
        searchPlaceholder.style.display = "flex";
        return;
    }

    searchPlaceholder.style.display = "none";
    searchResultsContainer.innerHTML = "";

    // Поиск среди вылетов
    const foundDep = DEPARTURES_DATA.filter(f =>
        f.flightNumber.toLowerCase().includes(q) || f.destination.toLowerCase().includes(q)
    ).map(f => ({ ...f, flightType: "departure" }));

    // Поиск среди прилётов
    const foundArr = ARRIVALS_DATA.filter(f =>
        f.flightNumber.toLowerCase().includes(q) || f.origin.toLowerCase().includes(q)
    ).map(f => ({ ...f, flightType: "arrival" }));

    const allFound = [...foundDep, ...foundArr];

    if (allFound.length === 0) {
        searchResultsContainer.innerHTML = `
            <div class="search-placeholder">
                <div class="placeholder-icon">🔍</div>
                <h3>По запросу «${escapeHtml(q)}» ничего не найдено</h3>
                <p>Проверьте правильность написания номера рейса или города</p>
            </div>
        `;
        return;
    }

    allFound.forEach((flight) => {
        const isDep = flight.flightType === "departure";
        const statusClass = getStatusCssClass(flight.status);
        const card = document.createElement("div");
        card.className = "detailed-flight-card";

        const airportCity = BASE_AIRPORT.city.split(" (")[0];

        const routeOrigin = isDep ? airportCity : flight.origin;
        const routeDest = isDep ? flight.destination : airportCity;

        const timeDisplay = isDep
            ? getDepartureTimeDisplay(flight)
            : getArrivalTimeDisplay(flight);

        const timeLabel = isDep
            ? (flight.actualDepartureAt ? "Фактическое время вылета:" : "Ожидаемое время вылета:")
            : (flight.actualArrivalAt ? "Фактическое время прибытия:" : "Ожидаемое время прибытия:");

        card.innerHTML = `
            <div class="card-header-bar">
                <div style="display:flex; align-items:center; gap: 10px;">
                    <span class="flight-type-badge ${isDep ? 'flight-type-dep' : 'flight-type-arr'}">
                        ${isDep ? '🛫 ВЫЛЕТ' : '🛬 ПРИЛЁТ'}
                    </span>
                    <span class="flight-number" style="font-size: 1.25rem;">${escapeHtml(flight.flightNumber)}</span>
                    <span class="flight-airline" style="color: #cbd5e1;">${escapeHtml(flight.airline)}</span>
                </div>
                <div style="display:flex; align-items:center; gap: 8px;">
                    <span class="status-badge ${statusClass}">${escapeHtml(flight.status)}</span>
                </div>
            </div>

            <div class="detailed-route-display">
                <div class="route-point">
                    <span class="route-sub">Пункт отправления</span>
                    <span class="route-city">${escapeHtml(routeOrigin)}</span>
                </div>
                <span class="route-arrow">➔</span>
                <div class="route-point">
                    <span class="route-sub">Пункт назначения</span>
                    <span class="route-city">${escapeHtml(routeDest)}</span>
                </div>
            </div>

            <div class="detailed-grid-info">
                <div class="info-block">
                    <span class="info-label">Плановое время:</span>
                    <span class="info-value">${escapeHtml(flight.scheduledTime)}</span>
                </div>
                <div class="info-block">
                    <span class="info-label">${timeLabel}</span>
                    <span class="info-value ${flight.isDelayed ? 'flight-fact-time delayed' : ''}">${escapeHtml(timeDisplay)}</span>
                </div>
                ${isDep ? `
                <div class="info-block">
                    <span class="info-label">Стойки регистрации:</span>
                    <span class="info-value"><span class="desk-badge">${escapeHtml(flight.checkinDesks)}</span></span>
                </div>
                <div class="info-block">
                    <span class="info-label">Выход на посадку:</span>
                    <span class="info-value"><span class="gate-badge">${escapeHtml(flight.gate)}</span></span>
                </div>
                ` : `
                <div class="info-block">
                    <span class="info-label">Выдача багажа:</span>
                    <span class="info-value"><span class="baggage-badge">${escapeHtml(flight.baggageBelt)}</span></span>
                </div>
                <div class="info-block">
                    <span class="info-label">Терминал:</span>
                    <span class="info-value">B (Прибытие)</span>
                </div>
                `}
            </div>

            ${flight.delayReason ? `
            <div class="delay-reason-note" style="max-width: 100%; padding: 8px 12px; font-size: 0.85rem;">
                ⚠️ <strong>Причина задержки:</strong> ${escapeHtml(flight.delayReason)}. Ожидаемое время: <strong>${escapeHtml(flight.actualTime)}</strong>
            </div>
            ` : ''}

        `;

        searchResultsContainer.appendChild(card);
    });
}

// ==========================================================================
// РАЗДЕЛ 8: КАРТА ПОЛЁТА (РАЗДЕЛ НА СОГЛАСОВАНИИ С ПРЕПОДАВАТЕЛЕМ)
// ==========================================================================
// Сам раздел сохранён в интерфейсе, наполнение отключено на время согласования.

// ==========================================================================
// РАЗДЕЛ 9: ЛЕНТА СОБЫТИЙ АЭРОПОРТА
// ==========================================================================
function renderEvents() {
    const filterCat = eventCategoryFilter.value;

    const filtered = EVENTS_DATA.filter((ev) => {
        if (filterCat === "Все") return true;
        if (filterCat === "Задержка") return ev.type === "Задержка" || ev.type === "Отмена";
        if (filterCat === "Прибытие") return ev.type === "Прибытие" || ev.type === "Вылет";
        return ev.type === filterCat;
    });

    eventsTimeline.innerHTML = "";

    filtered.forEach((ev) => {
        const card = document.createElement("div");
        card.className = "event-card";

        let tagClass = "tag-change";
        if (ev.type === "Регистрация") tagClass = "tag-checkin";
        else if (ev.type === "Посадка") tagClass = "tag-boarding";
        else if (ev.type === "Выдача багажа") tagClass = "tag-baggage";
        else if (ev.type === "Задержка" || ev.type === "Отмена") tagClass = "tag-delay";
        else if (ev.type === "Прибытие" || ev.type === "Вылет") tagClass = "tag-arrival";

        card.innerHTML = `
            <div class="event-time">
                ${escapeHtml(ev.date || getCurrentMoscowDateString())}
                <br>
                ${escapeHtml(ev.time)}
            </div>
            <div class="event-content">
                <div class="event-header">
                    <span class="event-flight-badge">${escapeHtml(ev.flightNumber)}</span>
                    <span class="event-type-tag ${tagClass}">${escapeHtml(ev.type)}</span>
                </div>
                <div class="event-message">${escapeHtml(ev.text)}</div>
            </div>
        `;
        eventsTimeline.appendChild(card);
    });

    eventsCountBadge.textContent = EVENTS_DATA.length;
}

/**
 * Добавление нового системного события
 */
function addAirportEvent(flightNumber, type, text) {

    const now = new Date();
    const eventDate = getCurrentMoscowDateString();

    // Проверяем, не было ли уже такого события сегодня
    const alreadyExists = EVENTS_DATA.some(event =>
        event.flightNumber === flightNumber &&
        event.type === type &&
        event.text === text &&
        (event.date || eventDate) === eventDate
    );

    if (alreadyExists) return;

    const newEvent = {
        id: Date.now() + Math.random(),
        date: eventDate,
        time: getCurrentTimeString(),
        flightNumber: flightNumber,
        type: type,
        text: text
    };

    // Добавляем новое событие в начало списка
    EVENTS_DATA.unshift(newEvent);
    saveAirportData();
    renderEvents();

    showToast(`📢 ${type}: ${flightNumber} — ${text}`);
}


// ==========================================================================
// РАЗДЕЛ 11: НАВИГАЦИЯ МЕЖДУ РАЗДЕЛАМИ
// ==========================================================================
function switchTab(targetTabName) {
    navTabs.forEach(tab => {
        if (tab.getAttribute("data-tab") === targetTabName) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });

    tabContents.forEach(content => {
        if (content.id === `${targetTabName}Section`) {
            content.classList.add("active");
        } else {
            content.classList.remove("active");
        }
    });
    if (targetTabName === "map") {
        renderFlightMap();
    }
}

window.switchTabAndSelectFlight = function(tabName) {
    switchTab(tabName);
};

function refreshAllViews() {
    renderDepartures();
    renderArrivals();
    renderEvents();
    if (document.getElementById("searchSection").classList.contains("active")) {
        performGlobalSearch();
    }
    if (document.getElementById("mapSection").classList.contains("active")) {
        renderFlightMap();
    }
}
// ======================================================
// АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ СТАТУСОВ ПО ВРЕМЕНИ
// ======================================================

// Преобразуем дату рейса в timestamp
function getFlightTimestamp(value) {
    if (!value) return null;

    const timestamp = new Date(value).getTime();

    return Number.isFinite(timestamp) ? timestamp : null;
}


// Пропускаем создание событий при первой проверке,
// чтобы не создавать лишние уведомления при запуске сайта
let isFirstAutomaticStatusCheck = true;


// Форматирование времени по московскому часовому поясу
function formatMoscowTimeFromTimestamp(timestamp) {
    return new Intl.DateTimeFormat("ru-RU", {
        timeZone: "Europe/Moscow",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    }).format(new Date(timestamp));
}
// ======================================================
// АВТОМАТИЧЕСКОЕ УПРАВЛЕНИЕ СОСТОЯНИЯМИ РЕЙСОВ
// ======================================================

function updateFlightStatusesByTime(now = Date.now()) {

    let departuresChanged = false;
    let arrivalsChanged = false;

    // При первом запуске не создаём массовые события
    const createEvents = !isFirstAutomaticStatusCheck;

    const MINUTE = 60 * 1000;

    // ==================================================
    // 1. АВТОМАТИЗАЦИЯ ВЫЛЕТАЮЩИХ РЕЙСОВ
    // ==================================================

    DEPARTURES_DATA.forEach(flight => {

        // Отменённые рейсы не участвуют в автоматизации
        if (flight.isCancelled || flight.status === "Отменён") {
            flight.status = "Отменён";
            return;
        }

        const expectedTime = getFlightTimestamp(
            flight.expectedDepartureAt || flight.scheduledAt
        );

        if (expectedTime === null) return;

        // Временные границы технологических этапов
        const checkinOpen = expectedTime - 120 * MINUTE;
        const checkinClose = expectedTime - 40 * MINUTE;
        const boardingStart = expectedTime - 30 * MINUTE;

        let newStatus;

        // Определяем состояние по текущему времени
        if (now >= expectedTime) {
            newStatus = "Вылетел";
        }
        else if (now >= boardingStart) {
            newStatus = "Посадка";
        }
        else if (now >= checkinClose) {
            newStatus = "Регистрация завершена";
        }
        else if (now >= checkinOpen) {
            newStatus = "Регистрация";
        }
        else if (flight.isDelayed) {
            newStatus = "Задержан";
        }
        else {
            newStatus = "По расписанию";
        }

        const oldStatus = flight.status;

        if (oldStatus !== newStatus) {

            flight.status = newStatus;
            departuresChanged = true;

            // Фиксируем имитируемое фактическое время вылета
            if (newStatus === "Вылетел") {
                flight.actualDepartureAt =
                    new Date(expectedTime).toISOString();

                flight.actualTime =
                    formatMoscowTimeFromTimestamp(expectedTime);
            }

            // Формируем информационное событие
            if (createEvents) {

                let eventType = "Вылет";
                let message = "";

                switch (newStatus) {

                    case "Задержан":
                        eventType = "Задержка";
                        message = `Рейс ${flight.flightNumber} в ${flight.destination} задерживается. ${flight.delayReason}`;
                        break;

                    case "Регистрация":
                        eventType = "Регистрация";
                        message = `Началась регистрация на рейс ${flight.flightNumber} в ${flight.destination}. Стойки ${flight.checkinDesks}`;
                        break;

                    case "Регистрация завершена":
                        eventType = "Регистрация";
                        message = `Регистрация на рейс ${flight.flightNumber} завершена`;
                        break;

                    case "Посадка":
                        eventType = "Посадка";
                        message = `Началась посадка на рейс ${flight.flightNumber} в ${flight.destination}. Выход ${flight.gate}`;
                        break;

                    case "Вылетел":
                        eventType = "Вылет";
                        message = `Рейс ${flight.flightNumber} вылетел в ${flight.destination}`;
                        break;
                }

                if (message) {
                    addAirportEvent(
                        flight.flightNumber,
                        eventType,
                        message
                    );
                }
            }
        }

        // Сохраняем время фактического вылета и для рейсов,
        // которые уже находились в этом состоянии при запуске
        if (newStatus === "Вылетел" && !flight.actualDepartureAt) {
            flight.actualDepartureAt =
                new Date(expectedTime).toISOString();

            flight.actualTime =
                formatMoscowTimeFromTimestamp(expectedTime);
        }
    });


    // ==================================================
    // 2. АВТОМАТИЗАЦИЯ ПРИБЫВАЮЩИХ РЕЙСОВ
    // ==================================================

    ARRIVALS_DATA.forEach(flight => {

        // Отменённые рейсы не участвуют в автоматизации
        if (flight.isCancelled || flight.status === "Отменён") {
            flight.status = "Отменён";
            return;
        }

        const expectedTime = getFlightTimestamp(
            flight.expectedArrivalAt || flight.scheduledAt
        );

        if (expectedTime === null) return;

        // Временные границы обслуживания прибывшего рейса
        const baggageStart = expectedTime + 15 * MINUTE;
        const serviceEnd = expectedTime + 45 * MINUTE;

        let newStatus;

        if (now >= serviceEnd) {
            newStatus = "Завершён";
        }
        else if (now >= baggageStart) {
            newStatus = "Выдача багажа";
        }
        else if (now >= expectedTime) {
            newStatus = "Приземлился";
        }
        else if (flight.isDelayed) {
            newStatus = "Задерживается";
        }
        else {
            newStatus = "По расписанию";
        }

        const oldStatus = flight.status;

        // Фиксируем имитируемое фактическое время прибытия
        if (
            ["Приземлился", "Выдача багажа", "Завершён"]
                .includes(newStatus) &&
            !flight.actualArrivalAt
        ) {
            flight.actualArrivalAt =
                new Date(expectedTime).toISOString();

            flight.actualTime =
                formatMoscowTimeFromTimestamp(expectedTime);
        }

        // При начале выдачи багажа проверяем наличие ленты
        if (
            ["Выдача багажа", "Завершён"].includes(newStatus) &&
            (!flight.baggageBelt || flight.baggageBelt === "—")
        ) {
            flight.baggageBelt = "Уточняется";
        }

        if (oldStatus !== newStatus) {

            flight.status = newStatus;
            arrivalsChanged = true;

            // Формируем информационное событие
            if (createEvents) {

                let eventType = "Прибытие";
                let message = "";

                switch (newStatus) {

                    case "Задерживается":
                        eventType = "Задержка";
                        message = `Рейс ${flight.flightNumber} из ${flight.origin} задерживается. ${flight.delayReason}`;
                        break;

                    case "Приземлился":
                        eventType = "Прибытие";
                        message = `Рейс ${flight.flightNumber} из ${flight.origin} приземлился`;
                        break;

                    case "Выдача багажа":
                        eventType = "Выдача багажа";
                        message = `Началась выдача багажа рейса ${flight.flightNumber}. Лента: ${flight.baggageBelt}`;
                        break;

                    case "Завершён":
                        eventType = "Прибытие";
                        message = `Обслуживание рейса ${flight.flightNumber} завершено`;
                        break;
                }

                if (message) {
                    addAirportEvent(
                        flight.flightNumber,
                        eventType,
                        message
                    );
                }
            }
        }
    });


    // ==================================================
    // 3. ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
    // ==================================================

    isFirstAutomaticStatusCheck = false;

    if (departuresChanged || arrivalsChanged) {

        const updateTime = getCurrentTimeString();

        if (departuresChanged) {
            depLastUpdateTime.textContent = updateTime;
        }

        if (arrivalsChanged) {
            arrLastUpdateTime.textContent = updateTime;
        }
        saveAirportData();
        refreshAllViews();
    }
}

// ==========================================================================
// РАЗДЕЛ 12: ОБРАБОТЧИКИ СОБЫТИЙ (EVENT LISTENERS)
// ==========================================================================
// Навигация
navTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const tabName = tab.getAttribute("data-tab");
        switchTab(tabName);
    });
});

// Вылеты: поиск, фильтры, обновление
depSearchInput.addEventListener("input", renderDepartures);
depClearSearchBtn.addEventListener("click", () => {
    depSearchInput.value = "";
    renderDepartures();
    depSearchInput.focus();
});
depStatusFilter.addEventListener("change", renderDepartures);
depRefreshBtn.addEventListener("click", () => {
    depRefreshBtn.classList.add("spinning");

    // Проверяем актуальные состояния всех рейсов
    updateFlightStatusesByTime();

    depLastUpdateTime.textContent = getCurrentTimeString();

    renderDepartures();

    setTimeout(() => {
        depRefreshBtn.classList.remove("spinning");
        showToast("Табло вылетов обновлено");
    }, 250);
});

// Прилёты: поиск, фильтры, обновление
arrSearchInput.addEventListener("input", renderArrivals);
arrClearSearchBtn.addEventListener("click", () => {
    arrSearchInput.value = "";
    renderArrivals();
    arrSearchInput.focus();
});
arrStatusFilter.addEventListener("change", renderArrivals);
arrRefreshBtn.addEventListener("click", () => {
    arrRefreshBtn.classList.add("spinning");

    // Проверяем актуальные состояния всех рейсов
    updateFlightStatusesByTime();

    arrLastUpdateTime.textContent = getCurrentTimeString();

    renderArrivals();

    setTimeout(() => {
        arrRefreshBtn.classList.remove("spinning");
        showToast("Табло прилётов обновлено");
    }, 250);
});

// Поиск
globalSearchBtn.addEventListener("click", () => performGlobalSearch());
globalSearchInput.addEventListener("input", () => performGlobalSearch());
quickTags.forEach(tag => {
    tag.addEventListener("click", () => {
        const query = tag.getAttribute("data-query");
        globalSearchInput.value = query;
        performGlobalSearch(query);
    });
});
// Карта полёта
flightMapSelect.addEventListener("change", renderFlightMap);
// Лента информации
eventCategoryFilter.addEventListener("change", renderEvents);



// ==========================================================================
// РАЗДЕЛ 13: ИНИЦИАЛИЗАЦИЯ ПРИ ЗАПУСКЕ
// ==========================================================================
function initApp() {
    // Загружаем сохранённые данные до отображения табло
    loadAirportData();

    // Обновление часов каждую секунду
    updateClock();
    setInterval(updateClock, 1000);

    const startTime = getCurrentTimeString();

    depLastUpdateTime.textContent = startTime;
    arrLastUpdateTime.textContent = startTime;

    // Первоначальное отображение данных
    renderDepartures();
    renderArrivals();
    renderEvents();

    // Первая проверка статусов при открытии приложения
    updateFlightStatusesByTime();

    // Повторная проверка каждую минуту
    setInterval(updateFlightStatusesByTime, 60 * 1000);
}

document.addEventListener("DOMContentLoaded", initApp);


