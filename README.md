# 🎲 Ludo Game (Projeto Solo)

Este é um projeto pessoal desenvolvido com o objetivo de construir o jogo clássico **Ludo** utilizando apenas tecnologias do lado do cliente (**HTML5**, **CSS3/SCSS** e **JavaScript puro**). A proposta é entregar um jogo completo, funcional e visualmente organizado, sem depender de frameworks ou bibliotecas externas.

---

## 🧠 Sobre o jogo

O **Ludo** é um jogo de tabuleiro para 2 a 4 jogadores. Cada jogador possui 4 peões da mesma cor e o objetivo é levar todos os seus peões do ponto de partida até o centro do tabuleiro, percorrendo um caminho fixo.

## Regras principais:
- O jogador só pode sair da base ao tirar **6** no dado.
- Jogar um 6 dá direito a uma nova jogada.
- Peças podem ser "comidas" ao cair em casas já ocupadas por adversários.
- Algumas casas são **seguras** e não permitem capturas.
- O primeiro jogador a levar todas as peças ao centro vence.

---

## 🧱 Tecnologias Utilizadas

- **HTML5**
  Estrutura semântica do jogo, construção do tabuleiro e elementos interativos.

- **SCSS (Sass)**
  Utilizado como pré-processador de CSS para modularizar e escalar os estilos do projeto.A organização dos estilos segue duas convenções principais:

  - BEM (Block Element Modifier): Utilizado como metodologia de organização das classes CSS, garantindo legibilidade, previsibilidade e fácil manutenção do código.

  - Arquitetura 7-1: Estrutura de diretórios que separa responsabilidades por tipo de estilo (ex: variáveis, componentes, base, layout etc.), facilitando a manutenção e escalabilidade do projeto.

- **JavaScript Puro (Vanilla JS)**
  Toda a lógica do jogo será desenvolvida com JS sem bibliotecas externas. Inclui:
  - Gerenciamento de turnos
  - Lógica do dado
  - Movimento das peças
  - Verificação de regras do jogo
---

## 🚀 Como rodar o projeto

- Este projeto não utiliza bundlers no momento. Tudo é feito com arquivos estáticos e pré-processamento SCSS simples via CLI.

## Pré-requisitos:

- [Node.js](https://nodejs.org) instlado
- Dependência global/local do `sass` (caso use o pré-processador)

## 🧪 Status do Projeto:
- 📌 Em desenvolvimento
