FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-builder
WORKDIR /src

COPY server/src/API/*.csproj ./API/
COPY server/src/Application/*.csproj ./Application/
COPY server/src/Domain/*.csproj ./Domain/
COPY server/src/Infrastructure/*.csproj ./Infrastructure/

RUN dotnet restore ./API/*.csproj

COPY server/src/ .
RUN dotnet publish ./API/*.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

COPY --from=backend-builder /app/publish .

RUN rm -rf /etc/nginx/sites-enabled/* /etc/nginx/sites-available/* /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/sites-available/default
RUN mkdir -p /etc/nginx/sites-enabled && ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

ENV ASPNETCORE_URLS=http://127.0.0.1:5182

EXPOSE 80

CMD service nginx start && dotnet $(ls *.deps.json | head -n 1 | sed 's/\.deps\.json$/.dll/')