# MIT APP

## Hướng dẫn cài đặt

### Môi trường
- Node JS: v22.13.0
- MongoDB Compass: v1.37.0

### Cài đặt server

```bash
cd server
npm install
```

### Cài đặt client

```bash
cd client
npm install
```

### Chạy compiler

```bash
cd compiler
npm install
```

## Chạy ứng dụng

1. Chạy server

```bash
cd server
npm run dev
```

2. Chạy client

```bash
cd client
npm run start
```

3. Chạy compiler

```bash
cd compiler
npm run dev
```

## Khởi tạo database

Sau khi đã chạy server lên thành công, mở MongoDB Compass, mở database `mitute` và import data từ các file `.json` vào collection tương ứng:

- [`user.json`](./server/database/uat/uat.users.json)
<!-- - [`answer.json`](./server/database/uat/uat.answers.json) -->
- [`question.json`](./server/database/uat/uat.questions.json)
- [`questionBackup.json`](./server/database/uat/uat.questionsBackup.json)
- [`rounds.json`](./server/database/uat/uat.rounds.json)
- [`sessions.json`](./server/database/uat/uat.sessions.json)
- [`testcases.json`](./server/database/uat/uat.testcases.json)
- [`tests.json`](./server/database/uat/uat.tests.json)

## Sử dụng

Mở trình duyệt và truy cập vào địa chỉ [http://localhost:3000/login](http://localhost:3000/login) để đăng nhập ứng dụng.