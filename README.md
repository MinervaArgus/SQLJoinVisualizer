# SQL Joins Visualizer
An interactive web application to help users understand SQL join operations through visual representations. This tool provides an intuitive way to learn and visualize different SQL join types with real-time examples.

## Features

- **Interactive Table Selection**: Choose between Employees, Departments, and Offices tables
- **Multiple Join Types**: Visualize INNER JOIN, LEFT JOIN, RIGHT JOIN, and CROSS JOIN
- **Venn Diagram Visualization**: See the relationship between tables with an interactive Venn diagram
- **Entity-Relationship Diagram (ERD)**: View the database schema with highlighted relationships and foreign keys
- **Dynamic Result Table**: See the actual dataset produced by the selected join operation
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Educational Value

This tool is designed as an educational aid for:
- Students learning SQL join concepts
- Developers brushing up on their database skills
- Teachers demonstrating database relationships
- Database enthusiasts exploring different join types

By providing visual representations alongside actual data results, users can gain a deeper understanding of how SQL joins work and when to use each type.

## Example Use Cases

- Compare the difference between LEFT JOIN and RIGHT JOIN
- Understand what data INNER JOIN includes/excludes
- Visualize the Cartesian product created by a CROSS JOIN
- See how joins operate on tables with NULL values

## Technologies Used

- **React**: UI components and state management
- **Next.js**: React framework for server-side rendering and routing
- **TypeScript**: Type-safe JavaScript
- **D3.js**: Data visualization for Venn diagrams
- **React Flow**: Interactive ERD visualization
- **Tailwind CSS**: Utility-first CSS framework for styling

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser


## Credits

This project was built using [Ansh & Riley's Next.js Template](https://github.com/ansh/template-2), a full-stack template for creating modern web applications with AI integration. The template includes:

- React with Next.js 14 App Router
- TailwindCSS
- Firebase integration (Auth, Storage, and Database)
- Multiple AI endpoints including OpenAI, Anthropic, and Replicate using Vercel's AI SDK
