---
name: auth-integration
description: Use when implementing, integrating, modifying, reviewing or debugging authentication and user management in this RAG application. Covers Clerk authentication, Next.js sessions, Python backend JWT verification, MongoDB user profiles, protected APIs, authorization and user data isolation.
---

# Authentication Integration Skill

## 1. Objective

Implement secure authentication and basic user management in the existing RAG chat application using Clerk.

The application has:
- Next.js frontend with TypeScript.
- Python backend.
- MongoDB Atlas.
- An existing RAG chat implementation.

Clerk will be responsible for authentication and identity management. The Python backend will enforce authentication and authorization. MongoDB will store application-specific user information and user-owned data.

Do not rebuild the existing application or unnecessarily modify the existing RAG architecture.

## 2. Important Development Rules

- Inspect the existing frontend and backend before making changes.
- Follow the project's `CLAUDE.md` instructions.
- Read the installed package versions and their relevant documentation before implementing integrations.
- Follow the existing folder structure, naming conventions and architectural patterns.
- Do not assume the backend framework, API endpoints or database schema without inspecting the actual implementation.
- Do not invent Clerk SDK methods or authentication behavior.
- Implement the feature incrementally.



## 3. Authentication Architecture

Follow this responsibility separation.

### Clerk
Responsible for:
- User sign-up and sign-in.
- Google OAuth and other configured login providers.
- Password and credential management.
- Session creation and management.
- Authentication-related user identity.

### Next.js Frontend
Responsible for:
- Clerk SDK integration.
- Sign-in and sign-up interfaces.
- Session handling.
- Protected frontend routes.
- Obtaining session tokens.
- Attaching authentication tokens to Python backend requests.
- Handling unauthenticated and expired-session states.

### Python Backend
Responsible for:
- Verifying incoming Clerk session tokens.
- Identifying the authenticated user.
- Protecting API endpoints.
- Enforcing authorization and user ownership.
- Creating and updating application user profiles.
- Restricting access to user-specific resources.

### MongoDB
Responsible for:
- Application user profiles.
- Application roles and permissions.
- Other application-specific user data.

Clerk is the source of truth for authentication identity. MongoDB is the source of truth for application-specific data and permissions.

## 4. Frontend Implementation Guidelines

### Clerk Integration

- Integrate the official Clerk SDK for the installed Next.js version.
- Configure `ClerkProvider` according to the current Clerk documentation.
- Use the publishable key in the frontend.
- Never expose the Clerk secret key in browser code.
- Store environment configuration in environment variables.
- Follow the existing App Router structure.

### Authentication UI

Implement the required authentication experiences:
- Sign-in page.
- Sign-up page.
- Google OAuth if enabled.
- Sign-out functionality.
- Authenticated user information.
- Protected chat routes.
- Appropriate loading and error states.

Reuse existing UI components and the project's light/dark theme system.

Do not unnecessarily redesign the existing RAG chat interface.

### Session and Token Handling

- Allow Clerk to manage its own browser session and cookies.
- Do not manually duplicate Clerk session storage.
- Do not store session tokens in localStorage.
- Obtain the current session token through the official Clerk SDK.
- Attach the token to requests sent to the Python backend.

Use the following request convention:

`Authorization: Bearer <session_token>`

Integrate token handling into the existing centralized API client wherever possible.

Avoid duplicating token-fetching logic across components.

Handle:
- Missing tokens.
- Expired sessions.
- Unauthorized responses.
- Session refresh.
- Sign-out and session changes.

Do not create custom authentication cookies unless the architecture explicitly requires them.

## 5. Backend Authentication Guidelines

### Token Verification

Implement a reusable authentication dependency or middleware using the appropriate official Clerk Python SDK or a correctly configured JWT verification mechanism.

The authentication process must:

1. Extract the Bearer token.
2. Verify its signature using trusted Clerk verification keys.
3. Validate expiration and relevant token claims.
4. Validate issuer and other required claims according to the configured Clerk application.
5. Extract the trusted Clerk user ID.
6. Return a consistent authenticated-user object.

Never trust a user ID supplied by the frontend as proof of identity.

Never accept an unverified JWT payload as authenticated identity.

Do not make unnecessary network requests to Clerk for every API request if secure local JWT verification is supported.

### Protected APIs

- Identify all existing RAG endpoints that need authentication.
- Apply authentication consistently.
- Keep public and protected endpoints clearly separated.
- Return appropriate HTTP 401 responses for unauthenticated requests.
- Return HTTP 403 responses when an authenticated user lacks permission.
- Preserve existing request and response contracts wherever possible.

