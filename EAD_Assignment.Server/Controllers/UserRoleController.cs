using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using EAD_Assignment.Server.Models;
using Microsoft.AspNetCore.Authorization;
using EAD_Assignment.Server.Dtos;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace EAD_Assignment.Server.Controllers
{
    [ApiController]
    [Route("api/users/")]
    public class UserRoleController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly ILogger<UserRoleController> _logger;

        public UserRoleController(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, ILogger<UserRoleController> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger; // Initialize logger
        }

        //get all users
        [HttpGet]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> GetAllUsers()
        {
            // Ensure User.Identity.Name is not null
            if (User.Identity.Name == null)
            {
                _logger.LogWarning("User.Identity.Name is null.");
                return BadRequest("User is not authenticated.");
            }

            // Find the current user by username, assuming User.Identity.Name contains the username
            var currentUser = await _userManager.FindByNameAsync(User.Identity.Name);

            if (currentUser == null)
            {
                _logger.LogWarning($"User not found: {User.Identity.Name}");
                return NotFound("User not found.");
            }

            // Log the roles of the current user
            var currentRoles = await _userManager.GetRolesAsync(currentUser);
            _logger.LogInformation("Current User roles: {Roles}", string.Join(", ", currentRoles));

            // Get all users in the system
            var users = _userManager.Users.ToList();

            // For each user, load and include the roles in the response
            var userListWithRoles = new List<object>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userListWithRoles.Add(new
                {
                    user.FullName,
                    user.Email,
                    user.UserName,
                    Roles = roles // Add role names instead of role IDs
                });
            }

            return Ok(userListWithRoles);
        }

        //assign roles to uses
        [HttpPost("assign")]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> AssignRole([FromBody] AssignRole model)
        {
            // Find the user by email
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Check if the role exists
            if (!await _roleManager.RoleExistsAsync(model.Role))
            {
                return BadRequest("Role does not exist");
            }

            // Get all roles the user is currently in
            var currentRoles = await _userManager.GetRolesAsync(user);

            // Remove all current roles
            if (currentRoles.Count > 0)
            {
                var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!removeRolesResult.Succeeded)
                {
                    return BadRequest("Failed to remove existing roles");
                }
            }

            // Add the new role to the user
            var addRoleResult = await _userManager.AddToRoleAsync(user, model.Role);
            if (!addRoleResult.Succeeded)
            {
                return BadRequest(addRoleResult.Errors);
            }

            return Ok($"Role {model.Role} assigned to {user.Email}");
        }

        //get all roles
        [HttpGet("roles")]
        [Authorize(Roles = "administrator")]
        public IActionResult GetAllRoles()
        {
            var roles = _roleManager.Roles.ToList();

            if (roles == null || !roles.Any())
            {
                return NotFound("No roles found.");
            }

            var roleList = roles.Select(role => new
            {
                role.Id,
                role.Name
            });

            return Ok(roleList);
        }
    }
}
