"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { testimonialVideo, testimonials } from "@/lib/testimonials";
import Placeholder from "./ui/Placeholder";
import SectionHeading from "./ui/SectionHeading";
import { ArrowLeftIcon, ArrowRightIcon, PlayIcon } from "./ui/Icons";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const total = testimonials.length;
  const current = testimonials[index];

  useEffect(() => {
    if (paused || total < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % total), 8000);
    return () => clearInterval(timer);
  }, [paused, total]);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total);

  const handlePlay = () => {
    // play() pode ser rejeitado pelo navegador; o estado só muda no evento onPlay
    videoRef.current?.play().catch(() => {});
  };

  return (
    <section className="section testimonials">
      <div className="container">
        <SectionHeading
          eyebrow="Experiências reais"
          title={
            <>
              O que dizem <em>nossos clientes</em>
            </>
          }
        />

        <div className="testimonial">
          <div className="testimonial__media">
            <div className="testimonial__frame">
              <div className="testimonial__player">
                <video
                  ref={videoRef}
                  className="testimonial__video"
                  src={testimonialVideo.src}
                  controls={playing}
                  playsInline
                  // Não baixa o MP4 até o clique: a capa abaixo é só uma imagem leve
                  preload="none"
                  aria-label={testimonialVideo.title}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={() => setPlaying(false)}
                />

                {/* Capa exibida enquanto o vídeo está parado/pausado */}
                {!playing && (
                  <button
                    type="button"
                    className="testimonial__cover"
                    onClick={handlePlay}
                    aria-label={`Reproduzir vídeo: ${testimonialVideo.title}`}
                  >
                    <Image
                      src={testimonialVideo.poster}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 100vw, 438px"
                    />
                    <span className="testimonial__play">
                      <PlayIcon width={18} height={18} />
                    </span>
                  </button>
                )}
              </div>
            </div>
            <p className="testimonial__caption">{testimonialVideo.title}</p>
          </div>

          <div
            className="testimonial__body"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <span className="testimonial__mark" aria-hidden>
              “
            </span>
            <blockquote className="testimonial__quote">
              {current.quote}
            </blockquote>

            <div className="testimonial__author">
              <div className="testimonial__avatar">
                {current.avatar ? (
                  <Image
                    // key força o React a recriar a imagem ao trocar de depoimento
                    key={current.avatar}
                    src={current.avatar}
                    alt={`Foto de ${current.author}`}
                    fill
                    sizes="46px"
                  />
                ) : (
                  <Placeholder alt="" ratio="square" tone={3} />
                )}
              </div>
              <p>
                <strong>{current.author}</strong>
                <span>{current.context}</span>
              </p>
            </div>

            {total > 1 && (
              <div className="testimonial__nav">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Depoimento anterior"
                >
                  <ArrowLeftIcon width={14} height={14} />
                </button>
                <span className="testimonial__count">
                  {pad(index + 1)} / {pad(total)}
                </span>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Próximo depoimento"
                >
                  <ArrowRightIcon width={14} height={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
