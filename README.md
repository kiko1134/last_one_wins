# Last One Wins

## Описание на проекта

"Last One Wins" е интерактивна уеб базирана игра за трима играчи, при която всеки играч се опитва да отговори правилно на зададен въпрос възможно най-бързо, натискайки своя бутон. Играта се провежда в рундове, а целта е в крайна сметка да остане един победител (последният отговорил правилно, без да бъде отстранен).

Основният фокус на проекта е да се демонстрира цялостна уеб разработка, включваща:

- **Backend:** Настройка на сървър, API маршрути, логика за данни, запис и валидиране на отговори.
- **Frontend:** Създаване на потребителски интерфейс (UI), интеграция с backend, визуални елементи (таймер, точки), бутони за отговор.
- **Игрова логика и синхронизация:** Определяне на правилните отговори, ротация на реда на отговаряне, управление на таймера и прехвърляне на хода между играчите.

## Основна идея на играта

Всеки рунд се задава въпрос. Тримата играчи са представени с отделни бутони. Когато въпросът се появи, системата стартира таймер. Играчите се опитват да отговорят правилно, като натиснат своя бутон. Първият, който натисне бутона, дава своя отговор (ако има механизъм за въвеждане на отговор или системата автоматично отчита правилния/грешния отговор). Ако отговорът е правилен, играчът получава точки. Ако е грешен, следващият играч може да опита. Играта продължава в няколко рунда, докато не остане един победител.

## Основни компоненти

### Backend
- **Express сървър:** Настройване на Node.js/Express базиран бекенд, който обслужва API заявките.
- **API маршрути:**
    - GET: Зареждане на въпроси и отговори.
    - POST: Записване на резултати (точки) на играчите.
    - PUT/POST: Обработване на натискания на бутоните и определяне на текущия играч, който отговаря.
- **Логика за реда:** Определяне кой играч е на ход, и какво се случва при грешен отговор.
- **Съхранение на данни:** В масиви или база данни (по избор), в която се пазят въпросите, отговорите и текущия статус на играта.
- **Тестове:** Функционални тестове за проверка на API точките.

### Frontend
- **UI изграждане:** Създаване на HTML/CSS интерфейс за визуализиране на въпросите, текущите точки и три бутона за играчите.
- **Интеграция с Backend:** Използване на Fetch API или WebSocket за комуникация с бекенда.
- **Визуални елементи:**
    - Таймер: Отброява време до края на рунда.
    - Информация за текущия въпрос, отговорили играчи и точки.
- **Обработка на събития:** При натискане на бутон от играч да се изпраща заявка към бекенда за регистриране на действията.

### Логика и синхронизация
- **Определяне на правилен/грешен отговор:** Логиката, която при получен отговор определя дали е верен.
- **Управление на таймера:** Старт, пауза, стоп, рестартиране на таймера при всеки въпрос.
- **Синхронизация между играчите:** Следене на чия е "редицата" за отговаряне, и какво се случва при грешен отговор или липса на отговор в зададеното време.
- **Свързване на Backend и Frontend:** Гарантиране, че логиката за играта коректно синхронизира данните между сървъра и потребителския интерфейс.

## Използвани технологии

- **Backend:**
    - Node.js, Express
    - (Опционално) MongoDB или друга база данни
    - Тестове с Jest или Mocha
- **Frontend:**
    - HTML5, CSS3, JavaScript (Vanilla JS)
    - Fetch API или WebSocket за комуникация
- **Синхронизация и логика:**
    - JavaScript функции за обработка на логиката и тайминга
    - Модули за работа с таймери (setTimeout, setInterval)
    - Модули за валидация на отговорите

## Структура (примерна, търпи промени)

```
./
├── client/                  # Frontend частта
│   ├── src/
│   │   ├── css/             # CSS файлове или SASS/SCSS, ако се използва
│   │   ├── img/             # Статични изображения и ресурси
│   │   ├── js/             
│   │   │   ├── ui/          # Логика свързана с UI елементи (рендиране, ивенти)
│   │   │   ├── utils/       # Помощни функции за фронтенда
│   │   │   ├── api.js       # Логика за комуникация с бекенда (fetch / websocket)
│   │   │   └── main.js      # Основен JavaScript файл
│   │   └── index.html       # Основен HTML файл
│   └── package.json         
├── docs/                    # Документация и спецификации
│   ├── api-docs.md          # Документация за API (ендпойнти, формати на данни, примери)
│   ├── architecture.md      # Описание на общата архитектура
│   └── game-rules.md        # Подробно описание на игровата логика, правила, точкувания
├── game-logic/              # Отделен модул за игровата логика
│   ├── index.js             # Основна логика за играта (определяне на ходове, проверки на отговори)
│   ├── scoring.js           # Логика за точкуване
│   ├── state.js             # Управление на състоянието на играта
│   └── timer.js             # Логика за таймери и време за отговор
├── server/                  # Backend частта
│   ├── src/
│   │   ├── config/          # Конфигурационни файлове (env, бази данни)
│   │   ├── controllers/     # Логика свързана с входящи заявки (API endpoints)
│   │   ├── models/          # Data models (ако имаме база данни)
│   │   ├── routes/          # Дефиниции на Express маршрути
│   │   ├── services/        # Бизнес логика свързана с конкретни операции (например зареждане на въпроси)
│   │   ├── utils/           # Помощни функции за бекенда
│   │   └── app.js           # Основна входна точка за стартиране на сървъра
│   └── package.json         
├── .gitignore               
├── CONTRIBUTING.md          # Насоки за принос към проекта
├── LICENSE                  
└── README.md                

```

## Начин на работа

1. **Инсталиране на зависимости:**  
   Изпълнете `npm install` в основната папка или в `/backend` директорията за бекенд зависимостите.

2. **Стартиране на сървъра:**  
   `npm start` или `node server.js` в `/backend` директорията.

3. **Отваряне на фронтенда:**  
   Отворете `index.html` (в зависимост от конфигурацията може да е нужно да стартирате прост локален сървър).


## Цел на проекта

- Да се демонстрира способността за изграждане на пълноценна уеб апликация от нулата.
- Да се покаже как се организира екипна работа, разделяйки задачите между членове на екипа.
- Да се научат основните принципи на интеграция между frontend, backend и игрова логика.
- Да се опита създаване на игрова механика и синхронизация в реално време.

## Принос и кредит

- **Член 1:** Backend разработка
- **Член 2:** Frontend разработка
- **Член 3:** Логика на играта и синхронизация

Всеки член изпълнява своите роли и отговорности, като накрая всички части се обединяват, за да се получи цялостно работещо приложение.
