
import { WorldbuildingService } from './services/WorldbuildingService';

const genId = () => Math.random().toString(36).substring(2, 11);

const templates = [
  {
    id: 'gothic-manor',
    name: 'The Gothic Manor',
    genre: 'Gothic Horror',
    description: 'A haunted house that remembers you. Atmospheric and dark.',
    fragments: [
      { title: 'The Library of Untitled Books', content: 'Shelves filled with books whose titles only appear when you are not looking directly at them.' },
      { title: 'The Aging Portrait Gallery', content: 'Portraits of ancestors whose eyes seem to follow you, their expressions changing slightly over decades.' },
      { title: 'The Sealed West Wing', content: 'A wing of the house that has been locked for generations, yet lights are often seen flickering in its windows.' },
      { title: 'The Mirror of Different Rooms', content: 'A large silver mirror that reflects a room similar to yours, but with subtle, unsettling differences.' },
      { title: 'The Impossible Cellar Stairs', content: 'Stairs that lead down further than the house’s foundations should allow.' }
    ],
    characters: [
      { name: 'The Groundskeeper', role: 'Keeper', description: 'A silent figure who has tended the grounds since before anyone can remember.' },
      { name: 'The Architect', role: 'Creator', description: 'The ghost of the man who designed the manor, forever trying to fix a flaw in the layout.' },
      { name: 'The Last Guest', role: 'Survivor', description: 'A visitor who arrived decades ago and never found the exit.' }
    ]
  },
  {
    id: 'sunless-sea',
    name: 'The Sunless Sea',
    genre: 'Eldritch Adventure',
    description: 'An ocean beneath the world. Cities built on the backs of giant leviathans.',
    fragments: [
      { title: 'Sleeping Leviathans', content: 'Colossal creatures that serve as the foundation for entire civilizations.' },
      { title: 'Light-Memory Crystals', content: 'Crystals that glow with the memories of the surface world.' },
      { title: 'Time-Dilated Trench', content: 'A deep trench where hours on the surface equal seconds in the dark.' },
      { title: 'Church of the Shallows', content: 'A religious order dedicated to preventing the world from sinking further.' }
    ],
    characters: [
      { name: 'The Navigator', role: 'Guide', description: 'One who can read the currents of the sunless waters.' },
      { name: 'The Collector', role: 'Merchant', description: 'A trader in artifacts from the surface world.' },
      { name: 'The Drowned Saint', role: 'Prophet', description: 'A figure who speaks for the leviathans.' }
    ]
  },
  {
    id: 'clockwork-court',
    name: 'The Clockwork Court',
    genre: 'Steampunk Political',
    description: 'A kingdom run by the Grand Chronometer. Precision is law.',
    fragments: [
      { title: 'The Impossible Mechanism', content: 'A machine at the center of the city that regulates the passage of time itself.' },
      { title: 'The Trial Week', content: 'A period where every citizen must prove their utility to the court.' },
      { title: 'The Mechanical King', content: 'A sovereign made entirely of brass and gears, powered by the city’s heart.' },
      { title: 'The Rust-Eaters Faction', content: 'A rebel group that seeks to bring decay back to the perfect city.' }
    ],
    characters: [
      { name: 'The Chief Clockmaker', role: 'Maintainer', description: 'The only one allowed to touch the Grand Chronometer.' },
      { name: 'The King\'s Voice', role: 'Diplomat', description: 'A human who interprets the mechanical clicks of the King.' },
      { name: 'The Rust-Eater', role: 'Rebel', description: 'A saboteur who believes in the beauty of entropy.' }
    ]
  },
  {
    id: 'last-bookshop',
    name: 'The Last Bookshop',
    genre: 'Literary Fantasy',
    description: 'The final refuge of stories. A shop that contains every book ever written, and some that haven\'t been.',
    fragments: [
      { title: 'Rewriting Books', content: 'Books that change their ending based on who is reading them.' },
      { title: 'The Basement that Reads You', content: 'A floor where the books organize themselves based on your deepest secrets.' },
      { title: 'The Blank Page at the End', content: 'The very last book in the shop, which is currently being written by the world itself.' },
      { title: 'The Future History Section', content: 'Books detailing events that have yet to occur.' }
    ],
    characters: [
      { name: 'The Shopkeeper', role: 'Librarian', description: 'An ancient being who knows the location of every word.' },
      { name: 'The Phantom Patron', role: 'Observer', description: 'A regular customer who passed away centuries ago but still browses the aisles.' },
      { name: 'The Indexer', role: 'Organizer', description: 'A tireless assistant who tries to categorize the infinite.' }
    ]
  },
  {
    id: 'ferris-wheel',
    name: 'The Ferris Wheel at the End of the World',
    genre: 'Post-Apocalyptic Surreal',
    description: 'An amusement park on a crumbling continent. The last bright spot in a gray world.',
    fragments: [
      { title: 'The 24-Cart Ferris Wheel', content: 'Each cart represents a hour of the day that no longer exists.' },
      { title: 'Dancing Bumper Cars', content: 'Cars that move on their own, reliving the joy of a lost civilization.' },
      { title: 'The Cracked Mirror of Choices', content: 'A mirror that shows you who you would have been if the world hadn’t ended.' },
      { title: 'The Mannequin Ticket Seller', content: 'A silent figure that still hands out tickets for rides that never start.' }
    ],
    characters: [
      { name: 'The Caretaker', role: 'Guardian', description: 'The only person left who knows how to keep the lights on.' },
      { name: 'The Fortuneteller', role: 'Seer', description: 'A woman who tells fortunes using the scrap metal of the old world.' },
      { name: 'The Abyss', role: 'Presence', description: 'A shadow that hangs around the edges of the park, waiting for the last light to go out.' }
    ]
  }
];

async function seed() {
  console.log('Seeding Lore Templates...');
  for (const t of templates) {
    try {
      WorldbuildingService.createLoreTemplate(t.id, t.name, t.genre, t.description);
      console.log(`Created template: ${t.name}`);
      
      for (const f of t.fragments) {
        WorldbuildingService.addTemplateFragment(genId(), t.id, f.title, f.content);
      }
      
      for (const c of t.characters) {
        WorldbuildingService.addTemplateCharacter(genId(), t.id, c.name, c.role, c.description);
      }
    } catch (e) {
      console.error(`Error seeding ${t.name}:`, e.message);
    }
  }
  console.log('Seeding complete.');
}

seed();
