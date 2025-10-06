I want to rebuild this project using next.js. The goal is to maximise next js learning. Here’s what I want

- Next app
- Postregsql db like render
- Tailwind css
- Typescript
- Use lucid for icons
- I do Not want to use a UI component lib
- Don’t know if I need something like node/express… heard next can do it all on its own

Here is a sample user journey-
User creates an account, The first page the user sees after logging in is a list of genres. These genres are fetched from the movie db api. When the user selects genres, these are associated with their profile. The home page uses these genres to fetch a list of recommended movies from the moviedb api. The homepage has list of movie tiles.
When the user clicks on one of the tiles, there is a call to the db to check if there is an entry for this movie id, if not, a new entry is created with movie details and comments and ratings params are associated with it, and the user is directed to the movie detail page. IF there is an entry for it the movie, that entry is fetched along with associated ratings and comments. The movie detail page contains a link to just watch to find streaming options for the movie. There is also a profile section for the user to edit their profile
