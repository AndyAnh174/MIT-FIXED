# Hướng dẫn chạy ứng dụng MIT-APP-2022 với Docker

## Yêu cầu

- Đã cài đặt Docker và Docker Compose

## Các bước chạy ứng dụng

### 1. Chạy ứng dụng với Docker Compose

```bash
# Di chuyển vào thư mục client
cd client

# Chạy ứng dụng với Docker Compose
docker-compose up
```

Ứng dụng sẽ được khởi chạy tại địa chỉ [http://localhost:3000](http://localhost:3000)

### 2. Dừng ứng dụng

```bash
# Nhấn Ctrl+C để dừng ứng dụng
# Hoặc chạy lệnh sau từ terminal khác
docker-compose down
```

### 3. Xây dựng lại image (khi có thay đổi về dependencies)

```bash
docker-compose up --build
```

## Lưu ý

- Các thay đổi trong thư mục `src` và `public` sẽ được cập nhật tự động nhờ tính năng hot-reload
- Nếu thay đổi các file khác như `package.json`, bạn cần xây dựng lại image với lệnh `docker-compose up --build`
