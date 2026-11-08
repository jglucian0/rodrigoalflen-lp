"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { site, whatsappLink, WHATSAPP_BUDGET_MESSAGE } from "@/lib/site";
import SectionHeading from "./ui/SectionHeading";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PinIcon,
  PinterestIcon,
  SendIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "./ui/Icons";

interface FormState {
  nome: string;
  whatsapp: string;
  data: string;
  mensagem: string;
  captcha: string;
}

const initialState: FormState = {
  nome: "",
  whatsapp: "",
  data: "",
  mensagem: "",
  captcha: "",
};

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  // Valores fixos no SSR; sorteados no cliente (como no site original)
  const [[a, b], setCaptcha] = useState<[number, number]>([4, 4]);

  useEffect(() => {
    setCaptcha([
      1 + Math.floor(Math.random() * 9),
      1 + Math.floor(Math.random() * 9),
    ]);
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Number(form.captcha) !== a + b) {
      setError("Resposta incorreta na verificação anti-spam.");
      return;
    }
    setError(null);

    // TODO: trocar por POST em /api/contato quando houver backend.
    const text = [
      "Olá! Vim pelo site e gostaria de falar sobre o meu evento.",
      `Nome: ${form.nome}`,
      `WhatsApp: ${form.whatsapp}`,
      `Mês e ano do evento: ${form.data}`,
      `Mensagem: ${form.mensagem}`,
    ].join("\n");

    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
    setForm(initialState);
  };

  return (
    <section id="contato" className="section contact">
      <div className="container contact__grid">
        <div className="contact__info">
          <SectionHeading
            eyebrow="Fale conosco"
            title={
              <>
                Vamos criar <em>juntos</em>
              </>
            }
            description="Estou disponível para tirar dúvidas, discutir ideias e criar um pacote personalizado. Cada projeto é único, e meu compromisso é entender a sua visão."
          />

          <ul className="contact__list">
            <li>
              <span className="contact__ico">
                <WhatsappIcon width={15} height={15} />
              </span>
              <div>
                <small>Telefone / WhatsApp</small>
                <a href={whatsappLink(WHATSAPP_BUDGET_MESSAGE)}>
                  {site.phoneLabel}
                </a>
              </div>
            </li>
            <li>
              <span className="contact__ico">
                <MailIcon width={15} height={15} />
              </span>
              <div>
                <small>E-mail</small>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </div>
            </li>
            <li>
              <span className="contact__ico">
                <PinIcon width={14} height={14} />
              </span>
              <div>
                <small>Localização</small>
                <p>{site.location}</p>
              </div>
            </li>
            <li>
              <span className="contact__ico">
                <ClockIcon width={15} height={15} />
              </span>
              <div>
                <small>Atendimento</small>
                <p>{site.hours}</p>
                <em>{site.hoursNote}</em>
              </div>
            </li>
          </ul>

          <div className="socials">
            <a
              href={site.socials.instagram}
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon />
            </a>
            <a
              href={site.socials.facebook}
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>

        <form className="form" onSubmit={onSubmit}>
          <div className="form__frame">
            <label className="field">
              <span>Nome *</span>
              <input
                name="nome"
                type="text"
                required
                autoComplete="name"
                value={form.nome}
                onChange={onChange}
              />
            </label>

            <div className="form__row">
              <label className="field">
                <span>WhatsApp *</span>
                <input
                  name="whatsapp"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="(16) 98127-5977"
                  value={form.whatsapp}
                  onChange={onChange}
                />
              </label>
              <label className="field">
                <span>Mês e ano do evento *</span>
                <input
                  name="data"
                  type="text"
                  required
                  placeholder="Ex.: maio de 2027"
                  value={form.data}
                  onChange={onChange}
                />
              </label>
            </div>

            <label className="field">
              <span>Conte-me mais sobre seu evento (opcional)</span>
              <textarea
                name="mensagem"
                value={form.mensagem}
                onChange={onChange}
              />
            </label>

            <label className="field">
              <span>
                Para evitar spam: quanto é{" "}
                <strong>
                  {a} + {b}
                </strong>
                ? *
              </span>
              <input
                name="captcha"
                type="number"
                inputMode="numeric"
                required
                className="field__short"
                value={form.captcha}
                onChange={onChange}
              />
            </label>

            {error && (
              <p className="form__error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn--dark">
              Enviar mensagem <SendIcon />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
