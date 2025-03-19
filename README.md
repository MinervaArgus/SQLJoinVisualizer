# Ansh & Riley Full-Stack Template

This is a full-stack template project for Software Composers to create  applications with AI.

## Getting started
To create a new project, you go to `/paths`, choose from our list of Paths, and then use Cursor's Composer feature to quickly scaffold your project!

You can also edit the Path's prompt template to be whatever you like!

## Technologies used
This doesn't really matter, but is useful for the AI to understand more about this project. We are using the following technologies
- React with Next.js 14 App Router
- TailwindCSS
- Firebase Auth, Storage, and Database
- Multiple AI endpoints including OpenAI, Anthropic, and Replicate using Vercel's AI SDK

# SQL Joins Visualizer

An interactive web application to help users understand SQL join operations through visual representations.

## Features

- **Interactive Table Selection**: Choose between Employees, Departments, and Offices tables
- **Multiple Join Types**: Visualize INNER JOIN, LEFT JOIN, RIGHT JOIN, and CROSS JOIN
- **Venn Diagram Visualization**: See the relationship between tables with an interactive Venn diagram
- **Entity-Relationship Diagram (ERD)**: View the database schema with highlighted relationships
- **Dynamic Result Table**: See the actual dataset produced by the selected join operation
- **Responsive Design**: Works on desktop, tablet, and mobile devices

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

## Educational Value

This tool is designed as an educational aid for:
- Students learning SQL join concepts
- Developers brushing up on their database skills
- Database enthusiasts exploring different join types

By providing visual representations alongside actual data results, users can gain a deeper understanding of how SQL joins work and when to use each type.

## Example Use Cases

- Compare the difference between LEFT JOIN and RIGHT JOIN
- Understand what data INNER JOIN includes/excludes
- Visualize the Cartesian product created by a CROSS JOIN
- See how joins operate on tables with NULL values

## Roadmap

- Support for additional join types (FULL OUTER JOIN)
- Custom user-uploaded datasets
- Animation transitions for join changes
- Export resulting dataset as CSV