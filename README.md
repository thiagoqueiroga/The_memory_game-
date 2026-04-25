# Jogo da Memória (Memo!)

Um jogo da memória clássico, otimizado para dispositivos móveis com um design vibrante e animações fluidas.

## 📱 Sobre o Projeto

Este é um jogo da memória desenvolvido com foco na experiência mobile. Ele apresenta uma interface lúdica e responsiva ("Vibrant Palette") e mecânicas clássicas de jogo da memória, desafiando o jogador a encontrar os pares de ícones no menor tempo e com o menor número de movimentos possível.

## ✨ Funcionalidades

* **3 Níveis de Dificuldade:**
  * Fácil (Grade 3x4 - 6 pares)
  * Médio (Grade 4x4 - 8 pares)
  * Difícil (Grade 4x6 - 12 pares)
* **Design Vibrante:** Interface com cores marcantes, tipografia forte e componentes que simulam profundidade e botões físicos.
* **Animações 3D:** Cartas com efeito realista de "flip" (girar) em 3D utilizando a biblioteca Motion.
* **Sistema de Pontuação:** Acompanhamento de tempo decorrido e quantidade de movimentos.
* **Mobile-First:** Layout encapsulado em um formato que simula a tela de um smartphone para máxima imersão.

## 🛠️ Tecnologias Utilizadas

* [React 19](https://react.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Vite](https://vitejs.dev/)
* [Tailwind CSS 4](https://tailwindcss.com/)
* [Motion (Framer Motion)](https://motion.dev/) para animações e microinterações
* [Lucide React](https://lucide.dev/) para os ícones

## 🚀 Como executar localmente

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra o navegador no endereço indicado (geralmente `http://localhost:3000`).

## 🎮 Como jogar

1. Ao carregar, o jogo inicia no modo "Médio".
2. Toque nas cartas para revelá-las.
3. Encontre os pares de cartas idênticas.
4. Se quiser mudar a dificuldade, toque no botão "Nível" no topo e escolha uma das opções.
5. Para reiniciar a partida atual, toque em "Reset".
6. Complete o tabuleiro no menor tempo possível!
