using FluentAssertions;
using Moq;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Application.Handlers;
using WorkoutTracker.Domain.Entities;
using WorkoutTracker.Domain.Exceptions;
using WorkoutTracker.Domain.Interfaces;

namespace WorkoutTracker.Tests.Handlers
{
    public class CreateWorkoutHandlerTests
    {
        private readonly Mock<IWorkoutRepository> _mockWorkoutRepository;
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly CreateWorkoutHandler _handler;

        public CreateWorkoutHandlerTests()
        {
            _mockWorkoutRepository = new Mock<IWorkoutRepository>();
            _mockUserRepository = new Mock<IUserRepository>();
            _handler = new CreateWorkoutHandler(_mockWorkoutRepository.Object, _mockUserRepository.Object);
        }

        [Fact]
        public async Task Handle_ValidRequest_ReturnsWorkoutId()
        {
            // Arrange
            var command = new CreateWorkoutCommand
            {
                Name = "Push Day",
                Date = DateTime.UtcNow,
                UserId = 1
            };

            var expectedWorkout = new Workout
            {
                Id = 1,
                Name = "Push Day",
                Date = command.Date,
                UserId = 1,
                IsCompleted = false
            };

            _mockUserRepository.Setup(x => x.ExistsAsync(1)).ReturnsAsync(true);
            _mockWorkoutRepository.Setup(x => x.AddAsync(It.IsAny<Workout>())).ReturnsAsync(expectedWorkout);

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            result.Should().Be(1);
            _mockUserRepository.Verify(x => x.ExistsAsync(1), Times.Once);
            _mockWorkoutRepository.Verify(x => x.AddAsync(It.IsAny<Workout>()), Times.Once);
        }

        [Fact]
        public async Task Handle_UserNotExists_ThrowsBusinessException()
        {
            // Arrange
            var command = new CreateWorkoutCommand
            {
                Name = "Push Day",
                Date = DateTime.UtcNow,
                UserId = 999
            };

            _mockUserRepository.Setup(x => x.ExistsAsync(999)).ReturnsAsync(false);

            // Act & Assert
            await Assert.ThrowsAsync<BusinessException>(() =>
                _handler.Handle(command, CancellationToken.None));

            _mockUserRepository.Verify(x => x.ExistsAsync(999), Times.Once);
            _mockWorkoutRepository.Verify(x => x.AddAsync(It.IsAny<Workout>()), Times.Never);
        }
    }
}