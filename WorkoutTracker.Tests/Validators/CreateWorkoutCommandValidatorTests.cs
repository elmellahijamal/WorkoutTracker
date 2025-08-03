using FluentAssertions;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Application.Validators;

namespace WorkoutTracker.Tests.Validators
{
    public class CreateWorkoutCommandValidatorTests
    {
        private readonly CreateWorkoutCommandValidator _validator;

        public CreateWorkoutCommandValidatorTests()
        {
            _validator = new CreateWorkoutCommandValidator();
        }

        [Fact]
        public void Validate_ValidCommand_ShouldNotHaveErrors()
        {
            // Arrange
            var command = new CreateWorkoutCommand
            {
                Name = "Push Day",
                Date = DateTime.Today,
                UserId = 1
            };

            // Act
            var result = _validator.Validate(command);

            // Assert
            result.IsValid.Should().BeTrue();
            result.Errors.Should().BeEmpty();
        }

        [Fact]
        public void Validate_EmptyName_ShouldHaveError()
        {
            // Arrange
            var command = new CreateWorkoutCommand
            {
                Name = "",
                Date = DateTime.Today,
                UserId = 1
            };

            // Act
            var result = _validator.Validate(command);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(x => x.PropertyName == "Name");
        }

        [Fact]
        public void Validate_NameTooLong_ShouldHaveError()
        {
            // Arrange
            var command = new CreateWorkoutCommand
            {
                Name = new string('A', 101), // 101 characters
                Date = DateTime.Today,
                UserId = 1
            };

            // Act
            var result = _validator.Validate(command);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(x => x.PropertyName == "Name");
        }

        [Fact]
        public void Validate_InvalidUserId_ShouldHaveError()
        {
            // Arrange
            var command = new CreateWorkoutCommand
            {
                Name = "Push Day",
                Date = DateTime.Today,
                UserId = 0
            };

            // Act
            var result = _validator.Validate(command);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(x => x.PropertyName == "UserId");
        }

        [Fact]
        public void Validate_DateTooOld_ShouldHaveError()
        {
            // Arrange
            var command = new CreateWorkoutCommand
            {
                Name = "Push Day",
                Date = DateTime.Today.AddDays(-31), // More than 30 days ago
                UserId = 1
            };

            // Act
            var result = _validator.Validate(command);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(x => x.PropertyName == "Date");
        }
    }
}