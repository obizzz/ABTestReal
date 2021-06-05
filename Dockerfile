FROM mcr.microsoft.com/dotnet/aspnet:5.0 as base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:5.0 as build

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y \
        nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY ABTestReal/ABTestReal.csproj ABTestReal/

RUN dotnet restore ABTestReal/ABTestReal.csproj
COPY . . 
WORKDIR /src/ABTestReal/
RUN dotnet build ABTestReal.csproj -c Release -o /app/build

FROM build as publish
RUN dotnet publish ABTestReal.csproj -c Release -o /app/publish

FROM base as final
WORKDIR /app
COPY --from=publish /app/publish .
CMD ASPNETCORE_URLS=http://*:$PORT dotnet ABTestReal.dll