Use the project's existing backend architecture rather than introducing a new framework or dependency structure.

## 6. MongoDB User Management

Create an application-level `users` collection if one does not already exist.

Suggested document structure:

```json
{
  "_id": "mongodb_generated_id",
  "clerk_user_id": "user_xxxxx",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "user",
  "created_at": "UTC_TIMESTAMP",
  "last_login": null,
  "is_active": true
}
```

This is a suggested schema, not a requirement to copy blindly. Adapt it to the existing database conventions.

### User Identity

- Use `clerk_user_id` as the external identity reference.
- Create a unique database index on `clerk_user_id`.
- Do not use email as the primary identity mapping.
- Do not duplicate authentication credentials or passwords in MongoDB.
- Do not store Clerk secret keys or session tokens in user documents.

### User Provisioning

Start with first-authenticated-request provisioning:

1. Verify the incoming Clerk token.
2. Extract the Clerk user ID.
3. Find the corresponding MongoDB user.
4. If the user does not exist, create an application profile.
5. If the user exists, continue using the existing profile.
6. Return the authenticated application-user context.

Make provisioning safe against concurrent requests and duplicate user creation.

Clerk webhooks for `user.created`, `user.updated` and `user.deleted` may be introduced later when necessary.

If webhooks are implemented:
- Verify webhook signatures.
- Handle duplicate event delivery.
- Handle events safely and idempotently.
- Do not trust arbitrary webhook request bodies.

Do not introduce webhook complexity in the initial implementation without a requirement.





## 10. Security Requirements

Always follow these rules:

- Never expose `CLERK_SECRET_KEY` to the frontend.
- Never commit secrets to Git.
- Never trust client-supplied user IDs.
- Never skip backend token verification.
- Never accept unsigned or improperly verified tokens.
- Never store passwords or session tokens in MongoDB.
- Never rely exclusively on frontend route protection.
- Never expose another user's data.
- Use secure configuration for CORS.
- Use HTTPS in production.
- Validate all incoming API data.
- Avoid logging access tokens, secret keys or sensitive authentication data.

Use environment variables for configuration.

Suggested variables:

Frontend:

`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

Backend:

`CLERK_SECRET_KEY`

Use only the configuration actually required by the chosen verification approach. Do not expose server-side credentials through `NEXT_PUBLIC_` variables.

## 11. Implementation Workflow

Follow these steps in order.

### Phase 1: Project Inspection

Inspect:
- Existing Next.js folder structure.
- Existing API client and API hooks.
- Current routing and layouts.
- Python backend framework and folder structure.
- Existing API endpoints.
- MongoDB connection and collection conventions.
- Existing environment configuration.


### Phase 2: Architecture and Planning

Prepare an implementation plan covering:
- Clerk configuration.
- Frontend authentication architecture.
- Backend token verification.
- MongoDB user schema.
- Protected API endpoints.
- User ownership and authorization.
- Frontend/backend token contract.
- Required dependencies and environment variables.

Identify any assumptions and ask for approval before significant implementation.

### Phase 3: Backend Implementation

Implement:
- Clerk token verification.
- Reusable authenticated-user dependency or middleware.
- User provisioning.
- MongoDB user collection and unique index.
- Protected existing endpoints.
- User ownership checks.
- Authentication error handling.

Preserve existing RAG functionality.

### Phase 4: Frontend Implementation

Implement:
- Clerk SDK integration.
- Authentication provider configuration.
- Sign-in and sign-up screens.
- Protected routes.
- User session handling.
- Centralized API token attachment.
- Sign-out functionality.
- Loading and error states.

Follow the existing component and styling architecture.

### Phase 5: Integration and Verification

Test the complete frontend/backend flow.

Required scenarios:

1. New user signs up.
2. Existing user signs in.
3. Google OAuth works if configured.
4. User accesses protected chat pages.
5. Authenticated API request succeeds.
6. Request without a token returns 401.
7. Invalid token returns 401.
8. Expired session is handled correctly.
9. User signs out.
10. MongoDB user profile is created only once.
11. Existing user profile is reused.
14. Existing RAG functionality continues working.

Run the available lint, type-check, build and backend tests.

Report completed work, test results and remaining issues.

## 12. Final Development Principles

- Implement authentication incrementally.
- Prefer existing project patterns.
- Keep authentication logic separate from RAG business logic.
- Avoid unnecessary architectural rewrites.
- Keep frontend and backend contracts consistent.
- Prioritize security

The final objective is a secure, maintainable, multi-user RAG application with Clerk authentication and MongoDB-backed application user management.

