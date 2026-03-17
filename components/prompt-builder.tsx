"use client"

import { useState, useCallback } from "react"
// Link component imported from next/link as NextLink to avoid naming conflicts
import NextLink from "next/link"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Field, FieldGroup, FieldLabel } from "./ui/field"
import { Upload, X, Copy, Check, Sparkles, Save, BookmarkCheck } from "lucide-react"
import { StyleLibrary } from "./style-library"
import { UserMenu } from "./user-menu"
import { savePrompt } from "@/lib/prompt-storage"
import { toast } from "sonner"

// Dynamic scene idea generator data
const CHARACTERS = [
  // Fantasia
  "um mago anciao com barba prateada e manto estrelado",
  "uma elfa arqueira com cabelos verdes e arco dourado",
  "um anao ferreiro com martelo magico e barba trançada",
  "uma fada guerreira com asas cristalinas e armadura de luz",
  "um dragao jovem com escamas iridescentes e olhos sabios",
  "uma bruxa da floresta com cabelos de musgo e olhos ambar",
  "um cavaleiro espectral com armadura fantasmagorica",
  "uma sereia encantada com cauda bioluminescente",
  "um golem de pedra com runas brilhantes no corpo",
  "uma phoenix renascida com penas de fogo dourado",
  // Ficcao Cientifica
  "um androide rebelde com circuitos expostos e olhos humanos",
  "uma piloto espacial com traje holografico e cicatrizes de batalha",
  "um cientista geneticamente modificado com bracos bionicoss",
  "uma hacker cyberpunk com implantes neurais e cabelos neon",
  "um alien diplomatico com pele translucida e multiplos olhos",
  "um clone soldado com armadura de combate avancada",
  "uma IA materializada em forma humanoide de luz",
  "um viajante do tempo com roupas de multiplas eras",
  // Medieval
  "um rei guerreiro com coroa de ferro e capa esfarrapada",
  "uma princesa rebelde com armadura leve e espada fina",
  "um arqueiro da floresta com capuz verde e arco longo",
  "um monge guerreiro com habito rasgado e punhos de aco",
  "uma alquimista misteriosa com frascos fumegantes no cinto",
  "um mercenario veterano com cicatrizes e olhar cansado",
  // Aventura
  "um explorador intrépido com chapeu de aba larga e chicote",
  "uma caca-tesouros com mochila cheia de mapas antigos",
  "um pirata lendario com perna de pau e papagaio mecanico",
  "uma alpinista destemida com equipamento improvisado",
  "um arqueologista com oculos empoeirados e diario antigo",
  // Natureza
  "um druida ancestral com corpo coberto de folhas vivas",
  "uma guardia da floresta com lobo gigante ao lado",
  "um espirito da agua com corpo feito de ondas cristalinas",
  "uma ninfa das arvores com pele de casca e flores no cabelo",
  "um gigante gentil coberto de musgo e flores silvestres",
  // Outros
  "uma samurai honrada com katana ancestral e kimono de batalha",
  "um ninja das sombras com mascara e adagas envenenadas",
  "uma amazona guerreira com lanca e escudo de bronze",
  "um xamaa tribal com mascaras ritualisticas e cajado totemico",
  "uma dançarina mistica com veus flutuantes e joias magicas",
]

const ACTIONS = [
  // Magicas
  "conjurando um portal dimensional entre as maos",
  "invocando uma tempestade de energia arcana",
  "criando ilusoes que dançam ao redor",
  "canalizando poder antigo atraves de um cristal",
  "desenhando runas brilhantes no ar",
  "meditando enquanto flutua envolto em aura",
  // Combate
  "em posicao de combate prestes a atacar",
  "desviando de multiplos ataques com agilidade",
  "erguendo a arma em grito de guerra",
  "defendendo aliados com escudo magico",
  "lancando um golpe devastador contra inimigos",
  "recuperando o folego apos uma batalha intensa",
  // Exploracao
  "examinando um artefato misterioso com curiosidade",
  "decifrando inscricoes antigas em uma parede",
  "abrindo um bau repleto de tesouros brilhantes",
  "escalando uma estrutura impossivel com determinacao",
  "navegando por um mapa estelar holografico",
  "descobrindo uma passagem secreta escondida",
  // Emocional
  "contemplando o horizonte com olhar melancolico",
  "rindo triunfante apos uma vitoria",
  "chorando silenciosamente sob a chuva",
  "abraçando um companheiro em despedida",
  "encarando o perigo com determinacao feroz",
  "lembrando do passado com um sorriso nostalgico",
  // Acao Dinamica
  "saltando de um penhasco com asas abertas",
  "correndo em alta velocidade deixando rastros de luz",
  "deslizando por superficies verticais",
  "transformando-se em uma forma magica",
  "voando entre nuvens tempestuosas",
  "emergindo das aguas com poder renovado",
  // Interacao
  "conversando com espiritos invisiveis",
  "comandando um exercito de criaturas magicas",
  "curando um aliado ferido com magia suave",
  "negociando com entidades misteriosas",
  "treinando jovens aprendizes com paciencia",
  "realizando um ritual sagrado sob a lua",
]

const SETTINGS = [
  // Fantasia
  "em uma floresta encantada com arvores gigantes e luzes magicas",
  "dentro de um castelo flutuante entre as nuvens",
  "em uma biblioteca infinita com livros que sussurram segredos",
  "numa caverna de cristais que cantam com a luz",
  "em um jardim eterno onde o tempo nao passa",
  "sobre uma ponte de arco-iris conectando mundos",
  "em um vulcao adormecido com lava cristalizada",
  "numa cidade submersa iluminada por corais bioluminescentes",
  // Ficcao Cientifica
  "em uma estacao espacial orbitando um buraco negro",
  "numa cidade cyberpunk com arranha-ceus holograficos",
  "dentro de uma nave alienigena com tecnologia organica",
  "em um planeta deserto com dois sois no horizonte",
  "numa colonia marciana durante uma tempestade de poeira",
  "em um laboratorio quantico com portais dimensionais",
  "numa megacidade vertical que se estende por quilometros",
  "em uma realidade virtual com paisagens impossiveis",
  // Medieval
  "em um campo de batalha apos uma grande guerra",
  "dentro de uma taverna medieval cheia de aventureiros",
  "nas ruinas de um imperio antigo coberto de vegetacao",
  "em uma fortaleza sitiada sob chuva torrencial",
  "numa feira medieval colorida e movimentada",
  "em um monastério isolado nas montanhas nevadas",
  // Natureza
  "em uma cachoeira magica onde a agua flui para cima",
  "numa pradaria infinita sob um ceu estrelado",
  "dentro de uma arvore ancestral oca e viva",
  "em um pantano misterioso coberto de neblina",
  "sobre um pico montanhoso acima das nuvens",
  "em uma praia de areia negra com aurora boreal",
  // Atmosferico
  "sob uma lua cheia gigante em um mundo alienigena",
  "durante um eclipse solar com luz sobrenatural",
  "em um cemiterio antigo com espiritos visíveis",
  "numa tempestade de raios com ceu roxo e verde",
  "ao amanhecer em um mundo onde o sol nasce dourado",
  "durante uma chuva de meteoros coloridos",
  "em um deserto de sal sob um ceu infinito",
  "numa cidade abandonada sendo reclamada pela natureza",
]

type SceneIdea = {
  id: number
  character: string
  action: string
  setting: string
}

// Function to generate unique random ideas
const generateUniqueIdeas = (count: number): SceneIdea[] => {
  const ideas: SceneIdea[] = []
  const usedCombinations = new Set<string>()
  
  while (ideas.length < count && ideas.length < CHARACTERS.length * ACTIONS.length * SETTINGS.length) {
    const character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
    const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
    const setting = SETTINGS[Math.floor(Math.random() * SETTINGS.length)]
    
    const combination = `${character}|${action}|${setting}`
    
    if (!usedCombinations.has(combination)) {
      usedCombinations.add(combination)
      ideas.push({
        id: ideas.length + 1,
        character,
        action,
        setting,
      })
    }
  }
  
  return ideas
}

// Variation data for random scene generation
const ACTION_VARIATIONS = [
  "standing heroically",
  "running swiftly",
  "casting a spell",
  "meditating peacefully",
  "fighting fiercely",
  "exploring curiously",
  "dancing gracefully",
  "leaping through the air",
  "crouching in stealth",
  "reaching toward the sky",
]

const SETTING_VARIATIONS = [
  "a mystical forest at dawn",
  "an ancient temple ruins",
  "a futuristic cityscape at night",
  "a serene mountain peak",
  "a stormy ocean cliff",
  "a magical garden with floating lights",
  "a vast desert under starlight",
  "a cozy medieval tavern",
  "a frozen tundra with northern lights",
  "a lush jungle with waterfalls",
]

interface SceneVariation {
  id: number
  promptEn: string
  promptPt: string
  action: string
  setting: string
  lighting: string
  composition: string
}

interface StoryboardFrame {
  id: number
  title: string
  promptEn: string
  promptPt: string
  action: string
  setting: string
  lighting: string
  composition: string
}

interface StyleOption {
  value: string
  label: string
  labelPt: string
  microEn: string
  microPt: string
  group: string
}

