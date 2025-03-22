FROM node:23

# Gerekli sistem bağımlılıklarını kur
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Paket dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları kur
RUN npm install

# Proje dosyalarını kopyala
COPY . .

# Uygulamayı çalıştır
CMD ["node", "app.js"]