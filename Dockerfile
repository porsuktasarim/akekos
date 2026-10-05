FROM node:20-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates gnupg wget supervisor \
    && wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc \
    | gpg --dearmor > /usr/share/keyrings/mongodb-server-7.0.gpg \
    && echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" \
       > /etc/apt/sources.list.d/mongodb-org-7.0.list \
    && apt-get update && apt-get install -y --no-install-recommends mongodb-org-server \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /data/db /var/log/mongodb /var/log/supervisor

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
COPY supervisord.conf /etc/supervisord.conf

EXPOSE 3027

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
