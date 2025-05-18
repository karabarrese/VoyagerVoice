# VoyagerVoice

## Inspiration
Our inspiration stemmed from the idea of road trips. Often, when traveling to unfamiliar places with limited information, we thought it would be helpful to have an app that could provide engaging, educational content about the surrounding area. Imagine learning about a place through a podcast while you're exploring it—that’s what led us to create Voyager Voice. It’s an app that generates location-based audio podcasts, offering historical and contextual insights about nearby landmarks.
## What it does
Voyager Voice enhances travel experiences by transforming location-based data into engaging audio content. Using the user's current location, the app retrieves nearby points of interest via the TripAdvisor API, displaying the name and image of the site. It then fetches relevant Wikipedia information and summarizes it using the DeepSeek language model. The summary is transformed into a podcast-style narration with Google Cloud Text-to-Speech, delivering fun facts and historical insights in a storytelling format.
## How we built it
- **Frontend:** Built with **React Native** for cross-platform mobile development  
- **Backend:** Powered by **Python Flask**  
- **TripAdvisor API:** Used to fetch location details (names, photos, etc.)  
- **Prototyping:** Backend components prototyped using **Jupyter Notebooks**  
- **Language Model:** Integrated **DeepSeek LLM** via **Chutes API** to generate summaries  
- **Audio Generation:** Summaries converted into audio using **Google Cloud Text-to-Speech**
## Challenges we ran into
We encountered several challenges, including missing authentication tokens when working with the TripAdvisor API. Integrating Intel Tiber's Jupyter Notebooks with our mobile app’s frontend and backend also proved complex. Additionally, we faced difficulties with the LLM summarization, as it sometimes included speculative or self-referential content, which didn’t align with our goal of factual storytelling.
## Accomplishments that we're proud of
Despite the tight 10-hour hackathon timeline, we successfully built a working prototype that integrates multiple APIs and technologies. We're proud of how much we accomplished in such a short time, especially the seamless combination of location services, AI summarization, and audio narration.
## What we learned
This project reinforced the importance of clear team communication to avoid workflow gaps. We also gained hands-on experience with Intel Tiber and explored the capabilities and limitations of current AI summarization tools.
## What's next for Voyager Voice
Moving forward, we plan to refine the podcast feature to ensure content accuracy and improve the naturalness of the narration. We also aim to expand support for more locations and enhance user customization for a richer travel companion experience.
