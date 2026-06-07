export type FactionSlug =
  | 'prefecture-of-ryu'
  | 'cult-of-yurei'
  | 'temple-of-ro-kan'
  | 'the-savage-wave'
  | 'ito-clan'
  | 'silvermoon-trade-syndicate'
  | 'the-descension'
  | 'jung-pirates'
  | 'shadow-wind-clan'
  | 'minimoto-clan'
  | 'shiho-clan'
  | 'kinshi-temple'
  | 'the-awoken'
  | 'the-imperial-court'
  | 'horse-lords-of-ataka'
  | 'ronin'

export type UnitSize = 'small' | 'medium' | 'large' | 'huge'
export type UnitType = 'model' | 'upgrade' | 'profile'
export type BaseSize = 25 | 30 | 40 | 50

export interface UnitProfile {
  move: number
  strength: number
  kiPool: number
  wounds: number
  defence: number
  armour: number
  size: UnitSize
  base: BaseSize
}

export interface KiFeat {
  id: string
  name: string
  cost: number | string   // number or 'X' for variable
  range: string
  trigger?: string
  description: string
  keywords: string[]
}

export interface Trait {
  id: string
  name: string
  description: string
  keywords: string[]
}

export interface Unit {
  id: string
  name: string
  faction: FactionSlug
  type: UnitType
  riceCost: number
  profile: UnitProfile
  traits: Trait[]
  kiFeats: KiFeat[]
  special: string           // Rendered HTML from markdown
  unique: boolean
  ronin: boolean            // Can be used as Ronin hire
  imageUrl?: string         // GCT product page image (populated in V2)
  profileCardUrl?: string   // Link to official profile card PDF page
  sourceFile: string        // Path in JwarRef repo for attribution
}

export interface FactionInfo {
  slug: FactionSlug
  name: string
  shortName: string
  colour: string
  mon: string               // Unicode or SVG path
  description: string
}

export const FACTIONS: Record<FactionSlug, FactionInfo> = {
  'prefecture-of-ryu': {
    slug: 'prefecture-of-ryu',
    name: 'Prefecture of Ryu',
    shortName: 'Prefecture',
    colour: '#8b1a1a',
    mon: '竜',
    description: 'The noble samurai of Ryu Prefecture, defenders of the Emperor\'s law.',
  },
  'cult-of-yurei': {
    slug: 'cult-of-yurei',
    name: 'Cult of Yurei',
    shortName: 'Yurei',
    colour: '#4a2a6b',
    mon: '幽',
    description: 'Worshippers of the undead, wielding the power of death itself.',
  },
  'temple-of-ro-kan': {
    slug: 'temple-of-ro-kan',
    name: 'Temple of Ro-Kan',
    shortName: 'Ro-Kan',
    colour: '#3d6b3d',
    mon: '禅',
    description: 'Monks and spirits in harmony with the natural world.',
  },
  'the-savage-wave': {
    slug: 'the-savage-wave',
    name: 'The Savage Wave',
    shortName: 'Savage Wave',
    colour: '#6b3a1a',
    mon: '鬼',
    description: 'Oni, demons and savage creatures of raw destructive power.',
  },
  'ito-clan': {
    slug: 'ito-clan',
    name: 'Ito Clan',
    shortName: 'Ito',
    colour: '#2a5e3f',
    mon: '蛇',
    description: 'Serpent cultists blessed — or cursed — by the goddess Orochi.',
  },
  'silvermoon-trade-syndicate': {
    slug: 'silvermoon-trade-syndicate',
    name: 'Silvermoon Trade Syndicate',
    shortName: 'Silvermoon',
    colour: '#2a4a7a',
    mon: '月',
    description: 'Merchants and thieves who value coin over honour.',
  },
  'the-descension': {
    slug: 'the-descension',
    name: 'The Descension',
    shortName: 'Descension',
    colour: '#1a2a4a',
    mon: '闇',
    description: 'Dark forces from beyond, corrupting all they touch.',
  },
  'jung-pirates': {
    slug: 'jung-pirates',
    name: 'Jung Pirates',
    shortName: 'Jung',
    colour: '#1a5a5a',
    mon: '海',
    description: 'Ruthless sea raiders who answer to none but the waves.',
  },
  'shadow-wind-clan': {
    slug: 'shadow-wind-clan',
    name: 'Shadow Wind Clan',
    shortName: 'Shadow Wind',
    colour: '#3a3a4a',
    mon: '影',
    description: 'Ninja masters of stealth, poison and the killing blade.',
  },
  'minimoto-clan': {
    slug: 'minimoto-clan',
    name: 'Minimoto Clan',
    shortName: 'Minimoto',
    colour: '#4a4a4a',
    mon: '鉄',
    description: 'Iron-clad warriors of unyielding strength and endurance.',
  },
  'shiho-clan': {
    slug: 'shiho-clan',
    name: 'Shiho Clan',
    shortName: 'Shiho',
    colour: '#6b5a1a',
    mon: '四',
    description: 'Noble samurai who walk the path between honour and pragmatism.',
  },
  'kinshi-temple': {
    slug: 'kinshi-temple',
    name: 'Kinshi Temple',
    shortName: 'Kinshi',
    colour: '#2a5a7a',
    mon: '金',
    description: 'Devoted warriors of the golden path, blessed by celestial ki.',
  },
  'the-awoken': {
    slug: 'the-awoken',
    name: 'The Awoken',
    shortName: 'Awoken',
    colour: '#3a5a2a',
    mon: '覚',
    description: 'Ancient spirits reborn, guardians of the natural order.',
  },
  'the-imperial-court': {
    slug: 'the-imperial-court',
    name: 'The Imperial Court',
    shortName: 'Imperial',
    colour: '#7a5a1a',
    mon: '帝',
    description: 'The Emperor\'s chosen, wielding political power as a weapon.',
  },
  'horse-lords-of-ataka': {
    slug: 'horse-lords-of-ataka',
    name: 'Horse Lords of Ataka',
    shortName: 'Horse Lords',
    colour: '#7a5a3a',
    mon: '馬',
    description: 'Mounted warriors from the steppes beyond the Empire\'s reach.',
  },
  'ronin': {
    slug: 'ronin',
    name: 'Ronin',
    shortName: 'Ronin',
    colour: '#5a5a5a',
    mon: '浪',
    description: 'Masterless warriors available to hire across all factions.',
  },
}
