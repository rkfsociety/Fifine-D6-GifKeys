# Fifine D6 — стартовый плагин

Плагин для **FIFINE AmpliGame D6** (и совместимого ПО StreamDock / fifine Control Deck). Два готовых действия для изучения SDK и дальнейшей разработки.

## Что внутри

| Действие | Описание |
|----------|----------|
| **Счётчик** | При нажатии увеличивает число на кнопке. Шаг и сброс настраиваются в панели свойств. |
| **Открыть URL** | Открывает заданный адрес в браузере по нажатию кнопки. |

## Требования

- Windows 10/11 (или macOS — плагин кроссплатформенный)
- Установленное ПО **fifine Control Deck** / **FIFINE D6**
- Подключённый контроллер D6

## Установка

### Вариант 1 — скрипт (Windows)

```powershell
.\install.ps1
```

Скрипт копирует папку `com.fifine.d6.starter.sdPlugin` в каталог плагинов и предлагает перезапустить ПО.

### Вариант 2 — вручную

1. Скопируйте папку `com.fifine.d6.starter.sdPlugin` в:

   ```
   %APPDATA%\HotSpot\StreamDock\plugins\
   ```

   На вашем ПК это обычно:

   `C:\Users\<имя>\AppData\Roaming\HotSpot\StreamDock\plugins\`

2. Перезапустите **fifine Control Deck**.

3. В библиотеке действий найдите категорию **Fifine D6 Starter** и перетащите действие на кнопку.

## Разработка

Плагин основан на [StreamDock Plugin SDK](https://github.com/MiraboxSpace/StreamDock-Plugin-SDK) (JavaScript-шаблон). SDK клонируется в `F:\github\PROG\StreamDock-Plugin-SDK`.

### Структура

```
com.fifine.d6.starter.sdPlugin/
├── manifest.json          # метаданные и список действий
├── en.json / ru.json      # локализация
├── plugin/
│   ├── index.html         # точка входа (фоновый процесс плагина)
│   ├── index.js           # логика действий
│   └── utils/             # WebSocket, таймеры
├── propertyInspector/       # панели настроек для каждого действия
│   ├── counter/
│   └── openurl/
└── static/                # иконки и стили
```

### Как добавить новое действие

1. Добавьте запись в `manifest.json` → `Actions` (уникальный `UUID`, например `com.fifine.d6.starter.myaction`).
2. Создайте обработчик в `plugin/index.js` — имя свойства должно совпадать с последней частью UUID (`myaction`).
3. Добавьте папку `propertyInspector/myaction/` с `index.html` и `index.js`.
4. Обновите `ru.json` и `en.json`.
5. Запустите `.\install.ps1` и перезапустите ПО.

### События и API

- Документация SDK: [sdk.key123.vip](https://sdk.key123.vip/en/)
- События: `willAppear`, `keyUp`, `didReceiveSettings`
- Отправка: `setTitle`, `setSettings`, `openUrl`, `setImage`, `setState`

### Node.js для сложной логики

Если нужны системные вызовы (запуск программ, работа с файлами), используйте шаблон **SDNodeJsSDK** из того же репозитория SDK — он запускает Node.js внутри хоста.

## Публикация

Готовый плагин можно опубликовать в [Space Platform](https://space.key123.vip/) (магазин плагинов StreamDock / Mirabox).

## Ссылки

- [Скачать ПО Fifine D6](https://fifinemicrophone.com/pages/download-fifine-d6-software)
- [StreamDock Plugin SDK](https://github.com/MiraboxSpace/StreamDock-Plugin-SDK)
- [Документация SDK](https://sdk.key123.vip/en/)
