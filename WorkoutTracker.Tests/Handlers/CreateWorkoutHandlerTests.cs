using FluentAssertions;
using Moq;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Application.DTOs;
using WorkoutTracker.Application.Handlers;
using WorkoutTracker.Domain.Entities;
using WorkoutTracker.Domain.Exceptions;
using WorkoutTracker.Domain.Interfaces;
using WorkoutTracker.Domain.ValueObjects;

namespace WorkoutTracker.Tests.Handlers
{
    public class CreateWorkoutHandlerTests
    {
        private readonly Mock<IWorkoutRepository> _mockWorkoutRepository;
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly Mock<IExerciseRepository> _mockExerciseRepository;
        private readonly CreateWorkoutHandler _handler;

        public CreateWorkoutHandlerTests()
        {
            _mockWorkoutRepository = new Mock<IWorkoutRepository>();
            _mockUserRepository = new Mock<IUserRepository>();
            _mockExerciseRepository = new Mock<IExerciseRepository>();

            _handler = new CreateWorkoutHandler(
                _mockWorkoutRepository.Object,
                _mockUserRepository.Object,
                _mockExerciseRepository.Object);
        }

        [Fact]
        public async Task Handle_ValidRequest_ReturnsWorkoutId()
        {
            // Arrange
            var command = new CreateWorkoutCommand
            {
                Name = "Push Day",
                Date = DateTime.UtcNow,
                UserId = 1,
                CoachId = 2,
                Exercises = new List<AddExerciseToWorkoutDto>() // Include exercises if needed
            };

            var expectedWorkout = new Workout
            {
                Id = 1,
                Name = "Push Day",
                Date = command.Date,
                UserId = 1,
                IsCompleted = false
            };

            _mockUserRepository.Setup(x => x.GetByIdAsync(2))
                .ReturnsAsync(new User { Id = 2, Role = UserRole.Coach });

            _mockUserRepository.Setup(x => x.GetByIdAsync(1))
                .ReturnsAsync(new User { Id = 1 });

            _mockWorkoutRepository.Setup(x => x.AddAsync(It.IsAny<Workout>()))
                .ReturnsAsync(expectedWorkout);

            // Act
            var result = await _handler.Handle(command, CancellationToken.None);

            // Assert
            result.Should().Be(1);
            _mockUserRepository.Verify(x => x.GetByIdAsync(1), Times.Once);
            _mockWorkoutRepository.Verify(x => x.AddAsync(It.IsAny<Workout>()), Times.Once);
        }

        [Fact]
        public async Task Handle_UserNotExists_ThrowsNotFoundException()
        {
            // Arrange
            var command = new CreateWorkoutCommand
            {
                Name = "Push Day",
                Date = DateTime.UtcNow,
                UserId = 999,
                CoachId = 1,
                Exercises = new List<AddExerciseToWorkoutDto>()
            };

            _mockUserRepository.Setup(x => x.GetByIdAsync(1))
                .ReturnsAsync(new User { Id = 1, Role = UserRole.Coach });

            _mockUserRepository.Setup(x => x.GetByIdAsync(999))
                .ReturnsAsync((User?)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() =>
                _handler.Handle(command, CancellationToken.None));

            _mockUserRepository.Verify(x => x.GetByIdAsync(999), Times.Once);
            _mockWorkoutRepository.Verify(x => x.AddAsync(It.IsAny<Workout>()), Times.Never);
        }
    }
}
