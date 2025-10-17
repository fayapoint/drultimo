import Markdown from "@/components/Markdown";

const overview = `
# Plano de Implementação

Este plano apresenta a visão geral de implementação do podcast, do planejamento à publicação, com fluxogramas Mermaid para facilitar a compreensão visual.
`;

const fluxoGeral = `
~~~mermaid
flowchart LR
  A[Ideias e Pautas] --> B[Pré-produção]
  B --> B1[Pesquisa aprofundada]
  B --> B2[Roteirização detalhada]
  B --> B3[Planejamento culinário]
  B --> C[Setup Técnico]
  C --> C1[Configuração Wirecast]
  C --> C2[Áudio: Rodecaster Pro II]
  C --> C3[Vídeo: Multi-câmeras]
  C --> D[Transmissão Ao Vivo]
  D --> D1[Switch de câmeras]
  D --> D2[Inserções gráficas & vídeos]
  D --> D3[Interação com audiência]
  D --> E[Pós-produção]
  E --> E1[Gravação ISO]
  E --> E2[Cortes e destaques]
  E --> E3[Shorts/TikTok/Instagram]
  E --> F[Publicação]
  F --> F1[YouTube]
  F --> F2[Plataformas de Podcast]
  F --> F3[Redes sociais]
  F --> G[Tráfego Pago]
  G --> H[Análise de Métricas]
  H -->|feedback| A
~~~
`;

const arquiteturaTecnica = `
~~~mermaid
flowchart TB
  subgraph Audio[Áudio]
    Mics[Microfones Dinâmicos] --> RC[Rodecaster Pro II]
  end
  subgraph Video[Vídeo]
    Cam1[Câmera 1] --> CAP[Placas de Captura]
    Cam2[Câmera 2] --> CAP
    Cam3[Câmera 3] --> CAP
    Cam4[Câmera 4 opc.] --> CAP
  end
  RC --> PC[Workstation Streaming]
  CAP --> PC
  PC --> W[Wirecast Pro]
  W --> ISO[Gravação ISO]
  W --> LIVE[Streaming Ao Vivo]
  LIVE --> YT[YouTube]
  LIVE --> RTMP[Outras plataformas]
  ISO --> EDIT[Edição & IA (Veo/Sora, Nano Banana)]
  EDIT --> SHORTS[Shorts/Reels/TikTok]
~~~
`;

const sequenciaLive = `
~~~mermaid
sequenceDiagram
  participant RF as Ricardo (Workstation)
  participant DU as Dr. Ultimo
  participant DP as Dr. Paulo
  participant CM as Chef Marcelo
  participant WC as Wirecast
  participant YT as YouTube/Plataformas
  participant AUD as Audiência

  RF->>WC: Configura cenas, áudio e overlays
  DU-->>WC: Entrevistas e debates
  DP-->>WC: Análises e contrapontos
  CM-->>WC: Momentos culinários
  WC->>YT: Transmissão ao vivo (RTMP)
  AUD-->>YT: Comentários/Chat
  YT-->>RF: Chat e métricas em tempo real
  RF->>WC: Inserção de mídias e destaques
~~~
`;

const ganttExecucao = `
~~~mermaid
gantt
  dateFormat  HH:mm
  title Execução de um Episódio (Janela de 90min)
  section Pré-live
  Setup técnico        :a1, 00:00, 00:15
  Testes de áudio/vídeo:after a1, 00:10
  section Ao vivo
  Abertura/Introdução  :b1, 00:25, 00:05
  Bloco 1 (tema 1)     :b2, 00:30, 00:20
  Momento culinário 1  :b3, 00:50, 00:15
  Bloco 2 (tema 2)     :b4, 01:05, 00:20
  Momento culinário 2  :b5, 01:25, 00:10
  Encerramento/CTA     :b6, 01:35, 00:05
  section Pós-live
  Marcação de destaques: c1, 01:40, 00:10
  Export/Shorts        : c2, 01:50, 00:20
~~~
`;

export const metadata = { title: "Plano | Dr. Ultimo & Convidados" };

export default function PlanoPage() {
  return (
    <div className="space-y-8">
      <Markdown source={overview} />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Fluxo Geral</h2>
        <Markdown source={fluxoGeral} />
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Arquitetura Técnica</h2>
        <Markdown source={arquiteturaTecnica} />
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Sequência de Operação (Ao Vivo)</h2>
        <Markdown source={sequenciaLive} />
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Cronograma (Gantt)</h2>
        <Markdown source={ganttExecucao} />
      </div>
    </div>
  );
}
