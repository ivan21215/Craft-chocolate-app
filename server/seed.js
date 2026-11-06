require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Manufacturer = require('./models/Manufacturer');
const Chocolate = require('./models/Chocolate');

const manufacturers = [
  {
    name: 'Nadalina',
    foundedYear: 1990,
    country: 'Croatia',
    description: 'Craft chocolate maker from Split, known for playful projects like a playable chocolate record.'
  },
  {
    name: 'Taman',
    foundedYear: 2015,
    country: 'Croatia',
    description: 'Bean-to-bar chocolate maker from Zagreb with a chef-driven approach to flavour pairing.'
  },
  {
    name: 'Kraš',
    foundedYear: 1911,
    country: 'Croatia',
    description: 'Zagreb-based confectionery company making chocolate, biscuits and sweets.'
  },
  {
    name: 'Valrhona',
    foundedYear: 1922,
    country: 'France',
    description: 'French chocolate maker from Tain-l\'Hermitage, widely used by pastry chefs.'
  },
  {
    name: 'Michel Cluizel',
    foundedYear: 1948,
    country: 'France',
    description: 'Family-run chocolate maker from Damville in Normandy that buys cocoa directly from growers.'
  },
  {
    name: 'Lindt',
    foundedYear: 1845,
    country: 'Switzerland',
    description: 'Swiss chocolate company known for its smooth milk chocolate and pralines.'
  },
  {
    name: 'Godiva',
    foundedYear: 1926,
    country: 'Belgium',
    description: 'Chocolatier founded in Brussels, famous for Belgian pralines and truffles.'
  },
  {
    name: 'Amedei',
    foundedYear: 1990,
    country: 'Italy',
    description: 'Tuscan artisan chocolate maker from Pontedera, near Pisa, that controls its own cocoa supply chain.'
  },
  {
    name: 'Ghirardelli',
    foundedYear: 1852,
    country: 'USA',
    description: 'San Francisco chocolate company founded by Italian confectioner Domingo Ghirardelli.'
  },
  {
    name: 'Dandelion',
    foundedYear: 2010,
    country: 'USA',
    description: 'Small-batch, bean-to-bar chocolate factory in San Francisco\'s Mission District.'
  },
  {
    name: 'Zotter',
    foundedYear: 1999,
    country: 'Austria',
    description: 'Austrian bean-to-bar maker from Riegersburg focused on organic and fair-trade chocolate.'
  }
];

