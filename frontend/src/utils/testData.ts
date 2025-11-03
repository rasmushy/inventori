// testData.ts - Generate test data to populate the database for testing purposes
import type { Address, Item } from '../types'
import * as store from '../storage/local'

export function createTestData() {
    console.log('createTestData')
  // Clear existing data
  const existingAddresses = store.listAddresses()
  existingAddresses.items.forEach(addr => store.deleteAddress(addr.id))
  
  const existingItems = store.listItems({})
  existingItems.items.forEach(item => store.deleteItem(item.id))

  // Create 3 test addresses
  const addresses: Address[] = [
    store.createAddress({ label: 'Hiekkatie', street: 'Hiekkatie 1', city: 'Helsinki', postalCode: '00100' }),
    store.createAddress({ label: 'Kumpulanmäki', street: 'Kumpulanmäki 2', city: 'Helsinki', postalCode: '00200' }),
    store.createAddress({ label: 'Pallokuja', street: 'Pallokuja 3', city: 'Helsinki', postalCode: '00300' }),
  ]

  // Create 30 test items (10 items per address)
  const items: Item[] = [
    // Hiekkatie items
    store.createItem({
      name: 'Sofa',
      description: 'Comfortable 3-seater sofa',
      purchasePriceCents: 89900, // €899.00
      tags: ['furniture', 'seating'],
      purchaseDate: '2023-05-15',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Coffee Table',
      description: 'Wooden coffee table with storage',
      purchasePriceCents: 29900, // €299.00
      tags: ['furniture', 'table'],
      purchaseDate: '2023-06-20',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'TV',
      description: '55-inch Smart TV',
      purchasePriceCents: 129900, // €1299.00
      tags: ['electronics', 'entertainment'],
      purchaseDate: '2023-03-10',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Lamp',
      description: 'Floor lamp with adjustable brightness',
      purchasePriceCents: 8900, // €89.00
      tags: ['lighting', 'furniture'],
      purchaseDate: '2023-07-05',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Bookshelf',
      description: '5-tier wooden bookshelf',
      purchasePriceCents: 19900, // €199.00
      tags: ['furniture', 'storage'],
      purchaseDate: '2023-08-12',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Rug',
      description: 'Large area rug',
      purchasePriceCents: 15900, // €159.00
      tags: ['decoration', 'textile'],
      purchaseDate: '2023-09-03',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Plant Pot',
      description: 'Ceramic plant pot with drainage',
      purchasePriceCents: 2500, // €25.00
      tags: ['decoration', 'garden'],
      purchaseDate: '2023-10-15',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Remote Control',
      description: 'Universal remote control',
      purchasePriceCents: 3500, // €35.00
      tags: ['electronics', 'accessory'],
      purchaseDate: '2023-11-20',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Cushion',
      description: 'Decorative throw cushion',
      purchasePriceCents: 1200, // €12.00
      tags: ['decoration', 'textile'],
      purchaseDate: '2023-12-01',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Speaker',
      description: 'Bluetooth wireless speaker',
      purchasePriceCents: 8900, // €89.00
      tags: ['electronics', 'audio'],
      purchaseDate: '2024-01-10',
      addressId: addresses[0].id
    }),

    // Kumpulanmäki items
    store.createItem({
      name: 'Refrigerator',
      description: 'Energy-efficient refrigerator',
      purchasePriceCents: 79900, // €799.00
      tags: ['appliance', 'kitchen'],
      purchaseDate: '2022-11-15',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Microwave',
      description: 'Compact microwave oven',
      purchasePriceCents: 12900, // €129.00
      tags: ['appliance', 'kitchen'],
      purchaseDate: '2023-01-20',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Coffee Maker',
      description: 'Programmable coffee maker',
      purchasePriceCents: 15900, // €159.00
      tags: ['appliance', 'kitchen'],
      purchaseDate: '2023-04-12',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Toaster',
      description: '4-slice toaster with bagel setting',
      purchasePriceCents: 4500, // €45.00
      tags: ['appliance', 'kitchen'],
      purchaseDate: '2023-05-25',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Blender',
      description: 'High-speed blender for smoothies',
      purchasePriceCents: 12900, // €129.00
      tags: ['appliance', 'kitchen'],
      purchaseDate: '2023-06-18',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Cutting Board',
      description: 'Bamboo cutting board set',
      purchasePriceCents: 1800, // €18.00
      tags: ['utensil', 'kitchen'],
      purchaseDate: '2023-07-30',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Knife Set',
      description: 'Professional chef knife set',
      purchasePriceCents: 8900, // €89.00
      tags: ['utensil', 'kitchen'],
      purchaseDate: '2023-08-22',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Dishwasher',
      description: 'Built-in dishwasher',
      purchasePriceCents: 59900, // €599.00
      tags: ['appliance', 'kitchen'],
      purchaseDate: '2023-09-14',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Kitchen Scale',
      description: 'Digital kitchen scale',
      purchasePriceCents: 2500, // €25.00
      tags: ['utensil', 'kitchen'],
      purchaseDate: '2023-10-08',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Mixing Bowl Set',
      description: 'Stainless steel mixing bowl set',
      purchasePriceCents: 3500, // €35.00
      tags: ['utensil', 'kitchen'],
      purchaseDate: '2023-11-12',
      addressId: addresses[1].id
    }),

    // Pallokuja items
    store.createItem({
      name: 'Bed Frame',
      description: 'Queen size bed frame',
      purchasePriceCents: 59900, // €599.00
      tags: ['furniture', 'bedroom'],
      purchaseDate: '2022-09-30',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Dresser',
      description: '6-drawer wooden dresser',
      purchasePriceCents: 39900, // €399.00
      tags: ['furniture', 'storage'],
      purchaseDate: '2022-10-15',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Nightstand',
      description: 'Bedside table with drawer',
      purchasePriceCents: 12900, // €129.00
      tags: ['furniture', 'bedroom'],
      purchaseDate: '2023-02-28',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Mattress',
      description: 'Memory foam mattress',
      purchasePriceCents: 89900, // €899.00
      tags: ['furniture', 'bedroom'],
      purchaseDate: '2022-09-30',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Pillows',
      description: 'Memory foam pillows (set of 2)',
      purchasePriceCents: 4500, // €45.00
      tags: ['bedding', 'bedroom'],
      purchaseDate: '2023-03-15',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Bed Sheets',
      description: 'Cotton bed sheet set',
      purchasePriceCents: 3500, // €35.00
      tags: ['bedding', 'bedroom'],
      purchaseDate: '2023-04-20',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Wardrobe',
      description: 'Sliding door wardrobe',
      purchasePriceCents: 79900, // €799.00
      tags: ['furniture', 'storage'],
      purchaseDate: '2023-05-10',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Mirror',
      description: 'Full-length mirror',
      purchasePriceCents: 8900, // €89.00
      tags: ['furniture', 'bedroom'],
      purchaseDate: '2023-06-05',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Alarm Clock',
      description: 'Digital alarm clock with radio',
      purchasePriceCents: 2500, // €25.00
      tags: ['electronics', 'bedroom'],
      purchaseDate: '2023-07-18',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Laundry Basket',
      description: 'Woven laundry basket',
      purchasePriceCents: 1800, // €18.00
      tags: ['storage', 'bedroom'],
      purchaseDate: '2023-08-25',
      addressId: addresses[2].id
    })
  ]

  return { addresses, items }
}

