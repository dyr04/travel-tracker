// Default trip content used the first time a new user signs in.
export const seedState = {
  activeTrip: "guatemala",
  payCadenceDays: 14,
  hourlyRate: 18,
  hoursPerWeek: 40,
  groupSize: 1,
  trips: {
    guatemala: {
      name: "Guatemala",
      flag: "\uD83C\uDDEC\uD83C\uDDF9",
      startDate: "2026-10-10",
      endDate: "2026-10-20",
      budgetTarget: 1500,
      homeAirport: "MCO",
      destAirport: "GUA",
      currency: { code: "GTQ", name: "Guatemalan Quetzal", perUSD: 7.63 },
      expenses: [
        { id: 1, cat: "Flights", label: "MCO \u21C4 GUA round trip", usd: 480, paid: false, shared: false },
        { id: 2, cat: "Hotels", label: "Antigua guesthouse (3 nts)", usd: 135, paid: false, shared: true },
        { id: 3, cat: "Hotels", label: "La Iguana Perdida, Atitl\u00E1n (2 nts)", usd: 70, paid: false, shared: true },
        { id: 4, cat: "Hotels", label: "Greengo's, Semuc (2 nts)", usd: 60, paid: false, shared: true },
        { id: 5, cat: "Activities", label: "Acatenango overnight hike", usd: 65, paid: false, shared: false },
        { id: 6, cat: "Activities", label: "K'anba cave + tubing, Semuc", usd: 30, paid: false, shared: false },
        { id: 7, cat: "Activities", label: "Tikal day tour", usd: 55, paid: false, shared: false },
        { id: 8, cat: "Food", label: "Food & drink (~$25/day \u00D7 10)", usd: 250, paid: false, shared: false },
        { id: 9, cat: "Activities", label: "Shuttles / lanchas / car rides", usd: 120, paid: false, shared: true },
      ],
      checklist: [
        { id: 1, place: "Antigua", done: false }, { id: 2, place: "Cerro de la Cruz", done: false },
        { id: 3, place: "Hobbitenango", done: false }, { id: 4, place: "Acatenango summit camp", done: false },
        { id: 5, place: "Lake Atitl\u00E1n \u2014 Panajachel", done: false }, { id: 6, place: "San Juan La Laguna", done: false },
        { id: 7, place: "San Pedro La Laguna", done: false }, { id: 8, place: "Indian Nose sunrise", done: false },
        { id: 9, place: "Semuc Champey", done: false }, { id: 10, place: "Tikal / Flores", done: false },
      ],
      ideas: [
        { id: 1, type: "Activity", note: "Fuego ridge add-on to watch eruptions at night", done: false },
        { id: 2, type: "Photo", note: "Sunrise over the clouds from Acatenango camp", done: false },
        { id: 3, type: "Photo", note: "Turquoise pools of Semuc Champey from El Mirador", done: false },
        { id: 4, type: "Activity", note: "Cliff diving at Cerro Tzankujil", done: false },
        { id: 5, type: "Photo", note: "Arco de Santa Catalina, Antigua", done: false },
      ],
      itinerary: [
        { id: 1, day: "Day 1 \u2014 Arrival & Antigua", date: "2026-10-10", blocks: [
          { id: 11, time: "13:00", activity: "Land at GUA, clear customs", usd: 0, shared: false },
          { id: 12, time: "14:00", activity: "Shuttle GUA \u2192 Antigua", usd: 12, shared: true },
          { id: 13, time: "16:00", activity: "Check in, settle", usd: 0, shared: false },
          { id: 14, time: "19:00", activity: "Dinner \u2014 Pizza Pacaya de David", usd: 12, shared: false },
        ]},
        { id: 2, day: "Day 2 \u2014 Antigua", date: "2026-10-11", blocks: [
          { id: 21, time: "06:00", activity: "Cerro de la Cruz sunrise", usd: 0, shared: false },
          { id: 22, time: "10:00", activity: "Central market + Arco de Santa Catalina", usd: 10, shared: false },
          { id: 23, time: "14:00", activity: "Hobbitenango (incl. shuttle)", usd: 20, shared: false },
          { id: 24, time: "20:00", activity: "Dinner + drinks", usd: 15, shared: false },
        ]},
        { id: 3, day: "Day 3 \u2014 Acatenango", date: "2026-10-12", blocks: [
          { id: 31, time: "08:00", activity: "Depart for trailhead", usd: 0, shared: false },
          { id: 32, time: "10:00", activity: "Begin overnight hike (guide + gear)", usd: 65, shared: false },
          { id: 33, time: "16:00", activity: "Reach camp, watch Fuego erupt", usd: 0, shared: false },
        ]},
      ],
      packing: [
        { id: 1, item: "Warm layers (Acatenango freezes at night)", done: false },
        { id: 2, item: "Rain jacket", done: false }, { id: 3, item: "Hiking boots", done: false },
        { id: 4, item: "Headlamp", done: false }, { id: 5, item: "Water shoes (Semuc)", done: false },
        { id: 6, item: "Passport + copies", done: false }, { id: 7, item: "Sunscreen + bug spray", done: false },
        { id: 8, item: "Power bank + adapter", done: false }, { id: 9, item: "Cash in small USD bills", done: false },
      ],
      memories: [
        { id: 1, place: "Acatenango", notes: "Look for the ridge campsite facing Fuego \u2014 best eruption views after dark.", images: [] },
      ],
    },
  },
};
