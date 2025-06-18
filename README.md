# Product Reviews & Ratings System

A comprehensive web application for product reviews and ratings built with Next.js, PostgreSQL, and modern web technologies.

## 🌟 Features

### Core Functionality
- ✅ **User Authentication**: Simple email-based authentication system
- ✅ **Product Catalog**: Browse products with detailed information
- ✅ **Rating System**: 5-star rating system for products
- ✅ **Review System**: Detailed text reviews with photo uploads
- ✅ **Duplicate Prevention**: Users cannot review the same product multiple times
- ✅ **Input Validation**: Comprehensive validation on all forms
- ✅ **Responsive Design**: Works perfectly on all devices

### Advanced Features
- 🏷️ **Smart Tag Extraction**: Automatically extracts relevant tags from review text
- 📸 **Photo Upload**: Users can attach multiple photos to reviews
- 📊 **Rating Analytics**: Visual rating distribution and statistics
- 🔍 **Search & Filter**: Advanced search with category and rating filters
- 📱 **Progressive Web App**: Optimized for mobile devices
- 🎨 **Modern UI**: Built with shadcn/ui components

### Technical Features
- 🚀 **Next.js 15**: Latest App Router with Server Components
- 🗄️ **PostgreSQL**: Robust relational database with Neon
- 🔒 **Type Safety**: Full TypeScript implementation
- 🎯 **REST APIs**: Well-structured API endpoints
- 📈 **Performance**: Optimized queries and caching
- 🧪 **Error Handling**: Comprehensive error handling and validation

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL (Neon)
- **Authentication**: Custom session management
- **File Upload**: Base64 encoding for images
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📊 Database Schema

### Users Table
\`\`\`sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Products Table
\`\`\`sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    price DECIMAL(10, 2),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Reviews Table
\`\`\`sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    photos TEXT[],
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd ratings-review-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file:
   \`\`\`env
   DATABASE_URL=your_postgresql_connection_string
   \`\`\`

4. **Set up the database**
   Run the SQL scripts in order:
   - `scripts/01-create-tables.sql`
   - `scripts/02-seed-data.sql`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products with ratings
- `GET /api/products/[id]` - Get specific product with reviews
- `GET /api/products/[id]/stats` - Get product statistics

### Reviews
- `GET /api/reviews` - Get all reviews (with optional filters)
- `POST /api/reviews` - Create a new review
- `PUT /api/reviews/[id]` - Update existing review
- `DELETE /api/reviews/[id]` - Delete review

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create or get user

### Search
- `GET /api/search` - Search products with filters

## 🎯 Usage Examples

### Creating a Review
\`\`\`javascript
const response = await fetch('/api/reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 1,
    productId: 1,
    rating: 5,
    reviewText: "Great product!",
    photos: ["base64_image_data"]
  })
});
\`\`\`

### Searching Products
\`\`\`javascript
const response = await fetch('/api/search?q=headphones&category=Electronics&minRating=4&sortBy=rating');
const products = await response.json();
\`\`\`

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL` - Application URL (optional)

### Customization
- Modify `lib/review-utils.ts` to customize tag extraction logic
- Update `components/ui/*` for custom styling
- Adjust database schema in `scripts/` for additional fields

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Product browsing and search
- [ ] Review submission with photos
- [ ] Rating system functionality
- [ ] Duplicate review prevention
- [ ] Review editing and deletion
- [ ] Tag extraction accuracy
- [ ] Mobile responsiveness

### API Testing
Use tools like Postman or curl to test API endpoints:

\`\`\`bash
# Get all products
curl http://localhost:3000/api/products

# Create a review
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"productId":1,"rating":5,"reviewText":"Excellent!"}'
\`\`\`

## 🚀 Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificate

## 📈 Performance Optimization

- Database indexes on frequently queried columns
- Image optimization with Next.js Image component
- Lazy loading for product grids
- Caching for static product data
- Compression for API responses

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention with parameterized queries
- XSS protection with proper escaping
- Rate limiting for API endpoints
- Secure file upload handling

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
- Verify `DATABASE_URL` is correct
- Check database server is running
- Ensure network connectivity

**Review Submission Fails**
- Check user authentication
- Verify product exists
- Ensure no duplicate reviews

**Images Not Loading**
- Check file size limits (5MB max)
- Verify supported formats (JPEG, PNG, WebP)
- Ensure proper base64 encoding

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Commit changes: `git commit -m "Add feature"`
5. Push to branch: `git push origin feature-name`
6. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn/ui for beautiful components
- Neon for reliable PostgreSQL hosting
- Vercel for seamless deployment

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting guide

---

**Built with ❤️ using Next.js and modern web technologies**
