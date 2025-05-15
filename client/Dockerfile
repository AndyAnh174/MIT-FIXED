FROM node:16-alpine

WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Expose cổng mặc định của React
EXPOSE 3000

# Khởi động ứng dụng
CMD ["npm", "run", "start"] 