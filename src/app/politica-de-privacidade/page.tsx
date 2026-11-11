import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";
import { legal } from "@/lib/legal";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: `Política de Privacidade | ${site.name}`,
  description: `Como a ${site.name} coleta, usa, guarda e protege seus dados pessoais, o uso de imagem em fotos e vídeos e como exercer seus direitos pela LGPD.`,
  alternates: { canonical: "/politica-de-privacidade" },
  robots: { index: true, follow: true },
};

const sections: LegalSection[] = [
  {
    id: "quem-somos",
    title: "Quem somos",
    body: (
      <>
        <p>
          Esta política vale para o site <strong>{legal.domain}</strong>{" "}
          (incluindo páginas de serviços, Área do Cliente e formulários) e para
          o atendimento pelo WhatsApp, Instagram, e-mail e telefone.
        </p>
        <p>
          A <strong>{legal.brand}</strong>, de {legal.city}, é a{" "}
          <strong>controladora</strong> dos seus dados pessoais, nos termos da
          Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018). Isso quer
          dizer que somos nós que decidimos como eles são usados — e que
          respondemos por isso.
        </p>
      </>
    ),
  },
  {
    id: "quais-dados-coletamos",
    title: "Quais dados coletamos?",
    body: (
      <>
        <ul>
          <li>
            <strong>Pedido de orçamento e contato:</strong> nome, WhatsApp, mês
            e ano do evento e a mensagem que você escrever.
          </li>
          <li>
            <strong>Contrato:</strong> nome completo, CPF, RG, data de
            nascimento, endereço com CEP, e-mail, telefone e os dados do evento
            (data, locais, horários e serviços contratados).
          </li>
          <li>
            <strong>Conversas:</strong> o que você nos envia pelo WhatsApp,
            Instagram, e-mail ou telefone.
          </li>
          <li>
            <strong>Área do Cliente:</strong> login, e-mail de recuperação de
            senha, registros de acesso (data, horário e endereço IP, usados para
            segurança), as fotos das suas galerias e os links de visualização
            que você criar, com a contagem de acessos.
          </li>
          <li>
            <strong>Dados técnicos:</strong> endereço IP, navegador, tipo de
            aparelho, data e hora de acesso — usados para segurança, para evitar
            spam e para estatísticas de visita.
          </li>
          <li>
            <strong>Imagens:</strong> as fotos e os vídeos produzidos no seu
            evento ou ensaio.
          </li>
        </ul>
        <p>
          Não pedimos dados sensíveis (como religião, saúde ou origem racial) e
          não usamos o site para coletar dados de crianças. Em contratos de 15
          anos e de formaturas escolares, quem assina e fornece os dados é o
          responsável legal.
        </p>
      </>
    ),
  },
  {
    id: "para-que-usamos-seus-dados",
    title: "Para que usamos seus dados?",
    body: (
      <>
        <p>Cada uso tem uma base legal prevista no art. 7º da LGPD:</p>
        <ul>
          <li>
            <strong>Responder seu pedido e enviar orçamento</strong> —
            procedimentos preliminares a um contrato, a seu pedido (art. 7º, V).
          </li>
          <li>
            <strong>Fazer e cumprir o contrato:</strong> planejamento, cobertura
            do evento, edição, entrega das fotos, filmes e álbuns, e atendimento
            pós-venda (art. 7º, V).
          </li>
          <li>
            <strong>Cumprir obrigações legais</strong>, como emissão de nota
            fiscal e guarda de documentos (art. 7º, II).
          </li>
          <li>
            <strong>Manter contato com você:</strong> retomar um orçamento,
            avisar sobre datas disponíveis, novidades e ensaios — legítimo
            interesse (art. 7º, IX). Você pode pedir para não receber mais esses
            contatos a qualquer momento.
          </li>
          <li>
            <strong>Melhorar o site</strong>, com estatísticas de visita —
            legítimo interesse (art. 7º, IX).
          </li>
          <li>
            <strong>Defender direitos</strong> em eventual processo judicial ou
            administrativo (art. 7º, VI).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cadastro-de-contatos",
    title: "Seus dados ficam no nosso cadastro de contatos",
    body: (
      <>
        <p>
          Quando você <strong>entra em contato</strong> com a gente — pelo
          WhatsApp, por um formulário do site, pelas redes sociais ou
          pessoalmente — ou <strong>preenche qualquer dado no site</strong>,
          essas informações passam a fazer parte do{" "}
          <strong>banco de dados do estúdio</strong>, para que possamos
          continuar o atendimento e <strong>entrar em contato no futuro</strong>{" "}
          (por exemplo, para retomar um orçamento, lembrar de uma data especial
          ou oferecer um novo ensaio).
        </p>
        <p>
          Esse cadastro é de uso interno, não é vendido nem cedido a terceiros
          para publicidade. Se você não quiser mais ser contatado, basta pedir
          pelo WhatsApp ou por e-mail: seus dados saem da lista de contatos e,
          se não houver obrigação legal ou contrato que exija guardá-los, são
          excluídos.
        </p>
      </>
    ),
  },
  {
    id: "fotos-e-videos-uso-de-imagem",
    title: "Fotos e vídeos: uso de imagem",
    body: (
      <>
        <p>
          As fotos e os vídeos de clientes publicados neste site, nas páginas de
          serviços e nas nossas redes sociais são usados com{" "}
          <strong>
            autorização de uso de imagem assinada pelo cliente no contrato
          </strong>{" "}
          de prestação de serviços. Quando há menores de idade, a autorização é
          dada pelos pais ou responsáveis legais, como exige o art. 14 da LGPD.
        </p>
        <ul>
          <li>
            As imagens são usadas para{" "}
            <strong>divulgar o nosso trabalho</strong> (portfólio, site, redes
            sociais, materiais de apresentação e concursos de fotografia), sem
            fins que exponham o cliente de forma constrangedora.
          </li>
          <li>
            Se você aparece em uma imagem publicada e prefere que ela seja
            retirada, fale com a gente:{" "}
            <strong>
              analisamos e retiramos a imagem do site e das nossas redes
            </strong>{" "}
            em prazo razoável.
          </li>
          <li>
            Algumas imagens podem vir de bancos de imagem com licença de uso;
            nesses casos, o crédito aparece junto da foto.
          </li>
          <li>
            Os vídeos são captados e editados por nossa equipe e por parceiros
            de filmagem, que seguem as mesmas regras de uso de imagem.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "com-quem-compartilhamos",
    title: "Com quem compartilhamos?",
    body: (
      <>
        <p>
          <strong>Não vendemos nem alugamos dados pessoais.</strong> Eles só são
          compartilhados com quem nos ajuda a prestar o serviço, e só o
          necessário para isso:
        </p>
        <ul>
          <li>
            <strong>Hospedagem do site e banco de dados</strong>, onde ficam o
            cadastro e os registros de acesso;
          </li>
          <li>
            <strong>Armazenamento das fotos (Cloudflare)</strong>, onde ficam as
            galerias, em área privada;
          </li>
          <li>
            <strong>Envio de e-mails (Resend)</strong>, usado para mandar o link
            de recuperação de senha;
          </li>
          <li>
            <strong>Plataforma de galerias online</strong>, usada para entregar
            as fotos aos clientes;
          </li>
          <li>
            <strong>Parceiros de filmagem e edição</strong>, para os vídeos
            contratados;
          </li>
          <li>
            <strong>Laboratórios e gráficas</strong>, para a produção de álbuns,
            quadros e impressos;
          </li>
          <li>
            <strong>Google</strong> (estatísticas de visita) e{" "}
            <strong>Meta</strong> (WhatsApp e Instagram);
          </li>
          <li>
            <strong>Autoridades públicas</strong>, quando houver obrigação legal
            ou ordem judicial.
          </li>
        </ul>
        <p>
          Alguns desses fornecedores mantêm servidores fora do Brasil. Nesses
          casos, a transferência internacional segue o art. 33 da LGPD, com
          fornecedores que adotam padrões reconhecidos de proteção de dados.
        </p>
      </>
    ),
  },
  {
    id: "por-quanto-tempo-guardamos",
    title: "Por quanto tempo guardamos?",
    body: (
      <ul>
        <li>
          <strong>Contratos e dados fiscais:</strong> pelo prazo exigido pela
          legislação (fiscal, civil e do consumidor).
        </li>
        <li>
          <strong>Cadastro de contatos e orçamentos:</strong> enquanto houver
          interesse no contato, ou até você pedir a exclusão.
        </li>
        <li>
          <strong>Fotos e vídeos entregues:</strong> pelo prazo combinado no
          contrato. Recomendamos que você guarde uma cópia das suas fotos em
          mais de um lugar.
        </li>
        <li>
          <strong>Dados técnicos de acesso:</strong> pelo prazo do art. 15 do
          Marco Civil da Internet (6 meses) ou pelo período necessário à
          segurança do site.
        </li>
      </ul>
    ),
  },
  {
    id: "quais-sao-os-seus-direitos",
    title: "Quais são os seus direitos?",
    body: (
      <>
        <p>Pelo art. 18 da LGPD, você pode, a qualquer momento e de graça:</p>
        <ul>
          <li>
            confirmar se tratamos seus dados e <strong>ter acesso</strong> a
            eles;
          </li>
          <li>
            <strong>corrigir</strong> dados incompletos, errados ou
            desatualizados;
          </li>
          <li>
            pedir a <strong>anonimização, o bloqueio ou a exclusão</strong> de
            dados desnecessários ou tratados em desacordo com a lei;
          </li>
          <li>
            pedir a <strong>portabilidade</strong> dos dados a outro fornecedor;
          </li>
          <li>
            saber com quem <strong>compartilhamos</strong> seus dados;
          </li>
          <li>
            <strong>revogar o consentimento</strong> e se <strong>opor</strong>{" "}
            a usos baseados em legítimo interesse, como o contato para
            novidades.
          </li>
        </ul>
        <p>
          Para exercer qualquer um desses direitos, fale com a gente pelos
          canais ao final desta página. Respondemos em até{" "}
          <strong>{legal.responseDays} dias</strong>. Se achar que seu pedido
          não foi atendido, você também pode reclamar à{" "}
          <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong>, em{" "}
          <a
            href="https://www.gov.br/anpd"
            target="_blank"
            rel="noopener noreferrer"
          >
            gov.br/anpd
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "como-protegemos-seus-dados",
    title: "Como protegemos seus dados?",
    body: (
      <p>
        O site usa conexão segura (HTTPS). Os cadastros ficam em sistemas com
        acesso restrito, por login individual, só para quem precisa deles para
        trabalhar. Formulários têm proteção contra robôs e envios forjados.
        Nenhum sistema é 100% invulnerável, mas, se acontecer um incidente de
        segurança que possa trazer risco a você, comunicaremos você e a ANPD,
        como manda a lei.
      </p>
    ),
  },
  {
    id: "cookies-e-estatisticas",
    title: "Cookies e estatísticas",
    body: (
      <p>
        Usamos ferramentas como o <strong>Google Analytics</strong> para
        entender, de forma agregada, quantas pessoas visitam o site e quais
        páginas mais interessam. Elas usam cookies. Você pode bloquear ou apagar
        cookies nas configurações do seu navegador, ou instalar o{" "}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          target="_blank"
          rel="noopener noreferrer"
        >
          complemento de desativação do Google Analytics
        </a>
        , sem prejuízo para o uso do site.
      </p>
    ),
  },
  {
    id: "fale-com-a-gente",
    title: "Fale com a gente sobre seus dados",
    body: (
      <>
        <p>
          Canal de privacidade (encarregado pelo tratamento de dados):{" "}
          <strong>{legal.owner}</strong>
        </p>
        <ul>
          <li>
            E-mail: <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>
            WhatsApp: <a href={whatsappLink()}>{site.phoneLabel}</a>
          </li>
        </ul>
        <p>
          Esta política pode ser atualizada para acompanhar mudanças na lei ou
          nos nossos serviços. A data da última atualização fica no topo da
          página. Veja também os nossos{" "}
          <Link href="/termos-de-uso">Termos de Uso</Link>.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      crumb="Política de Privacidade"
      eyebrow="LGPD · Lei 13.709/2018"
      title={
        <>
          Política de <em>Privacidade</em>
        </>
      }
      lead="Transparência sobre os seus dados: o que coletamos, por que, por quanto tempo e como você pode consultar, corrigir ou pedir a exclusão."
      updatedAt={legal.updatedAt}
      summary={
        <>
          Usamos seus dados <strong>só para atender você</strong>: responder
          orçamentos, fazer e cumprir o contrato e manter contato. Quem entra em
          contato ou preenche um formulário passa a fazer parte do nosso{" "}
          <strong>cadastro de contatos</strong>, e você pode pedir para sair a
          qualquer momento. <strong>Não vendemos dados.</strong> As fotos e
          vídeos de clientes publicados aqui têm{" "}
          <strong>autorização de uso de imagem assinada em contrato</strong>.
        </>
      }
      sections={sections}
      helpMessage="Olá! Tenho uma dúvida sobre a política de privacidade do site."
      related={[
        { label: "Termos de Uso", href: "/termos-de-uso" },
        { label: "Fale conosco", href: "/#contato" },
      ]}
    />
  );
}
