Guarding the Landscape
An interactive web-based story map exploring how land use change shapes training, habitat, and resilience at Camp Atterbury.

About the Project
Camp Atterbury, established in 1942 on 40,000 acres in Johnson, Bartholomew, and Brown Counties, Indiana, has served as a vital training hub for the Indiana National Guard and military personnel from multiple branches. While the installation has preserved large interior blocks of land, the surrounding counties have undergone significant transformation—from rural farmland to suburban sprawl.

This project presents an in-depth analysis of three interconnected themes that define Camp Atterbury's contemporary challenges:

Encroachment Through Incompatible Land Use: How suburban development and infrastructure expansion are pressing against training lands and wildlife habitat
Priority Species: The impacts of habitat loss and fragmentation on federally protected species like the Indiana bat and Northern long-eared bat
Extreme Weather: How intensifying rainfall, wind events, and expanding floodplains interact with land use change to affect military readiness and community resilience
Features
Interactive Story Map: Scroll-based narrative with synchronized visualizations
Timeline Visualizations: Explore historical patterns, current conditions, and future projections
Sticky Maps: Dynamic map displays that update as you scroll through the content
Accordion Sections: Expandable content for detailed information
Responsive Design: Optimized for desktop and mobile viewing
Project Structure
guardingthelandscape/
├── index.html              # Landing page
├── background.html         # Introduction and project overview
├── encroachment.html       # Encroachment analysis page
├── priorityspecies.html    # Priority species habitat analysis
├── extremeweather.html     # Extreme weather impacts analysis
├── style.css              # Main stylesheet
├── background.js          # Background page interactivity
├── encroachment.js        # Encroachment page interactivity
├── priorityspecies.js     # Priority species page interactivity
├── extremeweather.js      # Extreme weather page interactivity
├── images/                # Image assets
└── README.md              # This file
Getting Started
Prerequisites
A modern web browser (Chrome, Firefox, Safari, or Edge)
No additional dependencies or build tools required
Running the Project
Clone this repository:

git clone https://github.com/raeabail/guardingthelandscape.git
cd guardingthelandscape
Open index.html in your web browser, or serve the files using a local web server:

# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server
Navigate through the story:

Start at the landing page
Click "Start" to begin with the Introduction
Use the navigation menu to explore different sections
Technology Stack
HTML5: Semantic markup and structure
CSS3: Custom styling with responsive design
JavaScript (Vanilla): Interactive scroll-based animations and data visualizations
Google Fonts: Roboto font family
Key Sections
Introduction
Provides historical context about Camp Atterbury's establishment and the evolving challenges of balancing military readiness, ecological conservation, and community resilience.

Encroachment
Examines how suburban development, industrial corridors, and infrastructure have transformed the landscape around Camp Atterbury over eight decades, with implications for military operations and wildlife.

Priority Species
Focuses on federally protected bat species and how habitat loss and fragmentation from land use change impacts their survival, with analysis of habitat overlays and conservation opportunities.

Extreme Weather
Explores the intersection of climate change, extreme weather events, and land use change, showing how increased development amplifies flood risks and storm impacts across the region.

Data Sources
The project synthesizes data from multiple sources including:

Historical land use records
Military installation maps
Wildlife habitat surveys
Weather and climate data
County development records
Contributing
This project was developed as part of research on military land use compatibility and environmental conservation. For questions or collaboration opportunities, please reach out through the repository.

License
This project is available for educational and research purposes. Please contact the repository owner for usage permissions.

Acknowledgments
Camp Atterbury Joint Maneuver Training Center
SISL (Sustainable Infrastructure and Sustainable Landscapes)
Indiana National Guard
Conservation partners and researchers
Contact
For more information, visit the GitHub repository.
