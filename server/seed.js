require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Manufacturer = require('./models/Manufacturer');
const Chocolate = require('./models/Chocolate');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([User.deleteMany(), Manufacturer.deleteMany(), Chocolate.deleteMany()]);

  await User.create([
    { username: 'admin', email: 'admin@craft.com', password: await bcrypt.hash('admin123', 10), role: 'admin' },
    { username: 'user', email: 'user@craft.com', password: await bcrypt.hash('user123', 10) }
  ]);

  const [nadalina, taman, valrhona, lindt, kras, godiva] = await Manufacturer.create([
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
      name: 'Valrhona',
      foundedYear: 1922,
      country: 'France',
      description: 'French chocolate maker from Tain-l\'Hermitage, widely used by pastry chefs.'
    },
    {
      name: 'Lindt',
      foundedYear: 1845,
      country: 'Switzerland',
      description: 'Swiss chocolate company known for its smooth milk chocolate and pralines.'
    },
    {
      name: 'Kraš',
      foundedYear: 1911,
      country: 'Croatia',
      description: 'Zagreb-based confectionery company making chocolate, biscuits and sweets.'
    },
    {
      name: 'Godiva',
      foundedYear: 1926,
      country: 'Belgium',
      description: 'Chocolatier founded in Brussels, famous for Belgian pralines and truffles.'
    },
    {
      name: 'Zotter',
      foundedYear: 1999,
      country: 'Austria',
      description: 'Austrian bean-to-bar maker from Riegersburg focused on organic and fair-trade chocolate.'
    }
  ]);

  await Chocolate.create([
    { name: 'Dark 77%', manufacturer: nadalina._id, type: 'dark', cocoaPercentage: 77, price: 5.9, weight: 50, color: 'dark brown' },
    { name: 'Milk with Hazelnuts', manufacturer: nadalina._id, type: 'milk', filling: 'hazelnut', cocoaPercentage: 40, price: 5.5, weight: 50, color: 'light brown' },
    { name: 'Dark with Sea Salt', manufacturer: taman._id, type: 'dark', filling: 'sea salt', cocoaPercentage: 70, price: 6.5, weight: 60, color: 'dark brown' },
    { name: 'White with Strawberry', manufacturer: taman._id, type: 'white', filling: 'strawberry', cocoaPercentage: 32, price: 6.2, weight: 60, color: 'pinkish white' },
    { name: 'Dark 70%', manufacturer: valrhona._id, type: 'dark', cocoaPercentage: 70, price: 4.9, weight: 70, color: 'dark brown' },
    { name: 'Milk with Caramel', manufacturer: valrhona._id, type: 'milk', filling: 'caramel', cocoaPercentage: 36, price: 4.7, weight: 70, color: 'golden brown' },
    { name: 'White with Cookie', manufacturer: lindt._id, type: 'white', filling: 'cookie', cocoaPercentage: 30, price: 3.2, weight: 100, color: 'ivory' },
    { name: 'Dark with Orange', manufacturer: lindt._id, type: 'dark', filling: 'orange', cocoaPercentage: 47, price: 3.4, weight: 100, color: 'dark brown' },
    { name: 'Milk with Almonds', manufacturer: lindt._id, type: 'milk', filling: 'almond', cocoaPercentage: 31, price: 3.3, weight: 100, color: 'light brown' },
    { name: 'Dark with Mint', manufacturer: lindt._id, type: 'dark', filling: 'mint', cocoaPercentage: 50, price: 3.4, weight: 100, color: 'dark brown' },
    { name: 'Milk Classic', manufacturer: kras._id, type: 'milk', cocoaPercentage: 30, price: 1.9, weight: 100, color: 'light brown' },
    { name: 'Milk with Hazelnut Cream', manufacturer: kras._id, type: 'milk', filling: 'hazelnut', cocoaPercentage: 30, price: 2.2, weight: 100, color: 'light brown' },
    { name: 'Dark 72%', manufacturer: godiva._id, type: 'dark', cocoaPercentage: 72, price: 5.5, weight: 90, color: 'dark brown' },
    { name: 'Milk with Caramel', manufacturer: godiva._id, type: 'milk', filling: 'caramel', cocoaPercentage: 31, price: 5.5, weight: 90, color: 'golden brown' }
  ]);

  console.log('Database seeded');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
