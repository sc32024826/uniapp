FROM node:alpine3.12 AS publish
ARG Version
WORKDIR /src
COPY . .
RUN npm install && npm run build

FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html/
COPY --from=publish /src/dist/build/h5 .