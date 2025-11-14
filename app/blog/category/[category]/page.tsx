import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostsByCategory, getAllCategories, BlogPost } from '@/lib/blog/blogData';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const categoryName = decodeURIComponent(params.category);
  const posts = getBlogPostsByCategory(categoryName);
  
  if (posts.length === 0) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${categoryName} Articles | Think Tech DB Guru`,
    description: `Explore our collection of ${categoryName} articles and tutorials`,
  };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = decodeURIComponent(params.category);
  const posts = getBlogPostsByCategory(categoryName);
  
  if (posts.length === 0) {
    notFound();
  }

  const capitalizedCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  const allCategories = getAllCategories();

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'fundamentals': '🏗️',
      'optimization': '⚡',
      'advanced': '🚀',
      'nosql': '📊',
      'sql': '💾',
      'design': '🎨',
      'performance': '🔧',
      'security': '🔐',
      'modeling': '📐',
      'administration': '👨‍💼',
    };
    return icons[category.toLowerCase()] || '📚';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
              ← Back to All Articles
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {getCategoryIcon(capitalizedCategory)} {capitalizedCategory} Articles
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {posts.length} article{posts.length !== 1 ? 's' : ''} in this category
            </p>
            
            {/* Category Navigation */}
            <div className="flex flex-wrap justify-center gap-3">
              {allCategories.map((category) => (
                <Link
                  key={category}
                  href={`/blog/category/${category.toLowerCase()}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category.toLowerCase() === categoryName.toLowerCase()
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getCategoryIcon(category)} {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: BlogPost) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm">{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 text-sm">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  {post.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{post.tags.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    Read Article →
                  </Link>
                  
                  {post.mediumUrl && (
                    <a
                      href={post.mediumUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                    >
                      📖 Medium
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {/* Empty State (shouldn't reach here due to notFound, but good fallback) */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No articles in this category yet
            </h2>
            <p className="text-gray-600 mb-8">
              Check back later for new content, or explore other categories.
            </p>
            <Link
              href="/blog"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Articles
            </Link>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Test Your Knowledge?</h3>
          <p className="text-blue-100 mb-6">
            Apply what you've learned from these {capitalizedCategory.toLowerCase()} articles with our comprehensive database quiz
          </p>
          <Link
            href="/quiz-english"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Quiz Now 🚀
          </Link>
        </div>
      </div>
    </div>
  );
}