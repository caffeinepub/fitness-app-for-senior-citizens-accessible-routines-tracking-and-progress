# Specification

## Summary
**Goal:** Fix missing features, remove leftover fitness app artifacts, wire up existing assets, and apply a consistent visual theme across the Social Spark app.

**Planned changes:**
- Update the HTML page title in `index.html` to reflect the Social Spark app name.
- Remove all empty/stub files left over from the old fitness app (ExerciseDetail.tsx, ExerciseListItem.tsx, SeniorLayout.tsx, PersistentNav.tsx, CheckInScreen.tsx, ExercisesScreen.tsx, HomeScreen.tsx, ProgressScreen.tsx, RoutineBuilderScreen.tsx, useFitnessQueries.ts).
- Wire up existing generated assets: display the hero/logo illustration on WelcomeScreen, the empty-feed illustration on FeedScreen when no posts exist, and the avatar placeholder in PostCard, CommentList, and ProfileScreen.
- Fully implement the ProfileScreen edit-profile flow: pre-fill display name and bio, persist changes via `useSaveCallerUserProfile`, and show loading/error/success states.
- Fix PostDetailScreen to load and display post author profile (display name and avatar), resolve commenter display names in the comment thread, and clear/refresh the comment form after submission.
- Fix SocialNav to correctly highlight the active tab for all screens (PostDetail maps to Feed tab) and enable screen switching without page reload.
- Apply a consistent warm neutral + bold accent (coral or amber) theme across all screens and components, removing any legacy senior-fitness styling.

**User-visible outcome:** The app compiles cleanly with no dead files, displays correct branding and illustrations, has a fully working profile editor and post detail view with comments, smooth navigation with correct active states, and a unified visual design throughout.
