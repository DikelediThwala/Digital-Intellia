
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore "DigitalIntellia.csproj"
RUN dotnet publish "DigitalIntellia.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["sh", "-c", "dotnet DigitalIntellia.dll --urls http://0.0.0.0:${PORT:-10000}"]