// Function to add test data to existing data (without clearing)
export function addTestData() {
  // Create addresses if they don't exist
  console.log('addTestData')
  const existingAddresses = store.listAddresses()
  const addressMap = new Map(existingAddresses.items.map(addr => [addr.label, addr]))
 
  const addresses: Address[] = []
  const addressLabels = ['Hiekkatie', 'Kumpulanmäki', 'Pallokuja']
  
  addressLabels.forEach(label => {
    if (addressMap.has(label)) {
      addresses.push(addressMap.get(label)!)
    } else {
      addresses.push(store.createAddress({ label }))
    }
  })

  // Create test items (same as createTestData but without clearing existing data)
  const items: Item[] = [
    // Hiekkatie Items
    store.createItem({
      name: 'Electric drill',
      description: 'Cordless electric drill with 2 batteries',
      purchasePriceCents: 19900,
      tags: ['tools', 'power tools'],
      purchaseDate: '2024-05-15',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Hand saw',
      description: 'Hand saw with 10 teeth',
      purchasePriceCents: 10900,
      tags: ['tools', 'hand tools'],
      purchaseDate: '2024-06-20',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Hammer',
      description: 'Hand hammer with 1200g weight',
      purchasePriceCents: 19900,
      tags: ['tools', 'hand tools'],
      purchaseDate: '2024-07-10',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Screwdriver',
      description: 'Phillips screwdriver with 10mm bit',
      purchasePriceCents: 8900,
      tags: ['tools', 'hand tools'],
      purchaseDate: '2024-08-05',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Wrench',
      description: '12mm open ended wrench',
      purchasePriceCents: 19900,
      tags: ['tools', 'hand tools'],
      purchaseDate: '2023-08-12',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Pliers',
      description: 'Large area rug',
      purchasePriceCents: 15900,
      tags: ['tools', 'hand tools'],
      purchaseDate: '2024-09-03',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Nail puller',
      description: 'Nail puller with 100mm long handle',
      purchasePriceCents: 2500,
      tags: ['tools', 'hand tools'],
      purchaseDate: '2024-10-15',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Wire cutter',
      description: 'Wire cutter with 10mm blade',
      purchasePriceCents: 3500,
      tags: ['tools', 'hand tools'],
      purchaseDate: '2024-11-20',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Tape measure',
      description: '5m tape measure with 10mm wide tape',
      purchasePriceCents: 1200,
      tags: ['tools', 'hand tools'],
      purchaseDate: '2024-12-01',
      addressId: addresses[0].id
    }),
    store.createItem({
      name: 'Level',
      description: 'Bluetooth wireless speaker',
      purchasePriceCents: 8900,
      tags: ['tools', 'hand tools'],
      purchaseDate: '2024-01-10',
      addressId: addresses[0].id
    }),

    // Kumpulanmäki Items
    store.createItem({
      name: 'Hockey stick',
      description: 'Hockey stick with 100g weight',
      purchasePriceCents: 19900,
      tags: ['sports', 'hockey'],
      purchaseDate: '2024-11-15',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Soccer ball',
      description: 'Soccer ball with 500g weight',
      purchasePriceCents: 9900,
      tags: ['sports', 'soccer'],
      purchaseDate: '2024-01-20',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Tennis racket',
      description: 'Tennis racket with 100g weight',
      purchasePriceCents: 19900,
      tags: ['sports', 'tennis'],
      purchaseDate: '2024-04-12',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Basketball',
      description: 'Basketball with 500g weight',
      purchasePriceCents: 4500,
      tags: ['sports', 'basketball'],
      purchaseDate: '2024-05-25',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Blender',
      description: 'High-speed blender for smoothies',
      purchasePriceCents: 12900,
      tags: ['appliance', 'kitchen'],
      purchaseDate: '2023-06-18',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Cutting Board',
      description: 'Bamboo cutting board set',
      purchasePriceCents: 1800,
      tags: ['utensil', 'kitchen'],
      purchaseDate: '2023-07-30',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Hockey puck',
      description: 'Hockey puck with 100g weight',
      purchasePriceCents: 8900,
      tags: ['sports', 'hockey'],
      purchaseDate: '2024-08-22',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Soccer goal',
      description: 'Soccer goal with 1000g weight',
      purchasePriceCents: 59900,
      tags: ['sports', 'soccer'],
      purchaseDate: '2024-09-14',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Tennis net',
      description: 'Tennis net with 1000g weight',
      purchasePriceCents: 2500,
      tags: ['sports', 'tennis'],
      purchaseDate: '2024-10-08',
      addressId: addresses[1].id
    }),
    store.createItem({
      name: 'Mixing Bowl Set',
      description: 'Stainless steel mixing bowl set',
      purchasePriceCents: 3500,
      tags: ['utensil', 'kitchen'],
      purchaseDate: '2023-11-12',
      addressId: addresses[1].id
    }),

    // Pallokuja Items
    store.createItem({
      name: 'Pioneer CDJ',
      description: 'Pioneer CDJ-2000NXS',
      purchasePriceCents: 100000,
      tags: ['electronics', 'music'],
      purchaseDate: '2022-09-30',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Technics SL-1200G',
      description: 'Technics SL-1200Mk2',
      purchasePriceCents: 80000,
      tags: ['electronics', 'music'],
      purchaseDate: '2022-10-15',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Sennheiser HD 800',
      description: 'Sennheiser HD 800',
      purchasePriceCents: 10000,
      tags: ['electronics', 'music'],
      purchaseDate: '2023-02-28',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Beyerdynamic DT 990',
      description: 'Beyerdynamic DT 990',
      purchasePriceCents: 89900,
      tags: ['electronics', 'music'],
      purchaseDate: '2022-09-30',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'DJM-900NXS',
      description: 'DJM-900NXS',
      purchasePriceCents: 200000,
      tags: ['electronics', 'music'],
      purchaseDate: '2023-03-15',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Rokit RX-7',
      description: 'Rokit RX-7',
      purchasePriceCents: 50000,
      tags: ['electronics', 'music'],
      purchaseDate: '2023-04-20',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Yamaha Piano',
      description: 'Yamaha Piano',
      purchasePriceCents: 1000000,
      tags: ['electronics', 'music'],
      purchaseDate: '2023-05-10',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Electric Guitar',
      description: 'Electric Guitar',
      purchasePriceCents: 100000,
      tags: ['electronics', 'music'],
      purchaseDate: '2023-06-05',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Acoustic Guitar',
      description: 'Acoustic Guitar',
      purchasePriceCents: 100000,
      tags: ['electronics', 'music'],
      purchaseDate: '2023-07-18',
      addressId: addresses[2].id
    }),
    store.createItem({
      name: 'Drum Set',
      description: 'Drum Set',
      purchasePriceCents: 300000,
      tags: ['instruments', 'drums', 'music'],
      purchaseDate: '2024-08-25',
      addressId: addresses[2].id
    })
  ]

  return { addresses, items }
}
