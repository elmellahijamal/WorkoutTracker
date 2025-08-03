FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["WorkoutTracker/WorkoutTracker.csproj", "WorkoutTracker/"]
COPY ["WorkoutTracker.Application/WorkoutTracker.Application.csproj", "WorkoutTracker.Application/"]
COPY ["WorkoutTracker.Domain/WorkoutTracker.Domain.csproj", "WorkoutTracker.Domain/"]
COPY ["WorkoutTracker.Infrastructure/WorkoutTracker.Infrastructure.csproj", "WorkoutTracker.Infrastructure/"]
RUN dotnet restore "WorkoutTracker/WorkoutTracker.csproj"
COPY . .
WORKDIR "/src/WorkoutTracker"
RUN dotnet build "WorkoutTracker.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WorkoutTracker.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WorkoutTracker.dll"]