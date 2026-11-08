import { posts } from "@/lib/posts";
import { site } from "@/lib/site";
import Placeholder from "./ui/Placeholder";
import SectionHeading from "./ui/SectionHeading";
import { ArrowRightIcon } from "./ui/Icons";

export default function BlogPreview() {
  return (
    <section className="section blog">
      <div className="container">
        <div className="blog__head">
          <SectionHeading
            eyebrow="Do blog"
            title={
              <>
                Dicas &amp; <em>inspirações</em>
              </>
            }
          />
          <a href={site.blogUrl} className="link-arrow">
            Ver todos os artigos
            <ArrowRightIcon width={12} height={12} />
          </a>
        </div>

        <ul className="blog__grid">
          {posts.map((post, i) => (
            <li key={post.href}>
              <a href={post.href} className="post">
                <Placeholder alt={post.imageAlt} ratio="landscape" tone={i} />
                <span className="post__meta">
                  {post.category} · {post.date}
                </span>
                <span className="post__title">{post.title}</span>
                <span className="post__more">
                  Ler artigo <ArrowRightIcon width={12} height={12} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
