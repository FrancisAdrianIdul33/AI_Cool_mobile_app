# Mobile App Development Prompt

## Task

Build a mobile application called **CarbonTrail** that helps users track their daily carbon footprint and reduce it through a weekly carbon budget, eco-missions, and community goals.

This document provides the initial project context and structure. The full application requirements, features, workflows, and technical details will be finalized and updated later.

## Context

This app supports **SDG 13 (Climate Action)**.

Users log daily activities (commute, meals, electricity use), and the app estimates their CO2 emissions using standard emission factors. Each user gets a weekly carbon budget that shrinks as they log high-emission activities. Users can complete small eco-missions (e.g., "walk instead of ride today") to earn back carbon credits. At the end of each month, users get a shareable recap of their total savings. Individual actions also combine into a group/community goal (e.g., class or barangay total).

Development will use:

- Expo framework for the mobile application.
- Visual Studio Code as the integrated development environment.
- OpenCode as the command-line interface and development assistant.
- Supabase as the cloud database and backend service (auth, Postgres database, storage, realtime for community goals).
- Node.js as the runtime.

The application structure, feature requirements, database schema, authentication flow, and UI specifications are not finalized yet.

## Limits

- The application should target Android devices only.
- Do not add iOS-specific functionality unless explicitly requested later.
- No budget for paid carbon-data APIs; must use free/open emission factor datasets.
- Limited development timeline (school/hackathon project).
- Should work with minimal internet dependency where possible.
- Do not finalize architectural decisions that have not yet been defined.
- Do not create unnecessary features beyond the requirements provided.
- Keep the project structure flexible so additional requirements can be added later.
- Avoid assuming the final database schema, user roles, authentication method, or application workflow.
- Treat this document as an initial project specification that will be updated over time.

## Platform

### Mobile Platform

- Target platform: Android only.
- Development framework: Expo (React Native).
- Application type: Mobile application.

### Development Environment

- IDE: Visual Studio Code.
- CLI: OpenCode.
- Runtime: Node.js.
- Version control: GitHub repository.
- Backend and cloud database: Supabase.

### Potential Technologies

The following technologies may be defined later:

- Expo Router or another navigation solution.
- Supabase Authentication (confirmed for backend).
- Supabase Storage (confirmed for backend).
- Supabase Edge Functions.
- State management solution.
- Form validation library.
- UI component library.
- Testing framework.
- Android build and release configuration.

These technologies should not be treated as finalized unless explicitly confirmed.

## Other Details

### Project Status

- Current status: Initial planning and project structure.
- Requirements: Partially defined (core features named, details pending).
- Feature list: Daily activity logging (commute, meals, electricity), weekly carbon budget, eco-missions, monthly recap, community goals.
- UI/UX design: To be defined.
- Database schema: To be defined (users, logs, missions, community goals planned).
- Authentication requirements: To be defined.
- API and backend requirements: To be defined.
- Deployment process: To be defined.

### Build Order

Before building the main app, first:

1. Set up the GitHub repo and project structure (Expo + Node.js).
2. Set up the Supabase project (auth, database schema for users, logs, missions, community goals).
3. Compile a basic emission factor dataset (transport, food, electricity).
4. Design the daily logging flow (should take under 30 seconds).
5. Build the carbon calculation logic.
6. Then design the budget, missions, recap, and community features.

### Development Expectations

When implementing future tasks:

1. Review the existing project structure before making changes.
2. Follow the established Expo and React Native conventions.
3. Keep Android compatibility as the primary requirement.
4. Use Supabase for cloud database functionality when applicable.
5. Keep implementation details modular and easy to update.
6. Avoid introducing dependencies unless they are necessary.
7. Explain major architectural or implementation decisions.
8. Update this document when new project requirements are finalized.

## Note

This is an initial project prompt and should be treated as a living document.

The project requirements are not complete. New information may be added later, including:

- Target users.
- User journeys.
- Screen requirements.
- Navigation structure.
- Authentication and authorization.
- Database tables and relationships.
- Supabase policies.
- API requirements.
- Offline support.
- Notifications.
- File and media handling.
- Testing requirements.
- Android build and deployment requirements.

Do not assume missing details. Ask for clarification when a future task depends on information that has not yet been defined.

## File Type

- Document format: Markdown.
- Suggested filename: `PROJECT_PROMPT.md`
- Suggested location: Project root directory.
- Purpose: Store the initial project context, development constraints, and future planning details.
- Project files: Expo/React Native project files (.js/.tsx) + Supabase schema (SQL) + JSON emission factor dataset.

This file should be updated as the project requirements become more complete.