const chocolates = {
  Nadalina: [
    { name: 'Dark 77%', type: 'dark', cocoaPercentage: 77, price: 5.9, weight: 50, color: 'dark brown' },
    { name: 'Milk with Hazelnuts', type: 'milk', filling: 'hazelnut', cocoaPercentage: 40, price: 5.5, weight: 50, color: 'light brown' },
    { name: 'Dark with Orange', type: 'dark', filling: 'orange', cocoaPercentage: 70, price: 5.9, weight: 50, color: 'dark brown' },
    { name: 'White with Almonds', type: 'white', filling: 'almond', cocoaPercentage: 33, price: 5.7, weight: 50, color: 'ivory' }
  ],
  Taman: [
    { name: 'Dark with Sea Salt', type: 'dark', filling: 'sea salt', cocoaPercentage: 70, price: 6.5, weight: 60, color: 'dark brown' },
    { name: 'White with Strawberry', type: 'white', filling: 'strawberry', cocoaPercentage: 32, price: 6.2, weight: 60, color: 'pinkish white' },
    { name: 'Dark 85%', type: 'dark', cocoaPercentage: 85, price: 6.8, weight: 60, color: 'very dark brown' },
    { name: 'Milk with Caramel', type: 'milk', filling: 'caramel', cocoaPercentage: 45, price: 6.4, weight: 60, color: 'golden brown' }
  ],
  'Kraš': [
    { name: 'Milk Classic', type: 'milk', cocoaPercentage: 30, price: 1.9, weight: 100, color: 'light brown' },
    { name: 'Milk with Hazelnut Cream', type: 'milk', filling: 'hazelnut', cocoaPercentage: 30, price: 2.2, weight: 100, color: 'light brown' },
    { name: 'Dark 60%', type: 'dark', cocoaPercentage: 60, price: 2.1, weight: 100, color: 'dark brown' },
    { name: 'Milk with Cookie', type: 'milk', filling: 'cookie', cocoaPercentage: 30, price: 2.3, weight: 100, color: 'light brown' }
  ],
  Valrhona: [
    { name: 'Dark 70%', type: 'dark', cocoaPercentage: 70, price: 4.9, weight: 70, color: 'dark brown' },
    { name: 'Milk with Caramel', type: 'milk', filling: 'caramel', cocoaPercentage: 36, price: 4.7, weight: 70, color: 'golden brown' },
    { name: 'White 35%', type: 'white', cocoaPercentage: 35, price: 4.8, weight: 70, color: 'ivory' },
    { name: 'Dark 64% with Mint', type: 'dark', filling: 'mint', cocoaPercentage: 64, price: 5.1, weight: 70, color: 'dark brown' }
  ],
  'Michel Cluizel': [
    { name: 'Dark 72%', type: 'dark', cocoaPercentage: 72, price: 5.2, weight: 70, color: 'dark brown' },
    { name: 'Milk 45%', type: 'milk', cocoaPercentage: 45, price: 5.0, weight: 70, color: 'medium brown' },
    { name: 'Dark with Almonds', type: 'dark', filling: 'almond', cocoaPercentage: 65, price: 5.4, weight: 70, color: 'dark brown' },
    { name: 'Milk with Sea Salt', type: 'milk', filling: 'sea salt', cocoaPercentage: 45, price: 5.3, weight: 70, color: 'medium brown' }
  ],
  Lindt: [
    { name: 'White with Cookie', type: 'white', filling: 'cookie', cocoaPercentage: 30, price: 3.2, weight: 100, color: 'ivory' },
    { name: 'Dark with Orange', type: 'dark', filling: 'orange', cocoaPercentage: 47, price: 3.4, weight: 100, color: 'dark brown' },
    { name: 'Milk with Almonds', type: 'milk', filling: 'almond', cocoaPercentage: 31, price: 3.3, weight: 100, color: 'light brown' },
    { name: 'Dark with Mint', type: 'dark', filling: 'mint', cocoaPercentage: 50, price: 3.4, weight: 100, color: 'dark brown' },
    { name: 'Dark 90%', type: 'dark', cocoaPercentage: 90, price: 3.6, weight: 100, color: 'very dark brown' }
  ],
  Godiva: [
    { name: 'Dark 72%', type: 'dark', cocoaPercentage: 72, price: 5.5, weight: 90, color: 'dark brown' },
    { name: 'Milk with Caramel', type: 'milk', filling: 'caramel', cocoaPercentage: 31, price: 5.5, weight: 90, color: 'golden brown' },
    { name: 'White with Strawberry', type: 'white', filling: 'strawberry', cocoaPercentage: 28, price: 5.6, weight: 90, color: 'pinkish white' },
    { name: 'Milk with Hazelnuts', type: 'milk', filling: 'hazelnut', cocoaPercentage: 31, price: 5.6, weight: 90, color: 'light brown' }
  ],
  Amedei: [
    { name: 'Dark 70%', type: 'dark', cocoaPercentage: 70, price: 7.5, weight: 50, color: 'dark brown' },
    { name: 'Milk 32%', type: 'milk', cocoaPercentage: 32, price: 7.2, weight: 50, color: 'light brown' },
    { name: 'White with Almonds', type: 'white', filling: 'almond', cocoaPercentage: 34, price: 7.3, weight: 50, color: 'ivory' },
    { name: 'Dark with Hazelnuts', type: 'dark', filling: 'hazelnut', cocoaPercentage: 63, price: 7.6, weight: 50, color: 'dark brown' }
  ],
  Ghirardelli: [
    { name: 'Dark with Sea Salt Caramel', type: 'dark', filling: 'caramel', cocoaPercentage: 60, price: 3.9, weight: 100, color: 'dark brown' },
    { name: 'Milk with Caramel', type: 'milk', filling: 'caramel', cocoaPercentage: 32, price: 3.7, weight: 100, color: 'golden brown' },
    { name: 'Dark with Mint', type: 'dark', filling: 'mint', cocoaPercentage: 60, price: 3.9, weight: 100, color: 'dark brown' },
    { name: 'White with Cookie', type: 'white', filling: 'cookie', cocoaPercentage: 30, price: 3.6, weight: 100, color: 'ivory' }
  ],
  Dandelion: [
    { name: 'Dark 70% Madagascar', type: 'dark', cocoaPercentage: 70, price: 9.5, weight: 56, color: 'reddish brown' },
    { name: 'Dark 85%', type: 'dark', cocoaPercentage: 85, price: 9.8, weight: 56, color: 'very dark brown' },
    { name: 'Dark with Orange', type: 'dark', filling: 'orange', cocoaPercentage: 70, price: 9.9, weight: 56, color: 'dark brown' },
    { name: 'Milk 55%', type: 'milk', cocoaPercentage: 55, price: 9.5, weight: 56, color: 'medium brown' }
  ]
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([User.deleteMany(), Manufacturer.deleteMany(), Chocolate.deleteMany()]);

  await User.create([
    { username: 'admin', email: 'admin@craft.com', password: await bcrypt.hash('admin123', 10), role: 'admin' },
    { username: 'user', email: 'user@craft.com', password: await bcrypt.hash('user123', 10) }
  ]);

  const created = await Manufacturer.create(manufacturers);

  const docs = created.flatMap(m =>
    (chocolates[m.name] || []).map(c => ({ ...c, manufacturer: m._id }))
  );
  await Chocolate.create(docs);

  console.log(`Database seeded: ${created.length} manufacturers, ${docs.length} chocolates`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
