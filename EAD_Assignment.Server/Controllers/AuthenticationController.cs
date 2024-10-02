using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using EAD_Assignment.Server.Dtos;
using EAD_Assignment.Server.Models;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Driver;

namespace EAD_Assignment.Server.Controllers
{
    [ApiController]
    [Route("api/")]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IConfiguration _config;

        public AuthenticationController(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            IConfiguration config)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _config = config;
        }

        // Create roles function
        [HttpPost]
        [Route("roles/add")]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleRequest request)
        {
            // Check if role already exists
            if (!await _roleManager.RoleExistsAsync(request.Role))
            {
                var appRole = new ApplicationRole { Name = request.Role };
                var createRole = await _roleManager.CreateAsync(appRole);

                if (!createRole.Succeeded)
                {
                    return BadRequest(new { message = "Failed to create role." });
                }
                return Ok(new { message = "Role created successfully." });
            }
            return BadRequest(new { message = "Role already exists." });
        }

        // Register function
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await RegisterAsync(request);

            return result.Success ? Ok(result) : BadRequest(result.Message);
        }

        private async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
        {
            try
            {
                // Check email availability
                var userExists = await _userManager.FindByEmailAsync(request.Email);
                if (userExists != null)
                    return new RegisterResponse { Message = "User already exists.", Success = false };

                // Create new user with NIC field
                var newUser = new ApplicationUser
                {
                    FullName = request.FullName,
                    Email = request.Email,
                    UserName = request.Username,
                    NIC = request.NIC, 
                    ConcurrencyStamp = Guid.NewGuid().ToString(),
                };

                var createUserResult = await _userManager.CreateAsync(newUser, request.Password);
                if (!createUserResult.Succeeded)
                {
                    return new RegisterResponse
                    {
                        Message = $"Creating user failed. {createUserResult.Errors.FirstOrDefault()?.Description}",
                        Success = false
                    };
                }

                // Assign user to the provided role from request
                string role = request.Role;

                // Check if the role exists; if not, create it
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    var roleResult = await _roleManager.CreateAsync(new ApplicationRole { Name = role });
                    if (!roleResult.Succeeded)
                    {
                        return new RegisterResponse
                        {
                            Message = $"Error creating '{role}' role: {roleResult.Errors.FirstOrDefault()?.Description}",
                            Success = false
                        };
                    }
                }

                // Assign user to the specified role
                var addUserRoleResult = await _userManager.AddToRoleAsync(newUser, role);
                if (!addUserRoleResult.Succeeded)
                {
                    return new RegisterResponse
                    {
                        Message = $"Create user succeeded, but couldn't assign the role '{role}'. {addUserRoleResult.Errors.FirstOrDefault()?.Description}",
                        Success = false
                    };
                }

                return new RegisterResponse
                {
                    Success = true,
                    Message = $"User: {request.Email} registered successfully with role '{role}'."
                };
            }
            catch (Exception ex)
            {
                return new RegisterResponse { Message = ex.Message, Success = false };
            }
        }

        // Login function
        [HttpPost]
        [Route("login")]
        [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(LoginResponse))]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await LoginAsync(request);
            return result.Success ? Ok(result) : BadRequest(new { message = result.Message });
        }

        private async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(request.Email);

                // Check if the user exists
                if (user == null)
                    return new LoginResponse { Message = "The email address you entered is not registered.", Success = false };

                // Validate password
                if (!await _userManager.CheckPasswordAsync(user, request.Password))
                    return new LoginResponse { Message = "The password you entered is incorrect. Please try again.", Success = false };

                // Get user roles (as role names)
                var roles = await _userManager.GetRolesAsync(user);

                // Generate JWT token
                var token = GenerateToken(user);

                return new LoginResponse
                {
                    AccessToken = token,
                    Message = "Login Successful. Welcome back!",
                    Email = user.Email,
                    UserName = user.UserName,
                    FullName = user.FullName,
                    Success = true,
                    UserId = user.Id.ToString(),
                    Roles = roles.ToList(),
                    NIC = user.NIC
                };
            }
            catch (Exception ex)
            {
                return new LoginResponse { Success = false, Message = "An unexpected error occurred. Please try again later." };
            }
        }


        //update user profile details
        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateUserProfile([FromBody] Dictionary<string, string> updateFields)
        {
            var user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Update only the fields that are provided
            if (updateFields.ContainsKey("userName") && !string.IsNullOrEmpty(updateFields["userName"]))
            {
                user.UserName = updateFields["userName"];
            }
            if (updateFields.ContainsKey("fullName") && !string.IsNullOrEmpty(updateFields["fullName"]))
            {
                user.FullName = updateFields["fullName"];
            }
            if (updateFields.ContainsKey("email") && !string.IsNullOrEmpty(updateFields["email"]))
            {
                user.Email = updateFields["email"];
            }

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { message = "User profile updated successfully." });
        }

        //delete user
        [HttpDelete("delete-user")]
        [Authorize]
        public async Task<IActionResult> DeleteUser()
        {
            var user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Error deleting user." });
            }

            return Ok(new { message = "User deleted successfully." });
        }

        //reset password
        [HttpPost("reset-password")]
        [Authorize]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Check if current password is valid
            var passwordValid = await _userManager.CheckPasswordAsync(user, request.CurrentPassword);
            if (!passwordValid)
            {
                return BadRequest(new { message = "Current password is incorrect." });
            }

            // Update password
            var resetResult = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

            if (!resetResult.Succeeded)
            {
                return BadRequest(new { message = "Error updating password." });
            }

            return Ok(new { message = "Password updated successfully." });
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            // Find the user by UserID
            var user = await _userManager.FindByIdAsync(userId);

            // Check if the user exists
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Return the user information
            var userDto = new UserDto
            {
                UserId = user.Id.ToString(), 
                UserName = user.UserName,
                FullName = user.FullName,
                Email = user.Email,
                NIC = user.NIC, 
                Roles = await _userManager.GetRolesAsync(user) 
            };

            return Ok(userDto);
        }

        private string GenerateToken(ApplicationUser user)
        {
            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
    };

            // Get user roles
            var roles = _userManager.GetRolesAsync(user).Result;
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"]));

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
