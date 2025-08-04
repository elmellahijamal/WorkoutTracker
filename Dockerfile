FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files with correct names
COPY ["WorkoutTracker/WorkoutTracker.API.csproj", "WorkoutTracker/"]
COPY ["WorkoutTracker.Application/WorkoutTracker.Application.csproj", "WorkoutTracker.Application/"]
COPY ["WorkoutTracker.Domain/WorkoutTracker.Domain.csproj", "WorkoutTracker.Domain/"]
COPY ["WorkoutTracker.Infrastructure/WorkoutTracker.Infrastructure.csproj", "WorkoutTracker.Infrastructure/"]

# Restore packages
RUN dotnet restore "WorkoutTracker/WorkoutTracker.API.csproj"

# Copy everything
COPY . .

# Build
WORKDIR "/src/WorkoutTracker"
RUN dotnet build "WorkoutTracker.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WorkoutTracker.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WorkoutTracker.API.dll"]