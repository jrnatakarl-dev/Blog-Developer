// Personalize este arquivo com informações reais antes de publicar.
export const profile = {
  name: "Daniel Júnior",
  role: "Desenvolvedor de sistemas",
  statement: "Transformo problemas complexos em soluções digitais claras.",
  description: "Desenvolvimento com intenção: entender o problema, desenhar uma solução e construir tecnologia que faça sentido na prática.",
  email: "", // Ex.: contato@seudominio.com
  whatsapp: "", // Ex.: 5521999999999 (somente números)
  github: "", // Ex.: https://github.com/seuusuario
  linkedin: "", // Ex.: https://www.linkedin.com/in/seuusuario/
};

export const skills = [
  { group: "Em desenvolvimento", items: ["Python", "Flask", "Kotlin"] },
  { group: "Próximos passos", items: ["React", "TypeScript", "SQL"] },
];

// Inclua somente projetos reais. O site mostra um estado honesto enquanto a lista estiver vazia.
export const projects: {
  number: string; name: string; type: string; description: string;
  problem: string; solution: string; stack: string[]; demo?: string; source?: string;
}[] = [];
