-- Seed data for the ratings and review system

-- Insert sample users
INSERT INTO users (email, name) VALUES
('john.doe@example.com', 'John Doe'),
('jane.smith@example.com', 'Jane Smith'),
('mike.johnson@example.com', 'Mike Johnson'),
('sarah.wilson@example.com', 'Sarah Wilson'),
('david.brown@example.com', 'David Brown')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products with proper image URLs
INSERT INTO products (name, description, image_url, price, category) VALUES
('Wireless Bluetooth Headphones', 'High-quality wireless headphones with noise cancellation and 30-hour battery life.', '/placeholder.svg?height=400&width=400', 199.99, 'Electronics'),
('Organic Cotton T-Shirt', 'Comfortable and sustainable organic cotton t-shirt available in multiple colors.', '/placeholder.svg?height=400&width=400', 29.99, 'Clothing'),
('Smart Fitness Watch', 'Advanced fitness tracker with heart rate monitoring, GPS, and sleep tracking.', '/placeholder.svg?height=400&width=400', 299.99, 'Electronics'),
('Eco-Friendly Water Bottle', 'Stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.', '/placeholder.svg?height=400&width=400', 34.99, 'Lifestyle'),
('Wireless Phone Charger', 'Fast wireless charging pad compatible with all Qi-enabled devices.', '/placeholder.svg?height=400&width=400', 49.99, 'Electronics'),
('Yoga Mat Premium', 'Non-slip yoga mat made from natural rubber with excellent grip and cushioning.', '/placeholder.svg?height=400&width=400', 79.99, 'Fitness'),
('Coffee Maker Deluxe', 'Programmable coffee maker with built-in grinder and thermal carafe.', '/placeholder.svg?height=400&width=400', 159.99, 'Kitchen'),
('Running Shoes Pro', 'Lightweight running shoes with advanced cushioning and breathable mesh upper.', '/placeholder.svg?height=400&width=400', 129.99, 'Footwear')
ON CONFLICT DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (user_id, product_id, rating, review_text, tags) VALUES
(1, 1, 5, 'Amazing sound quality and the battery life is incredible. Perfect for long flights!', ARRAY['excellent', 'battery life', 'sound quality']),
(2, 1, 4, 'Great headphones but a bit heavy for extended use. Sound is crystal clear though.', ARRAY['heavy', 'sound quality', 'good']),
(3, 2, 5, 'Super comfortable and the fabric feels really soft. Great value for money!', ARRAY['comfortable', 'soft', 'value']),
(4, 3, 4, 'Accurate fitness tracking and the GPS works well. Battery could be better.', ARRAY['accurate', 'GPS', 'battery']),
(5, 4, 5, 'Keeps my drinks cold all day. The design is sleek and it fits perfectly in my car cup holder.', ARRAY['cold', 'sleek', 'perfect fit']),
(1, 5, 3, 'Charges my phone but it gets quite warm during use. Works as expected otherwise.', ARRAY['warm', 'works', 'charging']),
(2, 6, 5, 'Best yoga mat I have ever used! Great grip and very comfortable for long sessions.', ARRAY['best', 'grip', 'comfortable']),
(3, 7, 4, 'Makes excellent coffee and the grinder is convenient. A bit noisy in the morning though.', ARRAY['excellent coffee', 'convenient', 'noisy'])
ON CONFLICT (user_id, product_id) DO NOTHING;
