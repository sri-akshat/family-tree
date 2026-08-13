window.VERIFIED_TREE = {
  id: 'akshat',
  name: 'Akshat',
  relation: 'Self',
  children: [
    {
      id: 'parents',
      name: 'Parents',
      group: true,
      children: [
        { id: 'anil', name: 'Anil', relation: 'Father' },
        {
          id: 'madhu',
          name: 'Madhu',
          relation: 'Mother',
          children: [
            { id: 'gayatri', name: 'Gayatri', relation: 'Mother' },
            {
              id: 'pinky', name: 'Pinky', relation: 'Sister', spouse: 'Hari',
              children: [{ id: 'sona', name: 'Sona', relation: 'Son' }]
            },
            {
              id: 'amita', name: 'Amita', relation: 'Sister', spouse: 'Rakesh',
              children: [
                {
                  id: 'ketu', name: 'Ketu', relation: 'Son', spouse: 'Divya',
                  children: [{ id: 'ojas', name: 'Ojas', relation: 'Son' }]
                }
              ]
            },
            {
              id: 'sapna', name: 'Sapna', relation: 'Sister', spouse: 'Pradeep',
              children: [{ id: 'prabhat', name: 'Prabhat', relation: 'Son' }]
            },
            {
              id: 'vandana', name: 'Vandana', relation: 'Sister', spouse: 'Rajeev',
              children: [
                {
                  id: 'jaanu', name: 'Jaanu', relation: 'Son', spouse: 'Mona',
                  children: [{ id: 'naksh', name: 'Naksh', relation: 'Son' }]
                }
              ]
            },
            {
              id: 'chhamta', name: 'Chhamta', relation: 'Sister', spouse: 'Ashok',
              children: [
                {
                  id: 'kunal', name: 'Kunal', relation: 'Son', spouse: 'Sheela',
                  children: [
                    { id: 'neel', name: 'Neel', relation: 'Son' },
                    { id: 'nova', name: 'Nova', relation: 'Son' },
                    { id: 'liza', name: 'Liza', relation: 'Daughter' }
                  ]
                },
                { id: 'ketan', name: 'Ketan', relation: 'Son' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'ankur', name: 'Ankur', relation: 'Brother', spouse: 'Abha',
      children: [
        { id: 'arnav', name: 'Arnav', relation: 'Son' },
        { id: 'ananya', name: 'Ananya', relation: 'Daughter' }
      ]
    },
    {
      id: 'garima', name: 'Garima', relation: 'Wife',
      children: [
        { id: 'shyam', name: 'Shyam', relation: 'Father' },
        { id: 'meera', name: 'Meera', relation: 'Mother' },
        { id: 'prerna', name: 'Prerna', relation: 'Sister' },
        { id: 'shashwat', name: 'Shashwat', relation: 'Brother' }
      ]
    },
    { id: 'preyaan', name: 'Preyaan', relation: 'Son' }
  ]
};
