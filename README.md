# Design Patterns: Шаблонний метод і Ітератор

Цей проект демонструє реалізацію двох патернів проектування: **Шаблонний метод (Template Method)** та **Ітератор (Iterator)**.

## Патерн Шаблонний метод

### Як реалізовано

Патерн **Шаблонний метод** реалізовано через базовий абстрактний клас `DataExporter`, який визначає фіксований алгоритм експорту даних користувачів з API.

**Структура алгоритму** (метод `export()`):

1. `load()` — завантаження даних з API
2. `transform()` — відбір полів (id, name, email, phone) та сортування за ім'ям
3. `beforeRender()` — hook перед рендерингом (наприклад, додавання заголовків для CSV)
4. `render()` — **абстрактний метод**, форматування даних у відповідний формат
5. `afterRender()` — hook після рендерингу
6. `save()` — **абстрактний метод**, збереження результату у файл

**Переваги**:

- Єдиний алгоритм для всіх форматів
- Підкласи перевизначають тільки специфічні кроки (`render()` та `save()`)
- Легко додавати нові формати експорту

### Як додати новий формат експорту

Щоб додати новий формат (наприклад, YAML), виконайте наступні кроки:

1. **Створіть новий клас** у папці `src/exporters/`:

```typescript
import { DataExporter } from "./DataExporter";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";

export class YamlExporter extends DataExporter {
  protected render(): string {
    // Реалізуйте форматування в YAML
    let yaml = "users:\n";
    for (const user of this.data) {
      yaml += `  - id: ${user.id}\n`;
      yaml += `    name: ${user.name}\n`;
      yaml += `    email: ${user.email}\n`;
      yaml += `    phone: ${user.phone}\n`;
    }
    return yaml;
  }

  protected save(): void {
    const filePath = "./output/users.yaml";
    const dir = dirname(filePath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(filePath, this.result, "utf-8");
  }
}
```

2. **Додайте новий експортер** у `src/main.ts`:

```typescript
import { YamlExporter } from "./exporters/YamlExporter";

const exporters = [
  new CsvExporter(),
  new JsonExporter(),
  new XmlExporter(),
  new YamlExporter(), // Новий експортер
];
```

3. **Запустіть застосунок** — новий формат буде експортовано автоматично!

## Патерн Ітератор

### Як реалізовано

Патерн **Ітератор** реалізовано через класи `CsvIterator`, `JsonIterator` та `XmlIterator`, які дозволяють читати експортовані файли по одному запису за раз, **не завантажуючи весь файл у пам'ять**.

**Ключові особливості**:

- Використання **асинхронних ітераторів** (`AsyncIterable<UserData>`)
- Читання файлів **потоково** через `createReadStream`
- Обробка даних **по рядку/елементу** без завантаження всього файлу

### Приклади використання ітераторів

**CSV Iterator**:

```typescript
for await (const user of new CsvIterator("./output/users.csv")) {
  console.log(user); // { id, name, email, phone }
}
```

**JSON Iterator**:

```typescript
for await (const user of new JsonIterator("./output/users.json")) {
  console.log(user);
}
```

**XML Iterator**:

```typescript
for await (const user of new XmlIterator("./output/users.xml")) {
  console.log(user);
}
```

### Переваги ітераторів

- **Ефективне використання пам'яті**: файли читаються потоково, а не завантажуються повністю
- **Уніфікований інтерфейс**: всі ітератори мають однаковий спосіб використання через `for await...of`
- **Lazy evaluation**: дані обробляються тільки коли потрібно

## Запуск застосунку

### Встановлення залежностей

```bash
npm install
```

### Експорт даних

Запустити експорт користувачів у всі формати (CSV, JSON, XML):

```bash
npx ts-node src/main.ts
```

Результат буде збережено у папці `./output/`:

- `users.csv`
- `users.json`
- `users.xml`

### Читання даних через ітератори

Запустити демонстрацію роботи ітераторів:

```bash
npx ts-node src/main-iterate.ts
```

Це зчитає створені файли та виведе користувачів у консоль.

## Структура проекту

```
src/
├── data/
│   └── UserData.ts          # Інтерфейс даних користувача
├── exporters/
│   ├── DataExporter.ts      # Базовий клас (Template Method)
│   ├── CsvExporter.ts       # Експорт у CSV
│   ├── JsonExporter.ts      # Експорт у JSON
│   └── XmlExporter.ts       # Експорт у XML
├── iterators/
│   ├── CsvIterator.ts       # Ітератор для CSV
│   ├── JsonIterator.ts      # Ітератор для JSON
│   └── XmlIterator.ts       # Ітератор для XML
├── main.ts                  # Запуск експорту
└── main-iterate.ts          # Демонстрація ітераторів
```