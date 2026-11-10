import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { legal } from "@/lib/legal";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: `Termos de Uso | ${site.name}`,
  description: `Termos de uso do site da ${site.name}: orçamentos, contratos, direitos autorais das fotos e vídeos, uso de imagem e Área do Cliente.`,
  alternates: { canonical: "/termos-de-uso" },
  robots: { index: true, follow: true },
};

const sections: LegalSection[] = [
  {
    id: "sobre-este-site",
    title: "Sobre este site",
    body: (
      <p>
        O site <strong>{legal.domain}</strong> pertence à{" "}
        <strong>{legal.brand}</strong>, estúdio de fotografia e filmagem de{" "}
        {legal.city}. Ao navegar por ele, pedir um orçamento ou acessar a Área
        do Cliente, você concorda com estes termos e com a{" "}
        <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
      </p>
    ),
  },
  {
    id: "orcamentos-precos-e-contratos",
    title: "Orçamentos, preços e contratos",
    body: (
      <ul>
        <li>
          Os valores, pacotes, prazos e a disponibilidade mostrados no site e no
          atendimento são <strong>informativos</strong> e podem mudar sem aviso.
        </li>
        <li>
          Uma data só fica <strong>reservada</strong> depois da assinatura do
          contrato e do pagamento combinado.
        </li>
        <li>
          Em caso de diferença entre o site e o contrato,{" "}
          <strong>vale o contrato</strong>, que traz serviços, valores, prazos
          de entrega e regras de remarcação e cancelamento.
        </li>
      </ul>
    ),
  },
  {
    id: "direitos-autorais",
    title: "Direitos autorais das fotos e vídeos",
    body: (
      <>
        <p>
          Todas as fotografias, vídeos, textos e a identidade visual deste site
          são protegidos pela{" "}
          <strong>Lei de Direitos Autorais (Lei 9.610/1998)</strong>. As fotos e
          os vídeos são de autoria da {legal.brand}.
        </p>
        <ul>
          <li>
            É proibido copiar, baixar, reproduzir, editar, aplicar filtros,
            remover créditos ou usar as imagens do site para fins comerciais sem
            autorização por escrito.
          </li>
          <li>
            Compartilhar o link de uma página ou de um post é sempre bem-vindo.
          </li>
          <li>
            Clientes podem usar as fotos e vídeos que receberam para{" "}
            <strong>uso pessoal</strong> (guardar, imprimir, postar nas redes),
            de preferência citando o estúdio. O uso comercial depende do que
            está no contrato.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "uso-de-imagem",
    title: "Uso de imagem dos clientes",
    body: (
      <p>
        As fotos e vídeos de clientes publicados no site e nas nossas redes
        sociais têm{" "}
        <strong>autorização de uso de imagem assinada no contrato</strong> de
        prestação de serviços (pelos pais ou responsáveis, no caso de menores de
        idade). Se você aparece em alguma imagem e prefere que ela seja
        retirada, fale com a gente: analisamos e retiramos em prazo razoável. Os
        detalhes estão na{" "}
        <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
      </p>
    ),
  },
  {
    id: "seus-dados",
    title: "Seus dados e o contato com você",
    body: (
      <p>
        Ao entrar em contato ou preencher qualquer dado no site, você passa a
        fazer parte do nosso cadastro de contatos, usado para responder você e
        para contatos futuros sobre orçamentos, datas e novidades. Você pode
        pedir para sair a qualquer momento. Tudo isso segue a{" "}
        <strong>LGPD (Lei 13.709/2018)</strong>, explicado na{" "}
        <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
      </p>
    ),
  },
  {
    id: "area-do-cliente",
    title: "Área do Cliente",
    body: (
      <ul>
        <li>
          O login e a senha da Área do Cliente são <strong>pessoais</strong>:
          não compartilhe com quem não deve ver as suas fotos.
        </li>
        <li>
          As galerias ficam disponíveis pelo prazo combinado em contrato. Baixe
          e guarde suas fotos em mais de um lugar.
        </li>
        <li>
          Se perceber acesso indevido, avise a gente para trocarmos a senha.
        </li>
      </ul>
    ),
  },
  {
    id: "uso-correto-do-site",
    title: "Uso correto do site",
    body: (
      <p>
        Não é permitido usar o site para enviar spam, dados falsos ou de outra
        pessoa, tentar acessar áreas restritas, sobrecarregar o servidor ou
        coletar dados de forma automatizada. Podemos bloquear acessos que façam
        isso.
      </p>
    ),
  },
  {
    id: "links-para-outros-sites",
    title: "Links para outros sites",
    body: (
      <p>
        O site tem links e conteúdos de outras plataformas, como WhatsApp,
        Instagram e Facebook. Elas têm seus próprios termos e políticas, que
        valem quando você as usa.
      </p>
    ),
  },
  {
    id: "limitacao-de-responsabilidade",
    title: "Limitação de responsabilidade",
    body: (
      <p>
        Fazemos o possível para manter o site correto, atualizado e no ar, mas
        não garantimos funcionamento sem interrupções, porque ele depende de
        serviços externos (hospedagem, WhatsApp, Google e provedores de
        internet). As informações publicadas são orientações gerais e não
        substituem orientação jurídica ou profissional para o seu caso.
      </p>
    ),
  },
  {
    id: "lei-aplicavel-e-foro",
    title: "Lei aplicável e foro",
    body: (
      <p>
        Estes termos seguem as leis brasileiras, incluindo o Código de Defesa do
        Consumidor, o Marco Civil da Internet e a LGPD. Fica eleito o foro de{" "}
        {legal.forum}, sem prejuízo do direito do consumidor de propor ação no
        foro do seu domicílio.
      </p>
    ),
  },
  {
    id: "alteracoes-e-contato",
    title: "Alterações e contato",
    body: (
      <p>
        Estes termos podem ser atualizados a qualquer momento, com a data no
        topo da página. Dúvidas:{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> ou{" "}
        <a href={whatsappLink()}>WhatsApp {site.phoneLabel}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      crumb="Termos de Uso"
      eyebrow="Regras do site e dos serviços"
      title={
        <>
          Termos de <em>Uso</em>
        </>
      }
      lead="As regras para usar o site, pedir orçamentos e acessar suas fotos — escritas de forma simples, sem letras miúdas."
      updatedAt={legal.updatedAt}
      summary={
        <>
          Os preços e informações do site servem de referência:{" "}
          <strong>o que vale é o contrato assinado</strong>. Todas as fotos,
          vídeos e textos são protegidos por <strong>direitos autorais</strong>{" "}
          e não podem ser copiados. As imagens de clientes são publicadas com{" "}
          <strong>autorização de uso de imagem em contrato</strong>. Seus dados
          seguem a nossa{" "}
          <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
        </>
      }
      sections={sections}
      helpMessage="Olá! Tenho uma dúvida sobre os termos de uso do site."
      related={[
        { label: "Política de Privacidade", href: "/politica-de-privacidade" },
        { label: "Fale conosco", href: "/#contato" },
      ]}
    />
  );
}
