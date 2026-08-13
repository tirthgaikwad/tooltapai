import type { PromptWorkshop } from '@/types/workshop';
import { normalizeSlug } from '@/lib/slugs';

export const mockWorkshops: PromptWorkshop[] = [
  {
    toolId: 'midjourney',
    templates: [
      {
        useCase: 'Promotional Posters',
        blocks: [
          {
            label: 'Core Subject',
            example: 'Futuristic cyberpunk neon city skyline with a central high-tech glowing AI product display podium',
          },
          {
            label: 'Lighting & Environment',
            example: 'Volumetric cinematic blue and amber neon lighting, dark rain-slicked asphalt reflections, dramatic fog',
          },
          {
            label: 'Layout Constraints',
            example: 'Anchor primary text top-center, position QR code on the left side of the bottom.',
          },
        ],
        copyTemplate:
          'Futuristic cyberpunk neon city skyline with a central high-tech glowing AI product display podium, volumetric cinematic blue and amber neon lighting, dark rain-slicked asphalt reflections, dramatic fog. Anchor primary text top-center, position QR code on the left side of the bottom. --ar 16:9 --style raw --v 6.0',
      },
      {
        useCase: 'Cinematic Videos',
        blocks: [
          {
            label: 'Camera Angle',
            example: 'Slow 35mm tracking dolly shot at eye level, smoothly moving forward through atmospheric haze',
          },
          {
            label: 'Subject Action',
            example: 'A futuristic astronaut walking calmly through a lush bioluminescent alien rainforest at twilight',
          },
          {
            label: 'Lens & Color Grade',
            example: 'Anamorphic lens flare, shallow depth of field, warm teal and orange cinematic color grade, 8k resolution',
          },
        ],
        copyTemplate:
          'Slow 35mm tracking dolly shot at eye level, smoothly moving forward through atmospheric haze. A futuristic astronaut walking calmly through a lush bioluminescent alien rainforest at twilight. Anamorphic lens flare, shallow depth of field, warm teal and orange cinematic color grade, 8k resolution --ar 21:9 --v 6.0',
      },
      {
        useCase: 'Logo Design',
        blocks: [
          {
            label: 'Iconography',
            example: 'Abstract geometric fox head silhouette combined with glowing neural network node pathways',
          },
          {
            label: 'Minimalist Style',
            example: 'Swiss flat graphic design, clean sharp lines, dual-tone golden amber and midnight blue, high contrast',
          },
          {
            label: 'Vector Output',
            example: 'Isolated SVG vector style on a pure dark neutral background, no gradient noise, flat emblem',
          },
        ],
        copyTemplate:
          'Abstract geometric fox head silhouette combined with glowing neural network node pathways. Swiss flat graphic design, clean sharp lines, dual-tone golden amber and midnight blue, high contrast. Isolated SVG vector style on a pure dark neutral background, flat emblem --no text gradient-shading --v 6.0',
      },
    ],
  },
  {
    toolId: 'runway',
    templates: [
      {
        useCase: 'Cinematic Videos',
        blocks: [
          {
            label: 'Camera Angle',
            example: 'Low angle drone pan rising slowly above a foggy mountain crest at sunrise',
          },
          {
            label: 'Subject Action',
            example: 'Golden sunlight breaking through storm clouds onto a solitary crystal tower',
          },
          {
            label: 'Lens & Color Grade',
            example: '8k IMAX film stock, natural atmospheric bloom, golden hour color grading',
          },
        ],
        copyTemplate:
          'Low angle drone pan rising slowly above a foggy mountain crest at sunrise. Golden sunlight breaking through storm clouds onto a solitary crystal tower. 8k IMAX film stock, natural atmospheric bloom, golden hour color grading --motion 5',
      },
      {
        useCase: 'Promotional Posters',
        blocks: [
          {
            label: 'Core Subject',
            example: 'High-speed motion blur render of a conceptual electric hypercar accelerating on a dark highway',
          },
          {
            label: 'Lighting & Environment',
            example: 'Laser streaks, wet road surface, dark ambient background with orange neon rim lighting',
          },
          {
            label: 'Layout Constraints',
            example: 'Anchor primary text top-center, position QR code on the left side of the bottom.',
          },
        ],
        copyTemplate:
          'High-speed motion blur render of a conceptual electric hypercar accelerating on a dark highway. Laser streaks, wet road surface, dark ambient background with orange neon rim lighting. Anchor primary text top-center, position QR code on the left side of the bottom.',
      },
    ],
  },
  {
    toolId: 'ideogram',
    templates: [
      {
        useCase: 'Promotional Posters',
        blocks: [
          {
            label: 'Core Subject',
            example: 'Bold typography poster reading "TOOLVERSE AI" with 3D embossed metallic lettering',
          },
          {
            label: 'Lighting & Environment',
            example: 'Studio spotlight key light, dark slate texture, subtle amber particles floating in background',
          },
          {
            label: 'Layout Constraints',
            example: 'Anchor primary text top-center, position QR code on the left side of the bottom.',
          },
        ],
        copyTemplate:
          'A modern typography poster with text "TOOLVERSE AI" centered in 3D metallic golden letters. Studio spotlight, dark slate texture background. Anchor primary text top-center, position QR code on the left side of the bottom.',
      },
      {
        useCase: 'Logo Design',
        blocks: [
          {
            label: 'Iconography',
            example: 'Monogram letter "T" shaped like a sleek geometric circuit board',
          },
          {
            label: 'Minimalist Style',
            example: 'Flat vector icon design, high contrast, gold and black palette',
          },
          {
            label: 'Vector Output',
            example: 'Isolated flat graphic mark on dark background, sharp clean edges',
          },
        ],
        copyTemplate:
          'Monogram letter "T" shaped like a sleek geometric circuit board. Flat vector icon design, high contrast, gold and black palette. Isolated flat graphic mark on dark background.',
      },
    ],
  },
  {
    toolId: 'chatgpt',
    templates: [
      {
        useCase: 'Promotional Posters',
        blocks: [
          {
            label: 'Core Subject',
            example: 'DALL-E 3 image prompt generating a high-converting tech event poster for an AI summit',
          },
          {
            label: 'Lighting & Environment',
            example: 'Dark mode UI palette, glowing gradient highlights, sharp vector typography frame',
          },
          {
            label: 'Layout Constraints',
            example: 'Anchor primary text top-center, position QR code on the left side of the bottom.',
          },
        ],
        copyTemplate:
          'Generate a high-converting tech event poster for an AI summit in dark mode UI style. Anchor primary text top-center, position QR code on the left side of the bottom.',
      },
    ],
  },
  {
    toolId: 'claude',
    templates: [
      {
        useCase: 'Promotional Posters',
        blocks: [
          {
            label: 'Core Subject',
            example: 'System prompt architecture for crafting high-performing visual design briefs',
          },
          {
            label: 'Lighting & Environment',
            example: 'Structured XML tags format with step-by-step reasoning constraints',
          },
          {
            label: 'Layout Constraints',
            example: 'Anchor primary text top-center, position QR code on the left side of the bottom.',
          },
        ],
        copyTemplate:
          '<system_prompt>You are an expert design director. Create a poster specification where you anchor primary text top-center, position QR code on the left side of the bottom.</system_prompt>',
      },
    ],
  },
];

/**
 * Finds a matching prompt workshop for a tool by ID or slug/name.
 */
export function getPromptWorkshop(tool: { id?: number | string; name?: string }): PromptWorkshop | null {
  if (!tool) return null;

  const idStr = tool.id ? String(tool.id) : '';
  const slug = tool.name ? normalizeSlug(tool.name) : '';

  // 1. Direct slug match
  const matchBySlug = mockWorkshops.find((w) => w.toolId === slug);
  if (matchBySlug) return matchBySlug;

  // 2. Direct ID match
  const matchById = mockWorkshops.find((w) => w.toolId === idStr);
  if (matchById) return matchById;

  // 3. Fallback partial slug or name match (e.g. 'midjourney-v6' matches 'midjourney')
  const partialMatch = mockWorkshops.find((w) => slug.includes(w.toolId) || w.toolId.includes(slug));
  if (partialMatch) return partialMatch;

  return null;
}
