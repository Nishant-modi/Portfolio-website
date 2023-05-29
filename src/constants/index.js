import {
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    RE,
    MIT,
    NID,
    nodejs,
    mongodb,
    git,
    figma,
    docker,
    meta,
    starbucks,
    tesla,
    shopify,
    carrent,
    jobit,
    tripguide,
    threejs,
    krita,
    photoshop,
    substance,
    blender,
    unity,
  } from "../assets";
  
  export const navLinks = [
    {
      id: "about",
      title: "About",
    },
    {
      id: "work",
      title: "Work",
    },
    {
      id: "contact",
      title: "Contact",
    },
  ];
  
  const services = [
    {
      title: "Game Designer",
      icon: web,
    },
    {
      title: "3D Generalist",
      icon: mobile,
    },
    {
      title: "Artist",
      icon: backend,
    },
    {
      title: "Web Developer",
      icon: creator,
    },
  ];
  
  const technologies = [
    {
      name: "Blender",
      icon: blender,
    },
    {
      name: "Unity",
      icon: unity,
    },
    {
      name: "Krita",
      icon: krita,
    },
    {
      name: "Photoshop",
      icon: photoshop,
    },
    {
      name: "Substance",
      icon: substance,
    },
    {
      name: "ThreeJS",
      icon: threejs,
    },
    {
      name: "ReactJS",
      icon: reactjs,
    },
  ];
  
  const experiences = [
    {
      title: "M.Des in Digital Game Design",
      company_name: "National Institute of Design, Bengaluru",
      icon: NID,
      iconBg: "#E6DEDD",
      date: "September 2022 - Present",
      points: [
        "Get exposure in current best practices in the domain, including on-line, educational, strategy and internet-based multi-player games.",
        "Get inputs in the areas of digital rendering, writing, music and sound production and user-interface design.",
        "Learn about game monetisation and design research.",
        "Learn how game design studios operate and explore business models prevalent in the gaming industry along with the contribution of independent developers/designers towards the industry.",
      ],
    },
    {
      title: "Graduate Engineer Trainee",
      company_name: "Royal Enfield",
      icon: RE,
      iconBg: "#383E56",
      date: "October 2021 - June 2022",
      points: [
        "Collaborating with cross-functional teams including designers, product managers, and the marketing team to gather and understand their software and hardware needs.",
        "Taking care of the IT infrastructure related issues and needs of the company.",
        "Being in contact with IT service companies to get things done for Royal Enfield.",
      ],
    },
    {
      title: "B.Tech in Information Technology",
      company_name: "Manipal Institute of Technology",
      icon: MIT,
      iconBg: "#E6DEDD",
      date: "July 2017 - July 2021",
      points: [
        "Focus on the complete Software Development Life Cycle, Database System, Knowledge Discovery, and Application Development in Internet Technologies with a judicious blend of technical skills",
        "Minor Degree in Digital Marketing",
      ],
    },
  ];
  
  const testimonials = [
    {
      testimonial:
        "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
      name: "Sara Lee",
      designation: "CFO",
      company: "Acme Co",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      testimonial:
        "I've never met a web developer who truly cares about their clients' success like Rick does.",
      name: "Chris Brown",
      designation: "COO",
      company: "DEF Corp",
      image: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
      testimonial:
        "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
      name: "Lisa Wang",
      designation: "CTO",
      company: "456 Enterprises",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
    },
  ];
  
  const projects = [
    {
      name: "Car Rent",
      description:
        "Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "mongodb",
          color: "green-text-gradient",
        },
        {
          name: "tailwind",
          color: "pink-text-gradient",
        },
      ],
      image: carrent,
      source_code_link: "https://github.com/",
    },
    {
      name: "Job IT",
      description:
        "Web application that enables users to search for job openings, view estimated salary ranges for positions, and locate available jobs based on their current location.",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "restapi",
          color: "green-text-gradient",
        },
        {
          name: "scss",
          color: "pink-text-gradient",
        },
      ],
      image: jobit,
      source_code_link: "https://github.com/",
    },
    {
      name: "Trip Guide",
      description:
        "A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, and offers curated recommendations for popular destinations.",
      tags: [
        {
          name: "nextjs",
          color: "blue-text-gradient",
        },
        {
          name: "supabase",
          color: "green-text-gradient",
        },
        {
          name: "css",
          color: "pink-text-gradient",
        },
      ],
      image: tripguide,
      source_code_link: "https://github.com/",
    },
  ];
  
  export { services, technologies, experiences, testimonials, projects };