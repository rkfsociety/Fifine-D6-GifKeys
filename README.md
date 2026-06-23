# D6 GIF Keys — плагин с анимированными GIF на кнопках Fifine D6

Плагин для **FIFINE AmpliGame D6** (и совместимого ПО StreamDock / fifine Control Deck).

## Что внутри

| Действие | Описание |
|----------|----------|
| **GIF-кнопка** | Показывает анимированный GIF на клавише панели. Файл с диска или ссылка. |
| **Счётчик** | При нажатии увеличивает число на кнопке. Шаг и сброс в настройках. |
| **Открыть URL** | Открывает заданный адрес в браузере. |

## GIF-кнопка — как пользоваться

1. Перетащите действие **GIF-кнопка** на нужную клавишу D6.
2. В панели справа:
   - нажмите **Файл GIF** и выберите `.gif` на диске, **или**
   - вставьте прямую ссылку на GIF (должна открываться в браузере).
3. Настройте **FPS** (1–30) — скорость анимации на физической кнопке.
4. При необходимости добавьте **Подпись** поверх GIF.

### Как это работает

GIF разбирается на отдельные кадры (библиотека **omggif**) и поочерёдно отправляется на кнопку D6. Скорость — настройка **FPS**. Подложка кнопки (`default.jpg`) рисуется с прозрачностью **Фон %** (по умолчанию 50%).

Рекомендуемый размер GIF: **до 1–2 МБ**, разрешение около **126×126** или **72×72** для плавности.

## Требования

- Windows 10/11 (или macOS)
- **fifine Control Deck** / **FIFINE D6**
- Подключённый контроллер D6

## Установка

```powershell
cd "F:\github\Fifine-D6-GifKeys"
.\install.ps1 -Restart
```

Скрипт копирует плагин в `%APPDATA%\HotSpot\StreamDock\plugins\` и удаляет старую версию (`com.fifine.d6.starter.sdPlugin`). Флаг `-Restart` перезапускает fifine Control Deck (без него — перезапустите вручную).

```
%APPDATA%\HotSpot\StreamDock\plugins\
```

Перезапустите **fifine Control Deck**. Категория в библиотеке: **GIF-ключи D6** (англ. **D6 GIF Keys**).

## Структура проекта

```
com.fifine.d6.gifkeys.sdPlugin/
├── manifest.json
├── plugin/
│   ├── index.js           # логика действий
│   ├── gif.js             # загрузка и анимация GIF
│   └── utils/
├── propertyInspector/
│   ├── gifbutton/         # выбор файла / URL, превью
│   ├── counter/
│   └── openurl/
└── static/
```

SDK: `F:\github\PROG\StreamDock-Plugin-SDK` · Документация: [sdk.key123.vip](https://sdk.key123.vip/en/)

## Ссылки

- [Скачать ПО Fifine D6](https://fifinemicrophone.com/pages/download-fifine-d6-software)
- [Репозиторий](https://github.com/rkfsociety/Fifine-D6-GifKeys)
- [StreamDock Plugin SDK](https://github.com/MiraboxSpace/StreamDock-Plugin-SDK)
