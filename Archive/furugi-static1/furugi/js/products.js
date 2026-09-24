/* Sample catalogue. Replace with your real pieces.
   Later, a backend (e.g. Flask + database) will serve this same shape as JSON.

   Fields
   id       unique item number, printed on the tag
   name     short plain name
   cat      Jackets | Tops | Knitwear | Bottoms | Dresses | Accessories
   size     S | M | L | XL | Free
   grade    A (like new) | B (visible wear, listed in the note)
   price    whole ngultrum
   color    placeholder colour until you add a photo
   chest    flat width, armpit to armpit, in cm (tops/jackets)
   length   total length in cm
   note     honest condition note
   image    path like "images/F-014.jpg", or "" for none
   sold     true when the piece has gone
*/
const PRODUCTS = [
  { id: "F-001", name: "Nylon coach jacket", cat: "Jackets", size: "L", grade: "A", price: 1800, color: "#3e5c76", chest: 58, length: 70, note: "Snap buttons, light lining. No marks.", image: "images/F-001.jpg", sold: false },
  { id: "F-002", name: "Heavy denim work jacket", cat: "Jackets", size: "M", grade: "B", price: 2200, color: "#2f4562", chest: 55, length: 64, note: "Natural fading on cuffs. One replaced button.", image: "images/F-002.jpg", sold: false },
  { id: "F-003", name: "Striped cotton shirt", cat: "Tops", size: "M", grade: "A", price: 650, color: "#9db4c0", chest: 52, length: 71, note: "Crisp collar, no stains.", image: "images/F-003.jpg", sold: false },
  { id: "F-004", name: "Oversized graphic tee", cat: "Tops", size: "XL", grade: "A", price: 500, color: "#c9b79c", chest: 60, length: 74, note: "Print is intact.", image: "images/F-004.jpg", sold: false },
  { id: "F-005", name: "Wool cardigan", cat: "Knitwear", size: "M", grade: "A", price: 1400, color: "#7a5c4f", chest: 53, length: 62, note: "Soft, no pilling. Wooden buttons.", image: "images/F-005.jpg", sold: false },
  { id: "F-006", name: "Chunky fisherman knit", cat: "Knitwear", size: "L", grade: "B", price: 1200, color: "#b8a88a", chest: 57, length: 66, note: "Small snag on left sleeve, not through the knit.", image: "images/F-006.jpg", sold: false },
  { id: "F-007", name: "Straight-leg jeans", cat: "Bottoms", size: "M", grade: "A", price: 1300, color: "#42587a", chest: 0, length: 98, note: "Waist 78 cm flat 39. Inseam 74 cm.", image: "images/F-007.jpg", sold: false },
  { id: "F-008", name: "Pleated wide trousers", cat: "Bottoms", size: "S", grade: "A", price: 1100, color: "#4b4f4a", chest: 0, length: 100, note: "Waist 70 cm. Sharp pleats.", image: "images/F-008.jpg", sold: true },
  { id: "F-009", name: "Corduroy overshirt", cat: "Jackets", size: "L", grade: "B", price: 1500, color: "#8a6a3f", chest: 59, length: 72, note: "Light wear on elbows.", image: "images/F-009.jpg", sold: false },
  { id: "F-010", name: "Floral midi dress", cat: "Dresses", size: "Free", grade: "A", price: 1600, color: "#a56a72", chest: 48, length: 108, note: "Elastic back. Fits S to L.", image: "images/F-010.jpg", sold: false },
  { id: "F-011", name: "Canvas tote", cat: "Accessories", size: "Free", grade: "A", price: 450, color: "#d1c7ae", chest: 0, length: 38, note: "Inner pocket with zip.", image: "images/F-011.jpg", sold: false },
  { id: "F-012", name: "Fleece pullover", cat: "Knitwear", size: "XL", grade: "B", price: 900, color: "#5f7a5a", chest: 61, length: 70, note: "Slight pilling at the cuffs.", image: "images/F-012.jpg", sold: false }
];
