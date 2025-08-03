using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using WorkoutTracker.Domain.Entities;
using WorkoutTracker.Infrastructure;
using WorkoutTracker.Infrastructure.Repositories;

namespace WorkoutTracker.Tests.Repositories
{
    public class UserRepositoryTests : IDisposable
    {
        private readonly WorkoutTrackerDbContext _context;
        private readonly UserRepository _repository;

        public UserRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<WorkoutTrackerDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new WorkoutTrackerDbContext(options);
            _repository = new UserRepository(_context);
        }

        [Fact]
        public async Task AddAsync_ValidUser_ReturnsUserWithId()
        {
            // Arrange
            var user = new User
            {
                Name = "John Doe",
                Username = "john",
                Email = "john@test.com",
                PasswordHash = "hashedpassword",
                CreatedAt = DateTime.UtcNow
            };

            // Act
            var result = await _repository.AddAsync(user);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().BeGreaterThan(0);
            result.Name.Should().Be("John Doe");
            result.Username.Should().Be("john");
        }

        [Fact]
        public async Task GetByIdAsync_ExistingUser_ReturnsUser()
        {
            // Arrange
            var user = new User
            {
                Name = "Jane Doe",
                Username = "jane",
                Email = "jane@test.com",
                PasswordHash = "hashedpassword",
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(user);

            // Act
            var result = await _repository.GetByIdAsync(user.Id);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be("Jane Doe");
            result.Username.Should().Be("jane");
        }

        [Fact]
        public async Task ExistsAsync_ExistingUser_ReturnsTrue()
        {
            // Arrange
            var user = new User
            {
                Name = "Test User",
                Username = "test",
                Email = "test@test.com",
                PasswordHash = "hashedpassword",
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(user);

            // Act
            var result = await _repository.ExistsAsync(user.Id);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public async Task ExistsAsync_NonExistingUser_ReturnsFalse()
        {
            // Act
            var result = await _repository.ExistsAsync(999);

            // Assert
            result.Should().BeFalse();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}