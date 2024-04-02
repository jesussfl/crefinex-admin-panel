// Import the 'pluginId' from another module
import pluginId from "../../pluginId";

// Define application routes using constants
export const APP_ROUTES = {
  // Define the home route for the plugin
  HOME: `/plugins/${pluginId}`,

  // Define a route for lessons, which includes a dynamic 'sectionId' parameter
  LESSONS: `/plugins/${pluginId}/lessons/:sectionId`,

  // Define a route for exercises, which includes a dynamic 'lessonId' parameter
  EXERCISES: `/plugins/${pluginId}/exercises/:lessonId`,

  // Define a route for sections
  SECTIONS: `/plugins/${pluginId}/sections/:worldId`,

  WORLDS: `/plugins/${pluginId}/worlds`,
};

// Define route paths for specific plugin pages using constants
export const ROUTES = {
  WORLDS: `/plugins/${pluginId}/worlds?page=1&pageSize=10&sort=id:ASC`,

  // Define a route for sections with query parameters for pagination and sorting
  SECTIONS: (id) => `/plugins/${pluginId}/sections/${id}?page=1&pageSize=10&sort=id:ASC`,

  // Define a dynamic route for lessons using a function that takes an 'id' parameter
  LESSON: (id) => `/plugins/${pluginId}/lessons/${id}?page=1&pageSize=10&sort=id:ASC`,

  // Define a dynamic route for exercises using a function that takes an 'id' parameter
  EXERCISE: (id) => `/plugins/${pluginId}/exercises/${id}?page=1&pageSize=10&sort=id:ASC`,
};
