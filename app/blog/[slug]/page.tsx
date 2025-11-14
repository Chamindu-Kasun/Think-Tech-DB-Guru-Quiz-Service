import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostById, getRelatedPosts } from '@/lib/blog/blogData';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getBlogPostById(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Think Tech DB Guru`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostById(params.slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(params.slug);

  const CodeBlock = ({ language, children }: { language: string; children: string }) => {
    return (
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        customStyle={{
          borderRadius: '8px',
          fontSize: '14px',
        }}
      >
        {children}
      </SyntaxHighlighter>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to Blog
            </Link>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {post.category}
              </span>
              <span className="text-gray-500">{post.readTime}</span>
              <span className="text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {post.excerpt}
            </p>
          </div>
          
          {post.mediumUrl && (
            <div className="text-center border-t pt-6">
              <p className="text-gray-600 mb-3">Also available on Medium:</p>
              <a
                href={post.mediumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                📖 Read on Medium
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : 'text';
                  const inline = !className;
                  
                  return !inline ? (
                    <CodeBlock language={language}>
                      {String(children).replace(/\n$/, '')}
                    </CodeBlock>
                  ) : (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-800 mt-8 mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-4 text-gray-700">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-4 text-gray-700">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="mb-2">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-6">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
          
          {/* Tags */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-600 font-medium">Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">📚 Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {relatedPost.category}
                    </span>
                    <span className="text-gray-500 text-xs">{relatedPost.readTime}</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2 hover:text-blue-600">
                    <Link href={`/blog/${relatedPost.id}`}>
                      {relatedPost.title}
                    </Link>
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                  <Link
                    href={`/blog/${relatedPost.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                  >
                    Read More →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Test Your Database Knowledge</h3>
          <p className="text-blue-100 mb-6">
            Ready to apply what you've learned? Take our comprehensive database quiz!
          </p>
          <Link
            href="/quiz-english"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Quiz Now 🚀
          </Link>
        </div>
      </article>
    </div>
  );
}