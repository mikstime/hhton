# hhton

# О проекте

hhton – сервис для поиска команды и участия в хакатонах.

## Запуск проекта

Установить зависимости `yarn install`

Запустить в режиме разработки `yarn start:react`

## Структура приложения

### Доступ к данным

Основное состояние хранится в специальном контексте, доступ к которому можно
получить через `useAppState()`.

Для более подробной информации стоит взглянуть на возвращаемый 
`_useAppState()` тип. 

Расположение: `src/tools/use-app-state/use-app-state.ts`

## Описание взаимодействия пользователя с приложением.

Точка входа 