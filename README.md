##### Maya Goldstein

##### Bluewolf Salesforce Developer I Application


# SkyCast: Disrupting Your Weather Experience


### Live Site

*insert links to Heroku front and back end here*

### Summary

This app leverages ![Dark Sky API](https://developer.forecast.io) and ![Google Maps API](https://developers.google.com/maps) to allow users to retrieve current as well as historic data about any location that the users search.

### User Stories: MVP

* Users should be able to enter in any location and retrieve current and useful information about the weather in that area, as well as a future forecast. 
  * Approach: Dark Sky API Forecast Request
    * Format: ```https://api.darksky.net/forecast/[key]/[latitude],[longitude]```
* User should be able to see relevant information to his/her location or searched area (in chart format, using any visualization library) within a reasonable time period. 
* User should be able to track his/her search history (user’s search queries should be stored between browser sessions).

### Technologies

* Frontend
  * JavaScript (AngularJS)
  * CSS Bootstrap
* Backend
  * JWT
  * Ruby on Rails
* Hosting Platform: Heroku

### Design Focus

* Usability
* Best Practice
* Extensibility, readability of code

**Approach:**

* Utilize Bootstrap CSS to enhance the responsiveness of the app and create a familiar, intuitive user experience.

* Utilize symbols and icons to minimize text content and create a clean, minimalist interface.

* Focus on writing clean, DRY code with appropriate formatting and commenting to allow for easy interpretation by other developers (or myself, when revisiting old code).

### Extra Features

* Javascript application frameworks
* Javascript testing suites
* JS resource pre-compilers

### Process

1. Wireframes (link)
1. ![Trello board](https://trello.com/b/GqW5zyFd/skycast-weather-app)
1. Step 1: skeleton content (front and back end)
1. Step 2: basic CSS formatting of skeleton content
1. Step 3: Google Maps and Dark Sky API calls
1. User Authentication (JSON Web Tokens)
1. CRUD model allowing users to store (create), ***favorite (edit),*** and remove (delete) past searched locations
1. Front end design: optimize the user experience
1. JS application frameworks, testing suites, resource pre-compilers (bonus feature) - this is a stretch goal

### Bugs and Unsolved Problems

*to be filled out before submission*


### Resources

Tutorials, documentation, and creative inspiration:

* ![Google Developers Documentation: Google Maps Searchbox](https://developers.google.com/maps/documentation/javascript/examples/places-searchbox)
* ![Tutorial: Building a Weather App with the Dark Sky API](https://webdesign.tutsplus.com/tutorials/building-a-weather-app-with-the-darksky-api--cms-28678)
* ![Dark Sky API Documentation](https://darksky.net/dev/docs)
*
