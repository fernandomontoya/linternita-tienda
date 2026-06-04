export type Category = "aromaticas" | "decorativas" | "relajacion" | "regalo" | "navidad";

export interface ProductVariant {
  id: string;
  name: string;
  priceModifier: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  aromas?: string[];
  sizes?: ProductVariant[];
  featured?: boolean;
  stock: number;
}

export const categories: { id: Category; label: string }[] = [
  { id: "aromaticas", label: "Aromáticas" },
  { id: "decorativas", label: "Decorativas" },
  { id: "relajacion", label: "Relajación" },
  { id: "regalo", label: "Regalos" },
  { id: "navidad", label: "Navidad" },
];

export const products: Product[] = [
  {
    id: "vela-lavanda-grande",
    name: "Vela de Lavanda",
    description: "Elaborada artesanalmente con cera de soya y aceite esencial de lavanda. Aroma suave que invita a la calma y el descanso.",
    price: 280,
    category: "relajacion",
    image: "/images/placeholder-candle.jpg",
    aromas: ["Lavanda", "Lavanda con vainilla", "Lavanda con menta"],
    sizes: [
      { id: "chica", name: "Chica (100g)", priceModifier: 0 },
      { id: "mediana", name: "Mediana (200g)", priceModifier: 80 },
      { id: "grande", name: "Grande (350g)", priceModifier: 160 },
    ],
    featured: true,
    stock: 15,
  },
  {
    id: "vela-rosa-decorativa",
    name: "Vela Rosa Decorativa",
    description: "Vela con pétalos de rosa naturales incrustados. Perfecta para decorar y regalar. Aroma floral suave.",
    price: 320,
    category: "decorativas",
    image: "/images/placeholder-candle.jpg",
    aromas: ["Rosa", "Rosa con jazmín", "Rosa con sándalo"],
    sizes: [
      { id: "chica", name: "Chica (100g)", priceModifier: 0 },
      { id: "mediana", name: "Mediana (200g)", priceModifier: 100 },
    ],
    featured: true,
    stock: 10,
  },
  {
    id: "vela-vainilla",
    name: "Vela de Vainilla",
    description: "El clásico aroma de vainilla en su versión más cálida y acogedora. Ideal para sala o comedor.",
    price: 260,
    category: "aromaticas",
    image: "/images/placeholder-candle.jpg",
    aromas: ["Vainilla pura", "Vainilla con canela", "Vainilla con coco"],
    sizes: [
      { id: "chica", name: "Chica (100g)", priceModifier: 0 },
      { id: "mediana", name: "Mediana (200g)", priceModifier: 80 },
      { id: "grande", name: "Grande (350g)", priceModifier: 140 },
    ],
    featured: true,
    stock: 20,
  },
  {
    id: "set-regalo-3",
    name: "Set de Regalo — 3 Velas",
    description: "Tres velas artesanales a tu elección en una caja de presentación con listón. El regalo perfecto.",
    price: 650,
    category: "regalo",
    image: "/images/placeholder-candle.jpg",
    featured: true,
    stock: 8,
  },
  {
    id: "vela-eucalipto",
    name: "Vela de Eucalipto",
    description: "Aroma fresco y purificante. Perfecta para espacios de trabajo o meditación.",
    price: 270,
    category: "relajacion",
    image: "/images/placeholder-candle.jpg",
    aromas: ["Eucalipto", "Eucalipto con menta", "Eucalipto con limón"],
    sizes: [
      { id: "chica", name: "Chica (100g)", priceModifier: 0 },
      { id: "mediana", name: "Mediana (200g)", priceModifier: 80 },
    ],
    stock: 12,
  },
  {
    id: "vela-navidad-pino",
    name: "Vela Navideña de Pino",
    description: "Captura el espíritu de la navidad con aroma a pino y canela. Decoración festiva incluida.",
    price: 350,
    category: "navidad",
    image: "/images/placeholder-candle.jpg",
    aromas: ["Pino", "Pino con canela", "Pino con naranja"],
    sizes: [
      { id: "chica", name: "Chica (100g)", priceModifier: 0 },
      { id: "mediana", name: "Mediana (200g)", priceModifier: 90 },
    ],
    featured: true,
    stock: 18,
  },
  {
    id: "vela-canela-naranja",
    name: "Vela Canela & Naranja",
    description: "Mezcla cítrica y especiada que llena el hogar de calidez. Perfecta para otoño e invierno.",
    price: 265,
    category: "aromaticas",
    image: "/images/placeholder-candle.jpg",
    aromas: ["Canela con naranja", "Solo canela", "Naranja con clavo"],
    sizes: [
      { id: "chica", name: "Chica (100g)", priceModifier: 0 },
      { id: "mediana", name: "Mediana (200g)", priceModifier: 80 },
      { id: "grande", name: "Grande (350g)", priceModifier: 150 },
    ],
    stock: 14,
  },
  {
    id: "vela-jazmin",
    name: "Vela de Jazmín",
    description: "Floral y delicada. El aroma a jazmín crea un ambiente romántico y sofisticado.",
    price: 275,
    category: "aromaticas",
    image: "/images/placeholder-candle.jpg",
    aromas: ["Jazmín puro", "Jazmín con rosa", "Jazmín con ylang-ylang"],
    sizes: [
      { id: "chica", name: "Chica (100g)", priceModifier: 0 },
      { id: "mediana", name: "Mediana (200g)", priceModifier: 80 },
    ],
    stock: 11,
  },
  {
    id: "vela-geode-decorativa",
    name: "Vela Geoda Decorativa",
    description: "Vela artística con efecto cristal de geoda. Única, hecha a mano. Decoración de lujo para cualquier espacio.",
    price: 480,
    category: "decorativas",
    image: "/images/placeholder-candle.jpg",
    sizes: [
      { id: "mediana", name: "Mediana", priceModifier: 0 },
      { id: "grande", name: "Grande", priceModifier: 120 },
    ],
    stock: 5,
  },
  {
    id: "set-regalo-5",
    name: "Set de Regalo Premium — 5 Velas",
    description: "Cinco velas artesanales en una caja de lujo con papel seda, tarjeta personalizada y listón dorado.",
    price: 980,
    category: "regalo",
    image: "/images/placeholder-candle.jpg",
    featured: true,
    stock: 5,
  },
  {
    id: "vela-coco-lima",
    name: "Vela Coco & Lima",
    description: "Tropical y refrescante. Perfecta para baño o terraza. Aroma que transporta a la playa.",
    price: 255,
    category: "aromaticas",
    image: "/images/placeholder-candle.jpg",
    aromas: ["Coco con lima", "Solo coco", "Lima con menta"],
    sizes: [
      { id: "chica", name: "Chica (100g)", priceModifier: 0 },
      { id: "mediana", name: "Mediana (200g)", priceModifier: 75 },
    ],
    stock: 16,
  },
  {
    id: "vela-madera-cedro",
    name: "Vela de Cedro & Madera",
    description: "Aroma amaderado profundo y masculino. Wick de madera que produce un suave crepitar.",
    price: 320,
    category: "aromaticas",
    image: "/images/placeholder-candle.jpg",
    aromas: ["Cedro", "Cedro con sándalo", "Cedro con vetiver"],
    sizes: [
      { id: "chica", name: "Chica (100g)", priceModifier: 0 },
      { id: "mediana", name: "Mediana (200g)", priceModifier: 90 },
      { id: "grande", name: "Grande (350g)", priceModifier: 170 },
    ],
    stock: 9,
  },
];
