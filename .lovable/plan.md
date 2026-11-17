# Ashish Verma Linux Administrator Portfolio

## Goal
Replace the home-page placeholder with a polished, responsive portfolio for Ashish Verma, styled after GNOME 46 Adwaita Dark and Red Hat Cockpit.

## Work
- Build the home page as a GNOME-inspired desktop: top bar with live clock and availability popover, quick-settings menu, system-summary introduction, security posture strip, project grid, contact area, and bottom dock.
- Add working interactions: theme and recruiter/detail toggles, security-detail dialogs, project overview/config views with copy buttons, terminal drawer with the requested commands, and contact-copy notifications.
- Keep personal details in an editable JSON configuration file with clear sample/empty values for email, LinkedIn, GitHub, resume PDF, and portfolio text, so Ashish can update them later without changing the page layout.
- Use responsive layouts for phones and larger screens, and give the home page app-specific search and social metadata.
- Update the existing route test as needed and verify the key interactions and mobile layout.

## Technical approach
- Implement the requested experience in the existing TanStack Start home route, using the installed React, Tailwind, shadcn/Radix, and Lucide setup; do not add a backend because this portfolio does not need persistent data.
- Keep styling in the existing semantic token system, adding GNOME-inspired theme tokens in the global stylesheet. Use local configuration data for editable profile content and client-side state for the interactive controls.
- Record the new configuration/module structure in the project guidance file.

## Assumptions
- Use blank, clearly named contact and resume fields until Ashish adds his real details; do not invent contact information or a downloadable resume.
- Present the Linux platform, RHCSA EX200 certification, security posture, and sample lab themes from the supplied brief as portfolio content.
