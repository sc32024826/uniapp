FROM node:alpine AS publish
ARG Version
WORKDIR /src
COPY . .
RUN npm install && npm run build

FROM nginx:alpine AS final
ENV app_version=$Version
WORKDIR /usr/share/nginx/html/
COPY --from=publish /src/dist/build/h5 .