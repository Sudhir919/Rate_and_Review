-- Update products with better placeholder image URLs that will actually display images
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center' WHERE id = 1 AND name LIKE '%Headphones%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center' WHERE id = 2 AND name LIKE '%T-Shirt%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center' WHERE id = 3 AND name LIKE '%Fitness Watch%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&crop=center' WHERE id = 4 AND name LIKE '%Water Bottle%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop&crop=center' WHERE id = 5 AND name LIKE '%Wireless%Charger%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center' WHERE id = 6 AND name LIKE '%Yoga Mat%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=center' WHERE id = 7 AND name LIKE '%Coffee Maker%';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center' WHERE id = 8 AND name LIKE '%Running Shoes%';
