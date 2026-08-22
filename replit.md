# Schoology Quiz Converter - Project Documentation

## Project Overview
A React-based web application that converts Aiken-style test questions into .imscc files compatible with Schoology Learning Management System. The application supports multiple question types, image integration, database storage, and randomization features.

## Core Features
- **Multi-step Quiz Creation**: 3-step workflow (enter, preview, download)
- **Question Type Support**: Multiple choice (MC), True/False (TF), Essay (ESSAY/ES), Matching (MT)
- **Image Integration**: Support for images in questions using [IMG] tag
- **Answer Randomization**: Global toggle and per-question [RAND] tags for MC questions
- **Database Storage**: PostgreSQL integration for user accounts and quiz data
- **AI Generation Guide**: Dedicated page with copy-paste prompts for AI systems

## Project Architecture

### Frontend (React + TypeScript)
- **Framework**: React with Vite, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui component library
- **Routing**: wouter for client-side navigation
- **State Management**: TanStack Query for server state
- **File Generation**: JSZip for creating .imscc files

### Backend (Express + TypeScript)
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: DatabaseStorage interface for CRUD operations
- **API**: RESTful endpoints for quiz and user management

### Key Components
- `QTIQuizGenerator.tsx`: Main quiz creation component
- `QuizForm.tsx`: Question input and formatting
- `QuestionPreview.tsx`: Preview parsed questions
- `QuizDownload.tsx`: File generation and download
- `FormatGuide.tsx`: AI generation instructions page

## Supported Question Formats

### Multiple Choice
```
MC:: What is the capital of France?
~Berlin
~Madrid
*~Paris
~Rome
```

### True/False
```
TF:: The Earth is flat.
~True
*~False
```

### Essay Questions
```
ESSAY:: Explain the process of photosynthesis.
```

### Matching Questions
```
MT:: Match countries with their capitals.
~France => Paris
~Germany => Berlin
~Spain => Madrid
~Italy => Rome
~Tokyo
~Buenos Aires
```
- Lines with `=>` are matching pairs (left => right)
- Lines without `=>` are filler/distractor words (extra right-side options)
- Partial credit: each correct match awards proportional points
- QTI format: one response_lid per left-side item, each containing ALL right-side options

### Special Modifiers
- `[IMG:imageId]`: Indicates question includes a specific image
- `[RAND]`: Randomizes multiple choice answer order
- Combined: `MC[IMG:photo1][RAND]:: Question with image and randomization`

## Database Schema
- **users**: User accounts and authentication
- **quizzes**: Quiz metadata and settings
- **questions**: Individual question data and types

## Recent Changes

### Fixed Matching Question Format & Added Filler Words (Latest - February 24, 2026)
- Rewrote matching question QTI XML to use one response_lid per left-side item with ALL right-side options
- Added filler/distractor word support: lines without => in MT questions become extra choices
- Implemented partial credit scoring (points per correct match, totaling exactly 100)
- Added cc_profile metadata for all question types (cc.matching.v0p1, cc.essay.v0p1, etc.)
- Updated AI prompt template with critical plain text formatting rules
- Added warning about rich text formatting from AI tools causing parsing issues

### Confirmed Large Quiz Support (August 20, 2025)
- Successfully tested quiz imports up to 30 questions with mixed question types
- Confirmed compatibility: 15, 20, 25, and 30 question quizzes all import correctly into Schoology
- Removed artificial 25-question limit that was blocking larger quiz creation
- Added debug information panel showing question breakdown and type distribution
- Validated mixed question types: MC, MC[RAND], TF, and ESSAY work together in large quizzes

### Added AI Generation Guide Page
- Created `/format-guide` route with comprehensive AI prompt templates
- Added navigation between home page and format guide
- Included copy-to-clipboard functionality for prompt templates
- Added example outputs and best practices for AI generation

### Database Integration
- Implemented PostgreSQL database with Drizzle ORM
- Added user authentication and quiz storage capabilities
- Created database storage interface replacing in-memory storage

### Randomization Feature
- Added global randomization toggle for all MC questions
- Implemented per-question [RAND] tag support
- Integrated randomization into QTI XML output for Schoology

## User Preferences
- No specific user preferences documented yet

## Technical Notes
- Uses IMS Common Cartridge (.imscc) format for LMS compatibility
- QTI-compliant XML generation for question standards
- Proper manifest.xml structure for Schoology import
- Support for embedded images in quiz packages
- Randomization implemented at QTI level for LMS processing
- Successfully tested with quizzes up to 30 questions containing mixed question types
- Debug panel provides question type breakdown and import guidance

## Development Guidelines
- Follow fullstack_js blueprint for consistent architecture
- Use shadcn/ui components for consistent styling
- Implement proper error handling and loading states
- Maintain TypeScript strict mode compliance
- Document all architectural changes in this file