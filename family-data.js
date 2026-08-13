// Source: Miro PDF export supplied by the family.
// First pass: only explicit/high-confidence relationships are included.
window.FAMILY_DATA = {
  defaultRoot: "akshat",
  people: {
    akshat: { id: "akshat", name: "Akshat", spouseIds: ["garima"], parentIds: ["anil", "madhu"], childIds: ["preyaan"], siblingIds: ["ankur"] },
    garima: { id: "garima", name: "Garima", spouseIds: ["akshat"], parentIds: ["shyam", "meera"], siblingIds: ["prerna", "shashwat"] },
    preyaan: { id: "preyaan", name: "Preyaan", parentIds: ["akshat", "garima"] },
    ankur: { id: "ankur", name: "Ankur", spouseIds: ["abha"], parentIds: ["anil", "madhu"], childIds: ["arnav", "ananya"], siblingIds: ["akshat"] },
    abha: { id: "abha", name: "Abha", spouseIds: ["ankur"], childIds: ["arnav", "ananya"] },
    arnav: { id: "arnav", name: "Arnav", parentIds: ["ankur", "abha"] },
    ananya: { id: "ananya", name: "Ananya", parentIds: ["ankur", "abha"] },
    anil: { id: "anil", name: "Anil", spouseIds: ["madhu"], childIds: ["akshat", "ankur"], siblingIds: ["kusum", "suman"] },
    madhu: { id: "madhu", name: "Madhu", spouseIds: ["anil"], childIds: ["akshat", "ankur"], parentIds: ["gayatri"] },
    gayatri: { id: "gayatri", name: "Gayatri", childIds: ["madhu"] },
    kusum: { id: "kusum", name: "Kusum", siblingIds: ["anil"] },
    suman: { id: "suman", name: "Suman", siblingIds: ["anil"] },
    shyam: { id: "shyam", name: "Shyam", spouseIds: ["meera"], childIds: ["garima", "prerna", "shashwat"] },
    meera: { id: "meera", name: "Meera", spouseIds: ["shyam"], childIds: ["garima", "prerna", "shashwat"], siblingIds: ["usha", "sudha", "kaushal", "sandhya"] },
    prerna: { id: "prerna", name: "Prerna", parentIds: ["shyam", "meera"], siblingIds: ["garima", "shashwat"] },
    shashwat: { id: "shashwat", name: "Shashwat", parentIds: ["shyam", "meera"], siblingIds: ["garima", "prerna"] },
    usha: { id: "usha", name: "Usha", siblingIds: ["meera", "sudha", "kaushal", "sandhya"] },
    sudha: { id: "sudha", name: "Sudha", siblingIds: ["meera", "usha", "kaushal", "sandhya"] },
    kaushal: { id: "kaushal", name: "Kaushal", siblingIds: ["meera", "usha", "sudha", "sandhya"] },
    sandhya: { id: "sandhya", name: "Sandhya", siblingIds: ["meera", "usha", "sudha", "kaushal"] }
  }
};
