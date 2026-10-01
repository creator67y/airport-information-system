/* ==========================================================================
   Информационная система аэропорта «Северный»
   Логика приложения: script.js
   --------------------------------------------------------------------------
   Демонстрационные данные о рейсах, координатах городов, начальных событиях
   и цепочках состояний вынесены в отдельный файл: flights.js
   
   script.js отвечает исключительно за поведение и логику:
   - Обработка и фильтрация данных из flights.js;
   - Вывод информации на табло вылетов и прилётов (таблица и мобильные карточки);
   - Персональный поиск рейсов и формирование подробных карточек пассажиров;
   - Построение интерактивной карты маршрутов и расчет телеметрии;
   - Формирование хроники оперативных событий;
   - Моделирование жизненных циклов и переходов между состояниями.
   ========================================================================== */

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

// Раздел «Информация» (Лента)
const eventsTimeline = document.getElementById("eventsTimeline");
const eventCategoryFilter = document.getElementById("eventCategoryFilter");

// Модальное окно демонстрации процессов
const openDemoBtn = document.getElementById("openDemoBtn");
const demoModal = document.getElementById("demoModal");
const closeDemoModalBtn = document.getElementById("closeDemoModalBtn");
const closeDemoModalFooterBtn = document.getElementById("closeDemoModalFooterBtn");
const demoFlightSelect = document.getElementById("demoFlightSelect");
const demoCurrentStateBadge = document.getElementById("demoCurrentStateBadge");
const demoStateChainView = document.getElementById("demoStateChainView");
const demoNextStepBtn = document.getElementById("demoNextStepBtn");
const demoDelayBtn = document.getElementById("demoDelayBtn");
const demoCancelBtn = document.getElementById("demoCancelBtn");
const demoGateChangeBtn = document.getElementById("demoGateChangeBtn");

// Всплывающее уведомление
const toastNotification = document.getElementById("toastNotification");

// ==========================================================================
// РАЗДЕЛ 4: ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================================================
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    currentTimeEl.textContent = `${h}:${m}:${s}`;

    const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const dateStr = now.toLocaleDateString("ru-RU", dateOptions);
    currentDateEl.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
}

function getCurrentTimeString() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    return `${h}:${m}:${s}`;
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
        case "Приземлился":
        case "Прибыл": return "status-arrived";
        case "Выдача багажа": return "status-baggage";
        case "Вылетел":
        case "Завершён": return "status-departed";
        case "Отменён": return "status-cancelled";
        default: return "status-ontime";
    }
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

        const matchesStatus = filterStatus === "Все" || flight.status === filterStatus;
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
            const isDelayed = flight.status === "Задержан";

            // Строка таблицы
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="flight-number">${escapeHtml(flight.flightNumber)}</td>
                <td class="flight-airline">${escapeHtml(flight.airline)}</td>
                <td><div class="flight-city">${escapeHtml(flight.destination)}</div></td>
                <td class="flight-time">${escapeHtml(flight.scheduledTime)}</td>
                <td class="flight-fact-time ${isDelayed ? 'delayed' : 'ontime'}">${escapeHtml(flight.actualTime)}</td>
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
                        <span class="flight-fact-time ${isDelayed ? 'delayed' : 'ontime'}">${escapeHtml(flight.actualTime)}</span>
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
    statDepCheckin.textContent = DEPARTURES_DATA.filter(f => f.status === "Регистрация").length;
    statDepBoarding.textContent = DEPARTURES_DATA.filter(f => f.status === "Посадка").length;
    statDepDelayed.textContent = DEPARTURES_DATA.filter(f => f.status === "Задержан").length;
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

        const matchesStatus = filterStatus === "Все" || flight.status === filterStatus;
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
            const isDelayed = flight.status === "Задерживается";

            // Строка таблицы
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="flight-number">${escapeHtml(flight.flightNumber)}</td>
                <td class="flight-airline">${escapeHtml(flight.airline)}</td>
                <td><div class="flight-city">${escapeHtml(flight.origin)}</div></td>
                <td class="flight-time">${escapeHtml(flight.scheduledTime)}</td>
                <td class="flight-fact-time ${isDelayed ? 'delayed' : 'ontime'}">${escapeHtml(flight.actualTime)}</td>
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
                        <span class="flight-fact-time ${isDelayed ? 'delayed' : 'ontime'}">${escapeHtml(flight.actualTime)}</span>
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
    statArrLanded.textContent = ARRIVALS_DATA.filter(f => f.status === "Приземлился").length;
    statArrBaggage.textContent = ARRIVALS_DATA.filter(f => f.status === "Выдача багажа").length;
    statArrDelayed.textContent = ARRIVALS_DATA.filter(f => f.status === "Задерживается").length;
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

        const routeOrigin = isDep ? "Москва (Северный)" : flight.origin;
        const routeDest = isDep ? flight.destination : "Москва (Северный)";

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
                    <span class="info-label">Актуальное время:</span>
                    <span class="info-value ${flight.delayReason ? 'flight-fact-time delayed' : ''}">${escapeHtml(flight.actualTime)}</span>
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
            <div class="event-time">${escapeHtml(ev.time)}</div>
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
    const newEvent = {
        id: Date.now(),
        time: getCurrentTimeString(),
        flightNumber,
        type,
        text
    };
    // Новые события всегда сверху!
    EVENTS_DATA.unshift(newEvent);
    renderEvents();
    showToast(`📢 ${type}: ${flightNumber} — ${text}`);
}