const STYLE_GROUPS = [
  { id: "hand-drawn", label: "Hand-drawn & Painterly", labelPt: "Desenho a Mao e Pintura" },
  { id: "cartoon", label: "Cartoon Styles", labelPt: "Estilos Cartoon" },
  { id: "anime-manga", label: "Anime & Manga", labelPt: "Anime e Manga" },
  { id: "artistic", label: "Artistic & Experimental", labelPt: "Artistico e Experimental" },
  { id: "3d-stylized", label: "3D Stylized", labelPt: "3D Estilizado" },
  { id: "3d-realistic", label: "3D Realistic & Cinematic", labelPt: "3D Realista e Cinematografico" },
  { id: "3d-specialized", label: "3D Specialized", labelPt: "3D Especializado" },
]

const STYLE_OPTIONS: StyleOption[] = [
  // Hand-drawn & Painterly
  { 
    value: "hand-drawn-2d", 
    label: "Hand-drawn 2D",
    labelPt: "Desenho 2D feito a mao",
    microEn: "organic hand-drawn lines, natural pencil textures, sketch-like quality, artistic imperfections, warm traditional feel",
    microPt: "linhas organicas feitas a mao, texturas naturais de lapis, qualidade de esboco, imperfeicoes artisticas, sensacao tradicional calorosa",
    group: "hand-drawn"
  },
  { 
    value: "stylized-2d-painterly", 
    label: "Stylized 2D Painterly",
    labelPt: "Pintura digital estilizada",
    microEn: "visible brush strokes, rich color blending, painterly textures, artistic color choices, expressive mark-making",
    microPt: "pinceladas visiveis, mistura rica de cores, texturas pictoricas, escolhas artisticas de cor, marcas expressivas",
    group: "hand-drawn"
  },
  { 
    value: "editorial", 
    label: "Editorial Illustration",
    labelPt: "Ilustracao editorial",
    microEn: "sophisticated color palette, conceptual composition, stylized shapes, metaphorical elements, modern graphic design influence",
    microPt: "paleta de cores sofisticada, composicao conceitual, formas estilizadas, elementos metaforicos, influencia de design grafico moderno",
    group: "hand-drawn"
  },
  { 
    value: "ink-based", 
    label: "Ink-based Illustration",
    labelPt: "Ilustracao em tinta",
    microEn: "bold ink lines, high contrast black and white, expressive brush work, dynamic line weight, traditional ink textures",
    microPt: "linhas de tinta marcantes, alto contraste preto e branco, pinceladas expressivas, peso de linha dinamico, texturas tradicionais de tinta",
    group: "hand-drawn"
  },
  { 
    value: "expressionist", 
    label: "Expressionist Illustration",
    labelPt: "Ilustracao expressionista",
    microEn: "emotional color use, distorted forms, bold expressive strokes, raw artistic energy, subjective interpretation",
    microPt: "uso emocional de cor, formas distorcidas, pinceladas expressivas ousadas, energia artistica crua, interpretacao subjetiva",
    group: "hand-drawn"
  },
  { 
    value: "graphic-novel", 
    label: "Graphic Novel Illustration",
    labelPt: "Ilustracao de graphic novel",
    microEn: "dramatic ink work, rich shadows, cinematic panel composition, gritty textures, noir-inspired contrast",
    microPt: "trabalho dramatico em nanquim, sombras ricas, composicao cinematografica de paineis, texturas asperas, contraste inspirado no noir",
    group: "hand-drawn"
  },
  { 
    value: "digital-comic", 
    label: "Digital Comic Illustration",
    labelPt: "Ilustracao de quadrinhos digitais",
    microEn: "clean digital lines, vibrant flat colors, dynamic action poses, bold outlines, modern comic aesthetics",
    microPt: "linhas digitais limpas, cores chapadas vibrantes, poses de acao dinamicas, contornos marcantes, estetica moderna de quadrinhos",
    group: "hand-drawn"
  },
  // Cartoon Styles
  { 
    value: "rubber-hose", 
    label: "2D Rubber Hose Cartoon",
    labelPt: "Cartoon Rubber Hose",
    microEn: "bendy limbs, circular shapes, vintage 1930s aesthetic, simple eyes, bouncy animation style, nostalgic charm",
    microPt: "membros flexiveis, formas circulares, estetica vintage dos anos 1930, olhos simples, estilo de animacao saltitante, charme nostalgico",
    group: "cartoon"
  },
  { 
    value: "western-cartoon", 
    label: "2D Western Cartoon",
    labelPt: "Cartoon ocidental",
    microEn: "bold outlines, exaggerated expressions, squash and stretch, vibrant colors, comedic timing, dynamic poses",
    microPt: "contornos marcantes, expressoes exageradas, squash and stretch, cores vibrantes, timing comico, poses dinamicas",
    group: "cartoon"
  },
  { 
    value: "cartoon-game", 
    label: "2D Cartoon Game Style",
    labelPt: "Cartoon estilo game",
    microEn: "game-ready character design, clean vector lines, readable silhouettes, optimized color palette, appealing proportions",
    microPt: "design de personagem pronto para games, linhas vetoriais limpas, silhuetas legiveis, paleta de cores otimizada, proporcoes atraentes",
    group: "cartoon"
  },
  { 
    value: "stylized-cartoon", 
    label: "Stylized 2D Cartoon",
    labelPt: "Cartoon estilizado",
    microEn: "unique artistic style, simplified forms, bold color choices, distinctive character shapes, modern cartoon aesthetics",
    microPt: "estilo artistico unico, formas simplificadas, escolhas de cor ousadas, formas de personagem distintas, estetica moderna de cartoon",
    group: "cartoon"
  },
  // Anime & Manga
  { 
    value: "anime-graphic-novel", 
    label: "Anime Graphic Novel Inspired",
    labelPt: "Anime estilo graphic novel",
    microEn: "anime character design with graphic novel storytelling, dramatic angles, cinematic framing, detailed backgrounds",
    microPt: "design de personagem anime com narrativa de graphic novel, angulos dramaticos, enquadramento cinematografico, fundos detalhados",
    group: "anime-manga"
  },
  { 
    value: "hand-drawn-manga", 
    label: "2D Hand-Drawn Manga Style",
    labelPt: "Manga desenhado a mao",
    microEn: "traditional manga ink work, screentone textures, expressive eyes, dynamic speed lines, detailed crosshatching",
    microPt: "trabalho tradicional de manga em tinta, texturas reticuladas, olhos expressivos, linhas de velocidade dinamicas, hachuras detalhadas",
    group: "anime-manga"
  },
  { 
    value: "action-manga", 
    label: "2D Action Manga",
    labelPt: "Manga de acao",
    microEn: "intense action poses, powerful impact frames, dramatic speed lines, high energy composition, dynamic panel layouts",
    microPt: "poses de acao intensas, quadros de impacto poderosos, linhas de velocidade dramaticas, composicao de alta energia, layouts de paineis dinamicos",
    group: "anime-manga"
  },
  { 
    value: "digital-anime", 
    label: "2D Digital Anime Illustration",
    labelPt: "Ilustracao anime digital",
    microEn: "clean anime line art, soft cel shading, vibrant colors, expressive character design, detailed eyes and hair",
    microPt: "traco limpo estilo anime, sombreamento cel suave, cores vibrantes, design de personagem expressivo, olhos e cabelos detalhados",
    group: "anime-manga"
  },
  // Artistic & Experimental
  { 
    value: "ink-symbolic", 
    label: "2D Ink Symbolic Illustration",
    labelPt: "Ilustracao simbolica em tinta",
    microEn: "symbolic imagery, bold ink strokes, metaphorical composition, minimalist yet impactful, artistic abstraction",
    microPt: "imagens simbolicas, pinceladas de tinta marcantes, composicao metaforica, minimalista mas impactante, abstracao artistica",
    group: "artistic"
  },
  { 
    value: "psychedelic-editorial", 
    label: "2D Psychedelic Editorial Illustration",
    labelPt: "Ilustracao editorial psicodelica",
    microEn: "vibrant psychedelic colors, surreal compositions, flowing organic shapes, trippy patterns, mind-bending visuals",
    microPt: "cores psicodelicas vibrantes, composicoes surreais, formas organicas fluidas, padroes alucinantes, visuais que desafiam a mente",
    group: "artistic"
  },
  { 
    value: "expressionist-art", 
    label: "2D Expressionist Art Style",
    labelPt: "Arte expressionista",
    microEn: "raw emotional expression, bold distorted forms, intense color contrasts, visible artistic process, subjective reality",
    microPt: "expressao emocional crua, formas distorcidas ousadas, contrastes de cor intensos, processo artistico visivel, realidade subjetiva",
    group: "artistic"
  },
  { 
    value: "stylized-painterly", 
    label: "Stylized 2D Painterly Illustration",
    labelPt: "Pintura digital estilizada",
    microEn: "artistic brush work, rich painterly textures, sophisticated color harmony, expressive mark-making, gallery quality",
    microPt: "trabalho artistico de pincel, texturas pictoricas ricas, harmonia de cores sofisticada, marcas expressivas, qualidade de galeria",
    group: "artistic"
  },
  // 3D Stylized
  { 
    value: "pixar-like", 
    label: "3D Pixar-like Animation",
    labelPt: "Animacao 3D estilo Pixar",
    microEn: "appealing character design, expressive facial features, rich material textures, global illumination, cinematic depth of field",
    microPt: "design de personagem cativante, caracteristicas faciais expressivas, texturas de material ricas, iluminacao global, profundidade de campo cinematografica",
    group: "3d-stylized"
  },
  { 
    value: "3d-stylized-cartoon", 
    label: "3D Stylized Cartoon",
    labelPt: "Cartoon 3D estilizado",
    microEn: "stylized 3D proportions, bold colors, clean surfaces, exaggerated features, playful character design",
    microPt: "proporcoes 3D estilizadas, cores marcantes, superficies limpas, caracteristicas exageradas, design de personagem divertido",
    group: "3d-stylized"
  },
  { 
    value: "3d-cinematic-stylized", 
    label: "3D Cinematic Stylized Animation",
    labelPt: "Animacao 3D cinematografica estilizada",
    microEn: "cinematic camera work, stylized realism, dramatic lighting, rich atmosphere, film-quality rendering",
    microPt: "trabalho de camera cinematografico, realismo estilizado, iluminacao dramatica, atmosfera rica, renderizacao de qualidade de filme",
    group: "3d-stylized"
  },
  { 
    value: "stop-motion", 
    label: "Stop-Motion Animation Style",
    labelPt: "Estilo animacao stop motion",
    microEn: "tactile material textures, handcrafted aesthetic, visible craft details, warm lighting, charming imperfections",
    microPt: "texturas de materiais tateis, estetica artesanal, detalhes de craft visiveis, iluminacao quente, imperfeicoes encantadoras",
    group: "3d-stylized"
  },
  { 
    value: "npr-3d", 
    label: "Non-Photorealistic 3D (NPR)",
    labelPt: "3D nao fotorrealista",
    microEn: "stylized rendering, cel-shaded look, outline effects, painterly 3D, artistic non-realistic lighting",
    microPt: "renderizacao estilizada, aparencia cel-shaded, efeitos de contorno, 3D pictorico, iluminacao artistica nao realista",
    group: "3d-stylized"
  },
  // 3D Realistic & Cinematic
  { 
    value: "3d-surreal-cgi", 
    label: "3D Surreal CGI",
    labelPt: "CGI surreal",
    microEn: "surreal compositions, impossible physics, dreamlike environments, high-quality CGI, mind-bending visuals",
    microPt: "composicoes surreais, fisica impossivel, ambientes oniricos, CGI de alta qualidade, visuais que desafiam a mente",
    group: "3d-realistic"
  },
  { 
    value: "3d-hyperreal-cinematic", 
    label: "3D Hyperreal Cinematic",
    labelPt: "Cinematico hiper-realista",
    microEn: "hyperrealistic detail, cinematic lighting, film grain, atmospheric depth, professional color grading",
    microPt: "detalhes hiper-realistas, iluminacao cinematografica, granulacao de filme, profundidade atmosferica, correcao de cor profissional",
    group: "3d-realistic"
  },
  { 
    value: "photorealistic-cgi", 
    label: "3D Photorealistic CGI",
    labelPt: "CGI fotorrealista",
    microEn: "photorealistic rendering, accurate materials, realistic lighting, subsurface scattering, ray-traced reflections",
    microPt: "renderizacao fotorrealista, materiais precisos, iluminacao realista, dispersao subsuperficial, reflexos ray-traced",
    group: "3d-realistic"
  },
  { 
    value: "digital-human", 
    label: "Photorealistic Digital Human",
    labelPt: "Humano digital fotorrealista",
    microEn: "realistic skin detail, accurate anatomy, subtle micro-expressions, realistic eyes, natural hair simulation",
    microPt: "detalhes realistas de pele, anatomia precisa, micro-expressoes sutis, olhos realistas, simulacao natural de cabelo",
    group: "3d-realistic"
  },
  // 3D Specialized
  { 
    value: "isometric-diorama", 
    label: "3D Isometric Diorama",
    labelPt: "Diorama isometrico 3D",
    microEn: "isometric camera angle, miniature world aesthetic, detailed environments, tilt-shift effect, charming scale",
    microPt: "angulo de camera isometrico, estetica de mundo em miniatura, ambientes detalhados, efeito tilt-shift, escala encantadora",
    group: "3d-specialized"
  },
  { 
    value: "performance-hyperreal", 
    label: "3D Performance-Driven Hyperreal",
    labelPt: "Animacao hiper-realista baseada em performance",
    microEn: "motion capture quality, realistic performance, nuanced expressions, lifelike movement, cinematic acting",
    microPt: "qualidade de motion capture, performance realista, expressoes nuancadas, movimento realista, atuacao cinematografica",
    group: "3d-specialized"
  },
]

