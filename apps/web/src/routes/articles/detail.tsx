import { useParams } from "react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { SeoHead } from "@/components/SeoHead";
import { useQuery } from "@/hooks/useQuery";
import { getUpdate } from "@/api/updates";
import { marked } from "marked";
import { formatDistanceToNow } from "date-fns";

const sourceLabels: Record<string, string> = {
  article: "Article",
  artemis_blog: "Artemis Blog",
  nasa_news: "NASA News",
  iotd: "Image of the Day",
};

export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: article, loading, error } = useQuery(() => getUpdate(id!), [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!article) return <ErrorMessage message="Article not found" />;

  const timeAgo = formatDistanceToNow(new Date(article.published_at), { addSuffix: true });
  const htmlContent = article.content ? marked.parse(article.content) : article.summary;

  return (
    <div>
      <SeoHead
        title={article.title}
        description={article.summary}
        canonicalPath={`/updates/${article.id}`}
      />
      <Breadcrumbs items={[{ name: "Updates", path: "/updates" }, { name: article.title }]} />

      <article className="max-w-3xl">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="label text-muted px-1.5 py-0.5 rounded border border-subtle bg-space-slate/30">
            {sourceLabels[article.source] ?? article.source}
          </span>
          {article.author && <span className="text-faint text-sm">{article.author}</span>}
          <span className="text-faint text-sm">{timeAgo}</span>
        </div>

        <h1 className="text-2xl font-display font-bold tracking-tight mb-4 text-balance">
          {article.title}
        </h1>

        {article.image_url && (
          <img
            src={article.image_url}
            alt=""
            className="w-full rounded-lg mb-6 border border-subtle"
            loading="lazy"
          />
        )}

        <div
          className="prose prose-invert prose-sm max-w-none text-secondary leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <div className="mt-8 pt-6 border-t border-subtle">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-artemis-blue hover:text-artemis-blue/80 transition-colors"
          >
            Read original on NASA.gov →
          </a>
        </div>
      </article>
    </div>
  );
}