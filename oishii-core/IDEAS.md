Technical
- Seed endpoint (voor lokaal development)

V1
-----------------------------------------------------------
Currently creating a recipe is possible. This is nice. The option to update a recipe (only available for your own recipes) does not exist yet. This should be implemented too! Keep it the same as the create form, but already prefilled and having thus the option to save the recipe. Also add CreatedAt and UpdatedAt to the UI of the recipe details page.

-------------------------------------------------------------
The tags should play a big role regarding a recipe. I want the tags to be the main thing people can search/filter on. This should also be multi lingual. I want to support a wide range of official tags, like vegan and bulk and idk pasta, rice, etc. The offical tags all have an emoji in their name. The idea I figured out:
- Tags should be multilingual. So that people can more easily search/filter on them;
- Instead of the current Cuisine filter in the my recipes page, this should be filter on tags/items. I dont know a good name for it yet, but the main goal is that tags are the main item to filter on to make it work multi lingual;
- When you want to add a tag that is not an official tag, this is possible, but that won't be translated and won't support an emoji;
- For now I want you to have 5 official tags as some sort of proof of concept. In a later update I will extend this with more tags (hundreds probably.)
- 
- A disclaimer (small) in the create recipe form that explains why tags are important for e.g. searchability multi language etc.

Lets first go into plan mode to discuss how to implement this, because it will be a big update I think.

-------------------------------------------------------------
In my previous prompt I asked you to extend the working of tags and. This is nice in how it works! Now I want you to create all official tags for me that are supported in version one of the app. I defined these categories:
- tags based on main ingredient, like pasta, rice, potato etc;
- tags like vegan, chicken, beef
- tags like soup,
These are just examples. I want you to come up with a big list of tags that makes sense and will cover most cases regarding searchability. 
-------------------------------------------------------------

-------------------------------------------------------------
- Import with AI implementeren <-- dit zit wel achter premium functionaliteit dus je moet dan wel een premium account hebben
DIT MOET IK NOG EVEN GOED ONDERZOEKEN OOK QUA RATE LIMITING EN PLAN ETC.
-------------------------------------------------------------

- Converten tussen units bijv amerikaans en europees wtf is een tablespoon
- Aantal personen aanpassen in de recipe details en dat alles mee aanpast qua waardes

- main image more visible

V1.5
DE AI UPDATE
- Miss zelf je eigen chatgpt model kunnen linken. Dan heb ik minder load. Als free user kan je dat. Premium user mag mijn AI gebruiken.
- AI vertaal knop voor recepten
- Je eigen plaatje/foto kunnen optimaliseren d.m.v. AI zodat het minder grauw is lmz <-- dit zit wel achter premium functionaliteit
- Knop IMPORT RECIPE met options voor AI of scrape oid idk
- Plak gwn een text en dan zet AI het automatisch om naar dit formaat in Create User


V2
- Andere mensen kunnen fotos toevoegen van de keer dat ze het hebben gekookt en de meest recente zijn dan ook te zien bij de details
- Sociaal aspect. Je kan een kookgroep aanmaken met je vrienden en daarin zie je iedere keer dat iemand iets kookt. Je volgt elkaar dan een soortvan. Je kan dan een post maken met een title, description en foto en een optioneel een "review" over hoe het was enzo. Zo kan je elkaar ook nieuwe recepten aanbevelen.
- RANKEN: Op je persoonlijke pagina kun je al jouw recepten ranken. Misschien moet je alles cool kunnen drag-drop ranken. Een tier list bijhouden met je recepten. Zo'n coole S A B etc. zodat je makkelijk op je profiel kan zien hoe en wat. RANKEN kan wel leuk worden!
- Plaatjes bij een ingredient, bijvoorbeeld voor een speciale saus dat je er een plaatje bij kan doen - uiteindelijk ingredienten delen dmv een zoekfunctie zodat plaatjes ook gedeeld kunnen worden.


- PROMPT VOOR 
            I want to extend the ingredients of a recipe. I want somehow to be able to create a ingredient, but also to add a substitute. For example for chicken I can substitute it with something that is vega. I also want to be able to mark ingredients as optional. In the create form they should be by default required.  This should be:
            - Extremely user friendly;
            - In the recipes details page also represented UX friendly and pretty.

            Lets go first into plan mode to resolve any questions.

V3
- Save functionaliteit met een soort mappenstructuur dat je zelf een mapje met recepten kan maken en delen, net als een spotify playlist lmz. Dan kan je bijv zeggen. 10 Zomerse pastas in een groep. Dit noem je een "Collection".
- recepten kunnen iconisch status krijgen in een bepaalde categorie (voor de gein)


Can you implement the home page. This is the / route. Currently it is not implemented yet. It should consist of the following blocks (in column order):
- A nice hero/intro page stating that this is a nice humble cooking app to make your life easier and you can easily share with your friends;
- A block stating that there is AI implemented to make life easier. The AI is actually very handy to e.g. convert a recipe from a web url to the website or convert just any kind of text to a recipe in the format of this app. This will save you a lot of effort by easily mapping the recipe to this website where you can start. You can also enhance your images of the recipe with AI, because normally the lighting etc. is not spot on when you cooked something and it might look a bit underwhelming, the AI can fix the image for you!
- A block with USP's that are 1. the app is multi language 2) all your own recipes in one place and available for other people to get inspired 3: you can easily filter and search for recipes 4: you can make a ranking of your recipes, which is fun
- A about page stating that the app is not finished yet and is still in development 

It should match the vibe of the app and look clean. Also it should have subtle animations and design choices, like the subtle animation in the Logo of the header. I really like that! Also it should make use of the i18n labels.














Please audit and update the UI design of this application with the following goals:

Design Direction:
- Make the design more modern and clean, but NOT minimalist/corporate (avoid Apple-style sterile designs)
- Preserve the application's character and personality ("soul")
- Strike a balance between contemporary polish and warmth/approachability

Specific Tasks:
- Review all UI components (buttons, inputs, cards, navigation, modals, etc.)
- Examine overall layout, spacing, and typography
- Analyze the color scheme and visual hierarchy
- Check for outdated design patterns (heavy borders, old shadows, dated fonts, etc.)
- Update the CLAUDE.md and README.md so that the design decisions etc. are documented somewhere 

What to Improve:
- Typography: Consider modern font choices and better hierarchy
- Spacing: Ensure consistent, generous white space without feeling empty
- Colors: Refine the palette to feel fresh but not overly flat
- Components: Update styling to feel current (subtle shadows, refined borders, smooth interactions)
- Layout: Improve alignment, grouping, and visual flow

What to Preserve:
- Any unique personality or character in the design
- Functional elements that work well
- The overall vibe/tone of the application

Please provide a summary of changes made and the reasoning behind key design decisions.

Lets first go into plan mode to discuss styling decisions.