const LIGHTING_OPTIONS = [
  { 
    value: "golden-hour", 
    label: "Golden Hour", 
    labelPt: "Hora Dourada",
    descEn: "warm golden sunlight creating long shadows and soft highlights, cinematic atmosphere",
    descPt: "luz dourada do sol criando sombras longas e realces suaves, atmosfera cinematográfica"
  },
  { 
    value: "soft-daylight", 
    label: "Soft Daylight", 
    labelPt: "Luz do Dia Suave",
    descEn: "gentle diffused daylight with balanced exposure and natural soft shadows",
    descPt: "luz do dia suave e difusa com exposição equilibrada e sombras naturais"
  },
  { 
    value: "dramatic", 
    label: "Dramatic Lighting", 
    labelPt: "Iluminação Dramática",
    descEn: "high contrast lighting with deep shadows and intense highlights, moody atmosphere",
    descPt: "iluminação de alto contraste com sombras profundas e realces intensos, atmosfera marcante"
  },
  { 
    value: "studio", 
    label: "Studio Lighting", 
    labelPt: "Iluminação de Estúdio",
    descEn: "professional three-point lighting setup with clean highlights and controlled shadows",
    descPt: "iluminação profissional de três pontos com realces limpos e sombras controladas"
  },
  { 
    value: "backlight", 
    label: "Backlight", 
    labelPt: "Contraluz",
    descEn: "soft cinematic backlight creating depth and ethereal glow around the subject",
    descPt: "contraluz cinematográfico suave criando profundidade e brilho etéreo ao redor do sujeito"
  },
  { 
    value: "cloudy-soft", 
    label: "Cloudy Soft Light", 
    labelPt: "Luz Suave Nublada",
    descEn: "overcast sky providing even, shadowless illumination with gentle tones",
    descPt: "céu nublado proporcionando iluminação uniforme e sem sombras com tons suaves"
  },
]

const COMPOSITION_OPTIONS = [
  { 
    value: "rule-of-thirds", 
    label: "Rule of Thirds", 
    labelPt: "Regra dos Terços",
    descEn: "dynamic rule of thirds composition with the character positioned off-center for visual interest",
    descPt: "composição dinâmica em regra dos terços com o personagem posicionado fora do centro para interesse visual"
  },
  { 
    value: "centered", 
    label: "Centered Composition", 
    labelPt: "Composição Centralizada",
    descEn: "balanced centered framing with visual focus on the character, symmetrical elements",
    descPt: "enquadramento centralizado e equilibrado com foco visual no personagem, elementos simétricos"
  },
  { 
    value: "low-angle", 
    label: "Low Angle", 
    labelPt: "Ângulo Baixo",
    descEn: "dramatic low-angle perspective looking up at the character, emphasizing power and presence",
    descPt: "perspectiva dramática de ângulo baixo olhando para cima, enfatizando poder e presença"
  },
  { 
    value: "high-angle", 
    label: "High Angle", 
    labelPt: "Ângulo Alto",
    descEn: "high-angle cinematic composition looking down at the character with environmental depth",
    descPt: "composição cinematográfica de ângulo alto olhando para baixo com profundidade ambiental"
  },
  { 
    value: "wide-cinematic", 
    label: "Wide Cinematic Shot", 
    labelPt: "Plano Cinematográfico Amplo",
    descEn: "expansive wide cinematic shot capturing the full scene with epic scale and atmosphere",
    descPt: "plano amplo cinematográfico capturando a cena completa com escala épica e atmosfera"
  },
  { 
    value: "close-up", 
    label: "Close-up Shot", 
    labelPt: "Plano Close-up",
    descEn: "intimate close-up framing highlighting facial expressions and fine details",
    descPt: "enquadramento close-up íntimo destacando expressões faciais e detalhes finos"
  },
  { 
    value: "symmetrical", 
    label: "Symmetrical Composition", 
    labelPt: "Composicao Simetrica",
    descEn: "perfectly balanced symmetrical framing creating visual harmony and formal elegance",
    descPt: "enquadramento simetricamente equilibrado criando harmonia visual e elegancia formal"
  },
  { 
    value: "leading-lines", 
    label: "Leading Lines", 
    labelPt: "Linhas Guia",
    descEn: "composition using natural lines to guide the viewer's eye toward the subject",
    descPt: "composicao usando linhas naturais para guiar o olhar do espectador ate o sujeito"
  },
  { 
    value: "depth", 
    label: "Depth Composition", 
    labelPt: "Composicao em Profundidade",
    descEn: "layered composition with foreground, midground, and background creating visual depth",
    descPt: "composicao em camadas com primeiro plano, plano medio e fundo criando profundidade visual"
  },
  { 
    value: "dutch-angle", 
    label: "Dutch Angle", 
    labelPt: "Angulo Holandes",
    descEn: "tilted camera angle creating tension, unease or dynamic energy in the scene",
    descPt: "angulo de camera inclinado criando tensao, desconforto ou energia dinamica na cena"
  },
  { 
    value: "over-shoulder", 
    label: "Over the Shoulder", 
    labelPt: "Por Cima do Ombro",
    descEn: "perspective shot from behind a character looking at the scene or another subject",
    descPt: "plano de perspectiva por tras de um personagem olhando para a cena ou outro sujeito"
  },
  { 
    value: "extreme-closeup", 
    label: "Extreme Close-up", 
    labelPt: "Super Close-up",
    descEn: "very tight framing focusing on specific details like eyes, hands or objects",
    descPt: "enquadramento muito fechado focando em detalhes especificos como olhos, maos ou objetos"
  },
  { 
    value: "establishing", 
    label: "Establishing Shot", 
    labelPt: "Plano de Estabelecimento",
    descEn: "wide shot that establishes the location and context of the scene",
    descPt: "plano amplo que estabelece a localizacao e contexto da cena"
  },
  { 
    value: "top-down", 
    label: "Top Down Shot", 
    labelPt: "Plano de Cima para Baixo",
    descEn: "bird's eye view looking straight down at the scene from above",
    descPt: "visao aerea olhando diretamente para baixo na cena de cima"
  },
  { 
    value: "isometric", 
    label: "Isometric Composition", 
    labelPt: "Composicao Isometrica",
    descEn: "angled top-down view showing three dimensions equally, popular in game art",
    descPt: "visao de cima em angulo mostrando tres dimensoes igualmente, popular em arte de jogos"
  },
]

