import axios from 'axios';

// Define the structure for animal information returned by the API
export interface AnimalInfo {
  title: string;
  description: string;
  dangerous: boolean;
  relatedAnimals: string[];
}

export async function fetchAnimalInfo(animalName: string): Promise<AnimalInfo> {
  // Handle case when animal name is unknown
  if (animalName === 'unknown') {
    return {
      title: 'Unknown Animal',
      description: 'No additional information available.',
      dangerous: false,
      relatedAnimals: [],
    };
  }

  try {
    // Make API request to Wikipedia's API
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',          // Specify we want to query the API
        format: 'json',           // Request JSON response format
        titles: animalName,       // The page title to look up
        prop: 'extracts|links',   // Get page content extract and links
        exintro: true,            // Only get the intro section
        explaintext: true,        // Get plain text, not HTML
        pllimit: 10,              // Limit to 10 links
        origin: '*'               // Required for CORS
      },
    });

    // Extract the page data from the response
    const pages = response.data.query.pages;
    const page = Object.values(pages)[0] as any;

    if (page && page.extract) {
      // Check if the animal is dangerous by looking for specific keywords
      const description = page.extract.toLowerCase();
      const isDangerous = /dangerous|venomous|aggressive|deadly|carnivore/.test(description);

      // Process related links to get related animals
      // Filter out special Wikipedia pages (those with ':' in the title)
      const relatedAnimals = page.links
        ? page.links
            .map((link: { title: string }) => link.title)
            .filter((title: string) => !title.includes(':'))
            .slice(0, 10)
        : [];
      
      // Return the formatted animal information
      return {
        title: page.title,
        description: page.extract,
        dangerous: isDangerous,
        relatedAnimals,
      };
    }

    // Return default response if no page extract is found
    return {
      title: animalName,
      description: 'No information found.',
      dangerous: false,
      relatedAnimals: [],
    };
  } catch (error) {
    // Log and re-throw any errors that occur during the API call
    console.error('Error fetching Wikipedia info:', error);
    throw error;
  }
} 