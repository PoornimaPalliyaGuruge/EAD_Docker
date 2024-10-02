using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using EAD_Assignment.Server.Models;
using System.Threading.Tasks;
using EAD_Assignment.Server.Dtos;
using System.Collections.Generic;

namespace EAD_Assignment.Server.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class ProductCategoryController : ControllerBase
    {
        private readonly IMongoCollection<ProductCategory> _categoryCollection;

        public ProductCategoryController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("EAD");
            _categoryCollection = database.GetCollection<ProductCategory>("ProductCategories");
        }

        // Create a new category 
        [HttpPost]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> CreateCategory([FromBody] ProductCategoryDto categoryDto)
        {
            var newCategory = new ProductCategory
            {
                Name = categoryDto.Name,
                Description = categoryDto.Description,
                IsActivated = categoryDto.IsActivated
            };

            await _categoryCollection.InsertOneAsync(newCategory);

            return Ok(new { message = "Category created successfully", newCategory });
        }

        // Get all categories
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _categoryCollection.Find(_ => true).ToListAsync();
            return Ok(categories);
        }

        // Update category 
        [HttpPut("{id}")]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> UpdateCategory(string id, [FromBody] ProductCategoryDto categoryDto)
        {
            var category = await _categoryCollection.Find(c => c.Id == id).FirstOrDefaultAsync();
            if (category == null)
            {
                return NotFound(new { message = "Category not found" });
            }

            var updateDefinition = Builders<ProductCategory>.Update
                .Set(c => c.Name, categoryDto.Name)
                .Set(c => c.Description, categoryDto.Description)
                .Set(c => c.IsActivated, categoryDto.IsActivated);

            await _categoryCollection.UpdateOneAsync(c => c.Id == id, updateDefinition);

            return Ok(new { message = "Category updated successfully" });
        }

        // Delete category 
        [HttpDelete("{id}")]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            var deleteResult = await _categoryCollection.DeleteOneAsync(c => c.Id == id);
            if (deleteResult.DeletedCount == 0)
            {
                return NotFound(new { message = "Category not found" });
            }

            return Ok(new { message = "Category deleted successfully" });
        }

        // Toggle category activation
        [HttpPut("toggle-activation/{id}")]
        [Authorize(Roles = "administrator")]
        public async Task<IActionResult> ToggleActivation(string id)
        {
            var category = await _categoryCollection.Find(c => c.Id == id).FirstOrDefaultAsync();
            if (category == null)
            {
                return NotFound(new { message = "Category not found" });
            }

            category.IsActivated = !category.IsActivated;
            await _categoryCollection.ReplaceOneAsync(c => c.Id == id, category);

            return Ok(new { message = $"Category {(category.IsActivated ? "activated" : "deactivated")}" });
        }
    }
}
