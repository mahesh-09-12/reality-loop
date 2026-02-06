# **App Name**: RealityLoop

## Core Features:

- Question Analysis: Accept a question as input and pass the question to the Gemini API. Return the initial AI response containing the answer, confidence score, assumptions, and uncertainties to the frontend.
- Uncertainty Display: Display the list of uncertainties, each with its explanation of why it matters.
- Human Correction Input: Accept a short text input from the user indicating how to revise the AI answer.
- Revised Answer Generation: Upon receiving human correction, revise the initial AI response, and generate an updated answer, what changed, and a new confidence score. The LLM tool will use reasoning to decide when or if to incorporate some piece of information in its output.
- Revised Response Display: Display the revised AI response, highlighting what changed and the new confidence score.
- Data Storage: Optionally store the question, initial AI response, human correction, and revised AI response in Firestore for analysis.

## Style Guidelines:

- Primary color: Slate blue (#7395AE) to evoke trust and clarity, while avoiding being overly serious.
- Background color: Light gray (#F0F4F8) to provide a clean, unobtrusive backdrop.
- Accent color: Muted teal (#64B6AC) to draw attention to key interactive elements without overwhelming the user.
- Body and headline font: 'Inter', a sans-serif font for clear and modern readability.
- Use simple, geometric icons from the shadcn/ui library to represent assumptions and uncertainties.
- Divide the page into clear sections using Cards and Separators, as provided by shadcn/ui, to maintain a structured layout.