// ==========================================================================
// РАЗДЕЛ 10: УПРАВЛЕНИЕ И СМЕНА СТАТУСОВ РЕЙСОВ (ДЕМОНСТРАЦИЯ)
// ==========================================================================
function populateDemoModalFlights() {
    demoFlightSelect.innerHTML = "";

    const depGroup = document.createElement("optgroup");
    depGroup.label = "Вылеты";
    DEPARTURES_DATA.forEach(f => {
        const opt = document.createElement("option");
        opt.value = f.flightNumber;
        opt.textContent = `Вылет: ${f.flightNumber} ➔ ${f.destination} [${f.status}]`;
        depGroup.appendChild(opt);
    });
    demoFlightSelect.appendChild(depGroup);

    const arrGroup = document.createElement("optgroup");
    arrGroup.label = "Прилёты";
    ARRIVALS_DATA.forEach(f => {
        const opt = document.createElement("option");
        opt.value = f.flightNumber;
        opt.textContent = `Прилёт: ${f.flightNumber} ➔ из ${f.origin} [${f.status}]`;
        arrGroup.appendChild(opt);
    });
    demoFlightSelect.appendChild(arrGroup);

    updateDemoModalView();
}

function updateDemoModalView() {
    const flightNum = demoFlightSelect.value;
    const depFlight = DEPARTURES_DATA.find(f => f.flightNumber === flightNum);
    const arrFlight = ARRIVALS_DATA.find(f => f.flightNumber === flightNum);
    const flight = depFlight || arrFlight;

    if (!flight) return;

    const isDep = !!depFlight;
    demoCurrentStateBadge.textContent = flight.status;
    demoCurrentStateBadge.className = `status-badge ${getStatusCssClass(flight.status)}`;

    const chain = isDep ? DEPARTURE_STATE_CHAIN : ARRIVAL_STATE_CHAIN;

    demoStateChainView.innerHTML = "";
    chain.forEach((step, idx) => {
        const span = document.createElement("span");
        span.className = `chain-step ${flight.status === step ? 'active' : ''}`;
        span.textContent = step;
        demoStateChainView.appendChild(span);

        if (idx < chain.length - 1) {
            const arrow = document.createElement("span");
            arrow.className = "chain-arrow";
            arrow.textContent = "➔";
            demoStateChainView.appendChild(arrow);
        }
    });
}

function advanceFlightToNextState() {
    const flightNum = demoFlightSelect.value;
    const depFlight = DEPARTURES_DATA.find(f => f.flightNumber === flightNum);
    const arrFlight = ARRIVALS_DATA.find(f => f.flightNumber === flightNum);

    if (depFlight) {
        const curIdx = DEPARTURE_STATE_CHAIN.indexOf(depFlight.status);
        if (curIdx < DEPARTURE_STATE_CHAIN.length - 1) {
            const nextStatus = DEPARTURE_STATE_CHAIN[curIdx + 1];
            depFlight.status = nextStatus;
            depFlight.delayReason = "";

            let eventType = "Регистрация";
            let msg = `Для рейса ${depFlight.flightNumber} статус изменен на: ${nextStatus}`;
            if (nextStatus === "Регистрация") {
                eventType = "Регистрация";
                msg = `Началась регистрация на рейс ${depFlight.flightNumber} в ${depFlight.destination}, стойки ${depFlight.checkinDesks}`;
            } else if (nextStatus === "Посадка") {
                eventType = "Посадка";
                msg = `Началась посадка на рейс ${depFlight.flightNumber} в ${depFlight.destination}, выход ${depFlight.gate}`;
            } else if (nextStatus === "Вылетел") {
                eventType = "Вылет";
                msg = `Рейс ${depFlight.flightNumber} вылетел в ${depFlight.destination}`;
            }

            addAirportEvent(depFlight.flightNumber, eventType, msg);
        } else {
            showToast(`Рейс ${depFlight.flightNumber} уже находится в финальном состоянии (${depFlight.status})`);
        }
    } else if (arrFlight) {
        const curIdx = ARRIVAL_STATE_CHAIN.indexOf(arrFlight.status);
        if (curIdx < ARRIVAL_STATE_CHAIN.length - 1) {
            const nextStatus = ARRIVAL_STATE_CHAIN[curIdx + 1];
            arrFlight.status = nextStatus;
            arrFlight.delayReason = "";

            let eventType = "Прибытие";
            let msg = `Для рейса ${arrFlight.flightNumber} статус изменен на: ${nextStatus}`;

            if (nextStatus === "Приземлился") {
                eventType = "Прибытие";
                msg = `Рейс ${arrFlight.flightNumber} из ${arrFlight.origin} совершил посадку`;
            } else if (nextStatus === "Выдача багажа") {
                eventType = "Выдача багажа";
                if (!arrFlight.baggageBelt || arrFlight.baggageBelt === "—") arrFlight.baggageBelt = "Лента №2";
                msg = `Для рейса ${arrFlight.flightNumber} началась выдача багажа на ${arrFlight.baggageBelt}`;
            } else if (nextStatus === "Завершён") {
                eventType = "Прибытие";
                msg = `Обслуживание рейса ${arrFlight.flightNumber} из ${arrFlight.origin} завершено`;
            }

            addAirportEvent(arrFlight.flightNumber, eventType, msg);
        } else {
            showToast(`Рейс ${arrFlight.flightNumber} уже завершён (${arrFlight.status})`);
        }
    }

    refreshAllViews();
    updateDemoModalView();
}

