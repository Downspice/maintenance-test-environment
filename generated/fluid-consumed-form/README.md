# New Fluid Consumed Form

This project provides a React component for managing fluid consumption records in an equipment management system. The form allows users to input various details related to fluid consumption, including equipment used, date of consumption, hours worked, type of fluid, parts involved, quantity, unit cost, fluid units, cost centre, and additional notes.

## Project Structure

```
fluid-consumed-form
├── src
│   ├── components
│   │   └── NewFluidConsumedForm.tsx
│   ├── schemas
│   │   └── fluidConsumedSchema.ts
│   ├── types
│   │   └── index.ts
│   └── app.tsx
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd fluid-consumed-form
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To run the application, use the following command:
```
npm start
```

This will start the development server and open the application in your default web browser.

## Features

- **Dynamic Form**: The form includes various input types such as comboboxes, date pickers, and number inputs.
- **Validation**: The form utilizes a validation schema to ensure all required fields are filled out correctly.
- **State Management**: The component manages its own state, handling input changes and calculating the total cost based on quantity and unit cost.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.