interface PromptData {
  character: string
  action: string
  setting: string
  style: string
  lighting: string
  composition: string
  cameraMovement: string
  shotType: string
  referenceImage: File | null
}

export function PromptBuilder() {
  const [formData, setFormData] = useState<PromptData>({
    character: "",
    action: "",
    setting: "",
    style: "",
    lighting: "",
    composition: "",
    cameraMovement: "",
    shotType: "",
    referenceImage: null,
  })
  const [generatedPromptEn, setGeneratedPromptEn] = useState<string>("")
  const [generatedPromptPt, setGeneratedPromptPt] = useState<string>("")
  const [copiedEn, setCopiedEn] = useState(false)
  const [copiedPt, setCopiedPt] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [sceneVariations, setSceneVariations] = useState<SceneVariation[]>([])
  const [storyboardFrames, setStoryboardFrames] = useState<StoryboardFrame[]>([])
  const [copiedVariation, setCopiedVariation] = useState<number | null>(null)
  const [copiedStoryboard, setCopiedStoryboard] = useState<number | null>(null)
  const [copiedGenerate, setCopiedGenerate] = useState<string | null>(null)
  const [showStyleLibrary, setShowStyleLibrary] = useState(false)
const [showSceneIdeas, setShowSceneIdeas] = useState(false)
  const [generatedIdeas, setGeneratedIdeas] = useState<SceneIdea[]>([])
  
  const generateSceneIdeas = () => {
    // Generate 20 unique random ideas
    const newIdeas = generateUniqueIdeas(20)
    setGeneratedIdeas(newIdeas)
    setShowSceneIdeas(true)
  }
  
  const selectSceneIdea = (idea: SceneIdea) => {
    setFormData(prev => ({
      ...prev,
      character: idea.character,
      action: idea.action,
      setting: idea.setting
    }))
    setShowSceneIdeas(false)
  }

  const handleInputChange = (field: keyof PromptData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setFormData((prev) => ({ ...prev, referenceImage: file }))
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    []
  )

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, referenceImage: null }))
    setImagePreview(null)
  }

  const generatePrompt = () => {
    const { character, action, setting, style, lighting, composition } = formData

    const styleOption = STYLE_OPTIONS.find((s) => s.value === style)
    const lightingOption = LIGHTING_OPTIONS.find((l) => l.value === lighting)
    const compositionOption = COMPOSITION_OPTIONS.find((c) => c.value === composition)

    // Build English prompt
    const sectionsEn: string[] = []
    
    // [Consistência do Personagem]
    const consistencyTags = `preserve character identity, same face, same hairstyle, same proportions, consistent design across scenes`
    if (character) {
      sectionsEn.push(`[Consistência do Personagem]\nMaintain consistent character throughout: ${character}\n${consistencyTags}`)
    } else {
      sectionsEn.push(`[Consistência do Personagem]\nMaintain character consistency throughout the scene\n${consistencyTags}`)
    }
    
    // [Consistência do Cenário]
    if (setting) {
      sectionsEn.push(`[Consistência do Cenário]\nConsistent setting: ${setting}`)
    } else {
      sectionsEn.push(`[Consistência do Cenário]\nMaintain consistent scene and environment`)
    }
    
    // [Ação do Personagem]
    if (action) {
      sectionsEn.push(`[Ação do Personagem]\n${action}`)
    } else {
      sectionsEn.push(`[Ação do Personagem]\nNatural and expressive character action`)
    }
    
    // [Cenário]
    if (setting) {
      sectionsEn.push(`[Cenário]\n${setting}`)
    } else {
      sectionsEn.push(`[Cenário]\nRich and immersive environment`)
    }
    
    // [Câmera / Enquadramento]
    const cameraLines: string[] = []
    if (compositionOption) cameraLines.push(compositionOption.descEn)
    if (formData.cameraMovement) cameraLines.push(`${formData.cameraMovement}`)
    if (cameraLines.length > 0) {
      sectionsEn.push(`[Câmera / Enquadramento]\n${cameraLines.join(", ")}`)
    } else {
      sectionsEn.push(`[Câmera / Enquadramento]\nProfessional cinematic framing`)
    }

    // [Plano]
    if (formData.shotType) {
      sectionsEn.push(`[Plano]\n${formData.shotType}`)
    } else {
      sectionsEn.push(`[Plano]\nWell-composed shot`)
    }
    
    // [Lente]
    sectionsEn.push(`[Lente]\n50mm lens, natural perspective, cinematic depth of field`)
    
    // [Composição]
    if (compositionOption) {
      sectionsEn.push(`[Composição]\n${compositionOption.descEn}`)
    } else {
      sectionsEn.push(`[Composição]\nBalanced and visually compelling composition`)
    }
    
    // [Iluminação]
    if (lightingOption) {
      sectionsEn.push(`[Iluminação]\n${lightingOption.descEn}`)
    } else {
      sectionsEn.push(`[Iluminação]\nProfessional studio lighting`)
    }
    
    // [Estilo de Renderização]
    if (styleOption) {
      sectionsEn.push(`[Estilo de Renderização]\n${styleOption.label}`)
    } else {
      sectionsEn.push(`[Estilo de Renderização]\nCinematic 3D rendering`)
    }
    
    // [Micro-Details]
    if (styleOption) {
      sectionsEn.push(`[Micro-Details]\n${styleOption.microEn}`)
    } else {
      sectionsEn.push(`[Micro-Details]\nHighly detailed, sharp focus, intricate textures, professional quality`)
    }

    const promptEn = sectionsEn.join("\n\n")
    setGeneratedPromptEn(promptEn)

    // Build Portuguese prompt
    const sectionsPt: string[] = []
    
    // [Consistência do Personagem]
    const consistencyTagsPt = `preserve character identity, same face, same hairstyle, same proportions, consistent design across scenes`
    if (character) {
      sectionsPt.push(`[Consistência do Personagem]\nManter personagem consistente: ${character}\n${consistencyTagsPt}`)
    } else {
      sectionsPt.push(`[Consistência do Personagem]\nManter consistência do personagem ao longo da cena\n${consistencyTagsPt}`)
    }
    
    // [Consistência do Cenário]
    if (setting) {
      sectionsPt.push(`[Consistência do Cenário]\nCenário consistente: ${setting}`)
    } else {
      sectionsPt.push(`[Consistência do Cenário]\nManter ambiente e cenário consistentes`)
    }
    
    // [Ação do Personagem]
    if (action) {
      sectionsPt.push(`[Ação do Personagem]\n${action}`)
    } else {
      sectionsPt.push(`[Ação do Personagem]\nAção natural e expressiva do personagem`)
    }
    
    // [Cenário]
    if (setting) {
      sectionsPt.push(`[Cenário]\n${setting}`)
    } else {
      sectionsPt.push(`[Cenário]\nAmbiente rico e imersivo`)
    }
    
    // [Câmera / Enquadramento]
    const cameraLinesPt: string[] = []
    if (compositionOption) cameraLinesPt.push(compositionOption.descPt)
    if (formData.cameraMovement) cameraLinesPt.push(`${formData.cameraMovement}`)
    if (cameraLinesPt.length > 0) {
      sectionsPt.push(`[Câmera / Enquadramento]\n${cameraLinesPt.join(", ")}`)
    } else {
      sectionsPt.push(`[Câmera / Enquadramento]\nCinematografia profissional`)
    }

    // [Plano]
    if (formData.shotType) {
      sectionsPt.push(`[Plano]\n${formData.shotType}`)
    } else {
      sectionsPt.push(`[Plano]\nPlano bem composto`)
    }
    
    // [Lente]
    sectionsPt.push(`[Lente]\nLente 50mm, perspectiva natural, profundidade de campo cinematográfica`)
    
    // [Composição]
    if (compositionOption) {
      sectionsPt.push(`[Composição]\n${compositionOption.descPt}`)
    } else {
      sectionsPt.push(`[Composição]\nComposição equilibrada e visualmente envolvente`)
    }
    
    // [Iluminação]
    if (lightingOption) {
      sectionsPt.push(`[Iluminação]\n${lightingOption.descPt}`)
    } else {
      sectionsPt.push(`[Iluminação]\nIluminação profissional em estúdio`)
    }
    
    // [Estilo de Renderização]
    if (styleOption) {
      sectionsPt.push(`[Estilo de Renderização]\n${styleOption.labelPt}`)
    } else {
      sectionsPt.push(`[Estilo de Renderização]\nRenderização 3D cinematográfica`)
    }
    
    // [Micro-Detalhes]
    if (styleOption) {
      sectionsPt.push(`[Micro-Detalhes]\n${styleOption.microPt}`)
    } else {
      sectionsPt.push(`[Micro-Detalhes]\nAltamente detalhado, foco nítido, texturas intricadas, qualidade profissional`)
    }

    const promptPt = sectionsPt.join("\n\n")
    setGeneratedPromptPt(promptPt)
  }

  const copyToClipboard = async (text: string, type: "en" | "pt") => {
    await navigator.clipboard.writeText(text)
    if (type === "en") {
      setCopiedEn(true)
      setTimeout(() => setCopiedEn(false), 2000)
    } else {
      setCopiedPt(true)
      setTimeout(() => setCopiedPt(false), 2000)
    }
  }

  const copyVariationToClipboard = async (text: string, variationId: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedVariation(variationId)
    setTimeout(() => setCopiedVariation(null), 2000)
  }

  const getRandomItem = <T,>(array: T[], exclude?: T): T => {
    const filtered = exclude ? array.filter(item => item !== exclude) : array
    return filtered[Math.floor(Math.random() * filtered.length)]
  }

  const generateSceneVariation = () => {
    if (!formData.character || !formData.style) return

    // Get random values different from current form data
    const randomAction = getRandomItem(ACTION_VARIATIONS, formData.action)
    const randomSetting = getRandomItem(SETTING_VARIATIONS, formData.setting)
    const randomLighting = getRandomItem(LIGHTING_OPTIONS, LIGHTING_OPTIONS.find(l => l.value === formData.lighting))
    const randomComposition = getRandomItem(COMPOSITION_OPTIONS, COMPOSITION_OPTIONS.find(c => c.value === formData.composition))

    const styleOption = STYLE_OPTIONS.find((s) => s.value === formData.style)

    // Build English variation prompt
    const sectionsEn: string[] = []
    
    if (styleOption) {
      sectionsEn.push(`[Style]\n${styleOption.label}`)
    }
    
    const charActionLinesEn: string[] = []
    charActionLinesEn.push(`Consistent character: ${formData.character}`)
    charActionLinesEn.push(`performing the action: ${randomAction}`)
    charActionLinesEn.push(`in the setting: ${randomSetting}`)
    sectionsEn.push(`[Character & Action]\n${charActionLinesEn.join("\n")}`)
    
    sectionsEn.push(`[Composition]\n${randomComposition.descEn}`)
    sectionsEn.push(`[Lighting]\n${randomLighting.descEn}`)
    
    if (styleOption) {
      sectionsEn.push(`[Micro-Details]\n${styleOption.microEn}`)
    }

    const promptEn = sectionsEn.join("\n\n")

    // Build Portuguese variation prompt
    const sectionsPt: string[] = []
    
    if (styleOption) {
      sectionsPt.push(`[Estilo]\n${styleOption.labelPt}`)
    }
    
    const charActionLinesPt: string[] = []
    charActionLinesPt.push(`Personagem consistente: ${formData.character}`)
    charActionLinesPt.push(`realizando a ação: ${randomAction}`)
    charActionLinesPt.push(`no cenário: ${randomSetting}`)
    sectionsPt.push(`[Personagem e Ação]\n${charActionLinesPt.join("\n")}`)
    
    sectionsPt.push(`[Composição]\n${randomComposition.descPt}`)
    sectionsPt.push(`[Iluminação]\n${randomLighting.descPt}`)
    
    if (styleOption) {
      sectionsPt.push(`[Micro-Detalhes]\n${styleOption.microPt}`)
    }

    const promptPt = sectionsPt.join("\n\n")

    const newVariation: SceneVariation = {
      id: sceneVariations.length + 1,
      promptEn,
      promptPt,
      action: randomAction,
      setting: randomSetting,
      lighting: randomLighting.label,
      composition: randomComposition.label,
    }

    setSceneVariations(prev => [...prev, newVariation])
  }

  const STORYBOARD_SEQUENCE = [
    { title: "Cena 1 - Introdução", action: "standing in a heroic pose", setting: "in an establishing wide shot environment" },
    { title: "Cena 2 - Descoberta", action: "examining something mysterious", setting: "in a dramatic close-up setting" },
    { title: "Cena 3 - Desafio", action: "facing a challenging obstacle", setting: "in a tense atmospheric environment" },
    { title: "Cena 4 - Ação", action: "performing a dynamic action sequence", setting: "in a high-energy action setting" },
    { title: "Cena 5 - Climax", action: "in the climactic moment of triumph", setting: "in an epic dramatic environment" },
    { title: "Cena 6 - Resolução", action: "in a peaceful concluding pose", setting: "in a serene resolution setting" },
  ]

  const generateStoryboard = () => {
    if (!formData.character || !formData.style || !formData.setting) return

    const styleOption = STYLE_OPTIONS.find((s) => s.value === formData.style)
    const lightingOption = LIGHTING_OPTIONS.find((l) => l.value === formData.lighting)
    const frames: StoryboardFrame[] = []

    // Camera movements for each scene
    const cameraMovements = [
      "câmera orbitando lentamente ao redor do personagem",
      "câmera lateral acompanhando o personagem suavemente",
      "câmera aproximando lentamente do personagem",
      "câmera se afastando gradualmente revelando o ambiente",
      "câmera girando horizontalmente revelando a cena",
      "câmera inclinando verticalmente revelando a cena"
    ]

    STORYBOARD_SEQUENCE.forEach((scene, index) => {
      const randomComposition = COMPOSITION_OPTIONS[Math.floor(Math.random() * COMPOSITION_OPTIONS.length)]
      const sceneCamera = cameraMovements[index % cameraMovements.length]

      // Build English storyboard prompt
      const sectionsEn: string[] = []
      
      // [Consistência do Personagem]
      const consistencyTags = `preserve character identity, same face, same hairstyle, same proportions, consistent design across scenes`
      sectionsEn.push(`[Consistência do Personagem]\nMaintain consistent character throughout: ${formData.character}\n${consistencyTags}`)
      
      // [Consistência do Cenário]
      sectionsEn.push(`[Consistência do Cenário]\nConsistent setting: ${formData.setting}`)
      
      // [Ação do Personagem]
      sectionsEn.push(`[Ação do Personagem]\n${scene.action}`)
      
      // [Cenário]
      sectionsEn.push(`[Cenário]\n${scene.setting}`)
      
      // [Câmera / Enquadramento]
      sectionsEn.push(`[Câmera / Enquadramento]\n${randomComposition.descEn}, ${sceneCamera}`)
      
      // [Plano]
      sectionsEn.push(`[Plano]\nWell-composed shot`)
      
      // [Lente]
      sectionsEn.push(`[Lente]\n50mm lens, natural perspective, cinematic depth of field`)
      
      // [Composição]
      sectionsEn.push(`[Composição]\n${randomComposition.descEn}`)
      
      // [Iluminação]
      if (lightingOption) {
        sectionsEn.push(`[Iluminação]\n${lightingOption.descEn}`)
      } else {
        sectionsEn.push(`[Iluminação]\nProfessional studio lighting`)
      }
      
      // [Estilo de Renderização]
      if (styleOption) {
        sectionsEn.push(`[Estilo de Renderização]\n${styleOption.label}`)
      } else {
        sectionsEn.push(`[Estilo de Renderização]\nCinematic 3D rendering`)
      }
      
      // [Micro-Details]
      if (styleOption) {
        sectionsEn.push(`[Micro-Details]\n${styleOption.microEn}`)
      } else {
        sectionsEn.push(`[Micro-Details]\nHighly detailed, sharp focus, intricate textures, professional quality`)
      }

      const promptEn = sectionsEn.join("\n\n")

      // Build Portuguese storyboard prompt
      const sectionsPt: string[] = []
      
      // [Consistência do Personagem]
      sectionsPt.push(`[Consistência do Personagem]\nManter personagem consistente: ${formData.character}\n${consistencyTags}`)
      
      // [Consistência do Cenário]
      sectionsPt.push(`[Consistência do Cenário]\nCenário consistente: ${formData.setting}`)
      
      // [Ação do Personagem]
      sectionsPt.push(`[Ação do Personagem]\n${scene.action}`)
      
      // [Cenário]
      sectionsPt.push(`[Cenário]\n${scene.setting}`)
      
      // [Câmera / Enquadramento]
      sectionsPt.push(`[Câmera / Enquadramento]\n${randomComposition.descPt}, ${sceneCamera}`)
      
      // [Plano]
      sectionsPt.push(`[Plano]\nPlano bem composto`)
      
      // [Lente]
      sectionsPt.push(`[Lente]\nLente 50mm, perspectiva natural, profundidade de campo cinematográfica`)
      
      // [Composição]
      sectionsPt.push(`[Composição]\n${randomComposition.descPt}`)
      
      // [Iluminação]
      if (lightingOption) {
        sectionsPt.push(`[Iluminação]\n${lightingOption.descPt}`)
      } else {
        sectionsPt.push(`[Iluminação]\nIluminação profissional em estúdio`)
      }
      
      // [Estilo de Renderização]
      if (styleOption) {
        sectionsPt.push(`[Estilo de Renderização]\n${styleOption.labelPt}`)
      } else {
        sectionsPt.push(`[Estilo de Renderização]\nRenderização 3D cinematográfica`)
      }
      
      // [Micro-Detalhes]
      if (styleOption) {
        sectionsPt.push(`[Micro-Detalhes]\n${styleOption.microPt}`)
      } else {
        sectionsPt.push(`[Micro-Detalhes]\nAltamente detalhado, foco nítido, texturas intricadas, qualidade profissional`)
      }

      const promptPt = sectionsPt.join("\n\n")

      frames.push({
        id: index + 1,
        title: scene.title,
        promptEn,
        promptPt,
        action: scene.action,
        setting: scene.setting,
        lighting: lightingOption?.label || "Professional",
        composition: randomComposition.label,
      })
    })

    setStoryboardFrames(frames)
    toast.success("Storyboard gerado com 6 cenas!")
  }

  const copyStoryboardToClipboard = async (text: string, frameId: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedStoryboard(frameId)
    setTimeout(() => setCopiedStoryboard(null), 2000)
  }

  const getStyleLabel = (value: string) =>
    STYLE_OPTIONS.find((s) => s.value === value)?.label
  const getLightingLabel = (value: string) =>
    LIGHTING_OPTIONS.find((l) => l.value === value)?.label
  const getCompositionLabel = (value: string) =>
    COMPOSITION_OPTIONS.find((c) => c.value === value)?.label

  const copyAndOpenGenerator = async (url: string, generatorName: string) => {
    await navigator.clipboard.writeText(generatedPromptEn)
    setCopiedGenerate(generatorName)
    setTimeout(() => setCopiedGenerate(null), 3000)
    window.open(url, "_blank")
  }

  const [showSidebarMenu, setShowSidebarMenu] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showLibraryOverlay, setShowLibraryOverlay] = useState(false)

  const handleSavePrompt = async () => {
    if (!generatedPromptEn || !generatedPromptPt) return
    
    setIsSaving(true)
    try {
      // Save to localStorage for offline access
      savePrompt({
        promptEn: generatedPromptEn,
        promptPt: generatedPromptPt,
        character: formData.character,
        action: formData.action,
        setting: formData.setting,
        style: formData.style,
        lighting: formData.lighting,
        composition: formData.composition,
      })

      // Try to save to Supabase if user is logged in
      try {
        const response = await fetch('/api/prompts/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `${formData.character} - ${formData.action}`,
            content: generatedPromptEn,
            style_preset: formData.style,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          if (response.status === 429) {
            // User is on free plan and has reached limit
            toast.error(errorData.error)
            return
          }
        }
      } catch (error) {
        // Silently fail if not logged in or error with Supabase
        console.debug('Could not save to Supabase:', error)
      }

      toast.success("Prompt salvo com sucesso!")
    } catch {
      toast.error("Erro ao salvar prompt")
    } finally {
      setTimeout(() => setIsSaving(false), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header with User Menu */}
        <div className="mb-8 flex justify-between items-start">
          <header className="text-center flex-1">
            <p className="mb-2 text-lg text-foreground">
              Lumo - Estúdio | Inteligência Artificial
            </p>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-5xl">
              Prompt Enhancer
            </h1>
            <p className="text-2xl font-medium text-foreground md:text-3xl">
              Create professional prompts for AI illustration generation
            </p>
          </header>
          <div className="flex-shrink-0">
            <UserMenu />
          </div>
        </div>

        {/* Step 1: Form View (when no prompt generated) */}
        {!generatedPromptEn ? (
          <>
            {/* Toggle between Form and Style Library */}
            {showStyleLibrary ? (
              <div className="mb-8">
                <Button
                  onClick={() => setShowStyleLibrary(false)}
                  variant="outline"
                  className="mb-6 rounded-full border-primary/50 px-6 py-5 text-base font-semibold transition-all hover:bg-primary/10"
                >
                  Voltar para Descricao da Cena
                </Button>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-primary">Biblioteca de Estilos</h2>
                  <p className="text-muted-foreground">Selecione um estilo para usar no seu prompt</p>
                </div>
                <StyleLibrary
                  styles={STYLE_OPTIONS}
                  groups={STYLE_GROUPS}
                  selectedStyle={formData.style}
                  onStyleSelect={(value) => {
                    handleInputChange("style", value)
                    setShowStyleLibrary(false)
                  }}
                />
              </div>
            ) : (
              <div className="mx-auto max-w-3xl">
                {/* Buttons to view Style Library and My Prompts */}
                <div className="mb-6 flex justify-center gap-4 flex-wrap">
                  <Button
                    onClick={() => setShowStyleLibrary(true)}
                    className="rounded-full bg-[#F2A900] px-6 py-5 text-base font-semibold text-black transition-all hover:bg-[#F2A900]/80 hover:shadow-lg hover:shadow-[#F2A900]/30"
                  >
                    Ver Biblioteca de Estilos
                  </Button>
                  <NextLink href="/meus-prompts">
                    <Button
                      className="rounded-full bg-[#F2A900] px-6 py-5 text-base font-semibold text-black transition-all hover:bg-[#F2A900]/80 hover:shadow-lg hover:shadow-[#F2A900]/30"
                    >
                      Meus Prompts
                    </Button>
                  </NextLink>
                </div>

                {/* Main Form Card */}
                <Card className="border-border/50 bg-card/80 shadow-lg shadow-black/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-card-foreground">
                      Construa seu Prompt
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Preencha os campos abaixo para gerar um prompt profissional
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Scene Description */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Descricao da Cena</h3>
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="character">Personagem</FieldLabel>
                          <Input
                            id="character"
                            placeholder="Ex: Uma guerreira elfica com armadura dourada"
                            value={formData.character}
                            onChange={(e) => handleInputChange("character", e.target.value)}
                          />
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="action">Acao</FieldLabel>
                          <Input
                            id="action"
                            placeholder="Ex: empunhando uma espada flamejante"
                            value={formData.action}
                            onChange={(e) => handleInputChange("action", e.target.value)}
                          />
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="setting">Cenario</FieldLabel>
                          <Textarea
                            id="setting"
                            placeholder="Ex: uma floresta mistica ao amanhecer com neblina"
                            value={formData.setting}
                            onChange={(e) => handleInputChange("setting", e.target.value)}
                            rows={3}
                          />
                        </Field>
                      </FieldGroup>
                      
                      {/* Generate Scene Ideas Button */}
                      <Button
                        type="button"
                        onClick={generateSceneIdeas}
                        variant="outline"
                        className="w-full rounded-full border-2 border-[#F2A900] text-[#F2A900] transition-all hover:bg-[#F2A900]/10"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Gerar ideia de cena
                      </Button>

                      {/* Scene Ideas Section */}
                      {showSceneIdeas && generatedIdeas.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-[#F2A900]">Ideias de Cena</h3>
                              <p className="text-sm text-muted-foreground">Clique em uma ideia para preencher os campos</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowSceneIdeas(false)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="max-h-72 overflow-y-auto rounded-lg border border-border/30 bg-background/50 p-3">
                            <div className="grid gap-3 sm:grid-cols-2">
                              {generatedIdeas.map((idea) => (
                                <button
                                  key={idea.id}
                                  type="button"
                                  onClick={() => selectSceneIdea(idea)}
                                  className="group rounded-lg border border-border/50 bg-card/80 p-3 text-left transition-all hover:border-[#F2A900] hover:bg-[#F2A900]/10 hover:shadow-lg hover:shadow-[#F2A900]/10"
                                >
                                  <div className="space-y-2 text-xs">
                                    <div>
                                      <span className="font-semibold text-[#F2A900]">Personagem:</span>
                                      <p className="text-foreground/90 line-clamp-2">{idea.character}</p>
                                    </div>
                                    <div>
                                      <span className="font-semibold text-[#F2A900]">Acao:</span>
                                      <p className="text-foreground/90 line-clamp-2">{idea.action}</p>
                                    </div>
                                    <div>
                                      <span className="font-semibold text-[#F2A900]">Cenario:</span>
                                      <p className="text-foreground/90 line-clamp-2">{idea.setting}</p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Visual Settings */}
                    <div className="space-y-4 pt-4 border-t border-border/30">
                      <h3 className="text-lg font-semibold text-foreground">Configuracoes Visuais</h3>
                      <FieldGroup className="grid gap-4 md:grid-cols-3">
                        <Field>
                          <FieldLabel>Estilo</FieldLabel>
                          <Select
                            value={formData.style}
                            onValueChange={(value) => handleInputChange("style", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um estilo" />
                            </SelectTrigger>
                            <SelectContent>
                              {STYLE_GROUPS.map((group) => (
                                <SelectGroup key={group.id}>
                                  <SelectLabel className="text-primary font-semibold">
                                    {group.label}
                                  </SelectLabel>
                                  {STYLE_OPTIONS.filter((option) => option.group === group.id).map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="py-3">
                                      <div className="flex flex-col">
                                        <span className="font-medium">{option.label}</span>
                                        <span className="text-xs text-muted-foreground">{option.labelPt}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field>
                          <FieldLabel>Iluminacao</FieldLabel>
                          <Select
                            value={formData.lighting}
                            onValueChange={(value) => handleInputChange("lighting", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a iluminacao" />
                            </SelectTrigger>
                            <SelectContent>
                              {LIGHTING_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="py-3">
                                  <div className="flex flex-col">
                                    <span className="font-medium">{option.label}</span>
                                    <span className="text-xs text-muted-foreground">{option.labelPt}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>

                        <Field>
                          <FieldLabel>Composicao</FieldLabel>
                          <Select
                            value={formData.composition}
                            onValueChange={(value) =>
                              handleInputChange("composition", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a composicao" />
                            </SelectTrigger>
                            <SelectContent>
                              {COMPOSITION_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="py-3">
                                  <div className="flex flex-col">
                                    <span className="font-medium">{option.label}</span>
                                    <span className="text-xs text-muted-foreground">{option.labelPt}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>

                        <Field>
                          <FieldLabel>Movimento de Camera (Opcional)</FieldLabel>
                          <Select
                            value={formData.cameraMovement}
                            onValueChange={(value) =>
                              handleInputChange("cameraMovement", value === "none" ? "" : value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o movimento de camera" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">
                                <div className="flex flex-col">
                                  <span className="font-medium">Nenhum</span>
                                  <span className="text-xs text-muted-foreground">Sem movimento de câmera</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="câmera orbitando lentamente ao redor do personagem" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">orbit camera</span>
                                  <span className="text-xs text-muted-foreground">câmera orbitando ao redor do personagem</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="câmera lateral acompanhando o personagem suavemente" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">tracking lateral</span>
                                  <span className="text-xs text-muted-foreground">câmera lateral acompanhando o personagem</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="câmera aproximando lentamente do personagem" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">push in</span>
                                  <span className="text-xs text-muted-foreground">câmera aproximando lentamente</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="câmera se afastando gradualmente revelando o ambiente" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">pull out</span>
                                  <span className="text-xs text-muted-foreground">câmera se afastando gradualmente</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="câmera girando horizontalmente revelando a cena" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">pan</span>
                                  <span className="text-xs text-muted-foreground">câmera girando horizontalmente</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="câmera inclinando verticalmente revelando a cena" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">tilt</span>
                                  <span className="text-xs text-muted-foreground">câmera inclinando verticalmente</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="câmera manual com movimento orgânico" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">handheld</span>
                                  <span className="text-xs text-muted-foreground">câmera manual com movimento orgânico</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="câmera aérea em movimento suave" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">drone shot</span>
                                  <span className="text-xs text-muted-foreground">câmera aérea em movimento suave</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="câmera em guindaste revelando a cena dramaticamente" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">crane shot</span>
                                  <span className="text-xs text-muted-foreground">câmera em guindaste com movimento dramático</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="efeito de zoom dinâmico criando distorção perspectiva" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">dolly zoom</span>
                                  <span className="text-xs text-muted-foreground">efeito de zoom dinâmico criando distorção</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>

                        <Field>
                          <FieldLabel>Plano Cinematografico (Opcional)</FieldLabel>
                          <Select
                            value={formData.shotType}
                            onValueChange={(value) =>
                              handleInputChange("shotType", value === "none" ? "" : value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o plano" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">
                                <div className="flex flex-col">
                                  <span className="font-medium">Nenhum</span>
                                  <span className="text-xs text-muted-foreground">Sem plano definido</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="plano aberto" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">plano aberto</span>
                                  <span className="text-xs text-muted-foreground">mostrando o ambiente completo</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="plano médio" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">plano médio</span>
                                  <span className="text-xs text-muted-foreground">enquadramento da cintura para cima</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="plano americano" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">plano americano</span>
                                  <span className="text-xs text-muted-foreground">enquadramento dos joelhos para cima</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="close-up" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">close-up</span>
                                  <span className="text-xs text-muted-foreground">focado no rosto com detalhe</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="extreme close-up" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">extreme close-up</span>
                                  <span className="text-xs text-muted-foreground">detalhes muito próximos do rosto</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="over the shoulder" className="py-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">over the shoulder</span>
                                  <span className="text-xs text-muted-foreground">visão por cima do ombro</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                      </FieldGroup>
                    </div>

                    {/* Reference Image */}
                    <div className="space-y-4 pt-4 border-t border-border/30">
                      <h3 className="text-lg font-semibold text-foreground">Imagem de Referencia (Opcional)</h3>
                      {imagePreview ? (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Referencia"
                            className="h-32 w-32 rounded-lg border border-border object-cover"
                          />
                          <button
                            onClick={removeImage}
                            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:opacity-80"
                            aria-label="Remover imagem"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {formData.referenceImage?.name}
                          </p>
                        </div>
                      ) : (
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 p-6 transition-colors hover:border-primary hover:bg-secondary/50">
                          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            Clique para fazer upload
                          </span>
                          <span className="mt-1 text-xs text-muted-foreground">
                            PNG, JPG ou WEBP (max. 10MB)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Generate Button */}
                    <div className="pt-4">
                      <Button
                        onClick={generatePrompt}
                        size="lg"
                        className="w-full rounded-full px-10 py-6 text-lg font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Gerar Prompt
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        ) : null}

        {/* Step 2: Generated Prompt View */}
        {generatedPromptEn && (
          <div className="space-y-6">

            {/* Library Overlay */}
            {showLibraryOverlay && (
              <div className="mb-8">
                <div className="mb-6 flex items-center gap-4">
                  <Button
                    onClick={() => setShowLibraryOverlay(false)}
                    variant="outline"
                    className="rounded-full border-primary/50 px-6 py-5 text-base font-semibold transition-all hover:bg-primary/10"
                  >
                    Voltar para o Prompt
                  </Button>
                  <h2 className="text-2xl font-bold text-primary">Biblioteca de Estilos</h2>
                </div>
                <StyleLibrary
                  styles={STYLE_OPTIONS}
                  groups={STYLE_GROUPS}
                  selectedStyle={formData.style}
                  onStyleSelect={(value) => {
                    handleInputChange("style", value)
                    setShowLibraryOverlay(false)
                  }}
                />
              </div>
            )}

            {/* Main content (hidden while library is open) */}
            {!showLibraryOverlay && (
            <>
            {/* Back to Form Button */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={() => {
                  setGeneratedPromptEn("")
                  setGeneratedPromptPt("")
                  setSceneVariations([])
                }}
                variant="outline"
                className="rounded-full border-primary/50 px-6 py-5 text-base font-semibold transition-all hover:bg-primary/10"
              >
                Novo Prompt
              </Button>
              <p className="text-sm text-muted-foreground">
                Seu prompt foi gerado com sucesso! Use as acoes ao lado para gerar imagens.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
              {/* Main Prompt Area */}
              <div className="space-y-6 lg:col-span-3">
                {/* English Prompt */}
                <Card className="border-primary/30 bg-card/80 shadow-lg shadow-black/20 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg text-card-foreground">
                    Prompt (English)
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedPromptEn, "en")}>
                    {copiedEn ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-secondary p-4">
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">{generatedPromptEn}</pre>
                  </div>
                </CardContent>
              </Card>

              {/* Portuguese Prompt */}
              <Card className="border-border/50 bg-card/80 shadow-lg shadow-black/20 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg text-card-foreground">
                    Prompt (Português)
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedPromptPt, "pt")}>
                    {copiedPt ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-secondary p-4">
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">{generatedPromptPt}</pre>
                  </div>
                </CardContent>
              </Card>

              {/* Prompt Components */}
              <Card className="border-border/50 bg-card/80 shadow-lg shadow-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">
                    Componentes do Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {formData.character && (
                      <span className="rounded-full bg-primary/20 px-3 py-1.5 text-sm text-primary">
                        <span className="mr-1 text-muted-foreground">Personagem:</span>
                        {formData.character}
                      </span>
                    )}
                    {formData.action && (
                      <span className="rounded-full bg-blue-500/20 px-3 py-1.5 text-sm text-blue-400">
                        <span className="mr-1 text-muted-foreground">Ação:</span>
                        {formData.action}
                      </span>
                    )}
                    {formData.setting && (
                      <span className="rounded-full bg-green-500/20 px-3 py-1.5 text-sm text-green-400">
                        <span className="mr-1 text-muted-foreground">Cenário:</span>
                        {formData.setting}
                      </span>
                    )}
                    {formData.style && (
                      <span className="rounded-full bg-orange-500/20 px-3 py-1.5 text-sm text-orange-400">
                        <span className="mr-1 text-muted-foreground">Estilo:</span>
                        {getStyleLabel(formData.style)}
                      </span>
                    )}
                    {formData.lighting && (
                      <span className="rounded-full bg-yellow-500/20 px-3 py-1.5 text-sm text-yellow-400">
                        <span className="mr-1 text-muted-foreground">Iluminação:</span>
                        {getLightingLabel(formData.lighting)}
                      </span>
                    )}
                    {formData.composition && (
                      <span className="rounded-full bg-pink-500/20 px-3 py-1.5 text-sm text-pink-400">
                        <span className="mr-1 text-muted-foreground">Composição:</span>
                        {getCompositionLabel(formData.composition)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Scene Variations */}
              {sceneVariations.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Scene Variations</h3>
                  {sceneVariations.map((variation) => (
                    <Card key={variation.id} className="border-border/50 bg-card/80 shadow-lg shadow-black/20 backdrop-blur-sm">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg text-card-foreground">
                          Scene Variation {variation.id}
                        </CardTitle>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyVariationToClipboard(variation.promptEn, variation.id)}
                        >
                          {copiedVariation === variation.id ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" />
                              Copiar
                            </>
                          )}
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="rounded-lg bg-secondary p-4">
                          <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">{variation.promptEn}</pre>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-blue-500/20 px-3 py-1.5 text-sm text-blue-400">
                            <span className="mr-1 text-muted-foreground">Action:</span>
                            {variation.action}
                          </span>
                          <span className="rounded-full bg-green-500/20 px-3 py-1.5 text-sm text-green-400">
                            <span className="mr-1 text-muted-foreground">Setting:</span>
                            {variation.setting}
                          </span>
                          <span className="rounded-full bg-yellow-500/20 px-3 py-1.5 text-sm text-yellow-400">
                            <span className="mr-1 text-muted-foreground">Lighting:</span>
                            {variation.lighting}
                          </span>
                          <span className="rounded-full bg-pink-500/20 px-3 py-1.5 text-sm text-pink-400">
                            <span className="mr-1 text-muted-foreground">Composition:</span>
                            {variation.composition}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Storyboard Frames */}
              {storyboardFrames.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Storyboard (6 Cenas)</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {storyboardFrames.map((frame) => (
                      <Card key={frame.id} className="border-border/50 bg-card/80 shadow-lg shadow-black/20 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-base text-purple-400">
                            {frame.title}
                          </CardTitle>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyStoryboardToClipboard(frame.promptEn, frame.id)}
                          >
                            {copiedStoryboard === frame.id ? (
                              <>
                                <Check className="mr-1 h-3 w-3" />
                                Copiado!
                              </>
                            ) : (
                              <>
                                <Copy className="mr-1 h-3 w-3" />
                                Copiar
                              </>
                            )}
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="rounded-lg bg-secondary p-3">
                            <pre className="whitespace-pre-wrap text-xs text-foreground font-mono">{frame.promptEn}</pre>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-400">
                              {frame.action}
                            </span>
                            <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs text-yellow-400">
                              {frame.lighting}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Actions */}
            <div className="lg:col-span-1">
              {/* Desktop Sidebar */}
              <div className="hidden lg:block sticky top-8">
                <Card className="border-border/50 bg-card/80 shadow-lg shadow-black/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-card-foreground">
                      Ações com este Prompt
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {/* Primary action */}
                    <Button
                      onClick={() => copyAndOpenGenerator("https://estudio-lumo.com", "lumo")}
                      className="w-full rounded-full bg-[#F2A900] px-4 py-3 text-xs font-semibold text-black shadow-lg shadow-[#F2A900]/25 transition-all hover:bg-[#F2A900]/70 hover:text-black hover:shadow-xl hover:shadow-[#F2A900]/30 justify-start"
                    >
                      Gerar imagem no Lumo Studio
                    </Button>

                    {/* Secondary actions - all same pattern: border-2, bg-transparent, colored text, hover changes text to white */}
                    <Button
                      onClick={() => copyAndOpenGenerator("https://www.freepik.com/ai/image-generator", "freepik")}
                      className="w-full rounded-full border-2 border-[#F2A900] bg-transparent px-4 py-3 text-xs font-semibold text-[#F2A900] transition-all hover:bg-[#F2A900]/20 hover:text-[#F2A900] hover:shadow-md justify-start"
                    >
                      Gerar no Freepik
                    </Button>
                    <Button
                      onClick={generateSceneVariation}
                      disabled={!generatedPromptEn || !formData.character || !formData.style}
                      className="w-full rounded-full border-2 border-blue-500 bg-transparent px-4 py-3 text-xs font-semibold text-blue-400 transition-all hover:bg-blue-500/20 hover:text-blue-300 hover:shadow-md justify-start disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Gerar variacoes de movimento
                    </Button>
                    <Button
                      onClick={generateStoryboard}
                      disabled={!generatedPromptEn || !formData.character || !formData.style}
                      className="w-full rounded-full border-2 border-purple-500 bg-transparent px-4 py-3 text-xs font-semibold text-purple-400 transition-all hover:bg-purple-500/20 hover:text-purple-300 hover:shadow-md justify-start disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Gerar storyboard
                    </Button>
                    <Button
                      onClick={handleSavePrompt}
                      disabled={isSaving}
                      className="w-full rounded-full border-2 border-green-500 bg-transparent px-4 py-3 text-xs font-semibold text-green-400 transition-all hover:bg-green-500/20 hover:text-green-300 hover:shadow-md justify-start disabled:opacity-40"
                    >
                      {isSaving ? (
                        <>
                          <BookmarkCheck className="mr-2 h-4 w-4" />
                          Salvo!
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Salvar Prompt
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowLibraryOverlay(true)}
                      className="w-full rounded-full border-2 border-orange-400 bg-transparent px-4 py-3 text-xs font-semibold text-orange-400 transition-all hover:bg-orange-400/20 hover:text-orange-300 hover:shadow-md justify-start"
                    >
                      Visualizar Biblioteca
                    </Button>

                    <div className="pt-2 border-t border-border/30 space-y-2">
                      <Button
                        onClick={() => {
                          setGeneratedPromptEn("")
                          setGeneratedPromptPt("")
                        }}
                        className="w-full rounded-full border-2 border-cyan-500 bg-transparent px-4 py-3 text-xs font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-300 hover:shadow-md justify-start"
                      >
                        Editar Prompt
                      </Button>
                      <NextLink href="/meus-prompts">
                        <Button
                          className="w-full rounded-full border-2 border-indigo-500 bg-transparent px-4 py-3 text-xs font-semibold text-indigo-400 transition-all hover:bg-indigo-500/20 hover:text-indigo-300 hover:shadow-md justify-start"
                        >
                          Meus Prompts Salvos
                        </Button>
                      </NextLink>
                    </div>
                    {copiedGenerate && (
                      <p className="mt-4 text-xs text-primary animate-in fade-in slide-in-from-bottom-2 text-center">
                        Prompt copiado!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Mobile Dropdown */}
              <div className="lg:hidden fixed bottom-6 right-6 z-50">
                <div className="relative">
                  <Button
                    onClick={() => setShowSidebarMenu(!showSidebarMenu)}
                    className="rounded-full bg-[#F2A900] px-4 py-5 text-black shadow-lg shadow-[#F2A900]/30 transition-all hover:bg-[#F2A900]/80 h-14 w-14 flex items-center justify-center"
                  >
                    <Sparkles className="h-6 w-6" />
                  </Button>
                  
                  {showSidebarMenu && (
                    <div className="absolute bottom-20 right-0 w-60 space-y-2 bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg shadow-black/30">
                      <Button
                        onClick={() => {
                          copyAndOpenGenerator("https://estudio-lumo.com", "lumo")
                          setShowSidebarMenu(false)
                        }}
                        className="w-full rounded-full bg-[#F2A900] px-4 py-3 text-xs font-semibold text-black transition-all hover:bg-[#F2A900]/70 hover:text-black justify-start"
                      >
                        Gerar imagem no Lumo Studio
                      </Button>
                      <Button
                        onClick={() => {
                          copyAndOpenGenerator("https://www.freepik.com/ai/image-generator", "freepik")
                          setShowSidebarMenu(false)
                        }}
                        className="w-full rounded-full border-2 border-[#F2A900] bg-transparent px-4 py-3 text-xs font-semibold text-[#F2A900] transition-all hover:bg-[#F2A900]/20 hover:text-[#F2A900] justify-start"
                      >
                        Gerar no Freepik
                      </Button>
                      <Button
                        onClick={() => {
                          generateSceneVariation()
                          setShowSidebarMenu(false)
                        }}
                        disabled={!generatedPromptEn || !formData.character || !formData.style}
                        className="w-full rounded-full border-2 border-blue-500 bg-transparent px-4 py-3 text-xs font-semibold text-blue-400 transition-all hover:bg-blue-500/20 hover:text-blue-300 justify-start disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Gerar variacoes de movimento
                      </Button>
                      <Button
                        onClick={() => {
                          generateStoryboard()
                          setShowSidebarMenu(false)
                        }}
                        disabled={!generatedPromptEn || !formData.character || !formData.style}
                        className="w-full rounded-full border-2 border-purple-500 bg-transparent px-4 py-3 text-xs font-semibold text-purple-400 transition-all hover:bg-purple-500/20 hover:text-purple-300 justify-start disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Gerar storyboard
                      </Button>
                      <Button
                        onClick={() => {
                          handleSavePrompt()
                          setShowSidebarMenu(false)
                        }}
                        disabled={isSaving}
                        className="w-full rounded-full border-2 border-green-500 bg-transparent px-4 py-3 text-xs font-semibold text-green-400 transition-all hover:bg-green-500/20 hover:text-green-300 justify-start disabled:opacity-40"
                      >
                        {isSaving ? "Salvo!" : "Salvar Prompt"}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowLibraryOverlay(true)
                          setShowSidebarMenu(false)
                        }}
                        className="w-full rounded-full border-2 border-orange-400 bg-transparent px-4 py-3 text-xs font-semibold text-orange-400 transition-all hover:bg-orange-400/20 hover:text-orange-300 justify-start"
                      >
                        Visualizar Biblioteca
                      </Button>
                      <div className="pt-2 border-t border-border/30 space-y-2">
                        <Button
                          onClick={() => {
                            setGeneratedPromptEn("")
                            setGeneratedPromptPt("")
                            setShowSidebarMenu(false)
                          }}
                          className="w-full rounded-full border-2 border-cyan-500 bg-transparent px-4 py-3 text-xs font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-300 justify-start"
                        >
                          Editar Prompt
                        </Button>
                        <NextLink href="/meus-prompts">
                          <Button
                            className="w-full rounded-full border-2 border-indigo-500 bg-transparent px-4 py-3 text-xs font-semibold text-indigo-400 transition-all hover:bg-indigo-500/20 hover:text-indigo-300 justify-start"
                          >
                            Meus Prompts Salvos
                          </Button>
                        </NextLink>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
            </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
