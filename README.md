# Fifine D6 — плагин с GIF на кнопках

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

- В **интерфейсе ПО** GIF передаётся целиком (`data:image/gif;base64`) — анимация нативная.
- На **физической кнопке D6** (126×126) плагин снимает кадры с GIF и отправляет их на устройство — так работает железо Mirabox/Fifine.

Рекомендуемый размер GIF: **до 1–2 МБ**, разрешение около **126×126** или **72×72** для плавности.

## Требования

- Windows 10/11 (или macOS)
- **fifine Control Deck** / **FIFINE D6**
- Подключённый контроллер D6

## Установка

```powershell
.\install.ps1
```

Или вручную скопируйте `com.fifine.d6.starter.sdPlugin` в:

```
%APPDATA%\HotSpot\StreamDock\plugins\
```

Перезапустите **fifine Control Deck**. Категория в библиотеке: **Fifine D6 Starter**.

## Структура проекта

```
com.fifine.d6.starter.sdPlugin/
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
- [Репозиторий](https://github.com/rkfsociety/Fifine-D6-3555)
- [StreamDock Plugin SDK](https://github.com/MiraboxSpace/StreamDock-Plugin-SDK)
