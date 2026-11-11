# ASSINATURA — portfólio de Daniel Júnior

Portfólio autoral em React + TypeScript + Vite, com animação de código em canvas,
revelação por rolagem, navegação responsiva e formulário de contato por e-mail.

## Executar localmente

1. Instale Node.js (versão LTS).
2. Abra esta pasta no terminal.
3. Execute:

```bash
npm install
npm run dev
```

4. Abra o endereço local mostrado pelo Vite.

Para gerar a versão de produção: `npm run build`.

## Personalização obrigatória

Edite `src/config.ts`:
- `email`: endereço que receberá as mensagens.
- `whatsapp`: número com código do país e DDD, somente dígitos (ex.: 5521999999999).
- `github` e `linkedin`: seus perfis.
- `skills`: mantenha somente tecnologias que você realmente conhece; ajuste os níveis.
- `projects`: substitua os exemplos vazios por projetos reais. Não publique demonstrações ou resultados que não existam.

O formulário valida os campos e abre o aplicativo de e-mail do visitante com a mensagem preenchida. Para envio sem abrir o e-mail, será necessário integrar um serviço/backend (por exemplo, uma API própria).

## Publicação

Pode ser publicado em Vercel, Netlify ou outro host estático compatível com Vite.
Configure o comando de build como `npm run build` e a pasta de saída como `dist`.

## Acessibilidade e performance

- Navegação por teclado e foco visível.
- Canvas decorativo oculto de leitores de tela.
- Respeita `prefers-reduced-motion`.
- Animações leves e responsivas; conteúdo permanece acessível sem animação.
