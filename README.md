# Chess Trainer
## Project Overview
The first JavaScript project I worked on during my software engineering immersive at General Assembly. I started with ambitious eyes: having already done an SEI, I figured now would be a good time to really put it to the test by building a game of chess that recorded each move.
However, after a proposal meeting with the instructors, I was advised to scale it back; I was still enamored of the idea of building something having to do with chess. I tend to come and go from the game when I play; the basics are all stuck in but I have a hard time remembering some of the more complex theory. With that in mind, I scaled my proposal back: rather than a full game, I decided to create something that gives the user the chance to see hoow openings are played out.
My minimum viable product was to allow for typical openings and answers for white; functionally that meant the whole application was structured in that MVP around the assumption that the player is going first. After reaching the end that MVP, I decided I had two options: I could implement openings for black and clean up my code for the future, or I could try to learn more about DOM manipulation animations. In the end I decided to go with implementing openings for black and refactoring.
Once I was satisfied with my refactor I set about hand-crafting responsive views for various screen sizes; I did most of this work by hand, checking my work in a window I continued to hard refresh with every change I wanted to observe. I'm more or less satisfied with most of the views that I created; there's some scaling issues with the moves sidebar and the board size on the 1024px size and I decided that scaling it for a 4K window size was needless but the rest are functional and don't have any glaring issues I spotted.
## Wireframe
![Proposal wireframe](/wireframes/wireframe-matchstart.jpg)

This was the wireframe I submitted during my proposal, when I was still intending to build out a full game of chess rather than the project I settled on. Not much changed visually for the final implementation: the reset button was pushed out into a modal and buttons for each opening were added to the right or bottom of the screen depending on the viewport size, but otherwise the basic visual implementation remained the same.
## User Stories (Minimum Viable Product)
1. When a user visits the page, they should see a four-rank chess board without pieces, an empty sidebar with the header "MOVES," and buttons for each available opening.
2. When a user clicks any opening button, the board should reset for that opening.
3. When the board resets for a new opening, the first piece to move should be visuall highlighted.
4. When a user clicks on a highlighted piece, the space that piece should move to should be visually highlighted.
5. When a user clicks on a highlighted space, the highlighted piece should move to the highlighted space.
6. When a user moves a piece, the next piece to move should be visually highlighted.
7. When a user moves a piece, the move should be displayed in the MOVES sidebar in figurine algebraic notation.
8. When a user fully executes an opening, the MOVES sidebar should display a message with the text "End of Opening."
9. When a user clicks any opening button after the first, a confirmation modal should appear with options for canceling and resetting.
10. When a user clicks cancel, the modal should close.
11. When a user clicks reset, the board shoould reset for that opening and the modal should close.
## If I revisit this project...
- I'd like to add buttons to follow lines rather than just static openings; there's a lot of these openings that start with Open Game.
- I'd like to add animations; I didn't end up having time to get them in during the project so I used a timeout function to make the simulated opponent's move seem less instant.