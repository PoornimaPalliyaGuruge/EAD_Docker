using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using EAD_Assignment.Server.Models;
using System.Threading.Tasks;
using System.Security.Claims;
using EAD_Assignment.Server.Dtos;
using Microsoft.AspNetCore.Identity;
using System;
using System.IO;

namespace EAD_Assignment.Server.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        private readonly IMongoCollection<Product> _productCollection;
        private readonly IMongoCollection<ProductCategory> _categoryCollection; 
        private readonly UserManager<ApplicationUser> _userManager;

        public ProductController(IMongoClient mongoClient, UserManager<ApplicationUser> userManager)
        {
            var database = mongoClient.GetDatabase("EAD"); // Database configuration
            _productCollection = database.GetCollection<Product>("Products");
            _categoryCollection = database.GetCollection<ProductCategory>("ProductCategories"); // Initialize ProductCategory collection
            _userManager = userManager;
        }

        // Creates a product
        [HttpPost]
        [Authorize(Roles = "vendor")]
        public async Task<IActionResult> CreateProduct([FromForm] ProductDto productDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get the current logged-in vendor's Id

                // Validate the selected category
                var category = await _categoryCollection
                    .Find(c => c.Id == productDto.CategoryId && c.IsActivated)
                    .FirstOrDefaultAsync();

                if (category == null)
                {
                    return BadRequest(new { message = "Invalid or inactive category." });
                }

                // Validate the uploaded image
                if (productDto.Image == null || productDto.Image.Length == 0)
                {
                    return BadRequest(new { message = "Image file is required." });
                }

                // Check if images directory exists
                var imageDirectory = Path.Combine("wwwroot", "images");
                if (!Directory.Exists(imageDirectory))
                {
                    Directory.CreateDirectory(imageDirectory);
                }

                // Save the image file
                var imageFileName = Guid.NewGuid().ToString() + Path.GetExtension(productDto.Image.FileName);
                var imagePath = Path.Combine(imageDirectory, imageFileName);

                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await productDto.Image.CopyToAsync(stream);
                }

                // Create the product object with the CategoryName included
                var product = new Product
                {
                    ProductId = Guid.NewGuid().ToString(),
                    Name = productDto.Name,
                    Description = productDto.Description,
                    Price = productDto.Price,
                    CategoryId = productDto.CategoryId,
                    CategoryName = category.Name, // Store the category name
                    Image = "/images/" + imageFileName,
                    VendorId = userId,
                    Quantity = productDto.Quantity,
                    WarningLimit = productDto.WarningLimit
                };

                // Insert product into database
                await _productCollection.InsertOneAsync(product);

                // Return success response
                return Ok(new { message = "Product created successfully", product });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An unexpected error occurred: {ex.Message}");
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
        }

        [HttpPut("update/{id}")]
        [Authorize(Roles = "vendor")]
        public async Task<IActionResult> UpdateProduct(string id, [FromBody] dynamic updateDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Ensure that the product belongs to the logged-in vendor
            var product = await _productCollection.Find(p => p.Id == id && p.VendorId == userId).FirstOrDefaultAsync();
            if (product == null)
            {
                return NotFound(new { message = "Product not found or you do not have permission to edit this product" });
            }

            // Check and update only the provided fields
            if (updateDto.Name != null)
            {
                product.Name = updateDto.Name;
            }

            if (updateDto.Description != null)
            {
                product.Description = updateDto.Description;
            }

            if (updateDto.Price != null && updateDto.Price > 0)
            {
                product.Price = updateDto.Price;
            }

            if (updateDto.CategoryId != null)
            {
                string categoryId = (string)updateDto.CategoryId;

                // get the category name from the ProductCategory table
                var category = await _categoryCollection.Find(c => c.Id == categoryId).FirstOrDefaultAsync();
                if (category != null)
                {
                    product.CategoryId = categoryId;
                    product.CategoryName = category.Name;
                }
                else
                {
                    return BadRequest(new { message = "Invalid category ID" });
                }
            }


            if (updateDto.Quantity != null)
            {
                product.Quantity = updateDto.Quantity;
            }

            if (updateDto.WarningLimit != null)
            {
                product.WarningLimit = updateDto.WarningLimit;
            }

            // Save the updated product to the database
            await _productCollection.ReplaceOneAsync(p => p.Id == id, product);

            return Ok(new { message = "Product updated successfully", product });
        }

        // Update product image
        [HttpPut("update-image/{id}")]
        [Authorize(Roles = "vendor")]
        public async Task<IActionResult> UpdateProductImage(string id, [FromForm] IFormFile image)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var product = await _productCollection.Find(p => p.Id == id && p.VendorId == userId).FirstOrDefaultAsync();
            if (product == null)
            {
                return NotFound(new { message = "Product not found or you do not have permission to edit this product" });
            }

            if (image == null || image.Length == 0)
            {
                return BadRequest(new { message = "Image file is required." });
            }

            var imageFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var imagePath = Path.Combine("wwwroot/images", imageFileName);

            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var updatedImageUrl = "/images/" + imageFileName;
            var updateDefinition = Builders<Product>.Update.Set(p => p.Image, updatedImageUrl);
            await _productCollection.UpdateOneAsync(p => p.Id == id, updateDefinition);

            return Ok(new { message = "Product image updated successfully", image = updatedImageUrl });
        }

        // Deletes a product
        [HttpDelete("{id}")]
        [Authorize(Roles = "vendor")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get the current logged-in vendor's Id

            var deleteResult = await _productCollection.DeleteOneAsync(p => p.Id == id && p.VendorId == userId);

            if (deleteResult.DeletedCount == 0)
            {
                return NotFound(new { message = "Product not found or you do not have permission to delete this product" });
            }

            return Ok(new { message = "Product deleted successfully" });
        }

        // Get all products of a specific vendor
        [HttpGet("vendor")]
        [Authorize(Roles = "vendor,administrator")]
        public async Task<IActionResult> GetVendorProducts()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var products = await _productCollection.Find(p => p.VendorId == userId).ToListAsync();

            return Ok(products);
        }


        // Get all products
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            // Find active categories
            var activatedCategories = await _categoryCollection.Find(c => c.IsActivated).ToListAsync();

            //Get category id
            var activatedCategoryIds = activatedCategories.Select(c => c.Id).ToList();

            // get products with activated categories
            var products = await _productCollection.Find(p => activatedCategoryIds.Contains(p.CategoryId)).ToListAsync();

            return Ok(products);
        }


        // Get a product by id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(string id)
        {
            // Find the product by id
            var product = await _productCollection.Find(p => p.Id == id).FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            return Ok(product);
        }
    }
}