function triggerFlightDelay() {
    const flightNum = demoFlightSelect.value;
    const depFlight = DEPARTURES_DATA.find(f => f.flightNumber === flightNum);
    const arrFlight = ARRIVALS_DATA.find(f => f.flightNumber === flightNum);
    const flight = depFlight || arrFlight;

    if (!flight) return;

    flight.status = depFlight ? "Задержан" : "Задерживается";
    flight.delayReason = "Техническая подготовка борта и загрузка питания";
    flight.actualTime = "17:45";

    addAirportEvent(
        flight.flightNumber,
        "Задержка",
        `Рейс ${flight.flightNumber} задержан до ${flight.actualTime}. Причина: ${flight.delayReason}`
    );

    refreshAllViews();
    updateDemoModalView();
}

function triggerFlightCancel() {
    const flightNum = demoFlightSelect.value;
    const depFlight = DEPARTURES_DATA.find(f => f.flightNumber === flightNum);
    const arrFlight = ARRIVALS_DATA.find(f => f.flightNumber === flightNum);
    const flight = depFlight || arrFlight;

    if (!flight) return;

    flight.status = "Отменён";
    flight.delayReason = "Неблагоприятные метеоусловия по маршруту следования";
    flight.actualTime = "—";

    addAirportEvent(
        flight.flightNumber,
        "Отмена",
        `Внимание! Рейс ${flight.flightNumber} отменён по метеоусловиям. Пассажирам обратиться к стойке представителя`
    );

    refreshAllViews();
    updateDemoModalView();
}

function triggerGateChange() {
    const flightNum = demoFlightSelect.value;
    const depFlight = DEPARTURES_DATA.find(f => f.flightNumber === flightNum);

    if (!depFlight) {
        showToast("Смена выхода применима только к вылетающим рейсам!");
        return;
    }

    const oldGate = depFlight.gate;
    const newGate = oldGate === "B15" ? "A02" : "B15";
    depFlight.gate = newGate;

    addAirportEvent(
        depFlight.flightNumber,
        "Посадка",
        `Выход на посадку рейса ${depFlight.flightNumber} в ${depFlight.destination} изменён с ${oldGate} на ${newGate}`
    );

    refreshAllViews();
    updateDemoModalView();
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
    depLastUpdateTime.textContent = getCurrentTimeString();
    setTimeout(() => {
        renderDepartures();
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
    arrLastUpdateTime.textContent = getCurrentTimeString();
    setTimeout(() => {
        renderArrivals();
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

// Лента информации
eventCategoryFilter.addEventListener("change", renderEvents);

// Модальное окно демо
openDemoBtn.addEventListener("click", () => {
    populateDemoModalFlights();
    demoModal.style.display = "flex";
});
closeDemoModalBtn.addEventListener("click", () => demoModal.style.display = "none");
closeDemoModalFooterBtn.addEventListener("click", () => demoModal.style.display = "none");
demoFlightSelect.addEventListener("change", updateDemoModalView);
demoNextStepBtn.addEventListener("click", advanceFlightToNextState);
demoDelayBtn.addEventListener("click", triggerFlightDelay);
demoCancelBtn.addEventListener("click", triggerFlightCancel);
demoGateChangeBtn.addEventListener("click", triggerGateChange);

// Закрытие модального окна по клику вне контента
window.addEventListener("click", (e) => {
    if (e.target === demoModal) {
        demoModal.style.display = "none";
    }
});

// ==========================================================================
// РАЗДЕЛ 13: ИНИЦИАЛИЗАЦИЯ ПРИ ЗАПУСКЕ
// ==========================================================================
function initApp() {
    updateClock();
    setInterval(updateClock, 1000);

    const startTime = getCurrentTimeString();
    depLastUpdateTime.textContent = startTime;
    arrLastUpdateTime.textContent = startTime;

    renderDepartures();
    renderArrivals();
    renderEvents();
}

document.addEventListener("DOMContentLoaded", initApp);
